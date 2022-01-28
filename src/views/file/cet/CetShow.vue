<template>
  <!--begin::Card-->
  <div class="card">
    <!--begin::Card body-->
    <div class="card-body">
      <!--begin::Stepper-->
      <div
          class="stepper stepper-links d-flex flex-column"
          id="kt_create_account_stepper"
          ref="horizontalWizardRef"
      >
        <!--begin::Nav-->
        <div class="stepper-nav py-5 mt-5">
          <!--begin::Step 1-->
          <div class="stepper-item current" data-kt-stepper-element="nav">
            <h3 class="stepper-title">
              Avis
            </h3>
          </div>
          <!--end::Step 1-->

          <!--begin::Step 2-->
          <div class="stepper-item" data-kt-stepper-element="nav">
            <h3 class="stepper-title">
              Client
            </h3>
          </div>
          <!--end::Step 2-->

          <!--begin::Step 3-->
          <div class="stepper-item" data-kt-stepper-element="nav">
            <h3 class="stepper-title">
              Logement
            </h3>
          </div>
          <!--end::Step 3-->

          <!--begin::Step 4-->
          <div class="stepper-item" data-kt-stepper-element="nav">
            <h3 class="stepper-title">
              Devis
            </h3>
          </div>
          <!--end::Step 4-->

          <!--begin::Step 5-->
          <div class="stepper-item" data-kt-stepper-element="nav">
            <h3 class="stepper-title">
              Fiche
            </h3>
          </div>
          <!--end::Step 5-->
        </div>
        <!--end::Nav-->

        <!--begin::Form-->
        <form
            class="mx-auto mw-600px w-100 pt-15 pb-10"
            novalidate="novalidate"
            id="kt_create_account_form"
            @submit="handleStep"
        >
          <!--begin::Step 1-->
          <div class="current" data-kt-stepper-element="content">
            <Step1></Step1>
          </div>
          <!--end::Step 1-->

          <!--begin::Step 2-->
          <div data-kt-stepper-element="content">
            <Step2></Step2>
          </div>
          <!--end::Step 2-->

          <!--begin::Step 3-->
          <div data-kt-stepper-element="content">
            <Step3></Step3>
          </div>
          <!--end::Step 3-->

          <!--begin::Step 4-->
          <div data-kt-stepper-element="content">
            <Step4></Step4>
          </div>
          <!--end::Step 4-->

          <!--begin::Step 5-->
          <div data-kt-stepper-element="content">
            <Step5></Step5>
          </div>
          <!--end::Step 5-->

          <!--begin::Actions-->
          <div class="d-flex flex-stack pt-15">
            <!--begin::Wrapper-->
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
            <!--end::Wrapper-->

            <!--begin::Wrapper-->
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
            <!--end::Wrapper-->
          </div>
          <!--end::Actions-->
        </form>
        <!--end::Form-->
      </div>
      <!--end::Stepper-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import Step5 from '@/views/file/cet/steps/Step5.vue';
import Step4 from '@/views/file/cet/steps/Step4.vue';
import Step3 from '@/views/file/cet/steps/Step3.vue';
import Step2 from '@/views/file/cet/steps/Step2.vue';
import Step1 from '@/views/file/cet/steps/Step1.vue';
import Swal from 'sweetalert2/dist/sweetalert2.min.js';
import { StepperComponent } from '@/assets/ts/components';
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb';
import * as Yup from 'yup';
import { useForm } from 'vee-validate';


interface Step1 {
  assents: [ {
    numFiscal: string;
    refAvis: string;
  } ];
}

interface Step2 {
  accountTeamSize: string;
  accountName: string;
  accountPlan: string;
}

interface Step3 {
  businessName: string;
  businessDescriptor: string;
  businessType: string;
  businessDescription: string;
  businessEmail: string;
}

interface Step4 {
  nameOnCard: string;
  cardNumber: string;
  cardExpiryMonth: string;
  cardExpiryYear: string;
  cardCvv: string;
  saveCard: string;
}

interface CreateAccount extends Step1, Step2, Step3, Step4 {}

export default defineComponent( {
                                  name:       'cet-show',
                                  components: { Step1, Step2, Step3, Step4, Step5 },
                                  // setup() {
                                  //   const route     = useRoute();
                                  //   const folderRef = route.query.reference;
                                  //
                                  //   return {
                                  //     folderRef,
                                  //   };
                                  // },
                                  setup() {
                                    const _stepperObj         = ref<StepperComponent | null>( null );
                                    const horizontalWizardRef = ref<HTMLElement | null>( null );
                                    const currentStepIndex    = ref( 0 );

                                    const formData = ref<CreateAccount>( {
                                                                           assents:             [ {
                                                                             numFiscal: '',
                                                                             refAvis:   '',
                                                                           } ],
                                                                           accountTeamSize:     '50+',
                                                                           accountName:         '',
                                                                           accountPlan:         '1',
                                                                           businessName:        'Keenthemes Inc.',
                                                                           businessDescriptor:  'KEENTHEMES',
                                                                           businessType:        '1',
                                                                           businessDescription: '',
                                                                           businessEmail:       'corp@support.com',
                                                                           nameOnCard:          'Max Doe',
                                                                           cardNumber:          '4111 1111 1111 1111',
                                                                           cardExpiryMonth:     '1',
                                                                           cardExpiryYear:      '2',
                                                                           cardCvv:             '123',
                                                                           saveCard:            '1',
                                                                         } );

                                    onMounted( () => {
                                      _stepperObj.value = StepperComponent.createInsance(
                                          horizontalWizardRef.value as HTMLElement,
                                      );

                                      setCurrentPageBreadcrumbs( 'Horizontal', [ 'Pages', 'Wizards' ] );
                                    } );

                                    const createAccountSchema = [
                                      // STEP A
                                      Yup.object( {
                                                    assents: Yup.array()
                                                                .of(
                                                                    Yup.object().shape( {
                                                                                          numFiscal: Yup.string(),
                                                                                          refAvis:   Yup.string(),
                                                                                        } ),
                                                                ),
                                                  } ),

                                      // Step 2
                                      Yup.object( {
                                                    accountName: Yup.string()
                                                                    .required()
                                                                    .label( 'Account Name' ),
                                                  } ),
                                      Yup.object( {
                                                    businessName:       Yup.string()
                                                                           .required()
                                                                           .label( 'Business Name' ),
                                                    businessDescriptor: Yup.string()
                                                                           .required()
                                                                           .label( 'Shortened Descriptor' ),
                                                    businessType:       Yup.string()
                                                                           .required()
                                                                           .label( 'Corporation Type' ),
                                                    businessEmail:      Yup.string()
                                                                           .required()
                                                                           .label( 'Contact Email' ),
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

                                    const handleStep = handleSubmit( values => {
                                      console.log( values );
                                      console.log( 'Ancien step -->', currentStepIndex.value );

                                      formData.value = {
                                        ...formData.value,
                                        ...values,
                                      };

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
                                    };
                                  },

                                } );
</script>
