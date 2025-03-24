<template>
    <div class="w-100">

        <step4-header :file="fileData"
                      :lists="lists"
                      :payment-on-credit="fileData.quotation.paymentOnCredit"
                      :price="price"></step4-header>

        <div class="row mt-10">
            <div class="col-md-4 fv-row">
                <label class="form-label mb-3">Type d'installation</label>
                <!--            v-model.number="averagePricePerKWhInFrance"     -->
                <Field
                    v-model="resaleType"
                    id="resaleType"
                    as="select"
                    class="form-select"
                    name="resaleType"
                >
                    <item-list :lists="resaleTypeList"></item-list>
                </Field>
            </div>
        </div>

        <el-divider class="mb-10"></el-divider>

        <step4-quotation-header></step4-quotation-header>

        <selected-product ref="selectPannels"
                          :index="0"
                          :edit-quantity="true"
                          :products="computedPannels"
                          :selectedProducts="allSelectedProducts"
                          @selectedProductIsUpdated="updateSelectedProduct"
                          @quantityIsUpdated="(v)=>quantity = v"
        ></selected-product>

        <selected-product ref="selectOnduleurs"
                          :index="1"
                          :edit-quantity="true"
                          :products="computedOnduleurs"
                          :selectedProducts="allSelectedProducts"
                          @selectedProductIsUpdated="updateSelectedProduct"
        ></selected-product>

        <selected-product ref="selectCables"
                          :index="3"
                          :edit-quantity="true"
                          :products="computedCables"
                          :selectedProducts="allSelectedProducts"
                          @selectedProductIsUpdated="updateSelectedProduct"
        ></selected-product>

        <selected-product ref="selectElectricite"
                          :index="6"
                          :edit-quantity="true"
                          :products="computedElectricites"
                          :selectedProducts="allSelectedProducts"
                          @selectedProductIsUpdated="updateSelectedProduct"
        ></selected-product>

        <selected-product ref="selectPasserelles"
                          :index="2"
                          :edit-quantity="true"
                          :products="computedPasserelles"
                          :selectedProducts="allSelectedProducts"
                          @selectedProductIsUpdated="updateSelectedProduct"></selected-product>

        <selected-product ref="selectBatteries"
                          :index="4"
                          :edit-quantity="true"
                          :products="computedBateries"
                          :selectedProducts="allSelectedProducts"
                          @selectedProductIsUpdated="updateSelectedProduct"
        ></selected-product>

        <selected-product ref="selectSupportages"
                          :index="5"
                          :edit-quantity="true"
                          :products="computedSupports"
                          :selectedProducts="allSelectedProducts"
                          @selectedProductIsUpdated="updateSelectedProduct"
        ></selected-product>

        <options :options="computedOptions" @optionsAreUpdated="updateOptions"></options>

        <blank-options :options="blankOptions" @optionsAreUpdated="updateBlankOtions"></blank-options>

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
                    class="fv-plugins-message-container invalid-feedback"
                    name="commentary"
                ></ErrorMessage>
            </div>
        </div>

        <el-divider class="mb-10"></el-divider>

        <div class="row mt-5">
            <div class="col-md-6 offset-md-3 d-flex justify-content-around">
                <button class="btn btn-outline btn-outline-info" type="button" @click="generateAddressCertificate">
                    Générer
                    l'attestation
                    d'adresse
                </button>
                <button class="btn btn-info" type="button" @click="generateQuotation">Générer le devis</button>
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
import { getLessThan2Year } from '@/services/data/dataService';
import PvList from '@/types/v2/File/Pv/PvList';
import { PvFile } from '@/types/v2/File/Pv/PvFile';
import ItemList from '@/components/DCI/input/ItemList.vue';

