<template>
  <section class="c-slice-rte">
    <BlockHeading
      v-if="data.display_block_heading"
      :block-heading="data.block_heading"
      :display-block-heading="data.display_block_heading"
    />
    <div
      class="s-rich-text max-w-12col >=656:max-w-10col >=960:max-w-8col >=960:ml-1col flex flex-col gap-s"
    >
      <div class="relative">
        <PrismicRichText :field="data.title" />
        <div
          class="w-56px h-30px >=960:w-80px >=960:h-40px bg-accent5 absolute bottom-40% -left-2 -z-2"
        ></div>
      </div>
      <div class="flex flex-col">
        <PrismicRichText :field="data.content" />
      </div>
    </div>
  </section>
</template>
<script setup>
const props = defineProps(getSliceComponentProps());

const data = props.slice.primary;
</script>
<style lang="postcss">
:where(.c-slice-rte) {
  @apply w-full flex flex-col;
}
</style>
