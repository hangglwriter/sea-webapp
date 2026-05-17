/**
 * Persona Lab - app.js
 * V4 R7 MVP build
 *
 * 8단계 플로우:
 * 랜딩 → API키 → 채널톤 → 페르소나10명 → 시안5종 → 평가결과 → 보정시연 → 6개월진화 → 베타신청
 *
 * Anthropic API 호출 패턴 (V3 답습):
 * - 사용자 본인 API 키 → localStorage 저장
 * - browser fetch + anthropic-dangerous-direct-browser-access: true
 * - claude-sonnet-4-5 (안정 alias, 2026-05 시점 검증됨)
 */

// ============================================================
// 상수 / 상태
// ============================================================

const STORAGE_KEY = 'persona_lab_api_key';
const STORAGE_TONE = 'persona_lab_last_tone';
const MODEL = 'claude-sonnet-4-5';
const API_URL = 'https://api.anthropic.com/v1/messages';

const state = {
  apiKey: '',
  channelDesc: '',
  channelScripts: '',
  toneSummary: '',
  personas: [], // [{id, name, age, role, traits, summary}]
  ideas: [],    // ['시안1', '시안2', ...]
  evalResults: null, // {results: [{personaId, ideaIndex, click: true/false, reason}], clickRates: [...], topComments: [...]}
  realData: null,    // 시뮬레이션 데이터
  calibrationDebate: null
};

// 한국 페르소나 시드 (10명)
const PERSONA_SEEDS = [
  { id: 'p1', name: '지수', age: 22, role: '20대 여대생', traits: '인스타·틱톡 헤비유저, 트렌드 민감, "갬성" 시각 우선, 책읽기 적음' },
  { id: 'p2', name: '민지', age: 28, role: '20대 후반 직장인', traits: '자기계발 콘텐츠 즐겨봄, 퇴근 후 30분 유튜브, 실용적 후킹 좋아함' },
  { id: 'p3', name: '수현', age: 34, role: '30대 워킹맘', traits: '시간 부족, 즉시 도움 되는 콘텐츠만, "5분만에" 같은 후킹 강함, 모바일 100%' },
  { id: 'p4', name: '영주', age: 38, role: '30대 후반 1인 사업자', traits: '효율·생산성 콘텐츠 추종, "ROI" 단어 좋아함, 디테일 한 줄 평가' },
  { id: 'p5', name: '재훈', age: 42, role: '40대 자영업자', traits: '실전 노하우 우선, 광고스러운 제목 거부감, 솔직한 비교/리뷰 클릭' },
  { id: 'p6', name: '혜경', age: 45, role: '40대 워킹맘+책쓰기 관심', traits: '자서전·에세이 관심, 깊이 있는 콘텐츠, 차분한 톤 선호, 50대 진입 준비' },
  { id: 'p7', name: '동현', age: 50, role: '50대 부장', traits: 'AI·디지털 따라가려 노력 중, 정중·전문 톤 선호, 신뢰감 있는 출처 우선' },
  { id: 'p8', name: '경자', age: 56, role: '50대 후반 자영업', traits: '실용·생활 정보 우선, 자극적 제목 피로, 따뜻한 톤 좋아함' },
  { id: 'p9', name: '명숙', age: 64, role: '60대 은퇴자·자서전 관심', traits: '인생 후반 회고, 글쓰기 동기, 시니어 친화 시각, 큰 글씨·또렷한 메시지 선호' },
  { id: 'p10', name: '준영', age: 31, role: '30대 1인 유튜버', traits: '동종업계 분석, 벤치마킹 의도 강함, 실제 KPI 숫자 우선, 메타 콘텐츠 좋아함' }
];

// ============================================================
// 헬퍼
// ============================================================

function $(id) { return document.getElementById(id); }
function $$(selector) { return document.querySelectorAll(selector); }

// XSS 차단: AI 응답을 innerHTML에 삽입할 때 사용
function esc(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showToast(msg, duration = 2500) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  t.classList.remove('hidden');
  setTimeout(() => {
    t.classList.remove('show');
    t.classList.add('hidden');
  }, duration);
}

