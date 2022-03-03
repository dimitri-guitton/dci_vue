<template>
  <div class="w-100">

    <step4-header></step4-header>

    <!--    <div class="row mt-10">-->
    <!--      <h1>Values</h1>-->
    <!--      <ul>-->
    <!--        <li>isKitBiZone : {{ isKitBiZone }}</li>-->
    <!--        <li>isEcsDeporte : {{ isEcsDeporte }}</li>-->
    <!--        <li>volumeECS : {{ volumeECS }}</li>-->
    <!--        <li>volumeECSDeporte : {{ volumeECSDeporte }}</li>-->
    <!--        <li>cascadeSystem : {{ cascadeSystem }}</li>-->
    <!--      </ul>-->
    <!--    </div>-->

    <div class="row mt-10">
      <div class="col-md-6 mb-5">
        <label for="deviceToReplaceType" class="form-label">Appareil à remplacer</label>
        <Field name="deviceToReplaceType"
               id="deviceToReplaceType"
               class="form-select"
               as="select"
               v-model="deviceToReplace.type"
        >
          <item-list :lists="lists.typeChaudiereList"></item-list>
        </Field>
      </div>
      <template v-if="deviceToReplace.type !== 'aucun'">
        <div class="col-md-3 mb-5">
          <label for="deviceToReplaceBrand" class="form-label mb-3">Marque</label>
          <Field
              type="text"
              name="deviceToReplaceBrand"
              id="deviceToReplaceBrand"
              class="form-control"
              v-model="deviceToReplace.brand"

          >
          </Field>
        </div>
        <div class="col-md-3 mb-5">
          <label for="deviceToReplaceModel" class="form-label mb-3">Modèle</label>
          <Field
              type="text"
              name="deviceToReplaceModel"
              id="deviceToReplaceModel"
              class="form-control"
              v-model="deviceToReplace.model"
          >
          </Field>
        </div>
      </template>
    </div>
    <div class="row mt-10 d-flex align-items-end">
      <div class="col-md-6 mb-5">
        <label for="isEcsDeporte" class="form-check form-switch form-check-custom">
          <Field
              type="checkbox"
              class="form-check-input h-30px w-55px"
              name="isEcsDeporte"
              id="isEcsDeporte"
              :value="true"
              v-model="isEcsDeporte"
          />
          <span class="form-check-label fw-bold text-gray-600 me-5">Volume ECS déporté</span>
        </label>
      </div>
      <template v-if="isEcsDeporte">
        <div class="col-md-6 mb-5">
          <label for="volumeECSDeporte" class="form-label">Volume ECS déporté</label>

          <Field name="volumeECSDeporte"
                 id="volumeECSDeporte"
                 class="form-select"
                 as="select"
                 v-model.number="volumeECSDeporte"

          >
            <option :value="150">150</option>
            <option :value="200">200</option>
            <option :value="300">300</option>
          </Field>
        </div>
      </template>
      <template v-else>
        <div class="col-md-6 mb-5">
          <label for="volumeECS" class="form-label">Volume ECS</label>

          <Field name="volumeECS"
                 id="volumeECS"
                 class="form-select"
                 as="select"
                 v-model.number="volumeECS"
          >
            <option :value="0">0</option>
            <option :value="180">180</option>
            <option :value="230">230</option>
          </Field>
        </div>
      </template>

    </div>
    <div class="row mt-10">
      <div class="col-md-6 mb-5">
        <label for="isKitBiZone" class="form-check form-switch form-check-custom">
          <Field
              type="checkbox"
              class="form-check-input h-30px w-55px"
              name="isKitBiZone"
              id="isKitBiZone"
              :value="true"
              v-model="isKitBiZone"
          />
          <span class="form-check-label fw-bold text-gray-600 me-5">Kit Bi-zone</span>
        </label>
      </div>
    </div>

    <el-divider class="mb-10"></el-divider>

    <step4-quotation-header></step4-quotation-header>

    <template v-for="p in products" v-bind:key="p.reference">
      <row-price :product="p"></row-price>
    </template>

    <template v-for="kit in selectedKitCascade" v-bind:key="kit.reference">
      <row-price :product="kit"></row-price>
    </template>

    <template v-for="ecs in selectedEcsDeportes" v-bind:key="ecs.reference">
      <row-price :product="ecs"></row-price>
    </template>

    <template v-for="kit in selectedKitBiZones" v-bind:key="kit.reference">
      <row-price :product="kit"></row-price>
    </template>

    <!-- Formualaire caché afin de binder les values au formaulaire comme la sélection des produits se fait via l'algo-->
    <div class="row d-none">
      <label for="cascadeSystem" class="form-check form-switch form-check-custom">
        <Field
            type="checkbox"
            class="form-check-input h-30px w-55px"
            name="cascadeSystem"
            id="cascadeSystem"
            :value="true"
            v-model="cascadeSystem"
        />
      </label>
    </div>

    <!-- Formualaire caché afin de binder les values au formaulaire comme la sélection des produits se fait via l'algo-->
    <template v-for="(p, index) in allProducts" v-bind:key="`val_${p.reference}`">
      <div class="row d-none">
        <Field type="text"
               :name="`selectedProducts[${index}].id`"
               class="form-control"
               v-model.number="p.id" />
        <Field type="text"
               :name="`selectedProducts[${index}].quantity`"
               class="form-control"
               v-model.number="p.quantity" />
        <Field type="text"
               :name="`selectedProducts[${index}].pu`"
               class="form-control"
               v-model.number="p.pu" />
      </div>
    </template>

    <options @optionsAreUpdated="updateOptions" :options="options"></options>

    <blank-options @optionsAreUpdated="updateBlankOtions" :options="blankOptions"></blank-options>

    <wizzard-file-price :price="price"></wizzard-file-price>

    <div class="row mt-10">
      <div class="col-md-12 fv-row">
        <label class="form-label mb-3">Commentaire</label>
        <Field
            as="textarea"
            class="form-control form-control-lg"
            name="commentary"
            placeholder="RAS"
            value=""
        />
        <ErrorMessage
            name="commentary"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>
    </div>

    <el-divider class="mb-10"></el-divider>

    <div class="row mt-5">
      <div class="col-md-6 offset-md-3 d-flex justify-content-around">
        <button type="button" @click="generateAddressCertificate" class="btn btn-outline btn-outline-info">Générer
                                                                                                           l'attestation
                                                                                                           d'adresse
        </button>
        <button type="button" @click="generateQuotation" class="btn btn-info">Générer le devis</button>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import { Product } from '@/types/v2/File/Common/Product';
