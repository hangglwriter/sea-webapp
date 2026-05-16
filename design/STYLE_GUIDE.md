# 오늘의 K-운세 - STYLE_GUIDE

**목적**: 엔지니어가 CSS/React 컴포넌트로 즉시 변환 가능한 디자인 시스템 정의
**기반**: PRD_v1.md 7장 디자인 톤 + 8장 페이지 구성
**카드 시안**: `card-template.svg` (9:16), `card-template-square.svg` (1:1)

---

## 1. 색 팔레트

### 1.1 베이스 (PRD 명시)

| 토큰 | HEX | 용도 |
|------|-----|------|
| `--color-cream` | `#FAF6F0` | 페이지 배경, 카드 베이스 |
| `--color-dusty-pink` | `#F5D0CC` | 메인 포인트, 버튼, 카드 그라데이션 끝 |
| `--color-cream-warm` | `#FBEFE8` | 카드 그라데이션 중간 톤, 보조 배경 |

### 1.2 행운 컬러 (오방색 변주, 기본 3색)

| 토큰 | HEX | 한국 명 |
|------|-----|---------|
| `--lucky-pink` | `#F5D0CC` | 더스티 핑크 (적 변주) |
| `--lucky-green` | `#A4C8B0` | 세이지 그린 (청 변주) |
| `--lucky-yellow` | `#F2C66D` | 머스타드 옐로우 (황 변주) |
| `--lucky-blue` | `#9EB7D6` | 더스티 블루 (보조) |
| `--lucky-purple` | `#C9B0D9` | 라일락 (보조) |
| `--lucky-coral` | `#F2A099` | 코랄 (보조) |
| `--lucky-mint` | `#B8E0D2` | 민트 (보조) |
| `--lucky-mustard-deep` | `#D9A847` | 진한 머스타드 (보조) |

> AI가 동적으로 3색을 뽑을 때 위 8색 풀 안에서 선택하도록 프롬프트에 명시 권장 (일관된 톤 유지).

### 1.3 텍스트 색

| 토큰 | HEX | 용도 |
|------|-----|------|
| `--text-primary` | `#3D2B26` | 본문, 운세 한 줄 (어두운 브라운) |
| `--text-secondary` | `#8C6E68` | 보조 텍스트, 라벨 |
| `--text-tertiary` | `#A88B85` | 워터마크, 캡션 |
| `--text-muted` | `#C9A89E` | 일러스트 색, 장식 점 |

### 1.4 UI 색

| 토큰 | HEX | 용도 |
|------|-----|------|
| `--border-soft` | `#E8D5CF` | 카드 구분선, 옅은 보더 |
| `--border-line` | `#D9B8B2` | 외곽 프레임 |
| `--surface-glass` | `rgba(255,255,255,0.55)` | 반투명 정보 카드 |
| `--shadow-chip` | `0 4px 6px rgba(0,0,0,0.08)` | 컬러 칩 그림자 |

### 1.5 CSS 변수 일괄 정의 (복붙용)

```css
:root {
  /* 베이스 */
  --color-cream: #FAF6F0;
  --color-cream-warm: #FBEFE8;
  --color-dusty-pink: #F5D0CC;

  /* 행운 컬러 풀 */
  --lucky-pink: #F5D0CC;
  --lucky-green: #A4C8B0;
  --lucky-yellow: #F2C66D;
  --lucky-blue: #9EB7D6;
  --lucky-purple: #C9B0D9;
  --lucky-coral: #F2A099;
  --lucky-mint: #B8E0D2;
  --lucky-mustard-deep: #D9A847;

  /* 텍스트 */
  --text-primary: #3D2B26;
  --text-secondary: #8C6E68;
  --text-tertiary: #A88B85;
  --text-muted: #C9A89E;

  /* UI */
  --border-soft: #E8D5CF;
  --border-line: #D9B8B2;
  --surface-glass: rgba(255, 255, 255, 0.55);
  --shadow-chip: 0 4px 6px rgba(0, 0, 0, 0.08);
  --shadow-card: 0 10px 30px rgba(61, 43, 38, 0.08);

  /* 그라데이션 */
  --bg-gradient: linear-gradient(180deg, #FAF6F0 0%, #FBEFE8 55%, #F5D0CC 100%);
}
```