function showScreen(screenId) {
  $$('.screen').forEach(s => s.classList.add('hidden'));
  const target = $(`screen-${screenId}`);
  if (target) {
    target.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  updateStepBar(screenId);
}

function updateStepBar(screenId) {
  const bar = $('stepBar');
  if (screenId === 'landing' || screenId === 'beta') {
    bar.classList.add('hidden');
    return;
  }
  bar.classList.remove('hidden');
  const stepMap = { tone: 1, personas: 2, ideas: 3, loading: 3, results: 4, calibration: 5, evolution: 5 };
  const current = stepMap[screenId] || 0;
  $$('.step-dot').forEach(dot => {
    const s = parseInt(dot.dataset.step);
    dot.classList.remove('active', 'done');
    if (s === current) dot.classList.add('active');
    else if (s < current) dot.classList.add('done');
  });
}

function setResetVisible(visible) {
  $('resetBtn').classList.toggle('hidden', !visible);
}

// ============================================================
// API 키 관리
// ============================================================

function loadApiKey() {
  state.apiKey = localStorage.getItem(STORAGE_KEY) || '';
  if (state.apiKey) {
    $('apiKeyInput').value = state.apiKey;
    $('keyStatus').textContent = '✓ 저장됨 · ' + state.apiKey.slice(0, 12) + '...';
    $('keyStatus').className = 'text-[10px] text-green-600 mt-2 font-bold';
  }
}

function saveApiKey() {
  const v = $('apiKeyInput').value.trim();
  if (!v) {
    showToast('API 키를 입력해주세요');
    return;
  }
  if (!v.startsWith('sk-ant')) {
    showToast('Anthropic 키 형식이 아니에요 (sk-ant-... 로 시작)');
    return;
  }
  localStorage.setItem(STORAGE_KEY, v);
  state.apiKey = v;
  $('keyStatus').textContent = '✓ 저장됨';
  $('keyStatus').className = 'text-[10px] text-green-600 mt-2 font-bold';
  showToast('API 키 저장 완료');
  setTimeout(() => $('apiKeyPanel').classList.add('hidden'), 500);
}

function clearApiKey() {
  localStorage.removeItem(STORAGE_KEY);
  state.apiKey = '';
  $('apiKeyInput').value = '';
  $('keyStatus').textContent = '';
  showToast('삭제됨');
}

// ============================================================
// Anthropic API 호출
// ============================================================

async function callClaude(systemPrompt, userPrompt, maxTokens = 2000) {
  if (!state.apiKey) {
    throw new Error('API 키가 없어요. 우측 상단 ⚙ API 버튼에서 입력해주세요.');
  }

  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  };

  let response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': state.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(body)
    });
  } catch (e) {
    throw new Error('네트워크 오류. 인터넷 연결 확인 후 다시 시도해주세요.');
  }

  if (!response.ok) {
    let detail = '';
    try {
      const errData = await response.json();
      detail = errData.error?.message || '';
    } catch (_) {}
    if (response.status === 401) throw new Error('API 키가 올바르지 않아요. ⚙ API에서 다시 확인해주세요.');
    if (response.status === 429) throw new Error('Anthropic 호출 한도 초과. 1분 후 다시 시도해주세요.');
    if (response.status === 400) throw new Error('요청 오류: ' + detail);
    throw new Error(`API 오류 (${response.status}): ${detail || '잠시 후 다시 시도'}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

function extractJson(text) {
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first < 0 || last < first) {
    // 배열 시도
    const af = text.indexOf('[');
    const al = text.lastIndexOf(']');
    if (af < 0 || al < af) throw new Error('AI 응답에서 JSON 추출 실패');
    return JSON.parse(text.slice(af, al + 1));
  }
  return JSON.parse(text.slice(first, last + 1));
}

// ============================================================
// 1단계: 채널 톤 분석
// ============================================================

async function analyzeTone() {
  const desc = $('channelDesc').value.trim();
  const scripts = $('channelScripts').value.trim();

  if (!desc) {
    showToast('채널 한 줄 설명은 필수예요');
    return;
  }
  if (!state.apiKey) {
    showToast('먼저 API 키를 입력해주세요');
    $('apiKeyPanel').classList.remove('hidden');
    return;
  }

  state.channelDesc = desc;
  state.channelScripts = scripts;
  localStorage.setItem(STORAGE_TONE, desc);

  const btn = $('analyzeToneBtn');
  btn.disabled = true;
  btn.textContent = '분석 중... (5-10초)';

  try {
    const system = `너는 한국 1인 크리에이터 채널의 톤 앤 매너 분석가다.
입력된 채널 설명과 영상 자막을 보고 다음을 한국어로 한 문장(50자 내외)으로 요약하라.
- 채널 정체성 / 타깃 청중 / 톤 (친근·전문·시니어 등)
JSON 형식으로 응답: {"tone_summary": "..."}`;
    const user = `채널 설명: ${desc}\n\n${scripts ? '영상 자료:\n' + scripts.slice(0, 1500) : '(영상 자료 없음)'}`;

    const text = await callClaude(system, user, 500);
    const parsed = extractJson(text);
    state.toneSummary = parsed.tone_summary || desc;

    // 페르소나 생성으로 이동
    await generatePersonas();
  } catch (e) {
    showToast(e.message);
    btn.disabled = false;
    btn.textContent = '다음: 청중 10명 만들기 →';
  }
}

// ============================================================
// 2단계: 페르소나 10명 생성
// ============================================================

async function generatePersonas() {
  // 시드 + 채널 톤 결합
  // 토큰 절약: 시드 그대로 사용하고 톤 매칭 한 줄만 AI로 추가
  // 단 R7 빌드에서 진짜 wow 위해서 채널 톤 기반 한 줄 코멘트 + 클릭 성향 단어 자가 생성

  $('analyzeToneBtn').textContent = '청중 10명 만드는 중...';

  try {
    const system = `너는 한국 1인 크리에이터 채널의 청중 페르소나 매핑 전문가다.
주어진 한국 페르소나 10명 각각에 대해, 입력된 채널 톤과 매칭되는 "이 페르소나가 이 채널 영상을 클릭하는 경향" 한 줄을 한국어로 생성하라.

페르소나 10명:
${PERSONA_SEEDS.map(p => `${p.id}: ${p.name}(${p.age}세, ${p.role}, ${p.traits})`).join('\n')}

응답 형식 (JSON):
{"p1": "이 채널을 ___해서 클릭", "p2": "...", ..., "p10": "..."}
각 값 40-60자, 친근 한국어, 페르소나 입장.`;

    const user = `채널 톤: ${state.toneSummary}\n채널 설명: ${state.channelDesc}`;

    const text = await callClaude(system, user, 1500);
    const parsed = extractJson(text);

    state.personas = PERSONA_SEEDS.map(seed => ({
      ...seed,
      channelMatch: parsed[seed.id] || `${seed.role}로서 이 채널에 관심이 있어 가끔 클릭`
    }));

    renderPersonas();
    showScreen('personas');
  } catch (e) {
    showToast(e.message);
    $('analyzeToneBtn').disabled = false;
    $('analyzeToneBtn').textContent = '다음: 청중 10명 만들기 →';
  }
}

function renderPersonas() {
  $('toneSummary').textContent = '"' + state.toneSummary + '"';
  const list = $('personaList');
  list.innerHTML = state.personas.map((p, i) => `
    <div class="persona-card flex gap-3 p-3 bg-cream rounded-xl border border-gray-200">
      <div class="persona-avatar">${esc(p.name.charAt(0))}</div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-bold text-navy-900">${esc(p.name)} <span class="text-gray-500 font-normal text-xs">· ${esc(p.age)}세 ${esc(p.role)}</span></p>
        <p class="text-[11px] text-gray-600 mt-0.5">${esc(p.traits)}</p>
        <p class="text-[11px] text-navy-700 mt-1 font-semibold">→ ${esc(p.channelMatch)}</p>
      </div>
    </div>
  `).join('');
}

// ============================================================
// 3단계: 시안 5종 입력
// ============================================================

function renderIdeaInputs() {
  const box = $('ideaInputs');
  box.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const div = document.createElement('div');
    div.className = 'idea-input';
    div.innerHTML = `
      <div class="idea-input-num">${i + 1}</div>
      <input type="text" data-idx="${i}" placeholder="시안 ${i + 1} 텍스트 (썸네일 카피 또는 제목, 5-50자)" maxlength="80" value="${state.ideas[i] || ''}" />
    `;
    box.appendChild(div);
  }
}

function loadExampleIdeas() {
  const examples = [
    '챗GPT로 책 1권 7주 만에 쓰는 법',
    '책쓰기 코칭 19.9만원 솔직 후기',
    '7주 책쓰기 완주율 80% 만든 시스템',
    '나도 7주 만에 작가 됐다 - 실전 후기',
    'AI 없이 책 쓰는 사람 95%가 실패하는 이유'
  ];
  examples.forEach((text, i) => {
    const input = document.querySelector(`#ideaInputs input[data-idx="${i}"]`);
    if (input) input.value = text;
  });
  showToast('예시 5개 입력됨');
}

