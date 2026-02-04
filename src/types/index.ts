// Stock holding interface representing a single stock in the portfolio
export interface StockHolding {
  id: string;
  particulars: string; // Stock Name
  purchasePrice: number;
  quantity: number;
  investment: number; // Purchase Price × Qty (calculated)
  portfolioPercentage: number; // Proportional weight in the portfolio (calculated)
  exchange: 'NSE' | 'BSE';
  symbol: string; // Stock ticker symbol for API calls
  cmp: number | null; // Current Market Price (fetched from Yahoo Finance)
  presentValue: number | null; // CMP × Qty (calculated)
  gainLoss: number | null; // Present Value – Investment (calculated)
  gainLossPercentage: number | null; // Gain/Loss percentage
  peRatio: number | null; // P/E Ratio (fetched from Google Finance)
  latestEarnings: number | null; // Latest Earnings (fetched from Google Finance)
  sector: string; // Sector for grouping
  isLoading?: boolean;
  error?: string | null;
}

// Sector summary for grouping
export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number | null;
  gainLoss: number | null;
  gainLossPercentage: number | null;
  stocks: StockHolding[];
}

// API response for stock quote
export interface StockQuoteResponse {
  symbol: string;
  cmp: number | null;
  peRatio: number | null;
  latestEarnings: number | null;
  error?: string;
}

// Portfolio state
export interface PortfolioState {
  holdings: StockHolding[];
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
