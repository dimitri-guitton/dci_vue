<template>
  <div class="row d-flex justify-content-center">
    <button @click="getFileJson" class="btn btn-success mx-2 my-2 w-auto">Mettre à jour les ressources</button>
    <button v-if="!oldJsonAreConverted && dropboxPath !== ''"
            @click="convertAllJson"
            class="btn btn-warning mx-2 my-2 w-auto">
      Récupérer les dossiers de la
      version
      précédente
    </button>
  </div>
  <!--  <button @click="convertOldJsonToNewJson" class="btn btn-success mx-2 my-2">Mettre à jours les données</button>-->
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { setCurrentPageTitle } from '@/core/helpers/breadcrumb';
import { convertAllOldjsonToNewJson, getFileJson } from '@/services/folder/folderService';
import { getDropboxPath, getOldJsonAreConverted } from '@/services/data/dataService';

declare const __static: string;

export default defineComponent( {
                                  name: 'dashboard',
                                  setup() {
                                    const oldJsonAreConverted = ref<boolean>( getOldJsonAreConverted() );
                                    const dropboxPath         = ref<string>( getDropboxPath() );
                                    console.log( 'oldJsonAreConverted', oldJsonAreConverted.value );
                                    setCurrentPageTitle( 'Tableau de bord' );
                                    console.log( 'Version de l\'app : ', process.env.VUE_APP_VERSION );
                                    console.log( 'Environnement : ', process.env.NODE_ENV );
                                    console.log( 'URL API : ', process.env.VUE_APP_API_URL );

                                    const convertAllJson = () => {
                                      convertAllOldjsonToNewJson();
                                      oldJsonAreConverted.value = true;
                                    };

                                    return {
                                      getFileJson: getFileJson,
                                      convertAllJson,
                                      oldJsonAreConverted,
                                      dropboxPath,
                                    };
                                  },
                                } );
</script>
