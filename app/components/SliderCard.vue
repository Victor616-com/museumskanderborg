<template>
  <NuxtLink
    :to="to"
    class="c-slider-card group snap-start w-8col >=656:w-5col >=960:w-4col >=1280:w-3col shrink-0 flex flex-col gap-s"
  >
    <BaseImage :src="imageSrc" :alt-text="imageAlt" :zoom-effect="true" />
    <div class="flex flex-col gap-4px">
      <h3 class="text-heading-4 max-w-full">{{ title }}</h3>
      <p v-if="date" class="text-xs-400 mb-8px text-lightText">{{ date }}</p>
      <div v-if="description" class="slider-card-description">
        <PrismicRichText :field="description" />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  to: { type: String, required: true },
  imageSrc: { type: String, required: true },
  imageAlt: { type: String, default: "" },
  title: { type: String, required: true },
  date: { type: String, default: "" },
  description: { type: Array, default: null },
});
</script>

<style lang="postcss">
:where(.c-slider-card) {
  text-decoration: none;
  color: inherit;

  & .c-base-image {
    aspect-ratio: 7/9;
  }

  &:nth-child(even) .c-base-image {
    aspect-ratio: 5/4;
  }

  & .slider-card-description p {
    @apply text-xs-400 text-lightText;
  }
}
</style>
