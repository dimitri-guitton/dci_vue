<template>
  <Suspense>
    <template #default>
      <div class="row gy-5">
        <NewFolderModal @hideModal="onHideModal"></NewFolderModal>
        <FolderDatatable></FolderDatatable>
        <el-affix position="bottom" :offset="25">
          <button ref="btnModal" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#kt_modal_new_folder">
            Nouveau Dossier
          </button>
        </el-affix>
      </div>
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
import { resetCurrentFileData } from '@/services/data/dataService';


export default defineComponent( {
                                  name:       'file-list',
                                  components: {
                                    FolderDatatable,
                                    NewFolderModal,
                                  },
                                  setup() {
                                    // const btnModal = ref( null );
                                    const btnModal = ref<null | { click: () => null }>( null );

                                    folderService.createDciFolderIfNotExist();

                                    onMounted( () => {
                                      resetCurrentFileData();
                                    } );

                                    const onHideModal = () => {
                                      console.log( '%c HIDE MODAL', 'background: #fdd835; color: #000000' );
                                      console.log( btnModal.value );
                                      if ( btnModal.value ) {
                                        btnModal.value.click();
                                      }
                                    };
                                    return {
                                      onHideModal,
                                      btnModal,
                                    };
                                  },
                                } );
</script>
