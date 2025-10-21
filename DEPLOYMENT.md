# CI/CD 배포 가이드

## 배포 방법 선택

이 프로젝트는 3가지 배포 방법을 지원합니다:

### 1. Vercel 배포 (권장) ⭐

**장점:**
- Next.js에 최적화됨
- 자동 프리뷰 배포
- CDN, 캐싱, 최적화 자동 처리
- 무료 플랜 제공

**설정 방법:**

1. [Vercel](https://vercel.com)에 가입
2. GitHub 저장소 연결
3. 프로젝트 import
4. 환경 변수 설정:
   - `NEXT_PUBLIC_SSE_ENDPOINT_URL`: API 엔드포인트 URL

**GitHub Actions 사용 시:**

GitHub Repository Settings → Secrets and variables → Actions에 추가:

```
VERCEL_TOKEN: Vercel 계정 설정에서 생성한 토큰
VERCEL_ORG_ID: .vercel/project.json의 orgId
VERCEL_PROJECT_ID: .vercel/project.json의 projectId
NEXT_PUBLIC_SSE_ENDPOINT_URL: API 엔드포인트
```

워크플로우: `.github/workflows/vercel-deploy.yml`

---

### 2. Docker + Self-hosted 서버 배포

**장점:**
- 완전한 제어권
- 자체 서버에서 호스팅
- 다른 서비스와 통합 용이

**필요 사항:**
- Docker가 설치된 서버
- SSH 접근 권한
- 도메인 (선택사항)

**설정 방법:**

1. **로컬에서 Docker 이미지 빌드 및 테스트:**

```bash
# 이미지 빌드
docker build -t nampyo-news-fe \
  --build-arg NEXT_PUBLIC_SSE_ENDPOINT_URL=http://your-api-url .

# 컨테이너 실행
docker run -p 3000:3000 nampyo-news-fe

# 또는 docker-compose 사용
docker-compose up -d
```

2. **GitHub Actions 설정:**

GitHub Repository Settings → Secrets에 추가:

```
SERVER_HOST: 서버 IP 또는 도메인
SERVER_USER: SSH 사용자명 (예: ubuntu)
SERVER_SSH_KEY: SSH 개인키 (cat ~/.ssh/id_rsa)
NEXT_PUBLIC_SSE_ENDPOINT_URL: API 엔드포인트
```

3. **서버에 Docker 및 Docker Compose 설치:**

```bash
# Docker 설치
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose 설치
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

4. **서버에 배포 디렉토리 생성:**

```bash
mkdir -p /opt/nampyo-news-fe
cd /opt/nampyo-news-fe

# docker-compose.yml 및 .env 파일 복사
```

워크플로우: `.github/workflows/docker-deploy.yml`

---

### 3. GitHub Pages 배포 (정적 사이트)

**주의:** SSE나 서버 사이드 기능은 작동하지 않습니다.

**장점:**
- 무료 호스팅
- 자동 HTTPS
- 빠른 배포

**설정 방법:**

1. Repository Settings → Pages
2. Source: GitHub Actions 선택
3. 환경 변수 설정:

```
NEXT_PUBLIC_SSE_ENDPOINT_URL: API 엔드포인트
```

4. `next.config.mjs`를 정적 export로 변경:

```javascript
const nextConfig = {
  output: 'export',
  // ... 기타 설정
}
```

워크플로우: `.github/workflows/github-pages.yml`

---

## 환경 변수 설정

모든 배포 방법에서 다음 환경 변수가 필요합니다:

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `NEXT_PUBLIC_SSE_ENDPOINT_URL` | API 서버 엔드포인트 | `http://api.example.com` |

---

## 워크플로우 활성화

원하는 배포 방법의 워크플로우 파일만 유지하고 나머지는 삭제하거나 비활성화하세요.

### 워크플로우 비활성화 방법:

파일 이름을 `.yml.disabled`로 변경하거나 삭제합니다.

---

## 트러블슈팅

### 빌드 실패

- `pnpm install` 실패: `pnpm-lock.yaml` 확인
- TypeScript 오류: `next.config.mjs`의 `ignoreBuildErrors` 확인

### 배포 실패

- Secrets 설정 확인
- 네트워크 연결 확인
- 서버 디스크 공간 확인

### Docker 이슈

- 포트 충돌: `docker ps`로 실행 중인 컨테이너 확인
- 권한 오류: Docker 그룹에 사용자 추가 `sudo usermod -aG docker $USER`

---

## 로컬 개발

```bash
# 개발 서버 실행
pnpm dev

# 프로덕션 빌드 테스트
pnpm build
pnpm start
```

---

## 추가 리소스

- [Next.js 배포 문서](https://nextjs.org/docs/deployment)
- [Vercel 문서](https://vercel.com/docs)
- [Docker 문서](https://docs.docker.com/)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
