# 개요 페이지 수정 내역

## 변경 사항 요약

### 1. 환경 변수 설정 (.env.local)
- BigKinds API 엔드포인트 URL 추가
```bash
NEXT_PUBLIC_BIGKINDS_API_URL=http://localhost:8000/public/v1/news/bigkinds/get_info
```

### 2. API 서비스 파일 생성 (lib/api.ts)
새로운 API 유틸리티 파일을 생성하여 BigKinds API와의 통신 로직을 구현했습니다.

**주요 기능:**
- `NewsArticle` 타입: 뉴스 기사 데이터 구조
- `BigKindsRequest` 타입: API 요청 파라미터
- `BigKindsResponse` 타입: API 응답 구조
- `fetchBigKindsNews()`: BigKinds API 호출 함수
- `formatDateToYYYYMMDD()`: 날짜를 YYYY-MM-DD 형식으로 변환
- `formatDisplayDate()`: ISO 날짜를 읽기 쉬운 형식으로 변환

### 3. 뉴스 기사 목록 컴포넌트 (components/news-article-list.tsx)
검색된 기사들을 카드 형식으로 표시하는 새로운 컴포넌트를 생성했습니다.

**주요 기능:**
- 로딩 상태 표시 (스켈레톤 UI)
- 검색 결과 없음 메시지
- 기사 카드 레이아웃:
  - 제목 (클릭 시 원문 링크로 이동)
  - 신문사 배지
  - 기자명
  - 게시일시
  - 키워드 (있는 경우)
  - 정치 성향 (있는 경우)

### 4. 메인 페이지 수정 (app/page.tsx)

#### 새로운 상태 관리
- `bigkindsQuery`: 검색어
- `fromDate`: 검색 시작 날짜
- `toDate`: 검색 종료 날짜
- `newsArticles`: 검색된 기사 목록
- `totalArticles`: 총 기사 수
- `isLoading`: 로딩 상태

#### 검색 인터페이스 추가
개요 탭 상단에 검색 카드를 추가했습니다:
- 검색어 입력 필드
- 시작 날짜 선택 (date input)
- 종료 날짜 선택 (date input)
- 분석 대상 신문사 표시 (5개: 경향신문, 한겨레, 중앙일보, 조선일보, 동아일보)
- 검색 버튼

#### 통계 카드 업데이트
기존 하드코딩된 값들을 실제 검색 결과로 대체:
- **총 기사 수**: API에서 반환된 `data_size` 값 표시
- **검색 키워드**: 입력한 검색어 표시
- **검색 기간**: 선택한 날짜 범위 표시 (일 수 계산)
- **분석 신문사**: 5개 고정

#### 검색 결과 표시
검색 실행 후 통계 카드 하단에 기사 목록이 표시됩니다:
- 총 검색 결과 수 표시
- 기사 카드 목록 (NewsArticleList 컴포넌트 사용)

## API 요청 형식

```typescript
{
  "query": "캄보디아",              // 검색어
  "to_timestamp": "2025-10-20",    // 종료일 (YYYY-MM-DD)
  "from_timestamp": "2025-10-01",  // 시작일 (YYYY-MM-DD)
  "provider": [                     // 신문사 목록 (고정)
    "경향신문",
    "한겨레",
    "중앙일보",
    "조선일보",
    "동아일보"
  ],
  "return_size": 5000               // 최대 반환 개수
}
```

## API 응답 처리

```typescript
{
  "status": "success",
  "data_size": 123,
  "data": [
    {
      "news_id": "01100101.20251020224458001",
      "title": "기사 제목",
      "provider": "경향신문",
      "byline": "기자명",
      "provider_link_page": "https://...",
      "published_at": "2025-10-20T00:00:00.000+09:00",
      "keyword": null,
      "side": null
    }
  ]
}
```

## 사용 방법

1. 개요 탭에서 검색어를 입력합니다 (예: "캄보디아")
2. 원하는 경우 시작 날짜와 종료 날짜를 선택합니다 (선택사항)
3. "검색" 버튼을 클릭합니다
4. 검색 결과가 통계 카드에 반영되고, 하단에 기사 목록이 표시됩니다
5. 기사 제목이나 외부 링크 아이콘을 클릭하면 원문 페이지로 이동합니다

## 주요 특징

- **반응형 디자인**: 모바일, 태블릿, 데스크톱에서 모두 잘 보입니다
- **로딩 상태**: 검색 중에는 스켈레톤 UI를 표시합니다
- **에러 처리**: API 오류 시 알림을 표시합니다
- **날짜 유효성**: 시작 날짜는 종료 날짜보다 늦을 수 없습니다
- **키보드 지원**: 검색어 입력 후 Enter 키로 검색 가능
- **실시간 카운터**: 총 기사 수가 천 단위 구분자와 함께 표시됩니다
