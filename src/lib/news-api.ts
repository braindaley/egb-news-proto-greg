import { NewsResponse, NewsArticle, NewsTopic } from './types';

export class NewsAPIService {
  private async makeRequest(endpoint: string, params: Record<string, string>): Promise<NewsResponse> {
    const response = await fetch(`/api/news${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`News API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getNewsByTopic(topic: NewsTopic = 'general', limit: number = 20): Promise<NewsArticle[]> {
    const params = {
      topic,
      limit: limit.toString()
    };

    try {
      const response = await this.makeRequest('/search', params);

      // Emit quota update event if we have quota info
      if (response.quota && typeof window !== 'undefined') {
        const quotaEvent = new CustomEvent('quotaUpdate', {
          detail: {
            remaining: response.quota.remaining,
            isUsingMockData: response.quota.isUsingMockData,
            lastUpdated: new Date().toISOString(),
            error: (response.quota as any).error
          }
        });
        window.dispatchEvent(quotaEvent);
      }

      return response.news || [];
    } catch (error) {
      console.error(`Error fetching news for topic ${topic}:`, error);
      return [];
    }
  }

  async getRelatedArticles(title: string, limit: number = 4): Promise<NewsArticle[]> {
    const params = {
      title,
      limit: limit.toString()
    };

    try {
      const response = await this.makeRequest('/related', params);
      return response.news || [];
    } catch (error) {
      console.error(`Error fetching related articles for: ${title}`, error);
      return [];
    }
  }

  async getTopHeadlines(limit: number = 10): Promise<NewsArticle[]> {
    const params = {
      limit: limit.toString()
    };

    try {
      const response = await this.makeRequest('/headlines', params);
      return response.news || [];
    } catch (error) {
      console.error('Error fetching top headlines:', error);
      return [];
    }
  }
}

export const newsAPI = new NewsAPIService();