function collectIdeas() {
  state.ideas = [];
  for (let i = 0; i < 5; i++) {
    const input = document.querySelector(`#ideaInputs input[data-idx="${i}"]`);
    const v = input ? input.value.trim() : '';
    if (v) state.ideas.push(v);
  }
  return state.ideas;
}

// ============================================================
// 4단계: 시안 평가 (Claude API 1회)
// ============================================================

async function runEvaluation() {
  const ideas = collectIdeas();
  if (ideas.length < 2) {
    showToast('시안을 최소 2개 입력해주세요 (5개 권장)');
    return;
  }
  if (!state.apiKey) {
    showToast('API 키가 필요해요');
    $('apiKeyPanel').classList.remove('hidden');
    return;
  }

  showScreen('loading');
  $('loadingTitle').textContent = 'AI 청중 10명이 시안을 보고 있어요';
  $('loadingSub').textContent = '클릭? 스킵? 이유는?';
  $('liveLog').innerHTML = '';

  // 진행률 애니메이션
  let pct = 0;
  const progressInterval = setInterval(() => {
    pct = Math.min(95, pct + Math.random() * 8);
    $('progressBar').style.width = pct + '%';
    $('progressText').textContent = Math.floor(pct) + '%';
  }, 300);

  // 페르소나 등장 애니메이션
  let pIdx = 0;
  const logInterval = setInterval(() => {
    if (pIdx < state.personas.length) {
      const p = state.personas[pIdx];
      const li = document.createElement('div');
      li.textContent = `→ ${p.name}(${p.age}세 ${p.role}) 검토 중...`;
      li.className = 'opacity-80';
      $('liveLog').appendChild(li);
      pIdx++;
    }
  }, 800);

  try {
    const system = `너는 한국 1인 크리에이터 채널의 AI 청중 시뮬레이터다.
한국 페르소나 10명을 동시에 빙의해서, 각각 5개 시안(썸네일 카피 또는 영상 제목) 각각에 대해 "클릭한다 / 스킵한다 + 이유 한 줄"을 답한다.

# 채널 정보
${state.toneSummary}

# 페르소나 10명
${state.personas.map(p => `${p.id} (${p.name}, ${p.age}세 ${p.role}): ${p.traits}. 이 채널에 대한 성향: ${p.channelMatch}`).join('\n')}

# 시안 ${ideas.length}개
${ideas.map((idea, i) => `시안${i + 1}: "${idea}"`).join('\n')}

# 출력 규칙
1. 반드시 JSON으로만 응답. 마크다운 / 설명 금지.
2. 페르소나 10명 × 시안 ${ideas.length}개 = 총 ${10 * ideas.length}개 응답.
3. 각 응답: click (true/false) + reason (한국어 25-50자, 페르소나 어투, 솔직)
4. 클릭/스킵 분포 = 페르소나 성향과 시안 매칭 따라 다양하게. 모두 클릭/모두 스킵 X.
5. 이유는 시안별로 다르게. "그냥 좋아서" 같은 추상 X. 구체적으로.

# 출력 형식
{
  "responses": [
    {"persona_id": "p1", "idea_index": 0, "click": true, "reason": "..."},
    {"persona_id": "p1", "idea_index": 1, "click": false, "reason": "..."},
    ...
  ]
}`;

    const user = `위 ${10 * ideas.length}개 응답을 JSON으로 생성하세요. 페르소나별 클릭 패턴이 다양하게 나오도록.`;

    const text = await callClaude(system, user, 4000);
    const parsed = extractJson(text);

    clearInterval(progressInterval);
    clearInterval(logInterval);
    $('progressBar').style.width = '100%';
    $('progressText').textContent = '100%';

    // 결과 가공
    processEvalResults(parsed.responses || [], ideas);

    setTimeout(() => {
      renderResults();
      showScreen('results');
      setResetVisible(true);
    }, 400);

  } catch (e) {
    clearInterval(progressInterval);
    clearInterval(logInterval);
    showToast(e.message);
    showScreen('ideas');
  }
}

