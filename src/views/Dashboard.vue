<template>
  <!--begin::Dashboard-->
  <div class="row gy-5 g-xl-8">
    <div class="col-xxl-4">
      <MixedWidget2
          widget-classes="card-xl-stretch mb-xl-8"
          widget-color="danger"
          chart-height="200"
          stroke-color="#cb1e46"
      ></MixedWidget2>
    </div>
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

  <div class="row g-5 gx-xxl-8">
    <div class="col-xxl-4">
      <MixedWidget5
          widget-classes="card-xl-stretch mb-xl-8"
          chart-color="success"
          chart-height="150"
      ></MixedWidget5>
    </div>
  </div>
  <!--end::Dashboard-->
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import MixedWidget2 from '@/components/widgets/mixed/Widget2.vue';
import MixedWidget5 from '@/components/widgets/mixed/Widget5.vue';
import MixedWidget7 from '@/components/widgets/mixed/Widget7.vue';
import MixedWidget10 from '@/components/widgets/mixed/Widget10.vue';
import { setCurrentPageTitle } from '@/core/helpers/breadcrumb';

export default defineComponent( {
                                  name:       'dashboard',
                                  components: {
                                    MixedWidget2,
                                    MixedWidget5,
                                    MixedWidget7,
                                    MixedWidget10,
                                  },
                                  setup() {
                                    onMounted( () => {
                                      setCurrentPageTitle( 'Tableau de bord' );
                                      console.log( 'Version de l\'app : ', process.env.VUE_APP_VERSION );
                                      console.log( 'Environnement : ', process.env.NODE_ENV );
                                      console.log( 'URL API : ', process.env.VUE_APP_API_URL );
                                    } );
                                  },
                                } );
</script>
