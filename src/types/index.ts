export type Platform = 'twitter' | 'instagram' | 'facebook' | 'pinterest' | 'tiktok' | 'linkedin';

export interface AmazonProduct {
  asin: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  currency: string;
  rating: number;
  reviewCount: number;
  prime: boolean;
  stock: string;
  imageUrl: string;
  badge?: string;
  features: string[];
  affiliateUrl: string;
  commissionRate: number;
}

export interface ScheduledPost {
  id: string;
  asin: string;
  productTitle: string;
  productPrice: number;
  productImageUrl: string;
  affiliateUrl: string;
  platforms: Platform[];
  copy: Partial<Record<Platform, string>>;
  scheduledTime: string;
  status: 'scheduled' | 'publishing' | 'published' | 'failed' | 'draft';
  campaignName: string;
  createdAt: string;
  aiOptimized: boolean;
  aiReasoning?: string;
  targetAudience?: string;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
  };
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'success' | 'info' | 'alert' | 'warning';
  read: boolean;
  campaignId?: string;
}

export interface AnalyticsSummary {
  totalPosts: number;
  publishedPosts: number;
  scheduledPosts: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  avgCtr: number;
}

export interface PlatformStat {
  posts: number;
  clicks: number;
  share: string;
}

export interface AmazonApiConfig {
  associateTag: string;
  accessKey: string;
  secretKey: string;
  marketplace: string;
  autoPriceAlert: boolean;
  autoScheduleBestTime: boolean;
}
