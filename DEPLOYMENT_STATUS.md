# ✅ Vercel 배포 완료!

## 🎉 배포 성공

- **Production URL**: https://nampyo-news-9u13y4zqm-roflas-projects.vercel.app
- **프로젝트 대시보드**: https://vercel.com/roflas-projects/nampyo-news-fe
- **설정 페이지**: https://vercel.com/roflas-projects/nampyo-news-fe/settings

## 📋 프로젝트 정보

```json
{
  "projectId": "prj_4S6hCei1EsMXuoajhlZfu1Gmp9E2",
  "orgId": "team_rLg1tOT7hMySZWmeoPAIrC3H",
  "projectName": "nampyo-news-fe"
}
```

## 🔧 다음 할 일

### 1. GitHub 저장소 연결 (자동 배포)

**현재 상태**: ⚠️ 저장소 연결 실패 (수동 배포만 가능)

**해결 방법**:

1. [Vercel 프로젝트 설정](https://vercel.com/roflas-projects/nampyo-news-fe/settings/git) 방문
2. "Connect Git Repository" 클릭
3. GitHub 계정 권한 승인
4. `nampyo-news/nampyo-news-FE` 저장소 선택

**연결 후 장점**:
- ✅ main 브랜치 푸시 시 자동 배포
- ✅ PR 생성 시 자동 Preview 배포
- ✅ 배포 상태를 GitHub PR에서 확인

### 2. 환경 변수 설정 (필수)

현재 로컬 환경 변수:
```bash
NEXT_PUBLIC_SSE_ENDPOINT_URL=http://localhost:8000/public/v1/news/sse
NEXT_PUBLIC_BIGKINDS_API_URL=http://localhost:8000/public/v1/news/bigkinds/get_info
```

**프로덕션 환경에서 설정 필요**:

#### 방법 A: Vercel Dashboard (권장)

1. [환경 변수 페이지](https://vercel.com/roflas-projects/nampyo-news-fe/settings/environment-variables) 방문
2. 다음 변수 추가:
   - `NEXT_PUBLIC_SSE_ENDPOINT_URL` = 프로덕션 API URL
   - `NEXT_PUBLIC_BIGKINDS_API_URL` = 프로덕션 API URL
3. Environment: Production, Preview, Development 모두 체크

#### 방법 B: CLI 스크립트

```bash
chmod +x scripts/setup-vercel-env.sh
./scripts/setup-vercel-env.sh
```

### 3. 커스텀 도메인 설정 (선택사항)

1. [도메인 설정](https://vercel.com/roflas-projects/nampyo-news-fe/settings/domains) 방문
2. "Add Domain" 클릭
3. 도메인 입력 및 DNS 설정

---

## 🚀 재배포 방법

### 환경 변수 설정 후 재배포:

```bash
# Production 재배포
vercel --prod

# Preview 배포
vercel
```

### GitHub 연결 후 자동 배포:

```bash
git add .
git commit -m "Update configuration"
git push origin main
```

→ 자동으로 Vercel에서 빌드 및 배포 시작!

---

## 🔍 배포 확인

현재 배포된 사이트 방문:
👉 https://nampyo-news-9u13y4zqm-roflas-projects.vercel.app

**예상 문제**:
- ❌ API 연결 실패 (환경 변수가 localhost로 설정됨)

**해결**: 위의 "환경 변수 설정" 단계 완료 후 재배포

---

## 📊 모니터링

- **배포 로그**: https://vercel.com/roflas-projects/nampyo-news-fe
- **Analytics**: https://vercel.com/roflas-projects/nampyo-news-fe/analytics
- **성능 모니터링**: https://vercel.com/roflas-projects/nampyo-news-fe/speed-insights

---

## 🛠️ 로컬 개발

```bash
# 개발 서버 실행
pnpm dev

# 프로덕션 빌드 테스트
pnpm build
pnpm start
```

---

## 📚 추가 리소스

- [Vercel 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [환경 변수 설정](https://vercel.com/docs/concepts/projects/environment-variables)

---

## ✅ 체크리스트

- [x] Vercel CLI 설치
- [x] 프로젝트 배포
- [ ] GitHub 저장소 연결
- [ ] 환경 변수 설정
- [ ] 프로덕션 재배포
- [ ] 사이트 동작 확인
- [ ] (선택) 커스텀 도메인 설정
