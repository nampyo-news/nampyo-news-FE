/**
 * BigKinds API 관련 타입 정의 및 API 호출 함수
 */

export interface NewsArticle {
  news_id: string
  title: string
  provider: string
  byline: string
  provider_link_page: string
  dateline: string
  keyword: string[] | null
  side: string | null
}

export interface BigKindsRequest {
  query: string
  to_timestamp: string
  from_timestamp: string
  provider: string[]
  return_size: number
}

export interface TopNKeywords {
  blue: string[]
  red: string[]
  middle: string[]
}

export interface BigKindsResponse {
  status: string
  data_size?: number
  data: NewsArticle[]
  keywords?: string[]
  top_n_keywords?: TopNKeywords
}

/**
 * BigKinds API에서 뉴스 정보를 가져옵니다
 */
export async function fetchBigKindsNews(
  request: BigKindsRequest,
  options?: { signal?: AbortSignal }
): Promise<BigKindsResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_BIGKINDS_API_URL || 
    'http://localhost:8000/public/v1/news/bigkinds/get_info'

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: options?.signal,
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * ISO 날짜 문자열을 읽기 쉬운 형식으로 변환
 */
export function formatDisplayDate(isoDate: string): string {
  const date = new Date(isoDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}.${month}.${day} ${hours}:${minutes}`
}
