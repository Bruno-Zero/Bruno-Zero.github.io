/**
 * BrunoZero 个人主页 — 后台数据 API + 访客统计（Cloudflare Worker + Neon PostgreSQL）
 *
 * 零依赖版本：不使用 npm 包（@neondatabase/serverless），直接调用 Neon 的 HTTP SQL 端点，
 * 部署时不需要安装任何依赖，单文件即可 npx wrangler deploy。
 *
 * 作用：给 GitHub Pages 静态站提供一个"小后端"，安全地持有 Neon 数据库连接串，
 *      前端（VITE_API_BASE 指向本 Worker）通过它：
 *        - 读写主页内容（所有访客可见）
 *        - 记录访客访问（打点）并查询统计（后台面板）
 *
 * 接口：
 *   GET  /api/data   — 公开读取主页内容
 *   POST /api/data   — 管理员写入主页内容（X-Admin-Password）
 *   POST /api/visit  — 公开访客打点（30 秒 / IP 限流）
 *   GET  /api/stats  — 管理员统计（X-Admin-Password）：今日/昨日/总访问/近7日/路径Top/来源Top
 *
 * 部署步骤：
 * 1. 登录：npx wrangler login
 * 2. 部署本文件：npx wrangler deploy worker.js
 * 3. 设置 Secrets（连接串与口令只存在 Worker 里，不暴露给前端）：
 *      npx wrangler secret put NEON_DATABASE_URL   # 你的 Neon PostgreSQL 连接串
 *      npx wrangler secret put ADMIN_PASSWORD      # 后台登录密码（与前端登录密码一致）
 * 4. 前端构建时设置环境变量：
 *      VITE_API_BASE=https://你的-worker名.workers.dev
 *
 * 数据库结构（首次请求自动建表）：
 *   CREATE TABLE IF NOT EXISTS site_data (id int primary key, data jsonb not null);
 *   CREATE TABLE IF NOT EXISTS visits (
 *     id bigserial primary key,
 *     ts timestamptz not null default now(),
 *     ip text, ua text, path text, ref text
 *   );
 *   CREATE INDEX IF NOT EXISTS idx_visits_ts ON visits (ts);
 *
 * 说明：
 * - Neon HTTP SQL 端点：https://<host>/sql（POST {query, params}），返回 {fields, data}。
 * - 连接串若带 -pooler（池化域名），HTTP driver 不支持，需去掉 -pooler 后缀。
 * - 所有用户输入一律走 $1/$2... 参数化，杜绝 SQL 注入。
 */

// ---------- 零依赖 Neon HTTP driver ----------
function parseConn(connStr) {
  const u = new URL(connStr)
  return {
    host: u.hostname.replace('-pooler', ''), // HTTP driver 不支持池化域名，去掉 -pooler
    user: decodeURIComponent(u.username),
    pass: decodeURIComponent(u.password),
  }
}

function makeSql(connStr) {
  const { host, user, pass } = parseConn(connStr)
  let auth
  try {
    auth = 'Basic ' + btoa(user + ':' + pass)
  } catch (e) {
    throw new Error('数据库连接串用户名或密码包含非 ASCII 字符，请更换连接串')
  }
  // 返回 (text, params) => 行对象数组
  return async function sql(text, params = []) {
    const res = await fetch(`https://${host}/sql`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: auth },
      body: JSON.stringify({ query: text, params }),
    })
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 300)
      throw new Error(`Neon HTTP ${res.status}: ${detail}`)
    }
    const out = await res.json()
    const fields = (out.fields || []).map((f) => f.name)
    return (out.data || []).map((row) => {
      const o = {}
      fields.forEach((name, i) => {
        o[name] = row[i]
      })
      return o
    })
  }
}

const DATA_TABLE = 'site_data'
const VISIT_TABLE = 'visits'
const ROW_ID = 1

async function ensureDataTable(sql) {
  await sql(`CREATE TABLE IF NOT EXISTS ${DATA_TABLE} (id int primary key, data jsonb not null)`)
}

async function ensureVisitTable(sql) {
  await sql(`CREATE TABLE IF NOT EXISTS ${VISIT_TABLE} (
    id bigserial primary key,
    ts timestamptz not null default now(),
    ip text,
    ua text,
    path text,
    ref text
  )`)
  await sql(`CREATE INDEX IF NOT EXISTS idx_visits_ts ON ${VISIT_TABLE} (ts)`)
}

