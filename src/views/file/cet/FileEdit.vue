<template>
  <div class="card">
    <div class="card-body">
      <div
          class="stepper stepper-links d-flex flex-column"
          id="kt_create_account_stepper"
          ref="horizontalWizardRef"
      >

        <!-- Header du wizzard-->
        <wizzard-file-header></wizzard-file-header>

        <form
            class="mx-auto mw-1000px w-100 pt-15 pb-10"
            novalidate="novalidate"
            id="kt_create_account_form"
            @submit="handleStep"
            ref="stepForm"
        >
          <!-- Etape 1-->
          <div class="current" data-kt-stepper-element="content">
            <CommonStep1 :nbAssent="nbAssent"></CommonStep1>
          </div>

          <!--begin::Step 2-->
          <div data-kt-stepper-element="content">
            <CommonStep2 :assents="assents"></CommonStep2>
          </div>
          <!--end::Step 2-->

          <!--begin::Step 3-->
          <div data-kt-stepper-element="content">
            <FileCetStep3 :lists="lists"></FileCetStep3>
          </div>
          <!--end::Step 3-->

          <!--begin::Step 4-->
          <div data-kt-stepper-element="content">
            <FileCetStep4 @generateQuotation="onGenerateQuotation"
                          @generateAddressCertificate="onGenerateAddressCertificate"
                          :blankOptions="blankOptions"
                          :options="options"
                          :selectedProducts="selectedProducts"
                          :products="products"></FileCetStep4>
          </div>
          <!--end::Step 4-->

          <!--begin::Step 5-->
          <div data-kt-stepper-element="content">
            <FileCetStep5 @generateWorksheet="onGenerateWorksheet" :lists="lists"></FileCetStep5>
          </div>
          <!--end::Step 5-->

          <div class="d-flex flex-stack pt-15">
            <div class="mr-2">
              <button
                  type="button"
                  class="btn btn-lg btn-light-primary me-3"
                  data-kt-stepper-action="previous"
                  @click="previousStep"
              >
                <span class="svg-icon svg-icon-4 me-1">
                  <i class="fa fa-arrow-left"></i>
                </span>
                Précédent
              </button>
            </div>

            <div>
              <!--              {{ currentStepIndex }}<br>-->
              <!--              {{ totalSteps - 1 }}<br>-->
              <!--              {{ // currentStepIndex === totalSteps - 1 }}<br>-->
              <!--              <button-->
              <!--                  type="button"-->
              <!--                  class="btn btn-lg btn-primary me-3"-->
              <!--                  data-kt-stepper-action="submit"-->
              <!--                  v-if="currentStepIndex === totalSteps - 1"-->
              <!--                  @click="formSubmit()"-->
              <!--              >-->
              <!--                <span class="indicator-label">-->
              <!--                  Submit-->
              <!--                  <span class="svg-icon svg-icon-3 ms-2 me-0">-->
              <!--                    <i class="fa-arrow-right"></i>-->
              <!--                  </span>-->
              <!--                </span>-->
              <!--                <span class="indicator-progress">-->
              <!--                  Please wait...-->
              <!--                  <span-->
              <!--                      class="spinner-border spinner-border-sm align-middle ms-2"-->
              <!--                  ></span>-->
              <!--                </span>-->
              <!--              </button>-->

              <button
                  type="submit"
                  class="btn btn-lg btn-primary me-3"
                  v-if="currentStepIndex === totalSteps - 1"
              >
                STOP
                <span class="svg-icon svg-icon-4 ms-1 me-0">
                  <i class="fa fa-arrow-right"></i>
                </span>
              </button>
              <button v-else type="submit" class="btn btn-lg btn-primary">
                Suivant
                <span class="svg-icon svg-icon-4 ms-1 me-0">
                  <i class="fa fa-arrow-right"></i>
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue';
import Swal from 'sweetalert2/dist/sweetalert2.min.js';
import { StepperComponent } from '@/assets/ts/components';
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb';
import { setLocale } from 'yup';
import { useForm } from 'vee-validate';
import { getCurrentCetFileData, resetCurrentFileData } from '@/services/data/dataService';
import { Assent } from '@/types/v2/File/Common/Assent';
import { CetFileStep } from '@/types/v2/Wizzard/FileStep';
import CommonStep1 from '@/views/file/wizzard/steps/CommonStep1.vue';
import CommonStep2 from '@/views/file/wizzard/steps/CommonStep2.vue';
import { Step1 } from '@/types/v2/Wizzard/Step1';
import { Step2 } from '@/types/v2/Wizzard/Step2';
import { BaseStep4 } from '@/types/v2/Wizzard/step4/BaseStep4';
import WizzardFileHeader from '@/components/DCI/wizzard-file/Header.vue';
import { validateStepOne, yupConfigStep1 } from '@/services/file/wizzard/step1Service';
import { initFormDataStep1And2 } from '@/services/file/wizzard/wizzardService';
import { validateStepTwo, yupConfigStep2 } from '@/services/file/wizzard/step2Service';
import { initCetFormDataStep3, validateCetStep3, yupCetConfigStep3 } from '@/services/file/wizzard/step3Service';
import FileCetStep3 from '@/views/file/cet/FileCetStep3.vue';
import FileCetStep4 from '@/views/file/cet/FileCetStep4.vue';
import { initCetFormDataStep4, yupCetConfigStep4 } from '@/services/file/wizzard/step4Service';
import FileCetStep5 from '@/views/file/cet/FileCetStep5.vue';
import { initCetFormDataStep5, yupCetConfigStep5 } from '@/services/file/wizzard/cet/step5Service';
import { CetStep3 } from '@/types/v2/Wizzard/step3/CetStep3';
import { CetStep5 } from '@/types/v2/Wizzard/step5/CetStep5';
import { NewAddressGenerator } from '@/services/pdf/newAddressGenerator';
import { WorksheetGenerator } from '@/services/pdf/worksheetGenerator';

setLocale( {
             // use constant translation keys for messages without values
             mixed:  {
               required: 'Ce champ est requis',
             },
             string: {
               email: 'E-mail invalide',
             },
           } );

export default defineComponent( {
                                  name:       'file-cet-edit',
                                  components: {
                                    FileCetStep5,
                                    FileCetStep4,
                                    FileCetStep3,
                                    WizzardFileHeader,
                                    CommonStep2,
                                    CommonStep1,
                                  },
                                  setup() {
                                    const _stepperObj         = ref<StepperComponent | null>( null );
                                    const horizontalWizardRef = ref<HTMLElement | null>( null );
                                    onMounted( () => {
                                      _stepperObj.value = StepperComponent.createInsance(
                                          horizontalWizardRef.value as HTMLElement,
                                      );
                                      setCurrentPageBreadcrumbs( 'Horizontal', [ 'Pages', 'Wizards' ] );
                                    } );
                                    onUnmounted( () => {
                                      // Remove les données sauvgardé en mémoire quand on quitte la page
                                      resetCurrentFileData();
                                    } );


                                    // Initialisation des variables
                                    const stepForm            = ref();
                                    const currentStepIndex    = ref( 0 );
                                    // Récupération des données du fichier JSON
                                    const fileData            = getCurrentCetFileData();
                                    const lists               = fileData.lists;
                                    const products            = fileData.quotation.products;
                                    const selectedProducts    = fileData.quotation.selectedProducts;
                                    const options             = fileData.quotation.options;
                                    const blankOptions        = fileData.quotation.blankOptions;
                                    const assents             = ref<Assent[]>( [] );
                                    const formData            = ref<CetFileStep>( {
                                                                                    ...initFormDataStep1And2( fileData.assents,
                                                                                                              fileData.beneficiary ),
                                                                                    ...initCetFormDataStep3( fileData ),
                                                                                    ...initCetFormDataStep4( fileData ),
                                                                                    ...initCetFormDataStep5( fileData.workSheet ),
                                                                                  } );
                                    const nbAssent            = formData.value?.assents.length;
                                    // Configuration de la validation du formulaire
                                    const createAccountSchema = [
                                      yupConfigStep1(),
                                      yupConfigStep2(),
                                      yupCetConfigStep3(),
                                      yupCetConfigStep4(),
                                      yupCetConfigStep5(),
                                    ];

                                    // --------------------- Début config du Wizzard et du formulaire--------------------------
                                    const currentSchema   = computed( () => {
                                      return createAccountSchema[ currentStepIndex.value ];
                                    } );
                                    // const { resetForm, handleSubmit } = useForm<Step1 | Step2 | BaseStep3 | BaseStep4>(
                                    const {
                                            resetForm,
                                            handleSubmit,
                                          }               = useForm<Step1 | Step2 | CetStep3 | BaseStep4 | CetStep5>(
                                        {
                                          validationSchema: currentSchema,
                                        } );
                                    const refreshFormData = () => {
                                      resetForm( {
                                                   values: {
                                                     ...formData.value,
                                                   },
                                                 } );
                                    };
                                    const totalSteps      = computed( () => {
                                      if ( !_stepperObj.value ) {
                                        return;
                                      }

                                      return _stepperObj.value.totatStepsNumber;
                                    } );


                                    console.log( 'Total Steps', totalSteps );
                                    console.log( 'currentStepIndex', currentStepIndex );

                                    resetForm( {
                                                 values: {
                                                   ...formData.value,
                                                 },
                                               } );
                                    const previousStep = () => {
                                      if ( !_stepperObj.value ) {
                                        return;
                                      }

                                      currentStepIndex.value--;

                                      _stepperObj.value.goPrev();
                                    };
                                    // --------------------- Fin config du Wizzard et du formulaire--------------------------


                                    const handleStep = handleSubmit( async ( values ) => {
                                      console.log( values );


                                      console.log( '%c HANDLE STEP', 'background: #0aa8ff; color: #000000' );
                                      formData.value = {
                                        ...formData.value,
                                        ...values,
                                      };

                                      console.log( 'Ancien step -->', currentStepIndex.value );

                                      console.log( formData.value );
                                      if ( currentStepIndex.value === 0 ) {
                                        console.log( '%c Validation de l\'étape 1',
                                                     'background: #FF7CA7; color: #000000' );


                                        const response = await validateStepOne( formData.value );
                                        assents.value  = response.assents;
                                        formData.value = response.formData;
                                        // Force le refersh des data du formulaire
                                        refreshFormData();
                                      } else if ( currentStepIndex.value === 1 ) {
                                        console.log( '%c Validation de l\'étape 1',
                                                     'background: #FF7CA7; color: #000000' );
                                        await validateStepTwo( formData.value );
                                      } else if ( currentStepIndex.value === 2 ) {
                                        console.log( '%c Validation step 3', 'background: #fdd835; color: #000000' );
                                        await validateCetStep3( formData.value );
                                      }

                                      currentStepIndex.value++;
                                      console.log( '%c OK', 'background: #CEFF00; color: #000000' );
                                      console.log( currentStepIndex.value );
                                      console.log( totalSteps.value );

                                      if ( !_stepperObj.value ) {
                                        return;
                                      }

                                      _stepperObj.value.goNext();
                                    } );


                                    const formSubmit = () => {
                                      Swal.fire( {
                                                   text:              'All is cool! Now you submit this form',
                                                   icon:              'success',
                                                   buttonsStyling:    false,
                                                   confirmButtonText: 'Ok, got it!',
                                                   customClass:       {
                                                     confirmButton: 'btn fw-bold btn-light-primary',
                                                   },
                                                 } ).then( () => {
                                        window.location.reload();
                                      } );
                                    };

                                    const onGenerateWorksheet = handleSubmit( async ( values ) => {
                                      console.log( '%c ON GENERATE Worksheet', 'background: #00FFCD; color: #000000' );
                                      console.log( values );
                                    } );

                                    const onGenerateQuotation = handleSubmit( async ( values ) => {
                                      console.log( '%c ONgenerateQuotation', 'background: #00FFCD; color: #000000' );
                                      console.log( values );
                                    } );

                                    const onGenerateAddressCertificate = handleSubmit( async ( values ) => {
                                      console.log( '%c onGenerateAddressCertificate',
                                                   'background: #00FFCD; color: #000000' );
                                      console.log( values );
                                    } );


                                    // TEST

                                    const t  = new NewAddressGenerator( fileData.housing, fileData.beneficiary );
                                    // t.generatePdf();
                                    const tt = new WorksheetGenerator( fileData );
                                    tt.generatePdf();


                                    return {
                                      onGenerateWorksheet,
                                      onGenerateQuotation,
                                      horizontalWizardRef,
                                      onGenerateAddressCertificate,
                                      previousStep,
                                      handleStep,
                                      formSubmit,
                                      totalSteps,
                                      currentStepIndex,
                                      assents,
                                      nbAssent,
                                      lists,
                                      products,
                                      selectedProducts,
                                      options,
                                      blankOptions,
                                      stepForm,
                                    };
                                  },

                                } );
</script>
