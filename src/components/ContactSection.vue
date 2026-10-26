<script setup>
import { store } from '../lib/store'
</script>

<template>
  <section role="tabpanel">
    <h2>联系我</h2>
    <ul>
      <li v-for="c in store.contacts" :key="c.label">
        {{ c.label }}：<a :href="c.href">{{ c.text }}</a>
      </li>
    </ul>
  </section>
</template>
