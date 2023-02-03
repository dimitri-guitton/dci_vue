<template>
    <div class="w-100">

        <div class="pb-10 pb-lg-15">
            <h2 class="fw-bolder text-dark">Caractéristique du chantier</h2>
        </div>

        <div class="row">
            <div class="col-md-4 offset-8 fv-row">
                <label class="form-label mb-3">Période de pose souhaité</label>
                <Field
                    class="form-control"
                    name="worksheet.period"
                    placeholder="01/01/1970"
                    type="date"
                    value=""
                />
            </div>
        </div>

        <div class="row mt-10">
            <div class="col-md-6 mb-5">
                <label class="form-label" for="orientation">Prix moyen du kWh en France en cts</label>
                <Field
                    id="averagePricePerKWhInFrance"
                    v-model.number="averagePricePerKWhInFrance"
                    as="select"
                    class="form-select"
                    name="worksheet.averagePricePerKWhInFrance"
                    @change="updateWorksheet"
                >
                    <item-list :lists="lists.averagePricePerKWhInFranceList"></item-list>
                </Field>
            </div>
            <div class="col-md-6 mb-5">
                <label class="form-label" for="orientation">Orientation</label>
                <Field
                    id="orientation"
                    v-model.number="orientation"
                    as="select"
                    class="form-select"
                    name="worksheet.orientation"
                    @change="updateWorksheet"
                >
                    <item-list :lists="lists.orientationList"></item-list>
                </Field>
            </div>

            <div class="col-md-6 mb-5">
                <label class="form-label" for="electricityPriceEvolution">Évolution du prix de l'électricité</label>
                <Field
                    id="electricityPriceEvolution"
                    v-model.number="electricityPriceEvolution"
                    as="select"
                    class="form-select"
                    name="worksheet.electricityPriceEvolution"
                    @change="updateWorksheet"
                >
                    <item-list :lists="lists.electricityPriceEvolutionList"></item-list>
                </Field>
            </div>

            <div class="col-md-6 mb-5">
                <label class="form-label" for="electricityPriceEvolution">Ratio de revente auprès d'EDF</label>
                <Field
                    id="ratioResaleToEDF"
                    v-model.number="ratioResaleToEDF"
                    as="select"
                    class="form-select"
                    name="worksheet.ratioResaleToEDF"
                    @change="updateWorksheet"
                >
                    <item-list :lists="lists.ratioResaleToEDFList"></item-list>
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
                <button class="btn btn-info" type="button" @click="generateWorksheet">Générer la fiche
                </button>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
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
                                        const pdfGenerator               = new ProfitabilityStudyGenerator( props.fileData );
                                        const averagePricePerKWhInFrance = ref( props.fileData.worksheet.averagePricePerKWhInFrance );
                                        const orientation                = ref( props.fileData.worksheet.orientation );
                                        const electricityPriceEvolution  = ref( props.fileData.worksheet.electricityPriceEvolution );
                                        const ratioResaleToEDF           = ref( props.fileData.worksheet.ratioResaleToEDF );

                                        const generateWorksheet = () => {
                                            ctx.emit( 'generateWorksheet' );
                                        };

                                        onMounted( () => {
                                            pdfGenerator.createChart();
                                        } );

                                        const updateWorksheet = () => {
                                            const newWoksheet = {
                                                ...props.fileData.worksheet,
                                                orientation:                orientation.value,
                                                electricityPriceEvolution:  electricityPriceEvolution.value,
                                                ratioResaleToEDF:           ratioResaleToEDF.value,
                                                averagePricePerKWhInFrance: averagePricePerKWhInFrance.value,
                                            };

                                            pdfGenerator.updateChart( props.fileData.quotation,
                                                                      newWoksheet,
                                                                      props.fileData.energyZone );
                                        };


                                        return {
                                            generateWorksheet,
                                            orientation,
                                            electricityPriceEvolution,
                                            ratioResaleToEDF,
                                            averagePricePerKWhInFrance,
                                            updateWorksheet,
                                        };
                                    },
                                } );
</script>
