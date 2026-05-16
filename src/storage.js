const KEYS = {
  USER: 'kfortune.user',
  HISTORY: 'kfortune.history',
  CACHE_PREFIX: 'kfortune.cache.',
}

function safeGet(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn('[storage] set failed', err)
  }
}

export function saveUser(user) {
  safeSet(KEYS.USER, user)
}

export function loadUser() {
  return safeGet(KEYS.USER)
}

export function getCached(dateStr) {
  return safeGet(KEYS.CACHE_PREFIX + dateStr)
}

export function setCached(dateStr, payload) {
  safeSet(KEYS.CACHE_PREFIX + dateStr, payload)
  pushHistory(dateStr, payload)
}

export function pushHistory(dateStr, payload) {
  let history = safeGet(KEYS.HISTORY) || []
  history = history.filter(h => h.date !== dateStr)
  history.unshift({ date: dateStr, fortune: payload })
  history = history.slice(0, 7)
  safeSet(KEYS.HISTORY, history)
}

export function loadHistory() {
  return safeGet(KEYS.HISTORY) || []
}

export function clearOldCache(dateStr) {
  const keep = new Set([KEYS.CACHE_PREFIX + dateStr])
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(KEYS.CACHE_PREFIX) && !keep.has(key)) {
      const dayStr = key.slice(KEYS.CACHE_PREFIX.length)
      const dayDate = new Date(dayStr)
      const today = new Date(dateStr)
      const diff = (today - dayDate) / (1000 * 60 * 60 * 24)
      if (diff > 7) localStorage.removeItem(key)
    }
  }
}
