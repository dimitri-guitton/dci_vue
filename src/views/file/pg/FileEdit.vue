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
            <FilePgStep3 :file-data="fileData" :lists="lists"></FilePgStep3>
          </div>
          <!--end::Step 3-->

          <!--begin::Step 4-->
          <div data-kt-stepper-element="content">
            <FilePgStep4 @generateQuotation="onGenerateQuotation"
                         @generateAddressCertificate="onGenerateAddressCertificate"
                         @calculedPrice="onCalculedPrice"
                         :blank-options="blankOptions"
                         :options="options"
                         :selected-products="selectedProducts"
                         :force-refresh="forceRefreshStep4"
                         :file-data="fileData"
                         :products="products"></FilePgStep4>
          </div>
          <!--end::Step 4-->

          <!--begin::Step 5-->
          <div data-kt-stepper-element="content">
            <FilePgStep5 @generateWorksheet="onGenerateWorksheet" :lists="lists"></FilePgStep5>
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

              <!--              <button-->
              <!--                  type="submit"-->
              <!--                  class="btn btn-lg btn-primary me-3"-->
              <!--                  v-if="currentStepIndex === totalSteps - 1"-->
              <!--              >-->
              <!--                STOP-->
              <!--                <span class="svg-icon svg-icon-4 ms-1 me-0">-->
              <!--                  <i class="fa fa-arrow-right"></i>-->
              <!--                </span>-->
              <!--              </button>-->
              <button v-if="currentStepIndex !== totalSteps - 1" type="submit" class="btn btn-lg btn-primary">
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
import { getCurrentPgFileData, resetCurrentFileData } from '@/services/data/dataService';
import { Assent } from '@/types/v2/File/Common/Assent';
import CommonStep1 from '@/views/file/wizzard/steps/CommonStep1.vue';
import CommonStep2 from '@/views/file/wizzard/steps/CommonStep2.vue';
import { Step1 } from '@/types/v2/Wizzard/Step1';
import { Step2 } from '@/types/v2/Wizzard/Step2';
import { BaseStep4 } from '@/types/v2/Wizzard/step4/BaseStep4';
import WizzardFileHeader from '@/components/DCI/wizzard-file/Header.vue';
import { validateStepOne, yupConfigStep1 } from '@/services/file/wizzard/step1Service';
import { initFormDataStep1And2 } from '@/services/file/wizzard/wizzardService';
import { validateStepTwo, yupConfigStep2 } from '@/services/file/wizzard/step2Service';
import { NewAddressGenerator } from '@/services/pdf/newAddressGenerator';
import { WorksheetGenerator } from '@/services/pdf/worksheetGenerator';
import { Price } from '@/types/v2/File/Price';
import { QuotationGenerator } from '@/services/pdf/quotationGenerator';
import { ElLoading } from 'element-plus';
import FilePgStep3 from '@/views/file/pg/FilePgStep3.vue';
import FilePgStep4 from '@/views/file/pg/FilePgStep4.vue';
import FilePgStep5 from '@/views/file/pg/FilePgStep5.vue';
import { PgFileStep } from '@/types/v2/Wizzard/FileStep';
import { initPgFormDataStep3, validatePgStep3, yupPgConfigStep3 } from '@/services/file/wizzard/pg/step3Service';
import { initPgFormDataStep4, validatePgStep4, yupPgConfigStep4 } from '@/services/file/wizzard/pg/step4Service';
import { initPgFormDataStep5, savePgWorksheet, yupPgConfigStep5 } from '@/services/file/wizzard/pg/step5Service';
import { PgStep5 } from '@/types/v2/Wizzard/step5/PgStep5';
import { PgFile } from '@/types/v2/File/Pg/PgFile';
import { BaseStep3 } from '@/types/v2/Wizzard/step3/BaseStep3';

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
                                  name:       'file-pg-edit',
                                  components: {
                                    FilePgStep5,
                                    FilePgStep4,
                                    FilePgStep3,
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


                                    const forceRefreshStep4 = ref( false );
                                    let price: Price        = {
                                      HT:             0,
                                      TVA:            0,
                                      TTC:            0,
                                      maPrimeRenov:   0,
                                      remainderToPay: 0,
                                    };


                                    // Initialisation des variables
                                    const stepForm            = ref();
                                    const currentStepIndex    = ref( 0 );
                                    // Récupération des données du fichier JSON
                                    const fileData            = ref<PgFile>( getCurrentPgFileData() );
                                    const lists               = fileData.value.lists;
                                    const products            = fileData.value.quotation.products;
                                    const selectedProducts    = fileData.value.quotation.selectedProducts;
                                    const options             = fileData.value.quotation.options;
                                    const blankOptions        = fileData.value.quotation.blankOptions;
                                    const assents             = ref<Assent[]>( [] );
                                    const formData            = ref<PgFileStep>( {
                                                                                   ...initFormDataStep1And2( fileData.value.assents,
                                                                                                             fileData.value.beneficiary ),
                                                                                   ...initPgFormDataStep3( fileData.value ),
                                                                                   ...initPgFormDataStep4( fileData.value ),
                                                                                   ...initPgFormDataStep5( fileData.value.worksheet ),
                                                                                 } );
                                    const nbAssent            = formData.value?.assents.length;
                                    // Configuration de la validation du formulaire
                                    const createAccountSchema = [
                                      yupConfigStep1(),
                                      yupConfigStep2(),
                                      yupPgConfigStep3(),
                                      yupPgConfigStep4(),
                                      yupPgConfigStep5(),
                                    ];

                                    // --------------------- Début config du Wizzard et du formulaire--------------------------
                                    const currentSchema   = computed( () => {
                                      return createAccountSchema[ currentStepIndex.value ];
                                    } );
                                    // const { resetForm, handleSubmit } = useForm<Step1 | Step2 | BaseStep3 | BaseStep4>(
                                    const {
                                            resetForm,
                                            handleSubmit,
                                          } = useForm<Step1 | Step2 | BaseStep3 | BaseStep4 | PgStep5>(
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
                                      formData.value = {
                                        ...formData.value,
                                        ...values,
                                      };

                                      if ( currentStepIndex.value === 0 ) {
                                        console.log( '%c Validation de l\'étape 1',
                                                     'background: #FF7CA7; color: #000000' );


                                        const response = await validateStepOne( formData.value,
                                                                                fileData.value.assents );
                                        assents.value  = response.assents;
                                        formData.value = response.formData;
                                        // Force le refersh des data du formulaire
                                        refreshFormData();
                                      } else if ( currentStepIndex.value === 1 ) {
                                        console.log( '%c Validation de l\'étape 1',
                                                     'background: #FF7CA7; color: #000000' );
                                        fileData.value = ( await validateStepTwo( formData.value ) as PgFile );
                                      } else if ( currentStepIndex.value === 2 ) {
                                        console.log( '%c Validation step 3', 'background: #fdd835; color: #000000' );
                                        await validatePgStep3( formData.value );
                                        forceRefreshStep4.value = !forceRefreshStep4.value;
                                      } else if ( currentStepIndex.value === 3 ) {
                                        console.log( '%c Validation step 4', 'background: #fdd835; color: #000000' );
                                        await validatePgStep4( formData.value, price );
                                      }

                                      currentStepIndex.value++;
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


                                    const onGenerateQuotation = handleSubmit( async ( values ) => {
                                      console.log( '%c ONgenerateQuotation', 'background: #00FFCD; color: #000000' );
                                      console.log( values );

                                      const newFileData     = await validatePgStep4( ( values as PgFileStep ),
                                                                                     price );
                                      // Loader
                                      const loadingInstance = ElLoading.service( { fullscreen: true } );
                                      setTimeout( () => {
                                        const quotationGenerator = new QuotationGenerator( newFileData );
                                        quotationGenerator.generatePdf();
                                        loadingInstance.close();
                                      }, 500 );
                                    } );

                                    const onGenerateAddressCertificate = handleSubmit( async ( values ) => {
                                      console.log( '%c onGenerateAddressCertificate',
                                                   'background: #00FFCD; color: #000000' );
                                      console.log( values );

                                      const addressGenerator = new NewAddressGenerator( fileData.value.housing,
                                                                                        fileData.value.beneficiary );
                                      addressGenerator.generatePdf();
                                    } );

                                    const onGenerateWorksheet = handleSubmit( async ( values ) => {
                                      console.log( '%c ON GENERATE Worksheet', 'background: #00FFCD; color: #000000' );
                                      console.log( values );
                                      console.log( '%c ', 'background: #fdd835; color: #000000' );
                                      console.log( '%c ', 'background: #fdd835; color: #000000' );
                                      console.log( '%c ', 'background: #fdd835; color: #000000' );
                                      console.log( formData.value );

                                      const newFileData: PgFile = savePgWorksheet( ( values as PgFileStep ) );
                                      const worksheetGenerator  = new WorksheetGenerator( newFileData );
                                      worksheetGenerator.generatePdf();
                                    } );

                                    const onCalculedPrice = ( newPrice: Price ) => {
                                      price = newPrice;
                                    };

                                    // TEST
                                    // const t  = new NewAddressGenerator( fileData.value.housing, fileData.value.beneficiary );
                                    // // t.generatePdf();
                                    // const tt = new WorksheetGenerator( fileData.value );
                                    // tt.generatePdf();


                                    return {
                                      onCalculedPrice,
                                      forceRefreshStep4,
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
                                      fileData,
                                    };
                                  },

                                } );
</script>
