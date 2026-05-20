<template>
  <div class="c-accordion-element">
    <div
      class="flex w-full justify-between cursor-pointer hover:px-2 duration-500 ease-in-out group py-xs"
      @click="toggleCollapsed"
    >
      <p v-if="content.title" class="text-whiteText">
        {{ content.title }}
      </p>
      <div
        :class="[
          ' duration-500 ease-in-out shrink-0',
          !collapsed
            ? 'rotate-[45deg] group-hover:rotate-[35deg]'
            : 'group-hover:rotate-[10deg]',
        ]"
      >
        <IconPlus />
      </div>
    </div>
    <div
      :class="[
        'grid duration-500 ease-in-out w-full',
        !collapsed
          ? 'grid-rows-[1fr] opacity-100 py-s pb-l'
          : 'grid-rows-[0fr] opacity-0',
      ]"
    >
      <div class="overflow-hidden">
        <div
          :class="[
            ' text-whiteText pl-2xs >=656:pl-s >=960:pl-1col max-w-11col >=656:max-w-10col >=960:max-w-9col flex flex-col ',
            content.heading ? 'gap-s pt-3xs' : 'gap-0',
          ]"
        >
          <div v-if="content.heading !== null" class="relative">
            <div
              :class="[
                'w-56px h-30px >=960:w-80px >=960:h-40px absolute bottom-40% -left-2',
                accentColor,
              ]"
            ></div>
            <h3 class="text-heading-3 relative">
              {{ content.heading }}
            </h3>
          </div>
          <div class="s-rich-text" :style="{ '--accent-link': accentVar }">
            <PrismicRichText :field="content.content" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import IconPlus from "~/assets/icons/IconPlus.vue";

defineProps({
  content: { type: Object, required: true },
});

const accentColors = [
  { bg: "bg-accent1", var: "var(--color-accent1)" },
  { bg: "bg-accent2", var: "var(--color-accent2)" },
  { bg: "bg-accent3", var: "var(--color-accent3)" },
  { bg: "bg-accent4", var: "var(--color-accent4)" },
  { bg: "bg-accent5", var: "var(--color-accent5)" },
];
const accent = accentColors[Math.floor(Math.random() * accentColors.length)];
const accentColor = accent.bg;
const accentVar = accent.var;

const collapsed = ref(true);

function toggleCollapsed() {
  collapsed.value = !collapsed.value;
}
</script>
<style lang="postcss">
:where(.c-accordion-element) {
  @apply w-full flex flex-col gap-0 border-b-solid border-b-whiteText border-1px;

  & .s-rich-text a {
    color: var(--accent-link);
  }
}
</style>
