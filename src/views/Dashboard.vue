<template>

  <div id="map"></div>
  <button @click="convertOldJsonToNewJson" class="btn btn-info">UPDATE OLD JSON</button>
  <button @click="testPdf" class="btn btn-dark">PDF</button>
  <!--begin::Dashboard-->
  <!--  <div class="row gy-5 g-xl-8">-->
  <!--    <div class="col-xxl-4">-->
  <!--      <MixedWidget2-->
  <!--          widget-classes="card-xl-stretch mb-xl-8"-->
  <!--          widget-color="danger"-->
  <!--          chart-height="200"-->
  <!--          stroke-color="#cb1e46"-->
  <!--      ></MixedWidget2>-->
  <!--    </div>-->
  <!--    <div class="col-xxl-4">-->
  <!--      <MixedWidget7-->
  <!--          widget-classes="card-xxl-stretch-50 mb-5 mb-xl-8"-->
  <!--          chart-color="primary"-->
  <!--          chart-height="150"-->
  <!--      ></MixedWidget7>-->
  <!--      <MixedWidget10-->
  <!--          widget-classes="card-xxl-stretch-50 mb-5 mb-xl-8"-->
  <!--          chart-color="primary"-->
  <!--          chart-height="168"-->
  <!--      ></MixedWidget10>-->
  <!--    </div>-->
  <!--  </div>-->

  <!--  <div class="row g-5 gx-xxl-8">-->
  <!--    <div class="col-xxl-4">-->
  <!--      <MixedWidget5-->
  <!--          widget-classes="card-xl-stretch mb-xl-8"-->
  <!--          chart-color="success"-->
  <!--          chart-height="150"-->
  <!--      ></MixedWidget5>-->
  <!--    </div>-->
  <!--  </div>-->
  <!--end::Dashboard-->
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
// import MixedWidget2 from '@/components/widgets/mixed/Widget2.vue';
// import MixedWidget5 from '@/components/widgets/mixed/Widget5.vue';
// import MixedWidget7 from '@/components/widgets/mixed/Widget7.vue';
// import MixedWidget10 from '@/components/widgets/mixed/Widget10.vue';
import { setCurrentPageTitle } from '@/core/helpers/breadcrumb';
import { convertOldJsonToNewJson } from '@/services/folder/folderService';
// import { geocodingAddress } from '@/services/geocodingService';
// import pdfMake from 'pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

export default defineComponent( {
                                  name:       'dashboard',
                                  components: {
                                    // MixedWidget2,
                                    // MixedWidget5,
                                    // MixedWidget7,
                                    // MixedWidget10,
                                  },
                                  setup() {
                                    setCurrentPageTitle( 'Tableau de bord' );
                                    console.log( 'Version de l\'app : ', process.env.VUE_APP_VERSION );
                                    console.log( 'Environnement : ', process.env.NODE_ENV );
                                    console.log( 'URL API : ', process.env.VUE_APP_API_URL );
                                    console.log( 'OK' );
                                    onMounted( async () => {
                                      // On récupère les coordonnées de l'adresse
                                      // let coordinate = await geocodingAddress( '79000 Niort' );
                                      // if ( coordinate === null ) {
                                      //   coordinate = [ 46.160329, -1.151139 ];
                                      // }

                                      // Gp.Map.load(
                                      //     'map', // html div
                                      //     {
                                      //       apiKey:  'essentiels,cartes,parcellaire',
                                      //       zoom:    18,
                                      //       maxZoom: 20,
                                      //       minZoom: 6,
                                      //       center:  {
                                      //         x:          coordinate[ 0 ],
                                      //         y:          coordinate[ 1 ],
                                      //         projection: 'CRS:84',
                                      //       },
                                      //       // layers to display
                                      //       layersOptions: {
                                      //         'ORTHOIMAGERY.ORTHOPHOTOS': {
                                      //           opacity: 0.7,
                                      //         },
                                      //         'CADASTRALPARCELS.PARCELS': {},
                                      //       },
                                      //       // additional tools to display on the map
                                      //       controlsOptions: {
                                      //         'layerSwitcher': {},
                                      //         'drawing':       {},
                                      //         'length':        {},
                                      //         'area':          {},
                                      //       },
                                      //     },
                                      // );

                                      // openDb();
                                      // for ( let i = 0; i < 10; i++ ) {
                                      //   const type     = 'sol';
                                      //   const customer = 'Jean Pierre';
                                      //   createAFolder( type, customer );
                                      // }
                                    } );

                                    const testPdf = () => {
                                      console.log( '%c PDF', 'background: #fdd835; color: #000000' );

                                      const dd = {
                                        content: [
                                          'First paragraph',
                                          'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines',
                                        ],

                                      };

                                      const pdf = pdfMake;
                                      pdf.vfs   = pdfFonts.pdfMake.vfs;
                                      pdf.createPdf( dd ).open();
                                    };

                                    return {
                                      convertOldJsonToNewJson,
                                      testPdf,
                                    };
                                  },
                                } );
</script>

<style>
#map {
  padding    : 5px;
  width      : 100%;
  height     : 600px;
  box-shadow : 0 0 10px #999999;
}
</style>
