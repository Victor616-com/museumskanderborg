<template>
  <div
    v-if="isShowing"
    ref="loaderEl"
    class="fixed inset-0 z-[100] bg-whiteText flex flex-col justify-center pl-margin overflow-hidden"
  >
    <span
      ref="counterEl"
      class="text-heading-0 text-200px text-text tabular-nums z-9999 w-fit"
      >0</span
    >

    <div class="absolute top-0 left-0 right-0 h-3px">
      <div
        ref="progressEl"
        class="h-full bg-text origin-left will-change-transform"
        style="transform: scaleX(0)"
      />
    </div>
  </div>
</template>

<script setup>
import { gsap } from "gsap";

const loaderEl = ref(null);
const counterEl = ref(null);
const progressEl = ref(null);
const isShowing = ref(true);

const hasShownLoader = useState("loader-shown", () => false);

if (hasShownLoader.value) {
  isShowing.value = false;
}

const counter = { value: 0 };
let phase1Done = false;
let contentLoaded = false;

const updateDisplay = () => {
  const rounded = Math.round(counter.value);
  if (counterEl.value) counterEl.value.textContent = rounded;
  if (progressEl.value) {
    progressEl.value.style.transform = `scaleX(${counter.value / 100})`;
  }
};

const exitLoader = () => {
  gsap.to(loaderEl.value, {
    opacity: 0,
    duration: 0.9,
    ease: "power3.inOut",
    delay: 0.2,
    onComplete: () => {
      isShowing.value = false;
      hasShownLoader.value = true;
    },
  });
};

const tryFinish = () => {
  if (phase1Done && contentLoaded) {
    document.documentElement.style.overflow = "";
    gsap.to(counter, {
      value: 100,
      duration: 0.45,
      ease: "power2.inOut",
      onUpdate: updateDisplay,
      onComplete: exitLoader,
    });
  }
};

onMounted(() => {
  if (!isShowing.value) return;

  const nuxtApp = useNuxtApp();
  document.documentElement.style.overflow = "hidden";
  // Phase 1: 0 → 90, eased to feel responsive
  gsap.to(counter, {
    value: 90,
    duration: 1.8,
    ease: "power2.out",
    onUpdate: updateDisplay,
    onComplete: () => {
      phase1Done = true;
      tryFinish();
    },
  });

  // Phase 2: wait for Prismic data + page suspense to resolve
  if (nuxtApp.isHydrating) {
    nuxtApp.hooks.hookOnce("app:suspense:resolve", () => {
      contentLoaded = true;
      tryFinish();
    });
  } else {
    contentLoaded = true;
  }
});
onUnmounted(() => {
  document.documentElement.style.overflow = "";
});
</script>
