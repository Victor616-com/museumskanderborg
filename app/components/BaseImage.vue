<template>
  <div class="c-base-image" :class="props.class">
    <NuxtImg
      :src="src"
      :alt="altText"
      :width="width"
      :height="height"
      :sizes="sizes"
      :loading="loading"
      :format="format"
      :quality="quality"
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
  width: { type: [Number, String], default: undefined },
  height: { type: [Number, String], default: undefined },
  sizes: {
    type: String,
    default:
      "bp375:100vw bp656:100vw bp960:100vw bp1280:100vw bp1440:100vw bp1536:100vw bp1920:100vw bp2560:2560px",
  },
  loading: { type: String, default: "lazy" },
  format: { type: String, default: "webp" },
  quality: { type: [Number, String], default: 80 },
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
