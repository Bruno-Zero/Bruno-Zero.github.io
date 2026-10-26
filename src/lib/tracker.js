// ---- 访客打点：页面加载时向 Worker 上报一次访问 ----
// 未部署 Worker（VITE_API_BASE 为空）时静默跳过，不影响其他功能
const API_BASE = import.meta.env.VITE_API_BASE || ''

export function trackVisit() {
  if (!API_BASE) return
  try {
    fetch(`${API_BASE}/api/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: location.pathname || '/',
        ref: document.referrer ? document.referrer.slice(0, 500) : '',
      }),
      keepalive: true,
    }).catch(() => {})
  } catch (e) {
    // 打点失败不影响页面
  }
}

// ---- 拉取访客统计（管理员） ----
export async function fetchStats() {
  if (!API_BASE) return null
  const res = await fetch(`${API_BASE}/api/stats`, {
    headers: { 'X-Admin-Password': import.meta.env.VITE_API_PASSWORD || '' },
  })
  if (!res.ok) return null
  return res.json()
}
