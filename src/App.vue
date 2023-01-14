<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/layout/TheHeader.vue'
import Footer from './components/layout/TheFooter.vue'
</script>

<template>
  <Header>
  </Header>
  <div class="content">
    <RouterView />
  </div>
  <Footer></Footer>
</template>

<style scoped>
.content {
  max-width: 1280px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 2rem 0;
}
</style>
