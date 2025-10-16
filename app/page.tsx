"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, TrendingUp, Newspaper, BarChart3, Search, Filter } from "lucide-react"
import { KeywordCloud } from "@/components/keyword-cloud"
import { NewspaperComparison } from "@/components/newspaper-comparison"
import { SentimentChart } from "@/components/sentiment-chart"
import { NewsGrid } from "@/components/news-grid"
import { useEffect } from "react"
import { useSSE } from "@/hooks/use-sse"

export default function NewsSummaryApp() {
  const [selectedDate, setSelectedDate] = useState("로딩 중...")
  const [activeView, setActiveView] = useState("overview")
  const SSE_ENDPOINT_URL =
    process.env.NEXT_PUBLIC_SSE_ENDPOINT_URL || "http://127.0.0.1:8000/public/v1/news/sse"
  const { lastMessage } = useSSE<any>(SSE_ENDPOINT_URL)

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">총 기사 수</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">1,247</div>
                  <p className="text-xs text-muted-foreground">전일 대비 +12%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">주요 키워드</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">경제정책</div>
                  <p className="text-xs text-muted-foreground">언급 빈도 324회</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">정치 성향</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">중도</div>
                  <p className="text-xs text-muted-foreground">평균 성향 지수</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">참여 신문사</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">15개</div>
                  <p className="text-xs text-muted-foreground">주요 일간지</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>오늘의 키워드</CardTitle>
                </CardHeader>
                <CardContent>
                  <KeywordCloud />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>정치 성향 분포</CardTitle>
                </CardHeader>
                <CardContent>
                  <SentimentChart />
                </CardContent>
              </Card>
            </div>
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
                <NewsGrid />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
