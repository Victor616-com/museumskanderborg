<script setup lang="ts">
import type { Content } from '@prismicio/client'

defineProps(getSliceComponentProps<Content.RichTextSlice>());
</script>

<template>
  <section class="s-rich-text max-w-8col ml-1col">
    <PrismicRichText :field="slice.primary.content" />
    {{ slice.primary.content }}
  </section>
</template>

<style scoped>


</style>
