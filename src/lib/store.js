import { reactive } from 'vue'

// ---- 默认内容（组件化重构前的原始数据）----
export const DEFAULTS = {
  site: {
    name: 'BrunoZero',
    greeting: '你好我是 ',
    tagline: '我是一个在南通打工的卖代码生活的狗🐶',
    about: '我的一个在南通打工的卖代码生活的狗🐶',
  },
  experiences: [
    { title: '公司 / 学校名称', period: '2024 — 至今', role: '职位 / 专业', desc: '简单描述你在这里做了什么、学到什么。' },
    { title: '上一段经历', period: '2021 — 2024', role: '职位', desc: '描述内容。' },
  ],
  projects: [
    { name: '项目名称', year: '2025', desc: '一句话介绍这个项目。', link: '#' },
  ],
  contacts: [
    { label: '邮箱', text: 'you@example.com', href: 'mailto:you@example.com' },
    { label: 'GitHub', text: 'github.com/Bruno-Zero', href: 'https://github.com/Bruno-Zero' },
  ],
}

const STORAGE_KEY = 'brunozero_admin_data_v1'

// ---- 数据后端：默认 localStorage；部署 Neon Worker 后设置 VITE_API_BASE 切换为云端 ----
// 构建时通过环境变量注入：VITE_API_BASE=https://your-worker.workers.dev
export const API_BASE = import.meta.env.VITE_API_BASE || ''
// 云端写操作需要管理员口令（与 Worker 内校验一致）
export const API_PASSWORD = import.meta.env.VITE_API_PASSWORD || ''

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

function deepMerge(base, override) {
  if (!override) return { ...base, site: { ...base.site } }
  return {
    ...base,
    ...override,
    site: { ...base.site, ...(override.site || {}) },
  }
}

// ---- 云端读取（Worker GET /api/data）----
async function apiLoad() {
  if (!API_BASE) return null
  try {
    const res = await fetch(`${API_BASE}/api/data`)
    if (!res.ok) return null
    const data = await res.json()
    return data || null
  } catch (e) {
    console.warn('api load failed, fallback to local', e)
    return null
  }
}

const cached = loadLocal()
export const store = reactive(deepMerge(DEFAULTS, cached))

// 云端数据异步补充（有 API_BASE 时，覆盖本地数据）
async function mergeCloud() {
  const data = await apiLoad()
  if (data) {
    Object.assign(store, deepMerge({ ...store }, data))
  }
}
mergeCloud()

export function saveToLocal() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      site: store.site,
      experiences: store.experiences,
      projects: store.projects,
      contacts: store.contacts,
    })
  )
}

// ---- 云端保存（Worker POST /api/data，携带口令）----
export async function saveToCloud() {
  if (!API_BASE) return { ok: false, reason: 'no-api' }
  const res = await fetch(`${API_BASE}/api/data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Password': API_PASSWORD,
    },
    body: JSON.stringify({
      site: store.site,
      experiences: store.experiences,
      projects: store.projects,
      contacts: store.contacts,
    }),
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    return { ok: false, reason: `${res.status} ${msg}` }
  }
  return { ok: true }
}

// ---- 保存入口：有云端配置则存云端，否则存本地 ----
export async function saveData() {
  if (API_BASE) {
    const r = await saveToCloud()
    if (r.ok) {
      saveToLocal()
      return { ok: true, mode: 'cloud' }
    }
    return { ok: false, reason: r.reason, mode: 'cloud' }
  }
  saveToLocal()
  return { ok: true, mode: 'local' }
}
