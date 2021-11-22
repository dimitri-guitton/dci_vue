<template>
  <div class="row gy-5">
    <div class="row">
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#kt_modal_new_folder">Nouveau Dossier
      </button>
      <NewFolderModal></NewFolderModal>
    </div>
    <Datatable
        :table-header="tableHeader1"
        :table-data="tableData2"
    >
      <template v-slot:cell-order="{ row: invoice }">
        {{ invoice.order }}
      </template>
      <template v-slot:cell-amount="{ row: invoice }">
    <span :class="`text-${invoice.color}`">
      {{ invoice.amount }}
    </span>
      </template>
      <template v-slot:cell-status="{ row: invoice }">
        <span :class="`badge badge-light-${invoice.status.state}`">{{ invoice.status.label }}</span>
      </template>
      <template v-slot:cell-date="{ row: invoice }">
        {{ invoice.date }}
      </template>
      <template v-slot:cell-invoice>
        <button class="btn btn-sm btn-light btn-active-light-primary">
          Download
        </button>
      </template>
    </Datatable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import NewFolderModal from '@/components/DCI/modals/NewFolderModal.vue';
import * as folderService from '../services/folderService';
import KTDatatable from '@/components/kt-datatable/KTDatatable.vue';


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
                                                                  name:     'Order id',
                                                                  key:      'order',
                                                                  sortable: true,
                                                                },
                                                                {
                                                                  name:     'Amount',
                                                                  key:      'amount',
                                                                  sortable: true,
                                                                },
                                                                {
                                                                  name:         'Status',
                                                                  key:          'status',
                                                                  sortingField: 'status.label',
                                                                  sortable:     true,
                                                                },
                                                                {
                                                                  name:     'Date',
                                                                  key:      'date',
                                                                  sortable: true,
                                                                },
                                                                {
                                                                  name:     'Invoice',
                                                                  key:      'invoice',
                                                                  sortable: false,
                                                                },
                                                              ] );
                                    const tableData2   = ref( [
                                                                {
                                                                  date:    'Nov 01, 2020',
                                                                  order:   '102445788',
                                                                  details: 'Darknight transparency  36 Icons Pack',
                                                                  color:   'success',
                                                                  amount:  '$38.00',
                                                                  status:  {
                                                                    label: 'Pending',
                                                                    state: 'warning',
                                                                  },
                                                                },
                                                                {
                                                                  date:    'Oct 24, 2020',
                                                                  order:   '423445721',
                                                                  details: 'Seller Fee',
                                                                  color:   'danger',
                                                                  amount:  '$-2.60',
                                                                  status:  {
                                                                    label: 'Failed',
                                                                    state: 'danger',
                                                                  },
                                                                },
                                                                {
                                                                  date:    'Nov 01, 2020',
                                                                  order:   '102445788',
                                                                  details: 'Darknight transparency  36 Icons Pack',
                                                                  color:   'success',
                                                                  amount:  '$38.00',
                                                                  status:  {
                                                                    label: 'Pending',
                                                                    state: 'warning',
                                                                  },
                                                                },
                                                                {
                                                                  date:    'Oct 24, 2020',
                                                                  order:   '423445721',
                                                                  details: 'Seller Fee',
                                                                  color:   'danger',
                                                                  amount:  '$-2.60',
                                                                  status:  {
                                                                    label: 'Failed',
                                                                    state: 'danger',
                                                                  },
                                                                },
                                                                {
                                                                  date:    'Nov 01, 2020',
                                                                  order:   '102445788',
                                                                  details: 'Darknight transparency  36 Icons Pack',
                                                                  color:   'success',
                                                                  amount:  '$38.00',
                                                                  status:  {
                                                                    label: 'Pending',
                                                                    state: 'warning',
                                                                  },
                                                                },
                                                                {
                                                                  date:    'Oct 24, 2020',
                                                                  order:   '423445721',
                                                                  details: 'Seller Fee',
                                                                  color:   'danger',
                                                                  amount:  '$-2.60',
                                                                  status:  {
                                                                    label: 'Failed',
                                                                    state: 'danger',
                                                                  },
                                                                },
                                                                {
                                                                  date:    'Nov 01, 2020',
                                                                  order:   '102445788',
                                                                  details: 'Darknight transparency  36 Icons Pack',
                                                                  color:   'success',
                                                                  amount:  '$38.00',
                                                                  status:  {
                                                                    label: 'Pending',
                                                                    state: 'warning',
                                                                  },
                                                                },
                                                                {
                                                                  date:    'Oct 24, 2020',
                                                                  order:   '423445721',
                                                                  details: 'Seller Fee',
                                                                  color:   'danger',
                                                                  amount:  '$-2.60',
                                                                  status:  {
                                                                    label: 'Failed',
                                                                    state: 'danger',
                                                                  },
                                                                },
                                                                {
                                                                  date:    'Nov 01, 2020',
                                                                  order:   '102445788',
                                                                  details: 'Darknight transparency  36 Icons Pack',
                                                                  color:   'success',
                                                                  amount:  '$38.00',
                                                                  status:  {
                                                                    label: 'Pending',
                                                                    state: 'warning',
                                                                  },
                                                                },
                                                                {
                                                                  date:    'Oct 24, 2020',
                                                                  order:   '423445721',
                                                                  details: 'Seller Fee',
                                                                  color:   'danger',
                                                                  amount:  '$-2.60',
                                                                  status:  {
                                                                    label: 'Failed',
                                                                    state: 'danger',
                                                                  },
                                                                },
                                                                {
                                                                  date:    'Nov 01, 2020',
                                                                  order:   '102445788',
                                                                  details: 'Darknight transparency  36 Icons Pack',
                                                                  color:   'success',
                                                                  amount:  '$38.00',
                                                                  status:  {
                                                                    label: 'Pending',
                                                                    state: 'warning',
                                                                  },
                                                                },
                                                                {
                                                                  date:    'Oct 24, 2020',
                                                                  order:   '423445721',
                                                                  details: 'Seller Fee',
                                                                  color:   'danger',
                                                                  amount:  '$-2.60',
                                                                  status:  {
                                                                    label: 'Failed',
                                                                    state: 'danger',
                                                                  },
                                                                },
                                                                {
                                                                  date:    'Nov 01, 2020',
                                                                  order:   '102445788',
                                                                  details: 'Darknight transparency  36 Icons Pack',
                                                                  color:   'success',
                                                                  amount:  '$38.00',
                                                                  status:  {
                                                                    label: 'Pending',
                                                                    state: 'warning',
                                                                  },
                                                                },
                                                                {
                                                                  date:    'Oct 24, 2020',
                                                                  order:   '423445721',
                                                                  details: 'Seller Fee',
                                                                  color:   'danger',
                                                                  amount:  '$-2.60',
                                                                  status:  {
                                                                    label: 'Failed',
                                                                    state: 'danger',
                                                                  },
                                                                },
                                                                {
                                                                  date:    'Nov 01, 2020',
                                                                  order:   '102445788',
                                                                  details: 'Darknight transparency  36 Icons Pack',
                                                                  color:   'success',
                                                                  amount:  '$38.00',
                                                                  status:  {
                                                                    label: 'Pending',
                                                                    state: 'warning',
                                                                  },
                                                                },
                                                                {
                                                                  date:    'Oct 24, 2020',
                                                                  order:   '423445721',
                                                                  details: 'Seller Fee',
                                                                  color:   'danger',
                                                                  amount:  '$-2.60',
                                                                  status:  {
                                                                    label: 'Failed',
                                                                    state: 'danger',
                                                                  },
                                                                },
                                                                {
                                                                  date:    'Nov 01, 2020',
                                                                  order:   '102445788',
                                                                  details: 'Darknight transparency  36 Icons Pack',
                                                                  color:   'success',
                                                                  amount:  '$38.00',
                                                                  status:  {
                                                                    label: 'Pending',
                                                                    state: 'warning',
                                                                  },
                                                                },
                                                                {
                                                                  date:    'Oct 24, 2020',
                                                                  order:   '423445721',
                                                                  details: 'Seller Fee',
                                                                  color:   'danger',
                                                                  amount:  '$-2.60',
                                                                  status:  {
                                                                    label: 'Failed',
                                                                    state: 'danger',
                                                                  },
                                                                },
                                                              ] );

                                    return {
                                      tableHeader1,
                                      tableData2,
                                    };
                                  },
                                } );
</script>
