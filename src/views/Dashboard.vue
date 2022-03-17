<template>
  <p>DCI {{ version }}</p>
  <!--  <button @click="convertOldJsonToNewJson" class="btn btn-success mx-2 my-2">Mettre à jours les données</button>-->
  <button @click="getFileJson" class="btn btn-success mx-2 my-2">Mettre à jour les données</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { setCurrentPageTitle } from '@/core/helpers/breadcrumb';
import { getFileJson } from '@/services/folder/folderService';


export default defineComponent( {
                                  name: 'dashboard',
                                  setup() {
                                    setCurrentPageTitle( 'Tableau de bord' );
                                    console.log( 'Version de l\'app : ', process.env.VUE_APP_VERSION );
                                    console.log( 'Environnement : ', process.env.NODE_ENV );
                                    console.log( 'URL API : ', process.env.VUE_APP_API_URL );
                                    return {
                                      version:     process.env.VUE_APP_VERSION,
                                      getFileJson: getFileJson,
                                    };
                                  },
                                } );
</script>
