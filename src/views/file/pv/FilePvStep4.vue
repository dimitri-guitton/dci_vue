<template>
    <div class="w-100">

        <step4-header :payment-on-credit="fileData.quotation.paymentOnCredit"
                      :price="price"
                      :lists="lists"
                      :file="fileData"></step4-header>

        <step4-quotation-header></step4-quotation-header>

        <!--        <selected-product :products="products"-->
        <!--                          :selectedProducts="selectedProducts"-->
        <!--                          @selectedProductIsUpdated="updateSelectedProduct"></selected-product>-->

        <div class="col-md-6 mb-5">
            <label for="q_quantity" class="form-label">Nombre de panneaux</label>

            <Field name="q_quantity"
                   id="q_quantity"
                   class="form-select"
                   as="select"
                   v-model="quantity">
                <option v-for="index in 22" :key="index+2" :value="index + 2">{{ index + 2 }}</option>
            </Field>
        </div>

        <selected-product ref="$selectedPannels"
                          :products="computedPannels"
                          :selectedProducts="computedSelectedPannels"
                          @selectedProductIsUpdated="updateSelectedProduct"
                          :index="0"></selected-product>

        <selected-product ref="$selectedOnduleurs"
                          :products="computedOnduleurs"
                          :selectedProducts="computedSelectedOnduleurs"
                          @selectedProductIsUpdated="updateSelectedProduct"
                          :index="1"></selected-product>

        <selected-product ref="$selectedPasserelles"
                          :products="computedPasserelles"
                          :selectedProducts="computedSelectedPasserelles"
                          @selectedProductIsUpdated="updateSelectedProduct"
                          :index="2"></selected-product>

        <options @optionsAreUpdated="updateOptions" :options="computedOptions"></options>

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
                <button type="button" @click="generateAddressCertificate" class="btn btn-outline btn-outline-info">
                    Générer
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
import { getCodeBonus, getLessThan2Year } from '@/services/data/dataService';
import PvList from '@/types/v2/File/Pv/PvList';
import { PvFile } from '@/types/v2/File/Pv/PvFile';