function processEvalResults(responses, ideas) {
  // 시안별 클릭률 계산
  const clickRates = ideas.map((idea, i) => {
    const ideaResponses = responses.filter(r => r.idea_index === i);
    const clicks = ideaResponses.filter(r => r.click).length;
    return {
      idea,
      ideaIndex: i,
      total: ideaResponses.length,
      clicks,
      rate: ideaResponses.length > 0 ? Math.round((clicks / ideaResponses.length) * 100) : 0
    };
  });

  // 워드클라우드 (이유에서 핵심 단어 추출)
  const wordCounts = {};
  responses.forEach(r => {
    const words = (r.reason || '').match(/[가-힣]{2,}/g) || [];
    words.forEach(w => {
      // 너무 일반적인 단어 제외
      if (['그래서', '하지만', '그런데', '있어요', '있어', '같아', '같아요', '이런', '저런', '느낌', '내용', '영상', '제목', '시안', '채널', '클릭', '스킵', '보고', '보면', '같음'].includes(w)) return;
      wordCounts[w] = (wordCounts[w] || 0) + 1;
    });
  });
  const topWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 18);

  state.evalResults = {
    responses,
    clickRates,
    topWords,
    ideas
  };
}

function renderResults() {
  const { clickRates, responses, topWords, ideas } = state.evalResults;

  // 1위 추천
  const sorted = [...clickRates].sort((a, b) => b.rate - a.rate);
  const winner = sorted[0];
  $('winnerText').textContent = `"${winner.idea}"`;

  // 1위 이유 = 클릭한 페르소나들의 이유 종합 (앞 2개)
  const winnerReasons = responses
    .filter(r => r.idea_index === winner.ideaIndex && r.click)
    .slice(0, 3)
    .map(r => {
      const p = state.personas.find(pp => pp.id === r.persona_id);
      return p ? `${p.name}: "${r.reason}"` : '';
    })
    .filter(Boolean);
  $('winnerReason').textContent = `클릭률 ${winner.rate}% (${winner.clicks}/${winner.total}). ${winnerReasons[0] || ''}`;

  // 차트
  drawClickChart(clickRates);

  // 페르소나별 응답
  renderPersonaResponses(responses, ideas);

  // 워드클라우드
  renderWordCloud(topWords);
}

