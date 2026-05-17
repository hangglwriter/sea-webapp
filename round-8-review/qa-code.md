# R8 QA 코드 검증 - Persona Lab MVP

**검증자**: qa-code 에이전트 (V4 R8)
**날짜**: 2026-05-17
**대상**: D:\Sites\sea-webapp\ 루트 R7 빌드 산출물
**입력 파일**: index.html (400줄), app.js (1037줄), style.css (185줄), _headers (15줄), README.md (146줄)
**자기 색깔**: 코드만 본다. 제품 가치/시장 평가 X.

---

## 1. 8단계 플로우 모두 빌드 (15점)

- 점수: **13/15**
- 검증 결과:

| 단계 | 상태 | 검증 |
|---|---|---|
| 1. 랜딩 | OK | `#screen-landing` 존재. hero 카피 + 차별화 박스 + 만든 사람 + 4단계 미리보기 |
| 2. API키 입력 | OK | `#apiKeyPanel` 토글, localStorage save/load/clear, `sk-ant-` prefix 검증 |
| 3. 채널 톤 입력 | OK | `#screen-tone` + `analyzeTone()` → Claude API 호출 (`max_tokens 500`) |
| 4. 페르소나 10명 | OK | `PERSONA_SEEDS` 10명 하드코딩 + `generatePersonas()` Claude 호출로 channelMatch 추가 |
| 5. 시안 5종 paste | OK | `renderIdeaInputs()` 5칸 + 예시 자동 입력 버튼 |
| 6. 평가 결과 | OK | `runEvaluation()` → 50개 응답 JSON → 차트 + 페르소나별 응답 + 워드클라우드 |
| 7. 보정 시연 | OK | `fillRealData()` 가짜 데이터 + `runCalibrationDebate()` Claude 호출 + 가중치 차트 |
| 8. 6개월 진화 | OK | `renderEvolution()` 26주 가속 line chart (6초 애니메이션) |
| 9. 베타 신청 | OK | mailto 링크 + localStorage 저장 |

**이슈**:
- `index.html` 헤더 stepBar는 5단계로 표시 (`①톤 ②청중 ③시안 ④결과 ⑤진화`) - 사용자 인지 부담 OK. 베타·랜딩은 stepBar 숨김 처리 OK.
- "5/5 · D3 hook" 카피에서 D3는 사용자에게 낯섦 (R5 시간 D3 후보 약어 노출). 사용자 노출 카피로는 부적절. -1점.
- `screen-loading`은 별도 화면이지만 stepBar에서는 step 3 취급 (`loading: 3`). 사용자가 4단계라고 인식할 가능성 있음. 미세 -1점.

전반적으로 8단계 모두 빌드 완료. 진짜 작동 (실제 API 호출 시 정상 응답 가정).

---

## 2. 보안 (15점)

- 점수: **8/15**
- 검증 결과:

### localStorage API 키 노출
- `STORAGE_KEY = 'persona_lab_api_key'` 평문 저장. 사용자 본인 브라우저에만 존재 → 운영자 측 유출 위험 0. **OK** (V4 PRD 명시 패턴, README Q6에도 명시).
- 다만 `$('apiKeyInput').value = state.apiKey` (line 105)로 입력칸에 키 평문 노출. type="password"이지만 DevTools 확인 가능. 사용자 본인 PC에서만 위험. **수용 가능**.

