import { NextRequest, NextResponse } from 'next/server';
import { NEWS_TOPICS } from '@/lib/constants';
import { getMockArticlesByTopic } from '@/lib/mock-data';

const API_BASE_URL = 'https://api.worldnewsapi.com';
const API_KEY = process.env.WORLD_NEWS_API_KEY;

export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'WORLD_NEWS_API_KEY environment variable is required' },
      { status: 500 }
    );
  }

  let topic = 'general';

  try {
    const { topic: requestTopic } = await request.json();
    topic = requestTopic;
    const topicInfo = NEWS_TOPICS.find(t => t.id === topic);

    if (!topicInfo) {
      return NextResponse.json(
        { error: `Invalid topic: ${topic}` },
        { status: 400 }
      );
    }

    // Try the simplest possible request first
    const baseParams: Record<string, string> = {
      'source-countries': 'us',
      'language': 'en',
      'number': '10'
    };

    if (topic === 'general') {
      // For general feed, use broad political keywords (under 100 chars)
      baseParams['text'] = 'politics,government,congress,policy,federal,law,legislation,election';
    } else {
      // For specific topic, use that topic's keywords (ensure under 100 chars)
      const keywords = topicInfo.keywords.substring(0, 90); // Keep some buffer
      baseParams['text'] = keywords;
    }

    const urlWithParams = `${API_BASE_URL}/search-news?${new URLSearchParams(baseParams).toString()}`;

    const response = await fetch(urlWithParams, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY!,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // If quota exhausted or other API error, return mock data
      const mockArticles = getMockArticlesByTopic();
      return NextResponse.json({
        news: mockArticles,
        quota: { remaining: 0, isUsingMockData: true }
      });
    }

    const data = await response.json();
    const quotaLeft = response.headers.get('X-API-QUOTA-LEFT');

    return NextResponse.json({
      ...data,
      quota: {
        remaining: quotaLeft ? parseInt(quotaLeft) : null,
        isUsingMockData: false
      }
    });

  } catch {
    // Fallback to mock data on any error
    const mockArticles = getMockArticlesByTopic();
    return NextResponse.json({
      news: mockArticles,
      quota: { remaining: 0, isUsingMockData: true }
    });
  }
}