export interface NewsArticle {
  id: string;
  title: string;
  text: string;
  summary: string;
  url: string;
  image?: string;
  publish_date: string;
  authors: string[];
  source_country: string;
  language: string;
  source?: string;
  source_name?: string;
  source_url?: string;
}

export interface NewsResponse {
  news: NewsArticle[];
  available: number;
  number: number;
  offset: number;
}

export type NewsTopic =
  | 'general'
  | 'abortion'
  | 'climate-energy-environment'
  | 'criminal-justice'
  | 'death-penalty'
  | 'defense-national-security'
  | 'discrimination-prejudice'
  | 'drug-policy'
  | 'economy-work'
  | 'education'
  | 'free-speech-press'
  | 'gun-policy'
  | 'health-policy'
  | 'immigration-migration'
  | 'international-affairs'
  | 'lgbt-acceptance'
  | 'national-conditions'
  | 'privacy-rights'
  | 'religion-government'
  | 'social-security-medicare'
  | 'technology-policy';

export interface TopicInfo {
  id: NewsTopic;
  label: string;
  keywords: string;
}