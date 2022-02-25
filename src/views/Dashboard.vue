<template>

  <div id="map" class="mb-5"></div>
  <button @click="convertOldJsonToNewJson" class="btn btn-info mx-2 my-2">UPDATE OLD JSON</button>
  <button @click="testPdf('address')" class="btn btn-dark mx-2 my-2">PDF Adresse</button>
  <button @click="testPdf('devis')" class="btn btn-dark mx-2 my-2">PDF Devis CET</button>
  <button @click="testPdf('fiche')" class="btn btn-dark mx-2 my-2">PDF Fiche CET</button>
  <button @click="testPdf('cc')" class="btn btn-dark mx-2 my-2">PDF Cadre contribution</button>
  <button @click="testPdf('renov')" class="btn btn-dark mx-2 my-2">PDF MaPrimeRenov</button>
  <button @click="testPdf('tva')" class="btn btn-dark mx-2 my-2">PDF TVA</button>
  <!--  begin::Dashboard-->
  <div class="row gy-5 g-xl-12 mt-10">
    <div class="col-xxl-6">
      <MixedWidget2
          widget-classes="card-xl-stretch mb-xl-8"
          widget-color="danger"
          chart-height="200"
          stroke-color="#cb1e46"
      ></MixedWidget2>
    </div>
    <div class="col-xxl-6">
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

  <div class="row g-5 gx-xxl-12">
    <div class="col-xxl-6">
      <MixedWidget5
          widget-classes="card-xl-stretch mb-xl-8"
          chart-color="success"
          chart-height="150"
      ></MixedWidget5>
    </div>
  </div>
  <!--  end::Dashboard-->
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import MixedWidget2 from '@/components/widgets/mixed/Widget2.vue';
import MixedWidget5 from '@/components/widgets/mixed/Widget5.vue';
import MixedWidget7 from '@/components/widgets/mixed/Widget7.vue';
import MixedWidget10 from '@/components/widgets/mixed/Widget10.vue';
import { setCurrentPageTitle } from '@/core/helpers/breadcrumb';
import { convertAllOldJsonToNewJson } from '@/services/folder/folderService';
// import { geocodingAddress } from '@/services/geocodingService';
// import * as Gp from '@ignf-geoportal/sdk-2d';
import fs from 'fs';
import { NewAddressGenerator } from '@/services/pdf/newAddressGenerator';
import { CetFile } from '@/types/v2/File/Cet/CetFile';
import { QuotationGenerator } from '@/services/pdf/quotationGenerator';
import { WorksheetGenerator } from '@/services/pdf/worksheetGenerator';
import { ContributionFrameworkGenerator } from '@/services/pdf/contributionFrameworkGenerator';
import { MaPrimeRenovGenerator } from '@/services/pdf/maPrimeRenovGenerator';
import { TvaCertificateGenerator } from '@/services/pdf/tvaCertificateGenerator';
// import pdfMake from 'pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

export default defineComponent( {
                                  name:       'dashboard',
                                  components: {
                                    MixedWidget2,
                                    MixedWidget5,
                                    MixedWidget7,
                                    MixedWidget10,
                                  },
                                  setup() {
                                    setCurrentPageTitle( 'Tableau de bord' );
                                    console.log( 'Version de l\'app : ', process.env.VUE_APP_VERSION );
                                    console.log( 'Environnement : ', process.env.NODE_ENV );
                                    console.log( 'URL API : ', process.env.VUE_APP_API_URL );
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
                                    } );

                                    const testPdf = ( type: string ) => {
                                      const rawdata  = fs.readFileSync( 'examples/fake_cet.json' ).toString( 'utf8' );
                                      const fileData = ( JSON.parse( rawdata ) as CetFile );
                                      switch ( type ) {
                                        case 'address':
                                          const aG = new NewAddressGenerator( fileData.housing, fileData.beneficiary );
                                          aG.previewPdf();
                                          break;
                                        case 'devis':
                                          const dG = new QuotationGenerator( fileData );
                                          dG.previewPdf();
                                          break;
                                        case 'fiche':
                                          const fG = new WorksheetGenerator( fileData );
                                          fG.previewPdf();
                                          break;
                                        case 'cc':
                                          const cG = new ContributionFrameworkGenerator( fileData );
                                          cG.previewPdf();
                                          break;
                                        case 'renov':
                                          const rG = new MaPrimeRenovGenerator( fileData );
                                          rG.previewPdf();
                                          break;
                                        case 'tva':
                                          const tG = new TvaCertificateGenerator( fileData );
                                          tG.previewPdf();
                                          break;
                                      }
                                    };

                                    return {
                                      convertOldJsonToNewJson: convertAllOldJsonToNewJson,
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
