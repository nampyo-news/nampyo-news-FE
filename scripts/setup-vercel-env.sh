#!/bin/bash

# Vercel 환경 변수 설정 스크립트

echo "Vercel 환경 변수를 설정합니다..."
echo "실제 프로덕션 API URL을 입력하세요"
echo ""

# Production 환경 변수 설정
read -p "NEXT_PUBLIC_SSE_ENDPOINT_URL (예: https://api.example.com/public/v1/news/sse): " SSE_URL
read -p "NEXT_PUBLIC_BIGKINDS_API_URL (예: https://api.example.com/public/v1/news/bigkinds/get_info): " BIGKINDS_URL

echo ""
echo "Production 환경에 변수를 추가합니다..."
vercel env add NEXT_PUBLIC_SSE_ENDPOINT_URL production <<< "$SSE_URL"
vercel env add NEXT_PUBLIC_BIGKINDS_API_URL production <<< "$BIGKINDS_URL"

echo ""
echo "Preview 환경에 변수를 추가합니다..."
vercel env add NEXT_PUBLIC_SSE_ENDPOINT_URL preview <<< "$SSE_URL"
vercel env add NEXT_PUBLIC_BIGKINDS_API_URL preview <<< "$BIGKINDS_URL"

echo ""
echo "✅ 환경 변수 설정이 완료되었습니다!"
echo "변경사항을 적용하려면 다시 배포하세요: vercel --prod"
