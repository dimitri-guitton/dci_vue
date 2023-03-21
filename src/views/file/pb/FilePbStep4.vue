<template>
    <div class="w-100">

        <step4-header :file="fileData"
                      :lists="lists"
                      :payment-on-credit="fileData.quotation.paymentOnCredit"
                      :price="price"
                      @bonusAreUpdated="updateBonus"></step4-header>

        <div class="row mt-10">
            <div class="col-md-6 mb-5">
                <label class="form-check form-switch form-check-custom" for="creation">
                    <Field
                        id="creation"
                        v-model="isCreation"
                        :value="true"
                        class="form-check-input h-30px w-55px"
                        name="creation"
                        type="checkbox"
                    />
                    <span class="form-check-label fw-bold text-gray-600 me-5">Est une création complète</span>
                </label>
            </div>
        </div>

        <el-divider class="mb-10"></el-divider>

        <step4-quotation-header></step4-quotation-header>

        <selected-product :products="filterredProducts"
                          :selectedProducts="selectedProducts"
                          @selectedProductIsUpdated="updateSelectedProduct"></selected-product>

        <template v-for="p in productCreation" v-bind:key="p.reference">
            <row-price :product="p"></row-price>
        </template>

        <!-- Formualire caché afin de binder les values au formaulaire comme la sélection des produits se fait via l'algo-->
        <template v-for="(p, index) in productCreation" v-bind:key="`val_${p.reference}`">
            <div class="row d-none">
                <Field v-model.number="p.id"
                       :name="`selectedProducts[${index+1}].id`"
                       class="form-control"
                       type="text" />
                <Field v-model.number="p.quantity"
                       :name="`selectedProducts[${index+1}].quantity`"
                       class="form-control"
                       type="text" />
                <Field v-model.number="p.pu"
                       :name="`selectedProducts[${index+1}].pu`"
                       class="form-control"
                       type="text" />
            </div>
        </template>

        <options :options="filteredOptions" @optionsAreUpdated="updateOptions"></options>

        <blank-options :options="blankOptions" @optionsAreUpdated="updateBlankOtions"></blank-options>

        <wizzard-file-price :price="price"></wizzard-file-price>

        <template v-if="fileData.disabledMaPrimeRenovBonus">
            <p>Estimation de MaPrimeRénov : {{ estimateMaPrimeRenov }}€</p>
        </template>

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
import { getLessThan2Year, getTva } from '@/services/data/dataService';
import { PbFile } from '@/types/v2/File/Pb/PbFile';
import RowPrice from '@/components/DCI/wizzard-file/rowPrice.vue';
import { getCeeBonus, getMaPrimeRenov } from '@/services/file/fileCommonService';
import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import PbList from '@/types/v2/File/Pb/PbList';

