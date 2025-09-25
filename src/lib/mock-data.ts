import { NewsArticle } from './types';

export const mockNewsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Breaking: Supreme Court Makes Historic Decision on Climate Policy',
    text: 'In a landmark ruling today, the Supreme Court delivered a decisive verdict on federal climate regulations that will shape environmental policy for decades to come. The 6-3 decision affirms the government\'s authority to implement sweeping changes to carbon emission standards across multiple industries.',
    summary: 'Supreme Court upholds federal authority on climate regulations in historic 6-3 decision affecting carbon emission standards nationwide.',
    url: 'https://example.com/supreme-court-climate',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop',
    publish_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    authors: ['Sarah Johnson', 'Michael Chen'],
    source_country: 'us',
    language: 'en',
    source: 'Associated Press'
  },
  {
    id: '2',
    title: 'Tech Giants Face New Antitrust Investigation by DOJ',
    text: 'The Department of Justice announced a comprehensive investigation into major technology companies\' business practices, focusing on potential monopolistic behaviors in the digital marketplace. This marks the most significant antitrust action in the tech sector in over two decades.',
    summary: 'DOJ launches major antitrust probe targeting big tech companies\' market dominance and business practices.',
    url: 'https://example.com/tech-antitrust',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
    publish_date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    authors: ['David Kim'],
    source_country: 'us',
    language: 'en',
    source: 'Reuters'
  },
  {
    id: '3',
    title: 'Federal Reserve Signals Potential Interest Rate Changes',
    text: 'Federal Reserve Chairman indicated in today\'s testimony before Congress that economic indicators may warrant adjustments to monetary policy in the coming months. Markets responded with cautious optimism to the measured approach.',
    summary: 'Fed hints at possible rate adjustments based on economic data, markets show positive response.',
    url: 'https://example.com/fed-rates',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    publish_date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    authors: ['Elizabeth Martinez'],
    source_country: 'us',
    language: 'en',
    source: 'Wall Street Journal'
  },
  {
    id: '4',
    title: 'New Healthcare Legislation Passes House Committee',
    text: 'A comprehensive healthcare reform bill successfully passed through the House Health Committee with bipartisan support, addressing prescription drug costs and expanding coverage options for millions of Americans.',
    summary: 'Bipartisan healthcare bill advances through House committee, targeting drug costs and coverage expansion.',
    url: 'https://example.com/healthcare-bill',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop',
    publish_date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    authors: ['Robert Thompson'],
    source_country: 'us',
    language: 'en',
    source: 'CNN'
  },
  {
    id: '5',
    title: 'Infrastructure Spending Shows Economic Impact Across States',
    text: 'New federal data reveals significant economic benefits from recent infrastructure investments, with job creation and improved transportation networks visible across multiple states.',
    summary: 'Federal infrastructure spending demonstrates measurable economic benefits and job creation nationwide.',
    url: 'https://example.com/infrastructure-impact',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=400&fit=crop',
    publish_date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    authors: ['Jennifer Liu', 'Marcus Williams'],
    source_country: 'us',
    language: 'en',
    source: 'NPR'
  },
  {
    id: '6',
    title: 'Education Department Announces New Student Loan Relief Program',
    text: 'The Department of Education unveiled a new initiative to provide additional relief for student loan borrowers, including income-driven repayment adjustments and expanded forgiveness options.',
    summary: 'Education Department launches expanded student loan relief program with new repayment and forgiveness options.',
    url: 'https://example.com/student-loans',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
    publish_date: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    authors: ['Amanda Garcia'],
    source_country: 'us',
    language: 'en',
    source: 'USA Today'
  }
];

export function getMockArticlesByTopic(topic: string): NewsArticle[] {
  // Return all mock articles for now, but you could filter by topic
  return mockNewsArticles;
}

export function getMockRelatedArticles(title: string, excludeId: string): NewsArticle[] {
  return mockNewsArticles.filter(article => article.id !== excludeId).slice(0, 4);
}