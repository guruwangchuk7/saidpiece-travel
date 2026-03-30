import { createHmac, randomBytes } from 'crypto';

const BINANCE_PAY_API_BASE_URL = 'https://bpay.binanceapi.com';
const BINANCE_PAY_CREATE_ORDER_PATH = '/binancepay/openapi/v3/order';

type BinancePayConfig = {
  apiKey: string;
  secretKey: string;
  webhookUrl?: string;
  returnUrl?: string;
  cancelUrl?: string;
  appBaseUrl?: string;
  subMerchantId?: string;
  supportedPayCurrencies?: string;
  orderExpireMs: number;
};

type CreateBinancePayOrderInput = {
  tripName: string;
  travelerName: string;
  fiatAmount: string;
  fiatCurrency: string;
  buyerEmail?: string | null;
  buyerRegistrationTime?: number;
  orderClientIp?: string;
};

type BinancePayApiResponse = {
  status?: string;
  code?: string;
  errorMessage?: string;
  data?: {
    prepayId?: string;
    checkoutUrl?: string;
    deeplink?: string;
    universalUrl?: string;
    expireTime?: number;
    currency?: string;
    totalFee?: string;
    fiatCurrency?: string;
    fiatAmount?: string;
  };
};

function getEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function getBaseUrl() {
  const appBaseUrl = getEnv('NEXT_PUBLIC_APP_URL') || getEnv('APP_BASE_URL');
  return appBaseUrl?.replace(/\/+$/, '');
}

export function getBinancePayConfig(): BinancePayConfig {
  const apiKey = getEnv('BINANCE_PAY_API_KEY');
  const secretKey = getEnv('BINANCE_PAY_SECRET_KEY');

  if (!apiKey || !secretKey) {
    throw new Error('Binance Pay is not configured. Add BINANCE_PAY_API_KEY and BINANCE_PAY_SECRET_KEY.');
  }

  const configuredExpireMinutes = Number(getEnv('BINANCE_PAY_ORDER_EXPIRE_MINUTES') || '30');
  const safeExpireMinutes = Number.isFinite(configuredExpireMinutes)
    ? Math.min(Math.max(configuredExpireMinutes, 1), 60 * 24 * 15)
    : 30;

  const appBaseUrl = getBaseUrl();

  return {
    apiKey,
    secretKey,
    webhookUrl: getEnv('BINANCE_PAY_WEBHOOK_URL'),
    returnUrl: getEnv('BINANCE_PAY_RETURN_URL') || (appBaseUrl ? `${appBaseUrl}/confirm-pay?binance=success` : undefined),
    cancelUrl: getEnv('BINANCE_PAY_CANCEL_URL') || (appBaseUrl ? `${appBaseUrl}/confirm-pay?binance=cancel` : undefined),
    appBaseUrl,
    subMerchantId: getEnv('BINANCE_PAY_SUB_MERCHANT_ID'),
    supportedPayCurrencies: getEnv('BINANCE_PAY_SUPPORTED_PAY_CURRENCIES'),
    orderExpireMs: safeExpireMinutes * 60_000,
  };
}

function randomNonce(length = 32) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = randomBytes(length);
  let result = '';

  for (let i = 0; i < length; i += 1) {
    result += alphabet[bytes[i] % alphabet.length];
  }

  return result;
}

function signPayload(timestamp: string, nonce: string, body: string, secretKey: string) {
  return createHmac('sha512', secretKey)
    .update(`${timestamp}\n${nonce}\n${body}\n`, 'utf8')
    .digest('hex')
    .toUpperCase();
}

export function verifyBinanceWebhook(timestamp: string, nonce: string, body: string, signature: string) {
    const config = getBinancePayConfig();
    const expected = signPayload(timestamp, nonce, body, config.secretKey);
    return expected === signature;
}

function sanitizeForBinance(value: string, fallback: string, maxLength: number) {
  const sanitized = value
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/["\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (sanitized || fallback).slice(0, maxLength);
}

function normalizeFiatAmount(value: string) {
  const normalized = value.replace(/,/g, '').trim();
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    throw new Error('Binance Pay amount must be a valid positive number.');
  }

  return normalized;
}

