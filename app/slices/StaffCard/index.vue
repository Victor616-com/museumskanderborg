<script setup>
const props = defineProps(getSliceComponentProps());
const data = props.slice.primary;

const getRandomAccent = () => `bg-accent${Math.floor(Math.random() * 5) + 1}`;

const staffWithFallback = data.staff_members.map((staff) => ({
  ...staff,
  fallbackColor: getRandomAccent(),
}));
</script>

<template>
  <section class="c-slice-staff-card">
    <BlockHeading
      v-if="data.display_block_heading"
      :block-heading="data.block_heading"
      :display-block-heading="data.display_block_heading"
    />
    <div
      v-if="data.staff_members.length > 1"
      class="w-full flex flex-row gap-gutter flex-wrap"
    >
      <div
        v-for="(staff, index) in staffWithFallback"
        :key="index"
        class="group relative w-full >=656:w-6col >=960:w-4col >=1280:w-3col aspect-ratio-34/48 flex flex-col justify-end p-xs"
      >
        <BaseImage
          v-if="staff.staff_member.data.image"
          :src="staff.staff_member.data.image.url"
          :alt="staff.staff_member.data.image.alt"
          class="absolute inset-0 w-full h-full object-cover"
          zoomEffect
          overlay
        />
        <div
          v-else
          class="absolute inset-0 w-full h-full"
          :class="staff.fallbackColor"
        ></div>

        <div class="z-10 flex flex-col gap-2xs">
          <h3 class="text-heading-2 >=656:text-heading-3 text-whiteText">
            {{ staff.staff_member.data.name }}
          </h3>
          <p class="text-s-400 >=656:text-xs-400 text-whiteText">
            {{ staff.staff_member.data.title }}
            <span v-if="data.show_department">
              -
              {{ staff.staff_member.data.department.data.department_name }}
            </span>
          </p>

          <div class="flex flex-col gap-4px">
            <a
              class="text-s-400 >=656:text-xs-400 text-whiteText underline"
              :href="`mailto:${staff.staff_member.data.email}`"
            >
              {{ staff.staff_member.data.email }}
            </a>
            <a
              class="text-s-400 >=656:text-xs-400 text-whiteText underline"
              :href="`tel:${staff.staff_member.data.phone_number}`"
            >
              {{ staff.staff_member.data.phone_number }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div
        :class="[
          'c-staff-single',
          'w-12col >=656:w-11col >=1280:w-9col gap-m ',
        ]"
      >
        <div class="c-staff-single__header flex flex-col gap-m">
          <span
            class="relative max-w-7col >=656:max-w-5col >=1280:max-w-5col flex flex-col gap-2xs"
          >
            <div class="w-110% h-3px bg-text"></div>
            <h3 class="text-heading-2 >=960:text-heading-1">
              {{ staffWithFallback[0].staff_member.data.name }}
            </h3>
            <div
              class="absolute w-40% >=1280:w-50% aspect-ratio-1 bg-accent3 -right-20% top-0 -translate-y-20% -z-1"
            ></div>
          </span>
          <p class="text-m-400 max-w-7col >=656:max-w-4col >=1280:max-w-3col">
            {{ staffWithFallback[0].staff_member.data.title }}
          </p>
        </div>

        <!-- Image + decorative circle -->
        <span class="c-staff-single__image flex justify-end">
          <span class="relative h-fit">
            <BaseImage
              v-if="staffWithFallback[0].staff_member.data.image"
              :src="staffWithFallback[0].staff_member.data.image.url"
              :alt="staffWithFallback[0].staff_member.data.image.alt"
              class="w-8col >=656:w-4col >=1280:w-3col aspect-ratio-34/48 object-cover"
              zoomEffect
            />
            <div
              class="absolute w-60% aspect-ratio-1 <=656:left-0 >=656:right-0 bottom-0 -translate-x-25% >=656:translate-x-25% translate-y-25% bg-accent1 -z-1"
            ></div>
          </span>
        </span>

        <!-- Contact: email + phone -->
        <div class="c-staff-single__contact flex flex-col gap-4px <=656:mt-s">
          <a
            class="text-s-400 >=656:text-xs-400 text-lightText underline"
            :href="`mailto:${staffWithFallback[0].staff_member.data.email}`"
          >
            {{ staffWithFallback[0].staff_member.data.email }}
          </a>
          <a
            class="text-s-400 >=656:text-xs-400 text-lightText underline"
            :href="`tel:${staffWithFallback[0].staff_member.data.phone_number}`"
          >
            {{ staffWithFallback[0].staff_member.data.phone_number }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="postcss">
:where(.c-slice-staff-card) {
  @apply flex flex-col;
}

:where(.c-staff-single) {
  display: grid;
  grid-template-areas:
    "header"
    "image"
    "contact";

  & .c-staff-single__header {
    grid-area: header;
  }
  & .c-staff-single__image {
    grid-area: image;
  }
  & .c-staff-single__contact {
    grid-area: contact;
  }

  @media (min-width: 656px) {
    justify-content: space-between;
    align-content: space-between;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      "header image"
      "contact image";
    column-gap: auto;
  }
}
</style>
