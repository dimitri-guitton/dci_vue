<template>
  <div class="w-100">

    <step4-header></step4-header>

    <div class="row mt-10">
      <div class="col-md-6 mb-5">
        <label for="pacType" class="form-label">Type de pompe à chaleur</label>
        <Field name="pacType"
               id="pacType"
               class="form-select"
               as="select"
               v-model="rrType"
        >
          <template-item-list :lists="lists.rrTypeList"></template-item-list>
        </Field>
      </div>
      <div class="col-md-6 mb-5" v-if="rrType === 'mono'">
        <label for="assortment" class="form-label">Gamme de produit</label>
        <Field name="assortment"
               id="assortment"
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
          <div class="row d-flex align-items-end">
            <div class="col-md-2">
              <label class="form-label mb-3">Pièce n°{{ index }} <sup><var>m2</var></sup></label>
              <Field
                  type="number"
                  class="form-control"
                  :name="`housingAreaP${index}`"
                  placeholder="1"
                  v-model.number="rrMulti[`areaP${index}`]"
              />
            </div>
            <div class="col-md-4">
              <label :for="`housingAssortmentP${index}`" class="form-label">Gamme de produit</label>
              <Field :name="`housingAssortmentP${index}`"
                     :id="`housingAssortmentP${index}`"
                     class="form-select"
                     as="select"
                     v-model.number="rrMulti[`assortmentP${index}`]"
              >
                <template-item-list :lists="assortmentLists"></template-item-list>
              </Field>
            </div>
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
      <div class="alert alert-danger d-flex align-items-center p-5 mb-10">
        <i class="fa fa-exclamation fs-2hx me-4 text-danger"></i>
        <div class="d-flex flex-column">
          <h4 class="mb-1 text-danger">Aucun produit n'a pu être trouvé</h4>
        </div>
      </div>
    </template>

    <!-- Formualire caché afin de binder les values au formaulaire comme la sélection des produits se fait via l'algo-->
    <template v-for="(p, index) in products" v-bind:key="`val_${p.reference}`">
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

    <options @optionsAreUpdated="updateOptions" :options="filteredOptions"></options>

    <blank-options @optionsAreUpdated="updateBlankOtions" :options="blankOptions"></blank-options>

    <input-discount @discountUpdated="updateDiscount" :discount="discount"></input-discount>

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
import { Price } from '@/types/v2/File/Price';
import { getCodeBonus, getLessThan2Year, getProductByRef } from '@/services/data/dataService';
import TemplateItemList from '@/components/DCI/input/ItemList.vue';
import RowPrice from '@/components/DCI/wizzard-file/rowPrice.vue';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import RrList from '@/types/v2/File/Rr/RrList';
import RrMulti from '@/types/v2/File/Rr/RrMulti';
import { ItemList } from '@/types/v2/File/Common/ItemList';
import { RrAlgo } from '@/services/algorithm/RrAlgo';
import { getCeeBonus } from '@/services/file/fileCommonService';
import InputDiscount from '@/components/DCI/input/Discount.vue';

