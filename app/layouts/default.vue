<template>
  <div>
    <!--
      -->
    <LoadingScreen />
    <Navigation :data="settings.data" />
    <main class="">
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

useSeoMeta({
  title: settings.value?.data.site_title,
  ogTitle: settings.value?.data.site_title,
  description: settings.value?.data.meta_description,
  ogDescription: settings.value?.data.meta_description,
});
</script>
