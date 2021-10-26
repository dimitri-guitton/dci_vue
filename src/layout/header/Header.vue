<template>
  <!--begin::Header-->
  <div id="kt_header" style="" class="header align-items-stretch">
    <!--begin::Container-->
    <div
      :class="{
        'container-fluid': headerWidthFluid,
        container: !headerWidthFluid
      }"
      class="d-flex align-items-stretch justify-content-between"
    >
      <!--begin::Aside mobile toggle-->
      <div
        class="d-flex align-items-center d-lg-none ms-n3 me-1"
        title="Show aside menu"
      >
        <div
          class="btn btn-icon btn-active-light-primary"
          id="kt_aside_mobile_toggle"
        >
          <span class="svg-icon svg-icon-2x mt-1">
            <inline-svg src="media/icons/duotone/Text/Menu.svg" />
          </span>
        </div>
      </div>
      <!--end::Aside mobile toggle-->

      <!--begin::Mobile logo-->
      <div class="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
        <a href="#" class="d-lg-none">
          <img alt="Logo" src="media/logos/logo-3.svg" class="h-30px" />
        </a>
      </div>
      <!--end::Mobile logo-->

      <!--begin::Wrapper-->
      <div
        class="d-flex align-items-stretch justify-content-between flex-lg-grow-1"
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
import { defineComponent } from "vue";
import KTMenu from "@/layout/header/Menu.vue";

import {
  headerWidthFluid,
  headerLeft,
  asideDisplay
} from "@/core/helpers/config";

export default defineComponent({
  name: "KTHeader",
  props: {
    title: String
  },
  components: {
    KTMenu
  },
  setup() {
    return {
      headerWidthFluid,
      headerLeft,
      asideDisplay
    };
  }
});
</script>
