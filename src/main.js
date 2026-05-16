/**
 * 카톡방 정치 시뮬레이터 - 메인 로직
 */

(function () {
  'use strict';

  // ========== 상태 ==========
  const STORAGE_KEY_API = 'sea_anthropic_key';
  const STORAGE_KEY_COUNT = 'sea_sim_count';
  const STORAGE_KEY_TODAY = 'sea_sim_today';
  const STORAGE_KEY_MSG = 'sea_last_msg';
  const STORAGE_KEY_MSG_TIME = 'sea_last_msg_time';
  const MSG_TTL_MS = 24 * 60 * 60 * 1000; // 24h

  // 자해/혐오 키워드 차단 (간단한 1차 필터)
  const BLOCK_KEYWORDS = [
    '자살', '죽고싶', '죽고 싶', '자해', '목매', '뛰어내',
    '죽여', '죽일', '쳐죽', '강간', '성폭행',
    '혐오', '꺼져 죽', '뒤져'
  ];

  let selectedPersonas = window.PERSONAS.filter(p => p.selected).map(p => p.id);
  let lastResult = null;
  let lastMessage = '';
  let lastPersonas = [];

  // ========== DOM 헬퍼 ==========
  const $ = (id) => document.getElementById(id);

  // ========== 카운트 ==========
  function loadCounts() {
    const total = parseInt(localStorage.getItem(STORAGE_KEY_COUNT) || '0', 10);
    const todayData = JSON.parse(localStorage.getItem(STORAGE_KEY_TODAY) || '{}');
    const today = new Date().toISOString().slice(0, 10);
    const todayCount = todayData.date === today ? todayData.count : 0;
    $('totalCount').textContent = total;
    $('todayCount').textContent = todayCount;
  }

  function incrementCount() {
    const total = parseInt(localStorage.getItem(STORAGE_KEY_COUNT) || '0', 10) + 1;
    localStorage.setItem(STORAGE_KEY_COUNT, String(total));

    const today = new Date().toISOString().slice(0, 10);
    const todayData = JSON.parse(localStorage.getItem(STORAGE_KEY_TODAY) || '{}');
    const todayCount = (todayData.date === today ? todayData.count : 0) + 1;
    localStorage.setItem(STORAGE_KEY_TODAY, JSON.stringify({ date: today, count: todayCount }));
    loadCounts();
  }

  // ========== 메시지 영구저장 X (24h TTL) ==========
  function clearExpiredMsg() {
    const savedTime = parseInt(localStorage.getItem(STORAGE_KEY_MSG_TIME) || '0', 10);
    if (savedTime && Date.now() - savedTime > MSG_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY_MSG);
      localStorage.removeItem(STORAGE_KEY_MSG_TIME);
    }
  }

  // ========== 페르소나 렌더 ==========
  function renderPersonas() {
    const grid = $('personaGrid');
    grid.innerHTML = window.PERSONAS.map(p => `
      <label class="persona-chip ${selectedPersonas.includes(p.id) ? 'selected' : ''}" data-id="${p.id}">
        <span class="emoji">${p.emoji}</span>
        <span class="name">${p.name}</span>
      </label>
    `).join('');
    grid.querySelectorAll('.persona-chip').forEach(chip => {
      chip.addEventListener('click', () => togglePersona(chip.dataset.id));
    });
    updateSelectedCount();
  }

  function togglePersona(id) {
    if (selectedPersonas.includes(id)) {
      if (selectedPersonas.length <= 2) {
        showError('최소 2명은 선택해야 해요.');
        return;
      }
      selectedPersonas = selectedPersonas.filter(x => x !== id);
    } else {
      if (selectedPersonas.length >= 4) {
        showError('최대 4명까지만 선택할 수 있어요.');
        return;
      }
      selectedPersonas.push(id);
    }
    renderPersonas();
    hideError();
  }

  function updateSelectedCount() {
    $('selectedCount').textContent = `${selectedPersonas.length} / 4`;
  }

  // ========== API 키 ==========
  function loadApiKey() {
    return localStorage.getItem(STORAGE_KEY_API) || '';
  }
  function saveApiKey(key) {
    localStorage.setItem(STORAGE_KEY_API, key);
  }
  function clearApiKey() {
    localStorage.removeItem(STORAGE_KEY_API);
  }

  // ========== 에러/로딩 ==========
  function showError(msg) {
    const box = $('errorBox');
    box.textContent = '⚠ ' + msg;
    box.classList.remove('hidden');
    setTimeout(() => box.classList.add('hidden'), 5000);
  }
  function hideError() {
    $('errorBox').classList.add('hidden');
  }
  function showLoading(show) {
    $('loadingBox').classList.toggle('hidden', !show);
    if (show) {
      const personas = window.PERSONAS.filter(p => selectedPersonas.includes(p.id));
      let i = 0;
      const cycle = () => {
        if ($('loadingBox').classList.contains('hidden')) return;
        $('loadingPersona').textContent = `${personas[i % personas.length].name}가 메시지 읽음...`;
        i++;
        setTimeout(cycle, 700);
      };
      cycle();
    }
  }

  // ========== 키워드 차단 ==========
  function checkBlocked(text) {
    const lower = text.toLowerCase();
    for (const kw of BLOCK_KEYWORDS) {
      if (lower.includes(kw)) return kw;
    }
    return null;
  }

  // ========== 시간 표시 ==========
  function nowTimeStr() {
    const d = new Date();
    const h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    const ampm = h < 12 ? '오전' : '오후';
    const h12 = h % 12 || 12;
    return `${ampm} ${h12}:${m}`;
  }

  // ========== 결과 렌더 ==========
  function renderResults(message, result, personas) {
    const grid = $('resultGrid');
    const sentTime = nowTimeStr();
    const recvTime = nowTimeStr();

    grid.innerHTML = personas.map(p => {
      const reply = result[p.id] || '(답장 없음)';
      return `
        <div class="chat-window">
          <div class="chat-header">
            <span class="back-icon">&lt;</span>
            <span class="chat-title">${p.name}</span>
            <span class="chat-icons">☰</span>
          </div>
          <div class="chat-body">
            <div class="msg-sent">
              <div class="meta">
                <span class="unread">1</span>
                <span class="time">${sentTime}</span>
              </div>
              <div class="bubble">${escapeHtml(message)}</div>
            </div>
            <div class="msg-recv">
              <div class="avatar">${p.emoji}</div>
              <div class="col">
                <div class="sender-name">${p.name}</div>
                <div class="row">
                  <div class="bubble">${escapeHtml(reply)}</div>
                  <span class="time">${recvTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    $('resultSection').classList.remove('hidden');
    $('resultSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\n/g, '<br>');
  }

  // ========== 시뮬 실행 ==========
  async function runSim() {
    hideError();
    const message = $('messageInput').value.trim();
    if (!message) {
      showError('메시지를 입력해주세요.');
      return;
    }
    const blocked = checkBlocked(message);
    if (blocked) {
      showError(`자해/혐오 관련 키워드("${blocked}")는 시뮬할 수 없어요. 안전한 답장이 필요하면 1393(자살예방상담)로 연락하세요.`);
      return;
    }
    const apiKey = loadApiKey();
    if (!apiKey) {
      showError('Anthropic API 키를 먼저 입력해주세요. (⚙ API 버튼)');
      $('apiKeyPanel').classList.remove('hidden');
      return;
    }

    const personas = window.PERSONAS.filter(p => selectedPersonas.includes(p.id));
    if (personas.length < 2) {
      showError('최소 2명을 선택해주세요.');
      return;
    }

    // 24h 저장
    localStorage.setItem(STORAGE_KEY_MSG, message);
    localStorage.setItem(STORAGE_KEY_MSG_TIME, String(Date.now()));

    $('runBtn').disabled = true;
    $('runBtn').textContent = '시뮬 중...';
    $('resultSection').classList.add('hidden');
    showLoading(true);

    try {
      const result = await window.callClaude(apiKey, message, personas);
      lastResult = result;
      lastMessage = message;
      lastPersonas = personas;
      renderResults(message, result, personas);
      incrementCount();
    } catch (e) {
      showError(e.message || '알 수 없는 오류');
    } finally {
      showLoading(false);
      $('runBtn').disabled = false;
      $('runBtn').textContent = '🚀 시뮬 시작';
    }
  }

  // ========== 다운로드 (PNG) ==========
  async function downloadImage(storyMode = false) {
    if (!lastResult) return;

    let target;
    if (storyMode) {
      target = buildStoryCapture();
      document.getElementById('storyCapture').appendChild(target);
    } else {
      target = $('captureRoot');
    }

    try {
      const canvas = await html2canvas(target, {
        backgroundColor: '#B2C7D9',
        scale: 2,
        useCORS: true,
        logging: false
      });
      const link = document.createElement('a');
      const now = new Date().toISOString().slice(0, 16).replace(/[T:]/g, '-');
      link.download = `카톡시뮬-${now}${storyMode ? '-스토리' : ''}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      showError('이미지 생성 실패: ' + e.message);
    } finally {
      if (storyMode && target.parentNode) {
        target.parentNode.removeChild(target);
      }
    }
  }

  function buildStoryCapture() {
    const wrap = document.createElement('div');
    wrap.className = 'story-mode';
    wrap.innerHTML = `
      <div class="story-title">💬 카톡 보내기 전</div>
      <div class="story-sub">${lastPersonas.length}명이 어떻게 답할지 시뮬했어요</div>
      <div class="story-body">
        ${lastPersonas.map(p => {
          const reply = lastResult[p.id] || '';
          return `
            <div class="chat-window">
              <div class="chat-header">
                <span class="back-icon">&lt;</span>
                <span class="chat-title">${p.name}</span>
                <span class="chat-icons">☰</span>
              </div>
              <div class="chat-body">
                <div class="msg-sent">
                  <div class="meta">
                    <span class="unread">1</span>
                    <span class="time">${nowTimeStr()}</span>
                  </div>
                  <div class="bubble">${escapeHtml(truncate(lastMessage, 60))}</div>
                </div>
                <div class="msg-recv">
                  <div class="avatar">${p.emoji}</div>
                  <div class="col">
                    <div class="sender-name">${p.name}</div>
                    <div class="row">
                      <div class="bubble">${escapeHtml(truncate(reply, 80))}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="story-footer">🔥 sea-webapp.pages.dev · 너도 해봐!</div>
    `;
    return wrap;
  }

  function truncate(s, n) {
    if (!s) return '';
    return s.length > n ? s.slice(0, n - 1) + '…' : s;
  }

  // ========== 텍스트 복사 ==========
  async function copyText() {
    if (!lastResult) return;
    const lines = [`📱 카톡 시뮬 결과`, ``, `[보낸 톡]`, lastMessage, ``];
    for (const p of lastPersonas) {
      lines.push(`[${p.emoji} ${p.name}]`);
      lines.push(lastResult[p.id] || '');
      lines.push('');
    }
    lines.push(`---`);
    lines.push(`🔥 카톡방 정치 시뮬레이터 · sea-webapp.pages.dev`);
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      const btn = $('copyBtn');
      const orig = btn.textContent;
      btn.textContent = '✅ 복사됨!';
      setTimeout(() => { btn.textContent = orig; }, 1500);
    } catch (e) {
      showError('복사 실패. 직접 선택해서 복사해주세요.');
    }
  }

  // ========== 이벤트 바인딩 ==========
  function init() {
    clearExpiredMsg();
    loadCounts();
    renderPersonas();

    // API 키 패널
    $('settingsBtn').addEventListener('click', () => {
      $('apiKeyPanel').classList.toggle('hidden');
      $('apiKeyInput').value = loadApiKey();
    });
    $('saveKeyBtn').addEventListener('click', () => {
      const key = $('apiKeyInput').value.trim();
      if (!key.startsWith('sk-ant')) {
        showError('Anthropic API 키는 sk-ant 로 시작합니다.');
        return;
      }
      saveApiKey(key);
      $('apiKeyPanel').classList.add('hidden');
      hideError();
    });
    $('clearKeyBtn').addEventListener('click', () => {
      clearApiKey();
      $('apiKeyInput').value = '';
    });

    // 메시지 입력
    $('messageInput').addEventListener('input', (e) => {
      const len = e.target.value.length;
      $('charCount').textContent = `${len} / 300`;
    });

    // 예시 버튼
    document.querySelectorAll('.example-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $('messageInput').value = btn.dataset.text;
        $('charCount').textContent = `${btn.dataset.text.length} / 300`;
      });
    });

    // 실행
    $('runBtn').addEventListener('click', runSim);

    // 다운로드/복사
    $('downloadBtn').addEventListener('click', () => downloadImage(false));
    $('storyBtn').addEventListener('click', () => downloadImage(true));
    $('copyBtn').addEventListener('click', copyText);

    // 재시뮬
    $('retryBtn').addEventListener('click', () => {
      $('resultSection').classList.add('hidden');
      $('messageInput').focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 첫 진입 시 API 키 없으면 패널 펼치기
    if (!loadApiKey()) {
      $('apiKeyPanel').classList.remove('hidden');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
