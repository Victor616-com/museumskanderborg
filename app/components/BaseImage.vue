<template>
  <div class="c-base-image" :class="props.class">
    <NuxtImg
      :src="src"
      :alt="altText"
      class="c-base-image__img"
      :class="{ 'c-base-image__img--zoom': zoomEffect }"
    />
    <div
      v-if="overlay"
      class="c-base-image__overlay"
      :style="{ '--overlay-opacity': overlayOpacity }"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  src: { type: String, required: true },
  altText: { type: String, default: "" },
  zoomEffect: { type: Boolean, default: false },
  overlay: { type: Boolean, default: false },
  overlayOpacity: { type: Number, default: 0.3 },
  class: { type: String, default: "" },
});
</script>

<style lang="postcss">
:where(.c-base-image) {
  overflow: hidden;
  position: relative;

  & .c-base-image__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  & .c-base-image__overlay {
    position: absolute;
    inset: 0;
    background-color: black;
    opacity: var(--overlay-opacity, 0.3);
    pointer-events: none;
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
