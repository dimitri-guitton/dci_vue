<template>
    <el-divider></el-divider>

    <div class="mb-10">
        <h2 class="fw-bolder text-dark">Géolocalisation & superficie</h2>
    </div>

    <div class="row mb-10">
        <div class="col-md-6">
            <label class="form-check form-switch form-check-custom">
                <Field
                    type="checkbox"
                    class="form-check-input"
                    name="housingIsAddressBenef"
                    :value="true"
                />
                <span class="form-check-label fw-bold text-gray-400">
            L'adresse du logement est la même que le bénéficiaire
          </span>
            </label>
        </div>
    </div>

    <div class="row mb-15">
        <div class="col-md-4 fv-row">
            <label class="form-label mb-3">Nature du batiment</label>
            <Field
                name="housingBuildingNature"
                as="select"
                class="form-control">
                <item-list :lists="lists.batimentNatureList"></item-list>
            </Field>
            <ErrorMessage
                name="housingBuildingNature"
                class="fv-plugins-message-container invalid-feedback"
            ></ErrorMessage>
        </div>
    </div>
    <div class="row mb-10">
        <div class="col-md-6 fv-row mb-5">
            <label class="form-label mb-3">Chercher un adresse</label>
            <input type="text" class="form-control"
                   placeholder="Rechercher..."
                   v-model="findAddress" />
        </div>
        <div class="col-md-12 position-relative">
            <div id="map"
                 v-loading="isLoading"
                 element-loading-text="Chargement de la carte"></div>
            <div v-if="!mapHasBeenHover" @mouseenter="initMap(null)" id="mapCover">
                <h1 class="text-white">Survoler la carte pour l'activer</h1>
            </div>
        </div>

    </div>
    <div class="row mb-10 d-flex justify-content-end">
        <button @click="takeScreenshot" type="button" class="btn btn-primary w-auto mx-2">Sauvergarder le plan</button>
        <button @click="openMapFolder" type="button" class="btn btn-info w-auto mx-2">Voir le plan dans le dossier
        </button>
    </div>
    <div class="row mb-10">
        <div class="col-md-5">
            <el-descriptions
                title="Données Géoportail"
                :column="1"
                border
            >
                <el-descriptions-item label="Parcelle">{{ geoportail.plot }}</el-descriptions-item>
                <el-descriptions-item label="Adresse">{{ geoportail.address }}</el-descriptions-item>
                <el-descriptions-item label="Code postal">{{ geoportail.zipCode }}</el-descriptions-item>
                <el-descriptions-item label="Ville">{{ geoportail.city }}</el-descriptions-item>
            </el-descriptions>
        </div>
        <div class="col-md-6 offset-md-1">
            <div class="row mb-5">
                <div class="col-md-10 fv-row">
                    <label class="form-label mb-3">Parcelle</label>
                    <Field
                        class="form-control"
                        name="address.plot"
                        placeholder="Commune absorbée / section / numéro"
                        v-model="geoportail.plot"
                    />
                    <ErrorMessage
                        name="address.plot"
                        class="fv-plugins-message-container invalid-feedback"
                    ></ErrorMessage>
                </div>
            </div>
            <div class="row mb-5">
                <div class="col-md-10 fv-row">
                    <label class="form-label mb-3">Adresse</label>
                    <Field
                        class="form-control"
                        name="address.address"
                        placeholder="Adresse"
                        v-model="geoportail.address"
                    />
                    <ErrorMessage
                        name="address.address"
                        class="fv-plugins-message-container invalid-feedback"
                    ></ErrorMessage>
                </div>
            </div>
            <div class="row mb-5">
                <div class="col-md-5 fv-row">
                    <label class="form-label mb-3">Code postal</label>
                    <Field
                        class="form-control"
                        name="address.zipCode"
                        placeholder="Code postal"
                        v-model="geoportail.zipCode"
                    />
                    <ErrorMessage
                        name="address.zipCode"
                        class="fv-plugins-message-container invalid-feedback"
                    ></ErrorMessage>
                </div>
                <div class="col-md-5 fv-row">
                    <label class="form-label mb-3">Ville</label>
                    <Field
                        class="form-control"
                        name="address.city"
                        placeholder="Ville"
                        v-model="geoportail.city"
                    />
                    <ErrorMessage
                        name="address.city"
                        class="fv-plugins-message-container invalid-feedback"
                    ></ErrorMessage>
                </div>
            </div>
        </div>
    </div>
    <el-divider></el-divider>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import ItemList from '@/components/DCI/input/ItemList.vue';
