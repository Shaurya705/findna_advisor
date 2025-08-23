// Shared retirement calculations for consistent results across components

export const DEFAULT_INFLATION_RATE = 0.06; // 6%

export const RETURN_RATES = {
  conservative: 0.06,
  moderate: 0.10,
  aggressive: 0.14,
};

export function computeYearsToRetirement(goalData) {
  const currentAge = parseInt(goalData?.currentAge || 30);
  const retirementAge = parseInt(goalData?.retirementAge || 60);
  return { currentAge, retirementAge, yearsToRetirement: Math.max(0, retirementAge - currentAge) };
}

export function computeFutureCorpusFromExpenses(monthlyExpenses, yearsToRetirement, inflationRate = DEFAULT_INFLATION_RATE) {
  // Rule of thumb: 25 years of annual expenses, adjusted for inflation
  const retirementCorpus = monthlyExpenses * 12 * 25; // base in rupees today
  const futureValue = retirementCorpus * Math.pow(1 + inflationRate, yearsToRetirement);
  return futureValue; // rupees at retirement
}

export function computeMonthlyInvestmentForFutureValue(futureValue, annualReturnRate, years) {
  const monthlyReturn = annualReturnRate / 12;
  const totalMonths = Math.max(1, years * 12);
  // SIP future value formula: FV = P * [((1+r)^n - 1)/r]
  // => P = FV * r / ((1+r)^n - 1)
  const numerator = futureValue * monthlyReturn;
  const denominator = Math.pow(1 + monthlyReturn, totalMonths) - 1;
  if (denominator <= 0) return 0;
  return numerator / denominator; // rupees per month
}

export function computeRetirementProjections(goalData, scenario = 'moderate', inflationRate = DEFAULT_INFLATION_RATE) {
  const { currentAge, retirementAge, yearsToRetirement } = computeYearsToRetirement(goalData);
  const monthlyExpenses = parseInt(goalData?.monthlyExpenses || 50000);
  const returnRate = RETURN_RATES[scenario] ?? RETURN_RATES.moderate;

  const futureValue = computeFutureCorpusFromExpenses(monthlyExpenses, yearsToRetirement, inflationRate);
  const monthlyInvestment = computeMonthlyInvestmentForFutureValue(futureValue, returnRate, yearsToRetirement);

  const data = [];
  let corpusRupees = 0;

  for (let year = 0; year <= yearsToRetirement; year++) {
    if (year > 0) {
      corpusRupees = corpusRupees * (1 + returnRate) + (monthlyInvestment * 12);
    }
    data.push({
      year,
      age: currentAge + year,
      corpusRupees,
      corpusLakhs: Math.round((corpusRupees / 100000) * 10) / 10,
      monthlyInvestment,
      inflationAdjustedExpenses: Math.round(monthlyExpenses * Math.pow(1 + inflationRate, year)),
    });
  }

  return {
    currentAge,
    retirementAge,
    yearsToRetirement,
    monthlyInvestment,
    finalCorpusRupees: corpusRupees,
    futureValue,
    data,
  };
}

export function formatCurrencyINR(value) {
  // value in rupees
  if (value >= 1e7) return `₹${(value / 1e7).toFixed(1)}Cr`;
  if (value >= 1e5) return `₹${(value / 1e5).toFixed(1)}L`;
  if (value >= 1e3) return `₹${(value / 1e3).toFixed(0)}K`;
  return `₹${Math.round(value)}`;
}
