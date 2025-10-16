"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock, User } from "lucide-react"
import { useSSE } from "@/hooks/use-sse"


type Article = {
  id: string
  title: string
  url: string
  originallink?: string
  description?: string
  pubDate?: string
  newspaper?: string
}

const SSE_ENDPOINT_URL =
  process.env.NEXT_PUBLIC_SSE_ENDPOINT_URL || "http://127.0.0.1:8000/public/v1/news/sse"

export function NewsGrid() {
  const { messages, readyState, error } = useSSE<Article | Article[]>(SSE_ENDPOINT_URL)

  // 도메인 추출 유틸
  const extractDomain = (url?: string) => {
    if (!url) return "출처 미상"
    try {
      const u = new URL(url)
      return u.hostname.replace(/^www\./, "")
    } catch {
      return url
    }
  }

  // pubDate 포맷 (RFC822 → yyyy.MM.dd HH:mm)
  const formatPubDate = (dateStr?: string) => {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    // 한국 시간대 기준
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
  }

  // /sse 엔드포인트용 파서
  const toArticle = (raw: any): Article | null => {
    if (!raw) return null
    // items 배열의 각 원소
    if (raw.title && raw.link) {
      return {
        id: raw.link,
        title: raw.title,
        url: raw.link,
        originallink: raw.originallink,
        description: raw.description,
        pubDate: raw.pubDate,
        newspaper: extractDomain(raw.originallink || raw.link),
      }
    }
    return null
  }

  const articles: Article[] = useMemo(() => {
    // /sse: { items: [...] }
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i]
      if (m && typeof m === "object" && Array.isArray((m as any).items)) {
        return ((m as any).items).map(toArticle).filter(Boolean) as Article[]
      }
    }
    // fallback: 단일 기사 이벤트
    const seen = new Set<string>()
    const list: Article[] = []
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = toArticle(messages[i])
      if (!m || seen.has(m.id)) continue
      seen.add(m.id)
      list.push(m)
    }
    return list.reverse()
  }, [messages])

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "conservative":
        return "border-l-chart-4"
      case "progressive":
        return "border-l-chart-1"
      case "moderate":
        return "border-l-chart-3"
      default:
        return "border-l-muted"
    }
  }

  return (
    <div className="space-y-4">
      {readyState !== "open" && articles.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-6 text-sm text-muted-foreground">
            서버와 SSE 연결 중입니다... (상태: {readyState})
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="p-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {articles.length === 0 && readyState === "open" && !error && (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">표시할 기사가 없습니다.</CardContent>
        </Card>
      )}

      {articles.map((article) => (
        <Card key={article.id} className="border-l-4 border-l-muted">
          <CardContent className="p-6">
            <div className="flex gap-4">
              {/* 이미지 없음: placeholder */}
              <div className="w-32 h-20 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                No Image
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg leading-tight mb-2" dangerouslySetInnerHTML={{ __html: article.title }} />
                  {article.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2" dangerouslySetInnerHTML={{ __html: article.description }} />
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{article.newspaper}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatPubDate(article.pubDate)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div />
                  <Button asChild variant="ghost" size="sm" className="text-xs">
                    <a href={article.url} target="_blank" rel="noreferrer noopener">
                      <ExternalLink className="h-3 w-3 mr-1" />원문보기
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
