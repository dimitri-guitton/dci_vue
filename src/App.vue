<template>
  <router-view />
</template>

<style lang="scss">
@import '~bootstrap-icons/font/bootstrap-icons.css';
@import '~apexcharts/dist/apexcharts.css';
@import '~quill/dist/quill.snow.css';
@import '~animate.css';
@import '~sweetalert2/dist/sweetalert2.css';
@import '~nouislider/distribute/nouislider.css';
@import '~@fortawesome/fontawesome-free/css/all.min.css';
@import '~socicon/css/socicon.css';
@import '~line-awesome/dist/line-awesome/css/line-awesome.css';
@import '~@yaireo/tagify/src/tagify.scss';
@import '~dropzone/dist/dropzone.css';
@import '~@vueform/multiselect/themes/default.css';
@import '~prism-themes/themes/prism-shades-of-purple.css';
@import '~element-plus/lib/theme-chalk/index.css';

// Main demo style scss
@import 'assets/sass/plugins';
@import 'assets/sass/style';

// Dark mode demo style scss
</style>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { Mutations } from '@/store/enums/StoreEnums';

import {
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  Chart,
  Decimation,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  LogarithmicScale,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  ScatterController,
  SubTitle,
  TimeScale,
  TimeSeriesScale,
  Title,
  Tooltip,
} from 'chart.js';

Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle,
);


export default defineComponent( {
                                  name: 'app',
                                  setup() {
                                    const store = useStore();

                                    onMounted( () => {
                                      /**
                                       * this is to override the layout config using saved data from localStorage
                                       * remove this to use config only from static config (@/core/config/DefaultLayoutConfig.ts)
                                       */
                                      store.commit( Mutations.OVERRIDE_LAYOUT_CONFIG );
                                    } );
                                  },
                                } );
</script>
