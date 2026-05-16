function formatKoreanDate(dateStr) {
  const d = new Date(dateStr)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}요일`
}

function formatEnglishDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function renderCard({ name, dateStr, fortune, saju, ratio }) {
  const koDate = formatKoreanDate(dateStr)
  const enDate = formatEnglishDate(dateStr)
  const colors = fortune.luckyColors
  const gradient = `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`
  const isStory = ratio === '9:16'

  return `
    <div class="card card-${isStory ? 'story' : 'feed'}" id="fortuneCard" style="background:${gradient}">
      <div class="card-noise"></div>
      <div class="card-stars">
        <span class="star star-1">✦</span>
        <span class="star star-2">✧</span>
        <span class="star star-3">✦</span>
        <span class="star star-4">✧</span>
      </div>

      <div class="card-header">
        <div class="card-brand">
          <span class="brand-emoji">🌙</span>
          <span class="brand-text">오늘의 K-운세</span>
        </div>
        <div class="card-name">
          <span class="name-label">For</span>
          <span class="name-value">${escapeHtml(name)}</span>
        </div>
        <div class="card-date">
          <div class="date-ko">${koDate}</div>
          <div class="date-en">${enDate}</div>
        </div>
      </div>

      <div class="card-body">
        <div class="zodiac-row">
          <div class="zodiac-chip">
            <span class="zodiac-emoji">${saju.zodiac.emoji}</span>
            <span class="zodiac-text">${saju.zodiac.ko}띠</span>
          </div>
          <div class="zodiac-chip">
            <span class="zodiac-emoji">${saju.starSign.emoji}</span>
            <span class="zodiac-text">${saju.starSign.ko}</span>
          </div>
        </div>

        <div class="fortune-text">
          ${escapeHtml(fortune.fortuneOneLiner)}
        </div>
      </div>

      <div class="card-footer">
        <div class="lucky-section">
          <div class="lucky-label">행운의 컬러</div>
          <div class="color-chips">
            ${colors.map(c => `
              <div class="color-chip" style="background:${c}">
                <span class="hex">${c.toUpperCase()}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="lucky-row">
          <div class="lucky-block">
            <div class="lucky-label">행운 숫자</div>
            <div class="lucky-number">${fortune.luckyNumber}</div>
          </div>
          <div class="lucky-block">
            <div class="lucky-label">행운 키워드</div>
            <div class="lucky-keyword">${escapeHtml(fortune.luckyKeyword)}</div>
          </div>
        </div>

        <div class="card-watermark">
          <span class="wm-text">✨ 오늘의 K-운세 · Today’s K-Fortune</span>
          <span class="wm-url">kfortune.pages.dev</span>
        </div>
      </div>
    </div>
  `
}

export function escapeHtml(str) {
  if (str == null) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
