import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Benefit } from '../types';
import { supabase } from '../lib/supabaseClient';
import { regionOptions } from '../data/regionData';

const BenefitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [benefit, setBenefit] = useState<Benefit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBenefit = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('benefits')
          .select('*')
          .eq('id', Number(id)) // id를 숫자로 변환
          .single(); // 단일 항목을 가져옵니다.

        if (error) {
          throw error;
        }
        setBenefit(data);
      } catch (err: any) {
        setError('데이터를 불러오는 중 오류가 발생했습니다: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBenefit();
  }, [id]);
  
  const getRegionLabel = (regionValue: string | null) => {
    if (!regionValue) return '정보 없음';
    const region = regionOptions.find(r => r.value === regionValue);
    return region ? region.label : regionValue;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">상세 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !benefit) {
    return (
      <div className="text-center py-12 bg-red-50 p-6 rounded-lg">
        <p className="text-lg text-red-700 font-semibold">오류 발생!</p>
        <p className="text-red-600 mt-2">{error || '해당 복지 혜택 정보를 찾을 수 없습니다.'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)} // 이전 페이지로 돌아가기
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            목록으로 돌아가기
          </button>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {benefit.name}
          </h1>
        </div>

        <div className="space-y-8">
          {/* 기본 정보 */}
          <div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800 border-b-2 border-gray-200 pb-2">기본 정보</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {benefit.description || '상세 설명이 없습니다.'}
            </p>
          </div>

          {/* 신청 대상 */}
          <div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800 border-b-2 border-gray-200 pb-2">신청 대상</h2>
            <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <span className="text-sm text-gray-500">나이 조건</span>
                <p className="font-semibold text-lg">{benefit.age_condition || '전체'}</p>
              </div>
              <div className="text-center">
                <span className="text-sm text-gray-500">성별</span>
                <p className="font-semibold text-lg">{benefit.gender || '전체'}</p>
              </div>
              <div className="text-center">
                <span className="text-sm text-gray-500">거주지</span>
                <p className="font-semibold text-lg">{benefit.region ? getRegionLabel(benefit.region) : '전국'}</p>
              </div>
            </div>
          </div>

          {/* 신청 방법 */}
          <div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800 border-b-2 border-gray-200 pb-2">신청 방법</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-blue-800 text-lg">{benefit.how_to_apply || '별도 문의 필요'}</p>
            </div>
          </div>

          {/* 제공 기관 및 문의처 */}
          <div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800 border-b-2 border-gray-200 pb-2">제공 기관 및 문의처</h2>
            <div className="bg-green-50 p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-green-600">제공 기관</span>
                <p className="font-semibold text-lg text-green-800">{benefit.organization || '정보 없음'}</p>
              </div>
              <div>
                <span className="text-sm text-green-600">연락처</span>
                <p className="font-semibold text-lg text-green-800">{benefit.contact || '정보 없음'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitDetail; 