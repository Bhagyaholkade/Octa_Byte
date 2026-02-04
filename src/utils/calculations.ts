import { StockHolding, SectorSummary } from '@/types';

// Calculate present value
export function calculatePresentValue(cmp: number | null, quantity: number): number | null {
  if (cmp === null) return null;
  return cmp * quantity;
}

// Calculate gain/loss
export function calculateGainLoss(presentValue: number | null, investment: number): number | null {
  if (presentValue === null) return null;
  return presentValue - investment;
}

// Calculate gain/loss percentage
export function calculateGainLossPercentage(
  gainLoss: number | null,
  investment: number
): number | null {
  if (gainLoss === null || investment === 0) return null;
  return (gainLoss / investment) * 100;
}

// Update portfolio percentages based on total investment
export function updatePortfolioPercentages(holdings: StockHolding[]): StockHolding[] {
  const totalInvestment = holdings.reduce((sum, stock) => sum + stock.investment, 0);

  return holdings.map((stock) => ({
    ...stock,
    portfolioPercentage: totalInvestment > 0 ? (stock.investment / totalInvestment) * 100 : 0,
  }));
}

// Group holdings by sector and calculate summaries
export function groupBySector(holdings: StockHolding[]): SectorSummary[] {
  const sectorMap = new Map<string, StockHolding[]>();

  // Group stocks by sector
  holdings.forEach((stock) => {
    const existing = sectorMap.get(stock.sector) || [];
    sectorMap.set(stock.sector, [...existing, stock]);
  });

  // Calculate summaries for each sector
  const summaries: SectorSummary[] = [];

  sectorMap.forEach((stocks, sector) => {
    const totalInvestment = stocks.reduce((sum, s) => sum + s.investment, 0);

    const presentValues = stocks.map((s) => s.presentValue);
    const hasAllPresentValues = presentValues.every((v) => v !== null);
    const totalPresentValue = hasAllPresentValues
      ? stocks.reduce((sum, s) => sum + (s.presentValue ?? 0), 0)
      : null;

    const gainLoss =
      totalPresentValue !== null ? totalPresentValue - totalInvestment : null;

    const gainLossPercentage =
      gainLoss !== null && totalInvestment > 0
        ? (gainLoss / totalInvestment) * 100
        : null;

    summaries.push({
      sector,
      totalInvestment,
      totalPresentValue,
      gainLoss,
      gainLossPercentage,
      stocks,
    });
  });

  // Sort by total investment (descending)
  return summaries.sort((a, b) => b.totalInvestment - a.totalInvestment);
}

// Calculate portfolio totals
export function calculatePortfolioTotals(holdings: StockHolding[]) {
  const totalInvestment = holdings.reduce((sum, s) => sum + s.investment, 0);

  const presentValues = holdings.map((s) => s.presentValue);
  const hasAllPresentValues = presentValues.every((v) => v !== null);
  const totalPresentValue = hasAllPresentValues
    ? holdings.reduce((sum, s) => sum + (s.presentValue ?? 0), 0)
    : null;

  const totalGainLoss =
    totalPresentValue !== null ? totalPresentValue - totalInvestment : null;

  const totalGainLossPercentage =
    totalGainLoss !== null && totalInvestment > 0
      ? (totalGainLoss / totalInvestment) * 100
      : null;

  return {
    totalInvestment,
    totalPresentValue,
    totalGainLoss,
    totalGainLossPercentage,
    stockCount: holdings.length,
  };
}
