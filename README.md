# 복지 혜택 조회 서비스

PRD에 따라 개발된 맞춤형 복지 혜택 조회 웹앱입니다.

## 🎯 목적

디지털 접근성이 낮은 노년층도 로그인 없이 쉽게 사용할 수 있는 "맞춤형 복지 혜택 조회 웹앱"입니다.  
복잡한 절차 없이 본인의 나이, 성별, 거주지 조건만 입력하면 관련 복지 서비스를 보여줍니다.

## 🧭 주요 기능

1. **조건 입력 페이지**
   - 나이 (숫자 입력)
   - 성별 (남성 / 여성)
   - 거주지 (시/군/구 혹은 광역시/도)

2. **복지 혜택 결과 페이지**
   - 조건에 맞는 복지 목록 필터링
   - 각 항목 클릭 시 상세 설명 페이지로 이동

3. **상세 페이지**
   - 복지 혜택명
   - 신청 대상 요건
   - 신청 방법
   - 제공 기관 및 문의처

## 🛠️ 기술 스택

- **프론트엔드**: React + TypeScript + Vite
- **스타일링**: TailwindCSS
- **라우팅**: React Router DOM
- **개발 툴**: Cursor (AI 코드 생성 기반)

## 📦 설치 및 실행

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 방법

1. 의존성 설치
```bash
npm install
```

2. 개발 서버 실행
```bash
npm run dev
```

3. 브라우저에서 `http://localhost:5173` 접속

### 빌드

```bash
npm run build
```

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── ConditionInput.tsx    # 조건 입력 컴포넌트
│   ├── BenefitList.tsx       # 복지 혜택 목록 컴포넌트
│   └── BenefitDetail.tsx     # 복지 혜택 상세 컴포넌트
├── types.ts                  # TypeScript 타입 정의
├── App.tsx                   # 메인 앱 컴포넌트
├── main.tsx                  # 앱 진입점
└── index.css                 # 전역 스타일
```

## 🎨 UI/UX 특징

- **노년층 친화적 디자인**: 큰 폰트, 명확한 레이블, 직관적인 인터페이스
- **반응형 디자인**: 모바일과 데스크톱에서 모두 최적화된 경험
- **접근성 고려**: 키보드 네비게이션, 스크린 리더 지원
- **사용자 친화적**: 로그인 없이 바로 사용 가능

## 📊 데이터 구조

```typescript
interface Benefit {
  id: number;
  name: string;
  age_condition: string;
  gender: string;
  region: string;
  description: string;
  how_to_apply: string;
  organization: string;
  contact: string;
}
```

## 🚀 향후 계획

- [ ] Supabase 연동으로 실제 데이터베이스 사용
- [ ] 더 많은 복지 혜택 데이터 추가
- [ ] 검색 및 필터링 기능 강화
- [ ] PWA 지원으로 앱처럼 사용 가능
- [ ] 다국어 지원 (영어, 중국어 등)

## 📝 라이선스

MIT License 