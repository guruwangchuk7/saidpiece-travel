import { useState, useEffect } from 'react';
import { useAccount, useChainId, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { Address } from 'viem';
import { bookingManagerAbi } from '@/lib/onchainBooking';

const cryptoTokenSymbol = process.env.NEXT_PUBLIC_CRYPTO_TOKEN_SYMBOL || 'USDC';
const fallbackPaymentChainId = Number(process.env.NEXT_PUBLIC_CRYPTO_PAYMENT_CHAIN_ID || '8453');

export type ContractCallConfig = {
    chainId: number;
    bookingManagerAddress: Address;
    bookingId: string;
    tokenAddress: Address;
    amountBaseUnits: string;
};

interface UseCryptoPaymentProps {
    user: any;
    session: any;
    tripName: string;
    travelerName: string;
    normalizedFiatAmount: string;
    currency: string;
    cryptoAmountFromUrl: string | null;
    paymentMethod: string;
    onSuccess: (txHash: string) => void;
}

export function useCryptoPayment({
    user,
    session,
    tripName,
    travelerName,
    normalizedFiatAmount,
    currency,
    cryptoAmountFromUrl,
    paymentMethod,
    onSuccess
}: UseCryptoPaymentProps) {
    const { isConnected, address } = useAccount();
    const chainId = useChainId();
    const { switchChainAsync, isPending: isSwitchingChain } = useSwitchChain();
    const { writeContractAsync, isPending: isSendingCrypto } = useWriteContract();

    const [cryptoError, setCryptoError] = useState<string | null>(null);
    const [cryptoIntentId, setCryptoIntentId] = useState<string | null>(null);
    const [quotedCryptoAmount, setQuotedCryptoAmount] = useState<string | null>(null);
    const [quoteExpiresAt, setQuoteExpiresAt] = useState<string | null>(null);
    const [contractCall, setContractCall] = useState<ContractCallConfig | null>(null);
    const [isPreparingCrypto, setIsPreparingCrypto] = useState(false);
    const [intentRequestKey, setIntentRequestKey] = useState<string | null>(null);
    const [pendingCryptoHash, setPendingCryptoHash] = useState<`0x${string}` | undefined>();

    const { isLoading: isConfirmingCrypto } = useWaitForTransactionReceipt({
        hash: pendingCryptoHash,
        query: {
            enabled: Boolean(pendingCryptoHash),
        },
    });

    const cryptoAmount =
        quotedCryptoAmount ||
        cryptoAmountFromUrl ||
        (currency.toUpperCase() === 'USD' && ['USDC', 'USDT'].includes(cryptoTokenSymbol.toUpperCase())
            ? normalizedFiatAmount
            : null);
    
    const cryptoAmountValue = cryptoAmount == null ? null : String(cryptoAmount).trim();
    const activePaymentChainId = contractCall?.chainId || fallbackPaymentChainId;
    const isCorrectCryptoChain = chainId === activePaymentChainId;
    const canSubmitCryptoPayment = isConnected && Boolean(contractCall) && Boolean(cryptoAmountValue) && Boolean(cryptoIntentId);
    const isCryptoBusy = isPreparingCrypto || isSwitchingChain || isSendingCrypto || isConfirmingCrypto;

    // 1. Prepare Intent
    useEffect(() => {
        if (paymentMethod !== 'crypto' || !user || !session?.access_token) {
            return;
        }

        const requestKey = [tripName, travelerName, normalizedFiatAmount, currency, cryptoAmountFromUrl || ''].join('|');
        if (intentRequestKey === requestKey && cryptoIntentId) {
            return;
        }

        let active = true;
        setIsPreparingCrypto(true);
        setCryptoError(null);
        setIntentRequestKey(requestKey);

        fetch('/api/crypto-payment-intents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
                tripName,
                travelerName,
                fiatAmount: normalizedFiatAmount,
                currency,
                cryptoAmount: cryptoAmountFromUrl,
            }),
        })
            .then(async (response) => {
                const payload = await response.json();
                if (!response.ok || !payload.ok) {
                    throw new Error(payload.error || 'Failed to prepare crypto payment.');
                }
                return payload;
            })
            .then((result) => {
                if (!active) return;

                const intent = result.intent;
                setCryptoIntentId(intent.id);
                setQuotedCryptoAmount(intent.expected_token_amount);
                setQuoteExpiresAt(intent.quote_expires_at);
                setContractCall(result.contractCall || null);
            })
            .catch((error) => {
                if (!active) return;
                const message = error instanceof Error ? error.message : 'Failed to prepare crypto payment.';
                setCryptoError(message);
                setIntentRequestKey(null);
            })
            .finally(() => {
                if (active) setIsPreparingCrypto(false);
            });

        return () => { active = false; };
    }, [paymentMethod, user, session?.access_token, tripName, travelerName, normalizedFiatAmount, currency, cryptoAmountFromUrl, cryptoIntentId, intentRequestKey]);

    // 2. Verification logic
    useEffect(() => {
        if (!pendingCryptoHash || isConfirmingCrypto || !cryptoIntentId || !address || !session?.access_token) {
            return;
        }

        let active = true;

        fetch('/api/crypto-payment-intents/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
                intentId: cryptoIntentId,
                txHash: pendingCryptoHash,
                senderAddress: address,
            }),
        })
            .then(async (response) => {
                const payload = await response.json();
                if (!response.ok || !payload.ok) {
                    throw new Error(payload.error || 'Failed to verify crypto payment.');
                }
                return payload.payment;
            })
            .then((payment) => {
                if (!active) return;
                onSuccess(payment.txHash);
            })
            .catch((error) => {
                if (!active) return;
                const message = error instanceof Error ? error.message : 'Failed to verify crypto payment.';
                setCryptoError(message);
            });

        return () => { active = false; };
    }, [pendingCryptoHash, isConfirmingCrypto, cryptoIntentId, address, session?.access_token]);

    const handleCryptoPayment = async () => {
        if (!isConnected) {
            alert('Please connect your wallet to pay with crypto.');
            return;
        }

        if (!contractCall) {
            setCryptoError('Onchain booking contract is not configured yet. Please contact support.');
            return;
        }

        if (!cryptoAmountValue) {
            setCryptoError(`Missing crypto amount. Add a cryptoAmount query param, or use USD with ${cryptoTokenSymbol}.`);
            return;
        }

        if (!cryptoIntentId) {
            setCryptoError('Your crypto payment quote is still being prepared. Please wait a moment and try again.');
            return;
        }

        setCryptoError(null);

        try {
            if (!isCorrectCryptoChain) {
                await switchChainAsync({ chainId: activePaymentChainId });
            }

            const hash = await writeContractAsync({
                address: contractCall.bookingManagerAddress,
                abi: bookingManagerAbi,
                functionName: 'payBooking',
                args: [contractCall.bookingId as `0x${string}`, contractCall.tokenAddress, BigInt(contractCall.amountBaseUnits)],
            });

            setPendingCryptoHash(hash);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'The crypto transaction could not be completed.';
            setCryptoError(message);
        }
    };

    return {
        isConnected,
        address,
        chainId,
        cryptoError,
        cryptoIntentId,
        quotedCryptoAmount,
        quoteExpiresAt,
        contractCall,
        isPreparingCrypto,
        isSendingCrypto,
        isConfirmingCrypto,
        isSwitchingChain,
        pendingCryptoHash,
        cryptoAmountValue,
        activePaymentChainId,
        isCorrectCryptoChain,
        canSubmitCryptoPayment,
        isCryptoBusy,
        handleCryptoPayment,
        cryptoTokenSymbol
    };
}
