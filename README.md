# NAMPYO News Analysis Platform - Frontend

## 📋 프로젝트 개요

NAMPYO(News Analysis and Media Perspective Yielding Overview)는 한국 주요 언론사의 뉴스 기사를 수집하고 분석하여 언론사별 보도 성향과 키워드를 시각화하는 웹 기반 플랫폼입니다. 본 시스템은 진보·보수 성향 언론사의 보도 차이를 객관적으로 분석하고, 사용자에게 균형 잡힌 뉴스 소비 환경을 제공합니다.

### 주요 기능

- **뉴스 검색 및 수집**: BigKinds API를 통한 대규모 뉴스 데이터 수집
- **성향별 분석**: 진보(경향신문, 한겨레)와 보수(조선일보, 동아일보) 언론사의 보도 비교
- **키워드 추출 및 시각화**: 언론사별 주요 키워드 분석 및 교차 비교
- **실시간 데이터 스트리밍**: Server-Sent Events(SSE)를 통한 실시간 뉴스 업데이트
- **반응형 대시보드**: 다양한 차트와 그래프를 통한 직관적인 데이터 시각화

## 🏗️ 기술 스택

### Frontend Framework
- **Next.js 15.2.4**: React 기반의 풀스택 프레임워크
  - App Router 사용으로 향상된 라우팅 및 레이아웃 관리
  - Server Components와 Client Components의 효율적인 분리
  - 자동 코드 스플리팅 및 최적화

- **React 19**: 최신 React 버전
  - Client-side 인터랙션 및 상태 관리
  - Hooks 기반 컴포넌트 구조

- **TypeScript 5**: 정적 타입 시스템
  - 타입 안정성 보장
  - 개발 생산성 향상 및 런타임 에러 방지

### UI/UX Libraries
- **Tailwind CSS 4.1.9**: 유틸리티 우선 CSS 프레임워크
  - 반응형 디자인 구현
  - 커스텀 디자인 시스템 구축

- **Radix UI**: 접근성이 보장된 UI 컴포넌트 라이브러리
  - 27개 이상의 프리미티브 컴포넌트 활용
  - ARIA 표준 준수 및 키보드 네비게이션 지원

- **shadcn/ui**: Radix UI 기반의 재사용 가능한 컴포넌트
  - 일관된 디자인 시스템
  - 커스터마이징 가능한 컴포넌트 라이브러리

### Data Visualization
- **Recharts 2.15.4**: React 기반 차트 라이브러리
  - 언론사별 키워드 분포 시각화
  - 성향 스펙트럼 차트
  - 시계열 데이터 표현

### Form & Validation
- **React Hook Form 7.60.0**: 폼 상태 관리
  - 비제어 컴포넌트 방식으로 성능 최적화
  - 최소한의 리렌더링

- **Zod 3.25.67**: 스키마 기반 유효성 검증
  - TypeScript 타입 추론
  - 런타임 데이터 검증

### Additional Libraries
- **date-fns 4.1.0**: 날짜 처리 유틸리티
- **Lucide React**: 아이콘 시스템
- **Embla Carousel**: 이미지 캐러셀
- **Sonner**: Toast 알림 시스템

## 🎨 아키텍처

### 컴포넌트 구조
```
app/
├── page.tsx              # 메인 페이지 (검색 폼, 데이터 통합)
├── layout.tsx            # 루트 레이아웃
└── globals.css           # 전역 스타일

components/
├── ui/                   # shadcn/ui 기본 컴포넌트
│   ├── card.tsx
│   ├── button.tsx
│   ├── input.tsx
│   ├── tabs.tsx
│   └── ...
├── keyword-cloud.tsx     # 키워드 클라우드 시각화
├── sentiment-chart.tsx   # 언론사 성향 차트
├── news-article-list.tsx # 뉴스 기사 목록
├── news-grid.tsx         # 뉴스 그리드 뷰
└── newspaper-comparison.tsx # 언론사 비교 차트

lib/
├── api.ts               # API 호출 함수 및 타입 정의
├── utils.ts             # 유틸리티 함수
└── cn.ts                # Tailwind 클래스 병합

hooks/
└── use-sse.ts           # Server-Sent Events 커스텀 훅
```

### 데이터 플로우

1. **사용자 입력**: 검색어, 날짜 범위, 언론사 선택
2. **API 요청**: BigKinds API로 POST 요청 전송
3. **데이터 처리**: 
   - 뉴스 기사 데이터 수신 및 파싱
   - 언론사별 성향(side) 분류
   - 키워드 추출 및 빈도 계산
4. **상태 관리**: React useState 훅으로 로컬 상태 관리
5. **UI 렌더링**: 
   - 키워드 클라우드
   - 성향 차트
   - 기사 목록 (페이지네이션)

### 실시간 업데이트 (SSE)

```typescript
// hooks/use-sse.ts 활용
const { lastMessage } = useSSE<any>(SSE_ENDPOINT_URL, {
  query: { query: effectiveQuery }
})
```

- Server-Sent Events를 통한 단방향 실시간 통신
- 백엔드에서 새로운 뉴스 데이터 푸시
- 자동 재연결 메커니즘 구현

## 🔍 핵심 기능 상세

