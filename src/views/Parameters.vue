<template>
    <div class="row gy-5">
        <div class="row">
            <div class="mb-5 col-6">
                <h6>Version de DCI : {{ version }}</h6>
            </div>
        </div>

        <Form :validation-schema="simpleSchema" @submit="onSubmit">
            <div class="row">
                <div class="mb-10 col-6">
                    <label class="required form-label" for="apiKey">Clé API</label>
                    <Field id="apiKey"
                           v-model="apiKey"
                           class="form-control"
                           name="apiKey"
                           placeholder="A0B3S5F3G6Q2F5HHF6DS6"
                           type="text" />
                    <ErrorMessage class="text-danger" name="apiKey" />
                </div>
            </div>
            <div class="row">
                <div class="mb-10 col-6">
                    <label class="required form-label" for="dropboxPath">Chemin Dropbox</label>
                    <Field id="dropboxPath"
                           v-model="dropboxPath"
                           class="form-control"
                           disabled
                           name="dropboxPath"
                           placeholder="mon/chemin/vers/dropbox"
                           type="text"
                    />
                    <ErrorMessage class="text-danger" name="dropboxPath" />
                </div>
                <div class="mb-10 col-2 align-self-end">
                    <button class="btn btn-outline btn-outline-info btn-active-light-info"
                            type="button"
                            @click="openFileExplorer">Parcourir
                    </button>
                </div>
            </div>
            <div class="float-start">
                <button class="btn btn-danger me-5" type="button" @click="resetData">Réinitialiser les données</button>
                <button class="btn btn-success" type="submit"><i class="far fa-check-circle fs-4 me-2"></i>Valider
                </button>
            </div>
        </Form>
    </div>
</template>

<script lang="ts">
// DOC https://vee-validate.logaretm.com/v4/guide/components/validation#displaying-error-messages

import { defineComponent, ref } from 'vue';
import { ErrorMessage, Field, Form } from 'vee-validate';

import Store from 'electron-store';
import { OpenDialogReturnValue } from 'electron';
import { fetchCommercialData } from '@/services/apiService';
import {
    setApiTokenIsValid,
    setConnectedToInternet,
    setcurrentFolderName,
    setDropboxPath,
    setOldJsonAreConverted,
} from '@/services/data/dataService';
import router from '@/router';

const { dialog } = require( 'electron' ).remote;

const schema = {
    apiKey:      {
        type:    'string',
        default: '',
    },
    dropboxPath: {
        type:    'string',
        default: '',
    },
} as const;

// Store pour stoker les users Data
const store = new Store( { schema } );

export default defineComponent( {
                                    name:       'parameters',
                                    components: {
                                        Form,
                                        Field,
                                        ErrorMessage,
                                    },
                                    setup() {

                                        // Recup les données du user
                                        const apiKey      = store.get( 'apiKey' );
                                        const dropboxPath = ref( store.get( 'dropboxPath' ) );

                                        // Set up les schémas pour le formulaire
                                        const simpleSchema = {
                                            apiKey( value ) {
                                                if ( value ) {
                                                    return true;
                                                }
                                                return 'La clé API est requise';
                                            },
                                            dropboxPath( value ) {
                                                if ( value ) {
                                                    return true;
                                                }
                                                return 'Le chemin vers Dropbox est requis';
                                            },
                                        };

                                        /**
                                         * Ouvre l'explorateur de fichier pour sélectionner le path de DropBox
                                         */
                                        const openFileExplorer = () => {
                                            dialog.showOpenDialog( { properties: [ 'openDirectory' ] } )
                                                  .then( ( value: OpenDialogReturnValue ) => {
                                                      dropboxPath.value = value.filePaths[ 0 ];
                                                  } );
                                        };

                                        return {
                                            simpleSchema,
                                            apiKey,
                                            dropboxPath,
                                            openFileExplorer,
                                            version: process.env.VUE_APP_VERSION,
                                        };
                                    },
                                    methods: {
                                        onSubmit( values ) {
                                            store.set( 'apiKey', values.apiKey );
                                            store.set( 'dropboxPath', values.dropboxPath );

                                            // Récupère les infos du commercial grace à l'api KEY
                                            fetchCommercialData();
                                        },

                                        resetData() {
                                            setDropboxPath( '' );
                                            setcurrentFolderName( '' );
                                            setConnectedToInternet( true );
                                            setOldJsonAreConverted( false );
                                            setApiTokenIsValid( false );
                                            router.go( 0 );
                                        },
                                    },
                                } );
</script>
