<template>
  <div class="w-100">
    <div class="pb-10 pb-lg-15">
      <h2 class="fw-bolder text-dark">Caractéristique du chantier</h2>
    </div>
    <step5-form :lists="lists" :worksheet-builder="worksheetBuilder"></step5-form>

    <el-divider class="mb-10"></el-divider>

    <div class="row mt-5">
      <div class="col-md-6 offset-md-3 d-flex justify-content-around">
        <button type="button" @click="generateWorksheet" class="btn btn-info">Générer la fiche
        </button>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Step5Form from '@/components/DCI/wizzard-file/Step5Form.vue';
import { pacRrWorksheetBuilder } from '@/services/file/wizzard/pac_rr/step5Service';
import RrList from '@/types/v2/File/Rr/RrList';

export default defineComponent( {
                                  name:       'file-pac-rr-step-5',
                                  components: {
                                    Step5Form,
                                  },
                                  props:      {
                                    lists: Object as () => RrList,
                                  },
                                  emits:      [ 'generateWorksheet' ],
                                  setup( props, ctx ) {
                                    const generateWorksheet = () => {
                                      ctx.emit( 'generateWorksheet' );
                                    };
                                    return {
                                      worksheetBuilder: pacRrWorksheetBuilder(),
                                      generateWorksheet,
                                    };
                                  },
                                } );
</script>
