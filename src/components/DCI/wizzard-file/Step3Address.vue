<template>
  <el-divider></el-divider>

  <div class="mb-10">
    <h2 class="fw-bolder text-dark">Géolocalisation & superficie</h2>
  </div>

  <div class="row mb-10">
    <div class="col-md-6">
      <label class="form-check form-switch form-check-custom">
        <Field
            type="checkbox"
            class="form-check-input"
            name="housingIsAddressBenef"
            :value="true"
        />
        <span class="form-check-label fw-bold text-gray-400">
            L'adresse du logement est la même que le bénéficiaire
          </span>
      </label>
    </div>
  </div>

  <div class="row mb-15">
    <div class="col-md-4 fv-row">
      <label class="form-label mb-3">Nature du batiment</label>
      <Field
          name="housingBuildingNature"
          as="select"
          class="form-control">
        <item-list :lists="lists.batimentNatureList"></item-list>
      </Field>
      <ErrorMessage
          name="housingBuildingNature"
          class="fv-plugins-message-container invalid-feedback"
      ></ErrorMessage>
    </div>
  </div>
  <div class="row mb-10">
    <div class="col-md-12">
      <div id="map" v-loading="isLoading" element-loading-text="Chargement de la carte"></div>
    </div>
  </div>
  <div class="row mb-10 d-flex justify-content-end">
    <button @click="loadMap" type="button" class="btn btn-primary w-auto mx-2">Charger la carte</button>
    <button @click="takeScreenshot" type="button" class="btn btn-primary w-auto mx-2">Sauvergarder le plan</button>
    <button @click="openMapFolder" type="button" class="btn btn-info w-auto mx-2">Voir le plan dans le dossier</button>
  </div>
  <div class="row mb-10">
    <div class="col-md-5">
      <el-descriptions
          title="Données Géoportail"
          :column="1"
          border
      >
        <el-descriptions-item label="Parcelle">-</el-descriptions-item>
        <el-descriptions-item label="Adresse">-</el-descriptions-item>
        <el-descriptions-item label="Code postal">-</el-descriptions-item>
        <el-descriptions-item label="Ville">-</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="col-md-6 offset-md-1">
      <div class="row mb-5">
        <div class="col-md-10 fv-row">
          <label class="form-label mb-3">Parcelle</label>
          <Field
              class="form-control"
              name="address.plot"
              placeholder="Commune absorbée / section / numéro"
              value=""
          />
          <ErrorMessage
              name="address.plot"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col-md-10 fv-row">
          <label class="form-label mb-3">Adresse</label>
          <Field
              class="form-control"
              name="address.address"
              placeholder="Adresse"
              value=""
          />
          <ErrorMessage
              name="address.address"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col-md-5 fv-row">
          <label class="form-label mb-3">Code postal</label>
          <Field
              class="form-control"
              name="address.zipCode"
              placeholder="Code postal"
              value=""
          />
          <ErrorMessage
              name="address.zipCode"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
        <div class="col-md-5 fv-row">
          <label class="form-label mb-3">Ville</label>
          <Field
              class="form-control"
              name="address.city"
              placeholder="Ville"
              value=""
          />
          <ErrorMessage
              name="address.city"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
      </div>
    </div>
  </div>
  <el-divider></el-divider>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import ItemList from '@/components/DCI/input/ItemList.vue';
import * as Gp from '@ignf-geoportal/sdk-2d';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import { getcurrentFolderName } from '@/services/data/dataService';
import { FoldersNames, getFolderPath } from '@/services/folder/folderService';
import { ipcRenderer, shell } from 'electron';
import { ElMessage } from 'element-plus';
import fs from 'fs';
import { geocodingAddress } from '@/services/geocodingService';

