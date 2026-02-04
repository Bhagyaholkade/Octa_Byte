'use client';

import { useMemo, useState } from 'react';
import { StockHolding } from '@/types';
import { groupBySector } from '@/utils/calculations';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/formatters';
import { SectorCard } from './SectorCard';

interface PortfolioTableProps {
  holdings: StockHolding[];
}

type ViewMode = 'sector' | 'flat';
type SortField = 'particulars' | 'investment' | 'presentValue' | 'gainLoss' | 'gainLossPercentage' | 'portfolioPercentage';
type SortDirection = 'asc' | 'desc';

export function PortfolioTable({ holdings }: PortfolioTableProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('sector');
  const [sortField, setSortField] = useState<SortField>('investment');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter holdings by search term
  const filteredHoldings = useMemo(() => {
    if (!searchTerm) return holdings;
    const term = searchTerm.toLowerCase();
    return holdings.filter(
      (h) =>
        h.particulars.toLowerCase().includes(term) ||
        h.sector.toLowerCase().includes(term) ||
        h.symbol.toLowerCase().includes(term)
    );
  }, [holdings, searchTerm]);

  // Group by sector
  const sectorGroups = useMemo(
    () => groupBySector(filteredHoldings),
    [filteredHoldings]
  );

  // Sort holdings for flat view
  const sortedHoldings = useMemo(() => {
    return [...filteredHoldings].sort((a, b) => {
      let aVal: number | string | null = null;
      let bVal: number | string | null = null;

      switch (sortField) {
        case 'particulars':
          aVal = a.particulars;
          bVal = b.particulars;
          break;
        case 'investment':
          aVal = a.investment;
          bVal = b.investment;
          break;
        case 'presentValue':
          aVal = a.presentValue ?? 0;
          bVal = b.presentValue ?? 0;
          break;
        case 'gainLoss':
          aVal = a.gainLoss ?? 0;
          bVal = b.gainLoss ?? 0;
          break;
        case 'gainLossPercentage':
          aVal = a.gainLossPercentage ?? 0;
          bVal = b.gainLossPercentage ?? 0;
          break;
        case 'portfolioPercentage':
          aVal = a.portfolioPercentage;
          bVal = b.portfolioPercentage;
          break;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [filteredHoldings, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-cyan-400 icon-glow-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-cyan-400 icon-glow-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search stocks, sectors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
          />
          <div className="absolute left-3 top-3 w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 glass-card rounded-xl p-1.5">
          <button
            onClick={() => setViewMode('sector')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'sector'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            By Sector
          </button>
          <button
            onClick={() => setViewMode('flat')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'flat'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            All Stocks
          </button>
        </div>
      </div>

      {/* Sector View */}
      {viewMode === 'sector' && (
        <div>
          {sectorGroups.map((sector) => (
            <SectorCard key={sector.sector} sector={sector} />
          ))}
        </div>
      )}

      {/* Flat Table View */}
      {viewMode === 'flat' && (
        <div className="neon-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-purple-500/20 bg-slate-900/80">
                <tr>
                  <th
                    className="px-4 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider cursor-pointer hover:bg-purple-500/10 transition-colors"
                    onClick={() => handleSort('particulars')}
                  >
                    <div className="flex items-center gap-1">
                      Particulars
                      <SortIcon field="particulars" />
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">
                    Sector
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">
                    Buy Price
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-purple-400 uppercase tracking-wider">
                    Qty
                  </th>
                  <th
                    className="px-4 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider cursor-pointer hover:bg-purple-500/10 transition-colors"
                    onClick={() => handleSort('investment')}
                  >
                    <div className="flex items-center gap-1">
                      Invested
                      <SortIcon field="investment" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-4 text-center text-xs font-bold text-purple-400 uppercase tracking-wider cursor-pointer hover:bg-purple-500/10 transition-colors"
                    onClick={() => handleSort('portfolioPercentage')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Weight
                      <SortIcon field="portfolioPercentage" />
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">
                    Exch
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    CMP
                  </th>
                  <th
                    className="px-4 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider cursor-pointer hover:bg-purple-500/10 transition-colors"
                    onClick={() => handleSort('presentValue')}
                  >
                    <div className="flex items-center gap-1">
                      Value
                      <SortIcon field="presentValue" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider cursor-pointer hover:bg-purple-500/10 transition-colors"
                    onClick={() => handleSort('gainLoss')}
                  >
                    <div className="flex items-center gap-1">
                      P&L
                      <SortIcon field="gainLoss" />
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-purple-400 uppercase tracking-wider">
                    P/E
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-purple-400 uppercase tracking-wider">
                    EPS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 bg-slate-900/50">
                {sortedHoldings.map((stock) => {
                  const isProfit = (stock.gainLoss ?? 0) >= 0;
                  return (
                    <tr key={stock.id} className="table-row-hover transition-colors">
                      <td className="px-4 py-4 text-sm font-semibold text-white">
                        {stock.particulars}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs text-purple-300">
                          {stock.sector}
                        </span>
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
                        <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs text-cyan-300">
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
                      <td
                        className={`px-4 py-4 text-sm font-bold ${
                          isProfit ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredHoldings.length === 0 && (
        <div className="neon-card rounded-2xl p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
            <svg
              className="w-10 h-10 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-lg text-slate-300">No stocks found matching</p>
          <p className="text-purple-400 font-semibold mt-1">&quot;{searchTerm}&quot;</p>
        </div>
      )}
    </div>
  );
}
