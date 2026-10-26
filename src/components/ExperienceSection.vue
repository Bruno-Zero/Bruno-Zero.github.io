<script setup>
import { store } from '../lib/store'
</script>

<template>
  <section role="tabpanel">
    <h2>经历</h2>
    <div class="card" v-for="exp in store.experiences" :key="exp.title + exp.period">
      <h3>{{ exp.title }}</h3>
      <p class="meta mono">{{ exp.period }} · {{ exp.role }}</p>
      <p>{{ exp.desc }}</p>
    </div>
  </section>
</template>
