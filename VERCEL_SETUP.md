# Vercel 배포 설정 가이드

## 1. Vercel 웹사이트에서 프로젝트 생성

1. [Vercel Dashboard](https://vercel.com/dashboard) 방문
2. "Add New" → "Project" 클릭
3. GitHub 저장소 연결:
   - GitHub 계정 연결 (처음이면)
   - `nampyo-news-FE` 저장소 선택
   - "Import" 클릭

4. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `pnpm build` (자동 감지됨)
   - **Output Directory**: `.next` (자동 감지됨)

5. **Environment Variables 추가**:
   ```
   NEXT_PUBLIC_SSE_ENDPOINT_URL = your-api-url-here
   ```

6. "Deploy" 클릭

---

## 2. GitHub Actions 자동 배포 설정 (선택사항)

GitHub Actions로 배포를 제어하려면:

### 2.1 Vercel 토큰 생성

1. [Vercel Settings → Tokens](https://vercel.com/account/tokens)
2. "Create" 클릭
3. 토큰 이름: `GitHub Actions`
4. Scope: Full Account
5. 토큰 복사 (한 번만 표시됨!)

### 2.2 프로젝트 ID 및 Org ID 가져오기

프로젝트 루트에 `.vercel` 폴더가 생성되면:

```bash
cat .vercel/project.json
```

출력 예시:
```json
{
  "orgId": "team_xxxxxxxx",
  "projectId": "prj_xxxxxxxx"
}
```

### 2.3 GitHub Secrets 설정

1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. "New repository secret" 클릭하여 각각 추가:

| Name | Value |
|------|-------|
| `VERCEL_TOKEN` | Vercel 토큰 |
| `VERCEL_ORG_ID` | `.vercel/project.json`의 `orgId` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json`의 `projectId` |
| `NEXT_PUBLIC_SSE_ENDPOINT_URL` | API 엔드포인트 URL |

---

## 3. 배포 확인

### Vercel Dashboard에서 자동 배포:
- GitHub에 푸시하면 자동으로 배포됨
- PR 생성 시 Preview 배포 자동 생성
- main 브랜치는 Production 배포

### GitHub Actions에서 수동 제어:
- `.github/workflows/vercel-deploy.yml` 활성화
- 푸시할 때마다 GitHub Actions에서 배포 실행

---

## 4. 도메인 설정

1. Vercel Dashboard → 프로젝트 선택
2. Settings → Domains
3. 커스텀 도메인 추가 또는 Vercel 기본 도메인 사용

---

## 빠른 시작

**가장 쉬운 방법 (권장):**

1. Vercel Dashboard에서 GitHub 저장소 연결
2. 환경 변수 설정
3. Deploy 클릭
4. 완료! 🎉

이후 main 브랜치에 푸시할 때마다 자동으로 배포됩니다.

---

## 현재 선택 사항

터미널의 vercel CLI 프롬프트에서:

**새 프로젝트 생성:**
```
? Link to existing project? → No 선택
? What's your project's name? → nampyo-news-fe 입력
? In which directory is your code located? → ./ (Enter)
```

**또는 Ctrl+C로 중단하고 Vercel Dashboard에서 직접 설정 (더 쉬움)**