### 1. 언론사별 키워드 분석

**알고리즘**:
- 각 언론사의 뉴스 기사에서 키워드 추출
- 빈도수 기반 상위 N개 키워드 선정
- 교차 분석을 통한 공통/독립 키워드 식별

**시각화**:
- 진보 성향: 파란색 계열 (blue-500, blue-600)
- 보수 성향: 빨간색 계열 (red-500, red-600)
- 겹치는 키워드: 연한 색상 + 작은 크기로 표현
- 독립 키워드: 진한 색상 + 큰 크기로 강조

**코드 예시**:
```typescript
interface TopNKeywords {
  blue: string[]    // 진보 성향 키워드
  red: string[]     // 보수 성향 키워드
  middle: string[]  // 중도 성향 키워드 (현재 미사용)
}

// 키워드 교차 분석
const overlap = new Set([
  ...topNKeywords.blue.filter(k => redSet.has(k)),
  ...topNKeywords.red.filter(k => blueSet.has(k))
])
```

### 2. 뉴스 기사 검색 및 필터링

**BigKinds API 통합**:
```typescript
interface BigKindsRequest {
  query: string           // 검색어
  from_timestamp: string  // 시작일 (YYYYMMDD)
  to_timestamp: string    // 종료일 (YYYYMMDD)
  provider: string[]      // 언론사 목록
  return_size: number     // 최대 결과 수
}
```

**검색 프로세스**:
1. 사용자 입력 검증
2. 날짜 포맷 변환 (Date → YYYYMMDD)
3. API 요청 전송 (POST)
4. 응답 데이터 파싱 및 상태 업데이트
5. 에러 핸들링 및 로딩 상태 관리

### 3. 페이지네이션

- 25개 기사 단위로 페이지 분할
- 최대 5개 페이지 번호 표시
- 스크롤 자동 이동으로 UX 향상

```typescript
const ITEMS_PER_PAGE = 25
const totalPages = Math.ceil(newsArticles.length / ITEMS_PER_PAGE)
const currentArticles = newsArticles.slice(startIndex, endIndex)
```

### 4. 반응형 디자인

- 모바일, 태블릿, 데스크톱 대응
- Tailwind CSS 브레이크포인트 활용
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px

## 🚀 시작하기

### 사전 요구사항

- Node.js 18.x 이상
- pnpm 8.x 이상 (또는 npm, yarn)

### 설치

```bash
# 의존성 설치
pnpm install

# 또는
npm install
```

### 환경 변수 설정

`.env.local` 파일 생성:

```env
# BigKinds API 엔드포인트
NEXT_PUBLIC_BIGKINDS_API_URL=http://localhost:8000/public/v1/news/bigkinds/get_info

# SSE 엔드포인트
NEXT_PUBLIC_SSE_ENDPOINT_URL=http://localhost:8000/public/v1/news/sse
```

### 개발 서버 실행

```bash
# 개발 모드
pnpm dev

# 브라우저에서 http://localhost:3000 접속
```

### 프로덕션 빌드

```bash
# 빌드
pnpm build

# 프로덕션 서버 시작
pnpm start
```

### Docker 배포

```bash
# Docker 이미지 빌드
docker build -t nampyo-frontend .

# 컨테이너 실행
docker-compose up -d
```

## 📊 성능 최적화

### 1. 코드 스플리팅
- Next.js 자동 코드 스플리팅
- 동적 임포트를 통한 지연 로딩

### 2. 이미지 최적화
- Next.js Image 컴포넌트 활용
- WebP 포맷 자동 변환
- Lazy loading 적용

### 3. 번들 크기 최적화
- Tree shaking
- 불필요한 의존성 제거
- 모듈 번들 분석 (webpack-bundle-analyzer)

### 4. 렌더링 최적화
- React.memo를 통한 불필요한 리렌더링 방지
- useMemo, useCallback 훅 활용
- 가상화된 리스트 (향후 구현 예정)

## 🧪 테스트

```bash
# 단위 테스트 (향후 구현)
pnpm test

# E2E 테스트 (향후 구현)
pnpm test:e2e
```

## 📈 향후 개발 계획

### 기능 개선
- [ ] 사용자 인증 시스템
- [ ] 북마크 및 즐겨찾기 기능
- [ ] 기사 상세 분석 페이지
- [ ] 감정 분석(Sentiment Analysis) 통합
- [ ] 데이터 내보내기 (CSV, JSON)

### 기술적 개선
- [ ] React Query 도입으로 서버 상태 관리 개선
- [ ] Storybook 통합으로 컴포넌트 문서화
- [ ] Jest + Testing Library 단위 테스트
- [ ] Playwright E2E 테스트
- [ ] 성능 모니터링 (Vercel Analytics, Sentry)

### UI/UX 개선
- [ ] 다크 모드 지원
- [ ] 키보드 단축키
- [ ] 접근성(a11y) 향상
- [ ] 애니메이션 효과 추가

## 🤝 기여 방법

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

This project is licensed under the MIT License.

## 👥 개발팀

- Frontend Development: [Your Team]
- Backend Integration: [Backend Team]
- UI/UX Design: [Design Team]

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**Built with ❤️ using Next.js and React**