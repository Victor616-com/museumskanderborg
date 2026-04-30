<template>
  <footer class="c-footer">
    <div class="w-12col >=960:w-10col flex flex-col gap-150px">
      <BaseImage
        v-if="data.logo.url"
        :src="data.logo.url"
        :alt="data.logo.alt"
        class="w-6col >=960:w-4col"
      />
      <div class="flex flex-col gap-94px">
        <div class="w-full h-1px bg-whiteText"></div>
        <div
          :class="[
            'footer-columns',
            'flex flex-row justify-start flex-wrap w-full',
          ]"
        >
          <div
            v-for="(column, index) in data.columns"
            :key="index"
            class="w-fit max-w-12col flex flex-col gap-m"
          >
            <h3 class="text-whiteText w-fit">{{ column.title }}</h3>
            <span class="s-rich-text w-full text-whiteText">
              <PrismicRichText :field="column.column" />
            </span>
          </div>
        </div>
        <div class="w-full h-1px bg-whiteText"></div>
      </div>
    </div>
  </footer>
</template>
<script setup>
defineProps({
  data: { type: Object, required: true },
});
</script>
<style lang="postcss">
:where(.c-footer) {
  @apply w-full bg-black px-margin pt-150px pb-100px flex justify-end;
  width: calc(
    12 * var(--layout-column) + 11 * var(--layout-gutter) + 2 *
      var(--layout-margin)
  );
  margin-right: calc(-1 * var(--layout-margin));
  margin-left: calc(-1 * var(--layout-margin));

  & .footer-columns {
    column-gap: var(--layout-column);
    row-gap: 100px;
  }

  & .s-rich-text a {
    @apply text-whiteText;
  }
  & .s-rich-text {
    @apply flex flex-col gap-2xs >=1280:gap-s;
  }
}
</style>
