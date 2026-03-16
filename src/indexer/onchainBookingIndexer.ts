import { createSupabaseAdminClient } from '@/lib/supabaseAdmin';
import { createChainPublicClient } from '@/lib/cryptoPayments';
import { bookingManagerAbi, getOnchainBookingConfig } from '@/lib/onchainBooking';

const MAX_BLOCK_RANGE = Number(process.env.BLOCKCHAIN_INDEXER_BLOCK_RANGE || '2000');
const CONFIRMATION_DEPTH = Number(process.env.BLOCKCHAIN_INDEXER_CONFIRMATION_DEPTH || '2');
const POLL_INTERVAL_MS = Number(process.env.BLOCKCHAIN_INDEXER_POLL_INTERVAL_MS || '15000');

type BookingEventName = 'BookingCreated' | 'PaymentDeposited' | 'BookingConfirmed' | 'RefundIssued';

function toStatus(eventName: BookingEventName) {
  switch (eventName) {
    case 'BookingCreated':
      return 'created';
    case 'PaymentDeposited':
      return 'deposited';
    case 'BookingConfirmed':
      return 'confirmed';
    case 'RefundIssued':
      return 'refunded';
  }
}

async function tick() {
  const supabase = createSupabaseAdminClient();
  const config = getOnchainBookingConfig();
  const client = createChainPublicClient(config.chainId);
  const latest = await client.getBlockNumber();
  const safeHead = latest > BigInt(CONFIRMATION_DEPTH) ? latest - BigInt(CONFIRMATION_DEPTH) : BigInt(0);

  const { data: checkpoint } = await supabase
    .from('blockchain_indexer_checkpoints')
    .select('*')
    .eq('chain_id', config.chainId)
    .maybeSingle();

  const fromBlock = checkpoint ? BigInt(checkpoint.last_scanned_block) + BigInt(1) : safeHead;
  if (fromBlock > safeHead) {
    return;
  }

  const toBlock = fromBlock + BigInt(MAX_BLOCK_RANGE) > safeHead ? safeHead : fromBlock + BigInt(MAX_BLOCK_RANGE);

  const events = await client.getContractEvents({
    address: config.bookingManagerAddress,
    abi: bookingManagerAbi,
    fromBlock,
    toBlock,
  });

  for (const event of events) {
    const eventName = event.eventName as BookingEventName;
    if (!['PaymentDeposited'].includes(eventName)) {
      continue;
    }

    const bookingId = String(event.args.bookingId || '').toLowerCase();
    const payer = String(event.args.payer || '').toLowerCase();
    const token = String(event.args.token || '').toLowerCase();
    const amount = String(event.args.amount || '0');

    await supabase.from('blockchain_bookings').upsert(
      {
        booking_id: bookingId,
        payer_address: payer,
        token_address: token,
        deposited_amount_base_units: amount,
        chain_id: config.chainId,
        booking_manager_address: config.bookingManagerAddress,
        tx_hash: event.transactionHash || null,
        block_number: event.blockNumber ? Number(event.blockNumber) : null,
        event_log_index: event.logIndex ?? null,
        status: toStatus(eventName),
        last_event_name: eventName,
        confirmed_at: eventName === 'BookingConfirmed' ? new Date().toISOString() : null,
        refunded_at: eventName === 'RefundIssued' ? new Date().toISOString() : null,
      },
      { onConflict: 'booking_id' },
    );
  }

  await supabase.from('blockchain_indexer_checkpoints').upsert(
    {
      chain_id: config.chainId,
      contract_address: config.bookingManagerAddress,
      last_scanned_block: Number(toBlock),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'chain_id' },
  );
}

async function start() {
  while (true) {
    try {
      await tick();
    } catch (error) {
      console.error('Indexer tick failed', error);
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
}

start().catch((error) => {
  console.error('Indexer exited', error);
  process.exit(1);
});
