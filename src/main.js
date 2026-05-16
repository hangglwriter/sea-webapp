import './style.css'
import html2canvas from 'html2canvas'
import { computeSaju, buildSeed, BIRTH_TIMES } from './fortune.js'
import { generateFortune } from './api.js'
import { renderCard, escapeHtml } from './card.js'
import {
  saveUser, loadUser, getCached, setCached, loadHistory, clearOldCache,
} from './storage.js'

const app = document.getElementById('app')

const state = {
  view: 'input',
  user: null,
  saju: null,
  fortune: null,
  ratio: '9:16',
  loading: false,
  error: null,
  dateStr: todayStr(),
  sharedFrom: null,
}

function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parseShareParams() {
  const params = new URLSearchParams(location.search)
  const name = params.get('name')
  const dob = params.get('dob')
  const time = params.get('time')
  if (name && dob) {
    return { name, birthDate: dob, birthTime: time || '자시' }
  }
  return null
}

function render() {
  if (state.view === 'input') {
    renderInput()
  } else if (state.view === 'result') {
    renderResult()
  }
}

function renderInput() {
  const saved = loadUser()
  const shared = state.sharedFrom
  const prefill = shared || saved || { name: '', birthDate: '', birthTime: '자시' }

  app.innerHTML = `
    <main class="page page-input">
      <div class="hero">
        <div class="hero-emoji">🌙</div>
        <h1 class="hero-title">오늘의 K-운세 카드</h1>
        <p class="hero-sub">Today's K-Fortune</p>
        <p class="hero-tag">“30초 만에 받는 한국식 사주 카드 한 장”</p>
      </div>

      ${shared ? `
        <div class="shared-banner">
          <span class="shared-emoji">💌</span>
          <span>${escapeHtml(shared.name)}님이 보낸 운세 링크예요. 본인 정보로 비교해 볼까요?</span>
        </div>
      ` : ''}

      <form class="input-form" id="inputForm">
        <label class="field">
          <span class="field-label">이름</span>
          <input type="text" name="name" id="nameInput" placeholder="홍길동" maxlength="20" value="${escapeHtml(prefill.name)}" required />
        </label>

        <label class="field">
          <span class="field-label">생년월일</span>
          <input type="date" name="birthDate" id="dobInput" value="${escapeHtml(prefill.birthDate)}" max="${todayStr()}" required />
        </label>

        <label class="field">
          <span class="field-label">생시 (선택)</span>
          <select name="birthTime" id="timeInput">
            ${BIRTH_TIMES.map(t => `
              <option value="${t.key}" ${t.key === prefill.birthTime ? 'selected' : ''}>${t.label}</option>
            `).join('')}
          </select>
          <span class="field-hint">모르면 ‘자시’로 두세요</span>
        </label>

        <button type="submit" class="btn-primary" id="submitBtn">
          <span class="btn-text">오늘의 운세 받기</span>
          <span class="btn-emoji">✨</span>
        </button>

        ${state.error ? `<div class="error-box">${escapeHtml(state.error)}</div>` : ''}

        ${saved && !shared ? `
          <button type="button" class="btn-secondary" id="historyBtn">
            <span>최근 7일 기록 보기</span>
          </button>
        ` : ''}
      </form>

      <p class="disclaimer-note">
        ✨ 본 서비스는 재미용입니다. 띠/별자리 기반 간소 계산이며, 정통 만세력 사주가 아닙니다.
      </p>
      <p class="privacy-note">
        이름과 생일은 이 기기의 브라우저에만 저장됩니다. 서버 전송 없음.
      </p>
    </main>
  `

  document.getElementById('inputForm').addEventListener('submit', handleSubmit)
  const historyBtn = document.getElementById('historyBtn')
  if (historyBtn) historyBtn.addEventListener('click', () => renderHistoryModal())
}

async function handleSubmit(e) {
  e.preventDefault()
  if (state.loading) return

  const name = document.getElementById('nameInput').value.trim()
  const birthDate = document.getElementById('dobInput').value
  const birthTime = document.getElementById('timeInput').value

  if (!name) {
    state.error = '이름을 입력해 주세요.'
    render()
    return
  }
  if (!birthDate) {
    state.error = '생년월일을 선택해 주세요.'
    render()
    return
  }

  state.error = null
  state.loading = true
  state.user = { name, birthDate, birthTime }
  saveUser(state.user)

  const submitBtn = document.getElementById('submitBtn')
  submitBtn.disabled = true
  submitBtn.innerHTML = `<span class="btn-text">운세 계산 중...</span><span class="spinner"></span>`

  try {
    state.saju = computeSaju(birthDate, birthTime)
    const seed = buildSeed(state.saju, state.dateStr)

    const cacheKey = `${name}-${birthDate}-${birthTime}`
    const cached = getCached(state.dateStr)
    if (cached && cached.cacheKey === cacheKey) {
      state.fortune = cached.fortune
    } else {
      const fortune = await generateFortune(name, state.saju, state.dateStr, seed)
      state.fortune = fortune
      setCached(state.dateStr, { cacheKey, fortune, saju: state.saju })
      clearOldCache(state.dateStr)
    }

    state.loading = false
    state.view = 'result'
    render()
  } catch (err) {
    console.error(err)
    state.error = '운세 계산에 실패했어요. 다시 시도해 주세요.'
    state.loading = false
    render()
  }
}

