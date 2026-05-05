<template>
  <div>
    <!--
      -->
    <LoadingScreen />
    <Navigation :data="settings.data" />
    <main class="mt-200px">
      <slot />
    </main>
    <Footer :data="settings.data" />
    <ClientOnly v-if="isDev">
      <GridOverlay />
      <PrismicDataInspector />
    </ClientOnly>
  </div>
</template>

<script setup>
import GridOverlay from "~/components/DevTools/GridOverlay.vue";
import PrismicDataInspector from "~/components/DevTools/PrismicDataInspector.vue";
const isDev = import.meta.dev;

const prismic = usePrismic();
const { data: settings } = await useAsyncData("settings", () =>
  prismic.client.getSingle("settings"),
);
</script>
