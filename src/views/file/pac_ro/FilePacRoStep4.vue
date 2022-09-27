<template>
    <div class="w-100">

        <step4-header :payment-on-credit="fileData.quotation.paymentOnCredit"
                      :price="price"
                      :lists="lists"></step4-header>

        <div class="row">
            <div class="col-md-6 mb-5">
                <label for="sizingPercentage" class="form-label">La pompe à chaleur doit couvrir au minimum 60% et au
                                                                 maximum 110% des déperditions de la maison à la
                                                                 température de base.<br><b>Quelle pourcentage voulez
                                                                                            choisir ?</b></label>
                <Field name="sizingPercentage"
                       id="sizingPercentage"
                       class="form-select"
                       as="select"
                       v-model="sizingPercentage"
                >
                    <template-item-list :lists="[
                        {
                            slug:'65',
                            value: 65
                        },
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
                         {
                            slug:'105',
                            value: 105
                        },

                    ]"></template-item-list>
                </Field>
            </div>
            <div class="col-md-6 mb-5">
                Dimensionnement à {{ sizingPercentage }}% des déperditions =
                {{ ( roAlgo.calcRequiredPower( fileData.housing ) * ( sizingPercentage / 100 ) ).toFixed( 4 ) }}KW
            </div>
        </div>

        <el-divider class="mb-10"></el-divider>

        <div class="row mt-10">
            <div class="col-md-6 mb-5">
                <label for="deviceToReplaceType" class="form-label">Appareil à remplacer</label>
                <Field name="deviceToReplaceType"
                       id="deviceToReplaceType"
                       class="form-select"
                       as="select"
                       v-model="deviceToReplace.type"
                >
                    <item-list :lists="lists.typeChaudiereList"></item-list>
                </Field>
            </div>
            <template v-if="deviceToReplace.type !== 'aucun'">
                <div class="col-md-3 mb-5">
                    <label for="deviceToReplaceBrand" class="form-label mb-3">Marque</label>
                    <Field
                        type="text"
                        name="deviceToReplaceBrand"
                        id="deviceToReplaceBrand"
                        class="form-control"
                        v-model="deviceToReplace.brand"

                    >
                    </Field>
                </div>
                <div class="col-md-3 mb-5">
                    <label for="deviceToReplaceModel" class="form-label mb-3">Modèle</label>
                    <Field
                        type="text"
                        name="deviceToReplaceModel"
                        id="deviceToReplaceModel"
                        class="form-control"
                        v-model="deviceToReplace.model"
                    >
                    </Field>
                </div>
            </template>
        </div>
        <div class="row mt-10 d-flex align-items-end">
            <!--      <div class="col-md-6 mb-5">-->
            <!--        <label for="isEcsDeporte" class="form-check form-switch form-check-custom">-->
            <!--          <Field-->
            <!--              type="checkbox"-->
            <!--              class="form-check-input h-30px w-55px"-->
            <!--              name="isEcsDeporte"-->
            <!--              id="isEcsDeporte"-->
            <!--              :value="true"-->
            <!--              v-model="isEcsDeporte"-->
            <!--          />-->
            <!--          <span class="form-check-label fw-bold text-gray-600 me-5">Volume ECS déporté</span>-->
            <!--        </label>-->
            <!--      </div>-->
            <!--      <template v-if="isEcsDeporte">-->
            <!--        <div class="col-md-6 mb-5">-->
            <!--          <label for="volumeECSDeporte" class="form-label">Volume ECS déporté</label>-->

            <!--          <Field name="volumeECSDeporte"-->
            <!--                 id="volumeECSDeporte"-->
            <!--                 class="form-select"-->
            <!--                 as="select"-->
            <!--                 v-model.number="volumeECSDeporte"-->

            <!--          >-->
            <!--            <option :value="150">150</option>-->
            <!--            <option :value="200">200</option>-->
            <!--            <option :value="300">300</option>-->
            <!--          </Field>-->
            <!--        </div>-->
            <!--      </template>-->
            <!--      <div class="col-md-6 mb-5">-->
            <!--        <label for="volumeECS" class="form-label">Volume ECS</label>-->
            <!--        <Field name="volumeECS"-->
            <!--               id="volumeECS"-->
            <!--               class="form-select"-->
            <!--               as="select"-->
            <!--               v-model.number="volumeECS"-->
            <!--        >-->
            <!--          <option value="ecs_1">0L</option>-->
            <!--          <option value="ecs_2">180L</option>-->
            <!--          <option value="ecs_3">230L</option>-->
            <!--          <option value="ecs_4">150L Déporté</option>-->
            <!--          <option value="ecs_5">200L Déporté</option>-->
            <!--          <option value="ecs_6">300L Déporté</option>-->
            <!--        </Field>-->
            <!--      </div>-->
            <div class="col-md-12 mb-5">
                <!--        <h1>VOLUME ECS SÉLECTIONNÉ {{ volumeECS }}</h1>-->
                <h6 class="mb-5">Volume ECS : </h6>

                <Field name="volumeECS"
                       id="r_ecs_1"
                       class="form-check-input ms-5"
                       type="radio"
                       value="ecs_1"
                       v-model="volumeECS"
                >
                </Field>
                <label class="ms-2" for="r_ecs_1">0L</label>

                <Field name="volumeECS"
                       id="r_ecs_2"
                       class="form-check-input ms-5"
                       type="radio"
                       value="ecs_2"
                       v-model="volumeECS"
                >
                </Field>
                <label class="ms-2" for="r_ecs_2">180L</label>

                <Field name="volumeECS"
                       id="r_ecs_3"
                       class="form-check-input ms-5"
                       type="radio"
                       value="ecs_3"
                       v-model="volumeECS"
                >
                </Field>
                <label class="ms-2" for="r_ecs_3">230L</label>

                <Field name="volumeECS"
                       id="r_ecs_4"
                       class="form-check-input ms-5"
                       type="radio"
                       value="ecs_4"
                       v-model="volumeECS"
                >
                </Field>
                <label class="ms-2" for="r_ecs_4">150L Déporté</label>

                <Field name="volumeECS"
                       id="r_ecs_5"
                       class="form-check-input ms-5"
                       type="radio"
                       value="ecs_5"
                       v-model="volumeECS"
                >
                </Field>
                <label class="ms-2" for="r_ecs_5">200L Déporté</label>

                <Field name="volumeECS"
                       id="r_ecs_6"
                       class="form-check-input ms-5"
                       type="radio"
                       value="ecs_6"
                       v-model="volumeECS"
                >
                </Field>
                <label class="ms-2" for="r_ecs_6">300L Déporté</label>
            </div>

        </div>

        <el-divider class="mb-10"></el-divider>

        <step4-quotation-header></step4-quotation-header>

        <template v-for="p in products" v-bind:key="p.reference">
            <row-price :product="p"></row-price>
        </template>
        <template v-if="!products.length">
            <div class="alert alert-danger d-flex align-items-center p-5 mb-10">
                <i class="fa fa-exclamation fs-2hx me-4 text-danger"></i>
                <div class="d-flex flex-column">
                    <h4 class="mb-1 text-danger">Aucun produit n'a pu être trouvé</h4>
                </div>
            </div>
        </template>

        <!--    <template v-for="kit in selectedKitCascade" v-bind:key="kit.reference">-->
        <!--      <row-price :product="kit"></row-price>-->
        <!--    </template>-->

        <template v-for="ecs in selectedEcsDeportes" v-bind:key="ecs.reference">
            <row-price :product="ecs"></row-price>
        </template>

        <template v-for="kitBiZone in selectedKitBiZone" v-bind:key="kitBiZone.reference">
            <row-price :product="kitBiZone"></row-price>
        </template>

        <!-- Formualaire caché afin de binder les values au formulaire comme la sélection des produits se fait via l'algo-->
        <!--    <div class="row d-none">-->
        <!--      <label for="cascadeSystem" class="form-check form-switch form-check-custom">-->
        <!--        <Field-->
        <!--            type="checkbox"-->
        <!--            class="form-check-input h-30px w-55px"-->
        <!--            name="cascadeSystem"-->
        <!--            id="cascadeSystem"-->
        <!--            :value="true"-->
        <!--            v-model="cascadeSystem"-->
        <!--        />-->
        <!--      </label>-->
        <!--    </div>-->

        <!-- Formualaire caché afin de binder les values au formulaire comme la sélection des produits se fait via l'algo-->
        <template v-for="(p, index) in allProducts" v-bind:key="`val_${p.reference}_${p.id}`">
            <div class="row d-none">
                <Field type="number"
                       :name="`selectedProducts[${index}].id`"
                       class="form-control"
                       v-model.number="p.id" />
                <Field type="number"
                       :name="`selectedProducts[${index}].quantity`"
                       class="form-control"
                       v-model.number="p.quantity" />
                <Field type="number"
                       :name="`selectedProducts[${index}].pu`"
                       class="form-control"
                       v-model.number="p.pu" />
            </div>
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
import { getCodeBonus, getLessThan2Year, getProductByRef, getTva } from '@/services/data/dataService';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import RoList from '@/types/v2/File/Ro/RoList';
import ItemList from '@/components/DCI/input/ItemList.vue';
import TemplateItemList from '@/components/DCI/input/ItemList.vue';
import RowPrice from '@/components/DCI/wizzard-file/rowPrice.vue';
import { RoAlgo } from '@/services/algorithm/RoAlgo';
import { getCeeBonus, getHelpingHandRo, getMaPrimeRenov } from '@/services/file/fileCommonService';
import InputDiscount from '@/components/DCI/input/Discount.vue';

