import { NextRequest, NextResponse } from 'next/server';
import { getMockRelatedArticles } from '@/lib/mock-data';

const API_BASE_URL = 'https://api.worldnewsapi.com';
const API_KEY = process.env.WORLD_NEWS_API_KEY;

export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'WORLD_NEWS_API_KEY environment variable is required' },
      { status: 500 }
    );
  }

  try {
    const { title, limit } = await request.json();

    const keywords = title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter((word: string) => word.length > 3)
      .slice(0, 3)
      .join(',');

    const params = new URLSearchParams({
      'source-countries': 'us',
      'language': 'en',
      'text': keywords,
      'number': limit || '4',
      'offset': '0',
      'sort': 'publish-time',
      'sort-direction': 'desc'
    });

    const url = `${API_BASE_URL}/search-news?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If quota exhausted or other API error, return mock data
      const mockArticles = getMockRelatedArticles(title, 'current-article');
      return NextResponse.json({ news: mockArticles });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    // Fallback to mock data
    const mockArticles = getMockRelatedArticles(title, 'current-article');
    return NextResponse.json({ news: mockArticles });
  }
}