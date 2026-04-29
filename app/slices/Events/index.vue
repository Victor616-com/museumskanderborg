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
      <BaseSlider class="events-slider">
        <SliderCard
          v-for="event in events"
          :key="event.id"
          :to="`/events/${event.uid}`"
          :image-src="event.data.image.url"
          :image-alt="event.data.image.alt"
          :title="event.data.title"
          :date="formatDate(event.data.date)"
          :description="trimRichText(event.data.description)"
          @mouseenter="onCardEnter"
          @mouseleave="onCardLeave"
        />
      </BaseSlider>
    </div>
  </section>
</template>

<script setup>
const props = defineProps(getSliceComponentProps());
const title = props.slice.primary.title;

const { client } = usePrismic();

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

onMounted(() => {
  springLoop();
});

onBeforeUnmount(() => {
  if (springRaf) cancelAnimationFrame(springRaf);
});

const { data: events } = await useAsyncData("event", () =>
  client.getAllByType("event", {
    orderings: { field: "my.event.date", direction: "asc" },
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

  & .events-slider .c-base-slider__track {
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
