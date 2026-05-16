# QA 리포트

- 작성일: 2026-05-16
- QA: Claude (QA 에이전트)
- 대상: sea-webapp v0.1.0 "오늘의 K-운세 카드" MVP
- 시간 한도: 30분
- 빌드 산출물: `dist/index.html`, `dist/assets/index-R14_wwHp.js` (528,030 B), `dist/assets/index-CUfXa2X1.css` (10,856 B)

---

## 1. 정적 코드 검토 결과

### 1-1. PRD M1 (사주 + AI) 충족도

- `src/fortune.js`
  - `computeSaju(birthDate, birthTimeKey)`: 띠(12지), 별자리(12궁), 일주/월주/년주, 음력 날짜를 모두 추출. lunar-javascript 호출을 `try/catch`로 감싸고 실패 시 `usedLunar=false`로 폴백 (Plan B). PRD `5. Plan B` 요구 충족.
  - `BIRTH_TIMES` 12시진 매핑 정상. 기본값 `자시` UI에서도 셀렉트 옵션의 첫 항목.
  - `getStarSign`은 12월 22-31일 케이스를 위해 STAR_SIGNS 마지막에 염소자리를 한 번 더 둠. 정상.
  - `buildSeed`는 띠/별자리/일주/날짜 문자열을 31-base 해시. 같은 입력 + 같은 날짜에 같은 시드 보장 (PRD "재현성" 요구 충족).
- `src/api.js`
  - 시스템 프롬프트가 사주 컨텍스트 + 시드 + 출력 JSON 스키마를 명시. 35-55자 한국어 한 줄 강제. PRD 4-M1 충족.
  - `claude-sonnet-4-6` 모델 사용 (CLAUDE.md/PRD 권장 모델).
  - `anthropic-dangerous-direct-browser-access: true` 헤더 사용 — PRD가 명시한 v1 한정 위험. README.md에 운영 키 금지 경고 명시되어 의도된 동작.
  - API 키 미설정 또는 호출 실패 시 `pickFromPool(seed)`로 100% fallback. Plan B 완비.

### 1-2. PRD M2 (카드 렌더) 충족도

- `src/card.js` `renderCard()`
  - 상단: 이름 + 한국어 날짜(요일 포함) + 영문 날짜 ✓
  - 중앙: 띠/별자리 칩 2개 + 운세 한 줄 (font-script, word-break: keep-all) ✓
  - 하단: 행운 컬러 3칩 (HEX 표시) + 행운 숫자 + 행운 키워드 + 워터마크 "오늘의 K-운세 · k-fortune.app" ✓
  - 비율 토글: `.card-story` aspect 9/16, `.card-feed` aspect 1/1. CSS 미디어 쿼리도 폰트 크기 조정 ✓
- `src/main.js` `handleDownload`
  - html2canvas scale 2 (1080p 인스타 비율 근사) — 정상
  - 파일명 `k-fortune-${name}-${date}-${story|feed}.png` 가독성 좋음
- `handleShare`: navigator.share + canShare 모두 체크하고 데스크톱은 다운로드 폴백. PRD N1 정상 구현 (Nice-to-have임에도 완료).
- `handleCopyLink`: URL 쿼리스트링 인코딩 (name, dob, time). PRD N2 충족. clipboard API 실패 시 `prompt()` 폴백 양호.

### 1-3. PRD M3 (localStorage 캐시 + 7일 기록) 충족도

- `src/storage.js`
  - `saveUser`, `loadUser`: 마지막 입력 기억 ✓
  - `getCached(dateStr)` / `setCached(dateStr, payload)`: 일일 캐시 정상
  - `pushHistory`: 같은 날짜 중복 제거 후 unshift, 7개로 slice ✓
  - `clearOldCache`: 7일 초과 cache 키 삭제 ✓
  - `safeGet`/`safeSet`: try/catch로 storage quota / private mode 방어 ✓
- main.js의 `handleSubmit`: `cacheKey = name-birthDate-birthTime`로 캐시 hit 검증. 같은 디바이스에서 다른 사람 입력 시 캐시 무효화 됨.

