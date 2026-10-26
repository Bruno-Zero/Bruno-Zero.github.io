<script setup>
const projects = [
  { name: '项目名称', year: '2025', desc: '一句话介绍这个项目。', link: '#' },
]
</script>

<template>
  <section role="tabpanel">
    <h2>作品</h2>
    <div class="card" v-for="p in projects" :key="p.name">
      <h3>{{ p.name }}</h3>
      <p class="meta mono">{{ p.year }}</p>
      <p>{{ p.desc }} <a v-if="p.link" :href="p.link">查看 →</a></p>
    </div>
  </section>
</template>
