<template>
  <nav :class="['c-navigation', onMenuOpen ? 'py-2xs' : 'py-s']" ref="navEl">
    <NuxtLink
      to="/"
      :class="[
        onMenuOpen ? 'w-4col >=656:w-3col >=960:w-2col' : 'w-6col >=656:w-4col',
        'transition-width duration-400',
      ]"
    >
      <BaseImage src="/Logo.svg" alt="Museum Skanderborg" />
    </NuxtLink>

    <div class="flex gap-xs items-center">
      <BaseLink
        v-for="(link, index) in data.navbar_links"
        class="<=960:hidden"
        :key="index"
        :link="link"
        :icon="false"
        variant="dark"
        size="s"
      />
      <button
        ref="burgerEl"
        class="flex flex-col justify-center gap-6px p-4px bg-transparent border-none cursor-pointer z-50"
        @click="toggleMenu"
        aria-label="Toggle menu"
      >
        <span class="block w-22px h-2px bg-text rounded transform-origin-c" />
        <span class="block w-22px h-2px bg-text rounded transform-origin-c" />
        <span class="block w-22px h-2px bg-text rounded transform-origin-c" />
      </button>
    </div>
  </nav>

  <Teleport to="body">
    <div
      ref="menuEl"
      :class="[
        'c-nav-menu',
        'fixed inset-0 z-40 bg-whiteText flex flex-col >=960:flex-row items-start gap-2col pt-140px >=960:pt-220px px-margin pointer-events-none overflow-hidden',
      ]"
    >
      <!-- Mobile: single merged column -->
      <div class="relative flex-1 min-h-0 flex flex-col w-full >=960:hidden">
        <div
          class="flex flex-col overflow-y-scroll pb-100px gap-m max-h-100% items-start c-nav-col-scroll"
        >
          <BaseLink
            v-for="(link, index) in [
              ...data.navbar_links,
              ...data.column_1,
              ...data.column_2,
            ]"
            :key="index"
            :link="link"
            :icon="false"
            variant="dark"
            size="m"
            class="c-base-link"
          />
        </div>
        <div
          v-if="data.column_1.length || data.column_2.length"
          class="absolute bottom-0 left-0 right-0 h-50 bg-gradient-to-b from-transparent to-white pointer-events-none"
        />
      </div>

      <!-- Desktop: two separate columns -->
      <div
        class="relative hidden >=960:flex >=960:flex-none >=960:max-h-100% flex-col"
      >
        <div
          :class="[
            'flex flex-col overflow-y-scroll  gap-m max-h-100% items-start c-nav-col-scroll',
            data.column_1.length > 5 ? 'pb-100px' : 'pb-0',
          ]"
        >
          <BaseLink
            v-for="(link, index) in data.column_1"
            :key="index"
            :link="link"
            :icon="false"
            variant="dark"
            size="m"
            class="c-base-link"
          />
        </div>
        <div
          v-if="data.column_1.length > 5"
          class="absolute bottom-0 left-0 right-0 h-50 bg-gradient-to-b from-transparent to-white pointer-events-none"
        />
      </div>
      <div
        class="relative hidden >=960:flex >=960:flex-none >=960:max-h-100% flex-col"
      >
        <div
          :class="[
            'flex flex-col overflow-y-scroll  gap-m max-h-100% items-start c-nav-col-scroll',
            data.column_2.length > 5 ? 'pb-100px' : 'pb-0',
          ]"
        >
          <BaseLink
            v-for="(link, index) in data.column_2"
            :key="index"
            :link="link"
            :icon="false"
            variant="dark"
            size="m"
            class="c-base-link"
          />
        </div>
        <div
          v-if="data.column_2.length > 5"
          class="absolute bottom-0 left-0 right-0 h-50 bg-gradient-to-b from-transparent to-white pointer-events-none"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { gsap } from "gsap";

const props = defineProps({
  data: { type: Object, required: true },
});

const navEl = ref(null);
const burgerEl = ref(null);
const menuEl = ref(null);
const isScrolled = ref(false);
const isOpen = ref(false);
const route = useRoute();

let setTop;
let menuTl;

