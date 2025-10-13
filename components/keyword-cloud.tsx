"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface KeywordCloudProps {
  detailed?: boolean
}

export function KeywordCloud({ detailed = false }: KeywordCloudProps) {
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)

  const keywords = [
    { text: "경제정책", size: "text-4xl", weight: 324, color: "bg-primary" },
    { text: "국정감사", size: "text-3xl", weight: 287, color: "bg-secondary" },
    { text: "부동산", size: "text-2xl", weight: 245, color: "bg-accent" },
    { text: "교육개혁", size: "text-xl", weight: 198, color: "bg-chart-1" },
    { text: "환경정책", size: "text-lg", weight: 156, color: "bg-chart-2" },
    { text: "디지털전환", size: "text-base", weight: 134, color: "bg-chart-3" },
    { text: "사회복지", size: "text-lg", weight: 167, color: "bg-chart-4" },
    { text: "국제관계", size: "text-xl", weight: 189, color: "bg-chart-5" },
    { text: "금융정책", size: "text-2xl", weight: 223, color: "bg-primary" },
    { text: "보건의료", size: "text-lg", weight: 145, color: "bg-secondary" },
  { text: "노동정책", size: "text-base", weight: 100, color: "bg-chart-1" },
  { text: "청년정책", size: "text-lg", weight: 100, color: "bg-chart-2" },
  { text: "과학기술", size: "text-xl", weight: 100, color: "bg-chart-3" },
  { text: "문화예술", size: "text-2xl", weight: 100, color: "bg-chart-4" },
  { text: "인구정책", size: "text-lg", weight: 100, color: "bg-chart-5" },
  { text: "통일외교", size: "text-base", weight: 100, color: "bg-primary" },
  { text: "지방분권", size: "text-xl", weight: 100, color: "bg-secondary" },
  { text: "여성정책", size: "text-lg", weight: 100, color: "bg-accent" },
  { text: "교통물류", size: "text-base", weight: 100, color: "bg-chart-1" },
  { text: "에너지정책", size: "text-lg", weight: 100, color: "bg-chart-2" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-4 p-8 bg-muted/30 rounded-lg min-h-[300px]">
        {keywords.map((keyword) => (
          <button
            key={keyword.text}
            onClick={() => setSelectedKeyword(keyword.text)}
            className={`
              ${keyword.size} font-bold text-white px-3 py-1 rounded-lg
              ${keyword.color} hover:opacity-80 transition-all duration-200
              ${selectedKeyword === keyword.text ? "ring-2 ring-ring scale-110" : ""}
            `}
          >
            {keyword.text}
          </button>
        ))}
      </div>

      {detailed && selectedKeyword && (
        <div className="mt-6 p-4 bg-card border rounded-lg">
          <h3 className="font-semibold mb-2">키워드 상세 분석: {selectedKeyword}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">언급 빈도</p>
              <p className="text-lg font-bold text-primary">
                {keywords.find((k) => k.text === selectedKeyword)?.weight}회
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">관련 기사</p>
              <p className="text-lg font-bold text-secondary">47건</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">트렌드</p>
              <p className="text-lg font-bold text-accent">↗ 상승</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">연관 키워드</p>
            <div className="flex flex-wrap gap-2">
              {["금리정책", "부동산시장", "경기부양", "재정정책"].map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
