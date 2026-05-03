<template>
  <PrismicLink
    :field="link.link"
    class="c-link-card"
    @mouseenter="runAnimation"
    @mouseleave="resetAnimation"
  >
    <div
      class="svg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="2010"
        height="2012"
        viewBox="0 0 2010 2012"
        fill="none"
      >
        <path
          ref="path"
          d="M1934.16 1080.87C1584.5 1289.12 1008.74 2222.85 704.89 1849.11C496.247 1592.48 1703.34 1284.8 1608.17 945.833C1484.78 506.366 852.982 1653.65 626.001 1397.67C399.02 1141.7 788.682 974.777 1059.5 887.097C1255.8 823.544 1609.74 346.957 1151.04 386.14C923.738 405.558 220.865 1548.42 82.2532 1124.71C-42.1993 744.291 1492.91 198.421 839.918 75.0134"
          :stroke="color"
          stroke-width="70"
          stroke-linecap="round"
        />
      </svg>
    </div>
    <BaseImage
      v-if="link.image"
      :src="link?.image?.url"
      :alt="link?.image?.alt"
      class="absolute inset-0 w-full h-full object-cover -z-100 pointer-events-none"
      zoomEffect
      overlay
    />
    <div class="flex items-center justify-between gap-2xs w-full">
      <h3
        ref="title"
        class="text-heading-3 text-whiteText underline-none decoration-none z-1"
      >
        {{ link?.link?.text }}
      </h3>
      <IconArrow ref="arrow" class="text-whiteText w-7 h-7 z-1" />
    </div>
  </PrismicLink>
</template>

<script setup>
import gsap from "gsap";
import IconArrow from "~/assets/icons/IconArrow.vue";

const props = defineProps({
  link: { type: Object, required: true },
  color: { type: String, required: true },
});

const path = ref(null);
const title = ref(null);
const arrow = ref(null);
let tl = null;

onMounted(() => {
  if (!path.value) return;
  const length = path.value.getTotalLength();
  path.value.style.strokeDasharray = length;
  path.value.style.strokeDashoffset = length;
  path.value.style.visibility = "visible";
});

onUnmounted(() => {
  if (tl) tl.kill();
});

function getArrowEl() {
  // IconArrow is a component — resolve to its root DOM node
  return arrow.value?.$el ?? arrow.value;
}

function runAnimation() {
  if (!path.value) return;
  if (tl) tl.kill();
  tl = gsap.timeline();

  tl.to(
    path.value,
    {
      strokeDashoffset: 0,
      attr: { "stroke-width": 700 },
      duration: 1.5,
      ease: "power2.out",
    },
    0,
  );

  tl.to(
    title.value,
    {
      x: 8,
      duration: 0.5,
      ease: "power2.out",
    },
    0,
  );

  tl.to(
    getArrowEl(),
    {
      rotate: -45,
      duration: 0.5,
      ease: "power2.out",
    },
    0,
  );
}

function resetAnimation() {
  if (!path.value) return;
  if (tl) tl.kill();
  tl = gsap.timeline();

  tl.to(
    path.value,
    {
      strokeDashoffset: path.value.getTotalLength(),
      attr: { "stroke-width": 70 },
      duration: 0.8,
      ease: "power2.inOut",
    },
    0,
  );

  tl.to(
    title.value,
    {
      x: 0,
      duration: 0.5,
      ease: "power2.inOut",
    },
    0,
  );

  tl.to(
    getArrowEl(),
    {
      rotate: 0,
      duration: 0.5,
      ease: "power2.inOut",
    },
    0,
  );
}
</script>

<style lang="postcss">
:where(.c-link-card) {
  @apply relative w-full >=656:w-6col >=960:w-4col aspect-460/540 flex flex-col justify-end p-xs no-underline overflow-hidden cursor-pointer;

  & .svg {
    width: 100%;
    height: 100%;
  }
  & .svg svg {
    width: 100%;
    height: 100%;
    scale: 1.9;
  }
  & .svg svg path {
    stroke-dashoffset: 1;
    stroke-dasharray: 1;
    visibility: hidden;
  }
}
</style>
