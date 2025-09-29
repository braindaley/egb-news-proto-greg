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

  let title = '';

  try {
    const { title: requestTitle, limit } = await request.json();
    title = requestTitle;

    // Extract meaningful keywords from title
    const stopWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'had', 'have', 'what', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'would', 'there', 'could', 'other', 'after', 'first', 'well', 'many', 'some', 'very', 'when', 'much', 'new', 'also', 'may', 'way', 'most', 'more'];

    let keywords = title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter((word: string) => word.length > 3 && !stopWords.includes(word))
      .slice(0, 4) // Take up to 4 words
      .join(',');

    // If no good keywords found, try with shorter words
    if (!keywords) {
      keywords = title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(' ')
        .filter((word: string) => word.length > 2 && !stopWords.includes(word))
        .slice(0, 3)
        .join(',');
    }

    // Fallback to first meaningful word
    if (!keywords) {
      const firstWord = title.toLowerCase().replace(/[^\w\s]/g, '').split(' ')[0];
      keywords = firstWord || 'news';
    }

    console.log('Related articles search - Title:', title);
    console.log('Related articles search - Keywords:', keywords);

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
    console.log('Related articles API response:', data.news ? data.news.length : 0, 'articles');
    return NextResponse.json(data);

  } catch (error) {
    // Fallback to mock data
    const mockArticles = getMockRelatedArticles(title, 'current-article');
    return NextResponse.json({ news: mockArticles });
  }
}