import * as Gp from '@ignf-geoportal/sdk-2d';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import { getcurrentFolderName } from '@/services/data/dataService';
import { FoldersNames, getFolderPath } from '@/services/folder/folderService';
import { ipcRenderer, shell } from 'electron';
import { ElMessage } from 'element-plus';
import fs from 'fs';
import { geocodingAddress, getGeoportalAddress, getGeoportalPlot } from '@/services/geocodingService';
import useDebouncedRef from '@/services/useDebouncedRef';
import { DataGeoportail } from '@/types/v2/File/Common/DataGeoportail';

export default defineComponent( {
                                    name:       'step3-address',
                                    components: { ItemList, Field, ErrorMessage },
                                    props:      {
                                        lists:    Object,
                                        fileData: {
                                            type:     Object as () => RrFile,
                                            required: true,
                                        },
                                    },
                                    setup( props ) {

                                        const isLoading       = ref<boolean>( false );
                                        const map             = ref();
                                        const mapHasBeenHover = ref<boolean>( false );

                                        const geoportail = ref<DataGeoportail>( props.fileData.housing.dataGeoportail );

                                        /**
                                         * Formate l'adresse pour le geocoding
                                         */
                                        const formattedAddress = computed( () => {
                                            if ( props.fileData.beneficiary !== undefined ) {
                                                if ( props.fileData.beneficiary.address !== '' && props.fileData.beneficiary.zipCode !== '' && props.fileData.beneficiary.city !== '' ) {
                                                    return `${ props.fileData.beneficiary.address }, ${ props.fileData.beneficiary.zipCode } ${ props.fileData.beneficiary.city }`;
                                                }
                                            }

                                            return '';
                                        } );

                                        const setDataGeoportal = ( data ) => {
                                            if ( data.locations.length > 0 ) {
                                                const location = data.locations[ 0 ];
                                                switch ( location.type ) {
                                                    case 'StreetAddress': {
                                                        const {
                                                                  postalCode,
                                                                  number,
                                                                  street,
                                                                  commune,
                                                              } = location.placeAttributes;

                                                        geoportail.value = {
                                                            ...geoportail.value,
                                                            zipCode: postalCode,
                                                            city:    commune,
                                                            address: `${ number } ${ street }`,
                                                        };
                                                    }
                                                        break;
                                                    case 'CadastralParcel': {
                                                        const {
                                                                  absorbedCity,
                                                                  section,
                                                                  number,
                                                              }               = location.placeAttributes;
                                                        geoportail.value.plot = `${ absorbedCity } / ${ section } / ${ number }`;
                                                    }
                                                        break;
                                                    default:
                                                        return;
                                                }
                                            }
                                        };


                                        /**
                                         * Initialise la carte
                                         * @param coordinate
                                         *
                                         * Retourne false si la carte existe déja
                                         **/
                                        const initMap = async ( coordinate: number[] | null = null ) => {

                                            // On s'assure que la map est Init qu'une seule fois
                                            if ( mapHasBeenHover.value ) {
                                                return;
                                            }
                                            mapHasBeenHover.value = true;

                                            isLoading.value = true;

                                            // Si pas de coordonnées en parametre, on récupère les coordonnées de l'adresse du Beneficiaire
                                            if ( coordinate === null ) {
                                                if ( formattedAddress.value !== '' ) {
                                                    coordinate = await geocodingAddress( formattedAddress.value );
                                                    if ( coordinate === null ) {
                                                        ElMessage( {
                                                                       message: `Impossible de trouver l'adresse : "${ formattedAddress.value }" sur la carte`,
                                                                       type:    'warning',
                                                                   } );
                                                        coordinate = [ -1.1220979, 46.1703322 ];
                                                    }
                                                } else {
                                                    coordinate = [ -1.1220979, 46.1703322 ];
                                                }
                                            }


                                            // Charge la map si elle n'est pas déja chargé
                                            if ( map.value === undefined ) {
                                                map.value = Gp.Map.load(
                                                    'map', // html div
                                                    {
                                                        apiKey:  'essentiels,cartes,parcellaire',
                                                        zoom:    18,
                                                        maxZoom: 20,
                                                        minZoom: 6,
                                                        center:  {
                                                            x:          coordinate[ 0 ],
                                                            y:          coordinate[ 1 ],
                                                            projection: 'CRS:84',
                                                        },
                                                        // layers to display
                                                        layersOptions: {
                                                            'ORTHOIMAGERY.ORTHOPHOTOS': {
                                                                opacity: 0.7,
                                                            },
                                                            'CADASTRALPARCELS.PARCELS': {},
                                                        },
                                                        // additional tools to display on the map
                                                        controlsOptions:  {
                                                            'layerSwitcher': {},
                                                            'drawing':       {},
                                                            'length':        {},
                                                            'area':          {},
                                                            'reversesearch': {
                                                                resources:             [ 'CadastralParcel' ],
                                                                delimitations:         [ 'Point' ],
                                                                reverseGeocodeOptions: {
                                                                    maximumResponses: 1,
                                                                    onSuccess:        ( value ) => {
                                                                        if ( value.length > 0 ) {
                                                                            const {
                                                                                      absorbedCity,
                                                                                      section,
                                                                                      number,
                                                                                  }               = value[ 0 ].placeAttributes;
                                                                            geoportail.value.plot = `${ absorbedCity } / ${ section } / ${ number }`;

                                                                            // récupère l'address depuis les coordonées
                                                                            getGeoportalAddress( [
                                                                                                     value[ 0 ].position.x,
                                                                                                     value[ 0 ].position.y,
                                                                                                 ], setDataGeoportal );
                                                                        }
                                                                    },
                                                                },
                                                            },
                                                        },
                                                        mapEventsOptions: {
                                                            // when map has finished to initialize and to render
                                                            'mapLoaded': function () {
                                                                isLoading.value  = false;
                                                                const measureBtn = document.querySelector(
                                                                    '[id^="GPtoolbox-measure-button-"]' );
                                                                if ( measureBtn !== null ) {
                                                                    // On set le type à "Button" afin que le bouton ne trigger pas l'event submit pour changer de step du wizzard
                                                                    measureBtn.setAttribute( 'type', 'button' );
                                                                }
                                                            },
                                                        },
                                                    },
                                                );
                                            }
                                        };


                                        /**
                                         * Prend un screen de l'application et sauvegarde dans le dossier map
                                         */
                                        const takeScreenshot = () => {
                                            const folderName = getcurrentFolderName() as string;
                                            const path       = `${ getFolderPath( folderName ) }/${ FoldersNames.MAP }/carte.png`;
                                            ipcRenderer.send( 'save-screenshot', { target: path } );

                                            ElMessage( {
                                                           message: 'Plan sauvegardé avec succès',
                                                           type:    'success',
                                                       } );
                                        };

                                        /**
                                         * Ouvrir la map sauvegarder (screenshot)
                                         */
                                        const openMapFolder = () => {
                                            const folderName = getcurrentFolderName() as string;
                                            const path       = `${ getFolderPath( folderName ) }/${ FoldersNames.MAP }/carte.png`;
                                            if ( fs.existsSync( path ) ) {
                                                shell.openPath( path );
                                            } else {
                                                ElMessage( {
                                                               message: 'La carte n\'exite pas/plus',
                                                               type:    'warning',
                                                           } );
                                            }
                                        };

                                        /**
                                         *
                                         * @param address
                                         */
                                        const findAddressOnMap = async ( address: string ) => {
                                            isLoading.value  = true;
                                            const coordinate = await geocodingAddress( address );
                                            if ( coordinate !== null ) {
                                                getGeoportalAddress( coordinate, setDataGeoportal );
                                                getGeoportalPlot( coordinate, setDataGeoportal );
                                                if ( map.value !== undefined ) {
                                                    // Si la map est déja initialisé
                                                    map.value.setCenter( {
                                                                             x:          coordinate[ 0 ],
                                                                             y:          coordinate[ 1 ],
                                                                             projection: 'CRS:84',
                                                                         } );
                                                } else {
                                                    await initMap( coordinate );
                                                }
                                            }
                                            isLoading.value = false;
                                        };


                                        const findAddress = useDebouncedRef( '', 1000 );
                                        watch( findAddress, newQuery => {
                                            if ( newQuery !== '' ) {
                                                findAddressOnMap( newQuery );
                                            }
                                        } );

                                        return {
                                            findAddress,
                                            isLoading,
                                            takeScreenshot,
                                            openMapFolder,
                                            initMap,
                                            geoportail,
                                            mapHasBeenHover,
                                        };
                                    },
                                },
);
</script>

<style>
#map {
    width  : 100%;
    height : 500px;
}

#mapCover {
    width            : 100%;
    height           : 500px;
    background-color : rgba(0, 0, 0, 0.4);
    position         : absolute;
    left             : 0;
    top              : 0;
}

#mapCover h1 {
    text-align     : center !important;
    vertical-align : middle;
    line-height    : 500px;
}
</style>
