export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      brokers: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          website_url: string | null;
          affiliate_link: string | null;
          description: string | null;
          rating: number | null;
          review_count: number | null;
          features: Json | null;
          regulation: string | null;
          minimum_deposit: string | null;
          spread_type: string | null;
          trading_platforms: Json | null;
          is_active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          website_url?: string | null;
          affiliate_link?: string | null;
          description?: string | null;
          rating?: number | null;
          review_count?: number | null;
          features?: Json | null;
          regulation?: string | null;
          minimum_deposit?: string | null;
          spread_type?: string | null;
          trading_platforms?: Json | null;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          website_url?: string | null;
          affiliate_link?: string | null;
          description?: string | null;
          rating?: number | null;
          review_count?: number | null;
          features?: Json | null;
          regulation?: string | null;
          minimum_deposit?: string | null;
          spread_type?: string | null;
          trading_platforms?: Json | null;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          broker_id: string;
          user_id: string;
          rating: number;
          comment: string;
          is_approved: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          broker_id: string;
          user_id: string;
          rating: number;
          comment: string;
          is_approved?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          broker_id?: string;
          user_id?: string;
          rating?: number;
          comment?: string;
          is_approved?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          is_admin: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
