<script setup>
import { ref, computed, watch } from 'vue'
import { ConfigProvider, Tabs, TabPane, theme, Button, Space } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import AboutSection from './components/AboutSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'
import GameSection from './components/GameSection.vue'
import LoginModal from './components/LoginModal.vue'
import AdminDashboard from './components/AdminDashboard.vue'
import { store } from './lib/store'
import { isLoggedIn, setLoggedIn } from './lib/auth'
import { trackVisit } from './lib/tracker'

// 访客打点（Worker 部署后自动上报；未部署则静默跳过）
trackVisit()

const site = store.site

const baseNav = [
  { id: 'about', label: '关于' },
  { id: 'experience', label: '经历' },
  { id: 'projects', label: '作品' },
  { id: 'contact', label: '联系' },
  { id: 'game', label: '游戏' },
]

const isAdmin = ref(isLoggedIn())
const loginOpen = ref(false)
// 全屏后台视图：登录后点"管理"tab 进入
const adminView = ref(false)

const nav = computed(() => (isAdmin.value ? [...baseNav, { id: 'admin', label: '管理' }] : baseNav))

const activeTab = ref('about')

const year = new Date().getFullYear()

function handleLoginSuccess() {
  isAdmin.value = true
  loginOpen.value = false
  activeTab.value = 'admin'
}

function handleLogout() {
  setLoggedIn(false)
  isAdmin.value = false
  adminView.value = false
  if (activeTab.value === 'admin') activeTab.value = 'about'
}

function exitAdmin() {
  adminView.value = false
  activeTab.value = 'about'
}

// 点"管理"tab 进入全屏后台；点其他 tab 退出后台视图
watch(activeTab, (v) => {
  if (v === 'admin' && isAdmin.value) adminView.value = true
  else adminView.value = false
})
</script>

<template>
  <ConfigProvider :theme="{
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: '#2dd4bf',
      colorBgContainer: '#0d1117',
      colorBgElevated: '#161b22',
      colorBorder: '#30363d',
      colorText: '#e6edf3',
      colorTextSecondary: '#a3adb8',
      fontSize: 14,
    },
    components: {
      Tabs: {
        itemColor: '#a3adb8',
        itemHoverColor: '#e6edf3',
        itemSelectedColor: '#2dd4bf',
        itemActiveColor: '#2dd4bf',
        inkBarColor: '#2dd4bf',
        titleFontSize: 14,
      },
    },
  }">
  <div class="wrap">
    <span class="deco deco-star" aria-hidden="true">★</span>
    <span class="deco deco-pup" aria-hidden="true">🐶</span>
    <span class="deco deco-heart" aria-hidden="true">♥</span>
    <header>
      <div class="header-top">
        <p class="prompt mono">$ whoami</p>
        <Space class="admin-actions">
          <Button v-if="!isAdmin" size="small" type="link" class="login-btn" @click="loginOpen = true">登录</Button>
          <Button v-else size="small" type="link" class="login-btn" @click="handleLogout">退出</Button>
        </Space>
      </div>
      <h1><span class="pixel-title">{{ site.name }}</span><span class="cursor"></span></h1>
      <p class="tagline">{{ site.tagline }}</p>
      <Tabs v-model:activeKey="activeTab" class="page-tabs" size="small">
        <TabPane v-for="item in nav" :key="item.id" :tab="'/' + item.label" />
      </Tabs>
    </header>

    <main>
      <AdminDashboard v-if="isAdmin && adminView" @exit="exitAdmin" />
      <template v-else>
        <AboutSection v-show="activeTab === 'about'" :about="site.about" />
        <ExperienceSection v-show="activeTab === 'experience'" />
        <ProjectsSection v-show="activeTab === 'projects'" />
        <ContactSection v-show="activeTab === 'contact'" />
        <GameSection v-show="activeTab === 'game'" />
      </template>
    </main>

    <footer class="mono">© {{ year }} {{ site.name }} · Powered by GitHub Pages · Built with Vite + Vue 3</footer>
  </div>

  <LoginModal :open="loginOpen" @close="loginOpen = false" @success="handleLoginSuccess" />
  </ConfigProvider>
</template>

<style>
@font-face {
  font-family: 'Press Start 2P';
  src: url('/fonts/pressstart2p.woff2') format('woff2');
  font-display: swap;
}
:root {
  --bg: #141828;
  --panel: #1c2138;
  --ink: #e8ecf8;
  --muted: #8b93b8;
  --accent: #2dd4bf;
  --border: #3a4066;
  --pixel: "Press Start 2P", monospace;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
  background: var(--bg);
  background-image: radial-gradient(rgba(45, 212, 191, 0.07) 1px, transparent 1.5px);
  background-size: 18px 18px;
  color: var(--ink);
  line-height: 1.75;
}
.mono { font-family: "SF Mono", "JetBrains Mono", Consolas, monospace; }
.wrap { max-width: 820px; margin: 0 auto; padding: 0 24px; position: relative; }

