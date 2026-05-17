# V4 R3 attacker 박살 리포트

**작성**: attacker 에이전트 (Devil's advocate 단독, Steel man X)
**날짜**: 2026-05-17
**자기 색깔**: 무자비. 누구 편 X. 살아남는 건 R5의 일.
**WebSearch 사용 횟수**: 12회 (10회+ 강제 충족)
**거짓 인용 0건**: 모든 URL은 실제 검색 결과. 본인이 본 것만 인용.
**자가 점수 X** (V3 함정 #5 차단). 점수는 R4 평가자 영역.
**박살 범위**: A급 6개 + B급 7개 + C급 2개 = 15개 전부.

---

## 메인 Claude 1차 분류 (board.md) 반론 - 안전 수렴 의심

board.md는 A급 6개를 "이게 강하다" 분류했는데, 이 자체가 메인 Claude의 안전 수렴 함정이다. 6개 중 5개가 "민티 도그푸딩 / 위너책쓰기 졸업생 풀" 박스에 갇혀있고, 1개(D2)만 카테고리 신생인데 그것도 윤리 시비 거대. 메인 Claude가 V3 직후라 "검증 가능한 페인 + 1차 사용자 자산"에 무의식 편향. 진짜 차별성 검증은 attacker가 한다.

**메인 Claude 함정 의심 4가지**:
1. **위너책쓰기 도그푸딩 박스** - U1/U2/U3/F1/F4가 전부 위너책쓰기 깔대기. 외부 확장 못 하면 ARR 한도 명백 (한국 책쓰기 코치 100명 = 시장 너무 작음, 한책협 + MKYU 같은 기관이 자체 시스템 구축 시 즉시 무력).
2. **페르소나 단톡방 박스** - F1/F5/D1이 전부 "AI 페르소나 N명이 자기들끼리 대화" 메카닉. V3 카톡방 정치 시뮬레이터의 직접 답습 + AI Crew Solo Company / Sintra AI 글로벌 클론 다수.
3. **B2B SaaS 마진 환상** - 모든 후보가 월 2.9-9.9만원 가격대 + 1인 자산 100-300명 풀로 ARR 1억 + 추정. 실제 SaaS 결제율 1차 자산 풀에서 5-10% 현실. ARR 1억 = 100-300명 풀에서는 수학상 불가.
4. **MVP 90-120분 환상** - 정적 HTML로 진짜 가치 검증 어렵다. 6개 후보 중 4개가 "MVP는 시연 페이지만, 진짜 빌드는 Phase 2"라고 미리 변명 = 사용자 평가 시 "장난감" 인상 위험.

이제 15개 모두 박살.

---

## U1: 작가 마케팅 OS - 180일 자동 콘텐츠 캘린더

### attacker 박살
1. **한국+글로벌 클론**: 명백히 많다. ManuscriptReport (manuscript 분석 → reader personas + ad copy + 10+ marketing assets 패키지), Book Blaster (랜딩 페이지 + 트레일러 + 광고 카피 + 이메일 자동), BookAutoAI (AI book marketing strategy 자동), AI Marketing Automation 2026 가이드들이 "phased pre-launch 60 days + Long-Term Growth analytics" 정확히 같은 워크플로우 명시. ridibooks.com 한국 신간 캘린더 + carat.im "책 한 권으로 홍보 콘텐츠 무제한" + 가비아 AI 에디터 한국 클론. URLs: [ManuscriptReport AI Book Marketing 2026](https://manuscriptreport.com/blog/ai-book-marketing-complete-guide) / [BookAutoAI AI Book Publishing](https://blog.bookautoai.com/ai-book-publishing-tools/) / [carat.im 책 한 권으로 홍보 콘텐츠 무제한](https://carat.im/blog/ai-book-marketing-tips)
2. **페인 강도 약점**: 페인은 진짜 (출간 후 절벽). 하지만 "180일 자동 콘텐츠 캘린더" = 페인 해결의 진짜 답이 아님. 작가가 캘린더가 없어서 안 파는 게 아니라 "독자가 없어서" 안 팔린다 = discoverability 문제. 캘린더 자동 생성 = 빈 공간에 콘텐츠만 채움. 페인 진단 오류.
3. **수익 모델 약점**: 한국 자가출판 시장 진짜 작음. 부크크/유페이퍼 통계 매년 출판 수천 권이라지만 활성 작가 + 실제 결제 의향 = 300명도 안 됨. 월 2.9만원 × 45명 = 130만원 = "1인 콘텐츠 회사" 운영 수준. ARR 1억 = 위너책쓰기 졸업생 풀 300명에서 결제율 50% = 비현실. 출판사 B2B 월 39만원? 한국 1인 출판사가 이런 도구 결제 의향 = 검증 0건.
4. **차별성 약점**: "내 책 통째로 학습한 AI가 180일 캘린더" = ChatGPT API + Claude Sonnet 3시간 작업으로 작가 본인이 만들 수 있음. "캔바+ChatGPT 50시간" 주장이 과장. 게다가 ManuscriptReport / Book Blaster가 이미 한다.
5. **빌드/운영 약점**: 토스페이먼츠 정기결제 + Supabase + 카톡 알림톡 발송 = Phase 2. MVP 90-120분 = 단순 텍스트 paste → 인용구 50개 출력 = ChatGPT Plus 1회 호출로 충분. 차별성 0.
6. **윤리/도덕성 시비**: 작가가 책 한 권 쓴 후 "180일 자동 콘텐츠"를 무비판 발송 = 독자 피로 + 알고리즘 페널티 (네이버 블로그 AI 글 페널티 + 인스타 스팸 신호). 사용자가 결국 손으로 검토하면 자동화 의미 0.
7. **민티 자산 의존 함정**: 위너책쓰기 졸업생 300명 = 매년 50-100명 누적이라는데, 매년 누적 6년이어야 300명. 현재 1-2년차면 100명 미만. 외부 확장 = 행글라이터 구독자 중 "출간 경험자" 200명 = 자가추정, 검증 0건.
8. **NO-GO 시나리오**: 빌드 6개월 후 = 위너책쓰기 졸업생 50명 결제 + 외부 작가 5명 = 월 매출 60만원. ChatGPT GPT Store "북마케팅 캘린더" 출시 시 즉시 무력. ManuscriptReport 한국 진입 시 절멸.

---

## U2: 1인 책쓰기·강의 코치 7주 OS

### attacker 박살
1. **한국+글로벌 클론**: 글로벌 cohort LMS 다수. Disco / UpCoach / Simply.Coach / LifterLMS Course Cohorts / Circle / LearnDash / The Write Practice 책 코치 인증 프로그램. 한국에서 책쓰기 특화 SaaS 0건은 맞지만 = 시장이 너무 작아서 만든 사람이 없는 가능성 큼. TAKO by Asiance (Kakao AlimTalk/FriendTalk/LMS 메시징 솔루션) 이미 있음. URLs: [TAKO Asiance Kakao Messaging](https://lets-tako.com/) / [The 10 Best Cohort-Based Course Platforms 2024](https://sellcoursesonline.com/cohort-based-course-platforms) / [The Write Practice Book Coach Certification](https://thewritepractice.com/book-coach-certification/)
2. **페인 강도 약점**: 페인 진짜 (강사 카톡방 운영 hell). 하지만 한국 책쓰기 코치 100명 = 페인 강도가 높지만 **시장이 너무 작음**. 강사가 매월 3.9-9.9만원 결제 = 결제 후 "이건 노션+카카오톡으로도 되겠는데"라고 1-2개월 후 해지 가능성 큼.
3. **수익 모델 약점**: Year 2 ARR 5000만+ = 한국 1인 책쓰기 코치 + 1인 AI 강사 1000명 침투 5% = 50명. 5%는 SaaS 매우 낙관 수치 (현실 1-2%). 게다가 한책협 + MKYU 같은 기관이 자체 시스템 구축 = B2B 진입 차단. 카카오비즈니스 알림톡 마진 건당 4-6원 = 100명 코치 × 월 1500건 발송 × 5원 = 75만원 매출에 알림톡 발송비만 1125만원 = 마진 역전 가능성.
4. **차별성 약점**: Disco / UpCoach + 카카오 알림톡 = 노코드 + Zapier + 카톡 발송 API 직접 연결로 강사 본인이 1주일에 셋업 가능. 책쓰기 7주 단계 템플릿은 노션 템플릿 한 번 만들면 끝.
5. **빌드/운영 약점**: 카카오비즈니스 API 비개발자 셋업 마찰 큼 = 메인 Claude가 안내한다지만, 카카오 비즈니스 채널 인증 + 발신 프로파일 등록 + 템플릿 사전 승인 (3-7일 카카오 심사) = 비개발자 진입 장벽 거대. MVP에서 진짜 발송 시연 못 함 = 가치 검증 어려움.
6. **윤리/도덕성 시비**: AI 1차 피드백 자동 생성 = 수강생이 "AI 피드백을 받았다"는 사실 알 권리 + 코칭 비용 정당화 문제. 코치가 비싼 수강료(위너책쓰기 19.9만원/7주) 받고 AI 자동 피드백만 보내면 "코치가 일 안 했다" 반발 가능.
7. **민티 자산 의존 함정**: "민티 본인 보장 결제" = 1명. 위너책쓰기 졸업생 강사 전환자 5-10명 = 추정. Year 1 결제율 60% 보장 = 민티 + 졸업생 강사 = 5-7명 × 6만원 = 월 30-42만원 = 시간 ROI 마이너스 가능.
8. **NO-GO 시나리오**: 6개월 후 = 민티 + 위너책쓰기 졸업생 강사 3-5명 결제 = 월 20-30만원. 외부 코치 콜드 영업 시 "그냥 노션 + 카카오톡으로 한다" 거절. 한책협이 자체 시스템 출시 시 한국 시장 절멸.

---

## U3: 유튜브 채널 → 책 1권 자동 변환

### attacker 박살
1. **한국+글로벌 클론**: **명백한 글로벌 클론 다수**. Designrr ("the world's largest ebook creation software, 320,000 users, video/audio → ebooks within a few minutes"), Inkfluence AI YouTube → ebook ("turns content into structured eBooks in about 35 minutes"), Taskade AI YouTube to Ebook Converter, Transcribr YouTube transcript → ebook, NoteGPT, NoteLM.ai. 한국어 시장에서 "한국 클론 0건"은 R2 ideator-utility 자기 표기인데 = 위 도구들이 한국어 자막도 처리 가능 (Whisper 다국어 + Claude). URLs: [Designrr YouTube to Ebook](https://designrr.io/how-to-turn-your-youtube-content-into-ebook/) / [Inkfluence AI for YouTubers](https://www.inkfluenceai.com/for/youtubers) / [Taskade YouTube to Ebook](https://www.taskade.com/convert/youtube/youtube-to-ebook) / [Transcribr YouTube to Ebook](https://www.transcribr.io/youtube-transcript-to/ebook)
2. **페인 강도 약점**: 페인 자체가 약함. 영상 50편 → 책 한 권으로 변환하고 싶다는 욕구 = "있으면 좋겠다" 수준. 매일 짜증나는 페인 아님. 유튜버 본업이 책 출간이 아닌데 책 변환 = 부수입 욕구. 결제 의향 강도 약함.
3. **수익 모델 약점**: 1회권 9.9만원 분기당 18명 추정 = 비현실. Designrr 비교 시 한국 작가가 영문 도구 우회 사용 비용 = $14-29/월 = 변환 1권 = 1만원 = 1회권 9.9만원 9-10배 비쌈. 가격 경쟁력 0. 출판사 B2B "책당 50-100만원" = 출판사가 유튜버 영입 후 자체 도구 사용. 외부 SaaS 결제 의향 0.
4. **차별성 약점**: "자막 50편 → 책 + KDP 패키지" = Whisper STT + ChatGPT/Claude로 비개발자가 어렵지만 Designrr가 이미 1만원/월 가격에 함. "한국어 + KDP 자동 업로드" 정도가 차별. 그런데 KDP 자동 업로드는 KDP API 정책 위반 가능 (Amazon 자동 업로드 차단).
5. **빌드/운영 약점**: 챕터당 5000-8000자 자동 생성 = 영상 자막 압축 50편 = 토큰 한계 + 비용 큼 (Claude API 1회 책 변환 $5-10). 가격 9.9만원에 마진 OK이나 사용자 1-2주 수정 = "자동" 약속 못 지킴. 사용자 후기 "AI 티 나는 책"이라 KDP 거부 사례 있음 (Korea Times 9000권 AI 책 논란).
6. **윤리/도덕성 시비**: 한국 9000권 AI 책 출판 논란 진행중 = "AI 자동 변환 책" 자체가 시장 비판 대상. KDP 정책 변경 시 (AI 생성 책 표기 의무 또는 게시 거부) 무력.
7. **민티 자산 의존 함정**: "행글라이터 채널 본인 도그푸딩" = 민티 1명 도그푸딩으로 시장 검증 X. 위너책쓰기 졸업생 중 유튜버 30명 = 추정, 검증 0건.
8. **NO-GO 시나리오**: 6개월 후 = 민티 본인 책 1권 변환 + 외부 사용자 5-10명 = 분기 매출 100만원. Designrr 한국어 강화 또는 Inkfluence 한국 진입 시 즉시 절멸.

---

## U4: 1인 대행 리포팅 + 영업자료 OS

### attacker 박살
1. **한국+글로벌 클론**: 글로벌 클론 명백. Metricool ("PDF + PowerPoint reports + white label + multi-brand workflows", small/mid-sized agencies 특화), AgencyAnalytics, Hootsuite 화이트라벨, RecurPost, Vista Social. 한국 클론 = 디스럽트/아이디어키 외주 모델 + 키티챗 (인스타 자동화). URLs: [Metricool White Label for Agencies](https://help.metricool.com/en/article/white-label-for-agencies-knowing-the-product-1auao53/) / [Metricool For Agencies 2026](https://www.aitools-directory.com/metricool-for-agencies-2026/) / [10 Best Social Media Reporting Tools For Agencies 2026](https://www.aitools-directory.com/10-best-social-media-reporting-tools-for-agencies-in-2026/)
2. **페인 강도 약점**: 페인 진짜 (1인 대행 매월 리포팅 5-10시간). 하지만 1인 대행이 클라이언트 3-5개 = 매월 50-200만원 매출에서 도구 1.9-5.9만원 결제 의향 큼. 그런데 Metricool $25-50/월에 이미 OK + 한국어 부분만 부족 = "한국어 인사이트 작성" 추가만으로 시장 진입 어려움.
3. **수익 모델 약점**: Year 2 ARR 5000-6000만원 = 1인 마케팅 프리랜서 50명 + 소규모 에이전시 20개 + 인테리어 5-10개. 이 침투율(0.5-1%)이 SaaS 평균. 그런데 콘텐츠 마케팅 대행 시장 = 가격 경쟁 치열 + 도구 분리 결제 의향 낮음 (대행사가 자기 도구 만들거나 비싼 도구 거부).
4. **차별성 약점**: 한국 인스타+유튜브+네이버블로그 통합 + 한국어 자연어 인사이트 = 진짜 가치 있지만, 인스타 그래프 API + 유튜브 데이터 API + 네이버 블로그 RSS 셋업 + OAuth 진입 장벽 = 비개발자 결국 못 함. MVP는 수동 paste만 = 자동화 가치 0.
5. **빌드/운영 약점**: **OAuth 마찰이 거대**. 메타(인스타) Business 계정 + 페이스북 페이지 연결 + 그래프 API 토큰 발급 = 클라이언트마다 매번 새로 셋업. 비개발자 사용자 1차 진입 차단. MVP에서 진짜 자동 수집 시연 못 함.
6. **윤리/도덕성 시비**: 영업 자료 "타겟 회사 인스타 분석 + 경쟁사 비교 + 6개월 운영 시 예측 KPI" = AI 추정치를 클라이언트에 영업 자료로 제출 = 약속 못 지킬 위험 + 영업 사기 시비 가능.
7. **민티 자산 의존 함정**: 민티 본인이 인테리어 클라이언트 1호 = 매월 5.9만원 결제 보장. 외부 1인 프리랜서 모집 = 행글라이터 구독자 중 콘텐츠 마케팅 프리랜서 비율 검증 0건.
8. **NO-GO 시나리오**: 6개월 후 = 민티 1명 + 외부 5-10명 = 월 30-50만원. Metricool 한국어 인사이트 강화 + 한국 채널 통합 출시 시 즉시 무력.

---

## U5: 강사 부교재 5종 묶음 (PPT+워크북+실습+복습+FAQ)

### attacker 박살
1. **한국+글로벌 클론**: **명백한 캔바+ChatGPT 5분 컷 가까움**. Gamma AI (PPT 5초 생성, 한국 사용자 다수), Tome, Canva AI Caption Generator, edrawsoft 2026 PPT AI Top 5. ChatGPT "강의 PPT 20장 만들어줘" + Gamma 한 번에 통과. 워크북 PDF는 ChatGPT + 캔바. URLs: [Gamma AI Presentation Maker](https://gamma.app/ai-presentation-maker) / [AI PPT 제작 툴 TOP 6 비교](https://illyalive.com/8) / [2026 AI PPT 자동 생성 Top 5](https://www.edrawsoft.com/kr/diagram-tutorial/ai-ppt-maker-tool.html)
2. **페인 강도 약점**: 페인 진짜이나 (강의 1회 부교재 3-5시간). Gamma + ChatGPT 워크플로우 한 번 익히면 30분 컷. "5종 묶음 1클릭"이 진짜 시간 절약 = 30분 → 10분 = 페인 강도 약함.
3. **수익 모델 약점**: 1인 강사 월 2.9만원 = Gamma Plus ($10/월) + ChatGPT Plus ($20/월) = $30 이미 결제 중 = 추가 도구 결제 의향 낮음. 사내 강사 B2B 연 100-300만원 = 대기업 교육팀 = 자체 사내 도구 구축 또는 패스트캠퍼스/메가스터디 외주 = SaaS 진입 차단.
4. **차별성 약점**: "5종 묶음 자동" = 5번 호출 1클릭으로 묶음. 진짜 가치는 "강사 어조 학습 + 캔바 자동 적용" = 캔바 API 연동 마찰 + 어조 학습 임베딩 = MVP 시연 불가능.
5. **빌드/운영 약점**: 캔바 API 연동 = Phase 2 (1-2개월). MVP는 ChatGPT 출력 텍스트만 = 차별성 0. PPT 자동 디자인 = Gamma가 이미 함.
6. **윤리/도덕성 시비**: 사내 강사가 AI 자동 부교재 제출 = 강의료 정당화 시비 가능. 매번 같은 강의 "최신 트렌드 자동 갱신"이 진짜 갱신이 아니라 LLM 짜집기 = 강의 품질 저하.
7. **민티 자산 의존 함정**: 민티 본인 즉시 결제 7.9만원 + 위너책쓰기 졸업생 강사 전환 10명 = 11명 즉시 풀. 외부 1인 강사 침투 1% = 30명 = 검증 0건.
8. **NO-GO 시나리오**: 6개월 후 = 민티 + 위너책쓰기 강사 5명 = 월 25-40만원. Gamma 워크북 기능 추가 또는 한국 강사 도구 강화 시 무력.

---

## F1: AI 가상 독자 5명 단톡방

### attacker 박살
1. **한국+글로벌 클론**: **Storysnap이 명백한 클론**. "Virtual Beta Reader Reads Your Book in Minutes" + "select AI personas that understand nuances of your target genre" + "receive 5 beta reads simultaneously to compare reactions". 5명 페르소나 동시 반응 = 정확히 F1 메카닉. 추가: Authors A.I. Marlowe, AutoCrit Story Analyzer, HyperWrite AI Story Critique, Shapes AI Story Rater, Character.AI 페르소나. URLs: [Storysnap Virtual Beta Reader 5명 동시](https://storysnap.ai/virtual-beta-reader/) / [Storysnap AI 책 outliner](https://janefriedman.com/storysnap-ai-that-outlines-your-book/) / [HyperWrite AI Story Critique](https://www.hyperwriteai.com/aitools/ai-story-critique)
2. **페인 강도 약점**: "출간 전 독자 검증" = 위너책쓰기 7주차 즉시 도구라지만, 작가가 진짜로 매주 챕터 검증을 필요로 하는지 = 사용 빈도 검증 0건. 출간 1번 후 다시 안 씀 = LTV 짧음.
3. **수익 모델 약점**: 월 2.9만원 = 위너책쓰기 졸업생 50명 × 50% × 6개월 = 매출 435만원 (1회성). Year 2 외부 확장 = 한국 자가출판 작가 침투 0.1% 추정. Storysnap이 한국어 강화 또는 한국 진입 시 즉시 절멸. B2B 1인 책쓰기 코치 50명 = U2와 동일한 좁은 시장.
4. **차별성 약점**: "자기들끼리 단톡" 메카닉 = Storysnap "5 beta reads simultaneously"와 UX 차이만. Character.AI 페르소나 채팅 (글로벌 3억 MAU) + 한국 캐릭터봇 (Zeta 등) 다수. "카톡 UI 클론" = 차별성 약함 + 카카오 디자인 저작권 시비 가능.
5. **빌드/운영 약점**: 페르소나 5명 멀티턴 = Claude API multi-turn 토큰 비용 큼 (1회 시뮬 = $1-2 추정). 월 2.9만원에 무제한 = 마진 검토 필요. MVP 페르소나 3명으로 축소 = 차별성 더 약해짐.
6. **윤리/도덕성 시비**: 가상 독자가 "내 자서전 보고 운다" = 사용자가 진짜 감정 이입 = 가짜 위로 시비. AI 페르소나 = 작가 본인이 자가 칭찬 도구로 변질 가능 = 책 품질 저하.
7. **민티 자산 의존 함정**: 위너책쓰기 졸업생 50-100명 = 1회성 사용 (한 권 검증 후 안 씀). 행글라이터 구독자 중 책 쓰는 사람 100-300명 = 추정.
8. **NO-GO 시나리오**: 6개월 후 = 위너책쓰기 1기수 베타 + 외부 10-20명 = 1회성 매출 60-100만원. Storysnap 한국어 진입 또는 ChatGPT GPT Store "5명 베타 리더" GPT 출시 시 즉시 무력.

---

## F2: AI 청중 100명 썸네일 사전투표소

### attacker 박살
1. **한국+글로벌 클론**: **Ask Rally가 명백한 직접 클론**. "Audience Simulator with AI Personas" + "A/B test content on an audience that mimics real audiences" + 각 페르소나 = 실제 인터뷰 기반. Thumblytics ("simulating audience response + predicted CTR + audience preference heatmaps + qualitative feedback") = AI 페르소나 X 진짜 사람 패널이지만 시장 정확히 같음. TubeBuddy Thumbnail Analyzer, ReelMind AI prediction. URLs: [Ask Rally Audience Simulator](https://askrally.com/) / [He Built an AI Audience Simulator - Every podcast](https://every.to/podcast/100-ai-personas-said-you-d-click-this) / [Thumblytics AI Thumbnails](https://thumblytics.com/)
2. **페인 강도 약점**: "썸네일 사전 검증" = 페인 진짜 (행글라이터 매주 5종). 그런데 매주 사용 = 가능하나 결제 의향 검증 0건. 1인 크리에이터가 월 1.9만원 추가 결제 거부 가능 (이미 Vrew + Canva + ChatGPT Plus 결제 중).
3. **수익 모델 약점**: Year 1 ARR = 행글라이터 구독자 침투 1% × 월 1.9만원 = 100-300명 풀의 1% = 1-3명 = 무의미. 한국 1만+ 구독 유튜버 수만 명 침투 0.1% = 외부 확장이 진짜 시장. Ask Rally $99/월 가격대 + Thumblytics 진짜 사람 패널 = 가격/정확도 모두 경쟁사 우위.
4. **차별성 약점**: "한국 페르소나" = 진짜 차별이나 페르소나 100명 정확도 검증 0건. Thumblytics 진짜 사람 패널 = AI 추정보다 신뢰도 높음. AI 청중 시뮬레이션 정확도 = Claude/GPT 한국 페르소나 학습 데이터 한계 = "30대 워킹맘"이 진짜 30대 워킹맘처럼 답하는지 검증 어렵다.
5. **빌드/운영 약점**: 100명 페르소나 시뮬 = Claude API batch 1회 호출 $0.5-1 추정. 무료 5회/월 + 유료 무제한 = 어뷰징 가능 (페르소나 100명 토큰 큼). 마진 박살 위험.
6. **윤리/도덕성 시비**: AI 청중 추정을 실제 클릭률로 사용자에게 보여줌 = "이 시안 클릭률 12%" 같은 가짜 숫자 = 사용자 의사결정 오도 위험.
7. **민티 자산 의존 함정**: 행글라이터 도그푸딩 강함이나 = 매주 영상 1편 검증 = 민티 1명 × 월 1.9만원 = 사실상 도그푸딩만. 외부 확장 시 Thumblytics + Ask Rally 격차 큼.
8. **NO-GO 시나리오**: 6개월 후 = 행글라이터 도그푸딩 + 인테리어 클라이언트 1개 + 외부 10-20명 = 월 30-50만원. Ask Rally 한국어 또는 Thumblytics 한국 진입 시 절멸.

---

## F3: 잔혹 비평가 페르소나 (어머니/차장님)

### attacker 박살
1. **한국+글로벌 클론**: **명백한 클론 다수, 캔바+ChatGPT 5분 컷 영역**. ChatGPT GPT Store "Brutally Honest Critic" 다수 GPT, BrutalCritic.com, ScriptByAI Brutal Critic (디지털 아티스트용), HyperWrite Writing Critique AI, Google Vertex AI "글쓰기 비평" 공식 샘플 프롬프트. 한국어 Threads "AI 프롬프트 - 웹소설 슬럼프 잔혹 비평" 이미 존재. URLs: [Brutally Honest Critic GPT](https://chatgpt.com/g/g-KZz7Aveur-brutally-honest-critic) / [BrutalCritic AI Art Critic No Mercy](https://brutalcritic.com/) / [Google Vertex AI 글쓰기 비평 한국어 공식](https://cloud.google.com/vertex-ai/generative-ai/docs/prompt-gallery/samples/write_and_generate_writing_critique?hl=ko) / [Brutal ChatGPT Prompts Self-Improvement](https://cybercorsairs.com/this-ai-roast-is-insane/)
2. **페인 강도 약점**: "글쓰기 슬럼프" 페인 진짜이나, 슬럼프 사람이 진짜로 "AI에게 욕먹기"를 원하는지 검증 0건. 우울증 트리거 위험 + 1회 사용 후 트라우마 가능 = LTV 매우 짧음.
3. **수익 모델 약점**: 월 0.99만원 × 1000명 = 1000만원이 시나리오. 그런데 1000명 결제 = 행글라이터 구독자 풀의 매우 큰 비율 (10% 결제율 비현실, SaaS 평균 1-2%). "충동 결제" 후 1-2회 사용 + 해지 = 매출 200만원 미만 가능.
4. **차별성 약점**: ChatGPT에 "70대 어머니 어투로 내 글 욕해줘" 프롬프트 한 줄이면 끝. GPT Store 검색 시 동일 GPT 무료 다수. 차별성 = 한국어 어머니/차장님 어투 정밀도 + 강도 슬라이더 정도. 진짜 차별성은 약함.
5. **빌드/운영 약점**: 빌드 60-90분 가능 = 강점. 하지만 단순 = 사용자가 "이게 ChatGPT보다 뭐가 더 좋은가?" 즉시 질문. 페르소나 어투 system prompt 5종 = ChatGPT 사용자가 따라하기 5분.
6. **윤리/도덕성 시비**: 거대. "AI한테 욕먹기" 도구 = 우울증/자존감 저하 트리거. 한국 정신 건강 인식 + 위너책쓰기 수강생 슬럼프 회차 = 1명이라도 심각한 후기 나오면 SNS 폭격 위험. "안전 가이드"로 부족.
7. **민티 자산 의존 함정**: 위너책쓰기 슬럼프 회차 + 행글라이터 글쓰기 강의 = 즉시 풀 1000+이라는데 = 1000명 결제 = 비현실. 진짜 = 100명 결제 × 1만원 = 100만원 (1회성).
8. **NO-GO 시나리오**: 6개월 후 = 위너책쓰기 + 행글라이터 사용자 200-300명 1회 사용 + 결제 50-100명 = 매출 50-100만원. ChatGPT GPT Store "한국 어머니 비평" GPT 출시 시 즉시 무력 + 우울증 사고 1건 시 즉시 종료.

---

## F4: 7주 책쓰기 incremental 게임

### attacker 박살
1. **한국+글로벌 클론**: Universal Paperclips는 명백히 있고 그 자체로 강력 (한국어 위키 + 한국 유저 다수). 글로벌 incremental + AI = Talefy ("interactive AI stories"), Story.com ("half million users, interactive choices"), AI 책쓰기 + 게이미피케이션 결합 사례. URLs: [Universal Paperclips Wiki](https://en.wikipedia.org/wiki/Universal_Paperclips) / [Talefy Interactive AI Stories](https://talefy.ai/) / [Story.com Generate Interactive AI Stories](https://www.story.com/ai-stories)
2. **페인 강도 약점**: 페인은 약함. "7주 책쓰기 완주 실패"가 페인이지만 게임 메카닉으로 해결되는지 검증 0건. 게임 자체가 책 완성을 못 시킴 = 결국 사용자 손으로 챕터 수정 1-2시간/일 필요. 게임 도파민 ≠ 책 완성.
3. **수익 모델 약점**: 무료 1000명 → 5% 전환 = 50명 × 19.9만원 = 월 1000만원이 시나리오. 5% 전환 = SaaS/리드마그넷 매우 낙관 수치. 현실 1-2% = 월 200-400만원. 진짜 = 위너책쓰기 본 코칭 깔대기 도구로만 가치. 게임 자체 매출 X.
4. **차별성 약점**: Universal Paperclips + AI 책쓰기 = 메카닉 합성. 7주 cohort = 일정한 압박이지 게임 메카닉이 아님. "incremental 클리커 게임이 책 한 권을 완성시킨다" 약속 = 검증 어려움. 첫 1주 후 사용자 이탈률 매우 큼 (incremental 게임 평균 D7 retention 5-10%).
5. **빌드/운영 약점**: 빌드 복잡도 ★★★ = R7 120분 한도 빠듯이라고 ideator 본인 인정. 게이지 5개 + 7주 진행도 + AI 호출 + localStorage = MVP 1주차만으로 축소해도 게임 가치 검증 어려움.
6. **윤리/도덕성 시비**: incremental 클리커 = 도파민 중독 메카닉. "공부 안 하면 죽는 게임" = 위너책쓰기 수강생 (대부분 50-60대 자서전 작가)에 게임 도파민 의존시키는 게 윤리적인가. 게임으로 책쓰기 강제 = 책 품질 저하 위험.
7. **민티 자산 의존 함정**: 게임은 진입장벽 낮으나 결제 전환은 위너책쓰기 깔대기 의존. 외부 확장 = 한국 incremental 게임 사용자층 매우 작음.
8. **NO-GO 시나리오**: 6개월 후 = 무료 사용자 200-500명 + 위너책쓰기 본 코칭 전환 5-10명 (1-2%) = 매출 100-200만원. 게임 이탈률 + 챕터 품질 저하 후기 = 위너책쓰기 브랜드 손상 위험.

---

## F5: AI 직원 5명 매일 출근 단톡방

### attacker 박살
1. **한국+글로벌 클론**: **명백한 글로벌 클론 다수**. Sintra AI ("Hire Your First AI Employees Team"), Teammates.ai ("AI Employees: Digital Workforce from $25/mo"), AI Crew (R1 fresh.md #8 원본), MindStudio AI Standups ("structured 30-minute morning routines"), DigitalApplied AI Virtual Team Specialist. 한국 = 0건이라지만 글로벌은 폭발적. URLs: [Sintra AI Hire First AI Employees](https://sintra.ai/) / [Teammates AI Employees $25/mo](https://teammates.ai/ai-employees) / [Digital Applied AI Virtual Team](https://www.digitalapplied.com/blog/ai-virtual-team-specialist-agent-squad-playbook) / [MindStudio AI Standups](https://www.mindstudio.ai/blog/build-ai-agent-runs-overnight)
2. **페인 강도 약점**: "1인 사업자 + AI 직원 5명" = 흥미 시그널이지 페인 강도 약함. 매일 단톡방 = 사용자가 매일 카톡 확인 = 또 다른 알림 피로 추가.
3. **수익 모델 약점**: 월 4.9만원 = Sintra/Teammates 글로벌 $25-50/월과 가격 경쟁. 한국 1인 사업자 침투 1% = 수십만 명 × 1% = 수천 명 추정이나 실제 결제 의향 검증 0건. 콘텐츠 마케팅 대행 B2B 월 19.9만원 = 인테리어 사장이 자기 도구가 아닌 외주 도구 결제 의향 = 낮음.
4. **차별성 약점**: "한국어 + 1인 크리에이터 톤 + 매일 출근 단톡방 + 5명 자율 토론" = 메카닉 합성. F1과 메카닉 중복 (둘 다 페르소나 단톡방). V3 사이클 카톡방 정치 시뮬레이터 답습 (메인 Claude 자가 인정).
5. **빌드/운영 약점**: 매일 9시 알림 cron 필수 = 정적 HTML 불가. Cloudflare Workers + Cron Triggers Phase 2. MVP는 사용자 직접 클릭 = "매일 출근" 약속 못 지킴. 비개발자 시연 가치 0.
6. **윤리/도덕성 시비**: "AI 직원 단톡방 회의" = 사용자가 AI에 의사결정 위임 = 콘텐츠 품질 저하 + 사용자 스킬 위축 위험. "월 0원 직원 5명 채용" 마케팅 = 진짜 직원 일자리 위협 시비 가능.
7. **민티 자산 의존 함정**: 민티 본인 + 인테리어 클라이언트 = 매월 19.9만원 1건 보장. 외부 확장 검증 0건.
8. **NO-GO 시나리오**: 6개월 후 = 민티 + 인테리어 + 외부 10-20명 = 월 50-100만원. Sintra/Teammates 한국 진입 또는 한국 AI 직원 SaaS 출시 (시간 문제) 시 즉시 절멸.

---

## D1: 유령 회사 (자는 동안 AI 직원 자율 야간 근무)

### attacker 박살
1. **한국+글로벌 클론**: **명백한 직접 클론**. MindStudio Hermes Agent ("schedule autonomous AI tasks using natural language cron jobs + Daily reports, weekly summaries, hourly data checks, overnight processing"), MindStudio "AI Agent Runs Overnight" 공식 가이드, Claude Code Routines 24/7 AI Agents, n8n AI agents. F5와 메카닉 거의 같음 (board.md 자가 인정). URLs: [MindStudio Build AI Agent Runs Overnight](https://www.mindstudio.ai/blog/build-ai-agent-runs-overnight) / [MindStudio Hermes Cron Automation](https://www.mindstudio.ai/blog/build-cron-based-ai-automation-hermes-agent) / [Claude Code Routines 24-7](https://www.mindstudio.ai/blog/claude-code-routines-24-7-agents) / [Claude Routines vs n8n](https://www.mindstudio.ai/blog/claude-routines-vs-n8n)
2. **페인 강도 약점**: "잠자고 일어나면 결과물" = 흥미 시그널, 페인 강도 약함. 진짜 페인 = 비개발자가 cron 못 셋업, 그런데 MindStudio가 이미 해결 ("visually build agent logic, schedule cron without touching infrastructure").
3. **수익 모델 약점**: 월 4.9만원 = MindStudio/Claude Routines 무료-$20/월과 가격 경쟁. F5와 가격 충돌. Year 2 ARR 추정 = F5와 동일 = 5000-6000만원 = 비현실.
4. **차별성 약점**: "한국 카톡 아침 보고" = 진짜 차별 그러나 카카오 알림톡 API + cron + n8n = 비개발자 마찰. MVP 시연만 가능 = 진짜 가치 검증 X.
5. **빌드/운영 약점**: **MVP 한계 ideator 본인 인정**. "단일 정적 HTML로는 cron 못함. Cloudflare Workers + Cron Triggers 또는 Vercel Cron 필수. MVP는 시연 페이지 (어제 야간 결과물 mock)". 즉 R7 빌드 시 진짜 자율 야간 근무 시연 불가 = 사용자 평가 시 "장난감".
6. **윤리/도덕성 시비**: F5와 동일 + "야간 자율 실행" = 사용자가 통제 못 하는 콘텐츠가 새벽에 발송 = 사고 위험. 잘못된 응답이 자기 위너책쓰기 수강생에게 발송되면 회복 불가.
7. **민티 자산 의존 함정**: 민티 본인 = 즉시 결제. 한국 1인 크리에이터 8천-1만 명 추정 1% = 80-100명 = 검증 0건.
8. **NO-GO 시나리오**: 6개월 후 = 민티 본인 + 외부 5-10명 = 월 30-50만원. MindStudio/Claude Routines 한국어 강화 시 즉시 무력. cron 사고 1건 시 사용자 신뢰 즉시 붕괴. **board.md C급 제거 후보 분류 = attacker 동의**.

---

## D2: 살아 움직이는 책 (출간 후 매일 자가 증식 + 독자 투표 분기)

### attacker 박살
1. **한국+글로벌 클론**: **메카닉 일부 클론 존재**. Talefy ("Best AI Story Generator - Create Interactive Stories Online"), Story.com (half million users, "interactive choices, customizable details, consistent characters evolving in real-time"), AI Interactive Books (Issuu/Yumpu 비교). "출간 후 매일 자가 증식 + 한국어 자서전"이 좁은 클론 0건이지만 = "AI 인터랙티브 책" 카테고리 큰 빈자리 X. Korea Times 9000권 AI 책 논란 진행중. URLs: [Talefy AI Story Generator](https://talefy.ai/) / [Story.com Interactive AI Stories Evolving](https://www.story.com/ai-stories) / [AI Interactive Stories Jenova 2026](https://www.jenova.ai/en/resources/ai-interactive-stories)
2. **페인 강도 약점**: "출간 후 마케팅 절벽 반전" = 진짜 페인이나 해결책이 페인을 진짜로 해결하는가 = 검증 어려움. 독자가 매일 들어와서 새 문단 읽고 투표 = 일반 자서전 독자(50-60대 가족)는 1회 읽기 끝. 재방문률 매우 낮음 = 자가 증식 의미 0.
3. **수익 모델 약점**: 1회권 9.9만원 + 위너책쓰기 7주 + 9.9만원 패키지 = 위너책쓰기 가격 인상 정당화이나 = **위너책쓰기 가격 인상 자체가 시장 거부** 가능. 졸업생 매년 50-100명 × 50% × 9.9만원 = 연 250-500만원 = 1회성 매출.
4. **차별성 약점**: "매일 자라는 식물" = 흥미 시그널 강하나 = 6개월 후 사용자가 진짜 매일 들어오는지 검증 0건. Talefy/Story.com에서 사용자 재방문률이 답이 있다 = "interactive stories" 평균 D30 retention 5-10%. 페인 #1 반전 약속 못 지킴.
5. **빌드/운영 약점**: cron + 매일 새 문단 자동 작성 + 독자 투표 분기 + EPUB 매 갱신 자동 재출간 = 인프라 매우 큼. MVP 90-120분 = 6개월 → 6초 가속 데모 시연만. 진짜 6개월 자가 증식 시연 못 함.
6. **윤리/도덕성 시비**: **거대**. "AI 분량 = 작가 가치 희석" 한국 9000권 AI 책 출판 논란 직격. 자서전 = 본인 인생인데 AI가 매일 새 문단 자가 작성 = "이게 진짜 내 책인가" 정체성 시비. KDP 정책 변경 시 (AI 생성 책 표기 의무 또는 게시 거부) 즉시 무력.
7. **민티 자산 의존 함정**: 위너책쓰기 졸업생 50-100명 + 칠십 비로소 직격 = 50-60대 자서전 시장. 50-60대가 "매일 자라는 디지털 책"을 결제하고 사용 = 디지털 접근성 마찰 큼. 진짜 사용자 = 50-100명 풀의 10-20% = 5-20명 = 매우 작음.
8. **NO-GO 시나리오**: 6개월 후 = 위너책쓰기 자서전 졸업생 5-15명 결제 + 외부 0-5명 = 1회성 매출 100-200만원. Story.com/Talefy 한국 진입 + Korea Times AI 책 논란 격화 시 즉시 절멸. KDP/리디 AI 책 정책 변경 시 인프라 무력.

---

## D3: 예측 자가 보정 (feedback loop)

### attacker 박살
1. **한국+글로벌 클론**: **메카닉 일부 클론**. M1-Project ("AI Buyer Persona feedback mechanism that continuously improves targeting, fixed personas risk getting stale"), Mem0-powered persona memory ("retain context and behavioral patterns over time"), ReelMind.ai ("predictive analytics that suggest edits aligned with high-retention patterns"), Aimultiple Audience Simulation. "예측-실제 차이 페르소나 자가 보정" 메카닉 = 일부 클론 존재. URLs: [Aimultiple Audience Simulation LLMs](https://aimultiple.com/audience-simulation) / [M1-Project AI Buyer Persona Feedback](https://www.m1-project.com/blog/how-to-create-a-buyer-persona-that-drives-results-with-ai-powered-insights) / [ReelMind AI YouTube Mastery](https://reelmind.ai/blog/youtube-mastery-ai-tools-that-optimize-content-for-the-algorithm)
2. **페인 강도 약점**: F2 페인의 변형 = "썸네일 사전 예측"의 진보. 그런데 진짜 페인 = "내 청중을 모른다"인데 = 6개월 후 자가 학습 청중 = 6개월 기다리는 인내 + 매주 데이터 입력 마찰 = 사용자 이탈률 높음.
2-1. **마찰 거대 추가**: "사용자가 매주 진짜 데이터 입력" = ideator 본인 인정 "마찰 큼". 진짜 자동화 = YouTube Analytics API auto-import = Phase 2.
3. **수익 모델 약점**: F2와 동일. 월 2.9만원 × 한국 유튜브 1만+ 구독 채널 침투 1% = 수백 명이라고 추정이나 = 1% 침투 + 6개월 lock-in이 진짜 작동하는지 검증 0건.
4. **차별성 약점**: feedback loop = 진짜 새로움이나 = 6개월 후 결과 = 검증 시간 거대. "내 청중 100명 lock-in" = 사용자가 진짜로 이 가치를 느끼는가 = 검증 0건. Mem0/M1-Project가 이미 한다.
5. **빌드/운영 약점**: feedback loop = 매주 데이터 입력 + 페르소나 가중치 보정 알고리즘 + 100명 페르소나 무한 호출 = 토큰 비용 폭증. 월 2.9만원에 마진 어려움.
6. **윤리/도덕성 시비**: AI 청중 정확도가 진짜 정확해지는가 = 사용자가 6개월 후에야 검증 가능 = 그동안 가짜 청중에 의사결정 의존 위험.
7. **민티 자산 의존 함정**: 행글라이터 본인 도그푸딩 + 매주 시연 = 메인 가치. 외부 확장 = F2와 동일.
8. **NO-GO 시나리오**: 6개월 후 = 행글라이터 도그푸딩 시연만 진행 + 외부 사용자 진짜 정확도 검증 0건 = 결제 의향 약함 = 매출 30-50만원. F2와 동시 출시 시 시장 분할 + 둘 다 약화.

---

## D4: 분신 자가 컷 (시안 7개 중 3개 자가 제거)

### attacker 박살
1. **한국+글로벌 클론**: Blue Pill AI ("Creative Pre-Testing with AI Personas"), UXPin AI Personas, HeyMarvin AI Personas, Hubspot Make My Persona, Postiz "agentic social media scheduling tool", Garde AI ("Moderate with Garde AI filters incoming content before goes live + review flagged posts approve/reject manually"). "자가 제거 권한"이 좁은 차별이나 = Garde AI 모더레이션 + Postiz agentic이 일부 함. URLs: [Postiz All-in-One Agentic Social Media](https://postiz.com/) / [Flockler AI Content Moderation](https://flockler.com/blog/ai-content-moderation) / [Best AI Instagram Post Generators 2026](https://creatorflow.so/blog/ai-instagram-post-generator/)
2. **페인 강도 약점**: "의사결정 피로" = 페인 약함. 시안 7개 중 3개 잘라준다 = 진짜 시간 절약은 5-10분/일 = 결제 의향 약함.
3. **수익 모델 약점**: 월 3.9만원 × 한국 인스타 1만+ 팔로워 크리에이터 + 1인 사업자 10만 명 추정 1% = 1000명 시나리오. 1% 침투 SaaS = 매우 낙관. 현실 0.1-0.5% = 100-500명 × 3.9만원 = 월 400-2000만원 = ARR 5000만-2.4억 추정 범위가 너무 넓다.
4. **차별성 약점**: "AI 자가 제거 권한 + 컷 이유 1초 복원" = UX 차별이나 = Garde AI / Postiz 일부 클론. 한국어 + 본인 톤 학습 정도가 차별.
5. **빌드/운영 약점**: 본인 톤 학습 임베딩 = 사용자 과거 7-30일 게시물 + 좋아요 데이터 업로드 = 인스타 API OAuth + 데이터 권한 = 진입 장벽. MVP 90-120분 = 시안 7개 입력 → 분신 5명 자가 토론 시뮬레이션 = 정적 데모만 = 진짜 가치 검증 X.
6. **윤리/도덕성 시비**: **거대**. "AI가 잘라준다" = 사용자 통제권 상실 트라우마, 특히 1인 크리에이터 본인 손맛 = 본인 표현권 침해 시비. 잘못된 자가 제거 = 사용자 손실 책임 누구 = 법적 시비 가능.
7. **민티 자산 의존 함정**: 민티 본인 + 인테리어 클라이언트 = 즉시 검증. 외부 확장 = 행글라이터 구독자 중 본인 톤 학습 의향 검증 0건.
8. **NO-GO 시나리오**: 6개월 후 = 민티 + 인테리어 + 외부 10-20명 = 월 50-80만원. Postiz/Garde AI 한국 진입 시 무력. 자가 제거 사고 1건 시 사용자 신뢰 즉시 붕괴.

---

## D5: 사후 100년 후계자 (살아있는 동안 보조 + 사후 100년 발송)

### attacker 박살
1. **한국+글로벌 클론**: **명백한 글로벌 클론 + 한국 클론 존재**. HereAfter AI, StoryFile, Eternos (Robert LoCascio Palo Alto 2024 출시, AI 음성/성격 학습 + 채팅 초대), **DeepBrain AI (한국)** "grief tech 공간에서 avatars and interactive experiences 발달". Korea 7세 아이 VR 시뮬 2020 다큐 매우 유명. URLs: [AI Grief Tech Ethical Debates Digital Legacies](https://www.gingerliu.com/ai-grief-tech-sparks-hope-and-ethical-debates-over-digital-legacies/) / [Eternos Robert LoCascio AI Afterlife](https://www.ie.edu/uncover-ie/digital-afterlife-ie-school-of-science-and-technology/) / [Digital Necromancy AI Ethics 2025](https://www.liveaiwire.com/2025/07/digital-necromancy-ai-and-ethics-of.html)
2. **페인 강도 약점**: 페인 자체가 의심. "사후 100년 손주에게 매년 영상" = 페인이 아니라 욕구. 매일 짜증 X. 결제 의향 매우 약함.
3. **수익 모델 약점**: 1회권 평생 49만원 = 한국 60대+ 자서전 시장 매년 수천 권 × 1% = 수십 명 × 49만원 = 연 수천만원. 위너책쓰기 졸업생 50-60대 매년 20-30명 × 49만원 = 연 1000-1500만원 = 매우 작음. 평생 1회권 = LTV 매우 낮음.
4. **차별성 약점**: "살아있는 동안 보조 + 사후 100년 + 가족 윤리 키" = 메카닉 합성이지 진짜 차별 X. HereAfter/StoryFile/Eternos가 이미 사후 chatbot 함. "한국 자서전 + 가족 다중 서명 윤리 키" 정도가 차별이나 = 진짜 100년 인프라 유지 불가능 (회사 망하면 끝).
5. **빌드/운영 약점**: **MVP 한계 ideator 본인 인정**. "MVP는 5년 후 손주에게 보낼 영상 미리보기 시연 + 베타 신청 폼. 진짜 사후 100년 발송은 Phase 2 (법적 / 윤리 / 인프라 별도)". 즉 진짜 가치 검증 0. 사용자가 "이게 진짜 100년 운영 가능?" 즉시 의심.
6. **윤리/도덕성 시비**: **시비 자체가 거대**. 디지털 영생 + 가족 동의 + 한국 정서 (사후 조상 존중) 충돌. Dr. Jessica Heesen 학계 비판 "Digital avatars could act like a painkiller in preventing the bereaved from accepting and dealing with their loss" 정확히 짚음. Korea 7세 아이 VR 사례 = 한국 정서 미디어 논란 거대. attacker 무조건 짚을 윤리 시비. **board.md C급 제거 후보 분류 = attacker 동의 절대**.
7. **민티 자산 의존 함정**: 위너책쓰기 자서전 50-60대 졸업생 매년 20-30명 = 매우 좁은 풀. 디지털 영생 결제 의향 검증 0건.
8. **NO-GO 시나리오**: 6개월 후 = 위너책쓰기 자서전 졸업생 0-5명 결제 + 외부 0-3명 = 매출 0-400만원. 윤리 사고 1건 (가족 분쟁, 미동의 발송) 시 즉시 사업 종료 + 민티 본업(위너책쓰기) 브랜드 손상. 100년 인프라 약속 = 회사 망하면 거짓 = 사기 시비 가능.

---

## 박살 한 줄 요약

15개 모두 5개 이상 약점 + NO-GO 시나리오 명시. **박살 못 한 후보 0개** (모두 박살).

### 가장 박살 약한 후보 = R5 평가자 참고용

attacker 직감 (자가 점수 X):
1. **U2 (1인 코치 7주 OS)** - 한국 카카오 알림톡 진입 장벽 + 민티 본인 도그푸딩 보장 = 6개 후보 중 NO-GO 시나리오가 가장 늦게 옴 (월 30만원이라도 보장). 단 ARR 5000만 약속은 박살.
2. **U4 (1인 대행 리포팅)** - Metricool 한국어 부족 빈자리는 진짜 + 민티 본인 인테리어 클라이언트 1호 보장 = 박살 약함. 단 OAuth 마찰이 진짜 큰 함정.
3. **F1 (AI 가상 독자 단톡방)** - Storysnap 직접 클론 + 카톡 UI 클론 약점이나 = "5명 자기들끼리 대화" UX는 Storysnap (사용자가 1대1 페르소나 받음)과 진짜 차별. 그러나 LTV 1회성.

### 가장 박살 강한 후보 (R5에서 제거 추천)

1. **D5 (사후 100년 후계자)** - 윤리 시비 거대 + 100년 인프라 못 지킴 + 시장 매우 좁음 + HereAfter/DeepBrain AI 직접 클론. **NO-GO 절대.**
2. **D1 (유령 회사)** - MindStudio Hermes Agent / Claude Code Routines 직접 클론 + cron 마찰 + MVP 시연만 + F5 메카닉 중복. **NO-GO 추천.**
3. **U3 (유튜브 → 책)** - Designrr (32만 사용자) / Inkfluence AI / Taskade / Transcribr 직접 클론 + 한국 9000권 AI 책 논란 + KDP 정책 위험. **NO-GO 추천.**
4. **F3 (잔혹 비평가)** - ChatGPT GPT Store + 한국어 프롬프트 다수 = 캔바+ChatGPT 5분 컷 영역 + 우울증 트리거 윤리 위험. **NO-GO 추천.**
5. **U5 (강사 부교재 5종)** - Gamma + Tome + Canva = 30분 컷 영역. **NO-GO 추천.**

### 메인 Claude 도전

board.md A급 6개 분류 자체가 안전 수렴. attacker 시각으로는:
- **D5 + D1 = C급 절대 동의** (제거)
- **U3 + F3 + U5 = C급 추가 추천** (캔바+ChatGPT 5분 컷 가까움)
- **남는 6개 후보 (U1/U2/U4/F1/F2/D2)** 중 진짜 살아남을 가능성 있는 건 U2 + U4 + F1 정도. 그러나 모두 시장 작음 + 글로벌 클론 임박.
- **D3 + D4 = 메카닉 흥미이나 차별 약점 + feedback loop 검증 6개월** 위험.

R5 평가자가 페인 30 / 흥미 30 / 차별 20 / 실현 20 가중치로 다시 평가하면 = **80점+ 통과 후보 0-2개 추정**. board.md "3-5개 살아남기 목표"는 attacker 시각으로는 비현실. 1-2개 통과 또는 NO-GO 회귀가 정직한 답.

---

**박살 종료. R5 평가자에게 넘김.**
