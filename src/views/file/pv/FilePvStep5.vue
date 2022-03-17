<template>
  <div class="w-100">

    <div class="pb-10 pb-lg-15">
      <h2 class="fw-bolder text-dark">Caractéristique du chantier</h2>
    </div>

    <div class="row">
      <div class="col-md-4 offset-8 fv-row">
        <label class="form-label mb-3">Période de pose souhaité</label>
        <Field
            type="date"
            class="form-control"
            name="worksheet.period"
            placeholder="01/01/1970"
            value=""
        />
      </div>
    </div>

    <div class="row mt-10">
      <div class="col-md-6 mb-5">
        <label for="montantFactureElectrique" class="form-label mb-3">Montant facture électrique <sup>€</sup></label>
        <Field
            type="text"
            name="worksheet.montantFactureElectrique"
            id="montantFactureElectrique"
            class="form-control"
        >
        </Field>
      </div>

      <div class="col-md-6 mb-5">
        <label for="totalKwhFactureElectrique" class="form-label mb-3">Total kwh sur facture électrique
          <sup><var>KWh</var></sup></label>
        <Field
            type="text"
            name="worksheet.totalKwhFactureElectrique"
            id="totalKwhFactureElectrique"
            class="form-control"
        >
        </Field>
      </div>

      <div class="col-md-6 mb-5">
        <label for="orientation" class="form-label">Orientation</label>
        <Field name="worksheet.orientation"
               id="orientation"
               class="form-select"
               as="select"
        >
          <item-list :lists="lists.orientationList"></item-list>
        </Field>
      </div>
    </div>

    <!-- Graphique (caché) pour le PDF sur l'étude de rentabilité-->
    <canvas id="my_chart" class="mt-10"></canvas>

    <el-divider class="mb-20"></el-divider>

    <div class="row mt-10">
      <div class="col-md-12 fv-row">
        <label class="form-label mb-3">Complément d'information</label>
        <Field
            as="textarea"
            class="form-control"
            name="worksheet.infosSup"
            placeholder="RAS"
            value=""
        />
      </div>
    </div>

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
import { defineComponent, onMounted } from 'vue';
import PvList from '@/types/v2/File/Pv/PvList';
import { Field } from 'vee-validate';
import ItemList from '@/components/DCI/input/ItemList.vue';
import { PvFile } from '@/types/v2/File/Pv/PvFile';
import { ProfitabilityStudyGenerator } from '@/services/pdf/profitabilityStudyGenerator';

export default defineComponent( {
                                  name:       'file-pv-step-5',
                                  components: {
                                    Field,
                                    ItemList,
                                  },
                                  props:      {
                                    lists:    Object as () => PvList,
                                    fileData: {
                                      type:     Object as () => PvFile,
                                      required: true,
                                    },
                                  },
                                  emits:      [ 'generateWorksheet' ],
                                  setup( props, ctx ) {
                                    const generateWorksheet = () => {
                                      ctx.emit( 'generateWorksheet' );
                                    };

                                    onMounted( () => {

                                      // TODO rendre dynamique quand on change les infos
                                      const pdfGenerator = new ProfitabilityStudyGenerator( props.fileData );
                                      pdfGenerator.createChart();
                                    } );
                                    return {
                                      generateWorksheet,
                                    };
                                  },
                                } );
</script>
