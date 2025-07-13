import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Conditions, Benefit } from '../types';
import { supabase } from '../lib/supabaseClient';
import { regionOptions } from '../data/regionData';

interface ConditionInputProps {
  setConditions: React.Dispatch<React.SetStateAction<Conditions | null>>;
  setBenefits: React.Dispatch<React.SetStateAction<Benefit[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ConditionInput: React.FC<ConditionInputProps> = ({ 
  setConditions, setBenefits, setLoading, setError 
}) => {
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState<'male' | 'female' | '전체'>('전체');
  const [region, setRegion] = useState<string>('전국');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentConditions: Conditions = { age, gender, region };
    setConditions(currentConditions);
    setLoading(true);
    setError(null);
    setBenefits([]);
    navigate('/benefits');

    try {
      let query = supabase
        .from('benefits')
        .select('*')
        .lte('min_age', age); // min_age가 입력된 age보다 작거나 같은 경우

      // '전체'가 아닐 경우에만 성별 필터링
      if (gender !== '전체') {
        query = query.in('gender', ['전체', gender]);
      }

      // '전국'이 아닐 경우에만 지역 필터링
      if (region !== '전국') {
        query = query.in('region', ['전국', region]);
      }
      
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (data) {
        setBenefits(data);
      }

    } catch (err: any) {
      setError('데이터를 불러오는 중 오류가 발생했습니다: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          맞춤형 조건 입력
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 나이 입력 */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              만 나이
            </label>
            <input
              id="age"
              type="number"
              value={age || ''}
              onChange={(e) => setAge(Number(e.target.value))}
              placeholder="나이를 숫자로 입력하세요"
              min="0"
              max="120"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* 성별 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              성별
            </label>
            <div className="flex justify-between">
              {(['male', 'female', '전체'] as const).map((g) => (
                <label key={g} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={gender === g}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female' | '전체')}
                    className="w-4 h-4"
                  />
                  <span className="text-lg text-gray-700">
                    {g === 'male' ? '남성' : g === 'female' ? '여성' : '전체'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 거주지 선택 */}
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
              거주지
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              required
            >
              <option value="전국">전국</option>
              {regionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={age <= 0}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-medium"
          >
            복지 혜택 조회하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConditionInput; 