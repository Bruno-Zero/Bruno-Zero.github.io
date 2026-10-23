<script setup>
import { ref } from 'vue'

const site = ref({
  name: '（你的名字）',
  greeting: '你好，我是 ',
  tagline: '一句话介绍自己，比如：开发者 / 学生 / 创作者。',
  about: '在这里写两三句自我介绍：你做什么、对什么感兴趣、正在学习或探索什么。',
})

const nav = [
  { id: 'about', label: '关于' },
  { id: 'experience', label: '经历' },
  { id: 'projects', label: '作品' },
  { id: 'contact', label: '联系' },
]

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
  <div class="wrap">
    <header>
      <p class="prompt mono">$ whoami</p>
      <h1>{{ site.greeting }}{{ site.name }}<span class="cursor"></span></h1>
      <p class="tagline">{{ site.tagline }}</p>
      <nav class="mono">
        <a v-for="item in nav" :key="item.id" :href="'#' + item.id">{{ item.label }}</a>
      </nav>
    </header>

    <section id="about">
      <h2>关于我</h2>
      <p style="color:var(--muted)">{{ site.about }}</p>
    </section>

    <section id="experience">
      <h2>经历</h2>
      <div class="card" v-for="exp in experiences" :key="exp.title + exp.period">
        <h3>{{ exp.title }}</h3>
        <p class="meta mono">{{ exp.period }} · {{ exp.role }}</p>
        <p>{{ exp.desc }}</p>
      </div>
    </section>

    <section id="projects">
      <h2>作品</h2>
      <div class="card" v-for="p in projects" :key="p.name">
        <h3>{{ p.name }}</h3>
        <p class="meta mono">{{ p.year }}</p>
        <p>{{ p.desc }} <a v-if="p.link" :href="p.link">查看 →</a></p>
      </div>
    </section>

    <section id="contact">
      <h2>联系我</h2>
      <ul>
        <li v-for="c in contacts" :key="c.label">
          {{ c.label }}：<a :href="c.href">{{ c.text }}</a>
        </li>
      </ul>
    </section>

    <footer class="mono">© {{ year }} {{ site.name }} · Powered by GitHub Pages · Built with Vite + Vue 3</footer>
  </div>
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
nav { display: flex; gap: 26px; margin-top: 28px; flex-wrap: wrap; }
nav a { color: var(--accent); text-decoration: none; font-size: 0.9rem; }
nav a::before { content: "./"; color: var(--muted); }
nav a:hover { text-decoration: underline; }
section { padding: 44px 0; border-bottom: 1px solid var(--border); }
section:last-of-type { border-bottom: none; }
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
footer { padding: 32px 0 64px; color: var(--muted); font-size: 0.8rem; text-align: center; }
a { color: var(--accent); }
@media (max-width: 600px) { header { padding: 52px 0 30px; } h1 { font-size: 1.5rem; } }
</style>
