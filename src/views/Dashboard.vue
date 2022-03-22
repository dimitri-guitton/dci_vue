<template>
  <div class="row d-flex justify-content-center">
    <button @click="getFileJson" class="btn btn-success mx-2 my-2 w-auto">Mettre à jour les ressources</button>
  </div>
  <!--  <button @click="convertOldJsonToNewJson" class="btn btn-success mx-2 my-2">Mettre à jours les données</button>-->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { setCurrentPageTitle } from '@/core/helpers/breadcrumb';
import { getFileJson } from '@/services/folder/folderService';
import { CetConverter } from '@/services/file/converterV2/CetConverter';
import path from 'path';
import fs from 'fs';
import { CetFile } from '@/types/v2/File/Cet/CetFile';

declare const __static: string;

export default defineComponent( {
                                  name: 'dashboard',
                                  setup() {
                                    setCurrentPageTitle( 'Tableau de bord' );
                                    console.log( 'Version de l\'app : ', process.env.VUE_APP_VERSION );
                                    console.log( 'Environnement : ', process.env.NODE_ENV );
                                    console.log( 'URL API : ', process.env.VUE_APP_API_URL );

                                    const jsonFolder       = path.join( __static, 'examples' );
                                    const converter        = new CetConverter( JSON.parse( fs.readFileSync( `${ jsonFolder }/old_data_cet.json`,
                                                                                                            'utf8' ) ) );
                                    const newJson: CetFile = converter.convertJsonFile();
                                    console.log( 'NEW JSON' );
                                    console.log( newJson );
                                    return {
                                      getFileJson: getFileJson,
                                    };
                                  },
                                } );
</script>
