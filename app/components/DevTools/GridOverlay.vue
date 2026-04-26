<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const visible = ref(false);

function handleKey(e: KeyboardEvent) {
  if (e.altKey && e.code === "KeyG") {
    e.preventDefault(); // avoid browser conflicts
    visible.value = !visible.value;
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKey);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKey);
});
</script>

<template>
  <div>
    <Teleport to="body">
      <Transition>
        <div v-if="visible" class="fixed inset-0 pointer-events-none z-9999">
          <div class="grid-container">
            <div v-for="i in 12" :key="i" class="grid-column" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="postcss">
/* respects your layout margin */
.grid-container {
  height: 100dvh;
  padding-inline: var(--layout-margin);
  display: flex;
  gap: var(--layout-gutter);
}

.grid-column {
  flex: 1;
  background: rgba(255, 0, 0, 0.08);
  border-left: 1px solid rgba(255, 0, 0, 0.25);
  border-right: 1px solid rgba(255, 0, 0, 0.25);
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