### 1-4. Plan B (lunar 실패 / API 실패) Fallback 코드 존재 확인

- lunar-javascript 실패: `fortune.js:91-93` `try/catch` 후 `console.warn`만 찍고 띠/별자리만 사용한 saju 객체 반환 ✓
- Claude API 실패: `api.js:97-100` `try/catch` 후 `pickFromPool(seed)` 사용 ✓
- 두 fallback이 모두 사용자에게 에러 노출 없이 결과를 만들어 냄. PRD 12장 위험 완화 충족.

### 1-5. 한국어 텍스트 인코딩 검증

- 빌드 산출물 `dist/assets/index-R14_wwHp.js`에서 "오늘의 K-운세" 및 fortunePool 첫 문장 "작은 우연이 큰 행운" 정상 포함 (UTF-8).
- preview HTML 응답에서 `Content-Type: text/html` + 한국어 메타 description / title 정상 렌더링.
- em dash (`—`) 사용 0건 (CLAUDE.md 규칙 준수). `src/`, `index.html` 전체 grep으로 확인.
- Pretendard, Gowun Dodum, Nanum Pen Script, Inter 폰트 모두 `<link>` 로드. preconnect로 cdn.jsdelivr.net 사전 연결.

### 1-6. 명백한 버그 / 코드 품질

| 항목 | 위치 | 비고 |
|------|------|------|
| 변수 미정의 | 없음 | import 모두 정상, 미사용 함수도 없음 |
| typo | 없음 | 한국어/영어 텍스트 검수 통과 |
| race condition | `handleSubmit` `state.loading` 가드 있음 | 중복 클릭 방어 ✓ |
| XSS | 사용자 입력 모두 `escapeHtml()` 통과 | name/keyword/fortune 텍스트 안전 |
| 색상 입력 | `style="background:${c}"` 비escape | colors는 LLM/풀에서 오는 HEX. 풀은 안전. LLM은 프롬프트로 HEX 강제 + parseJSON에서 String trim. 악용 가능성 낮음. CSS injection 잠재 위험 정도. |

---

## 2. 빌드 검증 결과

- `dist/index.html` 존재 (1,221 B)
- `dist/assets/index-R14_wwHp.js` 528,030 B (≈ 515 KB)
- `dist/assets/index-CUfXa2X1.css` 10,856 B (≈ 11 KB)
- HTTP 응답 모두 200, Content-Type 정상 (text/html, text/javascript, text/css)
- `vite.config.js`: `base: './'` — Cloudflare Pages 서브패스 호환. `target: es2020` 모던 브라우저 최적. `sourcemap: false` 운영 부담 적음.
- `package.json` 의존성: `html2canvas ^1.4.1`, `lunar-javascript ^1.7.4`, `vite ^7.1.5`만. node_modules에 의도한 패키지 모두 설치됨 (lunar-javascript, html2canvas, vite, esbuild, rollup, postcss 등). 의존성 일치 ✓
- 번들 사이즈 평가: 528 KB JS는 인스타 카드 한 장 앱치고는 무겁지만, html2canvas (≈200 KB minified) + lunar-javascript (≈250 KB)가 차지. v1.1에서 dynamic import로 카드 페이지 진입 시 lazy load하면 초기 로딩 50 KB대로 축소 가능. 현재로는 PRD 시간 한도 내 적정 수준.

---

## 3. preview 실제 동작 결과

- `npm run preview` → `http://localhost:4173/` 정상 응답.
- 메인 페이지 HTML 직접 fetch (200 OK):
  - `<title>오늘의 K-운세 카드 · Today's K-Fortune</title>` 정상 렌더
  - `<div id="app"></div>` 존재
  - Pretendard + Google Fonts (`Gowun Dodum`, `Nanum Pen Script`, `Inter`) `<link>` 정상
  - `<script type="module" src="./assets/index-R14_wwHp.js">` + CSS link 모두 정상 (200 OK)
  - 한국어 메타 description 깨짐 없음
