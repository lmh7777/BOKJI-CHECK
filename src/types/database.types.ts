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
      benefits: {
        Row: { // 데이터베이스에서 읽어올 때의 타입
          id: number
          created_at: string
          name: string
          description: string | null
          min_age: number | null
          age_condition: string | null
          gender: string | null
          region: string | null
          how_to_apply: string | null
          organization: string | null
          contact: string | null
        }
        Insert: { // 데이터베이스에 삽입할 때의 타입
          id?: number
          created_at?: string
          name: string
          description?: string | null
          min_age?: number | null
          age_condition?: string | null
          gender?: string | null
          region?: string | null
          how_to_apply?: string | null
          organization?: string | null
          contact?: string | null
        }
        Update: { // 데이터베이스를 수정할 때의 타입
          id?: number
          created_at?: string
          name?: string
          description?: string | null
          min_age?: number | null
          age_condition?: string | null
          gender?: string | null
          region?: string | null
          how_to_apply?: string | null
          organization?: string | null
          contact?: string | null
        }
        Relationships: []
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