---

## 2. 폰트

### 2.1 한국어 본문 - Pretendard

- **CDN (전체 import)**:
  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/static/pretendard.min.css">
  ```
- **npm**: `npm i pretendard` (또는 sub-package `pretendard-std`)
- **사용 예시**:
  ```css
  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', sans-serif;
  }
  ```
- **라이센스**: SIL OFL 1.1 (상업적 사용 자유)

### 2.2 한국어 손글씨 - 카페24 오스퀘어 에어 (Cafe24Ohsquareair)

- **용도**: 카드 중앙 운세 한 줄 (감성 톤)
- **CDN**:
  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/Cafe24Ohsquareair.css">
  ```
- **사용 예시**:
  ```css
  .fortune-line {
    font-family: 'Cafe24Ohsquareair', 'Pretendard', sans-serif;
    font-weight: 400;
  }
  ```
- **라이센스**: 카페24가 무료 배포 + 상업적 사용 허용 (출처 표기 권장)
- **대체안**: 마루부리 (`MaruBuri`) - 네이버 클로바 무료 폰트. CDN: `https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-04@1.0/MaruBuri-Regular.css`

### 2.3 영문 보조 - 시스템 산세리프

- 별도 로드 없이 `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` 사용
- 영어 라벨 (LUCKY COLOR 등)은 Pretendard에 영문 글리프 포함되어 있어 그대로 OK

### 2.4 폰트 사이즈 스케일 (모바일 우선)

| 토큰 | px | 용도 |
|------|-----|------|
| `--fs-xs` | 12px | 캡션, 워터마크 |
| `--fs-sm` | 14px | 보조 라벨 |
| `--fs-base` | 16px | 본문 |
| `--fs-md` | 18px | 라벨 강조 |
| `--fs-lg` | 22px | 부제목 |
| `--fs-xl` | 28px | 제목 |
| `--fs-2xl` | 36px | 큰 제목 (모바일 운세 한 줄) |
| `--fs-3xl` | 56px | 행운 숫자 (모바일) |
| `--fs-4xl` | 80px | 행운 숫자 (데스크톱) |

> 카드 SVG는 1080px 기준 고정 스케일. 화면 UI는 위 스케일 사용.

---

## 3. 일러스트 (별/달/꽃)

### 3.1 직접 작성 SVG (라이센스 0 - 즉시 사용)

#### 별 (5-pointed star)

```html
<svg viewBox="-10 -10 20 20" width="24" height="24" fill="currentColor">
  <path d="M0,-9 L2.5,-2.5 L9,-2.5 L3.5,1.5 L5.5,8 L0,4 L-5.5,8 L-3.5,1.5 L-9,-2.5 L-2.5,-2.5 Z"/>
</svg>
```

#### 달 (초승달)

```html
<svg viewBox="-12 -12 24 24" width="32" height="32" fill="currentColor">
  <path d="M-2,-10 A10,10 0 1 0 8,8 A8,8 0 1 1 -2,-10 Z"/>
</svg>
```

#### 꽃 (5장 꽃잎)

```html
<svg viewBox="-15 -15 30 30" width="40" height="40">
  <g fill="currentColor">
    <circle cx="0" cy="-8" r="5"/>
    <circle cx="7" cy="-2.5" r="5"/>
    <circle cx="4.5" cy="6.5" r="5"/>
    <circle cx="-4.5" cy="6.5" r="5"/>
    <circle cx="-7" cy="-2.5" r="5"/>
    <circle cx="0" cy="0" r="3.5" fill="#FBEFE8"/>
  </g>
</svg>
```

> 모두 `fill="currentColor"` 사용 - CSS `color` 속성으로 색 제어 가능. 카드 SVG에서 `<symbol>`로 정의 후 `<use>`로 재사용 중.

### 3.2 무료 라이브러리 (보강 필요 시)

| 라이브러리 | URL | 특징 |
|----------|-----|------|
| Lucide Icons | https://lucide.dev | star/moon/flower 깔끔한 라인 아이콘. MIT 라이센스. npm `lucide-react`. |
| Phosphor Icons | https://phosphoricons.com | 6가지 weight (regular/duotone 등). MIT. |
| Heroicons | https://heroicons.com | Tailwind 팀 제작. MIT. |

