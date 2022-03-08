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
    <button type="button" class="btn btn-primary w-auto mx-2">Sauvergarder le plan</button>
    <button type="button" class="btn btn-info w-auto mx-2">Voir le plance dans le dossier</button>
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
import { computed, defineComponent, onMounted, ref, watchEffect } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import * as Gp from '@ignf-geoportal/sdk-2d';
import { geocodingAddress } from '@/services/geocodingService';
import ItemList from '@/components/DCI/input/ItemList.vue';
import { RrFile } from '@/types/v2/File/Rr/RrFile';

declare const __static: string;


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
                                    const isLoading = ref<boolean>( true );
                                    const map       = ref();

                                    const formattedAddress = computed( () => {
                                      if ( props.fileData.beneficiary !== undefined ) {
                                        return `${ props.fileData.beneficiary.address }, ${ props.fileData.beneficiary.zipCode } ${ props.fileData.beneficiary.city }`;
                                      }

                                      return '';
                                    } );


                                    watchEffect( async () => {
                                      console.log( '%c__c ON WATHC MAP', 'background: #fdd835; color: #000000' );
                                      if ( map.value !== undefined ) {
                                        console.log( '%c__c ON WATHC MAP NOT NULL',
                                                     'background: #0094BE; color: #000000' );
                                        isLoading.value = true;
                                        let coordinate;
                                        if ( formattedAddress.value !== '' ) {
                                          coordinate = await geocodingAddress( formattedAddress.value );
                                          if ( coordinate === null ) {
                                            coordinate = [ -1.1220979, 46.1703322 ];
                                          }
                                        } else {
                                          coordinate = [ -1.1220979, 46.1703322 ];
                                        }

                                        map.value.setCenter( {
                                                               x:          coordinate[ 0 ],
                                                               y:          coordinate[ 1 ],
                                                               projection: 'CRS:84',
                                                             } );
                                        console.log( '__c coordinate', coordinate );
                                        // const icon = path.join( __static, `/map/home.png` );
                                        // console.log( '__c ICON PATH', icon );

                                        map.value.setMarkersOptions( [
                                                                       {
                                                                         position: {
                                                                           x:          coordinate[ 0 ],
                                                                           y:          coordinate[ 1 ],
                                                                           projection: 'CRS:84',
                                                                         },
                                                                       },
                                                                     ] );


                                        isLoading.value = false;
                                      }
                                    } );

                                    onMounted( async () => {
                                      // On charge la map que lorsque l'on est en prod
                                      // if ( process.env.NODE_ENV !== 'development' ) {
                                      if ( process.env.NODE_ENV === 'development' ) {
                                        // On récupère les coordonnées de l'adresse
                                        let coordinate;
                                        if ( formattedAddress.value !== '' ) {
                                          coordinate = await geocodingAddress( formattedAddress.value );
                                          if ( coordinate === null ) {
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
                                                },
                                              },
                                            },
                                        );
                                      }
                                    } );

                                    return {
                                      isLoading,
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
