<template>
    <div class="w-100">

        <step4-header :file="fileData"
                      :lists="lists"
                      :payment-on-credit="fileData.quotation.paymentOnCredit"
                      :price="price"
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
                    <template-item-list :lists="[
                         {
                            slug:'70',
                            value: 70
                        },
                         {
                            slug:'75',
                            value: 75
                        },
                         {
                            slug:'80',
                            value: 80
                        },
                         {
                            slug:'85',
                            value: 85
                        },
                         {
                            slug:'90',
                            value: 90
                        },
                         {
                            slug:'95',
                            value: 95
                        },
                         {
                            slug:'100',
                            value: 100
                        },
                    ]"></template-item-list>
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
                          :products="extProducts"
                          :show-reference="true"
                          :disabled-price="true"
                          @selectedProductIsUpdated="updateSelectedProduct($event, 0)"></selected-product>

        <template v-if="selectedIntProduct !== undefined">
            <row-price :product="selectedIntProduct"></row-price>
        </template>

        <template v-for="ecs in selectedEcsDeportes" v-bind:key="ecs.reference">
            <row-price :product="ecs"></row-price>
        </template>

        <template v-for="kitBiZone in selectedKitBiZone" v-bind:key="kitBiZone.reference">
            <row-price :product="kitBiZone"></row-price>
        </template>

        <!-- Formualaire caché afin de binder les values au formulaire comme la sélection des produits se fait via l'algo-->
        <template v-for="(p, index) in hiddenProducts" v-bind:key="`val_${p.reference}_${p.id}`">
            <div class="row d-none">
                <p>ID</p>
                <Field v-model.number="p.id"
                       :name="`selectedProducts[${index}].id`"
                       class="form-control"
                       type="number" />
                <p>QUANTITY</p>
                <Field v-model.number="p.quantity"
                       :name="`selectedProducts[${index}].quantity`"
                       class="form-control"
                       type="number" />
                <p>P.U</p>
                <Field v-model.number="p.pu"
                       :name="`selectedProducts[${index}].pu`"
                       class="form-control"
                       type="number" />
                <hr class="my-5">
            </div>
        </template>

        <options :options="filteredOptions" @optionsAreUpdated="updateOptions"></options>

        <blank-options :options="blankOptions" @optionsAreUpdated="updateBlankOtions"></blank-options>

        <input-discount :discount="discount" @discountUpdated="updateDiscount"></input-discount>

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
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import RoList from '@/types/v2/File/Ro/RoList';
import ItemList from '@/components/DCI/input/ItemList.vue';
import TemplateItemList from '@/components/DCI/input/ItemList.vue';
import RowPrice from '@/components/DCI/wizzard-file/rowPrice.vue';
import { RoAlgo } from '@/services/algorithm/RoAlgo';
import { getCeeBonus, getHelpingHandRo, getMaPrimeRenov } from '@/services/file/fileCommonService';
import InputDiscount from '@/components/DCI/input/Discount.vue';
import { MODEL_ATLANTIC, RoAlgoV2 } from '@/services/algorithm/RoAlgoV2';
import SelectedProduct from '@/components/DCI/input/SelectedProduct.vue';