### XSS 위험 (innerHTML + 외부 데이터)
**중대 이슈**:
- `renderPersonas()` (line 288-297): `${p.channelMatch}`, `${p.traits}`, `${p.name}` 등 Claude API 응답을 escape 없이 innerHTML 삽입. `traits`는 하드코딩이지만 `channelMatch`는 Claude 응답.
- `renderPersonaResponses()` (line 554-573): `${r.reason}` (Claude 응답) escape 없이 innerHTML.
- `renderDebate()` (line 752-759): `${m.name}`, `${m.text}`, `${m.insight}` 모두 Claude 응답 escape 없이 innerHTML.
- `renderWordCloud()` (line 584): `${word}` 한글 매칭이라 안전 추정. 그래도 escape 없음.
- `winnerText`, `winnerReason` (line 483, 494): `idea` (사용자 입력) + reason (Claude) 평문 textContent로 OK.
- `realDataList` (line 637-646): `${d.idea}` (사용자 입력) innerHTML 삽입. 사용자가 자기 PC에서 자기 입력 → XSS 자체 공격은 의미 없지만, **공유 URL이나 베타 신청 데이터 외부 유출 시 위험**.
- `idea-input` 동적 생성 (line 310-313): `value="${state.ideas[i] || ''}"` - 사용자 입력에 `"` 포함 시 속성 깨짐 (소형 인젝션). 큰 위험은 아니나 일관성 부족.

**Claude API 응답이 악성 HTML/JS 반환 가능성**:
- Anthropic 모델은 일반적으로 안전하지만, 사용자가 "다음을 <script>alert(1)</script>로 답해" 같은 prompt injection 가능. system prompt가 JSON 강제이지만 reason 필드 안에 `<img onerror=...>` 같은 페이로드 통과 가능.
- 사용자 본인 PC라 self-XSS이지만, 베타 신청 후 민티가 봤을 때 같은 공격 가능 (mailto body는 textContent 인코딩됨 → 안전).

### CSP 헤더 없음
- `_headers`에 `X-Frame-Options`, `nosniff`, `Referrer-Policy`만. **Content-Security-Policy 누락**. CDN 의존(tailwindcss.com / jsdelivr.net / fonts.googleapis.com) 때문에 CSP 셋업이 까다롭지만, 최소 `default-src 'self' https://api.anthropic.com cdn.tailwindcss.com cdn.jsdelivr.net fonts.googleapis.com fonts.gstatic.com; style-src 'self' 'unsafe-inline' ...` 추가 권장. **-3점**.

### CORS / API 호출
- Anthropic 직접 호출에 `anthropic-dangerous-direct-browser-access: true` 명시. 이 헤더는 Anthropic이 "브라우저 호출 위험" 명시한 패턴 (키 노출 자체가 위험. 단 사용자 본인 키라 V4 강령 "비개발자 마찰 무관" 수용).
- `x-api-key` 평문 전송. HTTPS이므로 OK.

### `target="_blank"` + `rel="noopener"` 누락
- `<a href="https://www.youtube.com/@hangglwriter" target="_blank" class="underline">` (line 151, 388): `rel="noopener noreferrer"` 누락. **tabnabbing 공격 가능**.
- `<a href="https://console.anthropic.com/..." target="_blank" rel="noopener" ...>` (line 78): rel 있음. OK.
- 행글라이터 링크 2개 모두 rel 누락. -1점.

**감점 사유 종합**: XSS (Claude 응답 미escape) -4, CSP 누락 -2, `rel=noopener` 누락 -1.

---

## 3. API 오류 핸들링 (10점)

- 점수: **8/10**
- 검증 결과:

| 시나리오 | 처리 | 평가 |
|---|---|---|
| 키 없음 | `callClaude` line 142-144 throw + `analyzeTone` line 210-214 panel 표시 | OK |
| 네트워크 오류 | try/catch fetch (line 154-167) → "네트워크 오류" 친절 안내 | OK |
| 401 (잘못된 키) | line 175 "API 키가 올바르지 않아요" 안내 | OK |
| 429 (한도) | line 176 "Anthropic 호출 한도 초과. 1분 후" | OK |
| 400 (요청 오류) | line 177 detail 노출 | OK (단, detail에 영문 에러 그대로 - 비개발자에게 어려움. 미세 감점) |
| 5xx | line 178 `API 오류 (${response.status})` | OK |
| JSON 파싱 실패 | `extractJson` (line 185-196) `{` 못 찾으면 `[` 시도 + 둘 다 실패 시 throw "AI 응답에서 JSON 추출 실패" | OK |
| 토큰 한도 초과 (max_tokens 초과 잘림) | `extractJson`이 `}` 못 찾아서 throw → catch에서 화면 복귀. 단 부분 데이터로 복구 시도 X. **재시도 옵션 없음**. -1점 |
| 모델 응답에 JSON 아닌 텍스트 (예: "죄송합니다, 답변 불가") | `extractJson` throw → showScreen('ideas') 복귀. **사용자 입력 사라짐**. -1점 |