function renderResult() {
  const { user, saju, fortune, ratio, dateStr } = state
  app.innerHTML = `
    <main class="page page-result">
      <div class="result-topbar">
        <button class="btn-back" id="backBtn">
          <span>← 다시 입력</span>
        </button>
        <div class="ratio-toggle">
          <button class="ratio-btn ${ratio === '9:16' ? 'active' : ''}" data-ratio="9:16">9:16</button>
          <button class="ratio-btn ${ratio === '1:1' ? 'active' : ''}" data-ratio="1:1">1:1</button>
        </div>
      </div>

      <div class="card-wrapper card-wrapper-${ratio === '9:16' ? 'story' : 'feed'}">
        ${renderCard({ name: user.name, dateStr, fortune, saju, ratio })}
      </div>

      <div class="action-bar">
        <button class="btn-primary btn-download" id="downloadBtn">
          <span class="btn-emoji">⬇️</span>
          <span class="btn-text">카드 PNG 다운로드</span>
        </button>
        <div class="action-row">
          <button class="btn-secondary" id="shareBtn">
            <span>📤 공유</span>
          </button>
          <button class="btn-secondary" id="copyLinkBtn">
            <span>🔗 친구에게 보내기 링크</span>
          </button>
        </div>
        ${state.fortune.source === 'pool' ? `
          <p class="source-note">현재 사전 작성 운세 풀로 동작 중. Claude API 키 설정 시 매일 새 운세 생성.</p>
        ` : ''}
      </div>

      ${renderHistoryGrid()}
    </main>
  `

  document.getElementById('backBtn').addEventListener('click', () => {
    state.view = 'input'
    render()
  })
  document.querySelectorAll('.ratio-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.ratio = btn.dataset.ratio
      render()
    })
  })
  document.getElementById('downloadBtn').addEventListener('click', handleDownload)
  document.getElementById('shareBtn').addEventListener('click', handleShare)
  document.getElementById('copyLinkBtn').addEventListener('click', handleCopyLink)
}

function renderHistoryGrid() {
  const history = loadHistory()
  if (!history.length) return ''
  return `
    <section class="history-section">
      <h2 class="history-title">최근 7일 기록</h2>
      <div class="history-grid">
        ${history.map(h => {
          const colors = h.fortune?.fortune?.luckyColors || h.fortune?.luckyColors || ['#FAF6F0', '#F5D0CC', '#E8C7CE']
          const bg = `linear-gradient(135deg, ${colors[0]}, ${colors[2]})`
          const isToday = h.date === state.dateStr
          return `
            <div class="history-cell ${isToday ? 'today' : ''}" style="background:${bg}">
              <span class="history-date">${h.date.slice(5)}</span>
              ${isToday ? '<span class="history-badge">오늘</span>' : ''}
            </div>
          `
        }).join('')}
      </div>
    </section>
  `
}

function renderHistoryModal() {
  const history = loadHistory()
  if (!history.length) return
  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>최근 7일 운세</h3>
        <button class="modal-close" id="modalClose">✕</button>
      </div>
      <div class="modal-body">
        ${history.map(h => {
          const f = h.fortune?.fortune || h.fortune
          return `
            <div class="modal-row">
              <div class="modal-date">${h.date}</div>
              <div class="modal-fortune">${escapeHtml(f?.fortuneOneLiner || '')}</div>
              <div class="modal-meta">행운 ${escapeHtml(f?.luckyKeyword || '')} · 숫자 ${f?.luckyNumber ?? ''}</div>
            </div>
          `
        }).join('')}
      </div>
    </div>
  `
  document.body.appendChild(modal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.id === 'modalClose') modal.remove()
  })
}

async function handleDownload() {
  const cardEl = document.getElementById('fortuneCard')
  if (!cardEl) return
  const btn = document.getElementById('downloadBtn')
  const orig = btn.innerHTML
  btn.disabled = true
  btn.innerHTML = '<span class="spinner"></span><span class="btn-text"> 이미지 생성 중...</span>'
  try {
    const canvas = await html2canvas(cardEl, {
      scale: 2,
      backgroundColor: null,
      logging: false,
      useCORS: true,
    })
    const link = document.createElement('a')
    const ratioTag = state.ratio === '9:16' ? 'story' : 'feed'
    link.download = `k-fortune-${state.user.name}-${state.dateStr}-${ratioTag}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (err) {
    alert('이미지 다운로드에 실패했어요. 브라우저를 새로고침 후 다시 시도해 주세요.')
    console.error(err)
  } finally {
    btn.disabled = false
    btn.innerHTML = orig
  }
}

async function handleShare() {
  const cardEl = document.getElementById('fortuneCard')
  if (!cardEl) return
  try {
    if (navigator.share && navigator.canShare) {
      const canvas = await html2canvas(cardEl, { scale: 2, backgroundColor: null, logging: false })
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `k-fortune-${state.dateStr}.png`, { type: 'image/png' })
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: '오늘의 K-운세 카드',
            text: state.fortune.fortuneOneLiner,
          })
        } else {
          handleDownload()
        }
      }, 'image/png')
    } else {
      handleDownload()
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(err)
      handleDownload()
    }
  }
}

function handleCopyLink() {
  const { user } = state
  const params = new URLSearchParams({
    name: user.name,
    dob: user.birthDate,
    time: user.birthTime,
  })
  const url = `${location.origin}${location.pathname}?${params.toString()}`
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('copyLinkBtn')
    const orig = btn.innerHTML
    btn.innerHTML = '<span>✓ 링크 복사됨</span>'
    setTimeout(() => { btn.innerHTML = orig }, 2000)
  }).catch(() => {
    prompt('아래 링크를 복사해서 친구에게 보내세요', url)
  })
}

function init() {
  const shared = parseShareParams()
  if (shared) {
    state.sharedFrom = shared
  }
  render()
}

init()