export default defineComponent( {
                                    name:       'file-pac-ro-step-4',
                                    components: {
                                        SelectedProduct,
                                        InputDiscount,
                                        RowPrice,
                                        ItemList,
                                        Step4Header,
                                        WizzardFilePrice,
                                        BlankOptions,
                                        Options,
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
                                        const _selectedProducts = ref<Product[]>( ( props.selectedProducts as Product[] ) );

                                        console.log( 'PROPS' );
                                        console.log( 'PROPS' );
                                        console.log( 'PROPS' );
                                        console.log( 'PROPS' );
                                        console.log( props.selectedProducts );
                                        const selectedIntProduct = ref<Product | undefined>( undefined );
                                        if ( _selectedProducts.value !== undefined && _selectedProducts.value.length > 1 ) {
                                            selectedIntProduct.value = _selectedProducts.value[ 1 ];
                                        }

                                        const selectedExtProduct = ref<Product | undefined>( undefined );
                                        if ( _selectedProducts.value !== undefined && _selectedProducts.value.length > 0 ) {
                                            selectedExtProduct.value = _selectedProducts.value[ 0 ];
                                        }

                                        const _options      = ref<Option[]>( ( props.options as Option[] ) );
                                        const _blankOptions = ref<BlankOption[]>( ( props.blankOptions as BlankOption[] ) );
                                        const lists         = ref<RoList>( ( props.fileData.lists as RoList ) );

                                        const deviceToReplace = ref( props.fileData.quotation.deviceToReplace );
                                        const discount        = ref<number>( props.fileData.quotation.discount );
                                        const volumeECS       = ref<string>( props.fileData.quotation.volumeECS );

                                        const disabledBonus             = ref<boolean>( props.fileData.disabledBonus );
                                        const disabledCeeBonus          = ref<boolean>( props.fileData.disabledCeeBonus );
                                        const disabledMaPrimeRenovBonus = ref<boolean>( props.fileData.disabledMaPrimeRenovBonus );

                                        const estimateMaPrimeRenov = ref<number>( 0 );

                                        // Si on ouvre un dossier avec l'ancien fonctionnement d'ECS
                                        if ( typeof volumeECS.value === 'number' ) {
                                            if ( volumeECS.value === 0 ) {
                                                volumeECS.value = 'ecs_1';
                                            } else if ( volumeECS.value === 150 ) {
                                                volumeECS.value = 'ecs_4';
                                            } else if ( volumeECS.value === 180 ) {
                                                volumeECS.value = 'ecs_2';
                                            } else if ( volumeECS.value === 200 ) {
                                                volumeECS.value = 'ecs_5';
                                            } else if ( volumeECS.value === 230 ) {
                                                volumeECS.value = 'ecs_3';
                                            } else if ( volumeECS.value === 300 ) {
                                                volumeECS.value = 'ecs_6';
                                            } else {
                                                volumeECS.value = 'ecs_1';
                                            }
                                        }

                                        const sizingPercentage     = ref<number>( props.fileData.quotation.sizingPercentage ?? 80 );
                                        const needBiZoneSupplement = ref<boolean>( false );

                                        const roAlgo   = new RoAlgo( props.fileData.housing );
                                        const roAlgoV2 = new RoAlgoV2( props.fileData.housing );

                                        const generateQuotation = () => {
                                            ctx.emit( 'generateQuotation' );
                                        };

                                        const generateAddressCertificate = () => {
                                            ctx.emit( 'generateAddressCertificate' );
                                        };

                                        const updateOptions = ( options ) => {
                                            _options.value = options;
                                        };

                                        const updateBlankOtions = ( blankOptions ) => {
                                            _blankOptions.value = blankOptions;
                                        };

                                        const updateBonus = ( data: {
                                            bonus: boolean;
                                            ceeBonus: boolean;
                                            maPrimeRenovBonus: boolean;
                                        } ) => {
                                            disabledBonus.value             = data.bonus;
                                            disabledCeeBonus.value          = data.ceeBonus;
                                            disabledMaPrimeRenovBonus.value = data.maPrimeRenovBonus;
                                        };


                                        const updateDiscount = ( value ) => {
                                            discount.value = value;
                                        };

                                        const updateNeedBiZone = ( value: boolean ) => {
                                            needBiZoneSupplement.value = value;
                                        };

                                        const ecsDeporte = props.fileData.quotation.products.filter( p => p.productType === 'ecs' );
                                        const kitBiZone  = props.fileData.quotation.products.filter( p => p.productType === 'kit_bi_zone' );

                                        const selectedEcsDeportes = computed<Product[]>( () => {
                                            // Reset le volume si jamais on switch en ECS et ECSDeporté
                                            if ( volumeECS.value === 'ecs_4' ) {
                                                return ecsDeporte.filter( ecs => ecs.volume === 150 );
                                            } else if ( volumeECS.value === 'ecs_5' ) {
                                                return ecsDeporte.filter( ecs => ecs.volume === 200 );
                                            } else if ( volumeECS.value === 'ecs_6' ) {
                                                return ecsDeporte.filter( ecs => ecs.volume === 300 );
                                            }

                                            return [];
                                        } );

                                        const selectedKitBiZone = computed<Product[]>( () => {
                                            if ( needBiZoneSupplement.value ) {
                                                return kitBiZone;
                                            }
                                            return [];
                                        } );

                                        const updateSelectedProduct = ( product, index ) => {
                                            console.log( '%c updateSelectedProduct',
                                                         'background: #00FF9F; color: #000000' );
                                            _selectedProducts.value[ index ] = product;
                                            console.log( `Selected products ${ index }`,
                                                         _selectedProducts.value[ index ] );
                                            if ( index === 0 ) {
                                                console.log( 'EXT PRODUCT : ', product );
                                                selectedExtProduct.value = product;
                                            }

                                            if ( index === 1 ) {
                                                console.log( 'INT PRODUCT : ', product );
                                                selectedIntProduct.value = product;
                                            }
                                        };


                                        const extProducts = computed<Product[]>( () => {
                                            console.log( '%c COMPUTE EXT PRODUCT',
                                                         'background: #00FF9F; color: #000000' );
                                            roAlgoV2.updateHousing( props.fileData.housing );
                                            let response;
                                            let model = 'daikin';

                                            if ( volumeECS.value.includes( '_atl_' ) ) {
                                                model = 'atlantic';
                                            }

                                            if ( volumeECS.value === 'ecs_1' ) {
                                                response = roAlgoV2.getProducts( 0, sizingPercentage.value, model );
                                            } else if ( volumeECS.value === 'ecs_2' ) {
                                                response = roAlgoV2.getProducts( 180, sizingPercentage.value, model );
                                            } else if ( volumeECS.value === 'ecs_3' ) {
                                                response = roAlgoV2.getProducts( 230, sizingPercentage.value, model );
                                            } else if ( volumeECS.value === 'ecs_atl_1' ) {
                                                response = roAlgoV2.getProducts( 0, sizingPercentage.value, model );
                                            } else if ( volumeECS.value === 'ecs_atl_2' ) {
                                                response = roAlgoV2.getProducts( 180, sizingPercentage.value, model );
                                            } else {
                                                // ECS DEPORTÉ DONC ECS = 0
                                                response = roAlgoV2.getProducts( 0,
                                                                                 sizingPercentage.value,
                                                                                 model,
                                                                                 true );
                                            }

                                            console.log( '%c SELECTED', 'background: #fdd835; color: #000000' );
                                            console.log( '%c SELECTED', 'background: #fdd835; color: #000000' );
                                            console.log( '%c SELECTED', 'background: #fdd835; color: #000000' );
                                            console.log( '%c SELECTED', 'background: #fdd835; color: #000000' );
                                            console.log( selectedExtProduct.value );
                                            if ( selectedExtProduct.value !== undefined ) {
                                                const seP: Product = selectedExtProduct.value;
                                                const product      = response.externals.find( p => seP.reference === p.reference );
                                                if ( product !== undefined ) {
                                                    updateSelectedProduct( product, 0 );
                                                } else {
                                                    updateSelectedProduct( response.externals[ 0 ], 0 );
                                                }
                                            } else {
                                                updateSelectedProduct( response.externals[ 0 ], 0 );
                                            }

                                            updateSelectedProduct( response.internal, 1 );
                                            updateNeedBiZone( response.needBiZoneSupplement );

                                            return response.externals;
                                        } );

                                        console.log( '%c BEFORE', 'background: #fdd835; color: #000000' );

                                        const hiddenProducts = computed<Product[]>( () => {
                                            return [
                                                ...selectedKitBiZone.value,
                                                ...selectedEcsDeportes.value,
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


                                        const filteredOptions = computed<Option[]>( () => {
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
                                                    console.log( selectedExtProduct.value !== undefined
                                                                 ? selectedExtProduct.value.reference
                                                                 : 'undefined' );
                                                    let enabled = false;
                                                    if ( selectedExtProduct.value !== undefined &&
                                                        ( selectedExtProduct.value.reference.includes( 'EPGA' ) || selectedExtProduct.value.reference.includes(
                                                            'EPRA' ) ) ) {
                                                        enabled = true;
                                                    }
                                                    enabledSoupageOption( enabled );
                                                }

                                                if ( option.label.includes( 'Forfait ballon tampon' ) ) {
                                                    // props.fileData.housing.heaters;
                                                    if ( props.fileData.housing.heaters === 'r_fonte' || props.fileData.housing.heaters === 'r_fonte_p_chauffant' || props.fileData.housing.heaters === 'r_autre' || props.fileData.housing.heaters === 'r_autre_p_chauffant' ) {
                                                        console.log( '%c IN', 'background: #15FF5E; color: #000000' );
                                                        const enabled = selectedExtProduct.value !== undefined && selectedExtProduct.value.model === MODEL_ATLANTIC;
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


                                        const price = computed<Price>( () => {
                                            let totalHt      = 0;
                                            let maPrimeRenov = 0;
                                            let ceeBonus     = 0;

                                            if ( selectedExtProduct.value !== undefined ) {
                                                totalHt += selectedExtProduct.value.pu * selectedExtProduct.value.quantity;
                                            }

                                            if ( selectedIntProduct.value !== undefined ) {
                                                totalHt += selectedIntProduct.value.pu * selectedIntProduct.value.quantity;
                                            }

                                            for ( const product of selectedEcsDeportes.value ) {
                                                totalHt += product.pu * product.quantity;
                                            }

                                            for ( const product of selectedKitBiZone.value ) {
                                                totalHt += product.pu * product.quantity;
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
                                            const codeBonus     = getCodeBonus();
                                            const lessThan2Year = getLessThan2Year();

                                            let tva = getTva();
                                            if ( lessThan2Year ) {
                                                tva = 20;
                                            }
                                            const totalTva = tva * totalHt / 100;
                                            const totalTtc = totalHt + totalTva;

                                            // Si les primes sont actives
                                            if ( !disabledBonus.value ) {

                                                // Si la prime CEE est active
                                                if ( !disabledCeeBonus.value ) {

                                                    if ( deviceToReplace.value.type !== 'aucun' && deviceToReplace.value.type !== 'autre' ) {
                                                        // Coup de pouce
                                                        ceeBonus = getHelpingHandRo( codeBonus );
                                                    } else {
                                                        // Afin d'avoir les derniers produits pour le calcul de la prime
                                                        const tempSelectedproducts: Product[] = [];

                                                        if ( selectedExtProduct.value !== undefined ) {
                                                            tempSelectedproducts.push( selectedExtProduct.value );
                                                        }

                                                        if ( selectedIntProduct.value !== undefined ) {
                                                            tempSelectedproducts.push( selectedIntProduct.value );
                                                        }
                                                        console.log( '%c BEFORE SAVE',
                                                                     'background: #fdd835; color: #000000' );
                                                        console.log( '%c BEFORE SAVE',
                                                                     'background: #fdd835; color: #000000' );
                                                        console.log( '%c BEFORE SAVE',
                                                                     'background: #fdd835; color: #000000' );
                                                        console.log( '%c BEFORE SAVE',
                                                                     'background: #fdd835; color: #000000' );
                                                        console.log( '%c BEFORE SAVE',
                                                                     'background: #fdd835; color: #000000' );
                                                        console.log( '%c BEFORE SAVE',
                                                                     'background: #fdd835; color: #000000' );
                                                        console.log( tempSelectedproducts );
                                                        const updatedFileData: RoFile = {
                                                            ...props.fileData,
                                                            quotation: {
                                                                ...props.fileData.quotation,
                                                                selectedProducts: tempSelectedproducts,
                                                            },
                                                        };
                                                        ceeBonus                      = getCeeBonus( updatedFileData );
                                                    }
                                                }

                                                // Si MaprimeRenov est actif
                                                // TTC - Discount on doit déduire la remise du TTC pour avoir la bonne valeur
                                                if ( !disabledMaPrimeRenovBonus.value ) {
                                                    maPrimeRenov = getMaPrimeRenov( props.fileData.type,
                                                                                    ( totalTtc - discount.value ),
                                                                                    ceeBonus );

                                                } else {
                                                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                                                    estimateMaPrimeRenov.value = getMaPrimeRenov( props.fileData.type,
                                                                                                  ( totalTtc - discount.value ),
                                                                                                  ceeBonus );
                                                }
                                            }

                                            const totalPrime = maPrimeRenov + ceeBonus;

                                            const price: Price = {
                                                HT:             totalHt,
                                                TVA:            lessThan2Year ? 0 : totalTva,
                                                TVA20:          lessThan2Year ? totalTva : 0,
                                                TTC:            totalTtc,
                                                maPrimeRenov:   maPrimeRenov,
                                                remainderToPay: totalTtc - totalPrime - discount.value,
                                                CEE:            ceeBonus,
                                                discount:       discount.value,
                                            };

                                            ctx.emit( 'calculedPrice', price );

                                            return price;
                                        } );

                                        return {
                                            extProducts,
                                            selectedIntProduct,
                                            selectedExtProduct,
                                            hiddenProducts,
                                            deviceToReplace,
                                            selectedEcsDeportes,
                                            selectedKitBiZone,
                                            volumeECS,
                                            lists,
                                            price,
                                            filteredOptions,
                                            // products,
                                            needBiZoneSupplement,
                                            discount,
                                            roAlgo,
                                            roAlgoV2,
                                            estimateMaPrimeRenov,
                                            updateOptions,
                                            updateBlankOtions,
                                            updateDiscount,
                                            generateQuotation,
                                            generateAddressCertificate,
                                            sizingPercentage,
                                            updateBonus,
                                            updateSelectedProduct,
                                        };
                                    },
                                } );
</script>

<style>
textarea {
    resize : none;
}
</style>