**미세 이슈**:
- `runEvaluation`에서 `progressInterval`, `logInterval` `clearInterval`은 catch에서 처리. OK.
- 단 분석 도중 사용자가 새로고침/뒤로가기 하면 진행 중 API 호출 abort 안 됨 (AbortController 미사용). 토큰 낭비 가능. 비개발자 영향 적음. 코드 품질 항목에서 감점.

---

## 4. 빈 상태 / 에러 UX (10점)

- 점수: **7/10**
- 검증 결과:

| 시나리오 | 처리 | 평가 |
|---|---|---|
| 시안 0개로 평가 시도 | `ideas.length < 2` 체크 line 349 + toast "최소 2개 입력" | OK |
| 채널 설명 빈 칸 | line 206-209 toast | OK |
| 페르소나 생성 실패 | catch에서 toast + 버튼 복구 | OK |
| 워드클라우드 데이터 0개 | line 579-582 "키워드 분석 데이터 부족" 메시지 | OK |
| 평가 응답 0개 (`responses` 빈 배열) | `processEvalResults`가 빈 배열 통과. winner.rate=0 → "클릭률 0%" 표시. **차트 비고, 페르소나 응답 0개**. 사용자 화면 빈 카드. **빈 상태 UX 없음** -2점 |
| 평가 응답 일부만 (예: 10명 × 5시안 = 50개 중 30개만) | `processEvalResults`는 통과. 일부 페르소나 응답 0개로 표시 (`clickedCount 0/0`) | 작동은 함. 단 사용자 혼란. 한 줄 경고 없음 -1점 |
| Claude가 `weight_shifts` 빈 배열 반환 | `renderWeightShift` (line 769) `shifts.map` 빈 배열 → `weightShiftList` 빈 div. **시연 효과 없음**. 명시 안내 없음 |
| `kakaoShareBtn`은 카톡 공유가 아니라 URL 복사. UX 거짓 광고 (line 1031-1035) | 카톡 공유 API 없이 단순 URL 복사 후 "카톡에 붙여넣기" 안내. 정직하지만 버튼 라벨 "카톡 공유"는 오해 -1점 |

**잘된 점**:
- 진행률 바 + 라이브 로그 (페르소나 등장 애니메이션) = 15-25초 대기 친절.
- 토스트 메시지 일관.
- 보정 버튼 disabled 처리 (line 633) - 중복 클릭 방지.

---

## 5. 모바일 UX (10점)

- 점수: **8/10**
- 검증 결과:

| 항목 | 상태 |
|---|---|
| viewport meta | `width=device-width, initial-scale=1.0` OK |
| theme-color | `#0F1E3D` 모바일 주소창 색 OK |
| max-w-3xl mx-auto + px-4 | 모바일 우선 OK |
| 터치 영역 | 버튼 `py-4 px-6` (16px+) - 접근성 가이드 44x44px 충족 OK |
| 폰트 크기 | base 14px (`@media max-width:640px body { font-size: 14px }`) + Tailwind `text-xs(12px)`, `text-[10px]`, `text-[11px]` 다수 사용 - **시니어 페르소나 (50-60대) 가독성 부담** |
| 페르소나 카드 traits (`text-[11px]`) | 모바일에서 어려움. 페르소나 60대 사용자가 자기 채널을 보면 글씨 너무 작음 -1점 |
| 워드클라우드 size-xl 24px - OK | |
| -webkit-tap-highlight-color: transparent | iOS 탭 하이라이트 제거 OK |
| 가로 스크롤 | `max-w-3xl mx-auto` + `px-4` + `pb-24` 푸터 여백 - OK |
| 텍스트 입력 폰트 16px | `idea-input input { font-size: 14px }` (style.css 156). **iOS Safari에서 14px 미만 input은 자동 zoom-in 발생 → UX 끔찍**. 16px 권장. -1점 |
| `<input type="email">`, `<input type="url">` | 모바일 키보드 자동 전환 OK |
| 진행 단계 stepBar `text-[10px] sm:text-xs` | 너무 작음. 미세 |

