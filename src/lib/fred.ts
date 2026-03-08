export interface FredMetric {
  id: string;
  name: string;
  seriesId: string;
  value: number | null;
  previousValue: number | null;
  unit: string;
  description: string;
  history?: { date: string; value: number }[];
}

export interface ProfileData {
  income_range: string;
  debt_types: Record<string, number>;
  savings_range: string;
  zip_code: string;
  investment_level: string;
}

// Parse range strings to approximate numeric values
function parseRange(range: string): number {
  if (!range) return 0;
  const cleaned = range.replace(/[,$+]/g, "");
  if (cleaned.includes("Under")) {
    const num = parseInt(cleaned.replace(/\D/g, ""));
    return num * 0.7;
  }
  if (cleaned.includes("+")) {
    const num = parseInt(cleaned.replace(/\D/g, ""));
    return num * 1.3;
  }
  const nums = cleaned.match(/\d+/g);
  if (nums && nums.length >= 2) {
    return (parseInt(nums[0]) + parseInt(nums[1])) / 2;
  }
  const single = parseInt(cleaned.replace(/\D/g, ""));
  return isNaN(single) ? 0 : single;
}

function getTotalDebt(debts: Record<string, number>): number {
  return Object.values(debts || {}).reduce((a, b) => a + (b || 0), 0);
}

function getVariableDebt(debts: Record<string, number>): number {
  return (debts?.credit_card || 0);
}

export function calculateImpact(
  metric: FredMetric,
  profile: ProfileData
): { dollarImpact: string; explanation: string } {
  const savings = parseRange(profile.savings_range);
  const variableDebt = getVariableDebt(profile.debt_types);
  const totalDebt = getTotalDebt(profile.debt_types);
  const income = parseRange(profile.income_range);

  switch (metric.seriesId) {
    case "FEDFUNDS": {
      const rate = metric.value || 0;
      const extraCost = variableDebt * (rate / 100);
      return {
        dollarImpact: `+$${Math.round(extraCost).toLocaleString()}/yr`,
        explanation: `At ${rate}% Fed rate, your variable debt costs ~$${Math.round(extraCost).toLocaleString()} more in annual interest.`,
      };
    }
    case "CPIAUCSL": {
      const monthlyChange = metric.value && metric.previousValue
        ? ((metric.value - metric.previousValue) / metric.previousValue) * 100
        : 3;
      const annualRate = monthlyChange * 12;
      const purchasingPowerLoss = savings * (annualRate / 100);
      return {
        dollarImpact: `-$${Math.round(Math.abs(purchasingPowerLoss)).toLocaleString()}/yr`,
        explanation: `At ${annualRate.toFixed(1)}% inflation, your savings lose ~$${Math.round(Math.abs(purchasingPowerLoss)).toLocaleString()} in purchasing power annually.`,
      };
    }
    case "UNRATE": {
      const rate = metric.value || 0;
      const severity = rate > 6 ? "high" : rate > 4.5 ? "moderate" : "low";
      return {
        dollarImpact: severity === "high" ? "⚠️ High Risk" : severity === "moderate" ? "⚡ Watch" : "✅ Stable",
        explanation: `Unemployment at ${rate}% signals ${severity} recession risk for your income stability.`,
      };
    }
    case "DGS10": {
      const yield10y = metric.value || 0;
      const estMortgageRate = yield10y + 1.7;
      const monthlyOn250k = (250000 * (estMortgageRate / 100 / 12)) / (1 - Math.pow(1 + estMortgageRate / 100 / 12, -360));
      return {
        dollarImpact: `~${estMortgageRate.toFixed(1)}% mortgage`,
        explanation: `10-year yield at ${yield10y.toFixed(2)}% suggests ~${estMortgageRate.toFixed(1)}% mortgage rates. Monthly on $250K: $${Math.round(monthlyOn250k).toLocaleString()}.`,
      };
    }
    case "DRCCLACBS": {
      const delinquency = metric.value || 0;
      const severity = delinquency > 3 ? "elevated" : delinquency > 2 ? "moderate" : "low";
      return {
        dollarImpact: severity === "elevated" ? "⚠️ Stressed" : severity === "moderate" ? "⚡ Watchful" : "✅ Normal",
        explanation: `Credit card delinquency at ${delinquency.toFixed(1)}% indicates ${severity} consumer financial stress.`,
      };
    }
    case "CSUSHPINSA": {
      const index = metric.value || 0;
      const prevIndex = metric.previousValue || index;
      const change = prevIndex ? ((index - prevIndex) / prevIndex) * 100 : 0;
      return {
        dollarImpact: `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`,
        explanation: `National home prices ${change >= 0 ? "rose" : "fell"} ${Math.abs(change).toFixed(1)}% — affecting housing affordability in your area.`,
      };
    }
    default:
      return { dollarImpact: "N/A", explanation: "No impact data available." };
  }
}

export const FRED_METRICS = [
  { seriesId: "FEDFUNDS", name: "Federal Funds Rate", unit: "%" },
  { seriesId: "CPIAUCSL", name: "Consumer Price Index", unit: "index" },
  { seriesId: "UNRATE", name: "Unemployment Rate", unit: "%" },
  { seriesId: "DGS10", name: "10-Year Treasury Yield", unit: "%" },
  { seriesId: "DRCCLACBS", name: "Credit Card Delinquency", unit: "%" },
  { seriesId: "CSUSHPINSA", name: "Housing Price Index", unit: "index" },
];
