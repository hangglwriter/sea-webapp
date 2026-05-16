import { pickFromPool } from './fortunePool.js'

const CLAUDE_MODEL = 'claude-sonnet-4-6'
const API_URL = 'https://api.anthropic.com/v1/messages'

function buildPrompt(name, saju, dateStr, seed) {
  const sajuLines = [
    `사용자 이름: ${name}`,
    `날짜: ${dateStr}`,
    `띠: ${saju.zodiac.ko} (${saju.zodiac.en})`,
    `별자리: ${saju.starSign.ko} (${saju.starSign.en})`,
  ]
  if (saju.dayPillar) sajuLines.push(`일주: ${saju.dayPillar}`)
  if (saju.monthPillar) sajuLines.push(`월주: ${saju.monthPillar}`)
  if (saju.yearPillar) sajuLines.push(`년주: ${saju.yearPillar}`)
  sajuLines.push(`시드 (일관성용): ${seed}`)

  return `너는 한국 사주 기반 운세 카피라이터다. 아래 사주 컨텍스트와 시드를 보고, 오늘 하루를 위한 운세를 1장짜리 카드용으로 만들어줘.

${sajuLines.join('\n')}

조건:
- 시드 값이 같으면 같은 결과가 나와야 한다 (재현성).
- 운세 한 줄은 따뜻하고 구체적인 한국어 35-55자.
- 행운 컬러 3색은 HEX 코드, 파스텔/은은한 톤 선호.
- 행운 숫자는 1-9 중 하나.
- 행운 키워드는 명사 1-2단어 한국어.

반드시 아래 JSON만 출력해라. 다른 텍스트 금지.

{
  "fortuneOneLiner": "...",
  "luckyColors": ["#XXXXXX", "#XXXXXX", "#XXXXXX"],
  "luckyNumber": 0,
  "luckyKeyword": "..."
}`
}

async function callClaudeAPI(prompt, apiKey) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 400,
      messages: [
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`API ${res.status}: ${errText}`)
  }

  const data = await res.json()
  const text = data?.content?.[0]?.text || ''
  return text
}

function parseJSON(text) {
  const cleaned = text.replace(/```json\s*|\s*```/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('no JSON in response')
  const json = JSON.parse(cleaned.slice(start, end + 1))
  if (!json.fortuneOneLiner || !Array.isArray(json.luckyColors) || json.luckyColors.length !== 3) {
    throw new Error('invalid JSON shape')
  }
  return {
    fortuneOneLiner: String(json.fortuneOneLiner).trim(),
    luckyColors: json.luckyColors.map(c => String(c).trim()),
    luckyNumber: Number(json.luckyNumber) || 1,
    luckyKeyword: String(json.luckyKeyword || '').trim(),
    source: 'claude',
  }
}

export async function generateFortune(name, saju, dateStr, seed) {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY

  if (!apiKey) {
    console.info('[api] no API key, using fortune pool (Plan B)')
    return pickFromPool(seed)
  }

  try {
    const prompt = buildPrompt(name, saju, dateStr, seed)
    const text = await callClaudeAPI(prompt, apiKey)
    return parseJSON(text)
  } catch (err) {
    console.warn('[api] Claude API failed, falling back to pool', err)
    return pickFromPool(seed)
  }
}
