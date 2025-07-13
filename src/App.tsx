import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ConditionInput from './components/ConditionInput';
import BenefitList from './components/BenefitList';
import BenefitDetail from './components/BenefitDetail';
import { Benefit, Conditions } from './types';
import { supabase } from './lib/supabaseClient';

function App() {
  const [conditions, setConditions] = useState<Conditions | null>(null);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 이 함수는 이제 ConditionInput 내부로 이동하거나 다른 방식으로 처리될 것입니다.
  // 여기서는 라우팅을 위한 컨테이너 역할만 수행합니다.
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
            맞춤형 복지 혜택 조회
          </h1>
          
          <Routes>
            <Route 
              path="/" 
              element={
                <ConditionInput 
                  setConditions={setConditions}
                  setBenefits={setBenefits} 
                  setLoading={setLoading}
                  setError={setError}
                />
              } 
            />
            <Route 
              path="/benefits" 
              element={
                <BenefitList 
                  benefits={benefits}
                  conditions={conditions}
                  loading={loading}
                  error={error}
                />
              } 
            />
            <Route 
              path="/benefit/:id" 
              element={<BenefitDetail />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 