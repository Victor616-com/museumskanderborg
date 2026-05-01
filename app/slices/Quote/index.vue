<template>
  <section class="c-slice-quote">
    <BlockHeading
      v-if="quote.display_block_heading"
      :block-heading="quote.block_heading"
      :display-block-heading="quote.display_block_heading"
    />
    <div
      class="max-w-12col flex flex-col-reverse >=656:flex-row justify-between gap-s"
    >
      <div class="flex flex-col max-w-12col >=656:max-w-7col >=656:pt-s">
        <div class="flex flex-row gap-xs">
          <span class="relative" ref="qoutes">
            <p class="text-90px >=960:text-128px line-height-70%">“</p>
            <ParallaxWrapper :trigger="qoutes" :speed="5">
              <div
                class="h-30px w-30px >=960:w-40px >=960:h-40px bg-accent4 absolute top-2 left-2 -z-2"
              ></div>
            </ParallaxWrapper>
          </span>
          <div class="flex flex-col gap-s >=656:gap-m">
            <p class=">=1280:text-2xl-700 >=960:text-xl-700 text-l-700">
              {{ quote.text }}
            </p>
            <p class="">{{ quote.author }}</p>
          </div>
        </div>
      </div>
      <div class="w-8col >=656:w-4col relative h-fit ml-1col >=656:ml-0">
        <NuxtImg
          ref="image"
          :src="quote.image.url"
          :alt="quote.image.alt"
          class="w-full aspect-ratio-6/7 object-cover"
        />
        <ParallaxWrapper :trigger="image" :speed="5">
          <div
            class="w-40% aspect-square bg-accent1 absolute -top-10% -left-10% -z-2"
          ></div>
        </ParallaxWrapper>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps(getSliceComponentProps());

const quote = props.slice.primary;

onMounted(() => {
  console.log("Quote slice data:", quote);
});
</script>
<style lang="postcss">
:where(.c-slice-quote) {
  @apply flex flex-col;
}
</style>
