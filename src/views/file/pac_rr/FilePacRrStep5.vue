<template>
  <div class="w-100">
    <div class="row mb-10 d-flex align-items-end">
      <div class="col-md-4">
        <label class="form-check form-switch form-check-custom">
          <Field
              type="checkbox"
              class="form-check-input"
              name="worksheet.technicalVisit"
              :value="true"
          />
          <span class="form-check-label fw-bold text-gray-400">Demande de visite technique</span>
        </label>
      </div>
      <div class="col-md-4 fv-row">
        <label class="form-label mb-3">Raison de la visite</label>
        <Field
            type="text"
            class="form-control"
            name="worksheet.technicalVisitReason"
            placeholder="Raison de la visite"
            value=""
        />
      </div>
    </div>
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
import { computed, defineComponent } from 'vue';
import Step5Form from '@/components/DCI/wizzard-file/Step5Form.vue';
import { pacRrWorksheetBuilder } from '@/services/file/wizzard/pac_rr/step5Service';
import RrList from '@/types/v2/File/Rr/RrList';
import { Field } from 'vee-validate';
import { RrFile } from '@/types/v2/File/Rr/RrFile';


export default defineComponent( {
                                  name:       'file-pac-rr-step-5',
                                  components: {
                                    Step5Form,
                                    Field,
                                  },
                                  props:      {
                                    lists:    Object as () => RrList,
                                    fileData: {
                                      type:     Object as () => RrFile,
                                      required: true,
                                    },
                                  },
                                  emits:      [ 'generateWorksheet' ],
                                  setup( props, ctx ) {
                                    const generateWorksheet = () => {
                                      ctx.emit( 'generateWorksheet' );
                                    };

                                    const worksheetBuilder = computed( () => {
                                      return pacRrWorksheetBuilder( props.fileData );
                                    } );

                                    return {
                                      worksheetBuilder,
                                      generateWorksheet,
                                    };
                                  },
                                } );
</script>
