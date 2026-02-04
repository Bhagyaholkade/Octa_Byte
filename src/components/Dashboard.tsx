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
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
          </div>
          <p className="text-xl text-slate-300 font-medium animate-pulse">Loading your portfolio...</p>
          <p className="text-sm text-slate-500 mt-2">Fetching real-time market data</p>
        </div>
      </div>
    );
  }

  if (error && holdings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
        <div className="neon-card rounded-2xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Unable to Load Portfolio</h2>
          <p className="text-slate-400 mb-8">{error}</p>
          <button
            onClick={refresh}
            className="neon-button px-8 py-3 rounded-xl text-white font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-slate-900/95 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Portfolio Dashboard
                </h1>
                <p className="text-sm text-slate-400">
                  Real-time stock analytics
                </p>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center gap-4">
              {/* Live Badge */}
              <div className="hidden sm:flex items-center gap-3 glass-card px-4 py-2 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full pulse-neon" />
                  <span className="text-green-400 text-sm font-semibold tracking-wide">LIVE</span>
                </div>
                {lastUpdated && (
                  <>
                    <div className="h-4 w-px bg-slate-700" />
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
                className="neon-button px-5 py-2.5 rounded-xl text-white font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-red-300 flex-1">{error}</p>
            <button
              onClick={refresh}
              className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors px-3 py-1 rounded-lg hover:bg-red-500/10"
            >
              Retry
            </button>
          </div>
        )}

        {/* Portfolio Summary */}
        <section className="mb-10">
          <PortfolioSummary
            holdings={holdings}
            lastUpdated={lastUpdated}
            isRefreshing={isRefreshing}
            onRefresh={refresh}
          />
        </section>

        {/* View Tabs */}
        <div className="mb-8 flex items-center gap-2">
          <div className="glass-card rounded-xl p-1.5 flex gap-1">
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Holdings
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'charts'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              </svg>
              Analytics
            </button>
          </div>
        </div>

        {/* Content */}
        <section>
          {activeTab === 'table' ? (
            <PortfolioTable holdings={holdings} />
          ) : (
            <PortfolioCharts holdings={holdings} />
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-800/50 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Built with Next.js • TypeScript • Tailwind CSS
          </p>
          <p className="text-slate-600 text-xs mt-2">
            Data from Yahoo Finance • Auto-refresh every 15 seconds
          </p>
        </footer>
      </main>
    </div>
  );
}
