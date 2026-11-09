export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nome: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          nome?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nome?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: "admin" | "user";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: "admin" | "user";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: "admin" | "user";
          created_at?: string;
        };
        Relationships: [];
      };
      campaigns: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          client_name: string | null;
          channels: string[] | null;
          start_date: string | null;
          end_date: string | null;
          budget: number | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          description?: string | null;
          client_name?: string | null;
          channels?: string[] | null;
          start_date?: string | null;
          end_date?: string | null;
          budget?: number | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          description?: string | null;
          client_name?: string | null;
          channels?: string[] | null;
          start_date?: string | null;
          end_date?: string | null;
          budget?: number | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      has_role: {
        Args: { _user_id: string; _role: "admin" | "user" };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "user";
    };
    CompositeTypes: Record<string, never>;
  };
};
