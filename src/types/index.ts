export interface Broker {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  affiliate_link: string;
  description: string;
  rating: number;
  review_count: number;
  features: string[];
  regulation: string;
  minimum_deposit: string;
  spread_type: string;
  trading_platforms: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  broker_id: string;
  user_id: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
}
