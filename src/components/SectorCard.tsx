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
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
      <td className="px-4 py-3 text-sm font-medium text-slate-800">
        {stock.particulars}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600 text-right">
        {formatCurrency(stock.purchasePrice)}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600 text-center">
        {stock.quantity}
      </td>
      <td className="px-4 py-3 text-sm text-slate-800 text-right font-medium">
        {formatCurrency(stock.investment)}
      </td>
      <td className="px-4 py-3 text-sm text-slate-500 text-center">
        {formatNumber(stock.portfolioPercentage, 1)}%
      </td>
      <td className="px-4 py-3 text-sm">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
          {stock.exchange}
        </span>
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-indigo-600 text-right">
        {stock.isLoading ? (
           <span className="block w-16 h-4 bg-slate-100 rounded animate-pulse ml-auto" />
        ) : stock.error ? (
          <span className="text-red-500 text-xs">{stock.error}</span>
        ) : (
          formatCurrency(stock.cmp)
        )}
      </td>
      <td className="px-4 py-3 text-sm text-slate-800 font-medium text-right">
        {stock.isLoading ? (
          <span className="block w-20 h-4 bg-slate-100 rounded animate-pulse ml-auto" />
        ) : (
          formatCurrency(stock.presentValue)
        )}
      </td>
      <td className="px-4 py-3 text-right">
        {stock.isLoading ? (
           <span className="block w-20 h-4 bg-slate-100 rounded animate-pulse ml-auto" />
        ) : (
          <div className={`flex flex-col items-end ${isProfit ? 'text-profit' : 'text-loss'}`}>
            <span className="text-sm font-semibold">{formatCurrency(stock.gainLoss)}</span>
            <span className="text-xs font-medium opacity-80">
              {formatPercentage(stock.gainLossPercentage)}
            </span>
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-slate-500 text-center">
        {stock.isLoading ? (
           <span className="block w-12 h-4 bg-slate-100 rounded animate-pulse mx-auto" />
        ) : (
          formatNumber(stock.peRatio, 2)
        )}
      </td>
      <td className="px-4 py-3 text-sm text-slate-500 text-center">
        {stock.isLoading ? (
           <span className="block w-12 h-4 bg-slate-100 rounded animate-pulse mx-auto" />
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
    <div className="modern-card overflow-hidden transition-shadow hover:shadow-md">
      {/* Sector Header */}
      <div
        className="px-5 py-4 cursor-pointer bg-white transition-colors hover:bg-slate-50/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {/* Expand Icon */}
            <button className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Sector Name */}
            <div>
              <h3 className="text-base font-bold text-slate-900">{sector.sector}</h3>
              <span className="text-xs font-medium text-slate-500">
                {sector.stocks.length} {sector.stocks.length === 1 ? 'holding' : 'holdings'}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 sm:gap-10">
            <div className="text-right">
              <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-0.5">Invested</p>
              <p className="font-semibold text-slate-900 text-sm sm:text-base">{formatCurrency(sector.totalInvestment)}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-0.5">Current</p>
              <p className="font-semibold text-slate-900 text-sm sm:text-base">
                {sector.totalPresentValue !== null ? formatCurrency(sector.totalPresentValue) : '—'}
              </p>
            </div>
            <div className="text-right min-w-[100px]">
              <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-0.5">P&L</p>
              <div className={`font-semibold text-sm sm:text-base ${isProfit ? 'text-profit' : 'text-loss'}`}>
                {sector.gainLoss !== null
                  ? `${isProfit ? '+' : ''}${formatCurrency(sector.gainLoss)}`
                  : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stocks Table */}
      {isExpanded && (
        <div className="overflow-x-auto border-t border-slate-100 bg-slate-50/30">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="px-4 py-2 text-left font-semibold">Stock</th>
                <th className="px-4 py-2 text-right font-semibold">Buy Price</th>
                <th className="px-4 py-2 text-center font-semibold">Qty</th>
                <th className="px-4 py-2 text-right font-semibold">Invested</th>
                <th className="px-4 py-2 text-center font-semibold">Weight</th>
                <th className="px-4 py-2 text-left font-semibold">Exch</th>
                <th className="px-4 py-2 text-right font-semibold">CMP</th>
                <th className="px-4 py-2 text-right font-semibold">Value</th>
                <th className="px-4 py-2 text-right font-semibold">P&L</th>
                <th className="px-4 py-2 text-center font-semibold">P/E</th>
                <th className="px-4 py-2 text-center font-semibold">EPS</th>
              </tr>
            </thead>
            <tbody className="bg-white">
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