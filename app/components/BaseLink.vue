<template>
  <div :class="['c-base-link group', icon ? 'gap-2xs' : 'gap-0']">
    <div :class="['flex gap-2xs items-center', colorClass]">
      <PrismicLink
        :field="link"
        class="transition-all duration-300"
        :class="[
          {
            'text-2xs-400': size === '2xs',
            'text-s-400': size === 's',
            'text-m-400': size === 'm',
            'group-hover:translate-x-1': icon,
          },
        ]"
      >
        {{ link?.text || "Read more" }}
      </PrismicLink>
      <IconArrow
        v-if="icon"
        :class="[
          'transition-all duration-300 group-hover:-rotate-45 ',
          {
            'w-3 h-3': size === '2xs',
            'w-5 h-5': size === 's',
            'w-7 h-7': size === 'm',
          },
        ]"
      />
    </div>
    <div
      :class="[
        'h-1px transition-all duration-300',
        variant === 'dark' ? 'bg-text' : 'bg-whiteText',
        isActive ? 'w-full' : 'w-0 group-hover:w-full',
      ]"
    ></div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { asLink } from "@prismicio/client";
import IconArrow from "~/assets/icons/IconArrow.vue";

const props = defineProps({
  link: { type: Object, required: true },
  icon: { type: Boolean, default: true },
  variant: {
    type: String,
    default: "light",
    validator: (v) => ["light", "dark"].includes(v),
  },
  size: {
    type: String,
    default: "s",
    validator: (value) => ["2xs", "s", "m"].includes(value),
  },
});

const prismic = usePrismic();
const route = useRoute();

const requestURL = useRequestURL();

const isActive = computed(() => {
  const href = asLink(props.link, { linkResolver: prismic.linkResolver });
  if (!href) return false;

  let pathname;
  if (href.startsWith("http")) {
    try {
      const url = new URL(href);
      if (url.origin !== requestURL.origin) return false;
      pathname = url.pathname;
    } catch {
      return false;
    }
  } else {
    pathname = href;
  }

  const normalize = (p) =>
    p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
  return normalize(route.path) === normalize(pathname);
});

const colorClass = computed(() =>
  props.variant === "dark" ? "text-text" : "text-whiteText",
);
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
