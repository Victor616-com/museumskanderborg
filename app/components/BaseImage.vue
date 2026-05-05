<template>
  <div class="c-base-image" :class="props.class">
    <NuxtImg
      :src="src"
      :provider="resolvedProvider"
      :alt="altText"
      :width="width"
      :height="height"
      :sizes="sizes"
      :loading="loading"
      :format="resolvedFormat"
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
import { computed } from "vue";

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
  provider: { type: String, default: undefined },
  zoomEffect: { type: Boolean, default: false },
  overlay: { type: Boolean, default: false },
  overlayOpacity: { type: Number, default: 0.3 },
  class: { type: String, default: "" },
});

const isLocal = computed(() => !props.src.startsWith("https"));
const isSvg = computed(() => props.src.toLowerCase().endsWith(".svg"));

// Local files (in /public) and SVGs shouldn't go through the Prismic provider
const resolvedProvider = computed(() => {
  if (props.provider) return props.provider;
  if (isLocal.value) return "ipx";
  return undefined; // falls back to default provider (prismic)
});

// Don't force webp for SVGs — they'd get rasterized
const resolvedFormat = computed(() => (isSvg.value ? undefined : props.format));
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
