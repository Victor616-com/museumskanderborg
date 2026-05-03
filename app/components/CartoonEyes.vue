<template>
  <div ref="containerRef" class="cartoon-eyes" :style="containerStyle">
    <div
      v-for="(eye, i) in eyes"
      :key="i"
      :ref="(el) => (eyeRefs[i] = el)"
      class="eye"
    >
      <div class="eye__white">
        <div :ref="(el) => (pupilRefs[i] = el)" class="eye__pupil"></div>
        <div :ref="(el) => (lidRefs[i] = el)" class="eye__lid" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import gsap from "gsap";

const props = defineProps({
  // Distance between the centers of the two eyes (px)
  spacing: { type: Number, default: 140 },
  // Diameter of each eye (px)
  size: { type: Number, default: 110 },
  // How far the pupil can travel from center, as a fraction of eye radius
  pupilTravel: { type: Number, default: 0.45 },
  // Smoothing duration for pupil follow (seconds)
  followDuration: { type: Number, default: 0.4 },
});

const eyes = [0, 1];
const containerRef = ref(null);
const eyeRefs = ref([]);
const pupilRefs = ref([]);
const lidRefs = ref([]);

const containerStyle = computed(() => ({
  "--eye-size": `${props.size}px`,
  "--eye-spacing": `${props.spacing}px`,
  "--pupil-size": `${props.size * 0.42}px`,
  "--highlight-size": `${props.size * 0.14}px`,
}));

let pupilTweens = [];
let blinkTimeline = null;
let blinkTimeout = null;
let mouseHandler = null;

const scheduleBlink = () => {
  // Random interval between 2.5s and 6s
  const delay = 2500 + Math.random() * 3500;
  blinkTimeout = setTimeout(() => {
    if (!lidRefs.value[0] || !lidRefs.value[1]) return;
    blinkTimeline = gsap.timeline({ onComplete: scheduleBlink });
    blinkTimeline
      .to(lidRefs.value, {
        scaleY: 1,
        duration: 0.08,
        ease: "power2.in",
        transformOrigin: "top center",
      })
      .to(lidRefs.value, {
        scaleY: 0,
        duration: 0.18,
        ease: "power2.out",
        transformOrigin: "top center",
      });
  }, delay);
};

onMounted(() => {
  // Initialize lids closed-up (scaleY 0 = open, scaleY 1 = covers the eye)
  gsap.set(lidRefs.value, { scaleY: 0, transformOrigin: "top center" });

  // Create a quickTo for each pupil — this is GSAP's recommended pattern
  // for smoothly following a moving target like the cursor.
  pupilTweens = pupilRefs.value.flatMap((el) => {
    if (!el) return [];
    return [
      gsap.quickTo(el, "x", { duration: props.followDuration, ease: "power3" }),
      gsap.quickTo(el, "y", { duration: props.followDuration, ease: "power3" }),
    ];
  });

  mouseHandler = (e) => {
    const eyeEls = eyeRefs.value;
    if (!eyeEls[0] || !eyeEls[1]) return;

    eyeEls.forEach((eyeEl, i) => {
      const rect = eyeEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const angle = Math.atan2(dy, dx);
      // Travel scales with distance but caps at maxRadius
      const maxRadius = (rect.width / 2) * props.pupilTravel;
      const distance = Math.min(Math.hypot(dx, dy) / 4, maxRadius);
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      // pupilTweens layout: [eye0.x, eye0.y, eye1.x, eye1.y]
      pupilTweens[i * 2]?.(x);
      pupilTweens[i * 2 + 1]?.(y);
    });
  };

  window.addEventListener("mousemove", mouseHandler);
  scheduleBlink();
});

onBeforeUnmount(() => {
  if (mouseHandler) window.removeEventListener("mousemove", mouseHandler);
  if (blinkTimeout) clearTimeout(blinkTimeout);
  if (blinkTimeline) blinkTimeline.kill();
  pupilTweens = [];
});
</script>

<style scoped>
.cartoon-eyes {
  display: inline-flex;
  gap: calc(var(--eye-spacing) - var(--eye-size));
  align-items: center;
  justify-content: center;
}

.eye {
  width: var(--eye-size);
  height: var(--eye-size);
  position: relative;
}

.eye__white {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: white;
  border: 4px solid #1a1a1a;
  overflow: hidden;
}

.eye__pupil {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--pupil-size);
  height: var(--pupil-size);
  margin-top: calc(var(--pupil-size) / -2);
  margin-left: calc(var(--pupil-size) / -2);
  border-radius: 50%;
  background: radial-gradient(circle at 50% 50%, #1a1a1a 55%, #000 100%);
  will-change: transform;
}

.eye__lid {
  position: absolute;
  inset: -2px;
  background: #1a1a1a;
  transform: scaleY(0);
  transform-origin: top center;
  will-change: transform;
}
</style>
