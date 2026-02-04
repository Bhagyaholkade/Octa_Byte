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
        <svg className="w-4 h-4 text-slate-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full sm:w-80 group">
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm group-hover:border-slate-300"
          />
          <div className="absolute left-3 top-2.5 w-5 h-5 flex items-center justify-center pointer-events-none">
            <svg
              className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
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
        <div className="tab-switcher">
          <button
            onClick={() => setViewMode('sector')}
            className={`tab-btn text-xs ${viewMode === 'sector' ? 'active' : ''}`}
          >
            By Sector
          </button>
          <button
            onClick={() => setViewMode('flat')}
             className={`tab-btn text-xs ${viewMode === 'flat' ? 'active' : ''}`}
          >
            All Stocks
          </button>
        </div>
      </div>

      {/* Sector View */}
      {viewMode === 'sector' && (
        <div className="space-y-4">
          {sectorGroups.map((sector) => (
            <SectorCard key={sector.sector} sector={sector} />
          ))}
        </div>
      )}

      {/* Flat Table View */}
      {viewMode === 'flat' && (
        <div className="modern-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50/50">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort('particulars')}
                  >
                    <div className="flex items-center gap-1">
                      Particulars
                      <SortIcon field="particulars" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Sector
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Buy Price
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort('investment')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Invested
                      <SortIcon field="investment" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort('portfolioPercentage')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Weight
                      <SortIcon field="portfolioPercentage" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Exch
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    CMP
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort('presentValue')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Value
                      <SortIcon field="presentValue" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort('gainLoss')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      P&L
                      <SortIcon field="gainLoss" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    P/E
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    EPS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {sortedHoldings.map((stock) => {
                  const isProfit = (stock.gainLoss ?? 0) >= 0;
                  return (
                    <tr key={stock.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5 text-sm font-medium text-slate-900">
                        {stock.particulars}
                      </td>
                      <td className="px-4 py-3.5 text-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                          {stock.sector}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 text-right font-medium">
                        {formatCurrency(stock.purchasePrice)}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 text-center font-medium">
                        {stock.quantity}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-900 text-right font-medium">
                        {formatCurrency(stock.investment)}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-500 text-center">
                        {formatNumber(stock.portfolioPercentage, 1)}%
                      </td>
                      <td className="px-4 py-3.5 text-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {stock.exchange}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-indigo-600 text-right">
                        {stock.isLoading ? (
                          <span className="shimmer inline-block w-16 h-5 rounded" />
                        ) : stock.error ? (
                          <span className="text-red-500 text-xs">{stock.error}</span>
                        ) : (
                          formatCurrency(stock.cmp)
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-900 font-medium text-right">
                        {stock.isLoading ? (
                          <span className="shimmer inline-block w-20 h-5 rounded" />
                        ) : (
                          formatCurrency(stock.presentValue)
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                         {stock.isLoading ? (
                          <span className="shimmer inline-block w-20 h-5 rounded" />
                        ) : (
                          <div className={`flex flex-col items-end ${isProfit ? 'text-profit' : 'text-loss'}`}>
                            <span className="text-sm font-semibold">{formatCurrency(stock.gainLoss)}</span>
                            <span className="text-xs font-medium opacity-80">
                              {formatPercentage(stock.gainLossPercentage)}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-500 text-center">
                        {stock.isLoading ? (
                          <span className="shimmer inline-block w-12 h-5 rounded" />
                        ) : (
                          formatNumber(stock.peRatio, 2)
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-500 text-center">
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
        <div className="modern-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-slate-400"
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
          <h3 className="text-lg font-medium text-slate-900">No stocks found</h3>
          <p className="text-slate-500 mt-1">
            No results matching &quot;<span className="font-semibold">{searchTerm}</span>&quot;
          </p>
        </div>
      )}
    </div>
  );
}