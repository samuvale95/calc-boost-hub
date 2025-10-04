import { ENV } from './env';

export const PAYPAL_CONFIG = {
  clientId: ENV.PAYPAL_CLIENT_ID || 'sb', // Use sandbox by default
  currency: 'EUR',
  intent: 'capture' as const,
  environment: (ENV.PAYPAL_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production',
};

export const PAYMENT_AMOUNTS = {
  PDF: ENV.PAYMENT_AMOUNT_PDF ? parseFloat(ENV.PAYMENT_AMOUNT_PDF) : 10.00,
  SUBSCRIPTION: ENV.PAYMENT_AMOUNT_SUBSCRIPTION ? parseFloat(ENV.PAYMENT_AMOUNT_SUBSCRIPTION) : 10.00,
} as const;


export const PAYMENT_DESCRIPTIONS = {
  PDF: 'Guida PDF - D-DAND',
  SUBSCRIPTION: 'Abbonamento Annuale - D-DAND',
} as const;
