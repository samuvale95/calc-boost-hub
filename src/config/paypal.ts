export const PAYPAL_CONFIG = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb', // Use sandbox by default
  currency: 'EUR',
  intent: 'capture' as const,
  environment: import.meta.env.VITE_PAYPAL_ENVIRONMENT || 'sandbox' as 'sandbox' | 'production',
};

export const PAYMENT_AMOUNTS = {
  PDF: 10.00,
  SUBSCRIPTION: 10.00,
} as const;

export const PAYMENT_DESCRIPTIONS = {
  PDF: 'Guida PDF - Calc Boost Hub',
  SUBSCRIPTION: 'Abbonamento Annuale - Calc Boost Hub',
} as const;
