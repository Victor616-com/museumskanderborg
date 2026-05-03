<template>
  <section class="c-slice-link">
    <BlockHeading
      :display-block-heading="data.display_block_heading"
      :block-heading="data.block_heading"
    />
    <div class="flex gap-gutter flex-wrap">
      <LinkCard
        v-for="link in linksWithFallbackColor"
        :key="link.link.key"
        :link="link"
        :color="link.fallbackColor"
      />
    </div>
  </section>
</template>
<script setup>
const props = defineProps(getSliceComponentProps());
const data = props.slice.primary;

const accentColors = [
  "var(--color-accent1)",
  "var(--color-accent2)",
  "var(--color-accent3)",
  "var(--color-accent4)",
  "var(--color-accent5)",
];

const linksWithFallbackColor = data.links.map((link, i) => ({
  ...link,
  fallbackColor: accentColors[i % accentColors.length],
}));
</script>
<style lang="postcss">
:where(.c-slice-link) {
  @apply flex flex-col;
}
</style>
