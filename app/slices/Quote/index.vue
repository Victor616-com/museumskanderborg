<template>
  <section
    class="max-w-12col flex flex-col-reverse >=656:flex-row justify-between gap-s"
  >
    <div class="flex flex-col max-w-12col >=656:max-w-7col">
      <div class="flex flex-row gap-xs">
        <span class="relative">
          <p class="text-90px >=960:text-128px line-height-70%">“</p>
          <div
            class="h-30px w-30px >=960:w-40px >=960:h-40px bg-accent4 absolute top-2 left-2 -z-2"
          ></div>
        </span>
        <div class="flex flex-col gap-s >=656:gap-m">
          <p class=">=1280:text-2xl-700 >=960:text-xl-700 text-s-700">
            {{ quote.text }}
          </p>
          <p class="">{{ quote.author }}</p>
        </div>
      </div>
    </div>
    <div class="w-8col >=656:w-4col relative h-fit ml-1col >=656:ml-0">
      <NuxtImg
        :src="quote.image.url"
        :alt="quote.image.alt"
        class="w-full aspect-ratio-6/7 object-cover"
      />
      <div
        class="w-40% aspect-square bg-accent1 absolute -top-10% -left-10% -z-2"
      ></div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps(getSliceComponentProps());

const quote = props.slice.primary;
</script>
<style></style>
