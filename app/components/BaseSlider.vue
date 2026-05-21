<template>
  <div class="c-base-slider">
    <div
      ref="scrollContainer"
      :class="[
        'c-base-slider__track flex gap-gutter overflow-x-auto snap-x snap-mandatory',
        isDragging ? 'cursor-grabbing select-none' : 'cursor-grab',
      ]"
      @scroll="onScroll"
      @mousedown="onMouseDown"
      @click.capture="onClickCapture"
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

// Drag state
const isDragging = ref(false);
const hasDragged = ref(false);
let dragStartX = 0;
let dragStartScrollLeft = 0;
const DRAG_THRESHOLD = 5;

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
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
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

function onMouseDown(e) {
  if (e.button !== 0) return;
  e.preventDefault();
  isDragging.value = true;
  hasDragged.value = false;
  dragStartX = e.clientX;
  dragStartScrollLeft = scrollContainer.value.scrollLeft;
  scrollContainer.value.style.scrollSnapType = "none";
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(e) {
  if (!isDragging.value) return;
  const walk = e.clientX - dragStartX;
  if (Math.abs(walk) > DRAG_THRESHOLD) hasDragged.value = true;
  scrollContainer.value.scrollLeft = dragStartScrollLeft - walk;
}

function onMouseUp() {
  if (!isDragging.value) return;
  isDragging.value = false;
  scrollContainer.value.style.scrollSnapType = "";
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
  if (hasDragged.value) snapToNearest();
}

function onClickCapture(e) {
  if (hasDragged.value) {
    e.stopPropagation();
    e.preventDefault();
    hasDragged.value = false;
  }
}

function snapToNearest() {
  const el = scrollContainer.value;
  const current = el.scrollLeft;
  let nearest = slideValues.value[0];
  let minDist = Infinity;
  for (const slide of slideValues.value) {
    const dist = Math.abs(slide.offsetLeft - current);
    if (dist < minDist) {
      minDist = dist;
      nearest = slide;
    }
  }
  if (nearest) el.scrollTo({ left: nearest.offsetLeft, behavior: "smooth" });
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
  @apply flex flex-col gap-xs;
  & .c-base-slider__track {
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
    padding-right: var(--layout-margin);
    margin-left: auto;
    width: calc(
      9 * var(--layout-column) + 8 * var(--layout-gutter) + var(--layout-margin)
    );
    margin-right: calc(-1 * var(--layout-margin));

    @media (max-width: 657px) {
      width: calc(
        12 * var(--layout-column) + 11 * var(--layout-gutter) +
          var(--layout-margin)
      );
    }
  }
}
</style>
