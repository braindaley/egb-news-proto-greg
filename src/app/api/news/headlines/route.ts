import { NextRequest, NextResponse } from 'next/server';

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
    const { limit } = await request.json();

    const params = new URLSearchParams({
      'source-countries': 'us',
      'language': 'en',
      'number': limit || '10',
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
      throw new Error(`News API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching headlines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch headlines' },
      { status: 500 }
    );
  }
}