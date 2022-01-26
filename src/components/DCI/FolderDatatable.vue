<template>
  <!--  FILTRE-->
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

  <!--  TABLE-->
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
        <tr v-for="data in filterData" v-bind:key="data.reference">
          <td>{{ data.reference }}</td>
          <td><input class="form-check-input" type="checkbox" value="" id="isProspect" :checked="data.isProspect"></td>
          <td>{{ folderTypesToString( data.types ) }}</td>
          <td>{{ data.folderName }}</td>
          <td>{{ data.totalTTC }}</td>
          <td>{{ data.createdAt }}</td>
          <td><span :class="`badge badge-light-${data.status.class}`">{{ data.status.name }}</span></td>
          <td>{{ data.sendAt }}</td>
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
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import * as sqliteService from '../../services/sqliteService';
import FolderItem from '@/types/Folder/FolderItem';
import { folderItemHasType, folderTypesToString } from '@/services/folder/FolderItemService';


export default defineComponent( {
                                  name: 'folder-datatable',
                                  async setup() {
                                    await sqliteService.openDb();
                                    await sqliteService.initDb();

                                    const filterSearch   = ref( '' );
                                    const filterStatus   = ref( '-1' );
                                    const filterType     = ref( '-1' );
                                    const filterProspect = ref( false );

                                    const tableData = ref();
                                    tableData.value = await sqliteService.getAllFiles();
                                    console.log( 'Table data', tableData );

                                    const filterData = computed<FolderItem[]>( () => {
                                      let tempData: FolderItem[] = tableData.value;

                                      if ( filterSearch.value !== '' ) {
                                        tempData = tempData.filter( ( data: FolderItem ) => {
                                          const name  = data.folderName.toLowerCase();
                                          const ref   = data.reference.toLowerCase();
                                          const value = filterSearch.value.toLowerCase();
                                          return name.search( value ) !== -1 || ref.search( value ) !== -1;
                                        } );
                                      }


                                      if ( filterType.value !== '-1' ) {
                                        tempData = tempData.filter( ( data: FolderItem ) => {
                                          if ( filterType.value === '-1' ) {
                                            return true;
                                          }

                                          return folderItemHasType( data, filterType.value );
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
                                          return data.isProspect;
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
                                      tableData,
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
                                      folderTypesToString,
                                    };
                                  },
                                } );
</script>
