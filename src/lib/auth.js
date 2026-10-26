// ---- 管理员认证（轻量方案：SHA-256 哈希比对，零外部依赖）----
// 默认密码：brunozero（哈希见下）
// 修改方式：生成新密码的 SHA-256 哈希（node -e "require('crypto').createHash('sha256').update('新密码').digest('hex')"），
//           替换 ADMIN_HASH；或在项目根目录建 .env 设置 VITE_ADMIN_HASH=新哈希（优先级更高）
const DEFAULT_HASH = '2cfaa161782a6401ae3f7cead8f4088f46a156962fa50d9db7174f98275df555'
export const ADMIN_HASH = import.meta.env.VITE_ADMIN_HASH || DEFAULT_HASH

const AUTH_KEY = 'brunozero_admin_session'

export async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(pw) {
  if (!pw) return false
  const h = await sha256(pw)
  return h === ADMIN_HASH
}

export function isLoggedIn() {
  return localStorage.getItem(AUTH_KEY) === '1'
}

export function setLoggedIn(v) {
  if (v) localStorage.setItem(AUTH_KEY, '1')
  else localStorage.removeItem(AUTH_KEY)
}