function drawClickChart(clickRates) {
  const ctx = $('clickChart').getContext('2d');
  if (window.__clickChart) window.__clickChart.destroy();

  window.__clickChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: clickRates.map((c, i) => `시안 ${i + 1}`),
      datasets: [{
        label: '클릭률 (%)',
        data: clickRates.map(c => c.rate),
        backgroundColor: clickRates.map(c => {
          const max = Math.max(...clickRates.map(x => x.rate));
          return c.rate === max ? '#D9A028' : '#16285A';
        }),
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            afterLabel: (ctx) => clickRates[ctx.dataIndex].idea.slice(0, 30) + '...'
          }
        }
      },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } }
      }
    }
  });
}

function renderPersonaResponses(responses, ideas) {
  const box = $('personaResponses');
  box.innerHTML = state.personas.map(p => {
    const pResponses = responses.filter(r => r.persona_id === p.id);
    const clickedCount = pResponses.filter(r => r.click).length;
    const totalCount = pResponses.length;

    // 가장 좋아한 시안
    const clicked = pResponses.find(r => r.click);
    const skipped = pResponses.find(r => !r.click);
    const tag = clickedCount > totalCount / 2 ? 'clicked' : (clickedCount === 0 ? 'skipped' : '');

    return `
      <details class="persona-response ${tag}">
        <summary class="cursor-pointer text-sm font-bold flex items-center gap-2 w-full">
          <div class="persona-avatar">${esc(p.name.charAt(0))}</div>
          <div class="flex-1">
            <div>${esc(p.name)} <span class="text-xs text-gray-500 font-normal">· ${esc(p.age)}세 ${esc(p.role)}</span></div>
            <div class="text-[11px] text-gray-500 font-normal">클릭 ${clickedCount}/${totalCount} · ${clicked ? '👍 시안' + (clicked.idea_index + 1) : '모두 스킵'}</div>
          </div>
        </summary>
        <div class="mt-2 space-y-1.5 text-xs pl-10">
          ${pResponses.map(r => `
            <div class="flex gap-1.5">
              <span class="${r.click ? 'text-green-600' : 'text-red-500'} font-bold">${r.click ? '✓' : '✗'}</span>
              <span class="text-gray-500">시안${r.idea_index + 1}:</span>
              <span class="flex-1">${esc(r.reason)}</span>
            </div>
          `).join('')}
        </div>
      </details>
    `;
  }).join('');
}

function renderWordCloud(topWords) {
  const box = $('wordCloud');
  if (topWords.length === 0) {
    box.innerHTML = '<p class="text-xs text-gray-400">키워드 분석 데이터 부족</p>';
    return;
  }
  const maxCount = topWords[0][1];
  box.innerHTML = topWords.map(([word, count]) => {
    const ratio = count / maxCount;
    let size = 'size-xs';
    if (ratio > 0.85) size = 'size-xl';
    else if (ratio > 0.6) size = 'size-lg';
    else if (ratio > 0.4) size = 'size-md';
    else if (ratio > 0.2) size = 'size-sm';
    return `<span class="word-cloud-item ${size}" title="${esc(count)}회">${esc(word)}</span>`;
  }).join('');
}

// ============================================================
// 5단계: 보정 시연 (D3 hook)
// ============================================================

function fillRealData() {
  const ideas = state.evalResults.ideas;
  const clickRates = state.evalResults.clickRates;

  // 가짜 실제 데이터: 예측과 일부 불일치하게 생성 (현실감)
  // 예측 1위가 실제로는 3위인 경우 → 보정 시그널
  const realData = clickRates.map((c, i) => {
    // 의도적 불일치: 예측 최고 시안에는 약간 낮은 실제 CTR / 예측 낮은 시안 일부는 의외로 높음
    const sorted = [...clickRates].sort((a, b) => b.rate - a.rate);
    const rank = sorted.findIndex(x => x.ideaIndex === c.ideaIndex);

    let realCTR;
    if (rank === 0) {
      // 예측 1위 → 실제 약간 낮음 (-15 ~ +5)
      realCTR = Math.max(5, Math.min(80, c.rate - 15 + Math.random() * 20));
    } else if (rank === sorted.length - 1) {
      // 예측 꼴찌 → 실제 의외로 +10 ~ +30 (D3 보정 트리거)
      realCTR = Math.max(5, Math.min(80, c.rate + 10 + Math.random() * 20));
    } else {
      // 중간 → 노이즈
      realCTR = Math.max(5, Math.min(80, c.rate - 5 + Math.random() * 15));
    }

    return {
      ideaIndex: c.ideaIndex,
      idea: c.idea,
      predicted: c.rate,
      actual: Math.round(realCTR)
    };
  });

  state.realData = realData;

  // 표시
  $('fillRealDataBtn').disabled = true;
  $('fillRealDataBtn').textContent = '✓ 실제 데이터 적용됨';

  $('realDataDisplay').classList.remove('hidden');
  $('realDataList').innerHTML = realData.map((d, i) => `
    <div class="flex justify-between items-center bg-white rounded p-2">
      <span class="font-semibold">시안${i + 1}: ${esc(d.idea.slice(0, 25))}${d.idea.length > 25 ? '...' : ''}</span>
      <span class="text-right">
        <span class="text-gray-500">예측 ${esc(d.predicted)}%</span>
        <span class="mx-1">→</span>
        <span class="${d.actual > d.predicted ? 'text-green-600' : 'text-red-600'} font-black">실제 ${esc(d.actual)}%</span>
      </span>
    </div>
  `).join('');

  // 차트
  setTimeout(() => {
    $('calibrationChartBox').classList.remove('hidden');
    drawCalibrationChart(realData);
  }, 300);

  // 페르소나 자가 토론 (Claude API 호출)
  setTimeout(() => {
    runCalibrationDebate(realData);
  }, 800);
}

