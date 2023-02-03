<template>
    <div class="w-100">

        <step4-header :file="fileData"
                      :lists="lists"
                      :payment-on-credit="fileData.quotation.paymentOnCredit"
                      :price="price"
                      @bonusAreUpdated="updateBonus"
        ></step4-header>

        <div class="row mt-10">
            <div class="col-md-6 mb-5">
                <label class="form-label" for="outsideSocket">Installation sur prise d'air</label>

                <Field id="outsideSocket"
                       v-model="outsideSocket"
                       as="select"
                       class="form-select"
                       name="outsideSocket">
                    <option :value="true">OUI</option>
                    <option :value="false">NON</option>
                </Field>
            </div>
            <div class="col-md-6 mb-5">
                <label class="form-label" for="q_type">Marque</label>

                <Field id="q_type"
                       v-model="type"
                       as="select"
                       class="form-select"
                       name="q_type">
                    <option value="red">Red</option>
                    <option value="jm">Jolly Mec</option>
                    <option value="superior">Superior</option>
                </Field>
            </div>
            <div class="col-md-6 mb-5">
                <label class="form-label" for="q_power">Puissance (<var>KW</var>)</label>

                <Field id="q_power"
                       v-model.number="power"
                       as="select"
                       class="form-select"
                       name="q_power">
                    <item-list :lists="lists.puissancePoeleList"></item-list>
                </Field>
            </div>
            <template v-if="power === 9 && type === 'jm'">
                <div class="col-md-6 mb-5">
                    <label class="form-label" for="q_color">Couleur profile</label>

                    <Field id="q_color"
                           v-model="color"
                           as="select"
                           class="form-select"
                           name="q_color">
                        <item-list :lists="lists.couleurProfileList"></item-list>
                    </Field>
                </div>
            </template>
            <template v-if="type === 'superior'">
                <div class="col-md-6 mb-5">
                    <label class="form-label" for="smoke">Sorite fumée</label>

                    <Field id="smoke"
                           v-model="smoke"
                           as="select"
                           class="form-select"
                           name="smoke">
                        <option value="back">Arrière</option>
                        <option value="top">Supérieure</option>
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
                          :index="1"
                          :products="computedFumisteries"
                          :selectedProducts="computedSelectedFumisteries"
                          @selectedProductIsUpdated="updateSelectedProduct"
        ></selected-product>

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
import ItemList from '@/components/DCI/input/ItemList.vue';
import PgList from '@/types/v2/File/Pg/PgList';
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
                                        const outsideSocket = ref<boolean>( props.fileData.quotation.outsideSocket );
                                        const smoke         = ref<string>( props.fileData.quotation.smoke );

                                        const disabledBonus             = ref<boolean>( props.fileData.disabledBonus );
                                        const disabledCeeBonus          = ref<boolean>( props.fileData.disabledCeeBonus );
                                        const disabledMaPrimeRenovBonus = ref<boolean>( props.fileData.disabledMaPrimeRenovBonus );

                                        const estimateMaPrimeRenov = ref<number>( 0 );


                                        if ( currentPoele !== undefined ) {
                                            power.value = currentPoele.power === undefined
                                                          ? power.value
                                                          : currentPoele.power;
                                            type.value  = currentPoele.type == undefined
                                                          ? type.value
                                                          : currentPoele.type;
                                            color.value = ( currentPoele.color === undefined || currentPoele.color === null )
                                                          ? color.value
                                                          : currentPoele.color;
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

                                        const updateBonus = ( data: { bonus: boolean; ceeBonus: boolean; maPrimeRenovBonus: boolean } ) => {
                                            disabledBonus.value             = data.bonus;
                                            disabledCeeBonus.value          = data.ceeBonus;
                                            disabledMaPrimeRenovBonus.value = data.maPrimeRenovBonus;
                                        };


                                        const computedFumisteries = computed<Product[]>( () => {
                                            const newList                = props.products.filter( p => {
                                                return p.productType === 'fumisterie' && p.air === outsideSocket.value;
                                            } );
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
                                            let newList = props.products.filter( p => p.productType === 'pg' && p.type === type.value && p.power === power.value && ( power.value !== 9 || ( power.value === 9 && p.color === color.value ) ) );

                                            if ( !outsideSocket.value ) {
                                                // Si pas de prise d'air, sélection impossible de la gamme AMBRIA2
                                                newList = newList.filter( p => {
                                                    return !p.reference.toString().toUpperCase().includes( 'AMBRIA2' );
                                                } );
                                            }

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

                                        /**
                                         * Ajoute ou enlève uen option selon son ID
                                         */
                                        const enabledOptionById = ( optionId: number, enabled: boolean ) => {
                                            const option = _options.value.find( o => o.id === optionId );
                                            if ( option === undefined ) {
                                                return;
                                            }

                                            // Change le nombre de l'option pour l'activer ou non
                                            _options.value = _options.value.map( o => {
                                                if ( enabled && o.id === optionId ) {
                                                    return { ...o, number: 1 };
                                                } else if ( !enabled && o.id === optionId ) {
                                                    return { ...o, number: 0 };
                                                }
                                                return o;
                                            } );
                                        };


                                        const filteredOptions = computed<Option[]>( () => {
                                            for ( const option of _options.value ) {


                                                // Kit pour sortie de fumée supérieur PGI intégré
                                                if ( option.slug === `option-39` ) {
                                                    let enabled = false;
                                                    if ( outsideSocket.value === false && smoke.value === 'top' ) {
                                                        enabled = true;
                                                    }
                                                    enabledOptionById( 39, enabled );
                                                }

                                                // Kit pour sortie de fumée supérieur simple paroi
                                                if ( option.slug === `option-40` ) {
                                                    let enabled = false;
                                                    if ( outsideSocket.value === true && smoke.value === 'top' ) {
                                                        enabled = true;
                                                    }
                                                    enabledOptionById( 40, enabled );
                                                }

                                                // Kit télécommande easy
                                                if ( option.slug === `option-41` ) {
                                                    let enabled = false;
                                                    if ( type.value === 'superior' ) {
                                                        enabled = true;
                                                    }
                                                    enabledOptionById( 41, enabled );
                                                }
                                            }


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
                                                totalHt += +selectedProduct.pu;
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
                                            $selectedPoele,
                                            $selectedFumisterie,
                                            lists,
                                            power,
                                            type,
                                            color,
                                            outsideSocket,
                                            smoke,
                                            price,
                                            filteredOptions,
                                            estimateMaPrimeRenov,
                                            updateSelectedProduct,
                                            updateOptions,
                                            updateBlankOtions,
                                            generateQuotation,
                                            generateAddressCertificate,
                                            computedPg,
                                            computedSelectedPg,
                                            computedFumisteries,
                                            computedSelectedFumisteries,
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