export default defineComponent( {
                                    name:       'file-pv-step-4',
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

                                        for ( const selectedProduct of _selectedProducts.value ) {
                                            if ( selectedProduct.productType === 'pv' ) {
                                                quantity.value = selectedProduct.quantity;
                                            }

                                            if ( selectedProduct.productType === 'onduleur' ) {
                                                quantity.value = selectedProduct.quantity;
                                            }
                                        }


                                        const $selectedPannels     = ref( null );
                                        const $selectedOnduleurs   = ref( null );
                                        const $selectedPasserelles = ref( null );

                                        const generateQuotation = () => {
                                            ctx.emit( 'generateQuotation' );
                                        };

                                        const generateAddressCertificate = () => {
                                            ctx.emit( 'generateAddressCertificate' );
                                        };

                                        // const updateSelectedProduct = ( product ) => {
                                        //     _selectedProducts.value = [ product ];
                                        // };

                                        const updateSelectedProduct = ( product ) => {
                                            console.log( '%c UPDATE SELECTED PRODUCT ',
                                                         'background: #FEFF00; color: #000000' );
                                            console.log( product );
                                            let index = 0;
                                            console.log( 'BEFORE -->', _selectedProducts.value );
                                            for ( const p of _selectedProducts.value ) {
                                                console.log( '%c ON FOR', 'background: #fdd835; color: #000000' );
                                                if ( p.productType === product.productType ) {
                                                    _selectedProducts.value[ index ] = product;
                                                }
                                                index++;
                                            }
                                            console.log( 'AFTER --> ', _selectedProducts.value );
                                        };


                                        const updateOptions = ( options ) => {
                                            _options.value = options;
                                        };

                                        const updateBlankOtions = ( blankOptions ) => {
                                            _blankOptions.value = blankOptions;
                                        };

                                        const computedPannels = computed<Product[]>( () => {
                                            const newList                = props.products.filter( p => p.productType === 'pv' );
                                            const filterSelectedProducts = _selectedProducts.value.filter( p => p.productType === 'pv' );

                                            console.log( '%c KO', 'background: #FF80C7; color: #000000' );
                                            console.log( '%c KO', 'background: #FF80C7; color: #000000' );
                                            if ( filterSelectedProducts.length < 1 ) {
                                                console.log( '$selectedPannels.value' );
                                                console.log( $selectedPannels.value );
                                                const newSelectedPannel = ( $selectedPannels.value as any )?.resetSelectedValue(
                                                    newList );
                                                console.log( '%c OK', 'background: #6EC600; color: #000000' );
                                                console.log( '%c OK', 'background: #6EC600; color: #000000' );
                                                console.log( newSelectedPannel );
                                                if ( newSelectedPannel !== undefined ) {
                                                    updateSelectedProduct( newSelectedPannel );
                                                }
                                            }

                                            console.log( '%c COMPUTED PANELS', 'background: #0A00FF; color: #000000' );
                                            console.log( newList );
                                            return newList;
                                        } );

                                        const computedOnduleurs = computed<Product[]>( () => {
                                            const newList                = props.products.filter( p => p.productType === 'onduleur' );
                                            const filterSelectedProducts = _selectedProducts.value.filter( p => p.productType === 'onduleur' );

                                            console.log( '%c KO 2', 'background: #FF80C7; color: #000000' );
                                            console.log( '%c KO 2', 'background: #FF80C7; color: #000000' );
                                            if ( filterSelectedProducts.length < 1 ) {
                                                console.log( '$selectedOnduleurs.value' );
                                                console.log( $selectedOnduleurs.value );
                                                const newSelectedOnduleur = ( $selectedOnduleurs.value as any )?.resetSelectedValue(
                                                    newList );
                                                console.log( '%c OK 2', 'background: #6EC600; color: #000000' );
                                                console.log( '%c OK 2', 'background: #6EC600; color: #000000' );
                                                console.log( newSelectedOnduleur );
                                                if ( newSelectedOnduleur !== undefined ) {
                                                    updateSelectedProduct( newSelectedOnduleur );
                                                }
                                            }

                                            console.log( '%c COMPUTED ONDULEURS',
                                                         'background: #00FF9D; color: #000000' );
                                            console.log( newList );
                                            return newList;
                                        } );

                                        const computedPasserelles = computed<Product[]>( () => {
                                            const newList                = props.products.filter( p => p.productType === 'passerelle' );
                                            const filterSelectedProducts = _selectedProducts.value.filter( p => p.productType === 'passerelle' );

                                            console.log( '%c KO 3', 'background: #FF80C7; color: #000000' );
                                            console.log( '%c KO 3', 'background: #FF80C7; color: #000000' );
                                            if ( filterSelectedProducts.length < 1 ) {
                                                console.log( '$selectedPasserelles.value' );
                                                console.log( $selectedPasserelles.value );
                                                const newSelectedPassrelle = ( $selectedPasserelles.value as any )?.resetSelectedValue(
                                                    newList );
                                                console.log( '%c OK 3', 'background: #6EC600; color: #000000' );
                                                console.log( '%c OK 3', 'background: #6EC600; color: #000000' );
                                                console.log( newSelectedPassrelle );
                                                if ( newSelectedPassrelle !== undefined ) {
                                                    updateSelectedProduct( newSelectedPassrelle );
                                                }
                                            }

                                            console.log( '%c COMPUTED PASSRELLES',
                                                         'background: #F600FF; color: #000000' );
                                            console.log( newList );
                                            return newList;
                                        } );

                                        const updateLaying = ( qte: number ) => {
                                            const layingOption = _options.value.find( o => o.id === 38 );
                                            if ( layingOption === undefined ) {
                                                return;
                                            }

                                            // Change le prix de l'option
                                            _options.value = _options.value.map( o => {
                                                if ( o.id === 38 ) {
                                                    let laying: number;
                                                    if ( qte <= 4 ) {
                                                        laying = 800;
                                                    } else if ( qte === 5 ) {
                                                        laying = 1000;
                                                    } else if ( qte <= 7 ) {
                                                        laying = 1100;
                                                    } else if ( qte <= 10 ) {
                                                        laying = 1500;
                                                    } else if ( qte <= 15 ) {
                                                        laying = 2150;
                                                    } else {
                                                        laying = 2500;
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

                                        const computedSelectedPannels = computed<Product[]>( () => {
                                            console.log( '%c SELECTED PANNELS', 'background: #0A00FF; color: #000000' );
                                            console.log( _selectedProducts.value.filter( p => p.productType === 'pv' ) );

                                            const list = _selectedProducts.value.filter( p => p.productType === 'pv' );
                                            for ( const p of list ) {
                                                p.quantity = quantity.value;
                                                updateSelectedProduct( p );
                                            }
                                            return _selectedProducts.value.filter( p => p.productType === 'pv' );
                                        } );

                                        const computedSelectedOnduleurs = computed<Product[]>( () => {
                                            console.log( '%c SELECTED ONDULEURS',
                                                         'background: #0A0F600FF0FF; color: #000000' );
                                            console.log( _selectedProducts.value.filter( p => p.productType === 'onduleur' ) );

                                            const list = _selectedProducts.value.filter( p => p.productType === 'onduleur' );
                                            for ( const p of list ) {
                                                p.quantity = quantity.value;
                                                updateSelectedProduct( p );
                                            }
                                            return _selectedProducts.value.filter( p => p.productType === 'onduleur' );
                                        } );

                                        const computedSelectedPasserelles = computed<Product[]>( () => {
                                            console.log( '%c SELECTED PASSERELLES',
                                                         'background: #00FF9D; color: #000000' );
                                            console.log( _selectedProducts.value.filter( p => p.productType === 'passerelle' ) );
                                            return _selectedProducts.value.filter( p => p.productType === 'passerelle' );
                                        } );


                                        const price = computed<Price>( () => {
                                            // On utilise props.forceRefresh pour recalculer les prix
                                            if ( props.forceRefresh ) {
                                                console.log( 'NE PAS SUPPRIMER, POUR FORCER LE COMPUTE DES PRICES' );
                                            }

                                            let totalHt    = 0;
                                            let totalPower = 0;


                                            console.log( 'Prix par defaut -->', totalHt );
                                            console.log( _selectedProducts.value );

                                            console.log( '_selectedProducts.value' );
                                            console.log( _selectedProducts.value );
                                            console.log( '_selectedProducts.value' );

                                            for ( const selectedProduct of _selectedProducts.value ) {

                                                console.log( selectedProduct );
                                                if ( selectedProduct.productType === 'pv' ) {
                                                    const power = selectedProduct.power !== undefined
                                                                  ? selectedProduct.power
                                                                  : 0;
                                                    totalPower = selectedProduct.quantity * power;
                                                }
                                                totalHt += selectedProduct.pu * selectedProduct.quantity;
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


                                            console.log( 'total power', totalPower );
                                            let selfConsumptionBonus;
                                            let tva10 = 0;
                                            let tva20 = 0;
                                            let totalTtc: number;
                                            if ( lessThan2Year || totalPower > 3000 ) {
                                                tva20                = 20 * totalHt / 100;
                                                selfConsumptionBonus = ( totalPower / 1000 ) * 320;
                                                totalTtc             = totalHt + tva20;
                                            } else {
                                                tva10                = 10 * totalHt / 100;
                                                selfConsumptionBonus = ( totalPower / 1000 ) * 430;
                                                totalTtc             = totalHt + tva10;
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
                                            computedSelectedPannels,
                                            computedSelectedPasserelles,
                                            computedSelectedOnduleurs,
                                            computedOptions,
                                            quantity,
                                            $selectedPannels,
                                            $selectedOnduleurs,
                                            $selectedPasserelles,
                                        };
                                    },
                                } );
</script>

<style>
textarea {
    resize : none;
}
</style>
