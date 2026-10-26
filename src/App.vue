<script setup>
import { ref } from 'vue'
import { ConfigProvider, Tabs, TabPane, theme } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const site = ref({
  name: 'BrunoZero',
  greeting: '你好我是 ',
  tagline: '我是一个在南通打工的卖代码生活的狗🐶',
  about: '我的一个在南通打工的卖代码生活的狗🐶',
})

const nav = [
  { id: 'about', label: '关于' },
  { id: 'experience', label: '经历' },
  { id: 'projects', label: '作品' },
  { id: 'contact', label: '联系' },
  { id: 'game', label: '游戏' },
]

const activeTab = ref('about')

const experiences = [
  { title: '公司 / 学校名称', period: '2024 — 至今', role: '职位 / 专业', desc: '简单描述你在这里做了什么、学到什么。' },
  { title: '上一段经历', period: '2021 — 2024', role: '职位', desc: '描述内容。' },
]

const projects = [
  { name: '项目名称', year: '2025', desc: '一句话介绍这个项目。', link: '#' },
]

const contacts = [
  { label: '邮箱', text: 'you@example.com', href: 'mailto:you@example.com' },
  { label: 'GitHub', text: 'github.com/Bruno-Zero', href: 'https://github.com/Bruno-Zero' },
]

const year = new Date().getFullYear()
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
      <p class="prompt mono">$ whoami</p>
      <h1>{{ site.greeting }}{{ site.name }}<span class="cursor"></span></h1>
      <p class="tagline">{{ site.tagline }}</p>
      <Tabs v-model:activeKey="activeTab" class="page-tabs" size="small">
        <TabPane v-for="item in nav" :key="item.id" :tab="'/' + item.label" />
      </Tabs>
    </header>

    <main>
      <section id="about" v-show="activeTab === 'about'" role="tabpanel">
        <h2>关于我</h2>
        <p style="color:var(--muted)">{{ site.about }}</p>
      </section>

      <section id="experience" v-show="activeTab === 'experience'" role="tabpanel">
        <h2>经历</h2>
        <div class="card" v-for="exp in experiences" :key="exp.title + exp.period">
          <h3>{{ exp.title }}</h3>
          <p class="meta mono">{{ exp.period }} · {{ exp.role }}</p>
          <p>{{ exp.desc }}</p>
        </div>
      </section>

      <section id="projects" v-show="activeTab === 'projects'" role="tabpanel">
        <h2>作品</h2>
        <div class="card" v-for="p in projects" :key="p.name">
          <h3>{{ p.name }}</h3>
          <p class="meta mono">{{ p.year }}</p>
          <p>{{ p.desc }} <a v-if="p.link" :href="p.link">查看 →</a></p>
        </div>
      </section>

      <section id="contact" v-show="activeTab === 'contact'" role="tabpanel">
        <h2>联系我</h2>
        <ul>
          <li v-for="c in contacts" :key="c.label">
            {{ c.label }}：<a :href="c.href">{{ c.text }}</a>
          </li>
        </ul>
      </section>

      <section id="game" v-show="activeTab === 'game'" role="tabpanel">
        <h2>玩 Minecraft 🎮</h2>
        <p style="color:var(--muted); margin-bottom: 14px;">网页版 Minecraft（EaglercraftX 1.8.8），无需下载，存档自动保存在浏览器里。加载约需十几秒，如果画面空白请稍等片刻。</p>
        <a class="play-link mono" href="/minecraft/" target="_blank">全屏开始游戏 →</a>
        <div class="game-frame">
          <iframe src="/minecraft/" loading="lazy" allowfullscreen></iframe>
        </div>
      </section>
    </main>

    <footer class="mono">© {{ year }} {{ site.name }} · Powered by GitHub Pages · Built with Vite + Vue 3</footer>
  </div>
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
.prompt { color: var(--accent); font-size: 0.9rem; }
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
