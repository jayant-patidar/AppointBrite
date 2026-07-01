/**
 * Stripe client initialization.
 * 🔶 MOCKED — No real Stripe SDK calls. Logs actions to console.
 * TODO: Replace with real Stripe integration.
 */
import { logger } from './logger';

export const stripeMock = {
  charges: {
    create: async (params: { amount: number; currency: string; customerId?: string }) => {
      logger.info(`[MOCK Stripe] Creating charge: $${(params.amount / 100).toFixed(2)} ${params.currency}`);
      return {
        id: `ch_mock_${Date.now()}`,
        amount: params.amount,
        currency: params.currency,
        status: 'succeeded',
      };
    },
  },
  refunds: {
    create: async (params: { chargeId: string; amount?: number }) => {
      logger.info(`[MOCK Stripe] Refunding charge: ${params.chargeId}`);
      return {
        id: `rf_mock_${Date.now()}`,
        chargeId: params.chargeId,
        status: 'succeeded',
      };
    },
  },
};
