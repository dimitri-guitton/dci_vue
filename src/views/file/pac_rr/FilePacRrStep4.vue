<template>
  <div class="w-100">

    <step4-header></step4-header>

    <div class="row mt-10">
      <div class="col-md-6 mb-5">
        <label for="q_pac_type" class="form-label">Type de pompe à chaleur</label>
        <Field name="q_pac_type"
               id="q_pac_type"
               class="form-select"
               as="select"
               v-model="rrType"
        >
          <template-item-list :lists="lists.rrTypeList"></template-item-list>
        </Field>
      </div>
      <div class="col-md-6 mb-5">
        <label for="q_assortment" class="form-label">Gamme de produit</label>
        <Field name="q_assortment"
               id="q_assortment"
               class="form-select"
               as="select"
               v-model="assortment"
        >
          <template-item-list :lists="assortmentLists"></template-item-list>
        </Field>
      </div>
    </div>

    <template v-if="rrType === 'multi'">
      <div class="col-md-6 fv-row">
        <label class="form-label mb-3">Nombre de pièces</label>
        <Field
            type="number"
            class="form-control"
            name="housingRoomNumber"
            placeholder="1"
            v-model.number="rrMulti.roomNumber"
        />
        <ErrorMessage
            name="housingRoomNumber"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>

      <div class="row mt-10">
        <template v-for="index in rrMulti.roomNumber" v-bind:key="`area${index}`">
          <div class="col-md-2 fv-row">
            <label class="form-label mb-3">Pièce n°{{ index }} <sup><var>m2</var></sup></label>
            <Field
                type="number"
                class="form-control"
                :name="`housingAreaP${index}`"
                placeholder="1"
                v-model="rrMulti[`areaP${index}`]"
            />
          </div>
        </template>
      </div>

    </template>

    <el-divider class="mb-10"></el-divider>

    <step4-quotation-header></step4-quotation-header>

    <template v-for="p in products" v-bind:key="p.reference">
      <row-price :product="p"></row-price>
    </template>
    <template v-if="!products.length">
      <p>Aucun produit de trouvé</p>
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
import { getCodeBonus, getLessThan2Year, getProductByRef, getTva } from '@/services/data/dataService';
import TemplateItemList from '@/components/DCI/input/ItemList.vue';
import RowPrice from '@/components/DCI/wizzard-file/rowPrice.vue';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import RrList from '@/types/v2/File/Rr/RrList';
import RrMulti from '@/types/v2/File/Rr/RrMulti';
import { getPacRrMono, getPacRrMulti } from '@/services/file/RrAlgo';
import { ItemList } from '@/types/v2/File/Common/ItemList';

export default defineComponent( {
                                  name:       'file-pac-rr-step-4',
                                  components: {
                                    RowPrice,
                                    TemplateItemList,
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
                                      type:     Object as () => RrFile,
                                      required: true,
                                    },
                                    forceRefresh: Boolean,  // Pour focer le compute des prix quand on arrive sur la step4
                                  },
                                  emits:      [ 'generateQuotation', 'generateAddressCertificate', 'calculedPrice' ],
                                  setup( props, ctx ) {
                                    const _options      = ref<Option[]>( ( props.options as Option[] ) );
                                    const _blankOptions = ref<BlankOption[]>( ( props.blankOptions as BlankOption[] ) );
                                    const lists         = ref<RrList>( ( props.fileData.lists as RrList ) );


                                    const rrType     = ref<string>( ( props.fileData.quotation.rrType ) );
                                    const assortment = ref<string>( ( props.fileData.quotation.assortment ) );
                                    const rrMulti    = ref<RrMulti>( ( props.fileData.quotation.rrMulti ) );

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

                                    const assortmentLists = computed<ItemList[]>( () => {
                                      if ( rrType.value === 'multi' ) {
                                        if ( assortment.value === 'sensira' ) {
                                          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                                          assortment.value = 'perfera';
                                        }
                                        return lists.value.gammeTypeList.filter( g => g.slug !== 'sensira' );
                                      }
                                      return lists.value.gammeTypeList;
                                    } );

                                    const products = computed<Product[]>(
                                        () => {
                                          console.log( '%c COMPUTED PRODUCTS RR',
                                                       'background: #252FD4; color: #FFFFFF' );

                                          if ( rrType.value === 'mono' ) {
                                            const response = getPacRrMono( props.fileData.housing.area,
                                                                           ( props.fileData.housing.insulationQuality as number ),
                                                                           assortment.value );

                                            const productInt = getProductByRef( response.productInt );
                                            const productExt = getProductByRef( response.productExt );

                                            console.log( productInt );
                                            console.log( productExt );

                                            if ( productInt === undefined || productExt === undefined ) {
                                              return [];
                                            }

                                            return [ productInt, productExt ];

                                          } else {
                                            const response = getPacRrMulti( rrMulti.value,
                                                                            ( props.fileData.housing.insulationQuality as number ),
                                                                            assortment.value );


                                            const productGroup = getProductByRef( response.productGroup );
                                            console.log( 'P group', response.productGroup );
                                            console.log( 'P group', productGroup );

                                            const productPerRoom: Product[] = [];

                                            let hasAnUnavailableProduct = false;
                                            for ( const p of response.productsPerRoom ) {
                                              const product = getProductByRef( p );
                                              console.log( 'p room', p );
                                              console.log( 'p room', product );

                                              if ( product === undefined ) {
                                                hasAnUnavailableProduct = true;
                                                continue;
                                              }
                                              productPerRoom.push( product );
                                            }

                                            if ( hasAnUnavailableProduct || productGroup === undefined ) {
                                              return [];
                                            }

                                            return [ productGroup, ...productPerRoom ];
                                          }

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


                                    return {
                                      deviceToReplace: {
                                        type:  'CCHC',
                                        brand: 'my_marque',
                                        model: 'my_model',
                                      },
                                      lists,
                                      price,
                                      products,
                                      assortment,
                                      rrType,
                                      rrMulti,
                                      assortmentLists,
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
