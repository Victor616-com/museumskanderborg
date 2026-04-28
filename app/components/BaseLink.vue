<template>
  <div class="c-base-link group">
    <div class="flex gap-2xs items-center">
      <PrismicLink
        :field="link"
        class="text-s-400 text-whiteText transition-all duration-300 group-hover:translate-x-1"
      >
        {{ link?.text || "Read more" }}
      </PrismicLink>
      <IconArrow class="transition-all duration-300 group-hover:-rotate-45" />
    </div>
    <div
      class="w-0 h-1px bg-whiteText transition-all duration-300 group-hover:w-full"
    ></div>
  </div>
</template>

<script setup>
import IconArrow from "~/assets/icons/IconArrow.vue";

const props = defineProps({
  link: { type: Object, required: true },
});
</script>

<style lang="postcss">
:where(.c-base-link) {
  @apply flex flex-col gap-3xs w-fit cursor-pointer;

  & a {
    color: inherit;
    text-decoration: none;
  }
}
</style>
