<script setup>
const props = defineProps(getSliceComponentProps());

const data = props.slice.primary;
const accordionData = data.content;

const colorMap = {
  "Accent 1": "bg-accent1",
  "Accent 2": "bg-accent2",
  "Accent 3": "bg-accent3",
  "Accent 4": "bg-accent4",
  "Accent 5": "bg-accent5",
  Black: "bg-text",
};

const bgClass = computed(() => colorMap[data.color] ?? "bg-text");
</script>

<template>
  <section>
    <BlockHeading
      v-if="data.display_block_heading"
      :block-heading="data.block_heading"
      :display-block-heading="data.display_block_heading"
    />
    <div
      class="flex flex-col px-2xs >=656:px-s py-xs >=656:py-m"
      :class="bgClass"
    >
      <AccordionElement
        v-for="(item, index) in accordionData"
        :key="index"
        :content="item"
      />
    </div>
  </section>
</template>
