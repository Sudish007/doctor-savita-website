/**
 * Treatment cost estimation utility for Dr. Savita Kumari's clinic.
 * Validates: Requirements 6.1, 6.5, 6.7, 6.8 (Requirement 33.3 - Cost Estimator)
 *
 * Pricing (in ₹):
 *   In-person: Initial consultation 500, Follow-up 300, Monthly kit 400
 *   Online:    Initial consultation 400, Follow-up 200, Monthly kit 400
 */

export interface CostEstimate {
  initialFee: number;
  followUpFee: number;
  monthlyKitFee: number;
  total: number;
  duration: number;
}

type ConsultationType = "in-person" | "online";
type DurationMonths = 1 | 3 | 6;

const PRICING: Record<
  ConsultationType,
  { initialFee: number; followUpFee: number; monthlyKitFee: number }
> = {
  "in-person": {
    initialFee: 300,
    followUpFee: 100,
    monthlyKitFee: 200,
  },
  online: {
    initialFee: 200,
    followUpFee: 100,
    monthlyKitFee: 200,
  },
};

/**
 * Calculates the total estimated treatment cost.
 *
 * Formula: total = initialFee + (duration - 1) × followUpFee + duration × monthlyKitFee
 *
 * @param consultationType - 'in-person' or 'online'
 * @param durationMonths - Treatment duration: 1, 3, or 6 months
 * @returns CostEstimate with itemized fees and total (always a positive integer in ₹)
 */
export function calculateTreatmentCost(
  consultationType: ConsultationType,
  durationMonths: DurationMonths
): CostEstimate {
  const { initialFee, followUpFee, monthlyKitFee } = PRICING[consultationType];

  const total =
    initialFee +
    (durationMonths - 1) * followUpFee +
    durationMonths * monthlyKitFee;

  return {
    initialFee,
    followUpFee,
    monthlyKitFee,
    total,
    duration: durationMonths,
  };
}
