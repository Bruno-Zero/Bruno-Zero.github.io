<script setup>
const contacts = [
  { label: '邮箱', text: 'you@example.com', href: 'mailto:you@example.com' },
  { label: 'GitHub', text: 'github.com/Bruno-Zero', href: 'https://github.com/Bruno-Zero' },
]
</script>

<template>
  <section role="tabpanel">
    <h2>联系我</h2>
    <ul>
      <li v-for="c in contacts" :key="c.label">
        {{ c.label }}：<a :href="c.href">{{ c.text }}</a>
      </li>
    </ul>
  </section>
</template>
