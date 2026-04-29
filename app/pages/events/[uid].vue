<script setup lang="ts">
const { client } = usePrismic();
const route = useRoute();
const { data: event } = await useAsyncData(route.params.uid as string, () =>
  client.getByUID("event", route.params.uid as string),
);

useHead({
  title: event.value?.data.title,
});

const formattedDate = computed(() => {
  if (!event.value?.data.date) return "";
  return new Date(event.value.data.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});
</script>

<template>
  <main>
    <LongRead />
    <NuxtImg
      v-if="event?.data.image.url"
      :src="event.data.image.url"
      :alt="event.data.image.alt"
    />
    <h1>{{ event?.data.title }}</h1>
    <p>{{ formattedDate }}</p>
    <div class="s-rich-text">
      <PrismicRichText :field="event?.data.description" />
    </div>
  </main>
</template>