function drawCalibrationChart(realData) {
  const ctx = $('calibrationChart').getContext('2d');
  if (window.__calibChart) window.__calibChart.destroy();

  window.__calibChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: realData.map((d, i) => `시안${i + 1}`),
      datasets: [
        {
          label: '예측 (AI 청중)',
          data: realData.map(d => d.predicted),
          backgroundColor: '#16285A',
          borderRadius: 4
        },
        {
          label: '실제 데이터',
          data: realData.map(d => d.actual),
          backgroundColor: '#D9A028',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
      scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } } }
    }
  });
}

async function runCalibrationDebate(realData) {
  $('personaDebate').classList.remove('hidden');
  $('debateMessages').innerHTML = '<p class="text-xs text-gray-500 italic">페르소나들이 자가 토론 중...</p>';

  try {
    const gap = realData.map(d => ({
      idea: d.idea,
      predicted: d.predicted,
      actual: d.actual,
      gap: d.actual - d.predicted
    }));

    const system = `너는 한국 페르소나 10명의 자가 학습 시뮬레이터다.
예측이 빗나간 시안을 보고, 페르소나들이 자기들끼리 카톡방에서 "우리가 뭘 잘못 봤지?" 토론하는 메시지 5-7개를 한국어로 생성하라.

# 페르소나
${state.personas.slice(0, 5).map(p => `${p.name}(${p.age}세): ${p.role}`).join(', ')} 등

# 출력 형식 (JSON)
{
  "messages": [
    {"name": "수현", "text": "...", "insight": "20대보다 30대 워킹맘이 이 키워드 클릭 더 많음"},
    ...
  ],
  "weight_shifts": [
    {"factor": "후킹 강도", "before": 0.7, "after": 0.5, "note": "예측보다 영향력 낮음"},
    {"factor": "구체 숫자", "before": 0.5, "after": 0.8, "note": "예측보다 영향력 높음"},
    {"factor": "감성 워딩", "before": 0.6, "after": 0.55, "note": "거의 같음"}
  ]
}

# 규칙
- 토론 메시지 = 페르소나 어투. 30-80자.
- weight_shifts 3개 = 페르소나가 새로 배운 가중치. before/after 0~1, note 한 줄.
- insight = 발견한 청중 패턴 한 줄.`;

    const user = `예측 vs 실제 데이터:\n${gap.map(g => `"${g.idea}" 예측 ${g.predicted}% → 실제 ${g.actual}% (차이 ${g.gap > 0 ? '+' : ''}${g.gap})`).join('\n')}\n\n페르소나 자가 토론 + 가중치 보정 JSON 생성하세요.`;

    const text = await callClaude(system, user, 2500);
    const parsed = extractJson(text);

    state.calibrationDebate = parsed;

    renderDebate(parsed.messages || []);
    renderWeightShift(parsed.weight_shifts || []);

    $('toEvolutionBtn').classList.remove('hidden');
  } catch (e) {
    $('debateMessages').innerHTML = `<p class="text-xs text-red-500">자가 토론 생성 실패: ${esc(e.message)}</p>`;
  }
}

function renderDebate(messages) {
  const box = $('debateMessages');
  box.innerHTML = '';
  messages.forEach((m, i) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'debate-msg';
      const persona = state.personas.find(p => p.name === m.name) || { name: m.name };
      div.innerHTML = `
        <div class="persona-avatar">${esc(persona.name.charAt(0))}</div>
        <div class="flex-1">
          <p class="text-xs font-bold text-navy-900">${esc(m.name)}</p>
          <p class="text-sm mt-0.5">${esc(m.text)}</p>
          ${m.insight ? `<p class="text-[11px] text-gold-600 mt-1 italic">💡 ${esc(m.insight)}</p>` : ''}
        </div>
      `;
      box.appendChild(div);
    }, i * 500);
  });
}

