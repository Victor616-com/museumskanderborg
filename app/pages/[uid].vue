<script setup lang="ts">
import { asText } from "@prismicio/client";
import { components } from "~/slices";

const { client } = usePrismic();
const route = useRoute();
const { data: page } = await useAsyncData(route.params.uid as string, () =>
  client.getByUID("page", route.params.uid as string),
);

useHead({
  title: asText(page.value?.data.title),
});
</script>

<template>
  <main class="mt-70 mb-100 flex flex-col gap-xl">
    <SliceZone :slices="page?.data.slices ?? []" :components="components" />
  </main>
</template>
