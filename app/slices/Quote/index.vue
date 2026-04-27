<template>
  <section class="max-w-12col flex flex-row justify-between">
    <div class="flex flex-col max-w-7col">
      <div class="flex flex-row gap-xs">
        <span class="relative">
          <p class="text-128px line-height-70%">“</p>
          <div
            class="w-40px h-40px bg-accent4 absolute top-2 left-2 -z-2"
          ></div>
        </span>
        <div class="flex flex-col gap-m">
          <p class="text-2xl-700">{{ quote.text }}</p>
          <p class="">{{ quote.author }}</p>
        </div>
      </div>
    </div>
    <div class="w-4col relative">
      <NuxtImg
        :src="quote.image.url"
        :alt="quote.image.alt"
        class="w-full aspect-ratio-5/6 object-cover"
      />
      <div
        class="w-190px h-190px bg-accent1 absolute -top-10 -left-10 -z-2"
      ></div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps(getSliceComponentProps());

const quote = props.slice.primary;
</script>
<style></style>
