<template>
  <!-- FILTRE-->
  <div class="row mt-2">
    <div class="col-3">
      <input type="text" class="form-control" placeholder="Référence, Nom..." v-model="filterSearch" />
    </div>
    <div class="col-3">
      <select class="form-select" v-model="filterType">
        <option value="-1">Sélectionner un chantier...</option>
        <option v-for="type in listFolderType" v-bind:key="type.slug" :value="type.slug">{{ type.name }}</option>
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
          <th class="text-center">Prospect</th>
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
          <td class="form-check form-check-custom form-check-sm justify-content-center">
            <input class="form-check-input"
                   type="checkbox"
                   value=""
                   id="isProspect"
                   :checked="data.isProspect"
                   @change="updateProspect(data.id, $event)">
          </td>
          <td>{{ folderTypesToString( data.types ) }}</td>
          <td>{{ data.customer }}</td>
          <td v-if="data.totalTTC > 0">{{ numberToPrice( data.totalTTC ) }}</td>
          <td v-if="data.totalTTC <= 0">0.00 €</td>
          <td>{{ data.createdAt }}</td>
          <td>
            <template v-if="data.errors.length > 0">
              <el-popover
                  placement="bottom-end"
                  :width="300"
                  trigger="hover"
              >
                <template #reference>
                  <span :class="`badge badge-light-${data.status.class} cursor-pointer`">{{ data.status.name }}</span>
                </template>
                <template #default>
                  <template v-if="data.errors.length > 0">
                    <h6>Éléments manquants</h6>
                  </template>
                  <template v-for="error in data.errors" :key="`e_${error}`">
                    <div class="d-flex flex-column">
                      <li class="d-flex align-items-center py-2">
                        <span class="bullet bg-warning me-2"></span> {{ codeErrorToString( error ) }}
                      </li>
                    </div>
                  </template>
                </template>
              </el-popover>
            </template>
            <template v-if="data.errors.length === 0 && data.status.code === 3">
              <el-popover
                  placement="bottom-end"
                  :width="300"
                  trigger="hover"
              >
                <template #reference>
                  <span :class="`badge badge-light-${data.status.class} cursor-pointer`">{{ data.status.name }}</span>
                </template>
                <template #default>
                  <template>
                    <h6>Corrections</h6>
                  </template>
                  <template v-for="todo in data.todos" :key="`t_${todo.serverId}`">
                    <div class="d-flex flex-column">
                      <li class="d-flex align-items-center py-2">
                        <div
                            class="form-check form-check-custom form-check-solid form-check-sm"
                        >
                          <input
                              class="form-check-input"
                              type="checkbox"
                              v-model="todo.isDone"
                              :id="`todo_checkbox_${todo.serverId}`"
                              @change="updateTodo(todo)"
                          />
                          <label class="form-check-label" :for="`todo_checkbox_${todo.serverId}`">{{ todo.label }}
                                                                                                  {{ todo.isDone }} {{
                              todo.isDone ?
                              'checked' :
                              ''
                                                                                                  }}</label>
                        </div>
                      </li>
                    </div>
                  </template>
                </template>
              </el-popover>
            </template>
            <template v-else-if="data.errors.length === 0 && data.status.code !== 3">
              <span :class="`badge badge-light-${data.status.class}`">{{ data.status.name }}</span>
            </template>
          </td>
          <td>{{ data.sendAt }}</td>
          <td>
            <!--            <router-link :to="{ name: 'folder_show', query: { slug: data.reference } }"-->
            <!--                         class="btn btn-icon btn-primary btn-sm me-2"><i class="fas fa-pen"></i></router-link>-->
            <!--            <router-link :to="{ name: 'cet_show', query: { reference: data.reference } }"-->
            <!--                         class="btn btn-icon btn-primary btn-sm me-2"><i class="fas fa-pen"></i></router-link>-->
            <button @click="edit(data.reference, data.folderName, data.types)"
                    class="btn btn-icon btn-primary btn-sm me-2">
              <i class="fas fa-pen"></i>
            </button>

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
                  <el-dropdown-item :command="{type:'send', folder: data}" :disabled="data.status.code === 2">
                    <i class="fas fa-arrow-circle-up me-2"></i>Transmettre
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </td>
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
import * as sqliteService from '../../../services/sqliteService';
import { deleteFile, updateDbTodo } from '@/services/sqliteService';
import { datatableFileHasType, datatableFileTypesToString } from '@/services/file/datatableFileService';
import { ElMessage } from 'element-plus';
import { shell } from 'electron';
import { checkFolder, getFolderPath, removeFolder } from '@/services/folder/folderService';
import { LIST_FILE_TYPE } from '@/services/constantService';
import router from '@/router';
import { setCurrentFileReference, setcurrentFolderName } from '@/services/data/dataService';
import { DatatableFile } from '@/types/v2/DatatableFile/DatatableFile';
import { DatatableFileType } from '@/types/v2/DatatableFile/DatatableFileType';
import { numberToPrice } from '@/services/commonService';
import { postFileToERP } from '@/services/apiService';
import { DbFileTodo } from '@/types/v2/Sqlite/DbFileTodo';