**잘된 점**:
- sticky header (`sticky top-0 z-40`) 모바일 OK
- 폰 로딩 (Noto Sans KR `preconnect`) OK
- `min-h-screen` body 전체 cream 배경 OK

---

## 6. 접근성 (10점)

- 점수: **4/10**
- 검증 결과:

### Semantic HTML
- `<header>`, `<main>`, `<footer>`, `<section>`, `<form>` 사용 OK
- `<h1>`, `<h2>`, `<h3>`, `<h4>` 위계 일부 일관성 부족 (랜딩 hero는 `<h2>` 인데 그 위가 `<h1>` Persona Lab - OK이긴 함)

### aria 속성
- **aria-label, aria-describedby, aria-live, role 전무**. (Grep 결과 0건)
- 진행률 바 `<div id="progressBar">`에 `role="progressbar"`, `aria-valuenow` 없음 -2점
- 로딩 화면 `aria-live="polite"` 없음 → 스크린리더가 변화 인지 못함 -1점
- `<button id="resetBtn">↻ 새로</button>` 이콘만 ↻ 사용 — `aria-label="처음부터"` 권장
- `<button id="settingsBtn">⚙ API</button>` - 그나마 텍스트 있어 OK
- `<button id="closeKeyBtn">×</button>` - `aria-label="닫기"` 누락 -1점

### 키보드 네비
- `<input>`, `<button>`, `<a>` 표준 요소 사용 → 키보드 OK
- `<details>` 페르소나 응답 - 키보드 OK
- 단 `cursor-pointer` div 없으니 OK

### 색 대비
- gold-500 (`#D9A028`) 배경 + navy-900 (`#0A1530`) 텍스트: 대비 OK
- navy-800 배경 + 흰색 텍스트: OK
- `text-gray-500` on bg-white: 4.5:1 미만 가능 (WCAG AA 실패 가능)
- `text-[10px]` `text-gray-400 text-center` (line 187, 223, 273, 363) 폼 안내 글: **시니어 가독성 매우 어려움 + 대비 부족** -1점

### 폼 레이블
- `<label class="block">` 각 input 위에 있음 OK
- 단 `<input id="apiKeyInput">`는 별도 label 연결 (`for=`) 없음. label은 같은 박스 위에 있어서 시각적 연결만 -1점

**감점 사유 종합**: aria 전무 -3, alt 없는 이모지 -1, label for 누락 -1, 폰트 대비 -1.

---

## 7. 성능 (10점)

- 점수: **7/10**
- 검증 결과:

### 외부 CDN 의존
- Tailwind CSS CDN `<script src="https://cdn.tailwindcss.com">` (line 18) - **production 비권장 (Tailwind 공식 문서)**. 매 로드마다 ~200KB JS 다운 + 런타임 CSS 생성. Phase 2에서 빌드 단계 권장. -1점.
- Chart.js CDN (UMD) ~200KB. OK.
- Google Fonts `Noto Sans KR` (400/500/700/900 4 weight) 무거움. preconnect 있어 OK. 단 한국어 폰트라 ~2MB+ 로드 가능 (font-display:swap이 `display=swap` 쿼리에 있어 OK).

### Chart.js 초기화
- `if (window.__clickChart) window.__clickChart.destroy()` (line 508) 재사용 시 destroy OK
- `calibrationChart`, `evolutionChart` 동일 패턴 OK
- 메모리 누수 위험 차단 잘됨

### 페르소나 카드 애니메이션
- CSS `nth-child(1-10)` animation-delay 하드코딩 (style.css 36-45) - 작동 OK
- `slideInRight 0.4s` + delay 0.05~0.5s → 마지막 카드 0.9초 후 등장. UX 부담은 적음