function json(res, body, status = 200, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    try {
      if (!env.NEON_DATABASE_URL) {
        return json({ error: 'NEON_DATABASE_URL not set' }, 500, cors)
      }
      const sql = makeSql(env.NEON_DATABASE_URL)

      // ---------- GET /api/data — 公开读取主页内容 ----------
      if (request.method === 'GET' && url.pathname === '/api/data') {
        await ensureDataTable(sql)
        const rows = await sql(`SELECT data FROM ${DATA_TABLE} WHERE id = $1`, [ROW_ID])
        return json(rows.length ? rows[0].data : null, 200, cors)
      }

      // ---------- POST /api/data — 管理员写入主页内容 ----------
      if (request.method === 'POST' && url.pathname === '/api/data') {
        const pwd = request.headers.get('X-Admin-Password') || ''
        if (pwd !== env.ADMIN_PASSWORD) {
          return json({ error: 'forbidden' }, 403, cors)
        }
        const body = await request.json().catch(() => null)
        if (!body || typeof body !== 'object') {
          return json({ error: 'bad request' }, 400, cors)
        }
        await ensureDataTable(sql)
        await sql(
          `INSERT INTO ${DATA_TABLE} (id, data) VALUES ($1, $2::jsonb)
           ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
          [ROW_ID, JSON.stringify(body)]
        )
        return json({ ok: true }, 200, cors)
      }

      // ---------- POST /api/visit — 公开访客打点（30 秒 / IP 限流） ----------
      if (request.method === 'POST' && url.pathname === '/api/visit') {
        await ensureVisitTable(sql)
        const body = await request.json().catch(() => ({}))
        const ip = request.headers.get('CF-Connecting-IP') || ''
        const ua = (request.headers.get('User-Agent') || '').slice(0, 400)
        const path = String(body.path || '/').slice(0, 200)
        const ref = String(body.ref || '').slice(0, 500)
        // 简单限流：同一 IP 30 秒内最多记 1 条
        if (ip) {
          const recent = await sql(
            `SELECT 1 FROM ${VISIT_TABLE} WHERE ip = $1 AND ts > now() - interval '30 seconds' LIMIT 1`,
            [ip]
          )
          if (recent.length) {
            return json({ ok: true, throttled: true }, 200, cors)
          }
        }
        await sql(
          `INSERT INTO ${VISIT_TABLE} (ip, ua, path, ref) VALUES ($1, $2, $3, $4)`,
          [ip, ua, path, ref]
        )
        return json({ ok: true }, 200, cors)
      }

      // ---------- GET /api/stats — 管理员统计 ----------
      if (request.method === 'GET' && url.pathname === '/api/stats') {
        const pwd = request.headers.get('X-Admin-Password') || ''
        if (pwd !== env.ADMIN_PASSWORD) {
          return json({ error: 'forbidden' }, 403, cors)
        }
        await ensureVisitTable(sql)
        const [today] = await sql(`SELECT count(*)::int AS n FROM ${VISIT_TABLE} WHERE ts::date = current_date`)
        const [yesterday] = await sql(`SELECT count(*)::int AS n FROM ${VISIT_TABLE} WHERE ts::date = current_date - 1`)
        const [total] = await sql(`SELECT count(*)::int AS n FROM ${VISIT_TABLE}`)
        const last7 = await sql(
          `SELECT to_char(ts, 'YYYY-MM-DD') AS d, count(*)::int AS n
           FROM ${VISIT_TABLE} WHERE ts >= current_date - 6
           GROUP BY d ORDER BY d`
        )
        const topPaths = await sql(
          `SELECT path, count(*)::int AS n FROM ${VISIT_TABLE}
           WHERE ts >= current_date - 7 GROUP BY path ORDER BY n DESC LIMIT 8`
        )
        const topRefs = await sql(
          `SELECT CASE WHEN ref = '' THEN '(直接访问)' ELSE ref END AS ref, count(*)::int AS n
           FROM ${VISIT_TABLE} WHERE ts >= current_date - 7
           GROUP BY ref ORDER BY n DESC LIMIT 8`
        )
        return json(
          {
            today: today ? today.n : 0,
            yesterday: yesterday ? yesterday.n : 0,
            total: total ? total.n : 0,
            last7,
            topPaths,
            topRefs,
          },
          200,
          cors
        )
      }

      return json({ error: 'not found' }, 404, cors)
    } catch (e) {
      return json({ error: String(e) }, 500, cors)
    }
  },
}
