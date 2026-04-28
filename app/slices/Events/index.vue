<template>
  <section
    class="c-slice-events"
    @mousemove="onSectionMouseMove"
    @mouseleave="onSectionMouseLeave"
  >
    <div
      class="events-cursor absolute pointer-events-none z-10 rounded-50% flex items-center justify-center select-none"
      :class="isHovering ? 'is-active' : ''"
      :style="{
        left: `${springX}px`,
        top: `${springY}px`,
        backgroundColor: accentColor,
      }"
    >
      <span class="text-whiteText uppercase tracking-widest text-2xs-400"
        >Explore</span
      >
    </div>
    <div class="w-full flex flex-col >=656:flex-row justify-between gap-s">
      <div class="max-w-3col >=656:max-w-2col flex flex-col gap-2xs">
        <div class="bg-text w-140% h-3px"></div>
        <h2>{{ title }}</h2>
      </div>
      <div
        ref="scrollContainer"
        :class="[
          'flex gap-gutter',
          'overflow-x-auto snap-x snap-mandatory events-scroller',
        ]"
        @scroll="onScroll"
      >
        <NuxtLink
          v-for="event in events"
          :key="event.id"
          :to="`/events/${event.uid}`"
          class="event-card group snap-start w-8col >=656:w-5col >=960:w-4col >=1280:w-3col shrink-0 flex flex-col gap-s"
          @mouseenter="onCardEnter"
          @mouseleave="onCardLeave"
        >
          <BaseImage
            :src="event.data.image.url"
            :altText="event.data.image.alt"
            class="event-image"
            :zoom-effect="true"
          />
          <div class="flex flex-col gap-4px">
            <h3 class="text-heading-4 max-w-full">{{ event.data.title }}</h3>
            <p class="text-xs-400 mb-8px text-lightText">
              {{ formatDate(event.data.date) }}
            </p>
            <div class="event-description">
              <PrismicRichText :field="trimRichText(event.data.description)" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="flex gap-2xs justify-end">
      <div
        :class="[
          'w-fit bg-text p-3xs flex justify-center items-center rounded-50% rotate-180 cursor-pointer',
          'duration-300 transition-opacity',
          showPagination.previous ? '' : 'opacity-50 ',
        ]"
        @click="scrollSlide('left')"
        @mousedown.prevent
      >
        <IconArrow />
      </div>
      <div
        :class="[
          'w-fit bg-text p-3xs flex justify-center items-center rounded-50% cursor-pointer',
          'duration-300 transition-opacity',
          showPagination.next ? '' : 'opacity-50 ',
        ]"
        @click="scrollSlide('right')"
        @mousedown.prevent
      >
        <IconArrow />
      </div>
    </div>
  </section>
</template>
<script setup>
import IconArrow from "~/assets/icons/IconArrow.vue";

const { prismic } = usePrismic();
const props = defineProps(getSliceComponentProps());
const title = props.slice.primary.title;

const { client } = usePrismic();

const scrollContainer = ref(null);
const slideValues = ref([]);

const showPagination = ref({
  previous: false,
  next: false,
});

const accentColors = ["#E77239", "#A86062", "#6E43FE", "#5F7C9A", "#EC3828"];
const accentColor = ref(accentColors[0]);
const isHovering = ref(false);
const springX = ref(0);
const springY = ref(0);
let targetX = 0;
let targetY = 0;
let vx = 0;
let vy = 0;
let springRaf = null;

const STIFFNESS = 0.12;
const DAMPING = 0.75;

function springLoop() {
  vx = (vx + (targetX - springX.value) * STIFFNESS) * DAMPING;
  vy = (vy + (targetY - springY.value) * STIFFNESS) * DAMPING;
  springX.value += vx;
  springY.value += vy;
  springRaf = requestAnimationFrame(springLoop);
}

function onSectionMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  targetX = e.clientX - rect.left;
  targetY = e.clientY - rect.top;
}

let leaveTimeout = null;

function onSectionMouseLeave() {
  clearTimeout(leaveTimeout);
  isHovering.value = false;
}

function onCardEnter() {
  clearTimeout(leaveTimeout);
  isHovering.value = true;
  const current = accentColor.value;
  const choices = accentColors.filter((c) => c !== current);
  accentColor.value = choices[Math.floor(Math.random() * choices.length)];
}

function onCardLeave() {
  leaveTimeout = setTimeout(() => {
    isHovering.value = false;
  }, 50);
}

let observer;

onMounted(() => {
  springLoop();
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
  if (springRaf) cancelAnimationFrame(springRaf);
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
// Function for pagination display
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

const { data: events } = await useAsyncData("events", () =>
  client.getAllByType("event", {
    orderings: {
      field: "my.event.date",
      direction: "asc",
    },
    limit: 5,
  }),
);

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function trimRichText(field, limit = 100) {
  if (!field) return [];

  let total = 0;
  const result = [];

  for (const block of field) {
    const remaining = limit - total;
    if (remaining <= 0) break;

    if (block.text.length <= remaining) {
      result.push(block);
      total += block.text.length;
    } else {
      result.push({
        ...block,
        text: block.text.slice(0, remaining).trimEnd() + "…",
        spans: block.spans.filter((s) => s.end <= remaining),
      });
      break;
    }
  }
  return result;
}
</script>
<style lang="postcss">
:where(.c-slice-events) {
  @apply w-full flex flex-col gap-m;
  position: relative;

  & .events-cursor {
    width: 120px;
    height: 120px;
    transform: translate(-50%, -50%) scale(0);
    transition:
      transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
      background-color 0.3s ease;

    @media (hover: hover) {
      &.is-active {
        transform: translate(-50%, -50%) scale(1);
      }
    }
  }

  & .events-scroller {
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
    /* Firefox */
    scrollbar-width: none;
    /* IE / old Edge */
    -ms-overflow-style: none;
  }

  /* Chrome, Safari, modern Edge */
  & .events-scroller::-webkit-scrollbar {
    display: none;
  }

  & .event-description p {
    @apply text-xs-400 text-lightText;
  }

  & .event-image {
    aspect-ratio: 7 / 9;
  }

  & .event-card:nth-child(even) .event-image {
    aspect-ratio: 5 / 4;
  }

  & .event-card {
    text-decoration: none;
    color: inherit;
  }
}
</style>