export default defineComponent( {
                                  name:       'step3-address',
                                  components: { ItemList, Field, ErrorMessage },
                                  props:      {
                                    lists:    Object,
                                    fileData: {
                                      type:     Object as () => RrFile,
                                      required: true,
                                    },
                                  },
                                  setup( props ) {

                                    // const isDevelopment = process.env.NODE_ENV !== 'production';
                                    const isDevelopment = false;
                                    const isLoading     = ref<boolean>( false );
                                    const map           = ref();

                                    /**
                                     * Formate l'adresse pour le geocoding
                                     */
                                    const formattedAddress = computed( () => {
                                      if ( props.fileData.beneficiary !== undefined ) {
                                        if ( props.fileData.beneficiary.address !== '' && props.fileData.beneficiary.zipCode !== '' && props.fileData.beneficiary.city !== '' ) {
                                          return `${ props.fileData.beneficiary.address }, ${ props.fileData.beneficiary.zipCode } ${ props.fileData.beneficiary.city }`;
                                        }
                                      }

                                      return '';
                                    } );

                                    // Permet de charger la carte
                                    // TODO faire en sorte que la map se charge quand on arrive sur l'étape 3 et non quand le componement est monté car ils est monté à la step 1 et ela fait que la map ne se load pas
                                    const loadMap = async () => {
                                      console.log( '%c ON LOAD MAP', 'background: #fdd835; color: #000000' );
                                      isLoading.value = true;

                                      let coordinate;

                                      if ( formattedAddress.value !== '' ) {
                                        coordinate = await geocodingAddress( formattedAddress.value );
                                        if ( coordinate === null ) {
                                          ElMessage( {
                                                       message: 'Une erreur est survenue pour trouver l\'adresse sur la carte',
                                                       type:    'warning',
                                                     } );
                                          coordinate = [ -1.1220979, 46.1703322 ];
                                        }
                                      } else {
                                        coordinate = [ -1.1220979, 46.1703322 ];
                                      }
                                      map.value = Gp.Map.load(
                                          'map', // html div
                                          {
                                            apiKey:  'essentiels,cartes,parcellaire',
                                            zoom:    18,
                                            maxZoom: 20,
                                            minZoom: 6,
                                            center:  {
                                              x:          coordinate[ 0 ],
                                              y:          coordinate[ 1 ],
                                              projection: 'CRS:84',
                                            },
                                            // layers to display
                                            layersOptions: {
                                              'ORTHOIMAGERY.ORTHOPHOTOS': {
                                                opacity: 0.7,
                                              },
                                              'CADASTRALPARCELS.PARCELS': {},
                                            },
                                            // additional tools to display on the map
                                            controlsOptions:  {
                                              'layerSwitcher': {},
                                              'drawing':       {},
                                              'length':        {},
                                              'area':          {},
                                            },
                                            mapEventsOptions: {
                                              // when map has finished to initialize and to render
                                              'mapLoaded': function () {
                                                isLoading.value = false;
                                                console.log( '%c___', 'background: #35D452; color: #000000' );
                                                console.log( '%c___', 'background: #35D452; color: #000000' );
                                                console.log( '%c___', 'background: #35D452; color: #000000' );
                                                console.log( '%c MAP CHARGÉ AVEC SUCCÈS',
                                                             'background: #35D452; color: #000000' );
                                                console.log( '%c___', 'background: #35D452; color: #000000' );
                                                console.log( '%c___', 'background: #35D452; color: #000000' );
                                                console.log( '%c___', 'background: #35D452; color: #000000' );
                                              },
                                            },
                                          },
                                      );

                                      map.value.setMarkersOptions( [
                                                                     {
                                                                       position: {
                                                                         x:          coordinate[ 0 ],
                                                                         y:          coordinate[ 1 ],
                                                                         projection: 'CRS:84',
                                                                       },
                                                                     },
                                                                   ] );
                                    };


                                    // On charge la map que lorsque l'on est en prod
                                    if ( !isDevelopment ) {

                                      // Watch Effect pour mettre à jour la map quand il y a un changement dans l'adresse
                                      // watchEffect( async () => {
                                      //   console.log( '%c watchEffect', 'background: #F5ADFD; color: #000000' );
                                      //
                                      //   if ( map.value !== undefined ) {
                                      //     isLoading.value = true;
                                      //
                                      //     let coordinate;
                                      //
                                      //     if ( formattedAddress.value !== '' ) {
                                      //       coordinate = await geocodingAddress( formattedAddress.value );
                                      //       if ( coordinate === null ) {
                                      //         ElMessage( {
                                      //                      message: 'Une erreur est survenue pour trouver l\'adresse sur la carte',
                                      //                      type:    'warning',
                                      //                    } );
                                      //         coordinate = [ -1.1220979, 46.1703322 ];
                                      //       }
                                      //     } else {
                                      //       coordinate = [ -1.1220979, 46.1703322 ];
                                      //     }
                                      //
                                      //     map.value.setCenter( {
                                      //                            x:          coordinate[ 0 ],
                                      //                            y:          coordinate[ 1 ],
                                      //                            projection: 'CRS:84',
                                      //                          } );
                                      //
                                      //
                                      //     // const icon = path.join( __static, `/map/home.png` );
                                      //     // console.log( '__c ICON PATH', icon );
                                      //
                                      //     map.value.setMarkersOptions( [
                                      //                                    {
                                      //                                      position: {
                                      //                                        x:          coordinate[ 0 ],
                                      //                                        y:          coordinate[ 1 ],
                                      //                                        projection: 'CRS:84',
                                      //                                      },
                                      //                                    },
                                      //                                  ] );
                                      //
                                      //     isLoading.value = false;
                                      //   } else {
                                      //     console.log( 'MAP IS UNDEFINED' );
                                      //   }
                                      // } );

                                      // onMounted( async () => {
                                      //   console.log( '%c ON MOUNTED', 'background: #D43FC8; color: #000000' );
                                      //   const coordinate = [ -1.1220979, 46.1703322 ];
                                      //   setTimeout( () => {
                                      //     map.value = Gp.Map.load(
                                      //         'map', // html div
                                      //         {
                                      //           apiKey:  'essentiels,cartes,parcellaire',
                                      //           zoom:    18,
                                      //           maxZoom: 20,
                                      //           minZoom: 6,
                                      //           center:  {
                                      //             x:          coordinate[ 0 ],
                                      //             y:          coordinate[ 1 ],
                                      //             projection: 'CRS:84',
                                      //           },
                                      //           // layers to display
                                      //           layersOptions: {
                                      //             'ORTHOIMAGERY.ORTHOPHOTOS': {
                                      //               opacity: 0.7,
                                      //             },
                                      //             'CADASTRALPARCELS.PARCELS': {},
                                      //           },
                                      //           // additional tools to display on the map
                                      //           controlsOptions:  {
                                      //             'layerSwitcher': {},
                                      //             'drawing':       {},
                                      //             'length':        {},
                                      //             'area':          {},
                                      //           },
                                      //           mapEventsOptions: {
                                      //             // when map has finished to initialize and to render
                                      //             'mapLoaded': function () {
                                      //               isLoading.value = false;
                                      //               console.log( '%c___', 'background: #35D452; color: #000000' );
                                      //               console.log( '%c___', 'background: #35D452; color: #000000' );
                                      //               console.log( '%c___', 'background: #35D452; color: #000000' );
                                      //               console.log( '%c MAP CHARGÉ AVEC SUCCÈS',
                                      //                            'background: #35D452; color: #000000' );
                                      //               console.log( '%c___', 'background: #35D452; color: #000000' );
                                      //               console.log( '%c___', 'background: #35D452; color: #000000' );
                                      //               console.log( '%c___', 'background: #35D452; color: #000000' );
                                      //             },
                                      //           },
                                      //         },
                                      //     );
                                      //   }, 5000 );
                                      //   //   if ( map.value == undefined ) {
                                      //   //     console.log( 'MAP IS UNDEFINED' );
                                      //   //   }
                                      //   //   // On récupère les coordonnées de l'adresse
                                      //   //   let coordinate;
                                      //   //
                                      //   //   console.log( 'formattedAddress -->', formattedAddress.value );
                                      //   //   if ( formattedAddress.value !== '' ) {
                                      //   //     console.log( 'EN ATTENTE DU GEOCODING' );
                                      //   //     coordinate = await geocodingAddress( formattedAddress.value );
                                      //   //     if ( coordinate === null ) {
                                      //   //       ElMessage( {
                                      //   //                    message: 'Impossible de trouver l\'adresse sur la carte',
                                      //   //                    type:    'warning',
                                      //   //                  } );
                                      //   //       coordinate = [ -1.1220979, 46.1703322 ];
                                      //   //     }
                                      //   //   } else {
                                      //   //     coordinate = [ -1.1220979, 46.1703322 ];
                                      //   //   }
                                      //   //   console.log( 'COORD -->', coordinate );
                                      //   //
                                      //   //   console.log( 'BEFORE FUNCTION LOAD MAP' );
                                      //   //
                                      //   //   // Chargement de la carte
                                      //   //   // map.value = Gp.Map.load(
                                      //   //   //     'map', // html div
                                      //   //   //     {
                                      //   //   //       apiKey:  'essentiels,cartes,parcellaire',
                                      //   //   //       zoom:    18,
                                      //   //   //       maxZoom: 20,
                                      //   //   //       minZoom: 6,
                                      //   //   //       center:  {
                                      //   //   //         x:          coordinate[ 0 ],
                                      //   //   //         y:          coordinate[ 1 ],
                                      //   //   //         projection: 'CRS:84',
                                      //   //   //       },
                                      //   //   //       // layers to display
                                      //   //   //       layersOptions: {
                                      //   //   //         'ORTHOIMAGERY.ORTHOPHOTOS': {
                                      //   //   //           opacity: 0.7,
                                      //   //   //         },
                                      //   //   //         'CADASTRALPARCELS.PARCELS': {},
                                      //   //   //       },
                                      //   //   //       // additional tools to display on the map
                                      //   //   //       controlsOptions:  {
                                      //   //   //         'layerSwitcher': {},
                                      //   //   //         'drawing':       {},
                                      //   //   //         'length':        {},
                                      //   //   //         'area':          {},
                                      //   //   //       },
                                      //   //   //       mapEventsOptions: {
                                      //   //   //         // when map has finished to initialize and to render
                                      //   //   //         'mapLoaded': function () {
                                      //   //   //           isLoading.value = false;
                                      //   //   //           console.log( '%c___', 'background: #35D452; color: #000000' );
                                      //   //   //           console.log( '%c___', 'background: #35D452; color: #000000' );
                                      //   //   //           console.log( '%c___', 'background: #35D452; color: #000000' );
                                      //   //   //           console.log( '%c MAP CHARGÉ AVEC SUCCÈS',
                                      //   //   //                        'background: #35D452; color: #000000' );
                                      //   //   //           console.log( '%c___', 'background: #35D452; color: #000000' );
                                      //   //   //           console.log( '%c___', 'background: #35D452; color: #000000' );
                                      //   //   //           console.log( '%c___', 'background: #35D452; color: #000000' );
                                      //   //   //         },
                                      //   //   //       },
                                      //   //   //     },
                                      //   //   // );
                                      //   //
                                      // } );
                                    }


                                    /**
                                     * Prend un screen de l'application et sauvegarde dans le dossier map
                                     */
                                    const takeScreenshot = () => {
                                      console.log( '%c TAKE screen', 'background: #fdd835; color: #000000' );
                                      const folderName = getcurrentFolderName() as string;
                                      const path       = `${ getFolderPath( folderName ) }/${ FoldersNames.MAP }/carte.png`;
                                      console.log( path );
                                      ipcRenderer.send( 'save-screenshot', { target: path } );

                                      ElMessage( {
                                                   message: 'Image sauvegardé avec succès',
                                                   type:    'success',
                                                 } );
                                    };

                                    /**
                                     * Ouvrir la map sauvegarder (screenshot)
                                     */
                                    const openMapFolder = () => {
                                      const folderName = getcurrentFolderName() as string;
                                      const path       = `${ getFolderPath( folderName ) }/${ FoldersNames.MAP }/carte.png`;
                                      if ( fs.existsSync( path ) ) {
                                        shell.openPath( path );
                                      } else {
                                        ElMessage( {
                                                     message: 'La carte n\'exite pas/plus',
                                                     type:    'warning',
                                                   } );
                                      }
                                    };

                                    return {
                                      isLoading,
                                      takeScreenshot,
                                      openMapFolder,
                                      loadMap,
                                    };
                                  },
                                },
);
</script>

<style>
#map {
  width  : 100%;
  height : 500px;
}
</style>
