<template>
  <div class="row gy-5">
    <div class="row">
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#kt_modal_new_folder">Nouveau Dossier
      </button>
      <NewFolderModal></NewFolderModal>
    </div>
    <table class="table table-row-dashed table-row-gray-300 gy-7">
      <thead>
      <tr class="fw-bolder fs-5 text-gray-800">
        <th>Name</th>
        <th>Position</th>
        <th>Office</th>
        <th>Age</th>
        <th>Start date</th>
        <th>Salary</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>Tiger Nixon</td>
        <td>System Architect</td>
        <td>Edinburgh</td>
        <td>61</td>
        <td>2011/04/25</td>
        <td>$320,800</td>
      </tr>
      <tr>
        <td>Garrett Winters</td>
        <td>Accountant</td>
        <td>Tokyo</td>
        <td>63</td>
        <td>2011/07/25</td>
        <td>$170,750</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NewFolderModal from '@/components/DCI/modals/NewFolderModal.vue';
import * as folderService from '../services/folderService';


export default defineComponent( {
                                  name:       'folder_list',
                                  components: {
                                    NewFolderModal,
                                  },
                                  setup() {
                                    folderService.createDciFolderIfNotExist();
                                  },
                                } );
</script>
