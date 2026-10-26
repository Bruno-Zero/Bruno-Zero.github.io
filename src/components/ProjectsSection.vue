<script setup>
import { store } from '../lib/store'
</script>

<template>
  <section role="tabpanel">
    <h2>作品</h2>
    <div class="card" v-for="p in store.projects" :key="p.name">
      <h3>{{ p.name }}</h3>
      <p class="meta mono">{{ p.year }}</p>
      <p>{{ p.desc }} <a v-if="p.link" :href="p.link">查看 →</a></p>
    </div>
  </section>
</template>
