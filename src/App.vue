<template>
  <div class="app-container">
    <router-view />
    <TabBar />
  </div>
</template>

<script setup>
import TabBar from '@/components/TabBar.vue'
</script>

<style lang="scss">
.app-container {
  min-height: 100vh;
  padding-bottom: 50px;
}
</style> 