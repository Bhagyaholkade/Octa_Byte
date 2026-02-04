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

// Neon-inspired colors
const COLORS = [
  '#00d4ff', // cyan
  '#a855f7', // purple
  '#00ff88', // green
  '#f472b6', // pink
  '#6366f1', // indigo
  '#fbbf24', // amber
  '#ef4444', // red
  '#14b8a6', // teal
  '#f97316', // orange
  '#8b5cf6', // violet
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Sector Allocation Pie Chart */}
      <div className="neon-card rounded-2xl p-6 hover-scale">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <span className="text-white">Sector Allocation</span>
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={50}
                dataKey="investment"
                label={renderPieLabel}
                labelLine={false}
                stroke="rgba(15, 23, 42, 0.8)"
                strokeWidth={3}
              >
                {sectorData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={formatTooltipValue}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '16px',
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)',
                }}
                labelStyle={{ color: '#a855f7', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sector Performance Bar Chart */}
      <div className="neon-card rounded-2xl p-6 hover-scale">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-white">Sector Performance</span>
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
              <XAxis
                type="number"
                tickFormatter={(value) => formatIndianNumber(value)}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(139, 92, 246, 0.2)' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fill: '#e2e8f0', fontSize: 11, fontWeight: 500 }}
                axisLine={{ stroke: 'rgba(139, 92, 246, 0.2)' }}
              />
              <Tooltip
                formatter={formatTooltipValue}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '16px',
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)',
                }}
                labelStyle={{ fontWeight: 'bold', color: '#fff' }}
              />
              <Legend
                wrapperStyle={{ color: '#94a3b8' }}
                formatter={(value) => <span style={{ color: '#e2e8f0' }}>{value}</span>}
              />
              <Bar
                dataKey="investment"
                name="Investment"
                fill="#a855f7"
                radius={[0, 6, 6, 0]}
              />
              <Bar
                dataKey="presentValue"
                name="Present Value"
                fill="#10b981"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Holdings Bar Chart */}
      <div className="neon-card rounded-2xl p-6 lg:col-span-2 hover-scale">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-white">Top 10 Holdings by Investment</span>
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topHoldings}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={{ stroke: 'rgba(139, 92, 246, 0.2)' }}
              />
              <YAxis
                tickFormatter={(value) => formatIndianNumber(value)}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(139, 92, 246, 0.2)' }}
              />
              <Tooltip
                formatter={formatTooltipValue}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '16px',
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)',
                }}
                labelStyle={{ fontWeight: 'bold', color: '#fff' }}
              />
              <Legend
                wrapperStyle={{ color: '#94a3b8' }}
                formatter={(value) => <span style={{ color: '#e2e8f0' }}>{value}</span>}
              />
              <Bar
                dataKey="investment"
                name="Investment"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="presentValue"
                name="Present Value"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
