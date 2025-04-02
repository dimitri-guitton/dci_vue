<template>
    <div class="w-100">

        <step4-header :file="fileData"
                      :lists="lists"
                      :payment-on-credit="fileData.quotation.paymentOnCredit"
                      :price="computedPrice"
                      @bonusAreUpdated="updateBonus"></step4-header>

        <div class="row">
            <div class="col-md-6 mb-5">
                <label class="form-label" for="sizingPercentage">La pompe à chaleur doit couvrir au minimum 70% et au
                                                                 maximum 100% des déperditions de la maison à la
                                                                 température de base.<br><b>Quelle pourcentage voulez
                                                                                            choisir ?</b></label>
                <Field id="sizingPercentage"
                       v-model="sizingPercentage"
                       as="select"
                       class="form-select"
                       name="sizingPercentage"
                >
                    <template-item-list :lists="sizingPercentageList"></template-item-list>
                </Field>
            </div>
            <div class="col-md-6 mb-5">
                Dimensionnement à {{ sizingPercentage }}% des déperditions =
                {{ ( roAlgoV2.calcRequiredPower( fileData.housing ) * ( sizingPercentage / 100 ) ).toFixed( 4 ) }}KW
            </div>
        </div>

        <el-divider class="mb-10"></el-divider>

        <div class="row mt-10">
            <div class="col-md-6 mb-5">
                <label class="form-label" for="deviceToReplaceType">Appareil à remplacer</label>
                <Field id="deviceToReplaceType"
                       v-model="deviceToReplace.type"
                       as="select"
                       class="form-select"
                       name="deviceToReplaceType"
                >
                    <item-list :lists="lists.typeChaudiereList"></item-list>
                </Field>
            </div>
            <template v-if="deviceToReplace.type !== 'aucun'">
                <div class="col-md-3 mb-5">
                    <label class="form-label mb-3" for="deviceToReplaceBrand">Marque</label>
                    <Field
                        id="deviceToReplaceBrand"
                        v-model="deviceToReplace.brand"
                        class="form-control"
                        name="deviceToReplaceBrand"
                        type="text"

                    >
                    </Field>
                </div>
                <div class="col-md-3 mb-5">
                    <label class="form-label mb-3" for="deviceToReplaceModel">Modèle</label>
                    <Field
                        id="deviceToReplaceModel"
                        v-model="deviceToReplace.model"
                        class="form-control"
                        name="deviceToReplaceModel"
                        type="text"
                    >
                    </Field>
                </div>
            </template>
        </div>
        <div class="row mt-10 d-flex align-items-end">
            <div class="col-md-12 mb-5">
                <h6 class="mb-5">Choix de la marque : </h6>
                <div class="mb-5">
                    Daikin :

                    <Field id="r_ecs_1"
                           v-model="volumeECS"
                           class="form-check-input ms-5"
                           name="volumeECS"
                           type="radio"
                           value="ecs_1"
                    >
                    </Field>
                    <label class="ms-2" for="r_ecs_1">0L</label>

                    <Field id="r_ecs_2"
                           v-model="volumeECS"
                           class="form-check-input ms-5"
                           name="volumeECS"
                           type="radio"
                           value="ecs_2"
                    >
                    </Field>
                    <label class="ms-2" for="r_ecs_2">180L</label>

                    <Field id="r_ecs_3"
                           v-model="volumeECS"
                           class="form-check-input ms-5"
                           name="volumeECS"
                           type="radio"
                           value="ecs_3"
                    >
                    </Field>
                    <label class="ms-2" for="r_ecs_3">230L</label>

                    <Field id="r_ecs_4"
                           v-model="volumeECS"
                           class="form-check-input ms-5"
                           name="volumeECS"
                           type="radio"
                           value="ecs_4"
                    >
                    </Field>
                    <label class="ms-2" for="r_ecs_4">150L Déporté</label>

                    <Field id="r_ecs_5"
                           v-model="volumeECS"
                           class="form-check-input ms-5"
                           name="volumeECS"
                           type="radio"
                           value="ecs_5"
                    >
                    </Field>
                    <label class="ms-2" for="r_ecs_5">200L Déporté</label>

                    <Field id="r_ecs_6"
                           v-model="volumeECS"
                           class="form-check-input ms-5"
                           name="volumeECS"
                           type="radio"
                           value="ecs_6"
                    >
                    </Field>
                    <label class="ms-2" for="r_ecs_6">300L Déporté</label>
                </div>

                <div>
                    Atlantic :

                    <Field id="r_ecs_7"
                           v-model="volumeECS"
                           class="form-check-input ms-5"
                           name="volumeECS"
                           type="radio"
                           value="ecs_atl_1"
                    >
                    </Field>
                    <label class="ms-2" for="r_ecs_7">0L</label>

                    <Field id="r_ecs_8"
                           v-model="volumeECS"
                           class="form-check-input ms-5"
                           name="volumeECS"
                           type="radio"
                           value="ecs_atl_2"
                    >
                    </Field>
                    <label class="ms-2" for="r_ecs_8">190L</label>
                </div>
            </div>

        </div>

        <el-divider class="mb-10"></el-divider>

        <step4-quotation-header></step4-quotation-header>

        <selected-product :index="0"
                          :products="computedProducts.exts"
                          :selectedProducts="selectedProducts"
                          :show-reference="true"
                          @selectedProductIsUpdated="updateSelectedProduct($event, 0)"></selected-product>

        <template v-if="!edlaSelected">
            <selected-product :index="1"
                              :products="computedProducts.ints"
                              :selectedProducts="selectedProducts"
                              :show-reference="true"
                              @selectedProductIsUpdated="updateSelectedProduct($event, 1)"></selected-product>
        </template>

        <template v-for="ecs in computedEcsDeportes" v-bind:key="ecs.reference">
            <row-price :product="ecs"></row-price>
        </template>

        <template v-for="kitBiZone in computedKitBiZone" v-bind:key="kitBiZone.reference">
            <row-price :product="kitBiZone"></row-price>
        </template>

        <!-- Formualaire caché afin de binder les values au formulaire comme la sélection des produits se fait via l'algo-->
        <template v-for="(p, index) in computedHiddenProducts" v-bind:key="`val_${p.reference}_${p.id}`">
            <div class="row d-none">
                <Field v-model.number="p.id"
                       :name="`selectedProducts[${index+2}].id`"
                       class="form-control"
                       type="number" />
                <Field v-model.number="p.quantity"
                       :name="`selectedProducts[${index+2}].quantity`"
                       class="form-control"
                       type="number" />
                <Field v-model.number="p.pu"
                       :name="`selectedProducts[${index+2}].pu`"
                       class="form-control"
                       type="number" />
            </div>
        </template>

        <options :options="computedOptions" @optionsAreUpdated="updateOptions"></options>

        <blank-options :options="blankOptions" @optionsAreUpdated="updateBlankOtions"></blank-options>

        <input-discount :discount="discount" @discountUpdated="updateDiscount"></input-discount>

        <wizzard-file-price :price="computedPrice"></wizzard-file-price>

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
import { computed, defineComponent, ref, watch } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import { Product } from '@/types/v2/File/Common/Product';
import Step4QuotationHeader from '@/components/DCI/wizzard-file/Step4QuotationHeader.vue';
import { Option } from '@/types/v2/File/Common/Option';
import { BlankOption } from '@/types/v2/File/Common/BlankOption';
import Step4Header from '@/components/DCI/wizzard-file/Step4Header.vue';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import ItemList from '@/components/DCI/input/ItemList.vue';
import TemplateItemList from '@/components/DCI/input/ItemList.vue';
import RoList from '@/types/v2/File/Ro/RoList';
import { Price } from '@/types/v2/File/Price';
import { MODEL_ATLANTIC, MODEL_DAIKIN, RoAlgoV2 } from '@/services/algorithm/RoAlgoV2';
import SelectedProduct from '@/components/DCI/input/SelectedProduct.vue';
import RowPrice from '@/components/DCI/wizzard-file/rowPrice.vue';
import Options from '@/components/DCI/input/Options.vue';
import BlankOptions from '@/components/DCI/input/BlankOptions.vue';
import InputDiscount from '@/components/DCI/input/Discount.vue';
import WizzardFilePrice from '@/components/DCI/wizzard-file/Price.vue';
import { getCodeBonus, getLessThan2Year, getTva } from '@/services/data/dataService';
import { getCeeBonus, getHelpingHandRo, getMaPrimeRenov } from '@/services/file/fileCommonService';

