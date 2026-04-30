<template>
  <div :class="['c-base-link group', gapClass]">
    <div class="flex gap-2xs items-center">
      <PrismicLink
        :field="link"
        class="text-whiteText transition-all duration-300 group-hover:translate-x-1"
        :class="sizeClass"
      >
        {{ link?.text || "Read more" }}
      </PrismicLink>
      <IconArrow
        v-if="icon"
        class="transition-all duration-300 group-hover:-rotate-45"
      />
    </div>
    <div
      class="w-0 h-1px bg-whiteText transition-all duration-300 group-hover:w-full"
    ></div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import IconArrow from "~/assets/icons/IconArrow.vue";

const props = defineProps({
  link: { type: Object, required: true },
  icon: { type: Boolean, default: true },
  size: {
    type: String,
    default: "s",
    validator: (value) => ["2xs", "s", "m"].includes(value),
  },
});

const sizeClass = computed(() => {
  const sizes = {
    "2xs": "text-2xs-400",
    s: "text-s-400",
    m: "text-m-400",
  };
  return sizes[props.size];
});

const gapClass = computed(() => {
  const gaps = {
    "2xs": "gap-6px",
    s: "gap-2xs",
    m: "gap-3xs",
  };
  return gaps[props.size];
});
</script>

<style lang="postcss">
:where(.c-base-link) {
  @apply flex flex-col w-fit cursor-pointer;

  & a {
    color: inherit;
    text-decoration: none;
  }
}
</style>
