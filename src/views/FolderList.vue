<template>
  <div class="row gy-5">
    <div class="row">
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#kt_modal_new_folder">Nouveau Dossier
      </button>
      <NewFolderModal></NewFolderModal>
    </div>
    <Datatable :table-header="tableHeader1" :table-data="tableData2"
    >
      <template v-slot:cell-ref="{ row: data }">
        {{ data.ref }}
      </template>
      <template v-slot:cell-prospect="{ row: data }">
        <input class="form-check-input" type="checkbox" value="" id="isProspect" :checked="data.prospect">
      </template>
      <template v-slot:cell-name="{ row: data }">
        {{ data.name }}
      </template>
      <template v-slot:cell-total="{ row: data }">
        {{ data.total }}€
      </template>
      <template v-slot:cell-status="{ row: data }">
        <span :class="`badge badge-light-warning`">{{ data.status }}</span>
      </template>
      <template v-slot:cell-createdAt="{ row: data }">
        {{ data.createdAt }}
      </template>
      <template v-slot:cell-deliveredAt="{ row: data }">
        {{ data.deliveredAt }}
      </template>
      <template v-slot:cell-action>
        <a href="#" class="btn btn-icon btn-light-dark me-2"><i class="fas fa-ellipsis-v"></i></a>
        <a href="#" class="btn btn-icon btn-light-info"><i class="fas fa-pen"></i></a>
      </template>
    </Datatable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import NewFolderModal from '@/components/DCI/modals/NewFolderModal.vue';
import * as folderService from '../services/folderService';
import KTDatatable from '@/components/kt-datatable/KTDatatable.vue';
import FolderItem from '@/types/FolderItem';


export default defineComponent( {
                                  name:       'folder_list',
                                  components: {
                                    NewFolderModal,
                                    Datatable: KTDatatable,
                                  },
                                  setup() {
                                    folderService.createDciFolderIfNotExist();

                                    const tableHeader1 = ref( [
                                                                {
                                                                  name:     'Référence',
                                                                  key:      'ref',
                                                                  sortable: false,
                                                                },
                                                                {
                                                                  name:     'Prospect',
                                                                  key:      'prospect',
                                                                  sortable: false,
                                                                },
                                                                {
                                                                  name:     'Nom',
                                                                  key:      'name',
                                                                  sortable: true,
                                                                },
                                                                {
                                                                  name:     'Total',
                                                                  key:      'total',
                                                                  sortable: false,
                                                                },
                                                                {
                                                                  name:     'Date',
                                                                  key:      'createdAt',
                                                                  sortable: true,
                                                                },
                                                                {
                                                                  name:     'Statut',
                                                                  key:      'status',
                                                                  sortable: false,
                                                                },
                                                                {
                                                                  name:     'Transmis',
                                                                  key:      'deliveredAt',
                                                                  sortable: true,
                                                                },
                                                                {
                                                                  name:     'Action',
                                                                  key:      'action',
                                                                  sortable: false,
                                                                },
                                                              ] );

                                    const tableData2 = ref<FolderItem[]>( [
                                                                            {
                                                                              ref:       'FP1-20211104-PA_RO',
                                                                              prospect:  false,
                                                                              name:      'Jean Paul',
                                                                              total:     2500,
                                                                              createdAt: '2021/11/04',
                                                                              status:    'incomplet',
                                                                            },
                                                                            {
                                                                              ref:       'FP2-20211103-PA_RO',
                                                                              prospect:  false,
                                                                              name:      'Pierre Dupond',
                                                                              total:     10000,
                                                                              createdAt: '2021/11/03',
                                                                              status:    'incomplet',
                                                                            },
                                                                            {
                                                                              ref:       'FP3-20211102-PA_RO',
                                                                              prospect:  true,
                                                                              name:      'Jean Dupont',
                                                                              total:     3000,
                                                                              createdAt: '2021/11/02',
                                                                              status:    'incomplet',
                                                                            },
                                                                            {
                                                                              ref:       'FP3-20211101-PA_RO',
                                                                              prospect:  false,
                                                                              name:      'Henry Dupond',
                                                                              total:     5000,
                                                                              createdAt: '2021/11/01',
                                                                              status:    'incomplet',
                                                                            },
                                                                          ] );

                                    return {
                                      tableHeader1,
                                      tableData2,
                                    };
                                  },
                                } );
</script>
