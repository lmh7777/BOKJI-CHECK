import { Database } from './types/database.types';

// Supabase에서 생성된 타입을 기반으로 Benefit 타입을 정의합니다.
// 이렇게 하면 데이터베이스 스키마가 변경될 때 타입이 자동으로 업데이트됩니다.
export type Benefit = Database['public']['Tables']['benefits']['Row'];

export interface Conditions {
  age: number;
  gender: 'male' | 'female' | '전체'; // '전체' 옵션 추가
  region: string;
} 