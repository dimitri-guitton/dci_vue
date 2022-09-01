<template>
    <div class="w-100">
        <step4-header :payment-on-credit="fileData.quotation.paymentOnCredit"
                      :price="price"
                      :lists="lists"></step4-header>

        <div class="row">
            <p>Dimensionnement total chaud 1.20 : <b>{{
                    ( rrAlgo.calcRequiredPower( fileData.housing ) * 1.20 ).toFixed( 1 )
                                                     }} KW</b></p>
            <p>Dimensionnement total chaud 1.80 : <b>{{
                    ( rrAlgo.calcRequiredPower( fileData.housing ) * 1.80 ).toFixed( 1 )
                                                     }} KW</b></p>
            <p>Dimensionnement total froid : <b>{{ ( rrAlgo.calcRequiredPowerCold( fileData.housing ) ).toFixed( 1 ) }}
                                                KW</b></p>
        </div>
        <el-divider class="mb-10"></el-divider>

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
                    <div class="row">
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
                        <div class="col-md-3">
                            <p>Chaud 1.20 : <b>{{
                                    ( rrAlgo.calcRequiredPower( fileData.housing,
                                                                rrMulti[ `areaP${ index }` ] ) * 1.20 ).toFixed( 1 )
                                               }} KW</b></p>
                        </div>
                        <div class="col-md-3">
                            <p>Chaud 1.80 : <b>{{
                                    ( rrAlgo.calcRequiredPower( fileData.housing,
                                                                rrMulti[ `areaP${ index }` ] ) * 1.80 ).toFixed( 1 )
                                               }} KW</b></p>
                        </div>
                        <div class="col-md-3">
                            <p>Froid : <b>{{
                                    ( rrAlgo.calcRequiredPowerCold( fileData.housing,
                                                                    rrMulti[ `areaP${ index }` ] ) ).toFixed( 1 )
                                          }} KW</b></p>
                        </div>
                    </div>
                </template>
            </div>

        </template>

        <el-divider class="mb-10"></el-divider>

        <step4-quotation-header></step4-quotation-header>

        <template v-for="p in selectedProducts" v-bind:key="`select_product_${p.id}`">
            <p>{{ p.id }} - {{ p.reference }} - {{ p.label }}</p>
        </template>

        <selected-product :index="0"
                          :products="extProducts"
                          :selectedProducts="selectedProducts"
                          @selectedProductIsUpdated="updateSelectedProduct($event, 0)"
                          :show-reference="true"></selected-product>

        <template v-if="rrType === 'mono'">
            <selected-product :index="1"
                              :products="intProducts"
                              :selectedProducts="selectedProducts"
                              @selectedProductIsUpdated="updateSelectedProduct($event, 1)"
                              :show-reference="true"></selected-product>
        </template>
        <template v-else>
            <template v-for="index in rrMulti.roomNumber" v-bind:key="`select_int_product_${index}`">
                <selected-product :index="index"
                                  :products="intProducts"
                                  :selectedProducts="selectedProducts"
                                  @selectedProductIsUpdated="updateSelectedProduct($event, index)"
                                  :show-reference="true"></selected-product>
            </template>
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
import TemplateItemList from '@/components/DCI/input/ItemList.vue';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import RrList from '@/types/v2/File/Rr/RrList';
import RrMulti from '@/types/v2/File/Rr/RrMulti';
import { ItemList } from '@/types/v2/File/Common/ItemList';
import { getCeeBonus } from '@/services/file/fileCommonService';
import InputDiscount from '@/components/DCI/input/Discount.vue';
import SelectedProduct from '@/components/DCI/input/SelectedProduct.vue';
import { RrAlgo } from '@/services/algorithm/RrAlgo';

