# 수료증 발급기 (PWA)

브라우저만으로 동작하는 **한문철 안전보건교육 수료증 자동 발급 도구**입니다.
별도 서버 없이 정적 호스팅(Netlify)에 배포 가능하며, PWA로 설치하면 데스크톱/모바일에서 앱처럼 사용할 수 있습니다.

## 📌 프로젝트 소개

한 줄: **이름·생년월일·교육기간만 입력하면 Word 수료증을 자동 생성**해 주는 사내용 도구.

주요 기능
- 폼 입력 → 즉시 `.docx` 다운로드 (서버 통신 없음 — 모두 브라우저에서 처리)
- 우측 **실시간 미리보기** (입력 변경 시 자동 갱신)
- **저장된 양식** 기능 — 자주 쓰는 교육과정 정보를 양식으로 저장/불러오기
- **대량 생성** — 이름+생년월일 명단을 붙여넣고 ZIP / 단일 docx / 단일 PDF 형식 중 선택
- **PWA** — 한 번 설치하면 오프라인에서도 동작

---

## 🚀 빠른 시작 (사용자용)

1. 배포된 Netlify 주소(예: `https://cert-app.netlify.app`)에 접속
2. 크롬/엣지 주소창 오른쪽의 **"설치"** 아이콘 클릭 (또는 우하단 "📥 앱 설치" 버튼)
3. 바탕화면(또는 시작 메뉴)에 생긴 아이콘으로 실행
4. 폼에 정보 입력 → "수료증 생성" 클릭 → `수료증_OOO.docx` 자동 다운로드

> 모바일(안드로이드 크롬)에서는 메뉴 → "홈 화면에 추가"로 설치됩니다.

---

## 🛠️ 로컬 개발 환경

PWA는 `http://` 또는 `https://` 환경에서만 동작합니다. `file://`로 `index.html`을 직접 열면 **Service Worker가 등록되지 않고**, `fetch('template.docx')`도 차단됩니다.

**옵션 1) VS Code Live Server 확장**
1. VS Code에서 폴더 열기
2. 확장 "Live Server" 설치 (Ritwick Dey)
3. `index.html` 우클릭 → "Open with Live Server"
4. `http://127.0.0.1:5500` 자동 열림

