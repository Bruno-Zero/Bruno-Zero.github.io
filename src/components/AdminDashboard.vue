<script setup>
import { ref, computed } from 'vue'
import {
  Layout, Menu, MenuItem, Button, Space, Input, Card, Badge, Divider, message,
} from 'ant-design-vue'
import { store, saveData, API_BASE, DEFAULTS } from '../lib/store'
import { setLoggedIn } from '../lib/auth'

const emit = defineEmits(['exit'])

// ---------- 视图导航 ----------
const view = ref('overview')
const selectedKeys = computed({
  get: () => [view.value],
  set: (v) => (view.value = v[0]),
})

// ---------- 内容编辑（绑定 store） ----------
const form = {
  site: store.site,
  experiences: store.experiences,
  projects: store.projects,
  contacts: store.contacts,
}

function addExperience() {
  form.experiences.push({ title: '新经历', period: String(new Date().getFullYear()), role: '职位', desc: '描述内容。' })
}
function removeExperience(i) {
  form.experiences.splice(i, 1)
}
function addProject() {
  form.projects.push({ name: '新项目', year: String(new Date().getFullYear()), desc: '一句话介绍。', link: '' })
}
function removeProject(i) {
  form.projects.splice(i, 1)
}
function addContact() {
  form.contacts.push({ label: '新联系方式', text: 'value', href: '' })
}
function removeContact(i) {
  form.contacts.splice(i, 1)
}

// ---------- 保存 / 重置 / 退出 ----------
const saving = ref(false)
const saveResult = ref('')

async function handleSave() {
  saving.value = true
  const r = await saveData()
  saving.value = false
  if (r.ok) {
    saveResult.value = `已保存到 ${r.mode === 'cloud' ? '云端数据库' : '本地浏览器'} ✓`
    message.success('内容已保存')
  } else {
    saveResult.value = `保存失败：${r.reason || '未知错误'}`
    message.error('保存失败')
  }
}

function handleResetLocal() {
  localStorage.removeItem('brunozero_admin_data_v1')
  message.success('本地数据已清空，页面将恢复默认内容')
  setTimeout(() => location.reload(), 800)
}

function handleLogout() {
  setLoggedIn(false)
  emit('exit')
}

// ---------- 仪表盘统计 ----------
const stats = computed(() => [
  { label: '经历', value: form.experiences.length, color: '#2dd4bf', icon: '💼' },
  { label: '作品', value: form.projects.length, color: '#818cf8', icon: '🚀' },
  { label: '联系方式', value: form.contacts.length, color: '#fbbf24', icon: '✉️' },
])
</script>

