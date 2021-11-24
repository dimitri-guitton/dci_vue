<template>
  <div class="row gy-5">
    <NewFolderModal></NewFolderModal>

    <div class="row mt-2">
      <div class="col-3">
        <input type="text" class="form-control" placeholder="Référence, Nom..." v-model="filterSearch" />
      </div>
      <div class="col-3">
        <select class="form-select" v-model="filterType">
          <option value="-1">Sélectionner un chantier...</option>
          <option value="co">Comble</option>
          <option value="sol">Sol</option>
          <option value="pac_rr">Chauffage RR</option>
          <option value="pac_ro">Chauffage RO</option>
          <option value="ce">Chauffe eau</option>
          <option value="po_b">Poele à granulés</option>
        </select>
      </div>
      <div class="col-3">
        <select class="form-select" v-model="filterStatus">
          <option value="-1">Sélectionner un statut...</option>
          <option value="complete">Complet</option>
          <option value="incomplete">Incomplet</option>
          <option value="to_correct">A corriger</option>
          <option value="close">Clos</option>
        </select>
      </div>
      <div class="col-3 d-flex">
        <label class="form-check form-switch form-check-custom">
          <span class="form-check-label me-2">Filtrer les prospects</span>
          <input class="form-check-input" type="checkbox" value="" v-model="filterProspect">
        </label>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <table class="table table-striped gy-7 gs-7">
          <thead>
          <tr class="fw-bold fs-5">
            <th>Référence</th>
            <th>Prospect</th>
            <th>Type</th>
            <th>Nom</th>
            <th>Total</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Transmis</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="data in filterData" v-bind:key="data.ref">
            <td>{{ data.ref }}</td>
            <td><input class="form-check-input" type="checkbox" value="" id="isProspect" :checked="data.prospect"></td>
            <td>{{ data.type.name }}</td>
            <td>{{ data.name }}</td>
            <td>{{ data.total }}</td>
            <td>{{ data.createdAt }}</td>
            <td><span :class="`badge badge-light-${data.status.class}`">{{ data.status.name }}</span></td>
            <td>{{ data.deliveredAt }}</td>
            <div class="btn-group">
              <button type="button"
                      class="btn btn-icon btn-light-dark me-2"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
              >
                <i class="fas fa-ellipsis-v"></i>
              </button>
              <ul class="dropdown-menu">
                <li><span class="dropdown-item" @click="checkElements"><i class="fas fa-clipboard-check me-2"></i>Vérifier les éléments</span>
                </li>
                <li><span class="dropdown-item" @click="openFolder"><i class="fas fa-folder-open me-2"></i>Ouvrir le répertoire</span>
                </li>
                <li><span class="dropdown-item" @click="removeFolder"><i class="fas fa-trash me-2"></i>Supprimer</span>
                </li>
                <li><span class="dropdown-item disabled" @click="send"><i class="fas fa-arrow-circle-up me-2"></i>Transmettre</span>
                </li>
              </ul>
            </div>
            <router-link :to="{ name: 'folder_show', query: { slug: 'fake_slug' } }"
                         class="btn btn-icon btn-light-info">
              <i class="fas fa-pen"></i>
            </router-link>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <button class="btn btn-primary action-button" data-bs-toggle="modal" data-bs-target="#kt_modal_new_folder">Nouveau
                                                                                                               Dossier
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import NewFolderModal from '@/components/DCI/modals/NewFolderModal.vue';
import * as folderService from '../services/folderService';
// import KTDatatable from '@/components/kt-datatable/KTDatatable.vue';
import FolderItem from '@/types/FolderItem';
import {
  FOLDER_CE_TYPE,
  FOLDER_CLOSE_STATUS,
  FOLDER_COMBLE_TYPE,
  FOLDER_COMPLETE_STATUS,
  FOLDER_INCOMPLETE_STATUS,
  FOLDER_PAC_RO_TYPE,
  FOLDER_PAC_RR_TYPE,
  FOLDER_PO_G_TYPE,
  FOLDER_SOL_TYPE,
  FOLDER_TO_CORRECT_STATUS,
} from '@/services/constantService';


