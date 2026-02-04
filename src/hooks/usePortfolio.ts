'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { StockHolding, StockQuoteResponse, ApiResponse } from '@/types';
import { initializePortfolio } from '@/data/portfolio';
import {
  calculatePresentValue,
  calculateGainLoss,
  calculateGainLossPercentage,
} from '@/utils/calculations';

const REFRESH_INTERVAL = 15000; // 15 seconds

export function usePortfolio() {
  const [holdings, setHoldings] = useState<StockHolding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasFetchedRef = useRef(false);

  // Initialize portfolio on mount
  useEffect(() => {
    const initialData = initializePortfolio();
    setHoldings(initialData);
    setIsLoading(false);
  }, []);

  // Fetch stock data from API
  const fetchStockData = useCallback(async (stocks: StockHolding[]) => {
    if (stocks.length === 0) return;

    const symbols = stocks.map((s) => s.symbol).join(',');

    try {
      const response = await fetch(`/api/stocks?symbols=${encodeURIComponent(symbols)}`);
      const result: ApiResponse<StockQuoteResponse[]> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch stock data');
      }

      // Create a map for quick lookup
      const dataMap = new Map<string, StockQuoteResponse>();
      result.data.forEach((item) => {
        dataMap.set(item.symbol, item);
      });

      // Update holdings with fetched data
      setHoldings((prevHoldings) =>
        prevHoldings.map((stock) => {
          const stockData = dataMap.get(stock.symbol);

          if (!stockData) {
            return { ...stock, isLoading: false, error: 'No data received' };
          }

          if (stockData.error) {
            return { ...stock, isLoading: false, error: stockData.error };
          }

          const cmp = stockData.cmp;
          const presentValue = calculatePresentValue(cmp, stock.quantity);
          const gainLoss = calculateGainLoss(presentValue, stock.investment);
          const gainLossPercentage = calculateGainLossPercentage(
            gainLoss,
            stock.investment
          );

          return {
            ...stock,
            cmp,
            presentValue,
            gainLoss,
            gainLossPercentage,
            peRatio: stockData.peRatio,
            latestEarnings: stockData.latestEarnings,
            isLoading: false,
            error: null,
          };
        })
      );

      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
    }
  }, []);

  // Initial data fetch - only run once when holdings are loaded
  useEffect(() => {
    if (holdings.length > 0 && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchStockData(holdings);
    }
  }, [holdings, fetchStockData]);

  // Set up auto-refresh interval
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval
    intervalRef.current = setInterval(() => {
      if (holdings.length > 0) {
        setIsRefreshing(true);
        fetchStockData(holdings).finally(() => setIsRefreshing(false));
      }
    }, REFRESH_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [holdings, fetchStockData]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    if (holdings.length === 0) return;

    setIsRefreshing(true);
    try {
      await fetchStockData(holdings);
    } finally {
      setIsRefreshing(false);
    }
  }, [holdings, fetchStockData]);

  return {
    holdings,
    isLoading,
    error,
    lastUpdated,
    isRefreshing,
    refresh,
  };
}
