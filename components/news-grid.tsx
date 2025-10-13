"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock, User } from "lucide-react"

export function NewsGrid() {
  const articles = [
    {
      id: 1,
      title: "경제정책 개편안 국회 통과... 부동산 시장 영향 주목",
      newspaper: "중앙일보",
      time: "2시간 전",
      author: "김기자",
      keywords: ["경제정책", "부동산", "국회"],
      sentiment: "moderate",
      summary: "정부의 새로운 경제정책 개편안이 국회를 통과하면서 부동산 시장에 미칠 영향에 대한 관심이 높아지고 있다.",
      image: "/economic-policy-news.png",
    },
    {
      id: 2,
      title: "환경보호 정책 강화... 탄소중립 목표 달성 위한 새로운 로드맵",
      newspaper: "한겨레",
      time: "3시간 전",
      author: "이기자",
      keywords: ["환경정책", "탄소중립", "기후변화"],
      sentiment: "progressive",
      summary:
        "정부가 2050 탄소중립 목표 달성을 위한 구체적인 로드맵을 발표하며 환경보호 정책을 대폭 강화한다고 밝혔다.",
      image: "/environment-policy-green.png",
    },
    {
      id: 3,
      title: "국정감사 핵심 쟁점... 정치권 공방 격화",
      newspaper: "조선일보",
      time: "4시간 전",
      author: "박기자",
      keywords: ["국정감사", "정치", "국회"],
      sentiment: "conservative",
      summary: "국정감사 기간 중 여야 간 주요 현안을 둘러싼 공방이 격화되면서 정치적 긴장감이 고조되고 있다.",
      image: "/political-debate-parliament.png",
    },
    {
      id: 4,
      title: "디지털 전환 가속화... AI 기술 도입 확산",
      newspaper: "한국일보",
      time: "5시간 전",
      author: "최기자",
      keywords: ["디지털전환", "AI", "기술혁신"],
      sentiment: "moderate",
      summary: "각 산업 분야에서 AI 기술 도입이 가속화되면서 디지털 전환이 본격적으로 진행되고 있다.",
      image: "/ai-digital-transformation.png",
    },
    {
      id: 5,
      title: "사회복지 예산 증액... 취약계층 지원 강화",
      newspaper: "경향신문",
      time: "6시간 전",
      author: "정기자",
      keywords: ["사회복지", "예산", "취약계층"],
      sentiment: "progressive",
      summary: "내년도 사회복지 예산이 대폭 증액되면서 취약계층에 대한 지원이 크게 강화될 예정이다.",
      image: "/social-welfare-support.png",
    },
    {
      id: 6,
      title: "금융시장 안정화 방안... 금리 정책 변화 전망",
      newspaper: "매일경제",
      time: "7시간 전",
      author: "김기자",
      keywords: ["금융정책", "금리", "경제안정"],
      sentiment: "moderate",
      summary: "중앙은행의 금리 정책 변화가 예상되면서 금융시장 안정화 방안에 대한 논의가 활발해지고 있다.",
      image: "/financial-market-interest-rates.png",
    },
  ]

  const getSentimentColor = (sentiment: string) => {
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
      {articles.map((article) => (
        <Card key={article.id} className={`border-l-4 ${getSentimentColor(article.sentiment)}`}>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <img
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg leading-tight mb-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{article.newspaper}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{article.time}</span>
                  </div>
                  <span>{article.author}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {article.keywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    원문보기
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
