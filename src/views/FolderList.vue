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
  </div>
  <!--end::Dashboard-->
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import MixedWidget2 from '@/components/widgets/mixed/Widget2.vue';
import { setCurrentPageTitle } from '@/core/helpers/breadcrumb';

export default defineComponent( {
                                  name:       'folder_list',
                                  components: {
                                    MixedWidget2,
                                  },
                                  setup() {
                                    onMounted( () => {
                                      setCurrentPageTitle( 'Mes dossiers' );
                                    } );
                                  },
                                } );
</script>