> 본 디자인은 직접 SVG로 충분. 추가 아이콘 필요 시 Lucide 권장 (스타일 유사).

---

## 4. 인터랙션 가이드

### 4.1 트랜지션 토큰

```css
:root {
  --ease-soft: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --dur-fast: 0.2s;
  --dur-base: 0.35s;
  --dur-slow: 0.6s;
}
```

### 4.2 입력 → 결과 전환 (PRD 7장 명시 "0.5초 + 작은 별 애니메이션")

```css
.result-card {
  opacity: 0;
  transform: translateY(-20px) rotate(-1deg);
  animation: cardEnter var(--dur-slow) var(--ease-bounce) forwards;
}

@keyframes cardEnter {
  0% { opacity: 0; transform: translateY(-30px) rotate(-2deg); }
  60% { opacity: 1; transform: translateY(8px) rotate(0.5deg); }
  100% { opacity: 1; transform: translateY(0) rotate(0); }
}
```

### 4.3 작은 별 트윙클 (장식 별)

```css
.star-twinkle {
  animation: twinkle 2.4s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
}

/* 별마다 지연 다르게 */
.star-twinkle:nth-child(2) { animation-delay: 0.4s; }
.star-twinkle:nth-child(3) { animation-delay: 0.8s; }
```

### 4.4 버튼 hover (다운로드 큰 라운드 핑크 버튼)

```css
.btn-primary {
  background: var(--color-dusty-pink);
  color: var(--text-primary);
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 18px;
  padding: 18px 36px;
  border-radius: 999px;
  border: none;
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: transform var(--dur-fast) var(--ease-soft),
              box-shadow var(--dur-fast) var(--ease-soft),
              background var(--dur-fast) var(--ease-soft);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 36px rgba(245, 208, 204, 0.5);
  background: #F2C0BB;
}

.btn-primary:active {
  transform: translateY(0);
}
```

### 4.5 컬러 칩 hover (HEX 복사 후크)

```css
.color-chip {
  cursor: pointer;
  transition: transform var(--dur-fast) var(--ease-bounce);
}
.color-chip:hover {
  transform: scale(1.12) rotate(3deg);
}
```

### 4.6 입력 폼 포커스

```css
.input-field {
  background: #FFFFFF;
  border: 2px solid var(--border-soft);
  border-radius: 16px;
  padding: 14px 18px;
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  color: var(--text-primary);
  transition: border-color var(--dur-fast) var(--ease-soft),
              box-shadow var(--dur-fast) var(--ease-soft);
}
.input-field:focus {
  outline: none;
  border-color: var(--color-dusty-pink);
  box-shadow: 0 0 0 4px rgba(245, 208, 204, 0.3);
}
```

---

## 5. 카드 레이아웃 규칙

### 5.1 9:16 (스토리, 1080x1920)

| 영역 | y 좌표 | 비율 |
|------|--------|------|
| 상단 헤더 (로고+이름+날짜) | 60-400 | 21% |
| 중앙 운세 한 줄 | 600-1080 | 25% |
| 하단 정보 카드 (3분할) | 1180-1720 | 28% |
| 워터마크 | 1800-1880 | 4% |
| 여백 | 나머지 | 22% |

### 5.2 1:1 (피드, 1080x1080)

| 영역 | y 좌표 | 비율 |
|------|--------|------|
| 상단 헤더 | 80-280 | 18% |
| 중앙 운세 한 줄 | 380-700 | 30% |
| 하단 정보 카드 (3분할) | 750-1010 | 24% |
| 워터마크 | 1030-1060 | 3% |

### 5.3 공통 원칙

- 외곽 패딩: 9:16은 60px, 1:1은 40px
- 라운드 코너: 외곽 프레임 36-48px, 내부 카드 28-36px
- 컬러 칩: 항상 원형 (`border-radius: 50%`), 그림자 필수
- 행운 숫자: 흰색 원 안에 큰 숫자 (`font-weight: 800`)

---

## 6. 한국어 텍스트 규칙 (CLAUDE.md 준수)

- 쌍따옴표: `"` (U+201C) / `"` (U+201D)
- 홑따옴표: `'` (U+2018) / `'` (U+2019)
- em dash 금지, hyphen (`-`) 사용
- 영문 + 한글 사이는 띄어쓰기 (예: "AI 윤문")