export default defineComponent( {
                                  name:       'folder_list',
                                  components: {
                                    NewFolderModal,
                                    // Datatable: KTDatatable,
                                  },
                                  setup() {
                                    folderService.createDciFolderIfNotExist();

                                    const filterSearch   = ref( '' );
                                    const filterStatus   = ref( '-1' );
                                    const filterType     = ref( '-1' );
                                    const filterProspect = ref( false );

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
                                    const tableData2   = ref<FolderItem[]>( [
                                                                              {
                                                                                ref:       'FP1-20211104-PA_RO',
                                                                                prospect:  false,
                                                                                name:      'Jean Paul',
                                                                                total:     2500,
                                                                                createdAt: '04/11/2021',
                                                                                status:    FOLDER_COMPLETE_STATUS,
                                                                                type:      FOLDER_SOL_TYPE,
                                                                              },
                                                                              {
                                                                                ref:       'FP2-20211103-PA_RO',
                                                                                prospect:  false,
                                                                                name:      'Pierre Dupond',
                                                                                total:     10000,
                                                                                createdAt: '03/11/2021',
                                                                                status:    FOLDER_INCOMPLETE_STATUS,
                                                                                type:      FOLDER_COMBLE_TYPE,
                                                                              },
                                                                              {
                                                                                ref:       'FP3-20211102-PA_RO',
                                                                                prospect:  true,
                                                                                name:      'Jean Dupont',
                                                                                total:     3000,
                                                                                createdAt: '02/11/2021',
                                                                                status:    FOLDER_TO_CORRECT_STATUS,
                                                                                type:      FOLDER_PAC_RR_TYPE,
                                                                              },
                                                                              {
                                                                                ref:       'FP3-20211101-PA_RO',
                                                                                prospect:  false,
                                                                                name:      'Henry Dupond',
                                                                                total:     5000,
                                                                                createdAt: '01/11/2021',
                                                                                status:    FOLDER_CLOSE_STATUS,
                                                                                type:      FOLDER_CE_TYPE,
                                                                              },
                                                                              {
                                                                                ref:       'FP3-20211101-PA_RO',
                                                                                prospect:  false,
                                                                                name:      'Henry Dupond',
                                                                                total:     5000,
                                                                                createdAt: '01/11/2021',
                                                                                status:    FOLDER_CLOSE_STATUS,
                                                                                type:      FOLDER_PO_G_TYPE,
                                                                              },
                                                                              {
                                                                                ref:       'FP3-20211101-PA_RO',
                                                                                prospect:  false,
                                                                                name:      'Henry Dupond',
                                                                                total:     5000,
                                                                                createdAt: '30/10/2021',
                                                                                status:    FOLDER_TO_CORRECT_STATUS,
                                                                                type:      FOLDER_PAC_RO_TYPE,
                                                                              },
                                                                            ] );

                                    const filterData = computed<FolderItem[]>( () => {
                                      let tempData: FolderItem[] = tableData2.value;

                                      if ( filterSearch.value !== '' ) {
                                        tempData = tempData.filter( ( data: FolderItem ) => {
                                          const name  = data.name.toLowerCase();
                                          const ref   = data.ref.toLowerCase();
                                          const value = filterSearch.value.toLowerCase();
                                          return name.search( value ) !== -1 || ref.search( value ) !== -1;
                                        } );
                                      }


                                      if ( filterType.value !== '-1' ) {
                                        tempData = tempData.filter( ( data: FolderItem ) => {
                                          if ( filterType.value === '-1' ) {
                                            return true;
                                          }
                                          return data.type.slug === filterType.value;
                                        } );
                                      }


                                      if ( filterStatus.value !== '-1' ) {
                                        tempData = tempData.filter( ( data: FolderItem ) => {
                                          if ( filterStatus.value === '-1' ) {
                                            return true;
                                          }
                                          return data.status.state === filterStatus.value;
                                        } );
                                      }

                                      if ( filterProspect.value !== false ) {
                                        tempData = tempData.filter( ( data: FolderItem ) => {
                                          return data.prospect;
                                        } );
                                      }
                                      return tempData;
                                    } );


                                    const checkElements = () => {
                                      alert( 'TODO : Check elements' );
                                    };

                                    const openFolder = () => {
                                      alert( 'TODO : Open du folder' );
                                    };

                                    const removeFolder = () => {
                                      alert( 'TODO : Remove du folder' );
                                    };

                                    const send = () => {
                                      alert( 'TODO : Send' );
                                    };

                                    const edit = () => {
                                      alert( 'TODO : Edit' );
                                    };

                                    return {
                                      tableHeader1,
                                      tableData2,
                                      filterStatus,
                                      filterData,
                                      filterType,
                                      filterProspect,
                                      filterSearch,
                                      checkElements,
                                      openFolder,
                                      removeFolder,
                                      send,
                                      edit,
                                    };
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