### API 호출 효율
- 총 3회 (톤 분석 / 페르소나 매칭 / 평가 / 보정 토론) - 4회. 평가 1회 = 50개 응답 batch = **잘됨** (1차 사이클 V3 시 50회 호출 함정 회피)
- 단 톤 분석 + 페르소나 매칭은 하나로 합칠 수 있음 (API 호출 절약). -1점

### 평가 응답 토큰 4000
- 50개 응답 × 30-50자 reason + JSON 구조 = 약 3500-4000 토큰. **빠듯**. 잘림 가능. 6000 권장. -1점

### 6개월 진화 애니메이션
- 26주 × stepMs(230ms) = 약 6초. setInterval로 chart.update('none')`. animation: { duration: 0 } 설정 OK.
- 단 매 step마다 `chart.update()` = 26회 redraw. 모바일에서 부담 가능 but 6초만이라 OK.

### Preconnect
- fonts.googleapis.com + fonts.gstatic.com preconnect OK
- api.anthropic.com preconnect 없음. 첫 API 호출 시 DNS 조회 추가 ~50-100ms. 미세

---

## 8. 코드 품질 (10점)

- 점수: **7/10**
- 검증 결과:

### 잘된 점
- 명확한 섹션 구분 주석 (`// ===`)
- 함수 분리 적절 (analyzeTone / generatePersonas / runEvaluation / fillRealData / runCalibrationDebate / renderEvolution)
- `state` 객체로 글로벌 상태 일원화
- `$()`, `$$()` 헬퍼 - 깔끔
- 변수명 한국어 도메인 잘 매칭 (clickRates, channelMatch, weight_shifts)
- README 한국어 + 비개발자 친화

### 개선 필요
1. **모델명 불일치 (치명)**:
   - `app.js:20` `MODEL = 'claude-sonnet-4-6'` - **존재하지 않을 가능성 매우 높음**
   - `README.md:127` `claude-sonnet-4-5-20250929`
   - `README.md:7` "Claude Sonnet 4.5"
   - `app.js:11` 주석 "claude-sonnet-4-6 (실제 호출 가능 모델, 2026-05 시점 최신 Sonnet)"
   - 현재 시점 (2026-05-17) Anthropic 공식 모델 ID는 `claude-sonnet-4-5-20250929` 또는 `claude-sonnet-4-5`. `claude-sonnet-4-6`은 가짜 추정. **실제 호출 시 400 에러 발생 가능**. **-3점, NO-GO 시나리오**.

2. **죽은 코드**:
   - `keyframes weightGrow` 정의 없는데 `animation: weightGrow 1.5s ...` 인라인 사용 (app.js:786). 작동 안 됨.
   - DOMContentLoaded에서 `[data-target] { transition: width 1.5s }` 추가 (line 962-967) - 별도 transition으로 동작은 하지만, 인라인 `animation: weightGrow`는 제거 권장.

3. **존재하지 않는 Tailwind 클래스**:
   - `bg-navy-100`, `hover:bg-navy-100` (line 178-181, 283) - tailwind config에 navy.600/700/800/900만 정의. `navy-100` 없음. **렌더링 X**. 호버 효과 없거나 깨짐.

4. **AbortController 미사용**:
   - 사용자가 평가 중 페이지 이탈 → API 계속 호출. 토큰 낭비.

5. **HTML escape 헬퍼 부재**:
   - innerHTML 사용 다수인데 escape 함수 0개. 보안 + 안정성 모두 약함.

6. **localStorage try/catch 일부만**:
   - `submitBeta` (line 918-922) try/catch OK
   - `loadApiKey`, `saveApiKey`, `clearApiKey` localStorage 호출 catch 없음. Safari Private Mode에서 quota exceeded 시 throw → unhandled.

7. **중복 코드**:
   - `personaResponses` `clicked = pResponses.find(r => r.click)` (line 550) + `skipped = pResponses.find(r => !r.click)` (line 551) 변수 선언했는데 `skipped` 미사용.