**옵션 2) Python 내장 서버**
```bash
# 프로젝트 폴더에서
python -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

**옵션 3) Node 사용자라면**
```bash
npx serve .
```

---

## 📦 GitHub에 올리기 (단계별)

### 1) GitHub에서 빈 저장소 만들기
1. https://github.com/new 접속
2. **Repository name** 입력 (예: `cert-app`)
3. Public 또는 Private 선택
4. **README/`.gitignore`/license는 체크하지 말 것** (이미 있음)
5. **Create repository** 클릭

### 2) 로컬 폴더를 GitHub와 연결
프로젝트 폴더에서 터미널(PowerShell/CMD) 열고:

```bash
git init
git add .
git commit -m "Initial commit: 수료증 발급기 PWA"
git branch -M main
git remote add origin https://github.com/{사용자명}/{저장소명}.git
git push -u origin main
```

> `{사용자명}`, `{저장소명}`은 본인 값으로 바꾸세요.
> 처음이라면 푸시 시 GitHub 로그인 창이 뜹니다 (또는 [Personal Access Token](https://github.com/settings/tokens) 필요).

---

## 🌐 Netlify 배포

### 방법 A) GitHub 연동 (추천)

자동 재배포되므로 한 번만 설정하면 됨.

1. https://app.netlify.com 접속 → **Sign up** (GitHub 계정으로 로그인)
2. 대시보드에서 **"Add new site"** → **"Import an existing project"**
3. **"Deploy with GitHub"** 클릭 → 권한 승인
4. 방금 만든 저장소(`cert-app` 등) 선택
5. Build settings 화면:
   - Branch: `main`
   - Build command: (비워 둠)
   - Publish directory: `.`
6. **"Deploy site"** 클릭
7. 1~2분 후 `random-name-1234.netlify.app` 같은 주소 발급
8. **Site configuration → Change site name** 에서 원하는 이름으로 변경 가능
   (예: `cert-app.netlify.app`)

### 방법 B) 드래그 & 드롭 (가장 빠름)

GitHub 없이 즉시 배포만 하고 싶을 때.

1. https://app.netlify.com/drop 접속
2. **프로젝트 폴더 전체**(아이콘 포함)를 화면에 드래그
3. 끝. 즉시 주소가 발급됨

> 이 방법은 매번 수동 드래그가 필요하므로 지속 배포는 방법 A를 추천.

---

## 🔄 업데이트 방법

사용자에게 새 버전을 강제로 받게 하려면:

1. 코드 수정
2. **`service-worker.js`의 `CACHE_VERSION` 값을 올림** (예: `'v1'` → `'v2'`)
3. `git add . && git commit -m "update: ..." && git push`
4. Netlify가 자동으로 재배포 (보통 30초 이내)
5. 사용자는 앱을 한 번 **닫았다 다시 열면** 새 버전이 적용됨
   - 강제 즉시 적용: Ctrl+Shift+R (하드 리로드)

> `CACHE_VERSION`을 안 올리면 일부 사용자는 기존 캐시를 계속 사용하게 됩니다.

---

## 🎨 아이콘 만들기

`icons/` 폴더에 다음 두 파일이 **반드시** 있어야 PWA 설치가 가능합니다.
- `icons/icon-192.png` (192×192)
- `icons/icon-512.png` (512×512)

PNG는 투명 배경이 아니라 **단색 배경**으로 만드는 것이 좋습니다 (안드로이드 maskable 대응).

### 무료 생성기 (추천 순)
1. **PWA Builder Image Generator** — https://www.pwabuilder.com/imageGenerator
   원본 이미지 한 장 올리면 모든 사이즈 자동 생성
2. **RealFaviconGenerator** — https://realfavicongenerator.net
   파비콘+PWA 아이콘 통합 생성
3. **Favicon.io** — https://favicon.io
   텍스트/이모지로 즉석 아이콘 생성

생성한 파일 중 `icon-192.png`, `icon-512.png` 두 개만 `icons/` 폴더에 넣으면 됩니다.

---

## ❓ 문제 해결 FAQ

**Q. "설치" 버튼이 안 보여요**
- HTTPS로 접속했는지 확인 (Netlify 주소는 자동 HTTPS)
- 크롬, 엣지, 사파리(iOS) 사용 — 파이어폭스 데스크톱은 PWA 설치 미지원
- `icons/icon-192.png`와 `icons/icon-512.png` 파일이 실제로 존재하는지 확인
- 이미 설치된 경우 버튼이 자동 숨김됨

**Q. 오프라인에서 안 돼요**
- 첫 접속 시 한 번은 **온라인 상태**여야 Service Worker가 모든 리소스를 캐시함
- 한 번 캐시된 후에는 비행기 모드에서도 동작
- 단, 첫 접속 시 fetch가 실패하면 일부 CDN 라이브러리가 캐시되지 않을 수 있음 → 다시 온라인에서 한 번 더 접속

**Q. 코드를 바꿨는데 업데이트가 안 보여요**
- `service-worker.js`의 `CACHE_VERSION`을 올렸는지 확인
- 브라우저에서 Ctrl+Shift+R (하드 리로드)
- 설치된 PWA는 완전히 종료(작업 표시줄에서 닫기) 후 다시 실행
- 그래도 안 되면 DevTools → Application → Service Workers → "Unregister" 후 새로고침

**Q. template.docx를 못 찾는다고 나와요**
- `netlify.toml`이 루트에 있는지 확인 (MIME 타입 설정)
- 로컬에서는 반드시 HTTP 서버로 띄울 것 (`file://` 사용 금지)
- Netlify 배포 시 `template.docx`가 같이 푸시됐는지 확인 (`git status`로 확인)

**Q. 미리보기가 안 보여요**
- 첫 로딩 시 docx-preview 라이브러리 다운로드에 약간 시간이 걸릴 수 있음
- 콘솔(F12)에 오류가 있는지 확인

---

## 📁 폴더 구조

```
project-root/
├── index.html              메인 페이지 (폼 + 미리보기 + 생성 로직)
├── template.docx           수료증 Word 템플릿
├── manifest.json           PWA 매니페스트
├── service-worker.js       오프라인 캐시
├── icons/
│   ├── icon-192.png        앱 아이콘 (작은 크기) ← 직접 추가 필요
│   └── icon-512.png        앱 아이콘 (큰 크기)   ← 직접 추가 필요
├── netlify.toml            Netlify 배포 설정
├── .gitignore              Git 제외 목록
└── README.md               이 문서
```

---

## 라이선스

사내용 / 비영리 사용. 외부 배포 시 한문철의 현장 속으로 콘텐츠 저작권에 유의.
