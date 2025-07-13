import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Benefit, Conditions } from '../types';
import { regionOptions } from '../data/regionData';

interface BenefitListProps {
  benefits: Benefit[];
  conditions: Conditions | null;
  loading: boolean;
  error: string | null;
}

const BenefitList: React.FC<BenefitListProps> = ({ benefits, conditions, loading, error }) => {
  const navigate = useNavigate();

  const handleBenefitClick = (benefitId: number) => {
    navigate(`/benefit/${benefitId}`);
  };

  const getRegionLabel = (regionValue: string) => {
    const region = regionOptions.find(r => r.value === regionValue);
    return region ? region.label : regionValue;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">데이터를 불러오는 중입니다...</p>
        {/* 스피너 등 시각적 요소 추가 가능 */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 p-6 rounded-lg">
        <p className="text-lg text-red-700 font-semibold">오류 발생!</p>
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          조건 다시 입력하기
        </button>
      </div>
    );
  }

  if (!conditions) {
    // 이 케이스는 사용자가 URL을 직접 /benefits로 접근했을 때 발생할 수 있습니다.
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">조회 조건이 없습니다. 첫 화면으로 돌아가 조건을 입력해주세요.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 입력된 조건 표시 카드 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">조회 조건</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <span className="text-sm text-gray-500">나이</span>
            <p className="font-semibold text-lg">{conditions.age}세</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">성별</span>
            <p className="font-semibold text-lg">{conditions.gender === 'male' ? '남성' : conditions.gender === 'female' ? '여성' : '전체'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">거주지</span>
            <p className="font-semibold text-lg">{getRegionLabel(conditions.region)}</p>
          </div>
        </div>
      </div>

      {/* 복지 혜택 목록 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          조건에 맞는 복지 혜택 ({benefits.length}개)
        </h2>
        
        {benefits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">조건에 맞는 복지 혜택을 찾지 못했습니다.</p>
            <p className="text-gray-500 text-sm mt-2">조건을 변경하여 다시 시도해보세요.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              조건 다시 입력하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                onClick={() => handleBenefitClick(benefit.id)}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:shadow-md cursor-pointer transition-all duration-200"
              >
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  {benefit.name}
                </h3>
                <p className="text-gray-700 mb-3 line-clamp-2">{benefit.description}</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  {benefit.age_condition && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      {benefit.age_condition}
                    </span>
                  )}
                  {benefit.gender && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                      {benefit.gender}
                    </span>
                  )}
                  {benefit.region && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                      {benefit.region === '전국' ? '전국' : getRegionLabel(benefit.region)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BenefitList; 