export default defineComponent( {
                                    name:       'file-pb-step-4',
                                    components: {
                                        RowPrice,
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
                                        selectedProducts: Array as () => Product[],
                                        options:          Array as () => Option[],
                                        blankOptions:     Array as () => BlankOption[],
                                        fileData:         {
                                            type:     Object as () => PbFile,
                                            required: true,
                                        },
                                        forceRefresh:     Boolean,  // Pour focer le compute des prix quand on arrive sur la step4
                                    },
                                    emits:      [ 'generateQuotation', 'generateAddressCertificate', 'calculedPrice' ],
                                    setup( props, ctx ) {
                                        const _selectedProducts = ref<Product[]>( ( props.selectedProducts as Product[] ) );
                                        const _options          = ref<Option[]>( ( props.options as Option[] ) );
                                        const _blankOptions     = ref<BlankOption[]>( ( props.blankOptions as BlankOption[] ) );
                                        const lists             = ref<PbList>( ( props.fileData.lists as PbList ) );

                                        const disabledBonus             = ref<boolean>( props.fileData.disabledBonus );
                                        const disabledCeeBonus          = ref<boolean>( props.fileData.disabledCeeBonus );
                                        const disabledMaPrimeRenovBonus = ref<boolean>( props.fileData.disabledMaPrimeRenovBonus );

                                        const estimateMaPrimeRenov = ref<number>( 0 );


                                        const isCreation = ref<boolean>( props.fileData.quotation.newCreation );

                                        const filterredProducts = computed<Product[]>( () => {
                                            return props.products.filter( p => p.productType === 'pb' );
                                        } );

                                        const productCreation = computed<Product[]>( () => {
                                            if ( isCreation.value ) {
                                                return props.products.filter( p => p.productType === 'pb_option' && p.reference === 'creation' );
                                            }
                                            return props.products.filter( p => p.productType === 'pb_option' && p.reference !== 'creation' );
                                        } );

                                        const generateQuotation = () => {
                                            ctx.emit( 'generateQuotation' );
                                        };

                                        const generateAddressCertificate = () => {
                                            ctx.emit( 'generateAddressCertificate' );
                                        };

                                        const updateSelectedProduct = ( product ) => {
                                            _selectedProducts.value = [ product ];
                                        };

                                        const updateOptions = ( options ) => {
                                            _options.value = options;
                                        };

                                        const updateBlankOtions = ( blankOptions ) => {
                                            _blankOptions.value = blankOptions;
                                        };

                                        const updateBonus = ( data: { bonus: boolean; ceeBonus: boolean; maPrimeRenovBonus: boolean } ) => {
                                            disabledBonus.value             = data.bonus;
                                            disabledCeeBonus.value          = data.ceeBonus;
                                            disabledMaPrimeRenovBonus.value = data.maPrimeRenovBonus;
                                        };


                                        /**
                                         * Ajoute ou enlève l'option Porte basse pour les pôeles NORDRÏ
                                         */
                                        const enabledOptionPorteBasse = ( enabled: boolean ) => {
                                            const optionalOption = _options.value.find( o => o.id === 43 );
                                            if ( optionalOption === undefined ) {
                                                return;
                                            }

                                            // Change le nombre de l'option pour l'activer ou non
                                            _options.value = _options.value.map( o => {
                                                if ( enabled && o.id === 43 ) {
                                                    return { ...o, number: 1 };
                                                } else if ( !enabled && o.id === 43 ) {
                                                    return { ...o, number: 0 };
                                                }
                                                return o;
                                            } );
                                        };

                                        /**
                                         * Ajoute ou enlève l'option Kit accumulation pour le pôele NORDRÏ MIDGARD
                                         */
                                        const enabledOptionKitAcu = ( enabled: boolean ) => {
                                            const optionalOption = _options.value.find( o => o.id === 44 );
                                            if ( optionalOption === undefined ) {
                                                return;
                                            }

                                            // Change le nombre de l'option pour l'activer ou non
                                            _options.value = _options.value.map( o => {
                                                if ( enabled && o.id === 44 ) {
                                                    return { ...o, number: 1 };
                                                } else if ( !enabled && o.id === 44 ) {
                                                    return { ...o, number: 0 };
                                                }
                                                return o;
                                            } );
                                        };


                                        const filteredOptions = computed<Option[]>( () => {
                                            // Si Poele NORDRÏ MIDGARD
                                            if ( _selectedProducts.value.length > 0 && _selectedProducts.value[ 0 ].label.toUpperCase()
                                                                                                                   .includes(
                                                                                                                       'NORDRÏ MIDGARD' ) ) {
                                                enabledOptionKitAcu( true );
                                                enabledOptionPorteBasse( true );
                                                return _options.value;
                                            }

                                            // SI pôele NORDRÏ
                                            if ( _selectedProducts.value.length > 0 && _selectedProducts.value[ 0 ].label.toUpperCase()
                                                                                                                   .includes(
                                                                                                                       'NORDRÏ' ) ) {
                                                enabledOptionPorteBasse( true );
                                                enabledOptionKitAcu( false );
                                                return _options.value;

                                            }


                                            enabledOptionPorteBasse( false );
                                            enabledOptionKitAcu( false );
                                            return _options.value;
                                        } );


                                        const price = computed<Price>( () => {
                                            // On utilise props.forceRefresh pour recalculer les prix
                                            if ( props.forceRefresh ) {
                                                console.log( 'NE PAS SUPPRIMER, POUR FORCER LE COMPUTE DES PRICES' );
                                            }
                                            let totalHt      = 0;
                                            let maPrimeRenov = 0;
                                            let ceeBonus     = 0;

                                            for ( const selectedProduct of _selectedProducts.value ) {
                                                if ( selectedProduct.productType !== 'pb_option' ) {
                                                    totalHt += selectedProduct.pu;
                                                }
                                            }

                                            for ( const product of productCreation.value ) {
                                                totalHt += +product.pu;
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


                                            let tva = getTva();
                                            if ( lessThan2Year ) {
                                                tva = 20;
                                            }
                                            const totalTva = tva * totalHt / 100;
                                            const totalTtc = totalHt + totalTva;


                                            if ( !lessThan2Year ) {

                                                // Si les primes sont actives
                                                if ( !disabledBonus.value ) {

                                                    // Si la prime CEE est active
                                                    if ( !disabledCeeBonus.value ) {
                                                        ceeBonus = getCeeBonus( ( props.fileData as BaseFile ) );
                                                    }

                                                    // Si MaprimeRenov est actif
                                                    if ( !disabledMaPrimeRenovBonus.value ) {
                                                        maPrimeRenov = getMaPrimeRenov( props.fileData.type );
                                                    } else {
                                                        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                                                        estimateMaPrimeRenov.value = getMaPrimeRenov( props.fileData.type );
                                                    }
                                                }
                                            }

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
                                            price,
                                            lists,
                                            filterredProducts,
                                            productCreation,
                                            isCreation,
                                            estimateMaPrimeRenov,
                                            updateSelectedProduct,
                                            updateOptions,
                                            updateBlankOtions,
                                            generateQuotation,
                                            generateAddressCertificate,
                                            filteredOptions,
                                            updateBonus,
                                        };
                                    },
                                } );
</script>

<style>
textarea {
    resize : none;
}
</style>
