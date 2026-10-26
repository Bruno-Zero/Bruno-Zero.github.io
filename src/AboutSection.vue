<script setup>
defineProps({
  about: { type: String, default: '' },
})
</script>

<template>
  <section role="tabpanel">
    <h2>关于我</h2>
    <p style="color:var(--muted)">{{ about }}</p>
  </section>
</template>
