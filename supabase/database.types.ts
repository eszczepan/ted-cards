export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      flashcards: {
        Row: {
          back_content: string;
          back_language: string;
          cefr_level: string;
          created_at: string;
          front_content: string;
          front_language: string;
          generation_id: string | null;
          id: string;
          source: string;
          source_youtube_url: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          back_content: string;
          back_language: string;
          cefr_level: string;
          created_at?: string;
          front_content: string;
          front_language: string;
          generation_id?: string | null;
          id?: string;
          source: string;
          source_youtube_url?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          back_content?: string;
          back_language?: string;
          cefr_level?: string;
          created_at?: string;
          front_content?: string;
          front_language?: string;
          generation_id?: string | null;
          id?: string;
          source?: string;
          source_youtube_url?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "flashcards_generation_id_fkey";
            columns: ["generation_id"];
            isOneToOne: false;
            referencedRelation: "generations";
            referencedColumns: ["id"];
          },
        ];
      };
      generation_error_logs: {
        Row: {
          created_at: string;
          error_code: string;
          error_message: string;
          id: string;
          model: string | null;
          source_text_hash: string;
          source_text_length: number;
          source_type: string | null;
          source_youtube_url: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          error_code: string;
          error_message: string;
          id?: string;
          model?: string | null;
          source_text_hash: string;
          source_text_length: number;
          source_type?: string | null;
          source_youtube_url?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          error_code?: string;
          error_message?: string;
          id?: string;
          model?: string | null;
          source_text_hash?: string;
          source_text_length?: number;
          source_type?: string | null;
          source_youtube_url?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      generations: {
        Row: {
          accepted_edited_count: number | null;
          accepted_unedited_count: number | null;
          created_at: string;
          generated_count: number;
          generation_duration: number;
          id: string;
          model: string;
          source_text: string;
          source_text_hash: string;
          source_text_length: number;
          source_type: string;
          source_youtube_url: string | null;
          user_id: string;
        };
        Insert: {
          accepted_edited_count?: number | null;
          accepted_unedited_count?: number | null;
          created_at?: string;
          generated_count: number;
          generation_duration: number;
          id?: string;
          model: string;
          source_text: string;
          source_text_hash: string;
          source_text_length: number;
          source_type: string;
          source_youtube_url?: string | null;
          user_id: string;
        };
        Update: {
          accepted_edited_count?: number | null;
          accepted_unedited_count?: number | null;
          created_at?: string;
          generated_count?: number;
          generation_duration?: number;
          id?: string;
          model?: string;
          source_text?: string;
          source_text_hash?: string;
          source_text_length?: number;
          source_type?: string;
          source_youtube_url?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_youtube_url_exists: {
        Args: { p_user_id: string; p_youtube_url: string };
        Returns: boolean;
      };
      get_user_flashcard_stats: {
        Args: { p_user_id: string };
        Returns: {
          total_count: number;
          by_source: Json;
          by_cefr_level: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
