<template>
    <div class="w-100">

        <step4-header :file="fileData"
                      :lists="lists"
                      :payment-on-credit="fileData.quotation.paymentOnCredit"
                      :price="price"></step4-header>

        <step4-quotation-header></step4-quotation-header>

        <div class="row mt-10">
            <div class="col-md-6 mb-5">
                <label class="form-label" for="outsideSocket">Type de carport</label>
                <Field
                    id="carportType"
                    v-model="carportType"
                    as="select"
                    class="form-select"
                    name="carportType">
                    <option value="toiture_bac_acier">Bac Acier</option>
                    <option value="toiture_isotoit">Isotoit</option>
                </Field>
            </div>
        </div>

        <selected-product
            ref="$selectedProduct"
            :products="computedProducts"
            :selectedProducts="selectedProducts"
            @selectedProductIsUpdated="updateSelectedProduct"
            @selectedColorIsUpdated="updateSelectedColorPrice"
        ></selected-product>

        <options :options="options" @optionsAreUpdated="updateOptions"></options>

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
import { CpvFile } from '@/types/v2/File/Cpv/CpvFile';
import { BaseList } from '@/types/v2/File/Common/BaseList';
import { ProductColor } from '@/types/v2/File/Common/ProductColor';
import { numberToPrice } from '../../../services/commonService';

export default defineComponent( {
                                    name:       'file-cpv-step-4',
                                    methods:    { numberToPrice },
                                    components: {
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
                                            type:     Object as () => CpvFile,
                                            required: true,
                                        },
                                        forceRefresh:     Boolean,  // Pour focer le compute des prix quand on arrive sur la step4
                                    },
                                    emits:      [ 'generateQuotation', 'generateAddressCertificate', 'calculedPrice' ],
                                    setup( props, ctx ) {
                                        const _selectedProducts = ref<Product[]>( ( props.selectedProducts as Product[] ) );
                                        const _options          = ref<Option[]>( ( props.options as Option[] ) );
                                        const _blankOptions     = ref<BlankOption[]>( ( props.blankOptions as BlankOption[] ) );
                                        const lists             = ref<BaseList>( ( props.fileData.lists as BaseList ) );

                                        const colorPrice  = ref<number>( 0 );
                                        const carportType = ref<string>( 'toiture_bac_acier' );

                                        const generateQuotation = () => {
                                            ctx.emit( 'generateQuotation' );
                                        };

                                        const generateAddressCertificate = () => {
                                            ctx.emit( 'generateAddressCertificate' );
                                        };

                                        const updateSelectedProduct = ( product ) => {
                                            _selectedProducts.value = [ product ];
                                        };

                                        const updateSelectedColorPrice = ( price ) => {
                                            colorPrice.value = price;
                                        };

                                        const updateOptions = ( options ) => {
                                            _options.value = options;
                                        };

                                        const updateBlankOtions = ( blankOptions ) => {
                                            _blankOptions.value = blankOptions;
                                        };

                                        const $selectedProduct = ref( null );

                                        const colors = computed<ProductColor[]>( () => {
                                            console.log( '%c IN COLORS COMPUTED',
                                                         'background: #fdd835; color: #000000' );
                                            if ( _selectedProducts.value.length > 0 ) {
                                                const selectedProduct = _selectedProducts.value[ 0 ];
                                                if ( selectedProduct.productColors !== undefined ) {
                                                    return selectedProduct.productColors;
                                                }
                                            }

                                            console.log( '%c RETURN EMPTY', 'background: #FF3A44; color: #000000' );
                                            return [];

                                        } );

                                        const computedProducts = computed<Product[]>( () => {
                                            const newList = props.products.filter( p => {
                                                return p.type === carportType.value;
                                            } );

                                            if ( newList.length > 0 ) {
                                                const newSelectedProduct = ( $selectedProduct.value as any )?.resetSelectedValue(
                                                    newList );
                                                if ( newSelectedProduct !== undefined ) {
                                                    updateSelectedProduct( newSelectedProduct );
                                                }
                                            }

                                            return newList;
                                        } );

                                        const price = computed<Price>( () => {
                                            // On utilise props.forceRefresh pour recalculer les prix
                                            if ( props.forceRefresh ) {
                                                console.log( 'NE PAS SUPPRIMER, POUR FORCER LE COMPUTE DES PRICES' );
                                            }

                                            let totalHt = 0;

                                            for ( const selectedProduct of _selectedProducts.value ) {
                                                totalHt += +selectedProduct.pu;
                                            }

                                            totalHt += colorPrice.value;

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

                                            const tva = 20;

                                            const totalTva = tva * totalHt / 100;
                                            const totalTtc = totalHt + totalTva;

                                            const price: Price = {
                                                HT:             totalHt,
                                                TVA:            lessThan2Year ? 0 : totalTva,
                                                TVA20:          lessThan2Year ? totalTva : 0,
                                                TTC:            totalTtc,
                                                remainderToPay: totalTtc,
                                            };

                                            ctx.emit( 'calculedPrice', price );


                                            return price;
                                        } );

                                        return {
                                            price,
                                            lists,
                                            computedProducts,
                                            carportType,
                                            colors,
                                            updateSelectedProduct,
                                            updateSelectedColorPrice,
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
