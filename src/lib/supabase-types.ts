export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Role = 'admin' | 'parent' | 'student';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          role: Role;
          household_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          role: Role;
          household_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          role?: Role;
          household_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      invitations: {
        Row: {
          id: string;
          email: string;
          role: Role;
          token: string;
          inviter_id: string;
          household_id: string | null;
          created_at: string;
          expires_at: string;
          accepted_at: string | null;
          active: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          role: Role;
          token: string;
          inviter_id: string;
          household_id?: string | null;
          created_at?: string;
          expires_at: string;
          accepted_at?: string | null;
          active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          role?: Role;
          token?: string;
          inviter_id?: string;
          household_id?: string | null;
          created_at?: string;
          expires_at?: string;
          accepted_at?: string | null;
          active?: boolean;
        };
        Relationships: [];
      };
      households: {
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
      students: {
        Row: {
          id: string;
          household_id: string;
          name: string;
          grade: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          name: string;
          grade: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          name?: string;
          grade?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      curriculums: {
        Row: {
          id: string;
          student_id: string;
          title: string;
          description: string;
          start_date: string;
          end_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          title: string;
          description: string;
          start_date: string;
          end_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          title?: string;
          description?: string;
          start_date?: string;
          end_date?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      blackout_dates: {
        Row: {
          id: string;
          household_id: string;
          date: string;
          label: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          date: string;
          label: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          date?: string;
          label?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          student_id: string;
          title: string;
          due_date: string;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          title: string;
          due_date: string;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          title?: string;
          due_date?: string;
          completed?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
