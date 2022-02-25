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
            <FileCombleStep3 :lists="lists"></FileCombleStep3>
          </div>
          <!--end::Step 3-->

          <!--begin::Step 4-->
          <div data-kt-stepper-element="content">
            <FileCombleStep4 @generateQuotation="onGenerateQuotation"
                             @generateAddressCertificate="onGenerateAddressCertificate"
                             @calculedPrice="onCalculedPrice"
                             :blank-options="blankOptions"
                             :options="options"
                             :selected-products="selectedProducts"
                             :force-refresh="forceRefreshStep4"
                             :file-data="fileData"
                             :area="area"
                             :products="products"></FileCombleStep4>
          </div>
          <!--end::Step 4-->

          <!--begin::Step 5-->
          <div data-kt-stepper-element="content">
            <FileCombleStep5 @generateWorksheet="onGenerateWorksheet" :lists="lists"></FileCombleStep5>
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
import { getCurrentCombleFileData, resetCurrentFileData } from '@/services/data/dataService';
import { Assent } from '@/types/v2/File/Common/Assent';
import { CombleFileStep } from '@/types/v2/Wizzard/FileStep';
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
import { Price } from '@/services/file/wizzard/Price';
import FileCombleStep4 from '@/views/file/comble/FileCombleStep4.vue';
import FileCombleStep5 from '@/views/file/comble/FileCombleStep5.vue';
import FileCombleStep3 from '@/views/file/comble/FileCombleStep3.vue';
import { CombleStep5 } from '@/types/v2/Wizzard/step5/CombleStep5';
import { CombleStep3 } from '@/types/v2/Wizzard/step3/CombleStep3';
import {
  initCombleFormDataStep3,
  validateCombleStep3,
  yupCombleConfigStep3,
} from '@/services/file/wizzard/comble/step3Service';
import {
  initCombleFormDataStep4,
  validateCombleStep4,
  yupCombleConfigStep4,
} from '@/services/file/wizzard/comble/step4Service';
import {
  initCombleFormDataStep5,
  saveCombleWorksheet,
  yupCombleConfigStep5,
} from '@/services/file/wizzard/comble/step5Service';
import { ElLoading } from 'element-plus';
import { QuotationGenerator } from '@/services/pdf/quotationGenerator';
import { WorksheetGenerator } from '@/services/pdf/worksheetGenerator';
import { CombleFile } from '@/types/v2/File/Comble/CombleFile';

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
                                  name:       'file-comble-edit',
                                  components: {
                                    FileCombleStep3,
                                    FileCombleStep5,
                                    FileCombleStep4,
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
                                    const stepForm         = ref();
                                    const currentStepIndex = ref( 0 );
                                    // Récupération des données du fichier JSON
                                    const fileData         = getCurrentCombleFileData();
                                    const lists            = fileData.lists;
                                    const products         = fileData.quotation.products;
                                    const selectedProducts = fileData.quotation.selectedProducts;
                                    const options          = fileData.quotation.options;
                                    const blankOptions     = fileData.quotation.blankOptions;
                                    const area             = ref<number>( fileData.housing.area );
                                    const assents          = ref<Assent[]>( [] );
                                    const formData         = ref<CombleFileStep>( {
                                                                                       ...initFormDataStep1And2(
                                                                                           fileData.assents,
                                                                                           fileData.beneficiary ),
                                                                                       ...initCombleFormDataStep3(
                                                                                           fileData ),
                                                                                       ...initCombleFormDataStep4(
                                                                                           fileData ),
                                                                                       ...initCombleFormDataStep5(
                                                                                           fileData.worksheet ),
                                                                                     } );
                                    const nbAssent            = formData.value?.assents.length;
                                    // Configuration de la validation du formulaire
                                    const createAccountSchema = [
                                      yupConfigStep1(),
                                      yupConfigStep2(),
                                      yupCombleConfigStep3(),
                                      yupCombleConfigStep4(),
                                      yupCombleConfigStep5(),
                                    ];

                                    // --------------------- Début config du Wizzard et du formulaire--------------------------
                                    const currentSchema   = computed( () => {
                                      return createAccountSchema[ currentStepIndex.value ];
                                    } );
                                    // const { resetForm, handleSubmit } = useForm<Step1 | Step2 | BaseStep3 | BaseStep4>(
                                    const {
                                            resetForm,
                                            handleSubmit,
                                          }               = useForm<Step1 | Step2 | CombleStep3 | BaseStep4 | CombleStep5>(
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


                                        const response = await validateStepOne( formData.value, fileData.assents );
                                        assents.value  = response.assents;
                                        formData.value = response.formData;
                                        // Force le refersh des data du formulaire
                                        refreshFormData();
                                      } else if ( currentStepIndex.value === 1 ) {
                                        console.log( '%c Validation de l\'étape 1',
                                                     'background: #FF7CA7; color: #000000' );
                                        console.log( formData.value );
                                        await validateStepTwo( formData.value );
                                      } else if ( currentStepIndex.value === 2 ) {
                                        console.log( '%c Validation step 3', 'background: #fdd835; color: #000000' );
                                        await validateCombleStep3( formData.value );
                                        area.value              = formData.value.area;
                                        forceRefreshStep4.value = !forceRefreshStep4.value;
                                      } else if ( currentStepIndex.value === 3 ) {
                                        console.log( '%c Validation step 4', 'background: #fdd835; color: #000000' );
                                        await validateCombleStep4( formData.value, price );
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

                                      const newFileData     = await validateCombleStep4( ( values as CombleFileStep ),
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

                                      const addressGenerator = new NewAddressGenerator( fileData.housing,
                                                                                        fileData.beneficiary );
                                      addressGenerator.generatePdf();
                                    } );

                                    const onGenerateWorksheet = handleSubmit( async ( values ) => {
                                      console.log( '%c ON GENERATE Worksheet', 'background: #00FFCD; color: #000000' );
                                      console.log( values );
                                      console.log( '%c ', 'background: #fdd835; color: #000000' );
                                      console.log( '%c ', 'background: #fdd835; color: #000000' );
                                      console.log( '%c ', 'background: #fdd835; color: #000000' );
                                      console.log( formData.value );

                                      const newFileData: CombleFile = saveCombleWorksheet( ( values as CombleFileStep ) );
                                      const worksheetGenerator      = new WorksheetGenerator( newFileData );
                                      worksheetGenerator.generatePdf();
                                    } );

                                    const onCalculedPrice = ( newPrice: Price ) => {
                                      price = newPrice;
                                    };

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
                                      area,
                                      stepForm,
                                      fileData,
                                    };
                                  },

                                } );
</script>