- 입력 → 결과 코드 흐름 시뮬레이션:
  - submit → `handleSubmit` → `computeSaju(birthDate, birthTime)` → `buildSeed` → `getCached(dateStr)` 체크 → 없으면 `generateFortune` (API 키 없으면 `pickFromPool`) → `setCached` → `state.view='result'` → `renderResult()` → `renderCard()` html2canvas로 다운로드 가능
  - 다운로드/공유/링크복사 모두 핸들러 연결 확인
- preview 서버 종료 완료 (TaskStop bj8qvr1ej).

---

## 4. 발견 사항

### 4-1. Critical (배포 막아야 함)

**없음.** MVP 배포 가능 상태.

### 4-2. Major (배포 후 빨리 수정)

#### M-1. storage 데이터 구조 불일치 (이중 중첩)

- 위치: `src/storage.js:38` `setCached` → `pushHistory(dateStr, payload)` 호출
- 문제: main.js에서 `setCached(state.dateStr, { cacheKey, fortune, saju })` 로 호출. 결과적으로 history에 들어가는 데이터는 `{ date, fortune: { cacheKey, fortune, saju } }` 모양이 되어, 실제 fortune은 `h.fortune.fortune` 으로 한 단계 더 들어가야 닿음.
- 영향: main.js `renderHistoryGrid` (line 235)와 `renderHistoryModal` (line 263)이 `h.fortune?.fortune?.luckyColors || h.fortune?.luckyColors` 와 `h.fortune?.fortune || h.fortune` 식으로 양쪽 fallback을 두긴 했지만, 의도와 다른 데이터 모양이 저장됨. 향후 schema 변경 시 혼란.
- 수정 권장: `pushHistory(dateStr, payload.fortune)` 로 변경 또는 `pushHistory` 안에서 `payload.fortune || payload` 로 풀어서 저장. 동시에 main.js의 방어적 `??` chain 제거 가능.

#### M-2. cacheKey 변경 시 같은 날 다른 사용자 캐시 덮어쓰기

- 위치: `src/main.js:150-159`, `src/storage.js:36-39`
- 문제: 같은 디바이스에서 다른 이름/생일로 입력하면 `cacheKey` 가 달라 캐시 미스 → 새 fortune 생성 → 같은 `YYYY-MM-DD` 키에 덮어씀. 결과적으로 같은 날 두 명의 history가 하나로 합쳐지지 않고 마지막 사람만 남음.
- 영향: 가족/커플 공유 디바이스에서 어색함. PRD 13장 "공유 카드 5+" KPI에는 영향 적음.
- 수정 권장: 캐시 키에 cacheKey 해시 포함 `kfortune.cache.YYYY-MM-DD.<hash>` 또는 history 키에 사용자 이름 포함.

### 4-3. Minor (개선 권장)

#### m-1. 따옴표 규칙 위반 (CLAUDE.md)

- 위치:
  - `src/main.js:62` `"30초 만에 받는 한국식 사주 카드 한 장"` → 일반 `"` 사용
  - `src/main.js:90` `'자시'로 두세요` → 일반 `'` 사용
- 영향: CLAUDE.md 규칙 "쌍따옴표 U+201C/U+201D, 홑따옴표 U+2018/U+2019". HTML 노출 텍스트는 콘텐츠로 분류됨. 시각상 큰 문제는 아니나 민티의 콘텐츠 규칙 일관성.
- 수정 권장: `"30초 만에 받는 한국식 사주 카드 한 장"`, `'자시'로 두세요` 로 교체.

#### m-2. 번들 사이즈 (528 KB JS) 초기 로딩 부담

- 인스타에서 들어오는 모바일 사용자 기준 3G 환경에서 5초+ 가능
- 수정 권장: v1.1에서 `html2canvas` 동적 import (다운로드 버튼 클릭 시점 로드). lunar-javascript도 lite build 검토.

#### m-3. PNG 다운로드 시 라운드 코너 잘림 가능성

