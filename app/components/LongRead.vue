<template>
  <nav v-if="headings.length" class="c-long-read" aria-label="Page sections">
    <ul class="c-long-read__list">
      <li
        v-for="(item, i) in headings"
        :key="item.id"
        class="c-long-read__item cursor-pointer"
        :class="{ 'is-active': i === activeIndex }"
        @click="scrollToHeading(item.el)"
      >
        <div class="c-long-read__bar">
          <div
            class="c-long-read__fill"
            :style="{ transform: `scaleY(${getSectionProgress(i)})` }"
          />
        </div>
        <span class="c-long-read__label text-2xs-400">{{ item.text }}</span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const headings = ref([]);
const scrollY = ref(0);
const activeIndex = ref(0);

function findHeadings() {
  const els = Array.from(document.querySelectorAll("[data-long-read-heading]"));
  headings.value = els.map((el, i) => {
    if (!el.id) el.id = `section-${i}`;
    const text =
      el.querySelector(".s-rich-text")?.textContent.trim() ??
      el.textContent.trim();
    return { el, id: el.id, text };
  });
}

function getHeadingTop(el) {
  return el.getBoundingClientRect().top + window.scrollY;
}

function getSectionProgress(i) {
  if (!headings.value.length) return 0;
  const start = getHeadingTop(headings.value[i].el);
  const end =
    i < headings.value.length - 1
      ? getHeadingTop(headings.value[i + 1].el)
      : document.documentElement.scrollHeight;
  return Math.min(1, Math.max(0, (scrollY.value - start) / (end - start)));
}

function onScroll() {
  scrollY.value = window.scrollY;
  const triggerY = window.scrollY + window.innerHeight * 0.25;
  let active = 0;
  for (let i = 0; i < headings.value.length; i++) {
    if (getHeadingTop(headings.value[i].el) <= triggerY) active = i;
  }
  activeIndex.value = active;
}

function scrollToHeading(el) {
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

onMounted(() => {
  findHeadings();
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style lang="postcss">
:where(.c-long-read) {
  position: fixed;
  right: var(--layout-margin);
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;

  & .c-long-read__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  & .c-long-read__item {
    display: flex;
    align-items: flex-start;
    gap: 8px;

    & .c-long-read__label {
      opacity: 0;
      transform: translateX(4px);
      transition:
        opacity 0.2s ease,
        transform 0.2s ease;
      white-space: nowrap;
      color: var(--color-text, #2e2e2e);
      /* Labels are shown to the left of the bar — flip the row */
      order: -1;
    }

    &:hover .c-long-read__label,
    &.is-active .c-long-read__label {
      opacity: 1;
      transform: translateX(0);
    }
  }

  & .c-long-read__bar {
    width: 2px;
    height: 40px;
    background: color-mix(in srgb, currentColor 20%, transparent);
    border-radius: 1px;
    overflow: hidden;
    flex-shrink: 0;
  }

  & .c-long-read__fill {
    width: 100%;
    height: 100%;
    background: currentColor;
    transform-origin: top;
    transform: scaleY(0);
    transition: transform 0.1s linear;
  }
}
</style>
