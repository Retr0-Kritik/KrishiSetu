# Krishi Setu

**Krishi Setu** (কৃষি সেতু / कृषि सेतु) is a farmer transport pooling platform designed for West Bengal, India. It connects farmers to share transportation costs, access real-time market prices, and optimize logistics for agricultural produce.

## Features

### Transport Pooling
- **Smart Clustering**: Groups nearby farmers by location to share truck capacity
- **Join/Leave Pools**: 15-minute opt-out window after joining a pool
- **Cost Savings**: Real-time calculation of estimated savings per pool

### Market Analytics
- **Live Prices**: Real-time wholesale prices for major crops
- **AI Predictions**: 7-day price forecasts based on historical data
- **Trend Indicators**: Visual indicators for price movements

### Logistics Visualization
- **Pool Status Cards**: View all active transport pools across West Bengal
- **Farmer Count**: Track number of farmers in each pool
- **Weight Tracking**: Monitor total cargo weight per pool

### Multi-Language Support
- English
- বাংলা (Bengali)
- हिंदी (Hindi)

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI + CVA)
- **State Management**: [Jotai](https://jotai.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Project Structure

```
src/
├── components/
│   ├── analytics/      # Market analytics components
│   ├── dashboard/      # Farmer dashboard components
│   ├── layout/         # Navigation, header, sidebar
│   ├── logistics/      # Logistics visualization
│   ├── profile/        # User profile components
│   └── ui/             # shadcn/ui base components
├── hooks/              # Custom React hooks
├── i18n/               # Internationalization (translations)
├── lib/                # shadcn/ui utilities
├── store/
│   └── atoms/          # Jotai atoms for state management
└── utils/              # Clustering engine & utilities
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd h-thon

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#047857` | Main brand color (Emerald) |
| Secondary | `#f59e0b` | Accent color (Amber) |
| Background | `#f8fafc` | Page background (Slate) |

## 🌍 Supported Locations

The platform currently supports these West Bengal locations:
- Bardhaman, Durgapur, Asansol
- Siliguri, Howrah, Kolkata
- Malda, Murshidabad, Nadia, Hooghly

## 📄 License

This project is part of a hackathon submission.

---

**Built with ❤️ for the farmers of West Bengal**