<template>
  <Layout class="admin-dash">
    <!-- 侧边栏 -->
    <Layout.Sider :width="196" class="admin-sider">
      <div class="admin-brand">
        <span class="admin-brand-dot"></span>
        <span class="mono">BRUNOZERO</span>
        <span class="admin-brand-sub">后台管理</span>
      </div>
      <Menu v-model:selectedKeys="selectedKeys" class="admin-menu">
        <MenuItem key="overview">📊 仪表盘</MenuItem>
        <MenuItem key="content">📝 内容管理</MenuItem>
        <MenuItem key="settings">⚙️ 设置</MenuItem>
      </Menu>
      <div class="admin-sider-foot">
        <Button type="text" block class="admin-link" @click="emit('exit')">← 返回主页</Button>
        <Button type="text" block danger @click="handleLogout">退出登录</Button>
      </div>
    </Layout.Sider>

    <!-- 主内容区 -->
    <Layout>
      <Layout.Header class="admin-header">
        <span class="admin-header-title mono">
          {{ view === 'overview' ? '仪表盘' : view === 'content' ? '内容管理' : '设置' }}
        </span>
        <Space>
          <Badge
            :status="API_BASE ? 'success' : 'default'"
            :text="API_BASE ? '云端模式 · Neon' : '本地模式 · localStorage'"
          />
          <Button size="small" @click="emit('exit')">返回主页</Button>
        </Space>
      </Layout.Header>

      <Layout.Content class="admin-body">
        <!-- 仪表盘 -->
        <div v-if="view === 'overview'" class="admin-overview">
          <div class="stat-grid">
            <Card v-for="s in stats" :key="s.label" size="small" class="stat-card">
              <div class="stat-icon" :style="{ background: s.color + '22', color: s.color }">{{ s.icon }}</div>
              <div>
                <div class="stat-value mono">{{ s.value }}</div>
                <div class="stat-label">{{ s.label }}</div>
              </div>
            </Card>
            <Card size="small" class="stat-card">
              <div class="stat-icon" style="background:#2dd4bf22;color:#2dd4bf">🌐</div>
              <div>
                <div class="stat-value mono">{{ API_BASE ? '云端' : '本地' }}</div>
                <div class="stat-label">数据模式</div>
              </div>
            </Card>
          </div>

          <Card size="small" title="站点预览" class="ov-card">
            <div class="preview">
              <div class="preview-line mono">
                <span class="preview-key">抬头</span>{{ form.site.greeting }}{{ form.site.name }}
              </div>
              <div class="preview-line mono">
                <span class="preview-key">一句话</span>{{ form.site.tagline }}
              </div>
              <div class="preview-line mono">
                <span class="preview-key">关于</span>{{ form.site.about }}
              </div>
            </div>
            <Divider style="margin: 12px 0" />
            <div class="ov-actions">
              <Button type="primary" size="small" @click="view = 'content'">去编辑内容 →</Button>
              <span v-if="saveResult" class="ov-save mono">{{ saveResult }}</span>
            </div>
          </Card>
        </div>

        <!-- 内容管理 -->
        <div v-else-if="view === 'content'" class="admin-content">
          <Card size="small" title="👤 个人信息" class="sec-card">
            <div class="sec-grid">
              <Input v-model:value="form.site.greeting" placeholder="问候语（如：你好我是 ）" />
              <Input v-model:value="form.site.name" placeholder="名字（BrunoZero）" />
              <Input v-model:value="form.site.tagline" placeholder="一句话介绍" />
              <Input.TextArea v-model:value="form.site.about" placeholder="关于我" :rows="2" />
            </div>
          </Card>

          <Card size="small" title="💼 经历" class="sec-card">
            <div v-for="(exp, i) in form.experiences" :key="i" class="row-item">
              <div class="row-fields">
                <Input v-model:value="exp.title" placeholder="公司 / 学校名称" />
                <Input v-model:value="exp.period" placeholder="时间" style="width: 170px" />
                <Input v-model:value="exp.role" placeholder="职位 / 专业" style="width: 170px" />
              </div>
              <Input.TextArea v-model:value="exp.desc" placeholder="描述" :rows="1" style="margin-top: 8px" />
              <Button type="text" danger size="small" @click="removeExperience(i)">删除</Button>
            </div>
            <Button size="small" type="dashed" block @click="addExperience">＋ 添加经历</Button>
          </Card>

          <Card size="small" title="🚀 作品" class="sec-card">
            <div v-for="(p, i) in form.projects" :key="i" class="row-item">
              <div class="row-fields">
                <Input v-model:value="p.name" placeholder="项目名称" />
                <Input v-model:value="p.year" placeholder="年份" style="width: 110px" />
              </div>
              <Input v-model:value="p.desc" placeholder="一句话介绍" style="margin-top: 8px" />
              <Input v-model:value="p.link" placeholder="链接（可留空）" style="margin-top: 8px" />
              <Button type="text" danger size="small" @click="removeProject(i)">删除</Button>
            </div>
            <Button size="small" type="dashed" block @click="addProject">＋ 添加作品</Button>
          </Card>

          <Card size="small" title="✉️ 联系方式" class="sec-card">
            <div v-for="(c, i) in form.contacts" :key="i" class="row-item">
              <div class="row-fields">
                <Input v-model:value="c.label" placeholder="标签（邮箱 / GitHub）" style="width: 160px" />
                <Input v-model:value="c.text" placeholder="显示文本" />
                <Input v-model:value="c.href" placeholder="链接" />
                <Button type="text" danger size="small" @click="removeContact(i)">删除</Button>
              </div>
            </div>
            <Button size="small" type="dashed" block @click="addContact">＋ 添加联系方式</Button>
          </Card>

          <div class="content-save">
            <Button type="primary" :loading="saving" @click="handleSave">保存全部内容</Button>
            <span v-if="saveResult" class="ov-save mono">{{ saveResult }}</span>
          </div>
        </div>

        <!-- 设置 -->
        <div v-else class="admin-settings">
          <Card size="small" title="数据模式" class="sec-card">
            <p class="set-line">当前：<Badge :status="API_BASE ? 'success' : 'default'" :text="API_BASE ? '云端数据库（Neon）' : '本地浏览器（localStorage）'" /></p>
            <p class="set-desc">
              {{ API_BASE
                ? '保存内容将写入 Neon 数据库，所有访客可见。'
                : '保存内容仅存在当前浏览器，其他访客看不到改动。部署 Cloudflare Worker 并设置 VITE_API_BASE 后自动切换云端。' }}
            </p>
          </Card>

          <Card size="small" title="修改密码" class="sec-card">
            <p class="set-desc">
              当前为前端哈希校验（轻量方案）。修改方式：编辑 <code class="mono">src/lib/auth.js</code> 中的
              <code class="mono">DEFAULT_HASH</code>，替换为 <code class="mono">node -e "require('crypto').createHash('sha256').update('新密码').digest('hex')"</code> 输出的哈希；或构建时设置 <code class="mono">VITE_ADMIN_HASH</code>。
            </p>
          </Card>

          <Card size="small" title="数据维护" class="sec-card">
            <p class="set-desc">清空本地保存的编辑数据，恢复站点默认内容（不影响云端数据）。</p>
            <Button danger size="small" @click="handleResetLocal">清空本地数据</Button>
          </Card>
        </div>
      </Layout.Content>
    </Layout>
  </Layout>
