<template>
  <Suspense>
    <template #default>
      <div class="row gy-5">
        <NewFolderModal></NewFolderModal>
        <FolderDatatable></FolderDatatable>
        <button class="btn btn-primary action-button" data-bs-toggle="modal" data-bs-target="#kt_modal_new_folder">
          Nouveau Dossier
        </button>
      </div>
    </template>
    <template #fallback>
      <span>Loading...</span>
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NewFolderModal from '@/components/DCI/modals/NewFolderModal.vue';
import * as folderService from '../services/folder/folderService';
import FolderDatatable from '@/components/DCI/FolderDatatable.vue';


export default defineComponent( {
                                  name:       'folder_list',
                                  components: {
                                    FolderDatatable,
                                    NewFolderModal,
                                  },
                                  setup() {
                                    folderService.createDciFolderIfNotExist();
                                    // folderService.convertOldJsonToNewJson();

                                    return {};
                                  },
                                } );
</script>

<style>
.action-button {
  width    : 200px;
  position : fixed;
  right    : 30px;
  bottom   : 40px;
}
</style>
