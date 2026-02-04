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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Investment */}
        <div className="neon-card rounded-2xl p-6 hover-scale stat-card-blue relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                <svg className="w-7 h-7 text-cyan-400 icon-glow-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-cyan-400/80 uppercase tracking-widest">Invested</span>
            </div>
            <p className="text-4xl font-black text-white mb-2 tracking-tight">
              {formatIndianNumber(totals.totalInvestment)}
            </p>
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
              {totals.stockCount} holdings
            </p>
          </div>
          {/* Decorative glow */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* Current Value */}
        <div className="neon-card rounded-2xl p-6 hover-scale stat-card-purple relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                <svg className="w-7 h-7 text-purple-400 icon-glow-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-purple-400/80 uppercase tracking-widest">Current</span>
            </div>
            <p className="text-4xl font-black text-white mb-2 tracking-tight">
              {totals.totalPresentValue !== null
                ? formatIndianNumber(totals.totalPresentValue)
                : <span className="shimmer inline-block w-36 h-10 rounded-lg"></span>}
            </p>
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              Market value
            </p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* Total P&L */}
        <div className={`neon-card rounded-2xl p-6 hover-scale relative overflow-hidden ${isProfit ? 'stat-card-green' : 'loss-bg'}`}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${isProfit ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                {isProfit ? (
                  <svg className="w-7 h-7 text-green-400 icon-glow-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${isProfit ? 'text-green-400/80' : 'text-red-400/80'}`}>P&L</span>
            </div>
            <p className={`text-4xl font-black mb-2 tracking-tight ${isProfit ? 'gradient-text-green' : 'gradient-text-red'}`}>
              {totals.totalGainLoss !== null
                ? `${isProfit ? '+' : ''}${formatIndianNumber(totals.totalGainLoss)}`
                : <span className="shimmer inline-block w-36 h-10 rounded-lg"></span>}
            </p>
            <p className={`text-sm flex items-center gap-2 ${isProfit ? 'text-green-400/70' : 'text-red-400/70'}`}>
              <span className={`w-2 h-2 rounded-full ${isProfit ? 'bg-green-400' : 'bg-red-400'}`}></span>
              {isProfit ? 'Total profit' : 'Total loss'}
            </p>
          </div>
          <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-2xl ${isProfit ? 'bg-green-500/10' : 'bg-red-500/10'}`}></div>
        </div>

        {/* Returns % */}
        <div className={`neon-card rounded-2xl p-6 hover-scale relative overflow-hidden ${isProfit ? 'stat-card-green' : 'loss-bg'}`}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${isProfit ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                <svg className={`w-7 h-7 ${isProfit ? 'text-green-400 icon-glow-green' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${isProfit ? 'text-green-400/80' : 'text-red-400/80'}`}>Returns</span>
            </div>
            <p className={`text-4xl font-black mb-2 tracking-tight ${isProfit ? 'gradient-text-green' : 'gradient-text-red'}`}>
              {totals.totalGainLossPercentage !== null
                ? formatPercentage(totals.totalGainLossPercentage)
                : <span className="shimmer inline-block w-28 h-10 rounded-lg"></span>}
            </p>
            <p className={`text-sm flex items-center gap-2 ${isProfit ? 'text-green-400/70' : 'text-red-400/70'}`}>
              <span className={`w-2 h-2 rounded-full ${isProfit ? 'bg-green-400' : 'bg-red-400'}`}></span>
              Overall return
            </p>
          </div>
          <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-2xl ${isProfit ? 'bg-green-500/10' : 'bg-red-500/10'}`}></div>
        </div>
      </div>
    </div>
  );
}