export default defineComponent( {
                                    name:       'file-pac-ro-step-4',
                                    components: {
                                        WizzardFilePrice,
                                        InputDiscount,
                                        BlankOptions,
                                        Options,
                                        RowPrice,
                                        SelectedProduct,
                                        ItemList,
                                        Step4Header,
                                        Step4QuotationHeader,
                                        Field,
                                        ErrorMessage,
                                        TemplateItemList,
                                    },
                                    props:      {
                                        selectedProducts: Array as () => Product[],
                                        options:          Array as () => Option[],
                                        blankOptions:     Array as () => BlankOption[],
                                        fileData:         {
                                            type:     Object as () => RoFile,
                                            required: true,
                                        },
                                        forceRefresh:     Boolean,  // Pour focer le compute des prix quand on arrive sur la step4
                                    },
                                    emits:      [ 'generateQuotation', 'generateAddressCertificate', 'calculedPrice' ],
                                    setup( props, ctx ) {
                                        const roAlgoV2 = new RoAlgoV2( props.fileData.housing );

                                        const sizingPercentageList = [
                                            {
                                                slug:  '70',
                                                value: 70,
                                            },
                                            {
                                                slug:  '75',
                                                value: 75,
                                            },
                                            {
                                                slug:  '80',
                                                value: 80,
                                            },
                                            {
                                                slug:  '85',
                                                value: 85,
                                            },
                                            {
                                                slug:  '90',
                                                value: 90,
                                            },
                                            {
                                                slug:  '95',
                                                value: 95,
                                            },
                                            {
                                                slug:  '100',
                                                value: 100,
                                            },
                                        ];
                                        const _selectedProducts    = ref<Product[]>( ( props.selectedProducts as Product[] ) );
                                        const _options             = ref<Option[]>( ( props.options as Option[] ) );
                                        const _blankOptions        = ref<BlankOption[]>( ( props.blankOptions as BlankOption[] ) );
                                        const lists                = ref<RoList>( ( props.fileData.lists as RoList ) );

                                        const deviceToReplace           = ref( props.fileData.quotation.deviceToReplace );
                                        const volumeECS                 = ref<string>( props.fileData.quotation.volumeECS );
                                        const sizingPercentage          = ref<number>( props.fileData.quotation.sizingPercentage ?? 80 );
                                        const ecsDeporteList            = props.fileData.quotation.products.filter( p => p.productType === 'ecs' );
                                        const kitBiZoneList             = props.fileData.quotation.products.filter( p => p.productType === 'kit_bi_zone' );
                                        const discount                  = ref<number>( props.fileData.quotation.discount );
                                        const estimateMaPrimeRenov      = ref<number>( 0 );
                                        const disabledBonus             = ref<boolean>( props.fileData.disabledBonus );
                                        const disabledCeeBonus          = ref<boolean>( props.fileData.disabledCeeBonus );
                                        const disabledMaPrimeRenovBonus = ref<boolean>( props.fileData.disabledMaPrimeRenovBonus );
                                        const edlaSelected = ref<boolean>( false );

                                        if ( _selectedProducts.value[ 0 ] !== undefined ) {
                                            edlaSelected.value = _selectedProducts.value[ 0 ].reference.includes( 'EDLA' );
                                        }

                                        const computedProducts = computed<{
                                            'exts': Product[];
                                            'ints': Product[];
                                            'needBiZoneSupplement': boolean;
                                        }>( () => {
                                            roAlgoV2.updateHousing( props.fileData.housing );

                                            let model = MODEL_DAIKIN;

                                            if ( volumeECS.value.includes( '_atl_' ) ) {
                                                model = MODEL_ATLANTIC;
                                            }

                                            let response;
                                            switch ( volumeECS.value ) {
                                                case 'ecs_1':
                                                case 'ecs_atl_1':
                                                    response = roAlgoV2.getProducts( 0, sizingPercentage.value, model );
                                                    break;
                                                case 'ecs_2':
                                                case 'ecs_atl_2':
                                                    response = roAlgoV2.getProducts( 180,
                                                                                     sizingPercentage.value,
                                                                                     model );
                                                    break;
                                                case 'ecs_3':
                                                    response = roAlgoV2.getProducts( 230,
                                                                                     sizingPercentage.value,
                                                                                     model );
                                                    break;
                                                default:// ECS Déporté
                                                    response = roAlgoV2.getProducts( 0,
                                                                                     sizingPercentage.value,
                                                                                     model,
                                                                                     true );
                                            }

                                            return {
                                                'exts':                 response.externals,
                                                'ints': response.internals,
                                                'needBiZoneSupplement': response.needBiZoneSupplement,
                                            };
                                        } );

                                        const computedEcsDeportes = computed<Product[]>( () => {
                                            if ( volumeECS.value === 'ecs_4' ) {
                                                return ecsDeporteList.filter( ecs => ecs.volume === 150 );
                                            } else if ( volumeECS.value === 'ecs_5' ) {
                                                return ecsDeporteList.filter( ecs => ecs.volume === 200 );
                                            } else if ( volumeECS.value === 'ecs_6' ) {
                                                return ecsDeporteList.filter( ecs => ecs.volume === 300 );
                                            }

                                            return [];
                                        } );

                                        const computedKitBiZone = computed<Product[]>( () => {
                                            if ( computedProducts.value.needBiZoneSupplement ) {
                                                return kitBiZoneList;
                                            }
                                            return [];
                                        } );

                                        const computedHiddenProducts = computed<Product[]>( () => {
                                            return [
                                                ...computedKitBiZone.value,
                                                ...computedEcsDeportes.value,
                                            ];
                                        } );

                                        /**
                                         * Ajoute ou enlève l'option Soupape antigel selon les PAC
                                         */
                                        const enabledSoupageOption = ( enabled: boolean ) => {
                                            const soupapeOption = _options.value.find( o => o.label === 'Soupape antigel' );
                                            if ( soupapeOption === undefined ) {
                                                return;
                                            }

                                            // Change le nombre de l'option Soupape antigel pour l'activer ou non
                                            _options.value = _options.value.map( o => {
                                                if ( enabled && o.label === 'Soupape antigel' ) {
                                                    return { ...o, number: 2 };
                                                } else if ( !enabled && o.label === 'Soupape antigel' ) {
                                                    return { ...o, number: 0 };
                                                }
                                                return o;
                                            } );
                                        };

                                        /**
                                         * Ajoute ou enlève l'option Forfait ballon tampon
                                         */
                                        const enabledBallonTamponOption = ( enabled: boolean ) => {
                                            const ballonTamponOption = _options.value.find( o => o.label.includes(
                                                'Forfait ballon tampon' ) );
                                            if ( ballonTamponOption === undefined ) {
                                                return;
                                            }

                                            // Change le nombre de l'option Forfait ballon tampon pour l'activer ou non
                                            _options.value = _options.value.map( o => {
                                                if ( enabled && o.label.includes( 'Forfait ballon tampon' ) ) {
                                                    return { ...o, number: 1 };
                                                } else if ( !enabled && o.label.includes( 'Forfait ballon tampon' ) ) {
                                                    return { ...o, number: 0 };
                                                }
                                                return o;
                                            } );
                                        };

                                        /**
                                         * Ajoute ou enlève l'option Mitigeur
                                         */
                                        const enabledMitigeurOption = ( enabled: boolean ) => {
                                            const mitigeurOption = _options.value.find( o => o.label.includes(
                                                'Forfait ballon tampon' ) );
                                            if ( mitigeurOption === undefined ) {
                                                return;
                                            }

                                            // Change le nombre de l'option Forfait mitigeur thermostatique pour l'activer ou non
                                            _options.value = _options.value.map( o => {
                                                if ( enabled && o.label.includes( 'Forfait mitigeur' ) ) {
                                                    return { ...o, number: 1 };
                                                } else if ( !enabled && o.label.includes( 'Forfait mitigeur' ) ) {
                                                    return { ...o, number: 0 };
                                                }
                                                return o;
                                            } );
                                        };

                                        const computedOptions = computed<Option[]>( () => {
                                            for ( const option of _options.value ) {
                                                if ( props.fileData.housing.availableVoltage === 'triphase' && ( ( option.slug === undefined && option.id === 24 ) || option.slug === `option-24` ) ) {
                                                    // Si le PU n'a pas déja été augmenté
                                                    if ( option.pu === option.defaultPu ) {
                                                        option.pu += 400;
                                                    }
                                                } else if ( ( option.slug === undefined && option.id === 24 ) || option.slug === `option-24` ) {
                                                    // Si le PU a été modifié
                                                    if ( option.pu !== option.defaultPu ) {
                                                        option.pu -= 400;
                                                    }
                                                }

                                                if ( option.label.includes( 'Soupape antigel' ) ) {
                                                    let enabled = false;

                                                    _selectedProducts.value.forEach( product => {
                                                        if ( product.reference.includes( 'EPGA' ) || product.reference.includes(
                                                            'EPRA' ) ) {
                                                            enabled = true;
                                                        }
                                                    } );

                                                    enabledSoupageOption( enabled );
                                                }

                                                if ( option.label.includes( 'Forfait ballon tampon' ) ) {
                                                    // props.fileData.housing.heaters;
                                                    if ( props.fileData.housing.heaters === 'r_fonte' || props.fileData.housing.heaters === 'r_fonte_p_chauffant' || props.fileData.housing.heaters === 'r_autre' || props.fileData.housing.heaters === 'r_autre_p_chauffant' ) {
                                                        // const enabled = selectedExtProduct.value !== undefined && selectedExtProduct.value.model === MODEL_ATLANTIC;
                                                        let enabled = false;

                                                        _selectedProducts.value.forEach( product => {
                                                            if ( product.model === MODEL_ATLANTIC ) {
                                                                enabled = true;
                                                            }
                                                        } );

                                                        enabledBallonTamponOption( enabled );
                                                    } else {
                                                        enabledBallonTamponOption( false );
                                                    }

                                                }

                                                if ( option.label.includes( 'Forfait mitigeur' ) ) {
                                                    // props.fileData.housing.heaters;
                                                    if ( volumeECS.value === 'ecs_1' ) {
                                                        enabledMitigeurOption( false );
                                                    } else {
                                                        enabledMitigeurOption( true );
                                                    }
                                                }
                                            }

                                            return _options.value;
                                        } );


                                        const computedPrice = computed<Price>( () => {
                                            let totalHT      = 0;
                                            let maPrimeRenov = 0;
                                            let ceeBonus     = 0;

                                            const products = [
                                                ..._selectedProducts.value,
                                                ...computedEcsDeportes.value,
                                                ...computedKitBiZone.value,
                                            ];

                                            products.forEach( product => {
                                                totalHT += product.pu * product.quantity;
                                            } );

                                            _options.value.forEach( option => {
                                                if ( option.number > 0 ) {
                                                    totalHT += option.pu * option.number;
                                                }
                                            } );

                                            _blankOptions.value.forEach( blankOption => {
                                                if ( blankOption.number > 0 && blankOption.label !== '' ) {
                                                    totalHT += blankOption.pu * blankOption.number;
                                                }
                                            } );

                                            const codeBonus             = getCodeBonus();
                                            const houseHasLessThan2Year = getLessThan2Year();
                                            let tva                     = getTva();

                                            if ( houseHasLessThan2Year ) {
                                                tva = 20;
                                            }

                                            const totalTva = tva * totalHT / 100;
                                            const totalTtc = totalHT + totalTva;

                                            // Si les primes sont actives
                                            if ( !disabledBonus.value ) {
                                                // Si la prime CEE est active
                                                if ( !disabledCeeBonus.value ) {
                                                    // Coup de pouce
                                                    if ( deviceToReplace.value.type !== 'aucun' && deviceToReplace.value.type !== 'autre' ) {
                                                        ceeBonus = getHelpingHandRo( codeBonus );
                                                    } else {
                                                        // Afin d'avoir les derniers produits pour le calcul de la prime
                                                        const updatedFileData: RoFile = {
                                                            ...props.fileData,
                                                            quotation: {
                                                                ...props.fileData.quotation,
                                                                selectedProducts: _selectedProducts.value,
                                                                volumeECS: volumeECS.value,
                                                            },
                                                        };
                                                        ceeBonus                      = getCeeBonus( updatedFileData );
                                                    }

                                                }
                                                // Si la prime MaPrimeRenov est active
                                                // On doit déduire la remise du TTC afin d'avoir la bonne valeur
                                                if ( !disabledMaPrimeRenovBonus.value ) {
                                                    maPrimeRenov = getMaPrimeRenov( props.fileData.type,
                                                                                    ( totalTtc - discount.value ),
                                                                                    ceeBonus );
                                                }
                                            }

                                            const totalPrime = maPrimeRenov + ceeBonus;

                                            const price: Price = {
                                                HT:             totalHT,
                                                TVA:            houseHasLessThan2Year ? 0 : totalTva,
                                                TVA20:          houseHasLessThan2Year ? totalTva : 0,
                                                TTC:            totalTtc,
                                                maPrimeRenov:   maPrimeRenov,
                                                remainderToPay: totalTtc - totalPrime - discount.value,
                                                CEE:            ceeBonus,
                                                discount:       discount.value,
                                            };

                                            ctx.emit( 'calculedPrice', price );

                                            return price;


                                        } );

                                        const updateBonus = ( value: {
                                            bonus: boolean;
                                            ceeBonus: boolean;
                                            maPrimeRenovBonus: boolean;
                                        } ) => {
                                            disabledBonus.value             = value.bonus;
                                            disabledCeeBonus.value          = value.ceeBonus;
                                            disabledMaPrimeRenovBonus.value = value.maPrimeRenovBonus;
                                        };

                                        const updateSelectedProduct = ( product, index ) => {
                                            _selectedProducts.value[ index ] = product;

                                            // Les EDLA n'ont pas d'unité intérieur
                                            if ( product.reference.includes( 'EDLA' ) ) {
                                                _selectedProducts.value.splice( 1, 1 );
                                                edlaSelected.value = true;

                                            } else {
                                                edlaSelected.value = false;
                                            }

                                        };

                                        const updateOptions = ( options ) => {
                                            _options.value = options;
                                        };

                                        const updateBlankOtions = ( blankOptions ) => {
                                            _blankOptions.value = blankOptions;
                                        };

                                        const updateDiscount = ( value ) => {
                                            discount.value = value;
                                        };

                                        // Utilisation de computed pour encapsuler props.fileData.type dans une fonction getter
                                        const fileDataTypeGetter = computed( () => props.fileData.type );

                                        watch( [ fileDataTypeGetter, computedPrice ], () => {
                                            const type                 = fileDataTypeGetter.value;
                                            const total                = computedPrice.value.TTC - ( computedPrice.value.discount ?? 0 );
                                            const cee                  = computedPrice.value.CEE;
                                            estimateMaPrimeRenov.value = getMaPrimeRenov( type, total, cee );
                                        } );

                                        const generateQuotation = () => {
                                            ctx.emit( 'generateQuotation' );
                                        };

                                        const generateAddressCertificate = () => {
                                            ctx.emit( 'generateAddressCertificate' );
                                        };


                                        return {
                                            roAlgoV2,
                                            lists,
                                            sizingPercentageList,
                                            sizingPercentage,
                                            deviceToReplace,
                                            edlaSelected,
                                            volumeECS,
                                            discount,
                                            estimateMaPrimeRenov,
                                            computedProducts,
                                            computedEcsDeportes,
                                            computedKitBiZone,
                                            computedHiddenProducts,
                                            computedOptions,
                                            computedPrice,
                                            updateBonus,
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
