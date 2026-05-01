<template>
  <div>
    <NuxtLayout>
      <NuxtPage :transition="pageTransition" />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { gsap } from "gsap";

const pageTransition = {
  css: false,
  mode: "out-in",
  onLeave(el, done) {
    gsap.to(el, {
      x: "-100vw",
      duration: 0.5,
      ease: "power3.inOut",
      onComplete: done,
    });
  },
  onAfterLeave() {
    window.scrollTo({ top: 0 });
  },
  onEnter(el, done) {
    gsap.fromTo(
      el,
      { x: "80px", opacity: 0 },
      { x: 0, opacity: 1, duration: 0.45, ease: "power2.out", onComplete: done },
    );
  },
  onAfterEnter(el) {
    gsap.set(el, { clearProps: "all" });
  },
};
</script>
