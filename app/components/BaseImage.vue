<template>
  <div class="c-base-image" :class="props.class">
    <NuxtImg
      :src="src"
      :alt="altText"
      class="c-base-image__img"
      :class="{ 'c-base-image__img--zoom': zoomEffect }"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  src: { type: String, required: true },
  altText: { type: String, default: "" },
  zoomEffect: { type: Boolean, default: false },
  class: { type: String, default: "" },
});
</script>

<style lang="postcss">
:where(.c-base-image) {
  overflow: hidden;

  & .c-base-image__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  @media (hover: hover) {
    & .c-base-image__img--zoom {
      transition: transform 0.4s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    /* Also zoom when an ancestor `.group` is hovered */
    .group:hover & .c-base-image__img--zoom {
      transform: scale(1.05);
    }
  }
}
</style>
