'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieLabelRenderProps,
} from 'recharts';
import { StockHolding } from '@/types';
import { groupBySector } from '@/utils/calculations';
import { formatCurrency, formatIndianNumber } from '@/utils/formatters';

interface PortfolioChartsProps {
  holdings: StockHolding[];
}

// Modern Clean Palette
const COLORS = [
  '#4f46e5', // Indigo 600
  '#10b981', // Emerald 500
  '#f59e0b', // Amber 500
  '#ef4444', // Red 500
  '#ec4899', // Pink 500
  '#8b5cf6', // Violet 500
  '#06b6d4', // Cyan 500
  '#f97316', // Orange 500
  '#6366f1', // Indigo 500
  '#14b8a6', // Teal 500
];

export function PortfolioCharts({ holdings }: PortfolioChartsProps) {
  const sectorData = useMemo(() => {
    const sectors = groupBySector(holdings);
    return sectors.map((sector, index) => ({
      name: sector.sector,
      investment: sector.totalInvestment,
      presentValue: sector.totalPresentValue ?? 0,
      gainLoss: sector.gainLoss ?? 0,
      color: COLORS[index % COLORS.length],
    }));
  }, [holdings]);

  const topHoldings = useMemo(() => {
    return [...holdings]
      .sort((a, b) => b.investment - a.investment)
      .slice(0, 10)
      .map((stock) => ({
        name: stock.particulars,
        investment: stock.investment,
        presentValue: stock.presentValue ?? 0,
        gainLoss: stock.gainLoss ?? 0,
      }));
  }, [holdings]);

  // Top 10 Losers - stocks with worst gain/loss percentage
  const topLosers = useMemo(() => {
    return [...holdings]
      .filter((stock) => stock.gainLossPercentage !== null && stock.gainLossPercentage < 0)
      .sort((a, b) => (a.gainLossPercentage ?? 0) - (b.gainLossPercentage ?? 0))
      .slice(0, 10)
      .map((stock) => ({
        name: stock.particulars,
        lossPercent: Math.abs(stock.gainLossPercentage ?? 0),
        lossAmount: Math.abs(stock.gainLoss ?? 0),
        investment: stock.investment,
        presentValue: stock.presentValue ?? 0,
      }));
  }, [holdings]);

  const renderPieLabel = (props: PieLabelRenderProps) => {
    const { name, percent } = props;
    const displayName = name ?? 'Unknown';
    const displayPercent = percent ?? 0;
    if (displayPercent < 0.05) return '';
    return `${displayName} (${(displayPercent * 100).toFixed(0)}%)`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatTooltipValue = (value: any) => {
    if (value === undefined || value === null) return '—';
    if (typeof value === 'number') {
      return formatCurrency(value);
    }
    return String(value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatLossTooltipValue = (value: any, name?: string) => {
    if (value === undefined || value === null) return '—';
    if (typeof value === 'number') {
      if (name === 'Loss %') {
        return `-${value.toFixed(2)}%`;
      }
      return formatCurrency(value);
    }
    return String(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Sector Allocation Pie Chart */}
      <div className="modern-card p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-6 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <span>Sector Allocation</span>
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                dataKey="investment"
                label={renderPieLabel}
                labelLine={false}
                stroke="#ffffff"
                strokeWidth={2}
                paddingAngle={2}
              >
                {sectorData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={formatTooltipValue}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#1e293b',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
                itemStyle={{ fontSize: '13px' }}
                labelStyle={{ color: '#0f172a', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sector Performance Bar Chart */}
      <div className="modern-card p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-6 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span>Sector Performance</span>
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorData} layout="vertical" barSize={20} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(value) => formatIndianNumber(value)}
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                 formatter={formatTooltipValue}
                 cursor={{ fill: '#f8fafc' }}
                 contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#1e293b',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-sm font-medium text-slate-600 ml-1">{value}</span>}
              />
              <Bar
                dataKey="investment"
                name="Invested"
                fill="#4f46e5"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="presentValue"
                name="Current Value"
                fill="#10b981"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Holdings Bar Chart */}
      <div className="modern-card p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-6 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span>Top 10 Holdings</span>
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topHoldings} layout="vertical" barSize={20} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(value) => formatIndianNumber(value)}
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 10, fill: '#334155' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={formatTooltipValue}
                 cursor={{ fill: '#f8fafc' }}
                 contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#1e293b',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-sm font-medium text-slate-600 ml-1">{value}</span>}
              />
              <Bar
                dataKey="investment"
                name="Invested"
                fill="#4f46e5"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="presentValue"
                name="Current Value"
                fill="#10b981"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 10 Losers Chart */}
      <div className="modern-card p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-6 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-50 text-red-600">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <span>Top Losers</span>
        </h3>
        {topLosers.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topLosers} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `-${value.toFixed(1)}%`}
                  tick={{ fill: '#ef4444', fontSize: 11 }}
                  axisLine={{ stroke: '#fecaca' }}
                  tickLine={false}
                  domain={[0, 'dataMax']}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fontSize: 10, fill: '#334155' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={formatLossTooltipValue}
                   cursor={{ fill: '#fef2f2' }}
                   contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    color: '#1e293b',
                    boxShadow: '0 4px 6px -1px rgb(220 38 38 / 0.1)',
                    padding: '12px'
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-sm font-medium text-slate-600 ml-1">{value}</span>}
                />
                <Bar
                  dataKey="lossPercent"
                  name="Loss %"
                  fill="#ef4444"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-slate-900 font-medium">All stocks in green!</h4>
            <p className="text-slate-500 text-sm mt-1">No losers in your portfolio today.</p>
          </div>
        )}
      </div>
    </div>
  );
}