const onMenuOpen = computed(() => !isOpen.value && isScrolled.value);

function burgerCenter() {
  const r = burgerEl.value.getBoundingClientRect();
  return {
    x: Math.round(r.left + r.width / 2),
    y: Math.round(r.top + r.height / 2),
  };
}

function openMenu() {
  menuTl?.kill();
  isOpen.value = true;

  document.documentElement.style.overflow = "hidden";

  const { x, y } = burgerCenter();
  const bars = burgerEl.value.querySelectorAll(".c-burger__bar");
  const links = Array.from(
    menuEl.value.querySelectorAll(".c-base-link"),
  ).filter((el) => el.offsetParent !== null);

  gsap.set(menuEl.value, { pointerEvents: "all" });

  menuTl = gsap
    .timeline()
    .to(bars[0], { y: 8, rotate: 45, duration: 0.3, ease: "power2.inOut" }, 0)
    .to(bars[1], { opacity: 0, duration: 0.15 }, 0)
    .to(bars[2], { y: -8, rotate: -45, duration: 0.3, ease: "power2.inOut" }, 0)
    .fromTo(
      menuEl.value,
      { clipPath: `circle(0px at ${x}px ${y}px)` },
      {
        clipPath: `circle(5000px at ${x}px ${y}px)`,
        duration: 0.8,
        ease: "power3.inOut",
      },
      0,
    )
    .fromTo(
      links,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" },
      0.45,
    );
}

function closeMenu() {
  if (!isOpen.value) return;
  menuTl?.kill();
  isOpen.value = false;

  const { x, y } = burgerCenter();
  const bars = burgerEl.value.querySelectorAll(".c-burger__bar");
  const links = menuEl.value.querySelectorAll(".c-base-link");

  gsap.set(menuEl.value, { pointerEvents: "none" });

  menuTl = gsap
    .timeline({
      onComplete: () => {
        document.documentElement.style.overflow = "";
      },
    })
    .to(
      links,
      { y: -30, opacity: 0, stagger: 0.05, duration: 0.25, ease: "power2.in" },
      0,
    )
    .to(
      menuEl.value,
      {
        clipPath: `circle(0px at ${x}px ${y}px)`,
        duration: 0.65,
        ease: "power3.inOut",
      },
      0.1,
    )
    .to(bars[0], { y: 0, rotate: 0, duration: 0.3, ease: "power2.inOut" }, 0.35)
    .to(bars[1], { opacity: 1, duration: 0.2 }, 0.5)
    .to(
      bars[2],
      { y: 0, rotate: 0, duration: 0.3, ease: "power2.inOut" },
      0.35,
    );
}

function toggleMenu() {
  isOpen.value ? closeMenu() : openMenu();
}

function handleKeydown(e) {
  if (e.key === "Escape") closeMenu();
}

function handleScroll() {
  isScrolled.value = window.scrollY > 0;
  const footer = document.querySelector(".c-footer");
  if (footer && navEl.value) {
    const footerTop = footer.getBoundingClientRect().top;
    const navHeight = navEl.value.offsetHeight;
    setTop(footerTop < navHeight ? footerTop - navHeight : 0);
  }
}

watch(
  () => route.path,
  () => closeMenu(),
);

onMounted(() => {
  setTop = gsap.quickTo(navEl.value, "top", {
    duration: 0.4,
    ease: "power2.out",
  });
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("keydown", handleKeydown);
  document.documentElement.style.overflow = "";
});
</script>

<style lang="postcss">
:where(.c-navigation) {
  @apply w-full px-margin bg-whiteText fixed top-0 left-0 z-50 flex items-center justify-between;
}

.c-nav-menu {
  clip-path: circle(0px at 95% 50px);
  overflow: hidden;
}

.c-nav-menu .c-base-link a {
  @apply text-heading-2 text-text;
}

.c-nav-col-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-type: y mandatory;
  overscroll-behavior-y: none;
}

.c-nav-col-scroll::-webkit-scrollbar {
  display: none;
}

.c-nav-col-scroll .c-base-link {
  scroll-snap-align: start;
}
</style>
