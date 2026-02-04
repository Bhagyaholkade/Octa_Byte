# Technical Document: Portfolio Dashboard

## Overview

This document outlines the key technical challenges faced during the development of the Portfolio Dashboard and the solutions implemented to address them.

---

## 1. API Integration Challenges

### Challenge: No Official Yahoo Finance API
Yahoo Finance does not provide an official public API. This creates uncertainty about data availability and reliability.

### Solution
Used the `yahoo-finance2` npm package, which is a well-maintained unofficial library that:
- Provides TypeScript support
- Handles data parsing and normalization
- Includes error handling for API changes

```typescript
import yahooFinance from 'yahoo-finance2';

const quote = await yahooFinance.quote(symbol);
```

### Challenge: Google Finance Data
Google Finance also lacks a public API for fetching P/E ratio and earnings data.

### Solution
Fortunately, Yahoo Finance provides comprehensive financial data including:
- P/E Ratio (both trailing and forward)
- EPS (Earnings Per Share)
- This eliminates the need for a separate Google Finance integration

---

## 2. Rate Limiting & Performance

### Challenge: Multiple API Requests
Fetching data for 20+ stocks simultaneously can trigger rate limits.

### Solution: Request Throttling & Caching

1. **Server-side Caching**:
```typescript
const cache: Map<string, { data: StockQuoteResponse; timestamp: number }> = new Map();
const CACHE_DURATION = 10000; // 10 seconds

// Check cache before making API call
const cached = cache.get(symbol);
if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
  return cached.data;
}
```

2. **Request Staggering**:
```typescript
// Stagger requests by 100ms to avoid rate limiting
const results = await Promise.all(
  symbolList.map((symbol, index) =>
    new Promise((resolve) => {
      setTimeout(async () => {
        const data = await fetchStockData(symbol);
        resolve(data);
      }, index * 100);
    })
  )
);
```

---

## 3. Real-time Updates

### Challenge: Keeping Data Fresh
Users need current prices without manual refresh.

### Solution: Automatic Polling with setInterval

```typescript
const REFRESH_INTERVAL = 15000; // 15 seconds

useEffect(() => {
  const interval = setInterval(() => {
    fetchStockData(holdings);
  }, REFRESH_INTERVAL);

  return () => clearInterval(interval);
}, [holdings]);
```

### Why Not WebSockets?
- Yahoo Finance doesn't provide WebSocket endpoints
- Polling every 15 seconds is sufficient for investment decisions
- Simpler implementation and maintenance

---

## 4. Data Transformation

### Challenge: Raw API Data to UI Format
API responses need transformation to match the required table schema.

### Solution: Dedicated Calculation Utilities

```typescript
// src/utils/calculations.ts

export function calculatePresentValue(cmp: number | null, quantity: number): number | null {
  if (cmp === null) return null;
  return cmp * quantity;
}

export function calculateGainLoss(presentValue: number | null, investment: number): number | null {
  if (presentValue === null) return null;
  return presentValue - investment;
}

export function calculateGainLossPercentage(
  gainLoss: number | null,
  investment: number
): number | null {
  if (gainLoss === null || investment === 0) return null;
  return (gainLoss / investment) * 100;
}
```

---

## 5. State Management

### Challenge: Complex Portfolio State
Managing loading states, error states, and data for multiple stocks.

### Solution: Custom Hook with Centralized State

```typescript
export function usePortfolio() {
  const [holdings, setHoldings] = useState<StockHolding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ... fetch logic

  return { holdings, isLoading, error, lastUpdated, isRefreshing, refresh };
}
```

Benefits:
- Single source of truth
- Clean separation of concerns
- Easy to test and maintain

---

## 6. Error Handling

### Challenge: Graceful Degradation
API failures shouldn't crash the entire dashboard.

### Solution: Multi-level Error Handling

1. **API Level**: Individual stock errors don't affect others
```typescript
try {
  const quote = await yahooFinance.quote(symbol);
  return { symbol, cmp: quote.regularMarketPrice, ... };
} catch (error) {
  return { symbol, cmp: null, error: error.message };
}
```

2. **Component Level**: Show partial data with error indicators
```typescript
{stock.error ? (
  <span className="text-red-500">{stock.error}</span>
) : (
  formatCurrency(stock.cmp)
)}
```

3. **Dashboard Level**: Non-blocking error banner
```typescript
{error && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <p>{error}</p>
    <button onClick={refresh}>Retry</button>
  </div>
)}
```

---

## 7. Performance Optimization

### Challenge: Prevent Unnecessary Re-renders
Large tables with frequent updates can cause performance issues.

### Solutions:

1. **Memoization with React.memo**:
```typescript
export const SectorCard = memo(function SectorCard({ sector }) {
  // Component implementation
});
```

2. **useMemo for Expensive Calculations**:
```typescript
const sectorGroups = useMemo(
  () => groupBySector(filteredHoldings),
  [filteredHoldings]
);
```

3. **useCallback for Event Handlers**:
```typescript
const refresh = useCallback(async () => {
  await fetchStockData(holdings);
}, [holdings, fetchStockData]);
```

---

## 8. Responsive Design

### Challenge: Complex Table on Mobile
Financial tables have many columns that don't fit on small screens.

### Solution:
- Horizontal scroll for table content
- Collapsible sector groups
- Summary cards that adapt to viewport

```typescript
<div className="overflow-x-auto">
  <table className="w-full">
    {/* Table content */}
  </table>
</div>
```

---

## 9. Security Considerations

### Challenge: API Key Exposure
Sensitive data shouldn't be exposed to the client.

### Solution: Server-side API Calls
All Yahoo Finance calls happen in Next.js API routes:

```
Client -> /api/stocks -> Yahoo Finance
```

Benefits:
- API keys stay on server (if any were required)
- Rate limiting can be controlled server-side
- Response can be sanitized before sending to client

---

## 10. Type Safety

### Challenge: Runtime Errors from API Data
External API data can be unpredictable.

### Solution: Comprehensive TypeScript Interfaces

```typescript
export interface StockHolding {
  id: string;
  particulars: string;
  purchasePrice: number;
  quantity: number;
  cmp: number | null;
  // ... other fields
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
```

---

## Architecture Decisions

### Why Next.js App Router?
- Server components for initial data loading
- API routes for backend functionality
- Built-in optimizations (image, font, code splitting)

### Why Tailwind CSS?
- Rapid UI development
- Consistent design system
- Small bundle size (unused styles are purged)

### Why Recharts?
- React-native chart library
- Good TypeScript support
- Responsive out of the box

---

## Future Improvements

1. **Database Integration**: Store portfolio data in PostgreSQL/MongoDB
2. **User Authentication**: Allow multiple users with personal portfolios
3. **Historical Data**: Show price charts over time
4. **Alerts**: Notify users when stocks hit target prices
5. **Export**: PDF/CSV export of portfolio reports

---

## Conclusion

The Portfolio Dashboard successfully addresses all technical challenges outlined in the case study while maintaining clean, maintainable code. The architecture allows for easy scaling and feature additions in the future.
