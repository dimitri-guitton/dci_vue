<template>
  <div class="w-100">

    <step4-header></step4-header>

    <div class="row mt-10">
      <div class="col-md-6 mb-5">
        <label for="q_outsideSocket" class="form-label">Installation sur prise d'air</label>

        <Field name="q_outsideSocket"
               id="q_outsideSocket"
               class="form-select"
               as="select"
               v-model="outsideSocket">
          <option :value="true">OUI</option>
          <option :value="false">NON</option>
        </Field>
      </div>
      <div class="col-md-6 mb-5">
        <label for="q_type" class="form-label">Marque</label>

        <Field name="q_type"
               id="q_type"
               class="form-select"
               as="select"
               v-model="type">
          <option value="red">Red</option>
          <option value="jm">Jolly Mec</option>
        </Field>
      </div>
      <div class="col-md-6 mb-5">
        <label for="q_power" class="form-label">Puissance (<var>KW</var>)</label>

        <Field name="q_power"
               id="q_power"
               class="form-selectsolid"
               as="select"
               v-model.number="power">
          <item-list :lists="lists.puissancePoeleList"></item-list>
        </Field>
      </div>
      <template v-if="power === 9 && type === 'jm'">
        <div class="col-md-6 mb-5">
          <label for="q_color" class="form-label">Couleur profile</label>

          <Field name="q_color"
                 id="q_color"
                 class="form-select"
                 as="select"
                 v-model="color">
            <item-list :lists="lists.couleurProfileList"></item-list>
          </Field>
        </div>
      </template>
    </div>
    <el-divider class="mb-10"></el-divider>

    <step4-quotation-header></step4-quotation-header>

    <selected-product ref="$selectedPoele"
                      :products="computedPg"
                      :selectedProducts="computedSelectedPg"
                      @selectedProductIsUpdated="updateSelectedProduct"></selected-product>

    <selected-product ref="$selectedFumisterie"
                      :products="computedFumisteries"
                      :selectedProducts="computedSelectedFumisteries"
                      :index="1"
                      @selectedProductIsUpdated="updateSelectedProduct"
    ></selected-product>

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
import SelectedProduct from '@/components/DCI/input/SelectedProduct.vue';
import { Product } from '@/types/v2/File/Common/Product';
import Step4QuotationHeader from '@/components/DCI/wizzard-file/Step4QuotationHeader.vue';
import Options from '@/components/DCI/input/Options.vue';
import { Option } from '@/types/v2/File/Common/Option';
import BlankOptions from '@/components/DCI/input/BlankOptions.vue';
import { BlankOption } from '@/types/v2/File/Common/BlankOption';
import WizzardFilePrice from '@/components/DCI/wizzard-file/Price.vue';
import Step4Header from '@/components/DCI/wizzard-file/Step4Header.vue';
import { Price } from '@/types/v2/File/Price';
import { getCodeBonus, getLessThan2Year, getTva } from '@/services/data/dataService';
import ItemList from '@/components/DCI/input/ItemList.vue';
import PgList from '@/types/v2/File/Pg/PgList';
import { PgQuotation } from '@/types/v2/File/Pg/PgQuotation';
import { PgFile } from '@/types/v2/File/Pg/PgFile';
import { getCeeBonus, getMaPrimeRenov } from '@/services/file/fileCommonService';
import { BaseFile } from '@/types/v2/File/Common/BaseFile';