---

## 7. 페이지 구성 와이어 (PRD 8장 매핑)

### 7.1 입력 페이지 (Landing)

```
┌─────────────────────────────────┐
│        [오늘의 K-운세]         │ ← Pretendard 24px, letter-spacing 4
│       ✦ ✦ ✦ (장식 별)         │
│                                 │
│      [ 미니 한국 풍경 일러스트 ]  │ ← 200x200px
│                                 │
│   "이름과 생일만 알려주세요"      │ ← Pretendard 22px, --text-secondary
│                                 │
│   ┌─────────────────────────┐  │
│   │ 이름                    │  │ ← 입력 필드 (4.6 스타일)
│   └─────────────────────────┘  │
│                                 │
│   ┌─────────────────────────┐  │
│   │ 생년월일 (date picker)  │  │
│   └─────────────────────────┘  │
│                                 │
│   ┌─────────────────────────┐  │
│   │ 생시 (선택, 기본 "자시")│  │
│   └─────────────────────────┘  │
│                                 │
│   ┌─────────────────────────┐  │
│   │   오늘의 운세 받기  ✦   │  │ ← 큰 핑크 버튼 (4.4)
│   └─────────────────────────┘  │
│                                 │
│   어제 본 사람 → 어제 운세 보기  │ ← 텍스트 링크 (--text-tertiary)
└─────────────────────────────────┘
```

### 7.2 결과 페이지

```
┌─────────────────────────────────┐
│       [ ← 다시 받기 ]           │
│                                 │
│   ┌─────────────────────────┐  │
│   │                         │  │
│   │   [ 9:16 또는 1:1 카드 ]│  │ ← card-template.svg 렌더
│   │                         │  │
│   └─────────────────────────┘  │
│                                 │
│      [ 9:16 ] [ 1:1 ]           │ ← 비율 토글 (탭)
│                                 │
│   ┌─────────────────────────┐  │
│   │  📥 PNG로 저장          │  │ ← html2canvas
│   └─────────────────────────┘  │
│                                 │
│   ┌────────┐  ┌────────────┐   │
│   │  공유  │  │ 친구에게   │   │ ← navigator.share / 링크 복사
│   └────────┘  └────────────┘   │
│                                 │
│   ─── 최근 7일 ───              │
│   [월][화][수][목][금][토][일] │ ← 작은 미니 카드 그리드
└─────────────────────────────────┘
```

---

## 8. 엔지니어 즉시 변환 체크리스트

- [ ] `:root` CSS 변수 복붙 (1.5)
- [ ] Pretendard CDN link 삽입 (2.1)
- [ ] 카페24 손글씨 CDN link 삽입 (2.2)
- [ ] 별/달/꽃 SVG 인라인 컴포넌트화 (3.1) - React면 `<Star/>` `<Moon/>` `<Flower/>` 컴포넌트
- [ ] 트랜지션 토큰 추가 (4.1)
- [ ] 결과 카드 등장 애니메이션 (4.2)
- [ ] 버튼 primary 스타일 (4.4)
- [ ] 입력 필드 스타일 (4.6)
- [ ] 카드 렌더링은 `card-template.svg` 구조 그대로 + 데이터 바인딩
  - 이름: `{userName}`
  - 날짜: `{formattedDate}`
  - 운세 한 줄: `{fortuneOneLiner}` (2줄 분할)
  - 컬러 칩 3개: `{luckyColors[0..2]}` HEX → fill 속성
  - 숫자: `{luckyNumber}`
  - 키워드: `{luckyKeyword}`
- [ ] html2canvas로 PNG export (`scale: 2`로 레티나 해상도)

---

## 9. 라이센스 요약

| 자산 | 라이센스 | 비고 |
|------|----------|------|
| Pretendard | SIL OFL 1.1 | 상업 사용 자유 |
| Cafe24 Ohsquareair | 카페24 무료 배포 | 상업 사용 OK, 출처 표기 권장 |
| 직접 작성 SVG (별/달/꽃) | 본 프로젝트 자체 자산 | 자유 사용 |
| 카드 SVG (`card-template.svg`) | 본 프로젝트 자체 자산 | 자유 사용 |

---

**디자이너 종료. 엔지니어 착수 가능.**
