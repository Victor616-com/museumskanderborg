<script setup>
import { gsap } from "gsap";
import IconArrow from "~/assets/icons/IconArrow.vue";

const props = defineProps(getSliceComponentProps());
const data = props.slice.primary;

const isOpen = ref(false);
const activeIndex = ref(0);
const overlayEl = ref(null);
const lightboxImageEl = ref(null);

const activeImage = computed(() => data.images[activeIndex.value]?.image);

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

function openLightbox(index) {
  activeIndex.value = index;
  isOpen.value = true;
  nextTick(() => {
    gsap.fromTo(
      overlayEl.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" },
    );
    gsap.fromTo(
      lightboxImageEl.value,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
    );
  });
}

function closeLightbox() {
  gsap.to(overlayEl.value, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      isOpen.value = false;
    },
  });
}

function navigate(dir) {
  const total = data.images.length;
  gsap.to(lightboxImageEl.value, {
    opacity: 0,
    x: dir * -50,
    duration: 0.2,
    ease: "power2.in",
    onComplete: () => {
      activeIndex.value = (activeIndex.value + dir + total) % total;
      nextTick(() => {
        gsap.fromTo(
          lightboxImageEl.value,
          { opacity: 0, x: dir * 50 },
          { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" },
        );
      });
    },
  });
}

function onKeydown(e) {
  if (!isOpen.value) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") navigate(-1);
  if (e.key === "ArrowRight") navigate(1);
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
  springLoop();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  if (springRaf) cancelAnimationFrame(springRaf);
});
</script>

<template>
  <section
    class="c-slice-image-slider"
    @mousemove="onSectionMouseMove"
    @mouseleave="onSectionMouseLeave"
  >
    <div
      class="expand-cursor absolute pointer-events-none z-10 rounded-50% flex items-center justify-center select-none"
      :class="isHovering ? 'is-active' : ''"
      :style="{
        left: `${springX}px`,
        top: `${springY}px`,
        backgroundColor: accentColor,
      }"
    >
      <span class="text-whiteText uppercase tracking-widest text-2xs-400"
        >Expand</span
      >
    </div>

    <BlockHeading
      :display-block-heading="data.display_block_heading"
      :block-heading="data.block_heading"
    />
    <BaseSlider>
      <div
        v-for="(image, index) in data.images"
        :key="image?.image?.id"
        class="snap-start shrink-0 w-8col >=656:w-5col >=960:w-4col cursor-pointer"
        @click="openLightbox(index)"
        @mouseenter="onCardEnter"
        @mouseleave="onCardLeave"
      >
        <BaseImage :src="image.image.url" :alt-text="image.image.alt || ''" />
      </div>
    </BaseSlider>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="overlayEl"
        class="c-slice-image-slider__lightbox fixed inset-0 z-200 bg-background px-margin py-l"
      >
        <div
          ref="lightboxImageEl"
          class="c-slice-image-slider__image-wrapper relative z-1 flex items-center justify-center"
        >
          <NuxtImg
            :src="data.images[activeIndex]?.image?.url"
            :alt="data.images[activeIndex]?.image?.alt || ''"
            class="c-slice-image-slider__image w-auto h-auto object-contain z-202"
          />

          <span
            class="c-slice-image-slider__counter absolute z-201 text-text text-heading-2 tabular-nums"
          >
            {{ activeIndex + 1 }} / {{ data.images.length }}
          </span>
        </div>

        <div
          class="c-slice-image-slider__close z-1 w-fit bg-text p-3xs flex items-center justify-center rounded-50% cursor-pointer select-none"
          @click="closeLightbox"
          @mousedown.prevent
        >
          <span
            class="w-4 h-4 flex items-center justify-center text-whiteText leading-none"
            >✕</span
          >
        </div>

        <div class="c-slice-image-slider__arrows flex gap-3xs">
          <div
            :class="[
              'w-fit bg-text p-3xs flex justify-center items-center rounded-50% rotate-180 cursor-pointer',
              'duration-300 transition-opacity',
            ]"
            @click="navigate(-1)"
            @mousedown.prevent
          >
            <IconArrow class="w-4 h-4 text-whiteText" />
          </div>
          <div
            :class="[
              'w-fit bg-text p-3xs flex justify-center items-center rounded-50% cursor-pointer',
              'duration-300 transition-opacity',
            ]"
            @click="navigate(1)"
            @mousedown.prevent
          >
            <IconArrow class="w-4 h-4 text-whiteText" />
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style lang="postcss">
:where(.c-slice-image-slider) {
  @apply flex flex-col w-full;
  position: relative;

  & .expand-cursor {
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

  & .c-base-slider__track {
    align-items: end;
    @media (max-width: 960px) {
      width: calc(
        12 * var(--layout-column) + 11 * var(--layout-gutter) +
          var(--layout-margin)
      );
    }
  }
}

/* Mobile (default): 3 rows, single column. Close on top, image fills middle, arrows on bottom. */
:where(.c-slice-image-slider__lightbox) {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "close"
    "image"
    "arrows";
  gap: var(--layout-gutter);

  @media (min-width: 656px) {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      "image close"
      "image arrows";
  }
}

:where(.c-slice-image-slider__image-wrapper) {
  grid-area: image;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;

  @media (min-width: 656px) {
    width: auto;
    height: auto;
    justify-self: start;
    align-self: center;
  }
}

:where(.c-slice-image-slider__image) {
  max-width: 100%;
  max-height: 100%;

  @media (min-width: 656px) {
    max-width: calc(8 * var(--layout-column) + 7 * var(--layout-gutter));
    max-height: 90vh;
  }
}

:where(.c-slice-image-slider__counter) {
  left: 0;
  top: calc(100% + 0.5rem);

  @media (min-width: 656px) {
    left: auto;
    right: -7rem;
    top: 1.5rem;
  }
}

:where(.c-slice-image-slider__close) {
  grid-area: close;
  justify-self: end;

  @media (min-width: 656px) {
    align-self: start;
  }
}

:where(.c-slice-image-slider__arrows) {
  grid-area: arrows;
  justify-self: end;

  @media (min-width: 656px) {
    align-self: end;
  }
}
</style>
