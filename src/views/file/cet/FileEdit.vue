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
            <CommonStep3 :lists="lists"></CommonStep3>
          </div>
          <!--end::Step 3-->

          <!--begin::Step 4-->
          <div data-kt-stepper-element="content">
            <CommonStep4></CommonStep4>
          </div>
          <!--end::Step 4-->

          <!--begin::Step 5-->
          <div data-kt-stepper-element="content">
            <CommonStep5></CommonStep5>
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
              <button
                  type="button"
                  class="btn btn-lg btn-primary me-3"
                  data-kt-stepper-action="submit"
                  v-if="currentStepIndex === totalSteps - 1"
                  @click="formSubmit()"
              >
                <span class="indicator-label">
                  Submit
                  <span class="svg-icon svg-icon-3 ms-2 me-0">
                    <i class="fa-arrow-right"></i>
                  </span>
                </span>
                <span class="indicator-progress">
                  Please wait...
                  <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                  ></span>
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
import * as Yup from 'yup';
import { setLocale } from 'yup';
import { useForm } from 'vee-validate';
import {
  getCurrentFileData,
  getCurrentFileReference,
  getcurrentFolderName,
  resetCurrentFileData,
  updateBeneficiary,
  updateHousing,
} from '@/services/data/dataService';
import { Assent } from '@/types/v2/File/Common/Assent';
import { AssentForm } from '@/types/v2/Wizzard/AssentForm';
import { AssentDataForm } from '@/types/v2/Wizzard/AssentDataForm';
import { FileStep } from '@/types/v2/Wizzard/FileStep';
import CommonStep1 from '@/views/file/wizzard/steps/CommonStep1.vue';
import CommonStep2 from '@/views/file/wizzard/steps/CommonStep2.vue';
import CommonStep3 from '@/views/file/wizzard/steps/CommonStep3.vue';
import CommonStep4 from '@/views/file/wizzard/steps/CommonStep4.vue';
import CommonStep5 from '@/views/file/wizzard/steps/CommonStep5.vue';
import { Step1 } from '@/types/v2/Wizzard/Step1';
import { Step2 } from '@/types/v2/Wizzard/Step2';
import { Step3 } from '@/types/v2/Wizzard/Step3';
import { Step4 } from '@/types/v2/Wizzard/Step4';
import WizzardFileHeader from '@/components/DCI/wizzard-file/Header.vue';
import { validateStepOne } from '@/services/file/wizzard/steap1Service';

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
                                    WizzardFileHeader,
                                    CommonStep5,
                                    CommonStep4,
                                    CommonStep3,
                                    CommonStep2,
                                    CommonStep1,
                                  },
                                  setup() {
                                    onUnmounted( () => {
                                      console.log( '%c UN MOUNTED', 'background: #fdd835; color: #000000' );
                                      // Remove les données sauvgardé en mémoire quand on quitte la page
                                      resetCurrentFileData();
                                    } );
                                    console.log( getcurrentFolderName() );
                                    console.log( getCurrentFileReference() );
                                    console.log( getCurrentFileData() );
                                    const _stepperObj         = ref<StepperComponent | null>( null );
                                    const horizontalWizardRef = ref<HTMLElement | null>( null );
                                    const currentStepIndex    = ref( 0 );


                                    const fileData = getCurrentFileData();
                                    console.log( 'FILE DATA -->', fileData );
                                    const lists = fileData.lists;


                                    const assents = ref<Assent[]>( [] );

                                    const defaultAssents: AssentForm[]          = [];
                                    const defaultAssentsDatas: AssentDataForm[] = [];
                                    let defaultIndexBeneficiary                 = 0;

                                    console.log( fileData.assents );
                                    let index = 0;
                                    for ( const assent of fileData.assents ) {

                                      console.log( 'index', index );
                                      console.log( 'assent', assent );
                                      if ( assent.isBeneficiary ) {
                                        defaultIndexBeneficiary = index;
                                      }
                                      defaultAssents.push( {
                                                             numFiscal: assent.numFiscal,
                                                             refAvis:   assent.refAvis,
                                                           } );

                                      defaultAssentsDatas.push( {
                                                                  civility:  assent.civility,
                                                                  lastName:  assent.nom,
                                                                  firstName: assent.prenom,
                                                                  address:   assent.adresse,
                                                                  zipCode:   assent.codepostal,
                                                                  city:      assent.ville,
                                                                  income:    assent.revenu,
                                                                } );

                                      index++;
                                    }

                                    if ( fileData.assents.length === 0 ) {
                                      defaultAssentsDatas.push( {
                                                                  civility:  fileData.beneficiary.civility,
                                                                  lastName:  fileData.beneficiary.lastName,
                                                                  firstName: fileData.beneficiary.firstName,
                                                                  address:   fileData.beneficiary.address,
                                                                  zipCode:   fileData.beneficiary.zipCode,
                                                                  city:      fileData.beneficiary.city,
                                                                  income:    fileData.beneficiary.income,
                                                                } );
                                    }

                                    console.log( '%c ', 'background: #fdd8f0; color: #000000' );
                                    console.log( fileData.assents );
                                    console.log( defaultAssents );
                                    console.log( defaultAssentsDatas );
                                    console.log( '%c ', 'background: #fdd8f0; color: #000000' );

                                    const nbAssent = defaultAssents.length;

                                    const formData = ref<FileStep>( {
                                                                      assents:                  defaultAssents,
                                                                      assentsDatas:             defaultAssentsDatas,
                                                                      email:                    fileData.beneficiary.email,
                                                                      phone:                    fileData.beneficiary.phone,
                                                                      mobile:                   fileData.beneficiary.mobile,
                                                                      indexBeneficiary:         defaultIndexBeneficiary,
                                                                      nbOccupant:               fileData.housing.nbOccupant,
                                                                      housingType:              fileData.housing.type,
                                                                      housingInsulationQuality: fileData.housing.insulationQuality,
                                                                      housingAvailableVoltage:  fileData.housing.availableVoltage,
                                                                      housingConstructionYear:  fileData.housing.constructionYear,
                                                                      housingLessThan2Years:    fileData.housing.lessThan2Years,
                                                                      housingIsAddressBenef:    fileData.housing.isAddressBenef,
                                                                      nameOnCard:               'Max Doe',
                                                                      cardNumber:               '4111 1111 1111 1111',
                                                                      cardExpiryMonth:          '1',
                                                                      cardExpiryYear:           '2',
                                                                      cardCvv:                  '123',
                                                                      saveCard:                 '1',
                                                                    } );

                                    onMounted( () => {
                                      _stepperObj.value = StepperComponent.createInsance(
                                          horizontalWizardRef.value as HTMLElement,
                                      );

                                      setCurrentPageBreadcrumbs( 'Horizontal', [ 'Pages', 'Wizards' ] );
                                    } );

                                    const createAccountSchema = [
                                      // STEP 1
                                      Yup.object( {
                                                    assents: Yup.array()
                                                                .of(
                                                                    Yup.object().shape( {
                                                                                          numFiscal: Yup.string()
                                                                                                        .matches(
                                                                                                            /^[0-9a-zA-Z]{13,14}$/m,
                                                                                                            {
                                                                                                              message:            'Le numéro est incorrect',
                                                                                                              excludeEmptyString: true,
                                                                                                            } ),
                                                                                          refAvis:   Yup.string()
                                                                                                        .matches(
                                                                                                            /^[0-9a-zA-Z]{13,14}$/m,
                                                                                                            {
                                                                                                              message:            'Le numéro est incorrect',
                                                                                                              excludeEmptyString: true,
                                                                                                            } ),
                                                                                        } ),
                                                                ),
                                                  } ),

                                      // Step 2
                                      Yup.object( {
                                                    assentsDatas:     Yup.array()
                                                                         .of(
                                                                             Yup.object().shape( {
                                                                                                   civility:  Yup.string()
                                                                                                                 .required(),
                                                                                                   lastName:  Yup.string()
                                                                                                                 .required(),
                                                                                                   firstName: Yup.string()
                                                                                                                 .required(),
                                                                                                   address:   Yup.string()
                                                                                                                 .required(),
                                                                                                   zipCode:   Yup.string()
                                                                                                                 .matches(
                                                                                                                     /^([0-8][0-9]|9[0-5])[0-9]{3}/,
                                                                                                                     {
                                                                                                                       message: 'Le code postal est incorrect',
                                                                                                                     } )
                                                                                                                 .required(),
                                                                                                   city:      Yup.string()
                                                                                                                 .required(),
                                                                                                   income:    Yup.number()
                                                                                                                 .required()
                                                                                                                 .min( 1,
                                                                                                                       'Le revenu doit être supérieur à 0' ),
                                                                                                 } ),
                                                                         ),
                                                    indexBeneficiary: Yup.number().required(),
                                                    email:            Yup.string().required().email(),
                                                    phone:            Yup.string().matches(
                                                        /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/gm,
                                                        {
                                                          message:            'Le numéro est incorrect',
                                                          excludeEmptyString: true,
                                                        } ),
                                                    mobile:           Yup.string().matches(
                                                        /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/gm,
                                                        {
                                                          message:            'Le numéro est incorrect',
                                                          excludeEmptyString: true,
                                                        } ),
                                                  } ),

                                      // Step 3
                                      Yup.object( {
                                                    nbOccupant:               Yup.number().required(),
                                                    housingType:              Yup.string().required(),
                                                    housingInsulationQuality: Yup.number().required(),
                                                  } ),
                                      Yup.object( {
                                                    nameOnCard:      Yup.string()
                                                                        .required()
                                                                        .label( 'Name On Card' ),
                                                    cardNumber:      Yup.string()
                                                                        .required()
                                                                        .label( 'Card Number' ),
                                                    cardExpiryMonth: Yup.string()
                                                                        .required()
                                                                        .label( 'Expiration Month' ),
                                                    cardExpiryYear:  Yup.string()
                                                                        .required()
                                                                        .label( 'Expiration Year' ),
                                                    cardCvv:         Yup.string()
                                                                        .required()
                                                                        .label( 'CVV' ),
                                                  } ),
                                    ];

                                    const currentSchema = computed( () => {
                                      return createAccountSchema[ currentStepIndex.value ];
                                    } );

                                    const { resetForm, handleSubmit } = useForm<Step1 | Step2 | Step3 | Step4>( {
                                                                                                                  validationSchema: currentSchema,
                                                                                                                } );

                                    const refreshFormData = () => {
                                      resetForm( {
                                                   values: {
                                                     ...formData.value,
                                                   },
                                                 } );
                                    };

                                    const totalSteps = computed( () => {
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

                                    const validateStepTwo   = async ( data: FileStep ) => {
                                      updateBeneficiary( data );
                                    };
                                    const validateStepThree = async ( data: FileStep ) => {
                                      console.log( 'data-->', data );
                                      updateHousing( data );
                                    };

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
                                        console.log( '%c Validation step 2', 'background: #fdd835; color: #000000' );
                                        validateStepTwo( formData.value );
                                      } else if ( currentStepIndex.value === 2 ) {
                                        console.log( '%c Validation step 3', 'background: #fdd835; color: #000000' );
                                        validateStepThree( formData.value );
                                      }

                                      currentStepIndex.value++;

                                      if ( !_stepperObj.value ) {
                                        return;
                                      }

                                      _stepperObj.value.goNext();
                                    } );

                                    const previousStep = () => {
                                      if ( !_stepperObj.value ) {
                                        return;
                                      }

                                      currentStepIndex.value--;

                                      _stepperObj.value.goPrev();
                                    };

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

                                    return {
                                      horizontalWizardRef,
                                      previousStep,
                                      handleStep,
                                      formSubmit,
                                      totalSteps,
                                      currentStepIndex,
                                      assents,
                                      nbAssent,
                                      lists,
                                    };
                                  },

                                } );
</script>
