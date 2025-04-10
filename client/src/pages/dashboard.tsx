import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { EquityCurveChart } from '@/components/dashboard/EquityCurveChart';
import { DrawdownChart } from '@/components/dashboard/DrawdownChart';
import { CalendarView } from '@/components/dashboard/CalendarView';
import { OpenTrades } from '@/components/dashboard/OpenTrades';
import { ThemeToggle } from '@/components/dashboard/ThemeToggle';
import '@/styles/dashboard.scss';
import { format, parseISO } from 'date-fns';
import { Metrics, Trade, DailyPerformance } from '@shared/schema';

export default function Dashboard() {
  // Fetch metrics data
  const { data: metricsData, isLoading: isLoadingMetrics } = useQuery<Metrics>({
    queryKey: ['/api/metrics'],
  });

  // Fetch equity curve data
  const { data: equityData, isLoading: isLoadingEquity } = useQuery<{ date: string; equity: number }[]>({
    queryKey: ['/api/equity-history'],
  });

  // Fetch drawdown data
  const { data: drawdownData, isLoading: isLoadingDrawdown } = useQuery<{ date: string; drawdown: number }[]>({
    queryKey: ['/api/drawdown-history'],
  });

  // Fetch open trades
  const { data: openTrades, isLoading: isLoadingTrades } = useQuery<Trade[]>({
    queryKey: ['/api/trades/open'],
  });

  // Fetch calendar data
  const { data: calendarData, isLoading: isLoadingCalendar } = useQuery<DailyPerformance[]>({
    queryKey: ['/api/daily-performance'],
  });

  // Mock handlers for demo purposes
  const handleEditTrade = (tradeId: number) => {
    console.log(`Edit trade ${tradeId}`);
  };

  const handleCloseTrade = (tradeId: number) => {
    console.log(`Close trade ${tradeId}`);
  };

  // Format calendar data
  const formattedCalendarData = calendarData?.map(day => ({
    date: new Date(day.date),
    pnl: parseFloat(day.pnl.toString()),
    tradesCount: day.tradesCount
  })) || [];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-neutral-100">
      {/* Header */}
      <header className="bg-black h-[60px] shadow-sm">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <h1 className="text-white text-sm font-medium">Hi, User</h1>
          </div>
          <div className="relative flex-1 max-w-md mx-8">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-neutral-900 rounded text-white pl-8 pr-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-700"
              />
              <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center text-white text-sm font-medium bg-transparent hover:bg-neutral-800 rounded p-1.5">
                <span>Market</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <button className="relative text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="relative">
              <button className="relative text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
              </button>
            </div>
            
            <div className="h-8 w-8 rounded-full bg-neutral-700 flex items-center justify-center text-white text-sm overflow-hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-6 py-3">
        {/* Metric Cards */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {isLoadingMetrics ? (
            // Loading skeleton
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-neutral-800 rounded shadow-sm p-2 animate-pulse">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-1"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))
          ) : metricsData ? (
            <>
              <MetricCard
                title="Total PnL"
                value={parseFloat(metricsData.totalPnl.toString())}
                change={parseFloat(metricsData.pnlChange?.toString() || '0')}
                isPositive={parseFloat(metricsData.totalPnl.toString()) > 0}
                isMonetary={true}
              />
              <MetricCard
                title="Win Rate"
                value={`${parseFloat(metricsData.winRate.toString()).toFixed(1)}%`}
                change={parseFloat(metricsData.winRateChange?.toString() || '0')}
                isPositive={parseFloat(metricsData.winRateChange?.toString() || '0') > 0}
              />
              <MetricCard
                title="Total Trades"
                value={metricsData.totalTrades}
                change={metricsData.tradesChange || 0}
                isPositive={(metricsData.tradesChange || 0) > 0}
              />
              <MetricCard
                title="Avg. Win"
                value={parseFloat(metricsData.avgWin.toString())}
                change={parseFloat(metricsData.avgWinChange?.toString() || '0')}
                isPositive={parseFloat(metricsData.avgWinChange?.toString() || '0') > 0}
                isMonetary={true}
              />
              <MetricCard
                title="Avg. Loss"
                value={parseFloat(metricsData.avgLoss.toString())}
                change={parseFloat(metricsData.avgLossChange?.toString() || '0')}
                isPositive={parseFloat(metricsData.avgLossChange?.toString() || '0') > 0}
                isMonetary={true}
              />
            </>
          ) : (
            <div className="col-span-5 text-center py-3 text-xs">Failed to load metrics data</div>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {isLoadingEquity ? (
            <div className="bg-white dark:bg-neutral-800 rounded shadow-sm p-2 animate-pulse">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ) : equityData ? (
            <EquityCurveChart data={equityData} />
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded shadow-sm p-3 text-center text-xs">
              Failed to load equity data
            </div>
          )}
          
          {isLoadingDrawdown ? (
            <div className="bg-white dark:bg-neutral-800 rounded shadow-sm p-2 animate-pulse">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ) : drawdownData ? (
            <DrawdownChart data={drawdownData} />
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded shadow-sm p-3 text-center text-xs">
              Failed to load drawdown data
            </div>
          )}
        </div>

        {/* Calendar and Open Trades */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {isLoadingCalendar ? (
            <div className="bg-white dark:bg-neutral-800 rounded shadow-sm p-2 animate-pulse lg:col-span-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="grid grid-cols-7 gap-1">
                {Array(35).fill(0).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2">
              <CalendarView monthlyData={formattedCalendarData} />
            </div>
          )}
          
          {isLoadingTrades ? (
            <div className="bg-white dark:bg-neutral-800 rounded shadow-sm p-2 animate-pulse">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="space-y-2">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          ) : openTrades ? (
            <OpenTrades 
              trades={openTrades} 
              onEditTrade={handleEditTrade} 
              onCloseTrade={handleCloseTrade} 
            />
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded shadow-sm p-3 text-center text-xs">
              Failed to load open trades
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
