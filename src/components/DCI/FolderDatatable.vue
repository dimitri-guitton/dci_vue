<template>
  <!-- FILTRE-->
  <div class="row mt-2">
    <div class="col-3">
      <input type="text" class="form-control" placeholder="Référence, Nom..." v-model="filterSearch" />
    </div>
    <div class="col-3">
      <select class="form-select" v-model="filterType">
        <option value="-1">Sélectionner un chantier...</option>
        <option value="comble">Comble</option>
        <option value="sol">Sol</option>
        <option value="pac_rr">Chauffage RR</option>
        <option value="pac_ro">Chauffage RO</option>
        <option value="cet">Chauffe eau</option>
        <option value="pg">Poele à granulés</option>
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
          <td class="form-check form-check-custom form-check-solid form-check-sm"><input class="form-check-input"
                                                                                         type="checkbox"
                                                                                         value=""
                                                                                         id="isProspect"
                                                                                         :checked="data.isProspect"
                                                                                         @change="updateProspect(data.id, $event)">
          </td>
          <td>{{ folderTypesToString( data.types ) }}</td>
          <td>{{ data.folderName }}</td>
          <td>{{ data.totalTTC }}</td>
          <td>{{ data.createdAt }}</td>
          <td><span :class="`badge badge-light-${data.status.class}`">{{ data.status.name }}</span></td>
          <td>{{ data.sendAt }}</td>

          <router-link :to="{ name: 'folder_show', query: { slug: 'fake_slug' } }"
                       class="btn btn-icon btn-primary btn-sm"><i class="fas fa-pen"></i></router-link>

          <el-dropdown trigger="click" size="large" @command="handleAction">
            <button type="button" class="btn btn-icon btn-dark btn-sm">
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="{type:'check_element', folder: data}">
                  <i class="fas fa-clipboard-check me-2"></i>Vérifier les
                                                             éléments
                </el-dropdown-item>
                <el-dropdown-item :command="{type:'open', folder: data}"><i class="fas fa-folder-open me-2"></i>Ouvrir
                                                                                                                le
                                                                                                                répertoire
                </el-dropdown-item>
                <el-dropdown-item :command="{type:'remove_dci', folder: data}"><i class="fas fa-trash me-2"></i>Suppression
                                                                                                                DCI
                </el-dropdown-item>
                <el-dropdown-item :command="{type:'remove_all', folder: data}"><i class="fas fa-trash me-2"></i>Suppression
                                                                                                                Dropbox
                                                                                                                + DCI
                </el-dropdown-item>
                <el-dropdown-item :command="{type:'send', folder: data}" :disabled="true">
                  <i class="fas fa-arrow-circle-up me-2"></i>Transmettre
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Pagination-->
  <div class="row">
    <div class="col-lg-12">
      <el-pagination class="d-flex flex-row justify-content-center align-content-center"
                     :hide-on-single-page="true"
                     v-model:currentPage="currentPage"
                     :page-size="numberPerPage"
                     :total="numberOfItems"
                     layout="prev, pager, next"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import * as sqliteService from '../../services/sqliteService';
import { deleteFileProspect } from '@/services/sqliteService';
import FolderItem from '@/types/Folder/FolderItem';
import { folderItemHasType, folderTypesToString } from '@/services/folder/FolderItemService';
import { ElMessage } from 'element-plus';
import { shell } from 'electron';
import { getFolderPath } from '@/services/folder/folderService';
import { ISqlite } from 'sqlite';
import RunResult = ISqlite.RunResult;


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
                                    tableData.value = ( await sqliteService.getAllFiles() );


                                    // Init les datas de la pagination
                                    const numberPerPage = 20;
                                    const numberOfItems = ref( tableData.value.length );
                                    const currentPage   = ref( 1 );

                                    /**
                                     * Set up le nombre de pages de la pagination
                                     * @param nbItems
                                     */
                                    const updatePagination = ( nbItems: number ) => {
                                      numberOfItems.value = nbItems;
                                    };

                                    // Fonction appelé quand un filtre est modifié ou la pagination
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
                                      updatePagination( tempData.length );
                                      const trimStart = ( currentPage.value - 1 ) * numberPerPage;
                                      const trimEnd   = trimStart + numberPerPage;
                                      tempData        = tempData.slice( trimStart, trimEnd );

                                      return tempData;
                                    } );

                                    const updateProspect = ( fileId: number, event ) => {
                                      sqliteService.setFileProspect( fileId, event.target.checked );
                                    };

                                    const handleAction = async ( command: { type: string; folder: FolderItem } ) => {
                                      console.log( command );
                                      let path: string | null = null;
                                      let response: RunResult;
                                      switch ( command.type ) {
                                        case 'check_element':
                                          console.log( '%c ON CHECK ELEM', 'background: #fdd835; color: #000000' );
                                          break;
                                        case 'open':
                                          path = getFolderPath( command.folder );
                                          if ( path === null ) {
                                            ElMessage( {
                                                         showClose: true,
                                                         message:   'Impossible d\'ouvrir le dossier, il n\'a pas été trouvé !',
                                                         type:      'error',
                                                       } );
                                          } else {
                                            await shell.openPath( path );
                                          }
                                          break;
                                        case 'remove_dci':
                                          response = await deleteFileProspect( command.folder.id );
                                          if ( response.changes !== undefined && response.changes > 0 ) {
                                            ElMessage( {
                                                         message: 'Dossier supprimé avec succès',
                                                         type:    'success',
                                                       } );

                                            tableData.value = ( await sqliteService.getAllFiles() );
                                          } else {
                                            ElMessage( {
                                                         message: 'Aucune modification à été effectuée',
                                                         type:    'warning',
                                                       } );
                                          }
                                          console.log( '%c AFTER', 'background: #fdd835; color: #000000' );
                                          break;
                                        case 'remove_all':
                                          console.log( '%c ON delete_ALL', 'background: #fdd835; color: #000000' );
                                          break;
                                        case 'send':
                                          console.log( '%c ON SEND', 'background: #fdd835; color: #000000' );
                                          break;
                                      }
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
                                      handleAction,
                                      numberOfItems,
                                      numberPerPage,
                                      currentPage,
                                      updateProspect,
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
                                  methods: {
                                    forceUpdate() {
                                      this.$forceUpdate();
                                    },
                                  },
                                } );
</script>

<style>
</style>