/* 角落像素装饰 */
.deco { position: fixed; font-size: 18px; opacity: 0.55; pointer-events: none; user-select: none; z-index: 0; }
.deco-star { top: 88px; right: 8%; color: #facc15; }
.deco-pup { bottom: 90px; left: 6%; font-size: 22px; }
.deco-heart { bottom: 96px; right: 7%; color: #f472b6; font-size: 16px; }

header { padding: 72px 0 36px; border-bottom: 2px solid var(--border); position: relative; z-index: 1; }
.header-top { display: flex; align-items: center; justify-content: space-between; }
.prompt { color: var(--accent); font-size: 0.9rem; }
.login-btn { color: var(--muted); padding: 0; }
.login-btn:hover { color: var(--accent) !important; }

h1 { margin-top: 18px; letter-spacing: 0.04em; line-height: 1.3; }
.pixel-title {
  font-family: var(--pixel);
  font-size: 1.7rem;
  color: var(--ink);
  text-shadow: 3px 3px 0 rgba(45, 212, 191, 0.35);
}
h1 .cursor { display: inline-block; width: 12px; height: 1.1em; background: var(--accent);
  vertical-align: text-bottom; margin-left: 6px;
  animation: blink 1.1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.tagline { color: var(--muted); margin-top: 16px; font-size: 0.95rem; }

/* 像素风导航按钮 */
.page-tabs { margin-top: 28px; }
.page-tabs .ant-tabs-nav { margin-bottom: 0; }
.page-tabs .ant-tabs-nav::before { display: none !important; }
.page-tabs .ant-tabs-nav-list { gap: 10px; }
.page-tabs .ant-tabs-tab {
  background: var(--panel);
  border: 2px solid var(--border);
  border-radius: 0;
  margin: 0 !important;
  padding: 10px 16px !important;
  font-family: var(--pixel);
  font-size: 9px;
  color: var(--muted);
  transition: none;
}
.page-tabs .ant-tabs-tab:hover { background: #232945; color: var(--ink); }
.page-tabs .ant-tabs-tab-active,
.page-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
  background: var(--accent) !important;
  color: #0b1512 !important;
  border-color: var(--accent);
}
.page-tabs .ant-tabs-ink-bar { display: none !important; }
.page-tabs .ant-tabs-content-holder { display: none; }

main { min-height: 320px; position: relative; z-index: 1; }
section { padding: 36px 0; }
h2 {
  font-family: var(--pixel);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: var(--accent);
  margin-bottom: 22px;
  font-weight: normal;
}
h2::before { content: "# "; color: var(--muted); }

/* 像素硬边框卡片（RPG 对话框风） */
.card {
  background: var(--panel);
  border: 2px solid var(--border);
  border-radius: 0;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.35);
  padding: 18px 20px;
  margin-bottom: 16px;
}
.card h3 { font-size: 1.05rem; font-weight: 600; }
.card .meta { color: var(--accent); font-size: 0.8rem; margin: 4px 0 8px; font-family: var(--pixel); font-size: 9px; }
.card p { color: var(--muted); font-size: 0.95rem; }
.card a { color: var(--accent); text-decoration: none; }
.card a:hover { text-decoration: underline; }
ul { padding-left: 1.2em; color: var(--muted); }
.play-link {
  display: inline-block; color: var(--accent); text-decoration: none;
  border: 2px solid var(--accent); border-radius: 0; padding: 10px 20px;
  margin-bottom: 16px; font-family: var(--pixel); font-size: 9px;
  transition: none;
}
.play-link:hover { background: rgba(45, 212, 191, 0.15); }
.game-frame iframe {
  width: 100%; height: 62vh; min-height: 420px;
  border: 2px solid var(--border); border-radius: 0; background: #000;
}
footer { padding: 32px 0 64px; color: var(--muted); font-size: 0.8rem; text-align: center; position: relative; z-index: 1; }
a { color: var(--accent); }
@media (max-width: 600px) {
  header { padding: 48px 0 26px; }
  .pixel-title { font-size: 1.15rem; }
  .page-tabs .ant-tabs-tab { padding: 8px 10px !important; font-size: 8px; }
}
</style>
