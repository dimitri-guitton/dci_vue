<template>
    <div class="w-100">

        <step4-header :file="fileData" :lists="lists" :payment-on-credit="fileData.quotation.paymentOnCredit"
                      :price="price" @bonusAreUpdated="updateBonus"></step4-header>

        <div class="col-md-12 mb-15">
            <h6 class="mb-5">Isolation d’un plancher bas situé entre un volume chauffé et un ...</h6>
            <Field id="r_izolation_zone_1"
                   v-model="izolationZone"
                   class="form-check-input ms-5"
                   name="izolationZone"
                   type="radio"
                   value="sous_sol"
            >
            </Field>
            <label class="ms-2" for="r_izolation_zone_1">Sous-sol non chauffé</label>
            <Field id="r_izolation_zone_2"
                   v-model="izolationZone"
                   class="form-check-input ms-5"
                   name="izolationZone"
                   type="radio"
                   value="vide_sanitaire"
            >
            </Field>
            <label class="ms-2" for="r_izolation_zone_2">Vide sanitaire</label>
            <Field id="r_izolation_zone_3"
                   v-model="izolationZone"
                   class="form-check-input ms-5"
                   name="izolationZone"
                   type="radio"
                   value="passage_ouvert"
            >
            </Field>
            <label class="ms-2" for="r_izolation_zone_3">Passage ouvert</label>
        </div>

        <step4-quotation-header></step4-quotation-header>

        <selected-product :products="products"
                          :quantity-area="quantityArea"
                          :selectedProducts="selectedProducts"
                          @selectedProductIsUpdated="updateSelectedProduct"></selected-product>

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
import { getLessThan2Year, getTva } from '@/services/data/dataService';
import { SolFile } from '@/types/v2/File/Sol/SolFile';
import { getCeeBonus, roundCeeBonus } from '@/services/file/fileCommonService';
import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import SolList from '@/types/v2/File/Sol/SolList';

export default defineComponent( {
                                    name:       'file-sol-step-4',
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
                                        products:         Array as () => Product[],
                                        selectedProducts: Array as () => Product[],
                                        options:          Array as () => Option[],
                                        blankOptions:     Array as () => BlankOption[],
                                        quantityArea:     {
                                            type:     Number,
                                            required: true,
                                        },
                                        fileData:         {
                                            type:     Object as () => SolFile,
                                            required: true,
                                        },
                                        forceRefresh:     Boolean,  // Pour focer le compute des prix quand on arrive sur la step4
                                    },
                                    emits:      [ 'generateQuotation', 'generateAddressCertificate', 'calculedPrice' ],
                                    setup( props, ctx ) {
                                        const _selectedProducts = ref<Product[]>( ( props.selectedProducts as Product[] ) );
                                        const _options          = ref<Option[]>( ( props.options as Option[] ) );
                                        const _blankOptions     = ref<BlankOption[]>( ( props.blankOptions as BlankOption[] ) );
                                        const lists             = ref<SolList>( ( props.fileData.lists as SolList ) );
                                        const izolationZone     = ref<string>( ( props.fileData.quotation.izolationZone ) );

                                        const disabledBonus             = ref<boolean>( props.fileData.disabledBonus );
                                        const disabledCeeBonus          = ref<boolean>( props.fileData.disabledCeeBonus );
                                        const disabledMaPrimeRenovBonus = ref<boolean>( props.fileData.disabledMaPrimeRenovBonus );


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


                                        const price = computed<Price>( () => {
                                            // On utilise props.forceRefresh pour recalculer les prix
                                            if ( props.forceRefresh ) {
                                                console.log( 'NE PAS SUPPRIMER, POUR FORCER LE COMPUTE DES PRICES' );
                                            }
                                            let totalHt  = 0;
                                            let ceeBonus = 0;

                                            for ( const selectedProduct of _selectedProducts.value ) {
                                                totalHt += selectedProduct.pu * props.quantityArea;
                                            }

                                            let laying = props.quantityArea * ( props.fileData as SolFile ).quotation.overrideLaying;

                                            // supplément de 785 € HT pour toute surface inférieure à 65m2
                                            if ( props.quantityArea < 65 ) {
                                                laying += 785;
                                            }

                                            totalHt += laying;

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
                                            } else {
                                                // Si les primes sont actives
                                                if ( !disabledBonus.value ) {

                                                    // Si la prime CEE est active
                                                    if ( !disabledCeeBonus.value ) {
                                                        ceeBonus = roundCeeBonus( getCeeBonus( ( props.fileData as BaseFile ) ) * props.quantityArea );
                                                    }
                                                }
                                            }
                                            const totalTva = tva * totalHt / 100;
                                            const totalTtc = totalHt + totalTva;

                                            const remainderToPay = totalTtc - ceeBonus;

                                            const price: Price = {
                                                laying,
                                                HT:    totalHt,
                                                TVA:   lessThan2Year ? 0 : totalTva,
                                                TVA20: lessThan2Year ? totalTva : 0,
                                                TTC:   totalTtc,
                                                remainderToPay,
                                                CEE:   ceeBonus,
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
                                            izolationZone,
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
