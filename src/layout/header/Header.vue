<template>
  <!--begin::Header-->
    <div class="header align-items-stretch">
    <!--begin::Container-->
    <div
        :class="{
        'container-fluid': headerWidthFluid,
        'container-xxl': !headerWidthFluid,
      }"
        class="d-flex align-items-stretch justify-content-between"
    >
      <!--begin::Mobile logo-->
        <div class="d-flex align-items-center flex-grow-1"></div>
      <!--end::Mobile logo-->

      <!--begin::Wrapper-->
        <div class="
          d-flex
          align-items-stretch
          justify-content-between
          flex-grow-1
        "
      >
        <!--begin::Navbar-->
        <div class="d-flex align-items-stretch" id="kt_header_menu_nav">
          <KTMenu></KTMenu>
        </div>
        <!--end::Navbar-->
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Container-->
  </div>
  <!--end::Header-->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import KTMenu from '@/layout/header/Menu.vue';

import { asideDisplay, headerLeft, headerWidthFluid } from '@/core/helpers/config';

export default defineComponent({
                                 name: "KTHeader",
                                 props: {
                                   title: String,
                                 },
                                 components: {
                                   KTMenu,
                                 },
                                 setup() {
                                   return {
                                     headerWidthFluid,
                                     headerLeft,
                                     asideDisplay,
                                   };
                                 },
                               });
</script>