export default defineComponent( {
                                    name:       'file-pac-rr-step-4',
                                    components: {
                                        InputDiscount,
                                        TemplateItemList,
                                        Step4Header,
                                        WizzardFilePrice,
                                        BlankOptions,
                                        Options,
                                        Step4QuotationHeader,
                                        Field,
                                        ErrorMessage,
                                        SelectedProduct,
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
                                            type:     Object as () => RrFile,
                                            required: true,
                                        },
                                        forceRefresh:     Boolean,  // Pour focer le compute des prix quand on arrive sur la step4
                                    },
                                    emits:      [ 'generateQuotation', 'generateAddressCertificate', 'calculedPrice' ],
                                    setup( props, ctx ) {
                                        const _selectedProducts = ref<Product[]>( ( props.selectedProducts as Product[] ) );
                                        const _options          = ref<Option[]>( ( props.options as Option[] ) );
                                        console.log( 'OPTIONS -->', _options );
                                        const _blankOptions = ref<BlankOption[]>( ( props.blankOptions as BlankOption[] ) );
                                        const lists         = ref<RrList>( ( props.fileData.lists as RrList ) );

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
                                            discount.value = value;
                                        };

                                        /**
                                         * Ajoute ou enlève l'option Wifi selon les PAC
                                         */
                                        const enabledWifiOption = ( enabled: boolean ) => {
                                            console.log( '%c ENABLED WIFI', 'background: #fdd835; color: #000000' );
                                            console.log( enabled );
                                            console.log( _options.value );
                                            const wifiOption = _options.value.find( o => o.label === 'Wifi' );
                                            if ( wifiOption === undefined ) {
                                                console.log( '%c WIFI OPTION UNDEFINED',
                                                             'background: #fdd835; color: #000000' );
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

                                        const updateNbLayingOption = ( nbLaying: number ) => {
                                            const layingOption = _options.value.find( o => o.label.includes(
                                                'Forfait pose' ) );
                                            if ( layingOption === undefined ) {
                                                return;
                                            }

                                            // Change le prix de la pose
                                            _options.value = _options.value.map( o => {
                                                if ( o.label.includes( 'Forfait pose' ) ) {
                                                    if ( nbLaying === 1 || nbLaying === 2 ) {
                                                        return { ...o, pu: 600 };
                                                    } else if ( nbLaying === 3 || nbLaying === 4 ) {
                                                        return { ...o, pu: 1200 };
                                                    } else if ( nbLaying === 5 ) {
                                                        return { ...o, pu: 1800 };
                                                    }
                                                }
                                                return o;
                                            } );
                                        };

                                        const updateBlankOtions = ( blankOptions ) => {
                                            _blankOptions.value = blankOptions;
                                        };

                                        const filteredOptions = computed<Option[]>( () => {

                                            if ( rrType.value === 'multi' ) {
                                                updateNbLayingOption( rrMulti.value.roomNumber );
                                            }

                                            const sensiraSelected = _selectedProducts.value.length > 0 && _selectedProducts.value[ 0 ].label.toLowerCase()
                                                                                                                                      .includes(
                                                                                                                                          'sensira' );
                                            console.log( 'WIFI' );
                                            console.log( 'Sensira selected', sensiraSelected );

                                            if ( rrType.value === 'multi' || !sensiraSelected ) {
                                                enabledWifiOption( false );
                                                return _options.value.filter( o => o.label !== 'Wifi' );
                                            }


                                            enabledWifiOption( true );
                                            return _options.value;
                                        } );


                                        const updateSelectedProduct = ( product, index ) => {
                                            _selectedProducts.value[ index ] = product;
                                        };

                                        const extProducts = computed<Product[]>( () => {
                                            return props.products.filter( p => p.productType === 'pac_rr' && p.label.toUpperCase()
                                                                                                              .includes(
                                                                                                                  'EXTERIEURE' ) );
                                        } );

                                        const intProducts = computed<Product[]>( () => {
                                            const filtered = props.products.filter( p => p.productType === 'pac_rr' && !p.label.toUpperCase()
                                                                                                                         .includes(
                                                                                                                             'EXTERIEURE' ) );

                                            const filterSelectedProducts = _selectedProducts.value.filter( p => p.productType === 'pac_rr' && !p.label.toUpperCase()
                                                                                                                                                .includes(
                                                                                                                                                    'EXTERIEURE' ) );

                                            if ( filterSelectedProducts.length > rrMulti.value.roomNumber ) {
                                                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                                                _selectedProducts.value.splice( -Math.abs( filterSelectedProducts.length - rrMulti.value.roomNumber ) );
                                            } else if ( rrType.value === 'mono' && filterSelectedProducts.length > 1 ) {
                                                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                                                _selectedProducts.value.splice( -Math.abs( filterSelectedProducts.length - 1 ) );
                                            }

                                            return filtered;
                                        } );

                                        const assortmentLists = computed<ItemList[]>( () => {
                                            if ( rrType.value === 'multi' ) {
                                                return lists.value.gammeTypeList.filter( g => g.slug !== 'sensira' );
                                            }
                                            return lists.value.gammeTypeList;
                                        } );

                                        const price = computed<Price>( () => {
                                            // On utilise props.forceRefresh pour recalculer les prix
                                            if ( props.forceRefresh ) {
                                                console.log( 'NE PAS SUPPRIMER, POUR FORCER LE COMPUTE DES PRICES' );
                                            }

                                            let totalHt     = 0;
                                            let ceeBonus    = 0;
                                            let sumForTva10 = 0;
                                            let tva10;
                                            let tva20;

                                            for ( const selectedProduct of _selectedProducts.value ) {
                                                if ( selectedProduct === undefined ) {
                                                    continue;
                                                }
                                                totalHt += selectedProduct.pu;
                                            }

                                            console.log( 'Prix avec les produits -->', totalHt );

                                            for ( const option of _options.value ) {
                                                if ( option.number > 0 ) {
                                                    totalHt += option.pu * option.number;

                                                    if ( option.calcTva10 === true ) {
                                                        sumForTva10 += option.pu * option.number;
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
                                                console.log( 'sumForTva10', sumForTva10 );
                                                tva10 = sumForTva10 * 0.1;
                                                console.log( 'TVA 20 -->', tva10 );
                                                tva20 = ( totalHt - sumForTva10 ) * 0.2;
                                                console.log( 'TVA 20 -->', tva20 );
                                            } else {
                                                console.log( '%c TVA 10 = 0', 'background: #fdd835; color: #000000' );
                                                tva10 = 0;
                                                tva20 = totalHt * 0.2;
                                            }

                                            const totalTva = tva10 + tva20;
                                            const totalTtc = totalHt + totalTva;

                                            if ( !props.fileData.disabledBonus ) {
                                                // Si la prime CEE est active
                                                if ( !props.fileData.disabledCeeBonus ) {
                                                    // Afin d'avoir les derniers produits pour le calcul de la prime
                                                    const updatedFileData: RrFile = {
                                                        ...props.fileData,
                                                        quotation: {
                                                            ...props.fileData.quotation,
                                                            // selectedProducts: products.value,
                                                            selectedProducts: _selectedProducts.value,
                                                        },
                                                    };
                                                    ceeBonus                      = getCeeBonus( updatedFileData );
                                                }
                                            }

                                            const totalPrime = ceeBonus;

                                            const price: Price = {
                                                HT:             totalHt,
                                                TVA:            0,
                                                TVA10:          tva10,
                                                TVA20:          tva20,
                                                TTC:            totalTtc,
                                                remainderToPay: totalTtc - totalPrime - discount.value,
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
                                            extProducts,
                                            intProducts,
                                            assortment,
                                            rrType,
                                            rrMulti,
                                            assortmentLists,
                                            discount,
                                            rrAlgo,
                                            updateSelectedProduct,
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