---

## 9. 차별화 한 줄 시그널 (5점)

- 점수: **4/5**
- 검증 결과:
- 랜딩 hero `<h2>` (line 94-98): "내 채널 전용 AI 청중 100명을 6개월 동안 진화시킨다" - **차별화 한 줄 명확** OK
- 그 아래 navy-800 박스 (line 115-122): "왜 캔바+ChatGPT로 못 하나?" + ❌❌✅ 3줄 비교 - **비교표 명확** OK
- 비교 정확성:
  - "TubeBuddy / Thumblytics: 1회성 AI 점수 80점 추상 점수" - **정확** (이들 모두 1회성 예측)
  - "Ask Rally: 영문 + B2B 대기업용 ($99+/월)" - **정확** (Ask Rally는 $99+ B2B)
  - "우리: 한국 페르소나 + 채널별 자가 학습 + 6개월 lock-in" - **MVP에서는 자가 학습 = 시연만 (Phase 2 lock-in)**. 사용자 오해 가능.
- 4단계 미리보기 카드 (line 125-146): 직관 OK
- "그리드 4칸 - ① 채널톤 ② AI청중 ③ 시안평가 ④ 6개월진화" - **사용자 즉시 이해 가능** OK

**미세 이슈**:
- 자가 학습 = "예측 vs 실제 데이터로 자가 학습"이 핵심인데 MVP는 가짜 데이터로 시연만. README Q3에 명시했지만 랜딩에서는 모호. "데모/시뮬"이라는 명시 부족 -1점.

---

## 10. 베타 신청 작동 (5점)

- 점수: **3/5**
- 검증 결과:
- mailto 링크 (line 902-912) - 정상 작동 가정. 단 mailto는:
  - **모바일 사용자 80%가 이메일 앱 미설정** → 작동 안 함 시나리오 존재. 사용자 좌절.
  - 데스크탑은 Gmail 기본 핸들러 등록되어 있을 때만 작동.
  - "이메일이 자동 열렸어요" (`#betaSuccess` line 366-370) - 안 열렸어도 표시됨. 사용자가 "보냈다고 생각" → 민티에게 도달 X. **베타 모집 누수**. -2점
- localStorage 저장 fallback (line 918-922) - 백업으로 OK 단 민티 PC에 도달 X
- 1차 사용자 모집 가능성:
  - 기술적으로 50% 성공률 추정 (mailto 작동 + 사용자가 send 누름)
  - **Google Forms 또는 Cloudflare Pages Form 권장**. R7 빌드는 Phase 1 MVP라 mailto 채택 정직. 단 "신청 완료" UI는 실제 send와 무관 → 거짓 확인 -1점 (소형 다크 패턴)
- 베타 신청 후 카톡 공유 버튼 (line 374-380) - URL 복사로 대체. 정직.

**잘된 점**:
- 이메일 + 채널 URL + 자기소개 3필드 - 최소 충분 OK
- `<input type="email" required>` - 브라우저 검증 OK
- 자기소개 placeholder "위너책쓰기 4기 졸업, AI 활용 자기계발 채널 운영 중" - 민티 자산 활용 OK

---

## QA 코드 종합: **69/100**

| 항목 | 점수 |
|---|---|
| 1. 8단계 플로우 | 13/15 |
| 2. 보안 | 8/15 |
| 3. API 오류 핸들링 | 8/10 |
| 4. 빈 상태/에러 UX | 7/10 |
| 5. 모바일 UX | 8/10 |
| 6. 접근성 | 4/10 |
| 7. 성능 | 7/10 |
| 8. 코드 품질 | 7/10 |
| 9. 차별화 한 줄 | 4/5 |
| 10. 베타 신청 | 3/5 |
| **합계** | **69/100** |

---

## NO-GO 시나리오 (해당)

**80점 미만 → NO-GO 추천 (qa-code 강령). 단 V4 회귀 한도 1/3 사용 중 (R5에서 1회 회귀했음 - F2+D3 통합 후보).**

