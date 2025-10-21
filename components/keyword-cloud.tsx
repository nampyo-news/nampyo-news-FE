"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { TopNKeywords } from "@/lib/api"

interface KeywordCloudProps {
  detailed?: boolean
  topNKeywords?: TopNKeywords | null
  sideCounts?: { blue: number; red: number; middle: number }
  newsArticles?: any[]
  overlapStyleLimit?: number
  totalKeywordCount?: number
  keywordFreq?: Record<string, number>
  perSideKeywordFreq?: {
    blue: Record<string, number>
    red: Record<string, number>
    middle: Record<string, number>
  }
  perSideTotal?: {
    blue: number
    red: number
    middle: number
  }
}

export function KeywordCloud({ detailed = false, topNKeywords = null, sideCounts, newsArticles, overlapStyleLimit = 10, totalKeywordCount = 0, keywordFreq = {}, perSideKeywordFreq, perSideTotal }: KeywordCloudProps) {
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)

  // 하드코딩된 기본 키워드
  const defaultKeywords = [
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

  // topNKeywords가 있으면 진영별 키워드 표시
  if (topNKeywords) {
    // 진영별 키워드 집합
    const blueSet = new Set(topNKeywords.blue)
    const redSet = new Set(topNKeywords.red)
    const middleSet = new Set(topNKeywords.middle)
    // 전체 키워드 집합(중복 포함)
    const allKeywords = [
      ...topNKeywords.blue,
      ...topNKeywords.red,
      ...topNKeywords.middle,
    ]
    const allKeywordsCount = allKeywords.length
    // 겹치는 키워드 집합
    const overlap = new Set([
      ...topNKeywords.blue.filter(k => redSet.has(k) || middleSet.has(k)),
      ...topNKeywords.red.filter(k => blueSet.has(k) || middleSet.has(k)),
      ...topNKeywords.middle.filter(k => blueSet.has(k) || redSet.has(k)),
    ])

    // 진영별 기사 수
    const blueCount = sideCounts?.blue ?? 0
    const redCount = sideCounts?.red ?? 0
    const middleCount = sideCounts?.middle ?? 0

    // 진영별 키워드 비율 계산 함수
    const getSideRatio = (keyword: string, side: 'blue' | 'red' | 'middle') => {
      if (!perSideKeywordFreq || !perSideTotal) return { count: 0, percent: '0.00' };
      const count = perSideKeywordFreq[side][keyword] || 0;
      const total = perSideTotal[side] || 0;
      return { count, percent: total ? ((count / total) * 100).toFixed(2) : '0.00' };
    }

    // 스타일 함수
    const getBadgeStyle = (keyword: string, color: string, overlap: boolean) => {
      if (overlap) {
        return `border-${color}-300 text-${color}-400 bg-${color}-50 text-xs` // 연한색, 작게
      } else {
        return `border-${color}-500 text-${color}-600 bg-${color}-100 font-bold text-base` // 진한색, 크게
      }
    }

    return (
      <div className="space-y-4">
        {/* 진보 (Blue) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <h3 className="text-sm font-semibold text-blue-600">진보 성향 <span className="ml-1 text-xs text-blue-400">({blueCount})</span></h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {topNKeywords.blue.slice(0, overlapStyleLimit).map((keyword, idx) => {
              const isOverlap = overlap.has(keyword)
              const { count, percent } = getSideRatio(keyword, 'blue')
              return (
                <Badge key={`blue-${idx}`} variant="outline" className={getBadgeStyle(keyword, 'blue', isOverlap)}>
                  {keyword} <span className="ml-1 text-xs">({count}/{perSideTotal?.blue ?? 0}, {percent}%)</span>
                </Badge>
              )
            })}
            {topNKeywords.blue.length > overlapStyleLimit && (
              <Badge variant="outline" className="border-blue-400 text-blue-500 border-dashed">
                +{topNKeywords.blue.length - overlapStyleLimit}
              </Badge>
            )}
          </div>
        </div>

        {/* 중도 (Middle) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full" />
            <h3 className="text-sm font-semibold text-gray-600">중도 성향 <span className="ml-1 text-xs text-gray-400">({middleCount})</span></h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {topNKeywords.middle.slice(0, overlapStyleLimit).map((keyword, idx) => {
              const isOverlap = overlap.has(keyword)
              const { count, percent } = getSideRatio(keyword, 'middle')
              return (
                <Badge key={`middle-${idx}`} variant="outline" className={getBadgeStyle(keyword, 'gray', isOverlap)}>
                  {keyword} <span className="ml-1 text-xs">({count}/{perSideTotal?.middle ?? 0}, {percent}%)</span>
                </Badge>
              )
            })}
            {topNKeywords.middle.length > overlapStyleLimit && (
              <Badge variant="outline" className="border-gray-400 text-gray-500 border-dashed">
                +{topNKeywords.middle.length - overlapStyleLimit}
              </Badge>
            )}
          </div>
        </div>

        {/* 보수 (Red) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <h3 className="text-sm font-semibold text-red-600">보수 성향 <span className="ml-1 text-xs text-red-400">({redCount})</span></h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {topNKeywords.red.slice(0, overlapStyleLimit).map((keyword, idx) => {
              const isOverlap = overlap.has(keyword)
              const { count, percent } = getSideRatio(keyword, 'red')
              return (
                <Badge key={`red-${idx}`} variant="outline" className={getBadgeStyle(keyword, 'red', isOverlap)}>
                  {keyword} <span className="ml-1 text-xs">({count}/{perSideTotal?.red ?? 0}, {percent}%)</span>
                </Badge>
              )
            })}
            {topNKeywords.red.length > overlapStyleLimit && (
              <Badge variant="outline" className="border-red-400 text-red-500 border-dashed">
                +{topNKeywords.red.length - overlapStyleLimit}
              </Badge>
            )}
          </div>
        </div>
      </div>
    )
  }

  // topNKeywords가 없으면 기본 키워드 클라우드 표시
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-4 p-8 bg-muted/30 rounded-lg min-h-[300px]">
        {defaultKeywords.map((keyword) => (
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
                {defaultKeywords.find((k) => k.text === selectedKeyword)?.weight}회
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
