export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Role = 'global_admin' | 'parent' | 'student';

export interface Database {
  public: {
    Tables: {
      families: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          family_id: string | null;
          role: Role;
          display_name: string;
          grade_level: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          family_id?: string | null;
          role: Role;
          display_name: string;
          grade_level?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          family_id?: string | null;
          role?: Role;
          display_name?: string;
          grade_level?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      invites: {
        Row: {
          id: string;
          email: string;
          family_id: string;
          role: Role;
          created_by_profile_id: string;
          token: string;
          expires_at: string;
          accepted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          family_id: string;
          role: Role;
          created_by_profile_id: string;
          token: string;
          expires_at: string;
          accepted_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          family_id?: string;
          role?: Role;
          created_by_profile_id?: string;
          token?: string;
          expires_at?: string;
          accepted_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      app_role: Role;
    };
    CompositeTypes: { [_ in never]: never };
  };
}