import Step4QuotationHeader from '@/components/DCI/wizzard-file/Step4QuotationHeader.vue';
import Options from '@/components/DCI/input/Options.vue';
import { Option } from '@/types/v2/File/Common/Option';
import BlankOptions from '@/components/DCI/input/BlankOptions.vue';
import { BlankOption } from '@/types/v2/File/Common/BlankOption';
import WizzardFilePrice from '@/components/DCI/wizzard-file/Price.vue';
import Step4Header from '@/components/DCI/wizzard-file/Step4Header.vue';
import { Price } from '@/services/file/wizzard/Price';
import { getCodeBonus, getLessThan2Year, getTva } from '@/services/data/dataService';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import RoList from '@/types/v2/File/Ro/RoList';
import ItemList from '@/components/DCI/input/ItemList.vue';
import RowPrice from '@/components/DCI/wizzard-file/rowPrice.vue';
import { calcRequiredPower } from '@/services/file/RoAlgo2';

export default defineComponent( {
                                  name:       'file-pac-ro-step-4',
                                  components: {
                                    RowPrice,
                                    ItemList,
                                    Step4Header,
                                    WizzardFilePrice,
                                    BlankOptions,
                                    Options,
                                    Step4QuotationHeader,
                                    Field,
                                    ErrorMessage,
                                  },
                                  props:      {
                                    options:      Array as () => Option[],
                                    blankOptions: Array as () => BlankOption[],
                                    fileData:     {
                                      type:     Object as () => RoFile,
                                      required: true,
                                    },
                                    forceRefresh: Boolean,  // Pour focer le compute des prix quand on arrive sur la step4
                                  },
                                  emits:      [ 'generateQuotation', 'generateAddressCertificate', 'calculedPrice' ],
                                  setup( props, ctx ) {
                                    const _options      = ref<Option[]>( ( props.options as Option[] ) );
                                    const _blankOptions = ref<BlankOption[]>( ( props.blankOptions as BlankOption[] ) );
                                    const lists         = ref<RoList>( ( props.fileData.lists as RoList ) );

                                    const deviceToReplace  = ref( props.fileData.quotation.deviceToReplace );
                                    const isKitBiZone      = ref<boolean>( props.fileData.quotation.isKitBiZone );
                                    const isEcsDeporte     = ref<boolean>( props.fileData.quotation.isEcsDeporte );
                                    const volumeECS        = ref<number>( props.fileData.quotation.volumeECS );
                                    const volumeECSDeporte = ref<number>( props.fileData.quotation.volumeECSDeporte );
                                    const cascadeSystem    = ref<boolean>( props.fileData.quotation.cascadeSystem );

                                    const generateQuotation = () => {
                                      ctx.emit( 'generateQuotation' );
                                    };

                                    const generateAddressCertificate = () => {
                                      ctx.emit( 'generateAddressCertificate' );
                                    };

                                    const updateOptions = ( options ) => {
                                      _options.value = options;
                                    };

                                    const updateBlankOtions = ( blankOptions ) => {
                                      _blankOptions.value = blankOptions;
                                    };

                                    const updateCascadeSystem = ( value: boolean ) => {
                                      cascadeSystem.value = value;
                                    };
                                    const resetVolumeECS      = ( isEcsDeporte: boolean ) => {
                                      if ( isEcsDeporte ) {
                                        volumeECS.value = 0;
                                      } else {
                                        volumeECSDeporte.value = 150;
                                      }
                                    };

                                    const kitBiZones = props.fileData.quotation.products.filter( p => p.productType === 'kit_bi_zone' );
                                    const ecsDeporte = props.fileData.quotation.products.filter( p => p.productType === 'ecs' );
                                    const kitCascade = props.fileData.quotation.products.filter( p => p.productType === 'kit_cascade' );

                                    const selectedEcsDeportes = computed<Product[]>( () => {
                                      // Reset le volume si jaais on switch en ECS et ECSDeporté
                                      resetVolumeECS( isEcsDeporte.value );

                                      if ( !isEcsDeporte.value ) {
                                        return [];
                                      }
                                      return ecsDeporte.filter( ecs => ecs.volume === volumeECSDeporte.value );
                                    } );

                                    const selectedKitCascade = computed<Product[]>( () => {
                                      console.log( '%c KIT CASCADE', 'background: #fdd835; color: #000000' );
                                      console.log( cascadeSystem );
                                      if ( !cascadeSystem.value ) {
                                        return [];
                                      }
                                      return kitCascade;
                                    } );

                                    const selectedKitBiZones = computed<Product[]>( () => {
                                      if ( !isKitBiZone.value ) {
                                        return [];
                                      }
                                      return kitBiZones;
                                    } );


                                    const products = computed<Product[]>(
                                        () => {

                                          const response = calcRequiredPower( props.fileData.housing );
                                          console.log( 'Response', response );
                                          return [];
                                          // const response = getPacRo( props.fileData.quotation.ceilingHeight,
                                          //                            props.fileData.housing.area,
                                          //                            props.fileData.energyZone,
                                          //                            props.fileData.housing.buildingCoefficient,
                                          //                            ( props.fileData.housing.availableVoltage as string ),
                                          //                            volumeECS.value );
                                          //
                                          //
                                          // const productInt = getProductByRef( response.productInt );
                                          // const productExt = getProductByRef( response.productExt );
                                          //
                                          // if ( productInt === undefined || productExt === undefined ) {
                                          //   console.log( '%c NOT FOUD', 'background: #FF0017; color: #000000' );
                                          //   return [];
                                          // }
                                          //
                                          // // Système cascade  = 2 produits
                                          // if ( response.cascadeSystem ) {
                                          //   productInt.quantity = 2;
                                          //   productExt.quantity = 2;
                                          // } else {
                                          //   productInt.quantity = 1;
                                          //   productExt.quantity = 1;
                                          // }
                                          //
                                          // updateCascadeSystem( response.cascadeSystem );
                                          //
                                          // return [ productInt, productExt ];
                                        } );

                                    const allProducts = computed<Product[]>( () => {
                                      console.log( '%c COMPUTED ALLPRoducts', 'background: #fdd835; color: #000000' );
                                      console.log( [
                                                     ...selectedEcsDeportes.value,
                                                     ...selectedKitCascade.value,
                                                     ...selectedKitBiZones.value,
                                                     ...products.value,
                                                   ] );
                                      return [
                                        ...selectedEcsDeportes.value,
                                        ...selectedKitCascade.value,
                                        ...selectedKitBiZones.value,
                                        ...products.value,
                                      ];
                                    } );

                                    const price = computed<Price>( () => {
                                      let totalHt      = 0;
                                      let maPrimeRenov = 0;
                                      let ceeBonus     = 0;

                                      console.log( 'Prix par defaut -->', totalHt );

                                      for ( const product of products.value ) {
                                        totalHt += product.pu * product.quantity;
                                      }
                                      console.log( 'Prix avec les produits -->', totalHt );

                                      for ( const product of selectedEcsDeportes.value ) {
                                        totalHt += product.pu * product.quantity;
                                      }

                                      for ( const product of selectedKitCascade.value ) {
                                        totalHt += product.pu * product.quantity;
                                      }

                                      for ( const product of selectedKitBiZones.value ) {
                                        totalHt += product.pu * product.quantity;
                                      }

                                      for ( const option of _options.value ) {
                                        if ( option.number > 0 ) {
                                          totalHt += option.pu * option.number;
                                        }
                                      }

                                      console.log( 'Prix avec les options -->', totalHt );

                                      for ( const option of _blankOptions.value ) {
                                        if ( option.number > 0 && option.label !== '' ) {
                                          totalHt += option.pu * option.number;
                                        }
                                      }
                                      console.log( 'Prix avec les options vides -->', totalHt );

                                      const codeBonus = getCodeBonus();
                                      console.log( 'Code prime --> ', codeBonus );
                                      const lessThan2Year = getLessThan2Year();
                                      console.log( 'Moins de 2 ans --> ', lessThan2Year );

                                      const tva      = getTva();
                                      const totalTva = tva * totalHt / 100;
                                      const totalTtc = totalHt + totalTva;

                                      // TODO PRIMCE CEEE MAPRIME RENOV
                                      ceeBonus     = 100;
                                      maPrimeRenov = 100;
                                      // if ( !lessThan2Year ) {
                                      //   if ( !props.fileData.disabledCeeBonus ) {
                                      //     ceeBonus = getCetCeeBonus( ( props.fileData as BaseFile ) );
                                      //   }
                                      //
                                      //   if ( !props.fileData.disabledMaPrimeRenovBonus ) {
                                      //     maPrimeRenov = getMaPrimeRenov( props.fileData.type,
                                      //                                     totalTtc,
                                      //                                     ceeBonus,
                                      //                                     codeBonus );
                                      //   }
                                      // }


                                      const totalPrime = maPrimeRenov + ceeBonus;

                                      console.log( 'tva', totalTva );
                                      const price: Price = {
                                        HT:             totalHt,
                                        TVA:            lessThan2Year ? 0 : totalTva,
                                        TVA20:          lessThan2Year ? totalTva : 0,
                                        TTC:            totalTtc,
                                        maPrimeRenov:   maPrimeRenov,
                                        remainderToPay: totalTtc - totalPrime,
                                        CEE:            ceeBonus,
                                      };

                                      ctx.emit( 'calculedPrice', price );


                                      return price;
                                    } );

                                    console.log( '%c END SET UP', 'background: #fdd835; color: #000000' );
                                    console.log( ecsDeporte );
                                    console.log( kitBiZones );
                                    console.log( kitCascade );
                                    console.log( products );
                                    console.log( '%c END SET UP', 'background: #fdd835; color: #000000' );

                                    return {
                                      allProducts,
                                      deviceToReplace,
                                      selectedEcsDeportes,
                                      selectedKitCascade,
                                      selectedKitBiZones,
                                      isKitBiZone,
                                      isEcsDeporte,
                                      volumeECS,
                                      volumeECSDeporte,
                                      cascadeSystem,
                                      lists,
                                      price,
                                      products,
                                      updateOptions,
                                      updateBlankOtions,
                                      generateQuotation,
                                      generateAddressCertificate,
                                    };
                                  },
                                } );
</script>

<style>
textarea {
  resize : none;
}
</style>
