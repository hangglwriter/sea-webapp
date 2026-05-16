import { Solar } from 'lunar-javascript'

const ZODIAC_KO = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지']
const ZODIAC_EN = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig']
const ZODIAC_EMOJI = ['🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐵', '🐔', '🐶', '🐷']

const STAR_SIGNS = [
  { ko: '염소자리', en: 'Capricorn', emoji: '♑', endMonth: 1, endDay: 19 },
  { ko: '물병자리', en: 'Aquarius', emoji: '♒', endMonth: 2, endDay: 18 },
  { ko: '물고기자리', en: 'Pisces', emoji: '♓', endMonth: 3, endDay: 20 },
  { ko: '양자리', en: 'Aries', emoji: '♈', endMonth: 4, endDay: 19 },
  { ko: '황소자리', en: 'Taurus', emoji: '♉', endMonth: 5, endDay: 20 },
  { ko: '쌍둥이자리', en: 'Gemini', emoji: '♊', endMonth: 6, endDay: 20 },
  { ko: '게자리', en: 'Cancer', emoji: '♋', endMonth: 7, endDay: 22 },
  { ko: '사자자리', en: 'Leo', emoji: '♌', endMonth: 8, endDay: 22 },
  { ko: '처녀자리', en: 'Virgo', emoji: '♍', endMonth: 9, endDay: 22 },
  { ko: '천칭자리', en: 'Libra', emoji: '♎', endMonth: 10, endDay: 22 },
  { ko: '전갈자리', en: 'Scorpio', emoji: '♏', endMonth: 11, endDay: 21 },
  { ko: '사수자리', en: 'Sagittarius', emoji: '♐', endMonth: 12, endDay: 21 },
  { ko: '염소자리', en: 'Capricorn', emoji: '♑', endMonth: 12, endDay: 31 },
]

const BIRTH_TIME_MAP = {
  '자시': { hour: 0, label: '자시 (23-01시)' },
  '축시': { hour: 2, label: '축시 (01-03시)' },
  '인시': { hour: 4, label: '인시 (03-05시)' },
  '묘시': { hour: 6, label: '묘시 (05-07시)' },
  '진시': { hour: 8, label: '진시 (07-09시)' },
  '사시': { hour: 10, label: '사시 (09-11시)' },
  '오시': { hour: 12, label: '오시 (11-13시)' },
  '미시': { hour: 14, label: '미시 (13-15시)' },
  '신시': { hour: 16, label: '신시 (15-17시)' },
  '유시': { hour: 18, label: '유시 (17-19시)' },
  '술시': { hour: 20, label: '술시 (19-21시)' },
  '해시': { hour: 22, label: '해시 (21-23시)' },
}

export const BIRTH_TIMES = Object.entries(BIRTH_TIME_MAP).map(([key, v]) => ({ key, label: v.label }))

function getStarSign(month, day) {
  for (const sign of STAR_SIGNS) {
    if (month < sign.endMonth || (month === sign.endMonth && day <= sign.endDay)) {
      return sign
    }
  }
  return STAR_SIGNS[0]
}

function getZodiacFromYear(year) {
  const idx = (year - 4) % 12
  return {
    ko: ZODIAC_KO[idx],
    en: ZODIAC_EN[idx],
    emoji: ZODIAC_EMOJI[idx],
    index: idx,
  }
}

export function computeSaju(birthDate, birthTimeKey = '자시') {
  const date = new Date(birthDate)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const timeInfo = BIRTH_TIME_MAP[birthTimeKey] || BIRTH_TIME_MAP['자시']
  const star = getStarSign(month, day)

  let zodiac = getZodiacFromYear(year)
  let dayPillar = null
  let monthPillar = null
  let yearPillar = null
  let lunarDate = null
  let usedLunar = false

  try {
    const solar = Solar.fromYmdHms(year, month, day, timeInfo.hour, 0, 0)
    const lunar = solar.getLunar()
    const eightChar = lunar.getEightChar()

    yearPillar = eightChar.getYear()
    monthPillar = eightChar.getMonth()
    dayPillar = eightChar.getDay()
    lunarDate = `음력 ${lunar.getYear()}년 ${lunar.getMonth()}월 ${lunar.getDay()}일`

    const lunarZodiacChar = lunar.getYearShengXiao()
    if (lunarZodiacChar) {
      const lunarYear = lunar.getYear()
      zodiac = getZodiacFromYear(lunarYear)
    }
    usedLunar = true
  } catch (err) {
    console.warn('[fortune] lunar-javascript fallback to Plan B', err)
  }

  return {
    birthDate,
    birthTime: birthTimeKey,
    birthTimeLabel: timeInfo.label,
    zodiac,
    starSign: star,
    yearPillar,
    monthPillar,
    dayPillar,
    lunarDate,
    usedLunar,
  }
}

export function buildSeed(saju, dateStr) {
  const base = `${saju.zodiac.en}-${saju.starSign.en}-${saju.dayPillar || 'NA'}-${dateStr}`
  let hash = 0
  for (let i = 0; i < base.length; i++) {
    hash = (hash * 31 + base.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}
