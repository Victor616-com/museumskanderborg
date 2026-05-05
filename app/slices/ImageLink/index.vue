<template>
  <section class="c-slice-image-link">
    <div class="image-wrapper hidden >=656:block">
      <div class="image-container">
        <BaseImage
          :src="data.image.url"
          :alt="data.image.alt"
          sizes="bp1280:100vw"
          quality="100"
          class="object-cover aspect-9/7 >=1280:aspect-[9/5]"
        />
      </div>
      <div
        class="absolute top-20% right-margin min-w-4col max-w-6col flex flex-col gap-3xs"
      >
        <div class="w-full h-2px bg-whiteText"></div>
        <h2 class="text-whiteText relative">{{ data.title }}</h2>
      </div>
      <div
        class="absolute top-60% >=1280:top-70% right-margin min-w-4col max-w-8col >=1280:max-w-5col aspect-[16/9] bg-accent4 px-xs pt-m pb-m flex flex-col gap-s"
      >
        <div class="flex flex-col gap-xs s-rich-text text-whiteText">
          <PrismicRichText :field="data.text" />
        </div>
        <BaseLink :link="data.link" />
      </div>
    </div>
    <div
      class=">=656:hidden card-wrapper bg-accent4 pt-m pb-l px-margin flex flex-col gap-s"
    >
      <div class="w-fit max-w-12col flex flex-col gap-3xs">
        <div class="w-full h-2px bg-whiteText"></div>
        <h2 class="text-whiteText relative">{{ data.title }}</h2>
      </div>
      <div class="flex flex-col gap-xs s-rich-text text-whiteText">
        <PrismicRichText :field="data.text" />
      </div>
      <BaseLink :link="data.link" />
    </div>
  </section>
</template>

<script setup>
const props = defineProps(getSliceComponentProps());
const data = props.slice.primary;
</script>

<style lang="postcss">
:where(.c-slice-image-link) {
  & .image-wrapper {
    position: relative;
    width: calc(100% + var(--layout-margin) * 2);
    margin-left: calc(var(--layout-margin) * -1);
  }
  & .card-wrapper {
    position: relative;
    width: calc(100% + var(--layout-margin) * 2);
    margin-left: calc(var(--layout-margin) * -1);
  }
  & .image-container {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: rgb(0 0 0 / 0.3);
      pointer-events: none;
    }
  }

  & img {
    display: block;
    width: 100%;
  }

  & h2::after {
    content: "";
    position: absolute;
    width: 40px;
    height: 40px;
    background: var(--accent1);
    top: 10px;
    left: 10px;
    z-index: 20;
  }
}
</style>
