/**
 * Currency formatting utilities.
 */

/**
 * Format a number as currency (e.g., 25.5 → "$25.50").
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
