export interface ExchangeRates {
  [currency: string]: number;
}

// Example exchange rates (these should be updated regularly or fetched from an API)
export const EXCHANGE_RATES: ExchangeRates = {
  USD: 1.35,  // 1 USD = 1.35 CAD
  EUR: 1.47,  // 1 EUR = 1.47 CAD
  GBP: 1.70,  // 1 GBP = 1.70 CAD
  JPY: 0.009, // 1 JPY = 0.009 CAD
  AUD: 0.88,  // 1 AUD = 0.88 CAD
  CAD: 1.00,  // Base currency
};

export function convertToCAD(amount: number, fromCurrency: string): number {
  const rate = EXCHANGE_RATES[fromCurrency];
  if (!rate) {
    console.warn(`No exchange rate found for currency: ${fromCurrency}`);
    return amount; // Return original amount if currency not found
  }
  return amount * rate;
}

export function formatCurrency(amount: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}