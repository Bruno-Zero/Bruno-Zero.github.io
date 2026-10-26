// ---- 管理员认证（轻量方案：SHA-256 哈希比对，零外部依赖）----
// 默认密码：hua530（哈希见下）
// 修改方式：生成新密码的 SHA-256 哈希（node -e "require('crypto').createHash('sha256').update('新密码').digest('hex')"），
//           替换 ADMIN_HASH；或在项目根目录建 .env 设置 VITE_ADMIN_HASH=新哈希（优先级更高）
const DEFAULT_HASH = '7389718bfa35a0278ce3cf9a908c57e497327644c85f0ccb5601e06534793b7a'
export const ADMIN_HASH = import.meta.env.VITE_ADMIN_HASH || DEFAULT_HASH

// 登录态与 API 口令存在 sessionStorage：仅当前标签页会话有效，关闭标签页即失效
const AUTH_KEY = 'brunozero_admin_session'
const API_PW_KEY = 'brunozero_admin_api_pw'

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
  return sessionStorage.getItem(AUTH_KEY) === '1'
}

// 登录：记录会话 + 保存 API 口令（用于调 Worker 写接口 / 统计接口）
export function setLoggedIn(v, pw) {
  if (v) {
    sessionStorage.setItem(AUTH_KEY, '1')
    if (pw) sessionStorage.setItem(API_PW_KEY, pw)
  } else {
    sessionStorage.removeItem(AUTH_KEY)
    sessionStorage.removeItem(API_PW_KEY)
  }
}

// 后端 API 口令（Worker 的 ADMIN_PASSWORD = 管理员登录密码）
export function getApiPassword() {
  return sessionStorage.getItem(API_PW_KEY) || ''
}
