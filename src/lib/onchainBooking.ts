import { Address, Hex, decodeEventLog, getAddress, isAddress, keccak256, stringToHex } from 'viem';
import { getCryptoPaymentConfig, createChainPublicClient } from '@/lib/cryptoPayments';

export const bookingManagerAbi = [
  {
    type: 'function',
    name: 'payBooking',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'bookingId', type: 'bytes32' },
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'event',
    name: 'PaymentDeposited',
    inputs: [
      { indexed: true, name: 'bookingId', type: 'bytes32' },
      { indexed: true, name: 'payer', type: 'address' },
      { indexed: false, name: 'token', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
    ],
    anonymous: false,
  },
] as const;

export type OnchainBookingConfig = {
  bookingManagerAddress: Address;
  chainId: number;
  tokenAddress: Address;
};

export function isOnchainBookingConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_BOOKING_MANAGER_ADDRESS);
}

export function getOnchainBookingConfig(): OnchainBookingConfig {
  const cryptoConfig = getCryptoPaymentConfig();
  const rawAddress = process.env.NEXT_PUBLIC_BOOKING_MANAGER_ADDRESS;

  if (!rawAddress || !isAddress(rawAddress)) {
    throw new Error('Invalid or missing NEXT_PUBLIC_BOOKING_MANAGER_ADDRESS.');
  }

  return {
    bookingManagerAddress: getAddress(rawAddress),
    chainId: cryptoConfig.chainId,
    tokenAddress: cryptoConfig.tokenAddress,
  };
}

export function toBookingId(intentId: string): Hex {
  return keccak256(stringToHex(intentId));
}

export async function verifyBookingPaymentEvent({
  chainId,
  txHash,
  expectedBookingId,
  expectedPayer,
  expectedToken,
  minimumAmount,
  bookingManagerAddress,
}: {
  chainId: number;
  txHash: `0x${string}`;
  expectedBookingId: Hex;
  expectedPayer: Address;
  expectedToken: Address;
  minimumAmount: bigint;
  bookingManagerAddress: Address;
}) {
  const client = createChainPublicClient(chainId);
  const receipt = await client.getTransactionReceipt({ hash: txHash });

  if (receipt.status !== 'success') {
    return { ok: false as const, reason: 'failed_receipt' };
  }

  const manager = getAddress(bookingManagerAddress);
  const payer = getAddress(expectedPayer);
  const token = getAddress(expectedToken);

  // 1. Check Confirmation Depth (Prevent re-org fraud)
  const confirmationDepth = Number(process.env.BLOCKCHAIN_INDEXER_CONFIRMATION_DEPTH || '2');
  const latestBlock = await client.getBlockNumber();
  const txBlock = receipt.blockNumber;

  if (latestBlock - txBlock < BigInt(confirmationDepth)) {
    return { ok: false as const, reason: 'insufficient_confirmations' };
  }

  for (const log of receipt.logs) {
    if (getAddress(log.address) !== manager) {
      continue;
    }

    try {
      const decoded = decodeEventLog({
        abi: bookingManagerAbi,
        topics: log.topics,
        data: log.data,
      });

      if (decoded.eventName !== 'PaymentDeposited') {
        continue;
      }

      const bookingId = decoded.args.bookingId;
      const eventPayer = decoded.args.payer ? getAddress(decoded.args.payer) : null;
      const eventToken = decoded.args.token ? getAddress(decoded.args.token) : null;
      const eventAmount = decoded.args.amount ?? BigInt(0);

      if (!bookingId || !eventPayer || !eventToken) {
        continue;
      }

      if (bookingId !== expectedBookingId) {
        continue;
      }

      if (eventPayer !== payer) {
        continue;
      }

      if (eventToken !== token) {
        return { ok: false as const, reason: 'wrong_token' };
      }

      if (eventAmount < minimumAmount) {
        return { ok: false as const, reason: 'underpayment', amount: eventAmount };
      }

      return {
        ok: true as const,
        amount: eventAmount,
      };
    } catch {
      continue;
    }
  }

  return { ok: false as const, reason: 'event_not_found' };
}
