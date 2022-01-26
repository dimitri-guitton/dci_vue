<template>
  <!-- FILTRE-->
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

  <!-- TABLE-->
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
          <td><input class="form-check-input"
                     type="checkbox"
                     value=""
                     id="isProspect"
                     :checked="data.isProspect"
                     @change="updateProspect(data.id, $event)"></td>
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

      <!-- Pagination-->
      <ul class="pagination">
        <li @click="changePage(currentPage - 1)"
            class="page-item previous"
            v-bind:class="{disabled:currentPage === 1 }">
          <span class="page-link"><i class="previous"></i></span>
        </li>

        <!-- TODO Revoir la pagination (algo pour savoir quelle pagination est affichée)-->
        <template v-for="index in numberOfPages" :key="'page_'+index">
          <li @click="changePage(index)"
              v-if="index === 1 || index === 2 || index === currentPage + 1 || index === numberOfPages - 1 || index === numberOfPages"
              class="page-item"
              v-bind:class="{active:currentPage === index }">
            <span class="page-link">{{ index }}</span>
          </li>

          <li v-if="numberOfPages > 6 && index === 4"
              class="page-item">
            <span class="page-link">...</span>
          </li>

        </template>

        <li @click="changePage(currentPage + 1)"
            class="page-item next"
            v-bind:class="{disabled:currentPage === numberOfPages }">
          <span class="page-link"><i class="next"></i></span>
        </li>
      </ul>
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
                                    // tableData.value = ( await sqliteService.getAllFiles() ).slice( 0, 50 );
                                    tableData.value = ( await sqliteService.getAllFiles() );
                                    console.log( 'Table data', tableData );


                                    // Init les datas de la pagination
                                    const numberOfItems = tableData.value.length;
                                    const numberPerPage = 10;
                                    const currentPage   = ref( 1 );
                                    const numberOfPages = ref( Math.ceil( numberOfItems / numberPerPage ) );

                                    /**
                                     * Set up le nombre de pages de la pagination
                                     * @param nbItems
                                     */
                                    const buildPagination = ( nbItems: number ) => {
                                      numberOfPages.value = Math.ceil( nbItems / numberPerPage );
                                    };


                                    const filterData = computed<FolderItem[]>( () => {
                                      console.log( '%c COMPUTED', 'background: #fdd835; color: #000000' );
                                      let tempData: FolderItem[] = tableData.value;

                                      // Filtre sur la barre de recherche
                                      if ( filterSearch.value !== '' ) {
                                        tempData = tempData.filter( ( data: FolderItem ) => {
                                          const name  = data.folderName.toLowerCase();
                                          const ref   = data.reference.toLowerCase();
                                          const value = filterSearch.value.toLowerCase();
                                          return name.search( value ) !== -1 || ref.search( value ) !== -1;
                                        } );
                                      }

                                      // Filtre les types
                                      if ( filterType.value !== '-1' ) {
                                        tempData = tempData.filter( ( data: FolderItem ) => {
                                          if ( filterType.value === '-1' ) {
                                            return true;
                                          }

                                          return folderItemHasType( data, filterType.value );
                                        } );
                                      }

                                      // Filtre sur les statuts
                                      if ( filterStatus.value !== '-1' ) {
                                        tempData = tempData.filter( ( data: FolderItem ) => {
                                          if ( filterStatus.value === '-1' ) {
                                            return true;
                                          }
                                          return data.status.state === filterStatus.value;
                                        } );
                                      }

                                      // Filtre sur "Prospect"
                                      if ( filterProspect.value !== false ) {
                                        tempData = tempData.filter( ( data: FolderItem ) => {
                                          return data.isProspect;
                                        } );
                                      }

                                      // Pagination
                                      buildPagination( tempData.length );
                                      const trimStart = ( currentPage.value - 1 ) * numberPerPage;
                                      const trimEnd   = trimStart + numberPerPage;
                                      tempData        = tempData.slice( trimStart, trimEnd );

                                      return tempData;
                                    } );

                                    /**
                                     * Changement de page
                                     * @param page
                                     */
                                    const changePage = ( page: number ) => {
                                      if ( page < 1 || page > numberOfPages.value ) {
                                        return;
                                      }
                                      currentPage.value = page;
                                    };

                                    const updateProspect = ( fileId: number, event ) => {
                                      sqliteService.setFileProspect( fileId, event.target.checked );
                                    };

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
                                      currentPage,
                                      updateProspect,
                                      numberOfPages,
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
                                      changePage,
                                      folderTypesToString,
                                    };
                                  },
                                } );
</script>

<style>
.page-item {
  cursor : pointer;
}
</style>
