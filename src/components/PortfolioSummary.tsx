'use client';

import { useMemo } from 'react';
import { StockHolding } from '@/types';
import { calculatePortfolioTotals } from '@/utils/calculations';
import { formatPercentage, formatIndianNumber } from '@/utils/formatters';

interface PortfolioSummaryProps {
  holdings: StockHolding[];
  lastUpdated: Date | null;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function PortfolioSummary({
  holdings,
}: PortfolioSummaryProps) {
  const totals = useMemo(() => calculatePortfolioTotals(holdings), [holdings]);
  const isProfit = (totals.totalGainLoss ?? 0) >= 0;

  return (
    <div className="mb-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Investment */}
        <div className="modern-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-500">Invested</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatIndianNumber(totals.totalInvestment)}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {totals.stockCount} holdings
            </p>
          </div>
        </div>

        {/* Current Value */}
        <div className="modern-card p-5">
          <div className="flex items-center gap-3 mb-3">
             <div className="p-2 bg-violet-50 rounded-lg text-violet-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-500">Current Value</span>
          </div>
          <div>
             <p className="text-2xl font-bold text-slate-900 tracking-tight">
              {totals.totalPresentValue !== null ? (
                formatIndianNumber(totals.totalPresentValue)
              ) : (
                <span className="inline-block w-24 h-8 bg-slate-100 rounded animate-pulse"></span>
              )}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Market Value
            </p>
          </div>
        </div>

        {/* Total P&L */}
        <div className="modern-card p-5">
           <div className="flex items-center gap-3 mb-3">
             <div className={`p-2 rounded-lg ${isProfit ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {isProfit ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium text-slate-500">Total P&L</span>
          </div>
          <div>
            <p className={`text-2xl font-bold tracking-tight ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
               {totals.totalGainLoss !== null ? (
                `${isProfit ? '+' : ''}${formatIndianNumber(totals.totalGainLoss)}`
              ) : (
                 <span className="inline-block w-24 h-8 bg-slate-100 rounded animate-pulse"></span>
              )}
            </p>
             <p className={`text-xs mt-1 font-medium ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
              {isProfit ? 'Total profit' : 'Total loss'}
            </p>
          </div>
        </div>

        {/* Returns % */}
         <div className="modern-card p-5">
           <div className="flex items-center gap-3 mb-3">
             <div className={`p-2 rounded-lg ${isProfit ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-500">Returns</span>
          </div>
          <div>
             <p className={`text-2xl font-bold tracking-tight ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
              {totals.totalGainLossPercentage !== null ? (
                formatPercentage(totals.totalGainLossPercentage)
              ) : (
                 <span className="inline-block w-20 h-8 bg-slate-100 rounded animate-pulse"></span>
              )}
            </p>
            <p className={`text-xs mt-1 font-medium ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
              Overall return
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}