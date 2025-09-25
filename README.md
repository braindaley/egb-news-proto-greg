# US News Hub

A modern, responsive news aggregation app built with Next.js, featuring topic-based navigation and a clean, card-based design.

## Features

- 🗞️ **Topic-based News**: Browse news by 21+ categories (Politics, Climate, Economy, etc.)
- 📱 **Responsive Design**: Works beautifully on desktop and mobile
- 🎨 **Modern UI**: Built with shadcn/ui and Tailwind CSS
- ⚡ **Fast Loading**: Optimized images and smooth animations
- 🔄 **Smart Fallback**: Uses mock data when API quota is exhausted

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file:
```bash
WORLD_NEWS_API_KEY=your_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

## Deployment

### Environment Variables
Make sure to set the following environment variable in your deployment platform:
- `WORLD_NEWS_API_KEY` - Your WorldNewsAPI key

### Netlify Deployment
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables in Netlify dashboard

The app will gracefully fall back to mock data if the API quota is exhausted, ensuring it always works for visitors.
