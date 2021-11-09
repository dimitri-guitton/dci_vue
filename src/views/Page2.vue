<template>
  <!--begin::Dashboard-->
  <div class="row gy-5 g-xl-8">
    <div class="col-xxl-4">
      <MixedWidget7
          widget-classes="card-xxl-stretch-50 mb-5 mb-xl-8"
          chart-color="primary"
          chart-height="150"
      ></MixedWidget7>
      <MixedWidget10
          widget-classes="card-xxl-stretch-50 mb-5 mb-xl-8"
          chart-color="primary"
          chart-height="168"
      ></MixedWidget10>
    </div>
  </div>
  <!--end::Dashboard-->
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import MixedWidget7 from '@/components/widgets/mixed/Widget7.vue';
import MixedWidget10 from '@/components/widgets/mixed/Widget10.vue';
import { setCurrentPageTitle } from '@/core/helpers/breadcrumb';

export default defineComponent( {
                                  name:       'page_2',
                                  components: {
                                    MixedWidget7,
                                    MixedWidget10,
                                  },
                                  setup() {
                                    onMounted( () => {
                                      setCurrentPageTitle( 'Page 2' );
                                    } );
                                  },
                                } );
</script>