export default defineComponent( {
                                  name: 'file-datatable',
                                  async setup() {
                                    await sqliteService.openDb();
                                    await sqliteService.initDb();

                                    const listFolderType = LIST_FILE_TYPE;
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
                                    const filterData = computed<DatatableFile[]>( () => {
                                      console.log( '%c IN FILTER DATA COMPUTED',
                                                   'background: #5ADFFF; color: #000000' );
                                      console.log( '%c IN FILTER DATA COMPUTED',
                                                   'background: #5ADFFF; color: #000000' );
                                      let tempData: DatatableFile[] = tableData.value;
                                      console.log( tableData.value );

                                      // Filtre sur la barre de recherche
                                      if ( filterSearch.value !== '' ) {
                                        tempData = tempData.filter( ( data: DatatableFile ) => {
                                          const name  = data.folderName.toLowerCase();
                                          const ref   = data.reference.toLowerCase();
                                          const value = filterSearch.value.toLowerCase();
                                          return name.search( value ) !== -1 || ref.search( value ) !== -1;
                                        } );
                                      }

                                      // Filtre les types
                                      if ( filterType.value !== '-1' ) {
                                        tempData = tempData.filter( ( data: DatatableFile ) => {
                                          if ( filterType.value === '-1' ) {
                                            return true;
                                          }

                                          return datatableFileHasType( data, filterType.value );
                                        } );
                                      }

                                      // Filtre sur les statuts
                                      if ( filterStatus.value !== '-1' ) {
                                        tempData = tempData.filter( ( data: DatatableFile ) => {
                                          if ( filterStatus.value === '-1' ) {
                                            return true;
                                          }
                                          return data.status.state === filterStatus.value;
                                        } );
                                      }

                                      // Filtre sur "Prospect"
                                      if ( filterProspect.value !== false ) {
                                        tempData = tempData.filter( ( data: DatatableFile ) => {
                                          return data.isProspect;
                                        } );
                                      }

                                      // Pagination
                                      updatePagination( tempData.length );
                                      const trimStart = ( currentPage.value - 1 ) * numberPerPage;
                                      const trimEnd   = trimStart + numberPerPage;
                                      tempData        = tempData.slice( trimStart, trimEnd );


                                      console.log( 'FILTER DATA -->', tempData );
                                      return tempData;
                                    } );

                                    const updateProspect = ( fileId: number, event ) => {
                                      sqliteService.setFileProspect( fileId, event.target.checked );
                                    };

                                    const handleAction = async ( command: { type: string; folder: DatatableFile } ) => {
                                      switch ( command.type ) {
                                        case 'check_element':
                                          let type = '';
                                          if ( command.folder.types.length > 0 ) {
                                            type = command.folder.types[ 0 ].slug;
                                          }
                                          console.log( 'TYPE -->', type );
                                          await checkFolder( command.folder.folderName, type );
                                          tableData.value = ( await sqliteService.getAllFiles() );
                                          break;
                                        case 'open':
                                          const path = getFolderPath( command.folder.folderName );
                                          if ( path === '' ) {
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
                                          const response = await deleteFile( command.folder.id );
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
                                          break;
                                        case 'remove_all':
                                          const res = await removeFolder( command.folder );
                                          if ( res ) {
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
                                          break;
                                        case 'send':
                                          console.log( '%c ON SEND', 'background: #fdd835; color: #000000' );
                                          await postFileToERP( command.folder.folderName );
                                          tableData.value = ( await sqliteService.getAllFiles() );
                                          break;
                                      }
                                    };

                                    const edit = ( reference: string,
                                                   folderName: string,
                                                   type: DatatableFileType[] ) => {
                                      setCurrentFileReference( reference );
                                      setcurrentFolderName( folderName );

                                      router.push( { name: `file-${ type[ 0 ].slug }-edit` } );
                                    };

                                    const codeErrorToString = ( code: number ) => {
                                      switch ( code ) {
                                        case 1:
                                          return 'Manque le devis';
                                        case 2:
                                          return 'Manque le devis signé';
                                        case 3:
                                          return 'Manque l\'avis d\'impositions';
                                        case 4:
                                          return 'Manque la fiche de visite';
                                        case 5:
                                          return 'Manque des photos';
                                        case 6:
                                          return 'Manque l\'attestation sur honneur';
                                        case 7:
                                          return 'Manque cadre contribution CEE';
                                        default:
                                          console.warn( `Le code error ${ code } est inconnue` );
                                          return 'Erreur inconue';
                                      }
                                    };

                                    const updateTodo = ( todo: DbFileTodo ) => {
                                      console.log( '%c UPDATE TODO', 'background: #fdd835; color: #000000' );
                                      console.log( todo );
                                      updateDbTodo( todo.serverId, todo.isDone );
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
                                      edit,
                                      folderTypesToString: datatableFileTypesToString,
                                      listFolderType,
                                      numberToPrice,
                                      codeErrorToString,
                                      updateTodo,
                                    };
                                  },
                                } );
</script>

<style>
</style>
