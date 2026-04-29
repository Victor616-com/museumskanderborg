<template>
  <div
    v-if="displayBlockHeading"
    class="c-block-heading"
    data-long-read-heading
  >
    <div class="w-full h-1px bg-text"></div>
    <div class="s-rich-text ml-3xs">
      <PrismicRichText :field="blockHeading" />
    </div>
  </div>
</template>
<script setup>
defineProps({
  displayBlockHeading: { type: Boolean, default: false },
  blockHeading: { type: Array, required: true },
});
</script>
<style lang="postcss">
:where(.c-block-heading) {
  @apply w-full flex flex-col gap-xs mb-l;
  & .s-rich-text p {
    @apply text-s-400 text-lightText;
  }
}
</style>