export default defineComponent( {
                                    name:       'file-pv-step-4',
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
                                            type:     Object as () => PvFile,
                                            required: true,
                                        },
                                        forceRefresh:     Boolean,  // Pour focer le compute des prix quand on arrive sur la step4
                                    },
                                    emits:      [ 'generateQuotation', 'generateAddressCertificate', 'calculedPrice' ],
                                    setup( props, ctx ) {
                                        const _selectedProducts = ref<Product[]>( ( props.selectedProducts as Product[] ) );
                                        const _options          = ref<Option[]>( ( props.options as Option[] ) );
                                        const _blankOptions     = ref<BlankOption[]>( ( props.blankOptions as BlankOption[] ) );
                                        const lists             = ref<PvList>( ( props.fileData.lists as PvList ) );
                                        const quantity          = ref<number>( 3 );

                                        const resaleType = ref<string>( props.fileData.quotation.resaleType );

                                        for ( const selectedProduct of _selectedProducts.value ) {
                                            if ( selectedProduct.productType === 'pv' ) {
                                                quantity.value = selectedProduct.quantity;

                                                if ( quantity.value < 3 ) {
                                                    quantity.value = 3;
                                                }
                                                break;
                                            }
                                        }

                                        const selectPannels     = ref( null );
                                        const selectOnduleurs   = ref( null );
                                        const selectPasserelles = ref( null );

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


                                        console.log( 'props.products', props.products );
                                        const generateComputedProducts = ( productType ) => {
                                            return computed<Product[]>( () => {
                                                const newList                = props.products.filter( p => p.productType === productType );
                                                const filterSelectedProducts = _selectedProducts.value.filter( p => p.productType === productType );

                                                if ( filterSelectedProducts.length < 1 ) {
                                                    const newSelectedProduct = ( selectPannels.value as any )?.resetSelectedValue(
                                                        newList );
                                                    if ( newSelectedProduct !== undefined ) {
                                                        updateSelectedProduct( newSelectedProduct );
                                                    }
                                                }

                                                console.log( productType, 'newList', newList );
                                                return newList;
                                            } );
                                        };

                                        const computedPannels      = generateComputedProducts( 'pv' );
                                        const computedOnduleurs    = generateComputedProducts( 'onduleur' );
                                        const computedPasserelles  = generateComputedProducts( 'passerelle' );
                                        const computedCables       = generateComputedProducts( 'cable' );
                                        const computedBateries     = generateComputedProducts( 'batterie' );
                                        const computedSupports     = generateComputedProducts( 'supportage' );
                                        const computedElectricites = generateComputedProducts( 'electricite' );
                                        // console.log( 'Computeds products',{
                                        //     computedPannels,
                                        //     computedOnduleurs,
                                        //     computedPasserelles,
                                        //     computedCables,
                                        //     computedBateries,
                                        //     computedSupports,
                                        //
                                        // } );

                                        const updateLaying = ( qte: number ) => {
                                            const layingOption = _options.value.find( o => o.id === 38 );
                                            if ( layingOption === undefined ) {
                                                return;
                                            }

                                            // Change le prix de l'option
                                            _options.value = _options.value.map( o => {
                                                if ( o.id === 38 ) {
                                                    let laying = o.defaultPu;

                                                    if ( qte >= 6 && qte <= 8 ) {
                                                        laying += 500;
                                                    } else if ( qte >= 9 && qte <= 13 ) {
                                                        laying += 1000;
                                                    } else if ( qte >= 14 ) {
                                                        laying += 1500;
                                                    }

                                                    return { ...o, pu: laying };
                                                }
                                                return o;
                                            } );
                                        };


                                        const computedOptions = computed<Option[]>( () => {
                                            updateLaying( quantity.value );

                                            return _options.value;
                                        } );


                                        const price = computed<Price>( () => {
                                            // On utilise props.forceRefresh pour recalculer les prix
                                            if ( props.forceRefresh ) {
                                                console.log( 'NE PAS SUPPRIMER, POUR FORCER LE COMPUTE DES PRICES' );
                                            }

                                            let totalHt    = 0;
                                            let totalPower = 0;


                                            for ( const selectedProduct of _selectedProducts.value ) {
                                                if ( selectedProduct.productType === 'pv' ) {
                                                    const power = selectedProduct.power !== undefined
                                                                  ? selectedProduct.power
                                                                  : 0;
                                                    totalPower  = selectedProduct.quantity * power;
                                                }
                                                totalHt += selectedProduct.pu * selectedProduct.quantity;
                                            }

                                            for ( const option of _options.value ) {
                                                if ( option.number > 0 ) {
                                                    totalHt += option.pu * option.number;
                                                }
                                            }

                                            for ( const option of _blankOptions.value ) {
                                                if ( option.number > 0 && option.label !== '' ) {
                                                    totalHt += option.pu * option.number;
                                                }
                                            }

                                            const lessThan2Year = getLessThan2Year();


                                            let selfConsumptionBonus = 0;
                                            let tva10                = 0;
                                            let tva20                = 0;
                                            let totalTtc: number;

                                            // Inférieur ou égal à 3kwc : 510€ par kwc
                                            // Supérieur a 3kwc jusqu à 9kwc inclus : 380€ par kwc
                                            // Au dessus 9 kwc jusqu à 36 kwc : 210 € par kwc

                                            if ( totalPower <= 3000 ) {
                                                selfConsumptionBonus = ( totalPower / 1000 ) * 510;
                                            } else if ( totalPower > 3000 && totalPower <= 9000 ) {
                                                selfConsumptionBonus = ( totalPower / 1000 ) * 380;
                                            } else {
                                                selfConsumptionBonus = ( totalPower / 1000 ) * 210;
                                            }
                                            console.log( 'totalPower', totalPower );
                                            console.log( 'selfConsumptionBonus', selfConsumptionBonus );

                                            // Modification de la TVA en fonction de l'ancienneté de la maison et de la puissance
                                            if ( lessThan2Year || totalPower > 3000 ) {
                                                tva20    = 20 * totalHt / 100;
                                                totalTtc = totalHt + tva20;
                                            } else {
                                                tva10    = 10 * totalHt / 100;
                                                totalTtc = totalHt + tva10;
                                            }

                                            const price: Price = {
                                                HT:             totalHt,
                                                TVA:            0,
                                                TVA10:          tva10,
                                                TVA20:          tva20,
                                                TTC:            totalTtc,
                                                remainderToPay: totalTtc,
                                                selfConsumptionBonus,
                                            };

                                            ctx.emit( 'calculedPrice', price );


                                            return price;
                                        } );

                                        return {
                                            price,
                                            lists,
                                            updateSelectedProduct,
                                            updateOptions,
                                            updateBlankOtions,
                                            generateQuotation,
                                            generateAddressCertificate,
                                            computedPannels,
                                            computedPasserelles,
                                            computedOnduleurs,
                                            computedCables,
                                            computedBateries,
                                            computedSupports,
                                            computedElectricites,
                                            allSelectedProducts: _selectedProducts,
                                            computedOptions,
                                            quantity,
                                            selectPannels,
                                            selectOnduleurs,
                                            selectPasserelles,
                                            resaleType,
                                            resaleTypeList: [
                                                {
                                                    slug:  'surplusResale',
                                                    value: 'Revente du surplus',
                                                },
                                                {
                                                    slug:  'totalResale',
                                                    value: 'Revente totale',
                                                },
                                                {
                                                    slug:  'sufficiency',
                                                    value: 'Autoconsommation',
                                                },
                                                {
                                                    slug:  'full-sufficiency',
                                                    value: 'Autoconsommation Totale avec Batterie Virtuelle',
                                                },

                                            ],
                                        };
                                    },
                                } );
</script>

<style>
textarea {
    resize : none;
}
</style>
