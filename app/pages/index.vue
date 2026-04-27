<script setup lang="ts">
import { asText } from "@prismicio/client";
import { components } from "~/slices";

const { client } = usePrismic();
const { data: page } = await useAsyncData("index", () =>
  client.getByUID("page", "home"),
);

useHead({
  title: asText(page.value?.data.title),
});
</script>

<template>
  <template>
    <main class="mt-10 mb-100 flex flex-col gap-xl">
      <SliceZone :slices="page?.data.slices ?? []" :components="components" />
    </main>
  </template>
</template>
