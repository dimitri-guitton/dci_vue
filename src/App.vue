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
import { getConnectedToInternet, setConnectedToInternet } from '@/services/data/dataService';
import { ElMessage, ElNotification } from 'element-plus';
import { ipcRenderer } from 'electron';

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

                                      // Event pour check la connection internet
                                      const updateOnlineStatus = () => {
                                        if ( navigator.onLine ) {
                                          if ( !getConnectedToInternet() ) {
                                            ElMessage( {
                                                         message: 'Vous êtes de nouveau connecté à Internet',
                                                         type:    'success',
                                                       } );
                                          }
                                          setConnectedToInternet( true );

                                        } else {
                                          setConnectedToInternet( false );
                                          ElMessage( {
                                                       message: 'Vous n\'êtes pas connecté à Internet',
                                                       type:    'warning',
                                                     } );
                                        }


                                      };

                                      ipcRenderer.on( 'download_update', () => {
                                        ElNotification( {
                                                          type:     'info',
                                                          title:    'Mise à jour',
                                                          message:  'Une nouvelle version est en cours de téléchargement',
                                                          position: 'bottom-left',
                                                          offset:   25,
                                                          duration: 0,
                                                        } );
                                      } );

                                      const restartApp = () => {
                                        console.log( 'restart_app' );
                                        ipcRenderer.send( 'restart_app' );
                                      };

                                      ipcRenderer.on( 'update_downloaded', () => {
                                        console.log( '%c update_downloaded', 'background: #fdd835; color: #000000' );
                                        ElNotification( {
                                                          type:                     'success',
                                                          title:                    'Mise à jour',
                                                          dangerouslyUseHTMLString: true,
                                                          message:                  `<p class="mb-5">Mise à jour téléchargée. Elle sera installée au redémarrage de l'application. Redémarrer maintenant ?</p><button id="restart_btn" class="btn btn-success">Redémarrer</button>`,
                                                          position:                 'bottom-left',
                                                          offset:                   25,
                                                          duration:                 0,
                                                        } );

                                        const btn = document.getElementById( 'restart_btn' );
                                        if ( btn !== null ) {
                                          btn.addEventListener( 'click', restartApp );
                                        }
                                      } );

                                      window.addEventListener( 'online', updateOnlineStatus );
                                      window.addEventListener( 'offline', updateOnlineStatus );
                                    } );
                                  },
                                } );
</script>

<style>
.el-icon-info {
  color : lightskyblue !important;
}

.el-icon-success {
  color : limegreen !important;
}
</style>
