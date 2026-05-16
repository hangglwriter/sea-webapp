# 오늘의 K-운세 카드 (Today's K-Fortune)

이름과 생일만 넣으면 한국 사주 기반 오늘의 운세를 인스타용 1장 카드로. 30초 안에.

## 실행

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/
npm run preview    # dist/ 로컬 확인
```

## Claude API 키 설정 (선택)

API 키 없이도 사전 작성 운세 풀로 동작한다 (Plan B). 진짜 AI 윤문을 쓰려면:

1. 프로젝트 루트에 `.env.local` 파일 생성
2. `VITE_CLAUDE_API_KEY=sk-ant-xxxxx` 추가
3. `npm run dev` 또는 `npm run build` 재실행

**보안 주의**: 프론트엔드에서 직접 API를 호출하므로 키가 노출된다. v1 MVP 한정이며, v1.1에서 Cloudflare Pages Functions로 proxy 전환 예정. 운영 키 사용 금지, 사용량 제한 걸린 테스트 키만 사용할 것.

## 기술 스택

- Vite + Vanilla JS
- lunar-javascript (음력 변환 + 만세력 일주)
- Claude API (claude-sonnet-4-6)
- html2canvas (카드 PNG 출력)
- localStorage (캐시 + 7일 기록)

## 배포

Cloudflare Pages (GitHub Connect 방식). `npm run build` 후 `dist/` 자동 배포.

자세한 사양: [PRD_v1.md](./PRD_v1.md)
