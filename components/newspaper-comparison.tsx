"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function NewspaperComparison() {
  const newspapers = [
    {
      name: "조선일보",
      articles: 23,
      sentiment: "conservative",
      keywords: ["경제성장", "시장경제", "안보"],
      tone: 85,
      coverage: "high",
    },
    {
      name: "한겨레",
      articles: 19,
      sentiment: "progressive",
      keywords: ["사회복지", "환경", "평등"],
      tone: 78,
      coverage: "medium",
    },
    {
      name: "중앙일보",
      articles: 31,
      sentiment: "moderate",
      keywords: ["정책분석", "국정감사", "경제"],
      tone: 72,
      coverage: "high",
    },
    {
      name: "경향신문",
      articles: 16,
      sentiment: "progressive",
      keywords: ["시민사회", "노동", "복지"],
      tone: 81,
      coverage: "medium",
    },
  ]

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "conservative":
        return "bg-chart-4 text-white"
      case "progressive":
        return "bg-chart-1 text-white"
      case "moderate":
        return "bg-chart-3 text-white"
      default:
        return "bg-muted"
    }
  }

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case "conservative":
        return "보수"
      case "progressive":
        return "진보"
      case "moderate":
        return "중도"
      default:
        return "중립"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {newspapers.map((newspaper) => (
          <Card key={newspaper.name} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{newspaper.name}</CardTitle>
                <Badge className={getSentimentColor(newspaper.sentiment)}>
                  {getSentimentLabel(newspaper.sentiment)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">관련 기사</p>
                  <p className="text-xl font-bold text-primary">{newspaper.articles}건</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">보도 강도</p>
                  <div className="flex items-center gap-2">
                    <Progress value={newspaper.tone} className="flex-1" />
                    <span className="text-sm font-medium">{newspaper.tone}%</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">주요 키워드</p>
                <div className="flex flex-wrap gap-2">
                  {newspaper.keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>보도 성향 비교</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newspapers.map((newspaper) => (
              <div key={newspaper.name} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium">{newspaper.name}</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-full bg-muted rounded-full h-6 relative overflow-hidden">
                    <div
                      className={`h-full ${getSentimentColor(newspaper.sentiment)} transition-all duration-500`}
                      style={{ width: `${newspaper.tone}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12">{newspaper.tone}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
