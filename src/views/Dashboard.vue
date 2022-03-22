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
import { CombleFile } from '@/types/v2/File/Comble/CombleFile';
import { CombleConverter } from '@/services/file/converterV2/CombleConverter';
import { SolFile } from '@/types/v2/File/Sol/SolFile';
import { SolConverter } from '@/services/file/converterV2/SolConverter';
import { PgConverter } from '@/services/file/converterV2/PgConverter';
import { PgFile } from '@/types/v2/File/Pg/PgFile';
import { RoConverter } from '@/services/file/converterV2/RoConverter';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import { RrConverter } from '@/services/file/converterV2/RrConverter';
import { RrFile } from '@/types/v2/File/Rr/RrFile';

declare const __static: string;

export default defineComponent( {
                                  name: 'dashboard',
                                  setup() {
                                    setCurrentPageTitle( 'Tableau de bord' );
                                    console.log( 'Version de l\'app : ', process.env.VUE_APP_VERSION );
                                    console.log( 'Environnement : ', process.env.NODE_ENV );
                                    console.log( 'URL API : ', process.env.VUE_APP_API_URL );

                                    const jsonFolder      = path.join( __static, 'examples' );
                                    const cetConverter    = new CetConverter( JSON.parse( fs.readFileSync( `${ jsonFolder }/old_data_cet.json`,
                                                                                                           'utf8' ) ) );
                                    const combleConverter = new CombleConverter( JSON.parse( fs.readFileSync( `${ jsonFolder }/old_data_comble.json`,
                                                                                                              'utf8' ) ) );

                                    const solConverter = new SolConverter( JSON.parse( fs.readFileSync( `${ jsonFolder }/old_data_sol.json`,
                                                                                                        'utf8' ) ) );

                                    const pgConverter = new PgConverter( JSON.parse( fs.readFileSync( `${ jsonFolder }/old_data_pg.json`,
                                                                                                      'utf8' ) ) );

                                    const roConverter = new RoConverter( JSON.parse( fs.readFileSync( `${ jsonFolder }/old_data_pac_ro.json`,
                                                                                                      'utf8' ) ) );

                                    const rrConverter = new RrConverter( JSON.parse( fs.readFileSync( `${ jsonFolder }/old_data_pac_rr.json`,
                                                                                                      'utf8' ) ) );

                                    const cetJson: CetFile = cetConverter.convertJsonFile();
                                    console.log( cetJson );

                                    const comblejson: CombleFile = combleConverter.convertJsonFile();
                                    console.log( comblejson );

                                    const solJson: SolFile = solConverter.convertJsonFile();
                                    console.log( solJson );

                                    const pgJson: PgFile = pgConverter.convertJsonFile();
                                    console.log( pgJson );

                                    const roJson: RoFile = roConverter.convertJsonFile();
                                    console.log( roJson );

                                    const rrJson: RrFile = rrConverter.convertJsonFile();
                                    console.log( rrJson );

                                    return {
                                      getFileJson: getFileJson,
                                    };
                                  },
                                } );
</script>