function renderWeightShift(shifts) {
  setTimeout(() => {
    $('weightShiftBox').classList.remove('hidden');
    const list = $('weightShiftList');
    list.innerHTML = shifts.map(s => {
      const beforePct = Math.round(s.before * 100);
      const afterPct = Math.round(s.after * 100);
      const diff = afterPct - beforePct;
      const color = diff > 0 ? 'bg-gold-400' : (diff < 0 ? 'bg-red-400' : 'bg-gray-400');
      return `
        <div>
          <div class="flex justify-between mb-1">
            <span>${esc(s.factor)}</span>
            <span class="${diff > 0 ? 'text-gold-400' : (diff < 0 ? 'text-red-300' : 'text-gray-400')} font-bold">${diff > 0 ? '+' : ''}${diff}%</span>
          </div>
          <div class="flex gap-1 items-center">
            <div class="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
              <div class="bg-gray-400 h-full" style="width: ${beforePct}%; transition: width 1s"></div>
            </div>
            <span class="text-[10px] text-gray-300 w-8">→</span>
            <div class="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
              <div class="${color} h-full" style="width: 0%; animation: weightGrow 1.5s ease-out forwards" data-target="${afterPct}"></div>
            </div>
          </div>
          <p class="text-[10px] text-gray-300 mt-0.5">${esc(s.note)}</p>
        </div>
      `;
    }).join('');

    // animation
    setTimeout(() => {
      list.querySelectorAll('[data-target]').forEach(el => {
        el.style.width = el.dataset.target + '%';
      });
    }, 100);
  }, 1500);
}

// ============================================================
// 6단계: 6개월 진화 시뮬
// ============================================================

function renderEvolution() {
  showScreen('evolution');

  const ctx = $('evolutionChart').getContext('2d');
  if (window.__evolChart) window.__evolChart.destroy();

  // 가속 데이터: 26주 동안 정확도 상승
  const labels = [];
  const accuracyData = [];
  const personasData = [];
  for (let week = 1; week <= 26; week++) {
    labels.push(`${week}주`);
    // 정확도: 50% → 92% 점진 상승
    accuracyData.push(Math.round(50 + (week / 26) * 42 + (Math.random() - 0.5) * 4));
    // 청중 수: 10 → 100
    personasData.push(Math.min(100, Math.round(10 + (week / 26) * 90)));
  }

  window.__evolChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '예측 정확도 (%)',
          data: [],
          borderColor: '#D9A028',
          backgroundColor: 'rgba(217, 160, 40, 0.15)',
          tension: 0.3,
          fill: true,
          borderWidth: 3,
          pointRadius: 0,
          yAxisID: 'y'
        },
        {
          label: '활성 페르소나 수',
          data: [],
          borderColor: '#16285A',
          backgroundColor: 'rgba(22, 40, 90, 0.1)',
          tension: 0.3,
          fill: false,
          borderWidth: 2,
          pointRadius: 0,
          yAxisID: 'y1',
          borderDash: [5, 5]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
      scales: {
        y: { position: 'left', beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } },
        y1: { position: 'right', beginAtZero: true, max: 110, grid: { drawOnChartArea: false }, ticks: { callback: v => v + '명' } }
      },
      animation: { duration: 0 }
    }
  });

  // 가속 애니메이션 (6초)
  let w = 0;
  const acc = [];
  const per = [];
  const stepMs = 6000 / 26;
  const animInterval = setInterval(() => {
    if (w >= 26) {
      clearInterval(animInterval);
      return;
    }
    acc.push(accuracyData[w]);
    per.push(personasData[w]);
    window.__evolChart.data.datasets[0].data = [...acc];
    window.__evolChart.data.datasets[1].data = [...per];
    window.__evolChart.update('none');
    w++;
  }, stepMs);
}

// ============================================================
// 베타 신청
// ============================================================

function submitBeta(e) {
  e.preventDefault();
  const email = $('betaEmail').value.trim();
  const channel = $('betaChannel').value.trim();
  const intro = $('betaIntro').value.trim();

  if (!email) {
    showToast('이메일은 필수예요');
    return;
  }

  // 메일 본문 (mailto / 카톡 공유 / 복사용 공통)
  const messageBody =
    `안녕하세요, Persona Lab 베타 신청합니다.\n\n` +
    `이메일: ${email}\n` +
    `채널: ${channel || '(미입력)'}\n\n` +
    `자기소개:\n${intro || '(미입력)'}\n\n` +
    `--\nPersona Lab 베타 모집 페이지에서 신청`;

  // 백업 데이터 영역에 신청 정보 표시 (다크 패턴 차단)
  $('betaBackupBlock').classList.remove('hidden');
  $('betaBackupBody').textContent = messageBody;

  // localStorage에 신청 저장 (중복 방지 / 분석용)
  try {
    const apps = JSON.parse(localStorage.getItem('persona_lab_beta_apps') || '[]');
    apps.push({ email, channel, intro, at: new Date().toISOString() });
    localStorage.setItem('persona_lab_beta_apps', JSON.stringify(apps));
  } catch (_) {}

  // mailto 시도 (실패해도 백업으로 사용자가 직접 보낼 수 있음)
  const subject = encodeURIComponent('[Persona Lab 베타 신청]');
  const body = encodeURIComponent(messageBody);
  // 행글라이터 비즈 이메일 (CLAUDE.md 글로벌 이메일)
  try {
    window.location.href = `mailto:mintmaum07@gmail.com?subject=${subject}&body=${body}`;
  } catch (_) {}

  $('betaForm').classList.add('hidden');
  $('betaSuccess').classList.remove('hidden');
}

