<script setup>
import { store } from '../lib/store'
</script>

<template>
  <section role="tabpanel">
    <h2>作品</h2>
    <div class="proj-grid">
      <div class="card proj-card" v-for="p in store.projects" :key="p.name">
        <div class="proj-icon">▣</div>
        <h3>{{ p.name }}</h3>
        <p class="meta mono">{{ p.year }}</p>
        <p>{{ p.desc }} <a v-if="p.link" :href="p.link">查看 →</a></p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.proj-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.proj-card { margin-bottom: 0; }
.proj-icon {
  color: var(--accent);
  font-size: 1.2rem;
  margin-bottom: 8px;
}
@media (max-width: 600px) {
  .proj-grid { grid-template-columns: 1fr; }
}
</style>
