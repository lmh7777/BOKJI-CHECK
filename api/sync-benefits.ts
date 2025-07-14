import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { XMLParser } from 'fast-xml-parser';

// Supabase 'benefits' 테이블의 데이터 타입 정의
interface Benefit {
  service_id: string; // 서비스 ID
  name: string; // 서비스명
  description: string; // 서비스 요약
  department: string; // 소관부처명
  summary: string; // 지원내용
  target_criteria: string; // 지원대상
  application_method: string; // 신청방법
  service_url?: string; // 서비스 상세 URL
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // --- 디버깅 단계 ---
  // Vercel 서버에서 어떤 환경 변수를 실제로 읽을 수 있는지 확인합니다.
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  const publicDataApiKey = process.env.PUBLIC_DATA_API_KEY;

  // 누락된 변수들을 추적하기 위한 배열
  const missingVars: string[] = [];
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseServiceKey) missingVars.push('SUPABASE_SERVICE_KEY');
  if (!publicDataApiKey) missingVars.push('PUBLIC_DATA_API_KEY');

  // 만약 누락된 변수가 하나라도 있다면, 어떤 변수가 없는지 알려주는 상세한 오류 메시지를 반환합니다.
  if (missingVars.length > 0) {
    const debugMessage = `다음 환경 변수가 누락되었거나 이름이 잘못되었습니다: ${missingVars.join(', ')}. Vercel 프로젝트의 'Settings > Environment Variables'에서 이름(KEY)과 값(VALUE)을 다시 한번 확인해주세요.`;
    console.error(debugMessage);
    return res.status(500).json({
      success: false,
      message: '필수 환경 변수 설정 오류',
      debug_info: debugMessage,
    });
  }

  try {
    console.log('데이터 동기화 함수 시작 (모든 환경 변수 확인 완료).');
    // 위에서 null 체크를 통과했으므로, 이 시점에서는 변수들이 항상 string 타입임을 보장할 수 있습니다.
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    console.log('Supabase 클라이언트 생성 완료.');

    // 1. 공공데이터 API 호출
    const apiUrl = `http://www.bokjiro.go.kr/openapi/rest/gvmtWelSvc?crtiKey=${publicDataApiKey}&callTp=L`;
    console.log(`API 호출: ${apiUrl.replace(publicDataApiKey!, '***')}`);

    const apiResponse = await fetch(apiUrl);
    if (!apiResponse.ok) {
      throw new Error(`API 호출 실패: ${apiResponse.status} ${apiResponse.statusText}`);
    }
    const xmlData = await apiResponse.text();
    console.log('API 응답(XML) 수신 완료.');

    // 2. XML 데이터 파싱
    const parser = new XMLParser();
    const parsedData = parser.parse(xmlData);
    const services = parsedData.servList.serv;
    console.log(`파싱된 서비스 개수: ${services.length}`);

    // 3. 데이터 정제 및 DB 형식으로 변환
    const benefits: Benefit[] = services.map((service: any) => ({
      service_id: service.servId,
      name: service.servNm,
      description: service.servDgst,
      department: service.jurMnofNm,
      summary: service.slctCritCn,
      target_criteria: service.sprtCtenCn,
      application_method: service.aplyMtdCn,
      service_url: service.servDtlLink,
    }));
    console.log('데이터 정제 완료. DB 저장 준비.');

    // 4. Supabase DB에 저장 (Upsert)
    const { error } = await supabase
      .from('benefits')
      .upsert(benefits, { onConflict: 'service_id' });

    if (error) {
      console.error('DB 저장 오류:', error);
      throw error;
    }

    console.log('데이터 동기화 성공적으로 완료.');
    res.status(200).json({
      success: true,
      message: `${services.length}개의 복지 데이터가 성공적으로 동기화되었습니다.`,
      data: benefits.slice(0, 5) // 샘플로 5개 데이터만 응답에 포함
    });

  } catch (error: any) {
    console.error('데이터 동기화 중 심각한 오류 발생:', error);
    res.status(500).json({ success: false, message: `서버 오류: ${error.message}` });
  }
} 