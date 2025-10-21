"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, TrendingUp, Newspaper, BarChart3, Search, Filter } from "lucide-react"
import { KeywordCloud } from "@/components/keyword-cloud"
import { NewspaperComparison } from "@/components/newspaper-comparison"
import { SentimentChart } from "@/components/sentiment-chart"
import { NewsGrid } from "@/components/news-grid"
import { NewsArticleList } from "@/components/news-article-list"
import { useSSE } from "@/hooks/use-sse"
import { fetchBigKindsNews, formatDateToYYYYMMDD, NewsArticle, BigKindsResponse, TopNKeywords } from "@/lib/api"

export default function NewsSummaryApp() {
  const [selectedDate, setSelectedDate] = useState("로딩 중...")
  const [activeView, setActiveView] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  
  // BigKinds API 관련 상태
  const [bigkindsQuery, setBigkindsQuery] = useState("")
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [totalArticles, setTotalArticles] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [topNKeywords, setTopNKeywords] = useState<TopNKeywords | null>(null)
  
  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 25
  
  const SSE_ENDPOINT_URL =
    process.env.NEXT_PUBLIC_SSE_ENDPOINT_URL || "http://127.0.0.1:8000/public/v1/news/sse"
  
  // 검색어가 없으면 기본값 "경제" 사용
  const effectiveQuery = searchQuery.trim() || "경제"
  const { lastMessage } = useSSE<any>(SSE_ENDPOINT_URL, {
    query: { query: effectiveQuery }
  })

  // RFC822 등 다양한 날짜 문자열을 'YYYY.MM.DD'로 정규화
  const formatYMD = (dateStr?: string) => {
    if (!dateStr) return undefined
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}.${m}.${day}`
  }

  useEffect(() => {
    if (!lastMessage) return
    // /sse 표준 응답: { lastBuildDate, items: [...] }
    const lb = (lastMessage as any).lastBuildDate as string | undefined
    const firstItem = Array.isArray((lastMessage as any).items)
      ? (lastMessage as any).items[0]
      : undefined
    const pd = firstItem?.pubDate as string | undefined
    const formatted = formatYMD(lb || pd)
    if (formatted) setSelectedDate(formatted)
  }, [lastMessage])

  // BigKinds API 호출 함수
  const handleBigKindsSearch = async () => {
    if (!bigkindsQuery.trim()) {
      alert("검색어를 입력해주세요.")
      return
    }

    setIsLoading(true)
    setIsTyping(false)
    setCurrentPage(1) // 새로운 검색 시 첫 페이지로 리셋
    try {
      const response: BigKindsResponse = await fetchBigKindsNews({
        query: bigkindsQuery,
        from_timestamp: fromDate ? formatDateToYYYYMMDD(fromDate) : "",
        to_timestamp: toDate ? formatDateToYYYYMMDD(toDate) : "",
        provider: ["경향신문", "한겨레", "중앙일보", "조선일보", "동아일보"],
        return_size: 5000
      })

      if (response.status === "success") {
        setNewsArticles(response.data)
        setTotalArticles(response.data_size || response.data.length)
        setTopNKeywords(response.top_n_keywords || null)
      } else {
        alert("데이터를 가져오는데 실패했습니다.")
      }
    } catch (error) {
      console.error("BigKinds API 오류:", error)
      alert("API 요청 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  // 디바운스를 위한 타이머 효과
  useEffect(() => {
    if (!bigkindsQuery.trim()) {
      setIsTyping(false)
      return
    }

    setIsTyping(true)
    const debounceTimer = setTimeout(() => {
      setIsTyping(false)
    }, 1500) // 1.5초 동안 입력이 없으면 타이핑 완료로 간주

    return () => clearTimeout(debounceTimer)
  }, [bigkindsQuery])

  // 분석 신문사 목록
  const PROVIDERS = ["경향신문", "한겨레", "중앙일보", "조선일보", "동아일보"]

  // 페이지네이션 계산
  const totalPages = Math.ceil(newsArticles.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentArticles = newsArticles.slice(startIndex, endIndex)

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // 페이지 변경 시 스크롤을 기사 목록 상단으로 이동
    const articlesSection = document.getElementById('articles-section')
    if (articlesSection) {
      articlesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // 페이지 번호 배열 생성 (최대 5개만 표시)
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 현재 페이지 기준으로 앞뒤 2개씩 표시
      let start = Math.max(1, currentPage - 2)
      let end = Math.min(totalPages, currentPage + 2)
      
      // 시작이 1이 아니면 1 추가
      if (start > 1) {
        pages.push(1)
        if (start > 2) pages.push('...')
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      // 끝이 totalPages가 아니면 totalPages 추가
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif text-primary">NEWS SUMMARY</h1>
              <p className="text-muted-foreground mt-1">뉴스 요약 및 분석 시스템</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="검색어 입력 (기본: 경제)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{selectedDate}</span>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-transparent">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                개요
              </TabsTrigger>
              <TabsTrigger value="keywords" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                키워드 분석
              </TabsTrigger>
              <TabsTrigger value="newspapers" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                신문사 비교
              </TabsTrigger>
              <TabsTrigger value="sentiment" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                성향 분석
              </TabsTrigger>
              <TabsTrigger value="articles" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                기사 목록
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeView} className="w-full">
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* 검색 인터페이스 */}
            <Card>
              <CardHeader>
                <CardTitle>빅카인즈 뉴스 검색</CardTitle>
                <p className="text-sm text-muted-foreground">
                  키워드와 기간을 설정하여 5개 주요 신문사의 기사를 검색합니다
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 검색어 입력 */}
                    <div className="md:col-span-1">
                      <label className="text-sm font-medium mb-2 block">검색어</label>
                      <Input
                        placeholder="예: 캄보디아"
                        value={bigkindsQuery}
                        onChange={(e) => setBigkindsQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleBigKindsSearch()
                        }}
                      />
                    </div>
                    {/* 시작 날짜 */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">시작 날짜</label>
                      <Input
                        type="date"
                        value={fromDate ? formatDateToYYYYMMDD(fromDate) : ""}
                        onChange={(e) => setFromDate(e.target.value ? new Date(e.target.value) : undefined)}
                        max={toDate ? formatDateToYYYYMMDD(toDate) : undefined}
                      />
                    </div>
                    {/* 종료 날짜 */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">종료 날짜</label>
                      <Input
                        type="date"
                        value={toDate ? formatDateToYYYYMMDD(toDate) : ""}
                        onChange={(e) => setToDate(e.target.value ? new Date(e.target.value) : undefined)}
                        min={fromDate ? formatDateToYYYYMMDD(fromDate) : undefined}
                      />
                    </div>
                  </div>
                  {/* 신문사 정보 */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">분석 대상 신문사</label>
                    <div className="flex flex-wrap gap-2">
                      {PROVIDERS.map((provider) => (
                        <Badge key={provider} variant="secondary">
                          {provider}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {/* 검색 버튼 */}
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={handleBigKindsSearch} 
                      className="w-full md:w-auto"
                      disabled={isLoading || isTyping}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      {isLoading ? "검색 중..." : "검색"}
                    </Button>
                    {isTyping && (
                      <span className="text-sm text-muted-foreground animate-pulse">
                        입력 중...
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 시각화 차트 (작게, 검색과 기사 사이) */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 my-4">
              <Card className="py-3 px-3">
                <CardHeader className="pb-1">
                  <CardTitle className="text-base font-semibold">키워드</CardTitle>
                </CardHeader>
                <CardContent className="px-2">
                  {/* 진영별 기사 수 계산 및 전체 키워드 빈도 계산 */}
                  {(() => {
                    const sideCounts = { blue: 0, red: 0, middle: 0 };
                    let allKeywordsArr: string[] = [];
                    newsArticles.forEach(article => {
                      if (Array.isArray(article.keyword)) {
                        allKeywordsArr = allKeywordsArr.concat(article.keyword);
                      }
                      if (!article.side) return;
                      const side = article.side.toLowerCase();
                      if (side.includes('blue') || side.includes('진보') || side.includes('좌')) sideCounts.blue++;
                      else if (side.includes('red') || side.includes('보수') || side.includes('우')) sideCounts.red++;
                      else if (side.includes('middle') || side.includes('중도')) sideCounts.middle++;
                    });
                    // 전체 키워드 개수
                    const totalKeywordCount = allKeywordsArr.length;
                    // 키워드별 빈도수
                    const keywordFreq: Record<string, number> = {};
                    allKeywordsArr.forEach(k => {
                      keywordFreq[k] = (keywordFreq[k] || 0) + 1;
                    });

                    // 진영별 기사 분류
                    const blueArticles = newsArticles.filter(a => a.side && (a.side.toLowerCase().includes('blue') || a.side.includes('진보') || a.side.includes('좌')));
                    const redArticles = newsArticles.filter(a => a.side && (a.side.toLowerCase().includes('red') || a.side.includes('보수') || a.side.includes('우')));
                    const middleArticles = newsArticles.filter(a => a.side && (a.side.toLowerCase().includes('middle') || a.side.includes('중도')));

                    // 진영별 키워드 빈도 및 전체 개수
                    function getTopKeywordsAndFreq(articles: any[], n: number) {
                      const freq: Record<string, number> = {};
                      let total = 0;
                      articles.forEach(a => {
                        if (Array.isArray(a.keyword)) {
                          a.keyword.forEach((k: string) => {
                            freq[k] = (freq[k] || 0) + 1;
                            total++;
                          });
                        }
                      });
                      const top = Object.entries(freq)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, n)
                        .map(([k]) => k);
                      return { top, freq, total };
                    }
                    const blueStats = getTopKeywordsAndFreq(blueArticles, 10);
                    const redStats = getTopKeywordsAndFreq(redArticles, 10);
                    const middleStats = getTopKeywordsAndFreq(middleArticles, 10);

                    const topNKeywords = { blue: blueStats.top, red: redStats.top, middle: middleStats.top };
                    const perSideKeywordFreq = { blue: blueStats.freq, red: redStats.freq, middle: middleStats.freq };
                    const perSideTotal = { blue: blueStats.total, red: redStats.total, middle: middleStats.total };

                    return (
                      <KeywordCloud 
                        topNKeywords={topNKeywords} 
                        sideCounts={sideCounts}
                        newsArticles={newsArticles}
                        overlapStyleLimit={10}
                        totalKeywordCount={totalKeywordCount}
                        keywordFreq={keywordFreq}
                        perSideKeywordFreq={perSideKeywordFreq}
                        perSideTotal={perSideTotal}
                      />
                    );
                  })()}
                </CardContent>
              </Card>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">총 기사 수</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {totalArticles.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {bigkindsQuery ? `"${bigkindsQuery}" 검색 결과` : "검색어를 입력하세요"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">검색 키워드</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">
                    {bigkindsQuery || "-"}
                  </div>
                  <p className="text-xs text-muted-foreground">현재 검색어</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">검색 기간</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">
                    {fromDate && toDate 
                      ? `${Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))}일`
                      : "전체"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {fromDate && toDate
                      ? `${formatYMD(fromDate.toISOString())} ~ ${formatYMD(toDate.toISOString())}`
                      : "기간 미설정"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">분석 신문사</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{PROVIDERS.length}개</div>
                  <p className="text-xs text-muted-foreground">주요 일간지</p>
                </CardContent>
              </Card>
            </div>

            {/* 기사 목록 */}
            {(newsArticles.length > 0 || isLoading) && (
              <Card id="articles-section">
                <CardHeader>
                  <CardTitle>검색 결과</CardTitle>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      총 {totalArticles.toLocaleString()}개의 기사가 검색되었습니다
                    </p>
                    {!isLoading && newsArticles.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {startIndex + 1}-{Math.min(endIndex, newsArticles.length)} 표시 중
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <NewsArticleList articles={currentArticles} isLoading={isLoading} />
                  {/* 페이지네이션 */}
                  {!isLoading && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                      {/* 이전 버튼 */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        이전
                      </Button>
                      {/* 페이지 번호 */}
                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                          page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                              ...
                            </span>
                          ) : (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page as number)}
                              className={currentPage === page ? "pointer-events-none" : ""}
                            >
                              {page}
                            </Button>
                          )
                        ))}
                      </div>
                      {/* 다음 버튼 */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        다음
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Keywords Tab */}
          <TabsContent value="keywords" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>당일 키워드 분석</CardTitle>
                <p className="text-sm text-muted-foreground">{selectedDate} 주요 키워드 및 연관 분석</p>
              </CardHeader>
              <CardContent>
                <KeywordCloud detailed />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>키워드 트렌드</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["경제정책", "국정감사", "부동산", "교육개혁", "환경정책"].map((keyword, index) => (
                      <div key={keyword} className="flex items-center justify-between">
                        <span className="font-medium">{keyword}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${(5 - index) * 20}%` }} />
                          </div>
                          <span className="text-sm text-muted-foreground">{324 - index * 50}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>연관 키워드</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "금리인상",
                      "주택시장",
                      "정책금융",
                      "경기부양",
                      "재정정책",
                      "통화정책",
                      "부동산규제",
                      "세제개편",
                    ].map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Newspapers Tab */}
          <TabsContent value="newspapers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>신문사별 보도 비교</CardTitle>
                <p className="text-sm text-muted-foreground">동일 이슈에 대한 각 신문사의 관점과 보도 성향</p>
              </CardHeader>
              <CardContent>
                <NewspaperComparison />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sentiment Tab */}
          <TabsContent value="sentiment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>신문사별 정치 성향 분석</CardTitle>
                <p className="text-sm text-muted-foreground">기사 내용 분석을 통한 정치적 성향 매핑</p>
              </CardHeader>
              <CardContent>
                <SentimentChart detailed />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>진보 성향 키워드</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {["사회복지", "노동권", "환경보호", "평등사회", "시민참여"].map((keyword) => (
                      <div key={keyword} className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-chart-1 rounded-full" />
                        <span className="text-sm">{keyword}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>보수 성향 키워드</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {["경제성장", "안보강화", "전통가치", "시장경제", "법질서"].map((keyword) => (
                      <div key={keyword} className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-chart-4 rounded-full" />
                        <span className="text-sm">{keyword}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>주요 기사 목록</CardTitle>
                <p className="text-sm text-muted-foreground">{selectedDate} 주요 뉴스 기사 및 키워드 분석</p>
              </CardHeader>
              <CardContent>
                <NewsGrid searchQuery={effectiveQuery} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