export default defineComponent( {
                                    name:       'file-pac-ro-step-4',
                                    components: {
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
                                        options:      Array as () => Option[],
                                        blankOptions: Array as () => BlankOption[],
                                        fileData:     {
                                            type:     Object as () => RoFile,
                                            required: true,
                                        },
                                        forceRefresh: Boolean,  // Pour focer le compute des prix quand on arrive sur la step4
                                    },
                                    emits:      [ 'generateQuotation', 'generateAddressCertificate', 'calculedPrice' ],
                                    setup( props, ctx ) {
                                        const _options      = ref<Option[]>( ( props.options as Option[] ) );
                                        const _blankOptions = ref<BlankOption[]>( ( props.blankOptions as BlankOption[] ) );
                                        const lists         = ref<RoList>( ( props.fileData.lists as RoList ) );

                                        const deviceToReplace  = ref( props.fileData.quotation.deviceToReplace );
                                        const discount         = ref<number>( props.fileData.quotation.discount );
                                        // const isEcsDeporte    = ref<boolean>( props.fileData.quotation.isEcsDeporte );
                                        const volumeECS        = ref<string>( props.fileData.quotation.volumeECS );

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

                                        const sizingPercentage = ref<number>( props.fileData.quotation.sizingPercentage ?? 80 );
                                        console.log( '__ecs Volume ECS on Setup -->', volumeECS.value );
                                        // const volumeECSDeporte     = ref<number>( +props.fileData.quotation.volumeECSDeporte );
                                        const needBiZoneSupplement = ref<boolean>( false );

                                        // if ( volumeECS.value !== 180 && volumeECS.value !== 230 ) {
                                        //   console.log( 'Volume ECS IN IF OTHER 180/230', volumeECS );
                                        //   // SI pas 180 ou 230 FORCE à 1
                                        //   // HACK QUAND VALUE à 0 BUG
                                        //   volumeECS.value = 1;
                                        //   console.log( 'Volume ECS IN IF AFTER SET TO 1', volumeECS );
                                        // }
                                        //
                                        // if ( volumeECSDeporte.value !== 150 && volumeECSDeporte.value !== 200 && volumeECSDeporte.value !== 300 ) {
                                        //   volumeECSDeporte.value = 150;
                                        // }

                                        const roAlgo = new RoAlgo( props.fileData.housing );

                                        // TODO REVOIR LE SYSTEME DE CASCADE
                                        // const cascadeSystem = ref<boolean>( props.fileData.quotation.cascadeSystem );

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

                                        const updateDiscount = ( value ) => {
                                            console.log( 'updateDiscount' );
                                            discount.value = value;
                                        };

                                        // const updateCascadeSystem = ( value: boolean ) => {
                                        //   cascadeSystem.value = value;
                                        // };

                                        const updateNeedBiZone = ( value: boolean ) => {
                                            console.log( 'IN update -->', value );
                                            needBiZoneSupplement.value = value;
                                        };

                                        // const resetVolumeECS = ( isEcsDeporte: boolean ) => {
                                        //   console.log( 'Volume ECS IN RESET', volumeECS );
                                        //   if ( isEcsDeporte ) {
                                        //     // HACK QUAND VALUE à 0 BUG
                                        //     volumeECS.value = 1;
                                        //   } else {
                                        //     volumeECSDeporte.value = 150;
                                        //   }
                                        //   console.log( 'Volume ECS AFTER RESET', volumeECS );
                                        // };

                                        const ecsDeporte = props.fileData.quotation.products.filter( p => p.productType === 'ecs' );
                                        // const kitCascade = props.fileData.quotation.products.filter( p => p.productType === 'kit_cascade' );
                                        const kitBiZone  = props.fileData.quotation.products.filter( p => p.productType === 'kit_bi_zone' );

                                        const selectedEcsDeportes = computed<Product[]>( () => {
                                            // Reset le volume si jamais on switch en ECS et ECSDeporté
                                            // resetVolumeECS( isEcsDeporte.value );

                                            console.log( '%c COMPUTED ECS DEPORTE',
                                                         'background: #fdd835; color: #000000' );
                                            console.log( '__ecs volumeECS.value IN selectedEcsDeportes computed',
                                                         volumeECS.value );

                                            if ( volumeECS.value === 'ecs_4' ) {
                                                return ecsDeporte.filter( ecs => ecs.volume === 150 );
                                            } else if ( volumeECS.value === 'ecs_5' ) {
                                                return ecsDeporte.filter( ecs => ecs.volume === 200 );
                                            } else if ( volumeECS.value === 'ecs_6' ) {
                                                return ecsDeporte.filter( ecs => ecs.volume === 300 );
                                            }

                                            // if ( volumeECS.value === 150 || volumeECS.value === 200 || volumeECS.value === 300 ) {
                                            //   return ecsDeporte.filter( ecs => ecs.volume === volumeECS.value );
                                            // }

                                            return [];
                                        } );

                                        const selectedKitBiZone = computed<Product[]>( () => {
                                            console.log( '%c IN COMPUTED SELECT KIT BI ZONE',
                                                         'background: #DAFF83; color: #000000' );
                                            if ( !needBiZoneSupplement.value ) {
                                                return [];
                                            }
                                            return kitBiZone;
                                        } );

                                        // const selectedKitCascade = computed<Product[]>( () => {
                                        //   console.log( '%c KIT CASCADE', 'background: #fdd835; color: #000000' );
                                        //   console.log( cascadeSystem );
                                        //   if ( !cascadeSystem.value ) {
                                        //     return [];
                                        //   }
                                        //   return kitCascade;
                                        // } );

                                        const products = computed<Product[]>(
                                            () => {
                                                console.log( '%c COMPUTED PRODUCTS',
                                                             'background: #0094BE; color: #000000' );
                                                roAlgo.updateHousing( props.fileData.housing );

                                                console.log( 'Volume ECS IN COMPUTED PRODUCT', volumeECS.value );
                                                console.log( '__ecs Volume ECS IN COMPUTED PRODUCT', volumeECS.value );

                                                // if ( volumeECS.value === undefined ) {
                                                //   console.log( 'Volume ECS IS UNDEFINED', volumeECS );
                                                //   // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                                                //   volumeECS.value = 0;
                                                // }
                                                console.log( 'Volume ECS IN COMPUTED PRODUCT AFTER UNDEFINED',
                                                             volumeECS.value );

                                                let response;

                                                if ( volumeECS.value === 'ecs_1' ) {
                                                    response = roAlgo.getUnitsRo( 0, sizingPercentage.value );
                                                } else if ( volumeECS.value === 'ecs_2' ) {
                                                    response = roAlgo.getUnitsRo( 180, sizingPercentage.value );
                                                } else if ( volumeECS.value === 'ecs_3' ) {
                                                    response = roAlgo.getUnitsRo( 230, sizingPercentage.value );
                                                } else {
                                                    // ECS DEPORTÉ DONC ECS = 0
                                                    response = roAlgo.getUnitsRo( 0, sizingPercentage.value );
                                                }
                                                console.log( 'Response', response );

                                                if ( response === null ) {
                                                    return [];
                                                }

                                                const productExt: Product | undefined = getProductByRef( response.unitExt.ref );
                                                const productInt: Product | undefined = getProductByRef( response.unitInt.ref );
                                                console.log( 'Need biZone Value', needBiZoneSupplement.value );
                                                updateNeedBiZone( response.needBiZoneSupplement );
                                                console.log( 'Need biZone Value', needBiZoneSupplement.value );

                                                if ( productExt === undefined || productInt === undefined ) {
                                                    return [];
                                                }
                                                return [ productExt, productInt ];
                                                // const response = getPacRo( props.fileData.quotation.ceilingHeight,
                                                //                            props.fileData.housing.area,
                                                //                            props.fileData.energyZone,
                                                //                            props.fileData.housing.buildingCoefficient,
                                                //                            ( props.fileData.housing.availableVoltage as string ),
                                                //                            volumeECS.value );
                                                //
                                                //
                                                // const productInt = getProductByRef( response.productInt );
                                                // const productExt = getProductByRef( response.productExt );
                                                //
                                                // if ( productInt === undefined || productExt === undefined ) {
                                                //   console.log( '%c NOT FOUD', 'background: #FF0017; color: #000000' );
                                                //   return [];
                                                // }
                                                //
                                                // // Système cascade  = 2 produits
                                                // if ( response.cascadeSystem ) {
                                                //   productInt.quantity = 2;
                                                //   productExt.quantity = 2;
                                                // } else {
                                                //   productInt.quantity = 1;
                                                //   productExt.quantity = 1;
                                                // }
                                                //
                                                // updateCascadeSystem( response.cascadeSystem );
                                                //
                                                // return [ productInt, productExt ];
                                            } );

                                        const allProducts = computed<Product[]>( () => {
                                            console.log( '%c COMPUTED ALLPRoducts',
                                                         'background: #FF0017; color: #000000' );

                                            const allProducts = [
                                                ...products.value,
                                                // ...selectedKitCascade.value,
                                                ...selectedKitBiZone.value,
                                                ...selectedEcsDeportes.value,
                                            ];
                                            console.log( products.value );
                                            // console.log( selectedKitCascade.value );
                                            console.log( selectedKitBiZone.value );
                                            console.log( selectedEcsDeportes.value );

                                            console.log( allProducts );
                                            for ( const p of allProducts ) {
                                                console.log( `${ p.id } - ${ p.label } - ${ p.quantity } - ${ p.pu }` );
                                            }

                                            return allProducts;
                                        } );

                                        /**
                                         * Ajoute ou enlève l'option Soupape antigel selon les PAC
                                         */
                                        const enabledSoupageOption = ( enabled: boolean ) => {
                                            console.log( '%c enabledSoupageOption',
                                                         'background: #F600FF; color: #000000' );
                                            console.log( enabled );
                                            const soupapeOption = _options.value.find( o => o.label === 'Soupape antigel' );
                                            if ( soupapeOption === undefined ) {
                                                return;
                                            }

                                            // Change le nombre de l'option Soupape antigel pour l'activer ou non
                                            _options.value = _options.value.map( o => {
                                                if ( enabled && o.label === 'Soupape antigel' ) {
                                                    console.log( '%c ENABLED', 'background: #00FF2E; color: #000000' );
                                                    return { ...o, number: 2 };
                                                } else if ( !enabled && o.label === 'Soupape antigel' ) {
                                                    console.log( '%c DISABMED', 'background: #FF000A; color: #000000' );
                                                    return { ...o, number: 0 };
                                                }
                                                return o;
                                            } );
                                        };

                                        /**
                                         * Ajoute ou enlève l'option Forfait ballon tampon
                                         */
                                        const enabledBallonTamponOption = ( enabled: boolean ) => {
                                            console.log( '%c enabledBallonTamponOption',
                                                         'background: #F600FF; color: #000000' );
                                            console.log( enabled );
                                            const ballonTamponOption = _options.value.find( o => o.label.includes(
                                                'Forfait ballon tampon' ) );
                                            if ( ballonTamponOption === undefined ) {
                                                return;
                                            }

                                            // Change le nombre de l'option Forfait ballon tampon pour l'activer ou non
                                            _options.value = _options.value.map( o => {
                                                if ( enabled && o.label.includes( 'Forfait ballon tampon' ) ) {
                                                    console.log( '%c ENABLED', 'background: #00FF2E; color: #000000' );
                                                    return { ...o, number: 1 };
                                                } else if ( !enabled && o.label.includes( 'Forfait ballon tampon' ) ) {
                                                    console.log( '%c DISABMED', 'background: #FF000A; color: #000000' );
                                                    return { ...o, number: 0 };
                                                }
                                                return o;
                                            } );
                                        };

                                        /**
                                         * Ajoute ou enlève l'option Mitigeur
                                         */
                                        const enabledMitigeurOption = ( enabled: boolean ) => {
                                            console.log( '%c enabledMitigeurOption',
                                                         'background: #F600FF; color: #000000' );
                                            console.log( enabled );
                                            const mitigeurOption = _options.value.find( o => o.label.includes(
                                                'Forfait ballon tampon' ) );
                                            if ( mitigeurOption === undefined ) {
                                                return;
                                            }

                                            // Change le nombre de l'option Forfait ballon tampon pour l'activer ou non
                                            _options.value = _options.value.map( o => {
                                                if ( enabled && o.label.includes( 'Forfait mitigeur' ) ) {
                                                    console.log( '%c ENABLED', 'background: #00FF2E; color: #000000' );
                                                    return { ...o, number: 1 };
                                                } else if ( !enabled && o.label.includes( 'Forfait mitigeur' ) ) {
                                                    console.log( '%c DISABMED', 'background: #FF000A; color: #000000' );
                                                    return { ...o, number: 0 };
                                                }
                                                return o;
                                            } );
                                        };


                                        const filteredOptions = computed<Option[]>( () => {
                                            console.log( '%c FILTERED OPTION', 'background: #FF0007; color: #000000' );
                                            console.log( _options.value );

                                            for ( const option of _options.value ) {

                                                if ( props.fileData.housing.availableVoltage === 'triphase' && option.id === 24 ) {
                                                    console.log( '%c OPTION ID 24',
                                                                 'background: #fdd835; color: #000000' );
                                                    console.log( option.pu );
                                                    console.log( option.defaultPu );

                                                    // Si le PU n'a pas déja été augmenté
                                                    if ( option.pu === option.defaultPu ) {
                                                        console.log( '%c PU + 400',
                                                                     'background: #fdd835; color: #000000' );
                                                        option.pu += 400;
                                                    }
                                                } else if ( option.id === 24 ) {
                                                    // Si le PU a été modifié
                                                    if ( option.pu !== option.defaultPu ) {
                                                        console.log( '%c PU - 400',
                                                                     'background: #fdd835; color: #000000' );
                                                        option.pu -= 400;
                                                    }
                                                }

                                                if ( option.label.includes( 'Soupape antigel' ) ) {
                                                    let enabled = false;
                                                    for ( const product of products.value ) {
                                                        if ( product.reference.includes( 'EPGA' ) || product.reference.includes(
                                                            'EPRA' ) ) {
                                                            enabled = true;
                                                        }
                                                    }
                                                    enabledSoupageOption( enabled );
                                                }

                                                if ( option.label.includes( 'Forfait ballon tampon' ) ) {
                                                    props.fileData.housing.heaters;
                                                    console.log( props.fileData.housing.heaters );
                                                    if ( props.fileData.housing.heaters === 'r_fonte' || props.fileData.housing.heaters === 'r_fonte_p_chauffant' || props.fileData.housing.heaters === 'r_autre' || props.fileData.housing.heaters === 'r_autre_p_chauffant' ) {
                                                        enabledBallonTamponOption( true );
                                                    } else {
                                                        enabledBallonTamponOption( false );
                                                    }
                                                }

                                                if ( option.label.includes( 'Forfait mitigeur' ) ) {
                                                    props.fileData.housing.heaters;
                                                    console.log( volumeECS.value );
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

                                            console.log( 'Prix par defaut -->', totalHt );

                                            for ( const product of products.value ) {
                                                totalHt += product.pu * product.quantity;
                                            }
                                            console.log( 'Prix avec les produits -->', totalHt );

                                            for ( const product of selectedEcsDeportes.value ) {
                                                totalHt += product.pu * product.quantity;
                                            }

                                            // for ( const product of selectedKitCascade.value ) {
                                            //   totalHt += product.pu * product.quantity;
                                            // }

                                            for ( const product of selectedKitBiZone.value ) {
                                                totalHt += product.pu * product.quantity;
                                            }

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

                                            // Si les primes sont actives
                                            if ( !props.fileData.disabledBonus ) {

                                                // Si la prime CEE est active
                                                if ( !props.fileData.disabledCeeBonus ) {

                                                    if ( deviceToReplace.value.type !== 'aucun' && deviceToReplace.value.type !== 'autre' ) {
                                                        // Coup de pouce
                                                        ceeBonus = getHelpingHandRo( codeBonus );
                                                    } else {
                                                        // Afin d'avoir les derniers produits pour le calcul de la prime
                                                        const updatedFileData: RoFile = {
                                                            ...props.fileData,
                                                            quotation: {
                                                                ...props.fileData.quotation,
                                                                selectedProducts: products.value,
                                                            },
                                                        };
                                                        console.log( '%c BEFORE CEE',
                                                                     'background: #fdd835; color: #000000' );
                                                        console.log( 'Products -->', products.value );
                                                        ceeBonus = getCeeBonus( updatedFileData );
                                                    }
                                                }

                                                console.log( '%c CEE BONUS', 'background: #7950FF; color: #000000' );
                                                console.log( ceeBonus );

                                                // Si MaprimeRenov est actif
                                                // TTC - Discount on doit déduire la remise du TTC pour avoir la bonne valeur
                                                if ( !props.fileData.disabledMaPrimeRenovBonus ) {
                                                    maPrimeRenov = getMaPrimeRenov( props.fileData.type,
                                                                                    ( totalTtc - discount.value ),
                                                                                    ceeBonus );

                                                }
                                            }

                                            const totalPrime = maPrimeRenov + ceeBonus;

                                            console.log( 'tva', totalTva );
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

                                        console.log( '%c END SET UP', 'background: #fdd835; color: #000000' );
                                        console.log( ecsDeporte );
                                        // console.log( kitCascade );
                                        console.log( products );
                                        console.log( '%c END SET UP', 'background: #fdd835; color: #000000' );

                                        return {
                                            allProducts,
                                            deviceToReplace,
                                            selectedEcsDeportes,
                                            // selectedKitCascade,
                                            selectedKitBiZone,
                                            // isEcsDeporte,
                                            volumeECS,
                                            // volumeECSDeporte,
                                            // cascadeSystem,
                                            lists,
                                            price,
                                            filteredOptions,
                                            products,
                                            needBiZoneSupplement,
                                            discount,
                                            roAlgo,
                                            updateOptions,
                                            updateBlankOtions,
                                            updateDiscount,
                                            generateQuotation,
                                            generateAddressCertificate,
                                            sizingPercentage,
                                        };
                                    },
                                } );
</script>

<style>
textarea {
    resize : none;
}
</style>
