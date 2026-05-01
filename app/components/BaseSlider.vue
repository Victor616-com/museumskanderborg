<template>
  <div class="c-base-slider flex flex-col gap-xs">
    <div
      ref="scrollContainer"
      class="c-base-slider__track flex gap-gutter overflow-x-auto snap-x snap-mandatory"
      @scroll="onScroll"
    >
      <slot />
    </div>
    <div class="flex gap-2xs justify-end">
      <div
        :class="[
          'w-fit bg-text p-3xs flex justify-center items-center rounded-50% rotate-180',
          'duration-300 transition-opacity',
          showPagination.previous ? 'cursor-pointer' : 'opacity-50',
        ]"
        @click="scrollSlide('left')"
        @mousedown.prevent
      >
        <IconArrow class="w-4 h-4 text-whiteText" />
      </div>
      <div
        :class="[
          'w-fit bg-text p-3xs flex justify-center items-center rounded-50% ',
          'duration-300 transition-opacity',
          showPagination.next ? 'cursor-pointer' : 'opacity-50 cursor-default',
        ]"
        @click="scrollSlide('right')"
        @mousedown.prevent
      >
        <IconArrow class="w-4 h-4 text-whiteText" />
      </div>
    </div>
  </div>
</template>

<script setup>
import IconArrow from "~/assets/icons/IconArrow.vue";

const scrollContainer = ref(null);
const slideValues = ref([]);
const showPagination = ref({ previous: false, next: false });

let observer;

onMounted(() => {
  onScroll();
  getSlides();
  observer = new ResizeObserver(() => {
    requestAnimationFrame(() => {
      onScroll();
      getSlides();
    });
  });
  observer.observe(scrollContainer.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

function getSlides() {
  const el = scrollContainer.value;
  if (!el) return;
  const containerLeft = el.getBoundingClientRect().left;
  slideValues.value = Array.from(el.children).map((slide) => ({
    offsetLeft:
      slide.getBoundingClientRect().left - containerLeft + el.scrollLeft,
    offsetWidth: slide.offsetWidth,
  }));
}

function onScroll() {
  const el = scrollContainer.value;
  if (!el) return;
  showPagination.value = {
    previous: el.scrollLeft > 0,
    next: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
  };
}

function scrollSlide(direction) {
  const el = scrollContainer.value;
  if (!el) return;
  const current = el.scrollLeft;
  if (direction === "right") {
    const next = slideValues.value.find((s) => s.offsetLeft > current + 1);
    if (next) el.scrollTo({ left: next.offsetLeft, behavior: "smooth" });
  } else {
    const prev = [...slideValues.value]
      .reverse()
      .find((s) => s.offsetLeft < current - 1);
    if (prev) el.scrollTo({ left: prev.offsetLeft, behavior: "smooth" });
  }
}
</script>

<style lang="postcss">
:where(.c-base-slider) {
  & .c-base-slider__track {
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
