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
      };
    };
    Views: Record<string, object>;
    Functions: Record<string, object>;
    Enums: Record<string, object>;
    CompositeTypes: Record<string, object>;
  };
}