</template>

<style scoped>
.admin-dash {
  min-height: 100vh;
  background: var(--bg);
  position: fixed;
  inset: 0;
  z-index: 100;
}
.admin-sider {
  background: #12161c !important;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}
.admin-brand {
  padding: 20px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-bottom: 1px solid var(--border);
}
.admin-brand-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--accent); box-shadow: 0 0 12px var(--accent);
  margin-bottom: 8px;
}
.admin-brand { font-size: 0.95rem; font-weight: 700; letter-spacing: 0.05em; }
.admin-brand-sub { color: var(--muted); font-size: 0.72rem; }
.admin-menu {
  background: transparent !important;
  border-inline-end: none !important;
  flex: 1;
}
.admin-menu :deep(.ant-menu-item) {
  color: var(--muted);
  font-size: 0.9rem;
  height: 40px;
  line-height: 40px;
}
.admin-menu :deep(.ant-menu-item-selected) {
  background: rgba(45, 212, 191, 0.12) !important;
  color: var(--accent) !important;
}
.admin-sider-foot { padding: 12px; border-top: 1px solid var(--border); }
.admin-link { color: var(--muted); text-align: left; padding-left: 12px; }
.admin-link:hover { color: var(--accent) !important; }
.admin-header {
  background: var(--panel) !important;
  border-bottom: 1px solid var(--border);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  line-height: 56px;
}
.admin-header-title { font-size: 1rem; font-weight: 600; }
.admin-body { padding: 24px; max-width: 860px; }
.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 16px; }
.stat-card { background: var(--panel) !important; border-color: var(--border) !important; }
.stat-card :deep(.ant-card-body) { display: flex; align-items: center; gap: 12px; }
.stat-icon {
  width: 42px; height: 42px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem;
}
.stat-value { font-size: 1.5rem; font-weight: 700; line-height: 1.2; }
.stat-label { color: var(--muted); font-size: 0.8rem; }
.ov-card, .sec-card { background: var(--panel) !important; border-color: var(--border) !important; margin-bottom: 16px; }
.ov-card :deep(.ant-card-head), .sec-card :deep(.ant-card-head) {
  font-size: 0.9rem; border-bottom-color: var(--border);
}
.preview { display: flex; flex-direction: column; gap: 6px; }
.preview-line { color: var(--ink); font-size: 0.85rem; }
.preview-key { color: var(--muted); margin-right: 10px; display: inline-block; width: 44px; }
.ov-actions { display: flex; align-items: center; gap: 14px; }
.ov-save { color: var(--accent); font-size: 0.8rem; }
.sec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
@media (max-width: 640px) { .sec-grid { grid-template-columns: 1fr; } }
.row-item {
  border: 1px dashed var(--border); border-radius: 8px;
  padding: 10px 12px; margin-bottom: 10px;
  position: relative;
}
.row-fields { display: flex; gap: 8px; flex-wrap: wrap; }
.row-item > .ant-btn { position: absolute; top: 6px; right: 6px; }
.content-save { display: flex; align-items: center; gap: 14px; }
.set-line { color: var(--ink); }
.set-desc { color: var(--muted); font-size: 0.88rem; margin-bottom: 10px; }
.set-desc code { color: var(--accent); background: rgba(255,255,255,0.06); padding: 1px 6px; border-radius: 4px; font-size: 0.82rem; }
.admin-dash :deep(.ant-card) { background: var(--panel); border-color: var(--border); }
.admin-dash :deep(.ant-input), .admin-dash :deep(.ant-input-affix-wrapper) {
  background: #0d1117; border-color: var(--border); color: var(--ink);
}
</style>
