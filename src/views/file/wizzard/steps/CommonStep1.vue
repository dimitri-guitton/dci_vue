<template>
  <div class="w-100">
    <div class="pb-10 pb-lg-12">
      <h2 class="fw-bolder text-dark">Liste des avis d'imposition</h2>
    </div>

    <div class="row mb-15" v-for="(assent, counter) in assents" v-bind:key="counter">
      <div class="col-md-5 fv-row">
        <label class="d-flex align-items-center fs-6 fw-bold form-label mb-2">
          <span class="required">Numéro Fiscal</span>
          <el-popover
              trigger="click"
              placement="bottom"
              :width="250"
              content="Le numéro fiscal figure sur votre déclaration de revenus ou sur vos avis d’impôt"
          >
            <template #reference>
              <i class="fas fa-exclamation-circle ms-2 fs-7"></i>
            </template>
          </el-popover>

        </label>

        <div class="position-relative">
          <Field
              v-model="assent.numFiscal"
              type="text"
              class="form-control form-control-solid"
              placeholder="0001123456789"
              :name="`assents[${counter}].numFiscal`"
          />
          <ErrorMessage
              class="fv-plugins-message-container invalid-feedback"
              :name="`assents[${counter}].numFiscal`"
          />
        </div>
      </div>
      <div class="col-md-5 fv-row">
        <label class="d-flex align-items-center fs-6 fw-bold form-label mb-2">
          <span class="required">Référence de l'avis</span>
          <el-popover
              trigger="click"
              placement="bottom"
              :width="250"
              content="Il est situé en haut à gauche de l’avis dans le cadre Vos références"
          >
            <template #reference>
              <i class="fas fa-exclamation-circle ms-2 fs-7"></i>
            </template>
          </el-popover>
        </label>

        <div class="position-relative">
          <Field
              v-model="assent.refAvis"
              type="text"
              class="form-control form-control-solid"
              placeholder="0001123456789"
              :name="`assents[${counter}].refAvis`"
          />
          <ErrorMessage
              class="fv-plugins-message-container invalid-feedback"
              :name="`assents[${counter}].refAvis`"
          />
        </div>
      </div>
      <div class="col-md-2 fv-row d-flex align-items-end justify-content-end">
        <button type="button" v-if="counter>0" @click="deleteAssent(counter)" class="btn btn-icon btn-light-danger">
          <i class="fas fa-times fs-4"></i>
        </button>
      </div>
    </div>
    <div class="row mb-10">
      <div class="col-md-4 fv-row">
        <button type="button" @click="addNewAssent" class="btn btn-light-primary"><i class="fas fa-plus fs-4 me-2"></i>
          Ajouter un avis
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import { AssentForm } from '@/types/v2/Wizzard/AssentForm';

export default defineComponent( {
                                  name:       'common-step-1',
                                  components: {
                                    Field,
                                    ErrorMessage,
                                  },
                                  props:      [ 'nbAssent' ],
                                  data() {
                                    const assents: AssentForm[] = [];

                                    // Initialise le nombre d'avis
                                    if ( this.$props.nbAssent === 0 ) {
                                      assents.push( {
                                                      numFiscal: '',
                                                      refAvis:   '',
                                                    } );
                                    } else {
                                      for ( let i = 1; i <= this.$props.nbAssent; i++ ) {
                                        assents.push( {
                                                        numFiscal: '',
                                                        refAvis:   '',
                                                      } );
                                      }
                                    }

                                    // const fileData           = getCurrentCetFileData();
                                    // const quotationGenerator = new QuotationGenerator( fileData );
                                    // quotationGenerator.previewPdf();

                                    return {
                                      assents: assents,
                                    };
                                  },
                                  methods: {
                                    addNewAssent() {
                                      this.assents.push( {
                                                           numFiscal: '',
                                                           refAvis:   '',
                                                         } );
                                    },
                                    deleteAssent( counter ) {
                                      this.assents.splice( counter, 1 );
                                    },
                                  },
                                } );
</script>