### 치명적 이슈 (제품 자체 작동 불가)

1. **모델명 `claude-sonnet-4-6`은 가짜** - 실제 API 호출 시 400 에러. **사용자가 분석 시작 즉시 실패**. 이건 8단계 플로우 전체 동작 멈춤. **R7 회귀 강제 권장 (R3 회귀 X)**.

### 중대 이슈 (제품 작동은 하지만 결정적 약점)

2. XSS 위험 (Claude 응답을 escape 없이 innerHTML) - prompt injection으로 self-XSS 가능. 실제 공격은 어렵지만 베타 사용자 신뢰 손상 위험.
3. mailto 베타 신청 50% 실패율 + 거짓 "신청 완료" UI - 모집 성과 측정 불가능 + 사용자 신뢰 손상.
4. 접근성 점수 4/10 - aria 전무. 시니어 페르소나 60대(명숙) 자체 사용 어려움 → 자기모순.

### 권장

**NO-GO는 강력하지 않다.** 모델명 수정 1줄 + mailto → Google Forms 교체 = R7 직접 수정 30분이면 80점+ 달성 가능. **R8 직접 수정 + 재검증 권장**. R7 회귀까지 안 가도 됨.

---

## 권장 수정 사항

### R8 직접 수정 (즉시, 5-30분)

**우선순위 1 (치명, 5분)**:
- `app.js:20` `MODEL = 'claude-sonnet-4-5'` 또는 `'claude-sonnet-4-5-20250929'`로 교체 (실제 호출 가능 ID)
- `app.js:11` 주석 같이 수정
- README.md 모델 표기 일관화

**우선순위 2 (큰 사용성 영향, 20-30분)**:
- mailto → Google Forms iframe 또는 외부 폼 URL (Tally / Cloudflare Pages Form) 교체
- "신청 완료" UI를 mailto opened 후 사용자 확인 클릭 시에만 표시 (단순 페이지 전환 X)

**우선순위 3 (보안 hardening, 15-30분)**:
- `escapeHtml(s)` 헬퍼 추가 + innerHTML 사용처 6곳 모두 적용:
  ```js
  function escapeHtml(s) {
    return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  ```
- `_headers`에 CSP 추가:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://api.anthropic.com
  ```
- 모든 `target="_blank"` 외부 링크에 `rel="noopener noreferrer"` 추가 (행글라이터 링크 2곳)

### Phase 1.5 (배포 후 1주일 내, 1-2시간)

- 접근성: `role="progressbar"`, `aria-valuenow`, `aria-live="polite"`, `aria-label` 추가 (10곳)
- 빈 상태 UX: 평가 응답 0개 / weight_shifts 빈 배열 시 명시 메시지
- `tailwind navy-100` → `gray-200` 또는 config 추가
- `idea-input input` font-size 16px (iOS zoom 방지)
- API 호출 시 AbortController 추가 (페이지 이탈 시 abort)
- `<input id="apiKeyInput">`에 `for=` label 연결
- "카톡 공유" 버튼 라벨 → "카톡에 URL 보내기"로 정직화

### Phase 2 (1-2개월, 별도 작업)

- Tailwind CDN → 빌드 단계 (PostCSS) 전환
- Supabase 도입으로 베타 폼 자체 저장
- 토스페이먼츠 정기결제
- YouTube Analytics OAuth → 진짜 자가 학습 lock-in 시작 (현재는 시연만)

---

## 한 줄 요약

**Persona Lab MVP는 8단계 플로우 모두 빌드됐고 사용성도 괜찮지만, `claude-sonnet-4-6`이라는 잘못된 모델명으로 API 호출이 즉시 실패할 위험이 치명. R8 직접 수정 30분(모델명 + mailto 교체 + escape 함수)으로 80점+ 달성 가능. R7 회귀까지 강제할 정도는 아님. 종합 69/100, NO-GO 약하게.**

**NO-GO 여부**: **약한 NO-GO** (R7 회귀 X, R8 직접 수정 후 재검증 권장). 회귀 한도 절약.
