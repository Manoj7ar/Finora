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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      cognitive_bias_events: {
        Row: {
          bias_type: string
          context: string
          detected_at: string
          id: string
          source_page: string
          user_id: string
        }
        Insert: {
          bias_type: string
          context?: string
          detected_at?: string
          id?: string
          source_page?: string
          user_id: string
        }
        Update: {
          bias_type?: string
          context?: string
          detected_at?: string
          id?: string
          source_page?: string
          user_id?: string
        }
        Relationships: []
      }
      community_scores: {
        Row: {
          age_group: string
          city: string
          id: string
          resilience_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          age_group?: string
          city?: string
          id?: string
          resilience_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          age_group?: string
          city?: string
          id?: string
          resilience_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      economic_forecasts: {
        Row: {
          created_at: string
          details: Json
          forecast_date: string
          id: string
          outlook: string
          summary: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json
          forecast_date?: string
          id?: string
          outlook?: string
          summary?: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json
          forecast_date?: string
          id?: string
          outlook?: string
          summary?: string
          user_id?: string
        }
        Relationships: []
      }
      fed_predictions: {
        Row: {
          actual_outcome: string | null
          created_at: string
          event_date: string
          event_type: string
          explanation: string | null
          id: string
          resolved_at: string | null
          score: number | null
          user_id: string
          user_prediction: string
        }
        Insert: {
          actual_outcome?: string | null
          created_at?: string
          event_date: string
          event_type: string
          explanation?: string | null
          id?: string
          resolved_at?: string | null
          score?: number | null
          user_id: string
          user_prediction: string
        }
        Update: {
          actual_outcome?: string | null
          created_at?: string
          event_date?: string
          event_type?: string
          explanation?: string | null
          id?: string
          resolved_at?: string | null
          score?: number | null
          user_id?: string
          user_prediction?: string
        }
        Relationships: []
      }
      financial_goals: {
        Row: {
          ai_nudge: string | null
          category: string
          created_at: string
          current_amount: number
          deadline: string | null
          id: string
          name: string
          nudge_updated_at: string | null
          target_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_nudge?: string | null
          category?: string
          created_at?: string
          current_amount?: number
          deadline?: string | null
          id?: string
          name: string
          nudge_updated_at?: string | null
          target_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_nudge?: string | null
          category?: string
          created_at?: string
          current_amount?: number
          deadline?: string | null
          id?: string
          name?: string
          nudge_updated_at?: string | null
          target_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_twin_snapshots: {
        Row: {
          created_at: string
          id: string
          key_insight: string
          projections: Json
          snapshot_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_insight?: string
          projections?: Json
          snapshot_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          key_insight?: string
          projections?: Json
          snapshot_date?: string
          user_id?: string
        }
        Relationships: []
      }
      legislation_alerts: {
        Row: {
          bill_name: string
          created_at: string
          id: string
          personal_impact: string
          read: boolean
          severity: string
          summary: string
          user_id: string
        }
        Insert: {
          bill_name: string
          created_at?: string
          id?: string
          personal_impact?: string
          read?: boolean
          severity?: string
          summary?: string
          user_id: string
        }
        Update: {
          bill_name?: string
          created_at?: string
          id?: string
          personal_impact?: string
          read?: boolean
          severity?: string
          summary?: string
          user_id?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string
          id: string
          score: number
          topic_id: string
          total_questions: number
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          score?: number
          topic_id: string
          total_questions?: number
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          score?: number
          topic_id?: string
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      negotiation_opportunities: {
        Row: {
          created_at: string
          dismissed: boolean
          id: string
          macro_context: string
          opportunity_type: string
          script: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dismissed?: boolean
          id?: string
          macro_context?: string
          opportunity_type: string
          script?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          dismissed?: boolean
          id?: string
          macro_context?: string
          opportunity_type?: string
          script?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          metric_id: string | null
          read: boolean
          severity: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metric_id?: string | null
          read?: boolean
          severity?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metric_id?: string | null
          read?: boolean
          severity?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_group: string | null
          city: string | null
          country: string | null
          created_at: string
          debt_types: Json | null
          id: string
          income_range: string | null
          investment_level: string | null
          onboarding_completed: boolean | null
          savings_range: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          age_group?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          debt_types?: Json | null
          id: string
          income_range?: string | null
          investment_level?: string | null
          onboarding_completed?: boolean | null
          savings_range?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          age_group?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          debt_types?: Json | null
          id?: string
          income_range?: string | null
          investment_level?: string | null
          onboarding_completed?: boolean | null
          savings_range?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_community_stats: {
        Args: never
        Returns: {
          age_group: string
          avg_score: number
          city: string
          user_count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
