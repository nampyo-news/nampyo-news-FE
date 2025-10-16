"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SentimentChartProps {
  detailed?: boolean
}

export function SentimentChart({ detailed = false }: SentimentChartProps) {
  const sentimentData = [
    { name: "조선일보", position: 75, articles: 23, color: "bg-chart-4" },
    { name: "동아일보", position: 70, articles: 18, color: "bg-chart-4" },
    { name: "중앙일보", position: 50, articles: 31, color: "bg-chart-3" },
    { name: "한국일보", position: 45, articles: 22, color: "bg-chart-3" },
    { name: "한겨레", position: 25, articles: 19, color: "bg-chart-1" },
    { name: "경향신문", position: 20, articles: 16, color: "bg-chart-1" },
  ]

  // Deterministic offset to avoid SSR/CSR hydration mismatch
  const offsetTopPx = (seed: string) => {
    // Simple string hash -> 0..1
    let h = 0
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
    const n = Math.abs(h % 1000) / 1000 // 0..0.999
    return `${Math.floor(n * 40)}px` // 0..39px
  }

  return (
    <div className="space-y-6">
      {/* Political Spectrum Chart */}
      <div className="relative">
        <div className="h-16 bg-gradient-to-r from-chart-1 via-chart-3 to-chart-4 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-between px-4 text-white text-sm font-medium">
            <span>진보</span>
            <span className="text-gray-700">중도</span>
            <span>보수</span>
          </div>
        </div>

        {/* Newspaper positions */}
        <div className="relative mt-4 h-20">
          {sentimentData.map((item) => (
            <div
              key={item.name}
              className="absolute transform -translate-x-1/2"
              style={{ left: `${item.position}%`, top: offsetTopPx(item.name) }}
            >
              <div className={`w-3 h-3 ${item.color} rounded-full mb-1`} />
              <div className="text-xs text-center whitespace-nowrap">
                <div className="font-medium">{item.name}</div>
                <div className="text-muted-foreground">{item.articles}건</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {detailed && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-chart-1">진보 성향 언론</h3>
              <div className="space-y-2">
                {sentimentData
                  .filter((item) => item.position < 40)
                  .map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {item.articles}건
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-chart-4">보수 성향 언론</h3>
              <div className="space-y-2">
                {sentimentData
                  .filter((item) => item.position > 60)
                  .map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {item.articles}건
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
