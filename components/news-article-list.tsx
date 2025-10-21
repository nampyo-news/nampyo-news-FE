"use client"

import { NewsArticle, formatDisplayDate } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Calendar, User } from "lucide-react"

interface NewsArticleListProps {
  articles: NewsArticle[]
  isLoading?: boolean
}

export function NewsArticleList({ articles, isLoading }: NewsArticleListProps) {
  // 진영별 색상 매핑
  const getSideColor = (side: string | null) => {
    if (!side) return "border-gray-400 text-gray-600 bg-gray-50"
    
    const sideNormalized = side.toLowerCase()
    if (sideNormalized.includes('blue') || sideNormalized.includes('진보') || sideNormalized.includes('좌')) {
      return "border-blue-500 text-blue-700 bg-blue-50"
    }
    if (sideNormalized.includes('red') || sideNormalized.includes('보수') || sideNormalized.includes('우')) {
      return "border-red-500 text-red-700 bg-red-50"
    }
    if (sideNormalized.includes('middle') || sideNormalized.includes('중도')) {
      return "border-gray-500 text-gray-700 bg-gray-50"
    }
    return "border-gray-400 text-gray-600 bg-gray-50"
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>검색 결과가 없습니다.</p>
          <p className="text-sm mt-2">다른 검색어나 날짜 범위를 시도해보세요.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Card key={article.news_id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-lg leading-tight flex-1">
                <a 
                  href={article.provider_link_page} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {article.title}
                </a>
              </CardTitle>
              <a 
                href={article.provider_link_page} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="secondary" className="font-medium">
                {article.provider}
              </Badge>
              {article.byline && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{article.byline}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDisplayDate(article.dateline)}</span>
              </div>
            </div>
            {article.keyword && article.keyword.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {article.keyword.slice(0, 10).map((kw, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className={`text-xs ${getSideColor(article.side)}`}
                  >
                    {kw.trim()}
                  </Badge>
                ))}
                {article.keyword.length > 10 && (
                  <Badge variant="outline" className="text-xs border-dashed">
                    +{article.keyword.length - 10}
                  </Badge>
                )}
              </div>
            )}
            {article.side && (
              <div className="mt-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs font-semibold ${getSideColor(article.side)}`}
                >
                  {article.side}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
