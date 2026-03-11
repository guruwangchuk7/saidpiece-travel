import { base, mainnet } from 'wagmi/chains';
import {
  Address,
  createPublicClient,
  decodeEventLog,
  erc20Abi,
  formatUnits,
  getAddress,
  http,
  isAddress,
  parseUnits,
} from 'viem';

type SupportedChain = typeof base | typeof mainnet;

export type CryptoPaymentConfig = {
  recipientAddress: Address;
  tokenAddress: Address;
  tokenSymbol: string;
  tokenDecimals: number;
  chainId: number;
  quoteLifetimeMinutes: number;
};

const SUPPORTED_CHAINS: Record<number, SupportedChain> = {
  [mainnet.id]: mainnet,
  [base.id]: base,
};

function readAddress(name: string): Address {
  const value = process.env[name];
  if (!value || !isAddress(value)) {
    throw new Error(`Invalid or missing ${name}.`);
  }

  return getAddress(value);
}

export function getCryptoPaymentConfig(): CryptoPaymentConfig {
  const tokenDecimals = Number(process.env.NEXT_PUBLIC_CRYPTO_TOKEN_DECIMALS || '6');
  const chainId = Number(process.env.NEXT_PUBLIC_CRYPTO_PAYMENT_CHAIN_ID || '8453');
  const quoteLifetimeMinutes = Number(process.env.CRYPTO_PAYMENT_QUOTE_LIFETIME_MINUTES || '30');

  if (!SUPPORTED_CHAINS[chainId]) {
    throw new Error(`Unsupported crypto payment chain: ${chainId}.`);
  }

  if (!Number.isFinite(tokenDecimals) || tokenDecimals < 0) {
    throw new Error('Invalid NEXT_PUBLIC_CRYPTO_TOKEN_DECIMALS.');
  }

  if (!Number.isFinite(quoteLifetimeMinutes) || quoteLifetimeMinutes <= 0) {
    throw new Error('Invalid CRYPTO_PAYMENT_QUOTE_LIFETIME_MINUTES.');
  }

  return {
    recipientAddress: readAddress('NEXT_PUBLIC_CRYPTO_RECIPIENT_ADDRESS'),
    tokenAddress: readAddress('NEXT_PUBLIC_CRYPTO_TOKEN_ADDRESS'),
    tokenSymbol: process.env.NEXT_PUBLIC_CRYPTO_TOKEN_SYMBOL || 'USDC',
    tokenDecimals,
    chainId,
    quoteLifetimeMinutes,
  };
}

export function getExpectedTokenAmount({
  fiatAmount,
  currency,
  tokenSymbol,
  cryptoAmount,
}: {
  fiatAmount: string;
  currency: string;
  tokenSymbol: string;
  cryptoAmount?: string | null;
}) {
  const normalizedFiatAmount = fiatAmount.replace(/,/g, '').trim();
  if (cryptoAmount?.trim()) {
    return cryptoAmount.trim();
  }

  if (currency.toUpperCase() === 'USD' && ['USDC', 'USDT'].includes(tokenSymbol.toUpperCase())) {
    return normalizedFiatAmount;
  }

  throw new Error(
    `Missing cryptoAmount for ${currency}. Stablecoin auto-quoting only supports USD with ${tokenSymbol}.`,
  );
}

export function toTokenBaseUnits(amount: string, decimals: number) {
  return parseUnits(amount, decimals);
}

export function fromTokenBaseUnits(amount: bigint, decimals: number) {
  return formatUnits(amount, decimals);
}

export function getExplorerUrl(chainId: number, txHash: string) {
  if (chainId === base.id) {
    return `https://basescan.org/tx/${txHash}`;
  }

  if (chainId === mainnet.id) {
    return `https://etherscan.io/tx/${txHash}`;
  }

  return null;
}

export function createChainPublicClient(chainId: number) {
  const chain = SUPPORTED_CHAINS[chainId];
  if (!chain) {
    throw new Error(`Unsupported chain id ${chainId}.`);
  }

  return createPublicClient({
    chain,
    transport: http(),
  });
}

export type VerifiedTransfer = {
  from: Address;
  to: Address;
  value: bigint;
};

export async function verifyErc20Transfer({
  chainId,
  txHash,
  expectedTokenAddress,
  expectedRecipient,
}: {
  chainId: number;
  txHash: `0x${string}`;
  expectedTokenAddress: Address;
  expectedRecipient: Address;
}) {
  const client = createChainPublicClient(chainId);
  const receipt = await client.getTransactionReceipt({ hash: txHash });
  const transaction = await client.getTransaction({ hash: txHash });

  const tokenAddress = getAddress(expectedTokenAddress);
  const recipient = getAddress(expectedRecipient);

  const matchingTransfers: VerifiedTransfer[] = [];

  for (const log of receipt.logs) {
    if (getAddress(log.address) !== tokenAddress) {
      continue;
    }

    try {
      const decoded = decodeEventLog({
        abi: erc20Abi,
        data: log.data,
        topics: log.topics,
      });

      if (decoded.eventName !== 'Transfer') {
        continue;
      }

      const from = decoded.args.from ? getAddress(decoded.args.from) : null;
      const to = decoded.args.to ? getAddress(decoded.args.to) : null;
      const value = decoded.args.value ?? BigInt(0);

      if (!from || !to) {
        continue;
      }

      if (to === recipient) {
        matchingTransfers.push({ from, to, value });
      }
    } catch {
      continue;
    }
  }

  return {
    receipt,
    transaction,
    matchingTransfers,
    totalTransferredToRecipient: matchingTransfers.reduce((sum, transfer) => sum + transfer.value, BigInt(0)),
  };
}