export default defineComponent( {
                                  name:       'file-pg-step-4',
                                  components: {
                                    ItemList,
                                    Step4Header,
                                    WizzardFilePrice,
                                    BlankOptions,
                                    Options,
                                    Step4QuotationHeader,
                                    SelectedProduct,
                                    Field,
                                    ErrorMessage,
                                  },
                                  props:      {
                                    products:         {
                                      type:     Array as () => Product[],
                                      required: true,
                                    },
                                    selectedProducts: {
                                      type:     Array as () => Product[],
                                      required: true,
                                    },
                                    options:          Array as () => Option[],
                                    blankOptions:     Array as () => BlankOption[],
                                    fileData:         {
                                      type:     Object as () => PgFile,
                                      required: true,
                                    },
                                    forceRefresh:     Boolean,  // Pour focer le compute des prix quand on arrive sur la step4
                                  },
                                  emits:      [ 'generateQuotation', 'generateAddressCertificate', 'calculedPrice' ],
                                  setup( props, ctx ) {
                                    const _selectedProducts = ref<Product[]>( ( props.selectedProducts as Product[] ) );
                                    const _options          = ref<Option[]>( ( props.options as Option[] ) );
                                    const _blankOptions     = ref<BlankOption[]>( ( props.blankOptions as BlankOption[] ) );
                                    const lists             = ref<PgList>( ( props.fileData.lists as PgList ) );

                                    const currentPoele = _selectedProducts.value.find( p => p.productType === 'pg' );

                                    const power         = ref<number>( 6 );
                                    const type          = ref<string>( 'red' );
                                    const color         = ref<string>( 'blanc_creme' );
                                    const outsideSocket = ref<boolean>( false );

                                    const pgQuotation = props.fileData.quotation as PgQuotation;

                                    if ( currentPoele !== undefined ) {
                                      power.value         = currentPoele.power === undefined
                                                            ? power.value
                                                            : currentPoele.power;
                                      type.value          = currentPoele.type == undefined
                                                            ? type.value
                                                            : currentPoele.type;
                                      color.value         = ( currentPoele.color === undefined || currentPoele.color === null )
                                                            ? color.value
                                                            : currentPoele.color;
                                      outsideSocket.value = pgQuotation.outsideSocket;
                                    }


                                    const $selectedPoele      = ref( null );
                                    const $selectedFumisterie = ref( null );

                                    const generateQuotation = () => {
                                      ctx.emit( 'generateQuotation' );
                                    };

                                    const generateAddressCertificate = () => {
                                      ctx.emit( 'generateAddressCertificate' );
                                    };

                                    const updateSelectedProduct = ( product ) => {
                                      let index = 0;
                                      for ( const p of _selectedProducts.value ) {
                                        if ( p.productType === product.productType ) {
                                          _selectedProducts.value[ index ] = product;
                                        }
                                        index++;
                                      }
                                    };

                                    const updateOptions = ( options ) => {
                                      _options.value = options;
                                    };

                                    const updateBlankOtions = ( blankOptions ) => {
                                      _blankOptions.value = blankOptions;
                                    };

                                    const computedFumisteries = computed<Product[]>( () => {
                                      const newList                = props.products.filter( p => p.productType === 'fumisterie' && p.air === outsideSocket.value );
                                      const filterSelectedProducts = _selectedProducts.value.filter( p => p.productType === 'fumisterie' && p.air === outsideSocket.value );

                                      if ( filterSelectedProducts.length < 1 ) {
                                        const newSelectedFumisterie = ( $selectedFumisterie.value as any )?.resetSelectedValue(
                                            newList );
                                        if ( newSelectedFumisterie !== undefined ) {
                                          updateSelectedProduct( newSelectedFumisterie );
                                        }
                                      }

                                      return newList;
                                    } );

                                    const computedSelectedFumisteries = computed<Product[]>( () => {
                                      return _selectedProducts.value.filter( p => p.productType === 'fumisterie' );
                                    } );

                                    const computedPg = computed<Product[]>( () => {
                                      const newList = props.products.filter( p => p.productType === 'pg' && p.type === type.value && p.power === power.value && ( power.value !== 9 || ( power.value === 9 && p.color === color.value ) ) );

                                      const filterSelectedProducts = _selectedProducts.value.filter( p => p.productType === 'pg' && p.type === type.value && p.power === power.value && ( power.value !== 9 || ( power.value === 9 && p.color === color.value ) ) );
                                      if ( filterSelectedProducts.length < 1 ) {
                                        const newSelectedPoele = ( $selectedPoele.value as any )?.resetSelectedValue(
                                            newList );
                                        if ( newSelectedPoele !== undefined ) {
                                          updateSelectedProduct( newSelectedPoele );
                                        }
                                      }
                                      return newList;
                                    } );

                                    const computedSelectedPg = computed<Product[]>( () => {
                                      return _selectedProducts.value.filter( p => p.productType === 'pg' );
                                    } );

                                    const price = computed<Price>( () => {
                                      // On utilise props.forceRefresh pour recalculer les prix
                                      if ( props.forceRefresh ) {
                                        console.log( 'NE PAS SUPPRIMER, POUR FORCER LE COMPUTE DES PRICES' );
                                      }
                                      let totalHt      = 0;
                                      let maPrimeRenov = 0;
                                      let ceeBonus     = 0;

                                      console.log( 'Prix par defaut -->', totalHt );
                                      console.log( _selectedProducts );
                                      console.log( _selectedProducts.value );
                                      for ( const selectedProduct of _selectedProducts.value ) {
                                        console.log( 'SL ->', selectedProduct );
                                        totalHt += selectedProduct.pu;
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

                                      let tva = getTva();
                                      if ( lessThan2Year ) {
                                        tva = 20;
                                      }


                                      const totalTva = tva * totalHt / 100;
                                      const totalTtc = totalHt + totalTva;

                                      if ( !lessThan2Year ) {
                                        // Si les primes sont actives
                                        if ( !props.fileData.disabledBonus ) {

                                          // Si la prime CEE est active
                                          if ( !props.fileData.disabledCeeBonus ) {
                                            ceeBonus = getCeeBonus( ( props.fileData as BaseFile ) );
                                          }

                                          // Si MaprimeRenov est actif
                                          if ( !props.fileData.disabledMaPrimeRenovBonus ) {
                                            maPrimeRenov = getMaPrimeRenov( props.fileData.type, codeBonus );
                                          }
                                        }
                                      }


                                      console.log( 'maPrimeRenov --> ', maPrimeRenov );

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
                                      $selectedPoele,
                                      $selectedFumisterie,
                                      lists,
                                      power,
                                      type,
                                      color,
                                      outsideSocket,
                                      price,
                                      updateSelectedProduct,
                                      updateOptions,
                                      updateBlankOtions,
                                      generateQuotation,
                                      generateAddressCertificate,
                                      computedPg,
                                      computedSelectedPg,
                                      computedFumisteries,
                                      computedSelectedFumisteries,
                                    };
                                  },
                                } );
</script>

<style>
textarea {
  resize : none;
}
</style>