export default defineComponent( {
                                  name:       'file-pac-rr-step-4',
                                  components: {
                                    InputDiscount,
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
                                    console.log( 'OPTION -->', _options );


                                    const discount   = ref<number>( props.fileData.quotation.discount );
                                    const rrType     = ref<string>( ( props.fileData.quotation.rrType ) );
                                    const assortment = ref<string>( ( props.fileData.quotation.assortment ) );
                                    const rrMulti    = ref<RrMulti>( ( props.fileData.quotation.rrMulti ) );

                                    const rrAlgo = new RrAlgo( props.fileData.housing );

                                    const generateQuotation = () => {
                                      ctx.emit( 'generateQuotation' );
                                    };

                                    const generateAddressCertificate = () => {
                                      ctx.emit( 'generateAddressCertificate' );
                                    };

                                    const updateOptions = ( options ) => {
                                      _options.value = options;
                                    };

                                    const updateDiscount = ( value ) => {
                                      console.log( 'updateDiscount' );
                                      discount.value = value;
                                    };

                                    /**
                                     * Ajoute ou enlève l'option Wifi selon les PAC
                                     */
                                    const enabledWifiOption = ( enabled: boolean ) => {
                                      const wifiOption = _options.value.find( o => o.label === 'Wifi' );
                                      if ( wifiOption === undefined ) {
                                        return;
                                      }

                                      // Change le nombre de l'option WIFI pour l'activer ou non
                                      _options.value = _options.value.map( o => {
                                        if ( enabled && o.label === 'Wifi' ) {
                                          return { ...o, number: 1 };
                                        } else if ( !enabled && o.label === 'Wifi' ) {
                                          return { ...o, number: 0 };
                                        }
                                        return o;
                                      } );
                                    };

                                    const updateBlankOtions = ( blankOptions ) => {
                                      _blankOptions.value = blankOptions;
                                    };

                                    const filteredOptions = computed<Option[]>( () => {
                                      console.log( '%c FILTERED OPTION', 'background: #FF0007; color: #000000' );
                                      console.log( _options.value );

                                      if ( rrType.value === 'multi' || assortment.value !== 'sensira' ) {
                                        enabledWifiOption( false );
                                        return _options.value.filter( o => o.label !== 'Wifi' );
                                      }

                                      enabledWifiOption( true );
                                      return _options.value;
                                    } );

                                    const assortmentLists = computed<ItemList[]>( () => {
                                      if ( rrType.value === 'multi' ) {
                                        return lists.value.gammeTypeList.filter( g => g.slug !== 'sensira' );
                                      }
                                      return lists.value.gammeTypeList;
                                    } );

                                    // TODO au changement d'isolation en multi on garde de vieux PAC
                                    const products = computed<Product[]>(
                                        () => {
                                          console.log( '%c COMPUTED PRODUCTS RR',
                                                       'background: #252FD4; color: #FFFFFF' );

                                          rrAlgo.updateHousing( props.fileData.housing );

                                          console.log( 'GAMME -->', assortment.value );
                                          if ( rrType.value === 'mono' ) {
                                            const response = rrAlgo.getUnitsMono( assortment.value );

                                            if ( response === null ) {
                                              return [];
                                            }

                                            const productExt = getProductByRef( response.unitExt );
                                            const productInt = getProductByRef( response.unitInt );

                                            if ( productExt === undefined || productInt === undefined ) {
                                              return [];
                                            }

                                            return [ productInt, productExt ];
                                          } else {
                                            const response = rrAlgo.getPacRrMulti( rrMulti.value );

                                            if ( response === null ) {
                                              return [];
                                            }

                                            const productGroup              = getProductByRef( response.unitExt );
                                            const productPerRoom: Product[] = [];

                                            let hasAnUnavailableProduct = false;
                                            for ( const p of response.unitsInt ) {
                                              const product = getProductByRef( p );
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
                                      let totalHt  = 0;
                                      let ceeBonus = 0;
                                      let tva10    = 0;
                                      let tva20;

                                      console.log( 'Prix par defaut -->', totalHt );

                                      for ( const product of products.value ) {
                                        totalHt += product.pu * product.quantity;
                                      }
                                      console.log( 'Prix avec les produits -->', totalHt );

                                      for ( const option of _options.value ) {
                                        if ( option.number > 0 ) {
                                          totalHt += option.pu * option.number;

                                          if ( option.calcTva10 === true ) {
                                            tva10 += option.pu * option.number;
                                          }
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


                                      // SI plus de 2 ans
                                      if ( !lessThan2Year ) {
                                        tva10 = tva10 * 0.1;
                                        tva20 = ( totalHt - tva10 ) * 0.2;
                                      } else {
                                        console.log( '%c TVA 10 = 0', 'background: #fdd835; color: #000000' );
                                        tva10 = 0;
                                        tva20 = totalHt * 0.2;
                                      }

                                      const totalTva = tva10 + tva20;
                                      let totalTtc   = totalHt + totalTva;
                                      totalTtc -= discount.value;

                                      if ( !props.fileData.disabledBonus ) {
                                        // Si la prime CEE est active
                                        if ( !props.fileData.disabledCeeBonus ) {
                                          // Afin d'avoir les derniers produits pour le calcul de la prime
                                          const updatedFileData: RrFile = {
                                            ...props.fileData,
                                            quotation: {
                                              ...props.fileData.quotation,
                                              selectedProducts: products.value,
                                            },
                                          };
                                          ceeBonus                      = getCeeBonus( updatedFileData );
                                        }
                                      }

                                      const totalPrime = ceeBonus;

                                      // TODO CHECK TVA 20% quand mons de 2ans
                                      const price: Price = {
                                        HT:             totalHt,
                                        TVA:            0,
                                        TVA10:          tva10,
                                        TVA20:          tva20,
                                        TTC:            totalTtc,
                                        remainderToPay: totalTtc - totalPrime,
                                        CEE:            ceeBonus,
                                        discount:       discount.value,
                                      };

                                      ctx.emit( 'calculedPrice', price );


                                      return price;
                                    } );


                                    return {
                                      lists,
                                      price,
                                      filteredOptions,
                                      products,
                                      assortment,
                                      rrType,
                                      rrMulti,
                                      assortmentLists,
                                      discount,
                                      updateOptions,
                                      updateBlankOtions,
                                      updateDiscount,
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
