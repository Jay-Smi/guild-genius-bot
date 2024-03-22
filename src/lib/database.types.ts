export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      characters: {
        Row: {
          class: string
          discord_id: number | null
          guild_id: number | null
          id: number
          name: string
          player_id: number
          profile_id: string | null
          spec: string
        }
        Insert: {
          class: string
          discord_id?: number | null
          guild_id?: number | null
          id?: number
          name: string
          player_id: number
          profile_id?: string | null
          spec: string
        }
        Update: {
          class?: string
          discord_id?: number | null
          guild_id?: number | null
          id?: number
          name?: string
          player_id?: number
          profile_id?: string | null
          spec?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_characters_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_characters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_characters_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guilds: {
        Row: {
          created_at: string
          discord_guild_id: string
          faction: string
          id: number
          logs: Json | null
          name: string
          owner_player_id: number
          realm: string
          region: string
        }
        Insert: {
          created_at?: string
          discord_guild_id: string
          faction: string
          id?: number
          logs?: Json | null
          name: string
          owner_player_id: number
          realm: string
          region: string
        }
        Update: {
          created_at?: string
          discord_guild_id?: string
          faction?: string
          id?: number
          logs?: Json | null
          name?: string
          owner_player_id?: number
          realm?: string
          region?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_guilds_owner_player_id_fkey"
            columns: ["owner_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          created_at: string
          discord_id: number | null
          faction: string
          guild_id: number | null
          guild_rank: string | null
          id: number
          main_character_id: number | null
          name: string
          profile_id: string | null
          realm: string
          region: string
        }
        Insert: {
          created_at?: string
          discord_id?: number | null
          faction: string
          guild_id?: number | null
          guild_rank?: string | null
          id?: number
          main_character_id?: number | null
          name: string
          profile_id?: string | null
          realm: string
          region: string
        }
        Update: {
          created_at?: string
          discord_id?: number | null
          faction?: string
          guild_id?: number | null
          guild_rank?: string | null
          id?: number
          main_character_id?: number | null
          name?: string
          profile_id?: string | null
          realm?: string
          region?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_players_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_players_main_character_id_fkey"
            columns: ["main_character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_players_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string
          created_at: string
          discord_alias: string
          discord_id: string
          id: string
          selected_player_id: number | null
          username: string
        }
        Insert: {
          avatar_url: string
          created_at?: string
          discord_alias: string
          discord_id: string
          id?: string
          selected_player_id?: number | null
          username: string
        }
        Update: {
          avatar_url?: string
          created_at?: string
          discord_alias?: string
          discord_id?: string
          id?: string
          selected_player_id?: number | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
