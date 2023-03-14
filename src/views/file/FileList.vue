<template>
    <Suspense>
        <template #default>
            <template v-if="apiTokenIsValid">
                <div class="row gy-5">
                    <NewFolderModal @hideModal="onHideModal"></NewFolderModal>
                    <FolderDatatable></FolderDatatable>
                    <el-affix :offset="25" position="bottom">
                        <button ref="btnModal"
                                class="btn btn-info"
                                data-bs-target="#kt_modal_new_folder"
                                data-bs-toggle="modal">
                            Nouveau Dossier
                        </button>
                    </el-affix>
                </div>
            </template>
            <template v-else>
                <div class="alert alert-warning d-flex align-items-center p-5 mb-10">
                    <div class="d-flex flex-column">
                        <h4 class="mb-1 text-warning">Informations manquantes</h4>
                        <span>Veuillez indiquer votre clé Api et votre dossier Dropbox dans l'onglet paramètres</span>
                    </div>
                </div>
            </template>
        </template>
        <template #fallback>
            <span>Chargement...</span>
        </template>
    </Suspense>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import NewFolderModal from '@/components/DCI/modals/NewFileModal.vue';
import * as folderService from '../../services/folder/folderService';
import FolderDatatable from '@/components/DCI/file/Datatable.vue';
import { getApiTokenIsValid, resetCurrentFileData } from '@/services/data/dataService';
import { fetchDossierState } from '@/services/apiService';


export default defineComponent( {
                                    name:       'file-list',
                                    components: {
                                        FolderDatatable,
                                        NewFolderModal,
                                    },
                                    setup() {
                                        const btnModal        = ref<null | { click: () => null }>( null );
                                        const apiTokenIsValid = ref<boolean>( getApiTokenIsValid() );

                                        folderService.createDciFolderIfNotExist();

                                        onMounted( () => {
                                            resetCurrentFileData();

                                            // TODO FAIRE LA LOGIQUE APRES LA RECUPE DES TODOS
                                            if ( apiTokenIsValid.value ) {
                                                fetchDossierState();
                                            }
                                        } );

                                        const onHideModal = () => {
                                            if ( btnModal.value ) {
                                                btnModal.value.click();
                                            }
                                        };
                                        return {
                                            onHideModal,
                                            btnModal,
                                            apiTokenIsValid,
                                        };
                                    },
                                } );
</script>
