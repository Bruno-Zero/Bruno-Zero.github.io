<script setup>
const gameUrl = '/minecraft/'
</script>

<template>
  <section role="tabpanel">
    <h2>玩 Minecraft 🎮</h2>
    <p style="color:var(--muted); margin-bottom: 14px;">网页版 Minecraft（EaglercraftX 1.8.8），无需下载，存档自动保存在浏览器里。加载约需十几秒，如果画面空白请稍等片刻。</p>
    <a class="play-link mono" :href="gameUrl" target="_blank">全屏开始游戏 →</a>
    <div class="game-frame">
      <iframe :src="gameUrl" loading="lazy" allowfullscreen></iframe>
    </div>
  </section>
</template>
