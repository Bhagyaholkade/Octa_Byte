import { NextRequest, NextResponse } from 'next/server';
import { StockQuoteResponse, ApiResponse } from '@/types';
import YahooFinance from 'yahoo-finance2';

// In-memory cache for stock data
const cache: Map<string, { data: StockQuoteResponse; timestamp: number }> = new Map();
const CACHE_DURATION = 10000; // 10 seconds cache

// Create Yahoo Finance instance (v3 API)
const yahooFinance = new YahooFinance();

// Yahoo Finance quote response interface
interface YahooQuote {
  regularMarketPrice?: number;
  trailingPE?: number;
  forwardPE?: number;
  epsTrailingTwelveMonths?: number;
}

async function fetchStockData(symbol: string): Promise<StockQuoteResponse> {
  try {
    // Check cache first
    const cached = cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    // Fetch quote from Yahoo Finance
    const quote = await yahooFinance.quote(symbol) as YahooQuote | null | undefined;

    // Handle case where quote is null or undefined
    if (!quote) {
      return {
        symbol,
        cmp: null,
        peRatio: null,
        latestEarnings: null,
        error: 'No data available for this symbol',
      };
    }

    const stockData: StockQuoteResponse = {
      symbol,
      cmp: quote.regularMarketPrice ?? null,
      peRatio: quote.trailingPE ?? quote.forwardPE ?? null,
      latestEarnings: quote.epsTrailingTwelveMonths ?? null,
    };

    // Cache the result
    cache.set(symbol, { data: stockData, timestamp: Date.now() });

    return stockData;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return {
      symbol,
      cmp: null,
      peRatio: null,
      latestEarnings: null,
      error: error instanceof Error ? error.message : 'Failed to fetch stock data',
    };
  }
}

// GET handler - fetch single or multiple stocks
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbols = searchParams.get('symbols');

    if (!symbols) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'No symbols provided',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const symbolList = symbols.split(',').map((s) => s.trim());

    // Fetch all stocks in parallel with rate limiting
    const results = await Promise.all(
      symbolList.map((symbol, index) =>
        new Promise<StockQuoteResponse>((resolve) => {
          // Stagger requests by 100ms to avoid rate limiting
          setTimeout(async () => {
            const data = await fetchStockData(symbol);
            resolve(data);
          }, index * 100);
        })
      )
    );

    return NextResponse.json<ApiResponse<StockQuoteResponse[]>>({
      success: true,
      data: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST handler - refresh specific stocks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbols } = body as { symbols: string[] };

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Invalid request body. Expected { symbols: string[] }',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Clear cache for requested symbols to force refresh
    symbols.forEach((symbol) => cache.delete(symbol));

    // Fetch fresh data
    const results = await Promise.all(
      symbols.map((symbol, index) =>
        new Promise<StockQuoteResponse>((resolve) => {
          setTimeout(async () => {
            const data = await fetchStockData(symbol);
            resolve(data);
          }, index * 100);
        })
      )
    );

    return NextResponse.json<ApiResponse<StockQuoteResponse[]>>({
      success: true,
      data: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
