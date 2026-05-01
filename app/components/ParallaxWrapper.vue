<script setup>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const props = defineProps({
  speed: {
    type: Number,
    default: 50,
  },
  trigger: {
    type: [String, Object, null],
    default: "self",
  },
  start: {
    type: String,
    default: "top bottom",
  },
  end: {
    type: String,
    default: "bottom top",
  },
  scrub: {
    type: [Boolean, Number],
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const wrapperRef = ref(null);
let tween = null;

const resolveTrigger = () => {
  const t = props.trigger;

  if (t === "self") return wrapperRef.value?.firstElementChild;
  if (t === "parent") return wrapperRef.value?.parentElement;
  if (t === null || t === "viewport") return null;

  if (t && typeof t === "object" && "value" in t) {
    return t.value;
  }

  if (t instanceof HTMLElement) return t;

  if (typeof t === "string") return document.querySelector(t);

  return wrapperRef.value?.firstElementChild;
};

onMounted(() => {
  if (props.disabled || !wrapperRef.value) return;

  // Animate the actual rendered child, not the display:contents wrapper
  const target = wrapperRef.value.firstElementChild;
  if (!target) return;

  tween = gsap.fromTo(
    target,
    { yPercent: -props.speed },
    {
      yPercent: props.speed,
      ease: "none",
      scrollTrigger: {
        trigger: resolveTrigger(),
        start: props.start,
        end: props.end,
        scrub: props.scrub,
      },
    },
  );
});

onBeforeUnmount(() => {
  if (tween?.scrollTrigger) tween.scrollTrigger.kill();
  tween?.kill();
});
</script>

<template>
  <div ref="wrapperRef" class="c-parallax-wrapper">
    <slot />
  </div>
</template>

<style lang="postcss">
:where(.c-parallax-wrapper) {
  display: contents;
}
</style>
