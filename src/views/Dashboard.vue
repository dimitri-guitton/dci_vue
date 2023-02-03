<template>
    <template v-if="env !== 'production'">
        <div class="alert alert-warning d-flex align-items-center p-5 mb-10">
            <div class="d-flex flex-column">
                <h4 class="mb-1 text-warning">Attention</h4>
                <span>Vous utilisez une version de développement</span>
            </div>
        </div>
    </template>

    <div class="row d-flex justify-content-center">
        <button class="btn btn-success mx-2 my-2 w-auto" @click="getFileJson">Mettre à jour les ressources</button>
        <button v-if="!oldJsonAreConverted && dropboxPath !== ''"
                class="btn btn-warning mx-2 my-2 w-auto"
                @click="convertAllJson">
            Récupérer les dossiers de la
            version
            précédente
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { convertAllOldjsonToNewJson, getFileJson } from '@/services/folder/folderService';
import { getDropboxPath, getOldJsonAreConverted, setOldJsonAreConverted } from '@/services/data/dataService';
import { ElLoading } from 'element-plus';

declare const __static: string;

export default defineComponent( {
                                    name: 'dashboard',
                                    setup() {

                                        // setOldJsonAreConverted( false );

                                        const oldJsonAreConverted = ref<boolean>( getOldJsonAreConverted() );
                                        const dropboxPath         = ref<string>( getDropboxPath() );

                                        /**
                                         * Conversion des anciens JSON
                                         */
                                        const convertAllJson = async () => {

                                            const loading = ElLoading.service( {
                                                                                   lock:       true,
                                                                                   text:       'Conversion des ressources ...',
                                                                                   background: 'rgba(0, 0, 0, 0.7)',
                                                                               } );

                                            await convertAllOldjsonToNewJson();

                                            oldJsonAreConverted.value = true;
                                            setOldJsonAreConverted( true );
                                            loading.close();
                                        };

                                        return {
                                            getFileJson: getFileJson,
                                            convertAllJson,
                                            oldJsonAreConverted,
                                            dropboxPath,
                                            env:         process.env.NODE_ENV,
                                        };
                                    },
                                } );
</script>
