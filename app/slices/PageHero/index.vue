<template>
  <section class="c-slice-page-hero">
    <div
      class="group relative justify-self-center flex items-end w-12col >=1280:w-10col aspect-ratio-9/16 >=656:aspect-ratio-5/4 >=960:aspect-ratio-16/9"
    >
      <div
        class="absolute top-0 right-0 w-30% aspect-9/5 >=1280:aspect-9/4 translate-x-5% >=1280:translate-x-20% -translate-y-30% bg-accent1 z-10"
      ></div>
      <h1
        class="absolute text-heading-2 >=1440:text-heading-0 right-0 top-10% text-whiteText max-w-5col >=1280:max-w-4col >=1440:max-w-5col >=1536:max-w-4col z-11"
      >
        Øm Monastery Museum
      </h1>
      <div
        v-for="(slide, index) in data"
        :key="slide.image.id"
        class="absolute inset-0 transition-opacity duration-700"
        :class="index === currentIndex ? 'opacity-100' : 'opacity-0'"
      >
        <BaseImage
          :src="slide.image.url"
          :alt-text="slide.image.alt || ''"
          :width="slide.image.dimensions.width"
          :height="slide.image.dimensions.height"
          :overlay="true"
          zoom-effect="true"
          monochrome-effect="true"
          loading="eager"
          class="w-full h-full"
        />
        <div
          :class="[
            'w-full >=656:w-7col >=1280:w-6col >=1440:w-5col absolute bottom-0 left-0 z-10',
            'flex flex-col gap-m',
            'pl-1col pb-l',
          ]"
        >
          <span
            class="s-rich-text text-whiteText flex flex-col gap-xs max-h-30% overflow-hidden"
          >
            <PrismicRichText v-if="slide?.text" :field="slide?.text" />
          </span>
          <BaseLink :link="slide?.link" class="text-whiteText" />
        </div>
      </div>
      <div
        v-if="data.length > 1"
        class="absolute bottom-s left-50% -translate-x-50% flex gap-10px z-11"
      >
        <button
          v-for="(slide, index) in data"
          :key="index"
          :class="[
            ' h-20px rounded-50px bg-textWhite border-none cursor-pointer',
            'transition-all duration-700',
            index === currentIndex ? 'opacity-100 w-50px' : 'opacity-70 w-20px',
          ]"
          :aria-label="`Go to slide ${index + 1}`"
          @click="goTo(index)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps(getSliceComponentProps());
const data = props.slice.primary.slide_show;

const currentIndex = ref(0);
let timer = null;

function goTo(index) {
  currentIndex.value = index;
  resetTimer();
}

function next() {
  currentIndex.value = (currentIndex.value + 1) % data.length;
}

function resetTimer() {
  clearInterval(timer);
  timer = setInterval(next, 60000);
}

onMounted(() => {
  if (data.length > 1) resetTimer();
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style lang="postcss">
:where(.c-slice-page-hero) {
  @apply w-full flex justify-center items-center mt-l;
}

:where(.c-slice-page-hero__bubble) {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.45);
  border: none;
  padding: 0;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;

  &.is-active {
    background-color: white;
    transform: scale(1.3);
  }

  @media (hover: hover) {
    &:hover:not(.is-active) {
      background-color: rgba(255, 255, 255, 0.75);
    }
  }
}
</style>
