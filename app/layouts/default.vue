<template>
  <div>
    <slot />
    <ClientOnly v-if="isDev">
      <GridOverlay />
      <PrismicDataInspector />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import GridOverlay from "~/components/DevTools/GridOverlay.vue";
import PrismicDataInspector from "~/components/DevTools/PrismicDataInspector.vue";
const isDev = import.meta.dev;
</script>