// 베타 신청 내용 복사
function copyBetaText() {
  const text = $('betaBackupBody').textContent;
  if (!text) return;
  navigator.clipboard.writeText(text).then(
    () => showToast('내용이 복사됐어요. mintmaum07@gmail.com 에 붙여넣기 해주세요'),
    () => showToast('복사 실패. 텍스트를 직접 선택해서 복사해주세요')
  );
}

// 이메일 주소만 복사
function copyEmailAddress() {
  navigator.clipboard.writeText('mintmaum07@gmail.com').then(
    () => showToast('mintmaum07@gmail.com 복사됨'),
    () => showToast('복사 실패')
  );
}

// ============================================================
// 공유
// ============================================================

function copyShareUrl() {
  const url = window.location.origin + window.location.pathname;
  navigator.clipboard.writeText(url).then(() => {
    showToast('URL 복사됨! 친구한테 보내주세요 🎁');
  }).catch(() => {
    showToast(url);
  });
}

// ============================================================
// 리셋 / 라우팅
// ============================================================

function resetAll() {
  state.channelDesc = '';
  state.channelScripts = '';
  state.toneSummary = '';
  state.personas = [];
  state.ideas = [];
  state.evalResults = null;
  state.realData = null;
  state.calibrationDebate = null;
  $('channelDesc').value = localStorage.getItem(STORAGE_TONE) || '';
  $('channelScripts').value = '';
  setResetVisible(false);
  showScreen('landing');
}

// ============================================================
// 초기화
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // 가중치 애니메이션 CSS 동적 추가
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    [data-target] { transition: width 1.5s ease-out; }
  `;
  document.head.appendChild(styleEl);

  loadApiKey();
  renderIdeaInputs();
  showScreen('landing');

  // 이전 톤 prefill
  const lastTone = localStorage.getItem(STORAGE_TONE);
  if (lastTone) $('channelDesc').value = lastTone;

  // API 키 패널
  $('settingsBtn').addEventListener('click', () => {
    $('apiKeyPanel').classList.toggle('hidden');
  });
  $('closeKeyBtn').addEventListener('click', () => $('apiKeyPanel').classList.add('hidden'));
  $('saveKeyBtn').addEventListener('click', saveApiKey);
  $('clearKeyBtn').addEventListener('click', clearApiKey);
  $('apiKeyInput').addEventListener('keypress', e => { if (e.key === 'Enter') saveApiKey(); });

  // 리셋
  $('resetBtn').addEventListener('click', resetAll);

  // 랜딩 → 톤
  $('startBtn').addEventListener('click', () => {
    if (!state.apiKey) {
      $('apiKeyPanel').classList.remove('hidden');
      showToast('먼저 API 키를 입력해주세요 (1분이면 끝)');
    } else {
      showScreen('tone');
    }
  });

  // 톤 분석
  $('analyzeToneBtn').addEventListener('click', analyzeTone);
  $$('.tone-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      $('channelDesc').value = btn.dataset.text;
    });
  });

  // 페르소나 → 시안
  $('toIdeasBtn').addEventListener('click', () => showScreen('ideas'));

  // 시안 → 평가
  $('loadExampleBtn').addEventListener('click', loadExampleIdeas);
  $('runEvalBtn').addEventListener('click', runEvaluation);

  // 결과 → 보정
  $('toCalibrationBtn').addEventListener('click', () => showScreen('calibration'));

  // 보정
  $('fillRealDataBtn').addEventListener('click', fillRealData);

  // 보정 → 진화
  $('toEvolutionBtn').addEventListener('click', renderEvolution);

  // 진화 → 베타
  $('toBetaBtn').addEventListener('click', () => showScreen('beta'));

  // 베타 제출
  $('betaForm').addEventListener('submit', submitBeta);
  const cb = $('copyBetaBtn'); if (cb) cb.addEventListener('click', copyBetaText);
  const ce = $('copyEmailBtn'); if (ce) ce.addEventListener('click', copyEmailAddress);

  // 공유
  $('shareBtn').addEventListener('click', copyShareUrl);
  $('kakaoShareBtn').addEventListener('click', (e) => {
    e.preventDefault();
    copyShareUrl();
    showToast('URL 복사됨! 카톡에 붙여넣기');
  });
});
