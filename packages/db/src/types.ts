export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      academies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          primary_discipline: Database["public"]["Enums"]["discipline"] | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          primary_discipline?: Database["public"]["Enums"]["discipline"] | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          primary_discipline?: Database["public"]["Enums"]["discipline"] | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      academy_memberships: {
        Row: {
          academy_id: string
          created_at: string
          joined_at: string
          role: Database["public"]["Enums"]["academy_role"]
          status: Database["public"]["Enums"]["membership_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          academy_id: string
          created_at?: string
          joined_at?: string
          role: Database["public"]["Enums"]["academy_role"]
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          created_at?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["academy_role"]
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_memberships_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academy_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gyms: {
        Row: {
          academy_id: string | null
          address: string | null
          affiliation: string | null
          city: string | null
          country: string
          cover_image_url: string | null
          created_at: string
          description: string | null
          founded_year: number | null
          id: string
          instagram_followers: number | null
          instagram_handle: string | null
          lat: number | null
          lng: number | null
          name: string
          neighborhood: string | null
          primary_discipline: Database["public"]["Enums"]["discipline"] | null
          slug: string
          updated_at: string
        }
        Insert: {
          academy_id?: string | null
          address?: string | null
          affiliation?: string | null
          city?: string | null
          country?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          id?: string
          instagram_followers?: number | null
          instagram_handle?: string | null
          lat?: number | null
          lng?: number | null
          name: string
          neighborhood?: string | null
          primary_discipline?: Database["public"]["Enums"]["discipline"] | null
          slug: string
          updated_at?: string
        }
        Update: {
          academy_id?: string | null
          address?: string | null
          affiliation?: string | null
          city?: string | null
          country?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          id?: string
          instagram_followers?: number | null
          instagram_handle?: string | null
          lat?: number | null
          lng?: number | null
          name?: string
          neighborhood?: string | null
          primary_discipline?: Database["public"]["Enums"]["discipline"] | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gyms_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          handle: string
          id: string
          primary_discipline: Database["public"]["Enums"]["discipline"] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          handle: string
          id: string
          primary_discipline?: Database["public"]["Enums"]["discipline"] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          handle?: string
          id?: string
          primary_discipline?: Database["public"]["Enums"]["discipline"] | null
          updated_at?: string
        }
        Relationships: []
      }
      user_ranks: {
        Row: {
          awarded_at: string | null
          created_at: string
          discipline: Database["public"]["Enums"]["discipline"]
          rank_text: string
          updated_at: string
          user_id: string
          years_training: number | null
        }
        Insert: {
          awarded_at?: string | null
          created_at?: string
          discipline: Database["public"]["Enums"]["discipline"]
          rank_text: string
          updated_at?: string
          user_id: string
          years_training?: number | null
        }
        Update: {
          awarded_at?: string | null
          created_at?: string
          discipline?: Database["public"]["Enums"]["discipline"]
          rank_text?: string
          updated_at?: string
          user_id?: string
          years_training?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_ranks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_academy_role: {
        Args: {
          p_academy_id: string
          p_roles: Database["public"]["Enums"]["academy_role"][]
        }
        Returns: boolean
      }
    }
    Enums: {
      academy_role: "owner" | "admin" | "instructor" | "student" | "prospect"
      discipline:
        | "bjj"
        | "mma"
        | "muay_thai"
        | "boxing"
        | "wrestling"
        | "kickboxing"
        | "gi"
        | "no_gi"
      membership_status: "active" | "invited" | "left"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      academy_role: ["owner", "admin", "instructor", "student", "prospect"],
      discipline: [
        "bjj",
        "mma",
        "muay_thai",
        "boxing",
        "wrestling",
        "kickboxing",
        "gi",
        "no_gi",
      ],
      membership_status: ["active", "invited", "left"],
    },
  },
} as const
