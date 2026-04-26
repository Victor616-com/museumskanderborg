<template>
  <div>
    <slot />
    <ClientOnly v-if="isDev">
      <GridOverlay />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import GridOverlay from '~/components/DevTools/GridOverlay.vue'
const isDev = import.meta.dev;
</script>