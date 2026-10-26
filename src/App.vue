<script setup>
import { ref, computed } from 'vue'
import { ConfigProvider, Tabs, TabPane, theme, Button, Space } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import AboutSection from './components/AboutSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'
import GameSection from './components/GameSection.vue'
import LoginModal from './components/LoginModal.vue'
import AdminSection from './components/AdminSection.vue'
import { store } from './lib/store'
import { isLoggedIn, setLoggedIn } from './lib/auth'

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
  if (activeTab.value === 'admin') activeTab.value = 'about'
}
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
    <header>
      <div class="header-top">
        <p class="prompt mono">$ whoami</p>
        <Space class="admin-actions">
          <Button v-if="!isAdmin" size="small" type="link" class="login-btn" @click="loginOpen = true">登录</Button>
          <Button v-else size="small" type="link" class="login-btn" @click="handleLogout">退出</Button>
        </Space>
      </div>
      <h1>{{ site.greeting }}{{ site.name }}<span class="cursor"></span></h1>
      <p class="tagline">{{ site.tagline }}</p>
      <Tabs v-model:activeKey="activeTab" class="page-tabs" size="small">
        <TabPane v-for="item in nav" :key="item.id" :tab="'/' + item.label" />
      </Tabs>
    </header>

    <main>
      <AboutSection v-show="activeTab === 'about'" :about="site.about" />
      <ExperienceSection v-show="activeTab === 'experience'" />
      <ProjectsSection v-show="activeTab === 'projects'" />
      <ContactSection v-show="activeTab === 'contact'" />
      <GameSection v-show="activeTab === 'game'" />
      <AdminSection v-if="isAdmin && activeTab === 'admin'" />
    </main>

    <footer class="mono">© {{ year }} {{ site.name }} · Powered by GitHub Pages · Built with Vite + Vue 3</footer>
  </div>

  <LoginModal :open="loginOpen" @close="loginOpen = false" @success="handleLoginSuccess" />
  </ConfigProvider>
</template>

<style>
:root {
  --bg: #0d1117;
  --panel: #161b22;
  --ink: #e6edf3;
  --muted: #8b949e;
  --accent: #2dd4bf;
  --border: #30363d;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
  background: var(--bg);
  color: var(--ink);
  line-height: 1.75;
}
.mono { font-family: "SF Mono", "JetBrains Mono", Consolas, monospace; }
.wrap { max-width: 760px; margin: 0 auto; padding: 0 24px; }
header { padding: 80px 0 44px; border-bottom: 1px solid var(--border); }
.header-top { display: flex; align-items: center; justify-content: space-between; }
.prompt { color: var(--accent); font-size: 0.9rem; }
.login-btn { color: var(--muted); padding: 0; }
.login-btn:hover { color: var(--accent) !important; }
h1 { font-size: 2rem; font-weight: 700; margin-top: 8px; letter-spacing: 0.01em; }
h1 .cursor { display: inline-block; width: 10px; height: 1.1em; background: var(--accent);
  vertical-align: text-bottom; animation: blink 1.1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.tagline { color: var(--muted); margin-top: 12px; }
.page-tabs { margin-top: 24px; }
.page-tabs .ant-tabs-nav { margin-bottom: 0; }
.page-tabs .ant-tabs-tab {
  font-family: "SF Mono", "JetBrains Mono", Consolas, monospace;
  font-size: 0.9rem; padding: 8px 18px;
  transition: background 0.2s, color 0.2s;
}
.page-tabs .ant-tabs-tab:hover { background: rgba(255, 255, 255, 0.05); }
.page-tabs .ant-tabs-content-holder { display: none; }
main { min-height: 320px; }
section { padding: 44px 0; }
h2 {
  font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.2em;
  color: var(--accent); margin-bottom: 20px; font-weight: 600;
}
h2::before { content: "## "; color: var(--muted); }
.card {
  background: var(--panel); border: 1px solid var(--border); border-radius: 8px;
  padding: 18px 20px; margin-bottom: 16px;
}
.card h3 { font-size: 1.05rem; font-weight: 600; }
.card .meta { color: var(--muted); font-size: 0.85rem; margin: 2px 0 6px; }
.card p { color: var(--muted); font-size: 0.95rem; }
.card a { color: var(--accent); text-decoration: none; }
.card a:hover { text-decoration: underline; }
ul { padding-left: 1.2em; color: var(--muted); }
.play-link {
  display: inline-block; color: var(--accent); text-decoration: none;
  border: 1px solid var(--accent); border-radius: 6px; padding: 8px 18px;
  margin-bottom: 16px; transition: background 0.2s;
}
.play-link:hover { background: rgba(45, 212, 191, 0.12); }
.game-frame iframe {
  width: 100%; height: 62vh; min-height: 420px;
  border: 1px solid var(--border); border-radius: 8px; background: #000;
}
footer { padding: 32px 0 64px; color: var(--muted); font-size: 0.8rem; text-align: center; }
a { color: var(--accent); }
@media (max-width: 600px) { header { padding: 52px 0 30px; } h1 { font-size: 1.5rem; } }
</style>