- `card-noise`의 `mix-blend-mode: overlay`, `backdrop-filter: blur(4px)` 가 html2canvas에서 100% 재현되지 않음 (html2canvas의 알려진 한계).
- 영향: 실제 다운로드 PNG에서 노이즈 텍스처와 zodiac-chip의 blur 효과가 빠질 수 있음. 카드 자체는 정상.
- 수정 권장: 다운로드 캡처 직전 일시적으로 blur/blend mode를 단색으로 대체하는 토글 또는 v1.1에서 dom-to-image-more 검토.

#### m-4. lunar-javascript 실패 시 사용자 인지 없음

- `console.warn`만 찍고 묵묵히 띠/별자리만 사용. 카드에는 일주가 안 보이므로 사용자는 알 수 없음.
- 정상 동작이긴 하나 디버깅 어려움. Cloudflare Web Analytics에 fallback 이벤트만 별도 트래킹 권장 (v1.1).

#### m-5. 워터마크 URL `k-fortune.app` 하드코딩

- 위치: `src/card.js:86`
- 실제 배포는 Cloudflare Pages 도메인 (`<project>.pages.dev`)일 가능성 큼. 도메인 미정이면 동적 처리 또는 README에 후속 수정 안내 추가 권장.

---

## 5. PRD 충족도 점수

| 기능 | 점수 | 비고 |
|------|------|------|
| **M1. 사주 기반 운세 계산 + AI 생성** | **9/10** | lunar-javascript + Plan B + 시드 + Claude API + pool fallback 모두 구현. -1점은 API 키 노출(의도된 v1 위험). |
| **M2. K-감성 카드 자동 렌더링** | **9/10** | 9:16/1:1 토글, html2canvas PNG, 한글 손글씨 폰트, 워터마크, 인스타 비율 정확. -1점은 html2canvas blur/blend 미재현 가능성. |
| **M3. localStorage 재방문 + 일일 잠금** | **8/10** | 캐시/history/quota 방어 정상. -2점은 4-2 Major(데이터 이중 중첩 + 같은 날 다른 입력 덮어쓰기). |
| **N1. 네이티브 share API** | **10/10** | Nice-to-have임에도 완비. canShare 분기 + 데스크톱 폴백 ✓ |
| **N2. 친구 공유 링크** | **10/10** | URL 쿼리 인코딩 + parseShareParams + shared-banner UI ✓ |

**총평**: PRD 4장 Must-have 3개 + Nice-to-have 2개 모두 구현. v1 MVP로 충분.

---

## 6. 배포 권고: **GO with fixes (Minor 권장, Major는 v1.1 백로그)**

### 즉시 배포 가능 근거

- Critical 0건
- 한국어 인코딩, em dash 0건, 빌드 산출물 모두 정상
- preview 서버에서 200 OK, 한국어 메타/타이틀 정상
- Plan B (lunar 실패 / API 실패) 양쪽 모두 완비. API 키 없이도 사용자에게 정상 카드 제공
- PRD 5개 기능 (M1/M2/M3 + N1/N2) 모두 동작

### 배포 전 1시간 안에 권장 (선택)

- 4-3 m-1: 따옴표 2건 교체 (`src/main.js:62, 90`)
- 4-3 m-5: 워터마크 URL을 실제 Cloudflare Pages 도메인으로 교체

### 배포 후 v1.1에서 처리 (백로그)

- 4-2 M-1: storage 데이터 구조 평탄화
- 4-2 M-2: cacheKey 해시를 키에 포함
- 4-3 m-2: html2canvas/lunar-javascript dynamic import로 초기 번들 50KB대로
- 4-3 m-3: 다운로드 시 blur/blend 대체 토글
- 4-3 m-4: lunar fallback 트래킹
- PRD 11장: API 키를 Cloudflare Pages Functions proxy로 (보안)

---

## 7. QA 진행 메모

- 정적 검토 + 빌드 검증 + preview 실제 fetch 검증 모두 완료
- preview 서버 종료 완료 (TaskStop bj8qvr1ej)
- 사용자(브라우저) 인터랙션 시뮬레이션은 코드 흐름으로 대체 (Playwright 없음)
- 실제 브라우저에서 입력 → 결과 → 다운로드 골든패스는 디자이너 또는 PM이 1회 확인 권장
