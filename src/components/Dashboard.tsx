'use client';

import { useState } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { PortfolioSummary } from './PortfolioSummary';
import { PortfolioTable } from './PortfolioTable';
import { PortfolioCharts } from './PortfolioCharts';

type ViewTab = 'table' | 'charts';

export function Dashboard() {
  const { holdings, isLoading, error, lastUpdated, isRefreshing, refresh } =
    usePortfolio();
  const [activeTab, setActiveTab] = useState<ViewTab>('table');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative bg-slate-50">
        <div className="grid-pattern" />
        <div className="text-center z-10">
          <div className="relative w-16 h-16 mx-auto mb-6">
             <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-slate-900 font-medium">Loading Portfolio...</p>
          <p className="text-sm text-slate-500 mt-1">Syncing market data</p>
        </div>
      </div>
    );
  }

  if (error && holdings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative bg-slate-50">
        <div className="grid-pattern" />
        <div className="modern-card p-8 max-w-md text-center relative z-10 bg-white">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Connection Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={refresh}
            className="btn-primary w-full justify-center"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="grid-pattern" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-200">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Portfolio
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Real-time Analytics
                </p>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center gap-3">
              {/* Live Badge */}
              <div className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                <div className="relative flex h-2.5 w-2.5">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </div>
                <span className="text-slate-600 text-xs font-semibold tracking-wide">LIVE</span>
                {lastUpdated && (
                  <>
                    <div className="h-3 w-px bg-slate-200" />
                    <span className="text-slate-400 text-xs">
                      {lastUpdated.toLocaleTimeString('en-IN')}
                    </span>
                  </>
                )}
              </div>

              {/* Refresh Button */}
              <button
                onClick={refresh}
                disabled={isRefreshing}
                className="btn-ghost p-2 sm:px-4 sm:py-2"
                title="Refresh Data"
              >
                <svg
                  className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-indigo-600' : 'text-slate-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline text-sm font-medium ml-2">
                  {isRefreshing ? 'Syncing...' : 'Refresh'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 animate-fade-in">
            <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700 flex-1">{error}</p>
            <button
              onClick={refresh}
              className="text-sm font-medium text-red-600 hover:text-red-700 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Portfolio Summary */}
        <section className="mb-8 animate-fade-in">
          <PortfolioSummary
            holdings={holdings}
            lastUpdated={lastUpdated}
            isRefreshing={isRefreshing}
            onRefresh={refresh}
          />
        </section>

        {/* View Tabs */}
        <div className="mb-6 flex justify-between items-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="tab-switcher">
            <button
              onClick={() => setActiveTab('table')}
              className={`tab-btn flex items-center gap-2 ${activeTab === 'table' ? 'active' : ''}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Holdings
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`tab-btn flex items-center gap-2 ${activeTab === 'charts' ? 'active' : ''}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              </svg>
              Analytics
            </button>
          </div>
          
           {/* Export/Filter Placeholders (Future proofing UI) */}
           <div className="hidden md:flex gap-2">
              {/* Could add export buttons here later */}
           </div>
        </div>

        {/* Content */}
        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {activeTab === 'table' ? (
            <PortfolioTable holdings={holdings} />
          ) : (
            <PortfolioCharts holdings={holdings} />
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-400">
          <p className="text-sm">
            Data provided by Yahoo Finance · Auto-updates every 15s
          </p>
        </footer>
      </main>
    </div>
  );
}