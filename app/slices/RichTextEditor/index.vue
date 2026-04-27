<script setup lang="ts">
import type { Content } from "@prismicio/client";

defineProps(getSliceComponentProps<Content.RichTextSlice>());
</script>

<template>
  <section
    class="s-rich-text max-w-12col >=656:max-w-10col >=960:max-w-8col >=960:ml-1col flex flex-col gap-s"
  >
    <div class="relative">
      <PrismicRichText :field="slice.primary.title" />
      <div
        class="w-56px h-30px >=960:w-80px >=960:h-40px bg-accent5 absolute bottom-40% -left-2 -z-2"
      ></div>
    </div>
    <div class="flex flex-col">
      <PrismicRichText :field="slice.primary.content" />
    </div>
  </section>
</template>

<style scoped></style>
