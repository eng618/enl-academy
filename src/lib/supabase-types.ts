export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    // Add tables once Supabase schema exists.
    Tables: Record<string, object>;
    Views: Record<string, object>;
    Functions: Record<string, object>;
    Enums: Record<string, object>;
    CompositeTypes: Record<string, object>;
  };
}
