<script setup>
const experiences = [
  { title: '公司 / 学校名称', period: '2024 — 至今', role: '职位 / 专业', desc: '简单描述你在这里做了什么、学到什么。' },
  { title: '上一段经历', period: '2021 — 2024', role: '职位', desc: '描述内容。' },
]
</script>

<template>
  <section role="tabpanel">
    <h2>经历</h2>
    <div class="card" v-for="exp in experiences" :key="exp.title + exp.period">
      <h3>{{ exp.title }}</h3>
      <p class="meta mono">{{ exp.period }} · {{ exp.role }}</p>
      <p>{{ exp.desc }}</p>
    </div>
  </section>
</template>
