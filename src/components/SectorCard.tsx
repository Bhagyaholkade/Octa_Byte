'use client';

import { useState, memo } from 'react';
import { SectorSummary, StockHolding } from '@/types';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/formatters';

interface SectorCardProps {
  sector: SectorSummary;
}

function StockRow({ stock }: { stock: StockHolding }) {
  const isProfit = (stock.gainLoss ?? 0) >= 0;

  return (
    <tr className="table-row-hover border-b border-slate-800/50 last:border-0">
      <td className="px-4 py-4 text-sm font-semibold text-white">
        {stock.particulars}
      </td>
      <td className="px-4 py-4 text-sm text-slate-300">
        {formatCurrency(stock.purchasePrice)}
      </td>
      <td className="px-4 py-4 text-sm text-slate-300 text-center">
        {stock.quantity}
      </td>
      <td className="px-4 py-4 text-sm text-slate-300">
        {formatCurrency(stock.investment)}
      </td>
      <td className="px-4 py-4 text-sm text-slate-400 text-center">
        {formatNumber(stock.portfolioPercentage, 1)}%
      </td>
      <td className="px-4 py-4 text-sm">
        <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs text-purple-300">
          {stock.exchange}
        </span>
      </td>
      <td className="px-4 py-4 text-sm font-bold text-cyan-400">
        {stock.isLoading ? (
          <span className="shimmer inline-block w-16 h-5 rounded" />
        ) : stock.error ? (
          <span className="text-red-400 text-xs">{stock.error}</span>
        ) : (
          formatCurrency(stock.cmp)
        )}
      </td>
      <td className="px-4 py-4 text-sm text-slate-300">
        {stock.isLoading ? (
          <span className="shimmer inline-block w-20 h-5 rounded" />
        ) : (
          formatCurrency(stock.presentValue)
        )}
      </td>
      <td className={`px-4 py-4 text-sm font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
        {stock.isLoading ? (
          <span className="shimmer inline-block w-20 h-5 rounded" />
        ) : (
          <div className="flex flex-col">
            <span className={isProfit ? 'glow-text-subtle' : ''}>{formatCurrency(stock.gainLoss)}</span>
            <span className="text-xs opacity-70">
              {formatPercentage(stock.gainLossPercentage)}
            </span>
          </div>
        )}
      </td>
      <td className="px-4 py-4 text-sm text-slate-400 text-center">
        {stock.isLoading ? (
          <span className="shimmer inline-block w-12 h-5 rounded" />
        ) : (
          formatNumber(stock.peRatio, 2)
        )}
      </td>
      <td className="px-4 py-4 text-sm text-slate-400 text-center">
        {stock.isLoading ? (
          <span className="shimmer inline-block w-12 h-5 rounded" />
        ) : (
          formatCurrency(stock.latestEarnings)
        )}
      </td>
    </tr>
  );
}

export const SectorCard = memo(function SectorCard({ sector }: SectorCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isProfit = (sector.gainLoss ?? 0) >= 0;

  return (
    <div className="neon-card rounded-2xl overflow-hidden mb-5 hover-scale">
      {/* Sector Header */}
      <div
        className={`px-6 py-5 cursor-pointer transition-all relative overflow-hidden ${
          isProfit ? 'sector-header-profit' : 'sector-header-loss'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Background glow */}
        <div className={`absolute inset-0 opacity-30 ${isProfit ? 'bg-gradient-to-r from-green-500/20 via-transparent to-cyan-500/20' : 'bg-gradient-to-r from-red-500/20 via-transparent to-pink-500/20'}`}></div>

        <div className="relative z-10 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Expand Icon */}
            <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isProfit ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Sector Name */}
            <div>
              <h3 className="text-lg font-bold text-white">{sector.sector}</h3>
              <span className={`text-xs font-medium ${isProfit ? 'text-green-400/70' : 'text-red-400/70'}`}>
                {sector.stocks.length} {sector.stocks.length === 1 ? 'holding' : 'holdings'}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Invested</p>
              <p className="font-bold text-white text-lg">{formatCurrency(sector.totalInvestment)}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Current</p>
              <p className="font-bold text-white text-lg">
                {sector.totalPresentValue !== null ? formatCurrency(sector.totalPresentValue) : '—'}
              </p>
            </div>
            <div className="text-right min-w-[140px]">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">P&L</p>
              <p className={`font-bold text-lg ${isProfit ? 'text-green-400 glow-text-subtle' : 'text-red-400'}`}>
                {sector.gainLoss !== null
                  ? `${isProfit ? '+' : ''}${formatCurrency(sector.gainLoss)}`
                  : '—'}
                {sector.gainLossPercentage !== null && (
                  <span className="text-sm ml-2 opacity-70">
                    ({formatPercentage(sector.gainLossPercentage)})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stocks Table */}
      {isExpanded && (
        <div className="overflow-x-auto bg-slate-900/50">
          <table className="w-full">
            <thead className="border-b border-purple-500/20">
              <tr className="bg-slate-900/80">
                <th className="px-4 py-3 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Buy Price
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Invested
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Exch
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  CMP
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">
                  P&L
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-purple-400 uppercase tracking-wider">
                  P/E
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-purple-400 uppercase tracking-wider">
                  EPS
                </th>
              </tr>
            </thead>
            <tbody>
              {sector.stocks.map((stock) => (
                <StockRow key={stock.id} stock={stock} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});