function buildMerchantTradeNo(tripName: string) {
  const prefix = sanitizeForBinance(tripName, 'trip', 10).replace(/[^A-Za-z0-9]/g, '').toUpperCase() || 'TRIP';
  const unique = `${Date.now()}${randomBytes(3).toString('hex')}`.replace(/[^A-Za-z0-9]/g, '');
  return `${prefix}${unique}`.slice(0, 32);
}

export async function createBinancePayOrder(input: CreateBinancePayOrderInput) {
  const config = getBinancePayConfig();
  const timestamp = Date.now().toString();
  const nonce = randomNonce();
  const merchantTradeNo = buildMerchantTradeNo(input.tripName);
  const amount = normalizeFiatAmount(input.fiatAmount);
  const fiatCurrency = input.fiatCurrency.trim().toUpperCase();
  const tripName = sanitizeForBinance(input.tripName, 'Bhutan Journey', 120);
  const travelerName = sanitizeForBinance(input.travelerName, 'Traveler', 80);
  const description = sanitizeForBinance(`${tripName} booking for ${travelerName}`, 'Travel booking', 256);
  const goodsName = sanitizeForBinance(tripName, 'Bhutan Journey', 256);
  const goodsDetail = sanitizeForBinance(`Booking for ${travelerName}`, 'Travel booking', 256);

  const payload = {
    env: {
      terminalType: 'WEB',
      ...(input.orderClientIp ? { orderClientIp: input.orderClientIp } : {}),
    },
    ...(config.subMerchantId ? { merchant: { subMerchantId: config.subMerchantId } } : {}),
    merchantTradeNo,
    fiatAmount: Number(amount),
    fiatCurrency,
    description,
    goodsDetails: [
      {
        goodsType: '02',
        goodsCategory: 'Z000',
        referenceGoodsId: merchantTradeNo,
        goodsName,
        goodsDetail,
      },
    ],
    ...(config.returnUrl ? { returnUrl: config.returnUrl } : {}),
    ...(config.cancelUrl ? { cancelUrl: config.cancelUrl } : {}),
    ...(config.webhookUrl ? { webhookUrl: config.webhookUrl } : {}),
    ...(config.supportedPayCurrencies ? { supportPayCurrency: config.supportedPayCurrencies } : {}),
    ...(input.buyerEmail
      ? {
          buyer: {
            buyerEmail: input.buyerEmail,
            ...(input.buyerRegistrationTime ? { buyerRegistrationTime: input.buyerRegistrationTime } : {}),
          },
        }
      : {}),
    orderExpireTime: Date.now() + config.orderExpireMs,
    passThroughInfo: merchantTradeNo,
  };

  const body = JSON.stringify(payload);
  const signature = signPayload(timestamp, nonce, body, config.secretKey);

  const response = await fetch(`${BINANCE_PAY_API_BASE_URL}${BINANCE_PAY_CREATE_ORDER_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'BinancePay-Timestamp': timestamp,
      'BinancePay-Nonce': nonce,
      'BinancePay-Certificate-SN': config.apiKey,
      'BinancePay-Signature': signature,
    },
    body,
    cache: 'no-store',
  });

  const rawText = await response.text();
  let parsed: BinancePayApiResponse | null = null;

  try {
    parsed = rawText ? (JSON.parse(rawText) as BinancePayApiResponse) : null;
  } catch {
    throw new Error(`Binance Pay returned a non-JSON response (${response.status}).`);
  }

  if (!response.ok) {
    const message = parsed?.errorMessage || `Binance Pay request failed with status ${response.status}.`;
    throw new Error(message);
  }

  if (parsed?.status !== 'SUCCESS' || parsed.code !== '000000' || !parsed.data?.checkoutUrl) {
    throw new Error(parsed?.errorMessage || 'Binance Pay did not return a checkout URL.');
  }

  return {
    merchantTradeNo,
    prepayId: parsed.data.prepayId ?? null,
    checkoutUrl: parsed.data.checkoutUrl,
    deeplink: parsed.data.deeplink ?? null,
    universalUrl: parsed.data.universalUrl ?? null,
    expireTime: parsed.data.expireTime ?? null,
    currency: parsed.data.currency ?? null,
    totalFee: parsed.data.totalFee ?? null,
    fiatCurrency: parsed.data.fiatCurrency ?? fiatCurrency,
    fiatAmount: parsed.data.fiatAmount ?? amount,
  };
}
