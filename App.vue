<script setup>
import { useRoute } from 'vue-router'
import { RouterView } from 'vue-router'
import Nav from './components/Nav.vue'

const route = useRoute()
</script>

<template>
  <header>
    <div class="wrapper font-poppins">
      <!-- Hide Nav if the current path starts with /dashboard -->
      <Nav v-if="!route.path.startsWith('/dashboard')" />
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
/* Optional styles */
</style>
