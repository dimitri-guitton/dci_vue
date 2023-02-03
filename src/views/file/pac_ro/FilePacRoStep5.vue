<template>
    <div class="w-100">
        <div class="pb-10 pb-lg-15">
            <h2 class="fw-bolder text-dark">Caractéristique du chantier</h2>
        </div>
        <step5-form :lists="lists" :worksheet-builder="worksheetBuilder"></step5-form>

        <el-divider class="mb-10"></el-divider>

        <div class="row mt-5">
            <div class="col-md-6 offset-md-3 d-flex justify-content-around">
                <button class="btn btn-info" type="button" @click="generateWorksheet">Générer la fiche
                </button>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Step5Form from '@/components/DCI/wizzard-file/Step5Form.vue';
import RoList from '@/types/v2/File/Ro/RoList';
import { pacRoWorksheetBuilder } from '@/services/file/wizzard/pac_ro/step5Service';

export default defineComponent( {
                                    name:       'file-pac-ro-step-5',
                                    components: {
                                        Step5Form,
                                    },
                                    props:      {
                                        lists: Object as () => RoList,
                                    },
                                    emits:      [ 'generateWorksheet' ],
                                    setup( props, ctx ) {
                                        const generateWorksheet = () => {
                                            ctx.emit( 'generateWorksheet' );
                                        };
                                        return {
                                            worksheetBuilder: pacRoWorksheetBuilder(),
                                            generateWorksheet,
                                        };
                                    },
                                } );
</script>
