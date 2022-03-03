<template>
  <button @click="convertOldJsonToNewJson" class="btn btn-info mx-2 my-2">UPDATE OLD JSON</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { setCurrentPageTitle } from '@/core/helpers/breadcrumb';
import { convertAllOldJsonToNewJson } from '@/services/folder/folderService';


export default defineComponent( {
                                  name: 'dashboard',
                                  setup() {
                                    setCurrentPageTitle( 'Tableau de bord' );
                                    console.log( 'Version de l\'app : ', process.env.VUE_APP_VERSION );
                                    console.log( 'Environnement : ', process.env.NODE_ENV );
                                    console.log( 'URL API : ', process.env.VUE_APP_API_URL );
                                    return {
                                      convertOldJsonToNewJson: convertAllOldJsonToNewJson,
                                    };
                                  },
                                } );
</script>
