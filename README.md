# Portfolio Dashboard

A dynamic portfolio dashboard built with Next.js, TypeScript, and Tailwind CSS that displays real-time stock data fetched from Yahoo Finance.

## Features

- **Real-time Stock Prices**: Fetches current market prices (CMP) from Yahoo Finance
- **P/E Ratio & Earnings Data**: Displays P/E ratios and EPS data
- **Auto-refresh**: Prices update automatically every 15 seconds
- **Sector Grouping**: Stocks grouped by sector with sector-level summaries
- **Visual Indicators**: Green/Red color coding for gains and losses
- **Search & Filter**: Search stocks by name, sector, or symbol
- **Sorting**: Sort stocks by various columns
- **Charts**: Visual representation of portfolio allocation and performance
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: Yahoo Finance API (via yahoo-finance2 library)
- **Charts**: Recharts
- **Table**: TanStack Table (react-table)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
portfolio-dashboard/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── stocks/
│   │   │       └── route.ts      # API endpoint for stock data
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── Dashboard.tsx         # Main dashboard component
│   │   ├── PortfolioSummary.tsx  # Portfolio summary cards
│   │   ├── PortfolioTable.tsx    # Main table component
│   │   ├── PortfolioCharts.tsx   # Chart visualizations
│   │   ├── SectorCard.tsx        # Sector grouping card
│   │   ├── LoadingSpinner.tsx    # Loading components
│   │   └── index.ts              # Component exports
│   ├── data/
│   │   └── portfolio.ts          # Sample portfolio data
│   ├── hooks/
│   │   └── usePortfolio.ts       # Portfolio data hook
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   └── utils/
│       ├── calculations.ts       # Portfolio calculations
│       └── formatters.ts         # Number/currency formatters
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Key Components

### Dashboard
The main container component that orchestrates the entire dashboard, including:
- Loading states
- Error handling
- Tab navigation (Table/Charts view)

### PortfolioSummary
Displays key portfolio metrics:
- Total Investment
- Present Value
- Total Gain/Loss
- Return Percentage

### PortfolioTable
Interactive table with:
- Sector grouping view
- Flat list view
- Search functionality
- Column sorting

### PortfolioCharts
Visual charts including:
- Sector allocation pie chart
- Sector performance bar chart
- Top holdings comparison

## API Integration

### Yahoo Finance
The application uses the `yahoo-finance2` unofficial library to fetch:
- Current Market Price (CMP)
- P/E Ratio (Trailing/Forward)
- EPS (Earnings Per Share)

### Rate Limiting & Caching
- Server-side caching (10 seconds)
- Request throttling (100ms between requests)
- Staggered batch requests to avoid rate limits

## Configuration

### Portfolio Data
Edit `src/data/portfolio.ts` to modify the stock holdings:

```typescript
{
  id: '1',
  particulars: 'HDFC Bank',
  purchasePrice: 1550,
  quantity: 50,
  exchange: 'NSE',
  symbol: 'HDFCBANK.NS',  // Yahoo Finance symbol
  sector: 'Financials',
}
```

### Refresh Interval
Modify the refresh interval in `src/hooks/usePortfolio.ts`:
```typescript
const REFRESH_INTERVAL = 15000; // 15 seconds
```

## Deployment

The application can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Docker**
- **Any Node.js hosting platform**

### Vercel Deployment
```bash
npm install -g vercel
vercel
```

## Known Limitations

1. **Yahoo Finance API**: Uses unofficial API that may break if Yahoo changes their endpoints
2. **Rate Limiting**: Heavy usage may trigger rate limits from Yahoo Finance
3. **Market Hours**: Data accuracy may vary outside market hours
4. **Indian Stocks**: Some stocks may require `.NS` (NSE) or `.BO` (BSE) suffix

## License

MIT License

## Acknowledgments

- Yahoo Finance for stock data
- Next.js team for the framework
- Tailwind CSS for styling utilities
- Recharts for chart components
