<template>
  <div
      class="modal fade"
      id="kt_modal_new_folder"
      tabindex="-1"
      aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <Form
            class="form"
            id="kt_modal_new_folder_form"
            @submit="submit"
            :validation-schema="validationSchema"
        >
          <div class="modal-header" id="kt_modal_new_folder_header">
            <h2>Créer un nouveau dossier</h2>
            <div
                class="btn btn-sm btn-icon btn-active-color-primary"
                data-bs-dismiss="modal"
            >
              <span class="svg-icon svg-icon-1">
                <inline-svg src="media/icons/duotone/Navigation/Close.svg" />
              </span>
            </div>
          </div>

          <div class="modal-body py-10 px-lg-17">
            <div
                class="scroll-y me-n7 pe-7"
                id="kt_modal_new_folder_scroll"
                data-kt-scroll="true"
                data-kt-scroll-activate="{default: false, lg: true}"
                data-kt-scroll-max-height="auto"
                data-kt-scroll-dependencies="#kt_modal_new_folder_header"
                data-kt-scroll-wrappers="#kt_modal_new_folder_scroll"
                data-kt-scroll-offset="300px"
            >
              <div class="row mb-10">
                <div class="col-md-6 fv-row">
                  <label class="required fs-5 fw-bold mb-2">Type de chantier</label>

                  <Field
                      name="type"
                      class="form-select form-select-solid"
                      as="select"
                      v-model="newFolderData.type"
                  >
                    <option value="">Sélectionner un chantier...</option>
                    <option value="comble">Comble</option>
                    <option value="sol">Sol</option>
                    <option value="c_rr">Chauffage RR</option>
                    <option value="c_ro">Chauffage RO</option>
                    <option value="ce">Chauffe eau</option>
                    <option value="poele">poele</option>
                  </Field>
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="type" />
                    </div>
                  </div>
                </div>

                <div class="col-md-6 fv-row">
                  <label class="required fs-5 fw-bold mb-2">Client</label>
                  <Field
                      type="text"
                      class="form-control form-control-solid"
                      placeholder="Nom Prénom"
                      name="customer"
                      v-model="newFolderData.customer"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="customer" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row mb-5">
                <div class="col-md-6 fv-row mb-5">
                  <label class="form-check form-check-custom form-check-solid">
                    <Field
                        name="bonus"
                        class="form-check-input"
                        v-model="newFolderData.disabledBonus"
                        type="checkbox"
                    />
                    <span class="form-check-label">Désactiver la prime</span>
                  </label>
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="bonus" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6 fv-row mb-5">
                  <label class="form-check form-check-custom form-check-solid">
                    <Field
                        name="ceeBonus"
                        class="form-check-input"
                        v-model="newFolderData.disabledCeeBonus"
                        type="checkbox"
                    />
                    <span class="form-check-label">Désactiver la prime CEE</span>
                  </label>
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="ceeBonus" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6 fv-row mb-5">
                  <label class="form-check form-check-custom form-check-solid">
                    <Field
                        name="housingAction"
                        class="form-check-input"
                        v-model="newFolderData.enabledHousingAction"
                        type="checkbox"
                    />
                    <span class="form-check-label">Activer action logement</span>
                  </label>
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="housingAction" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6 fv-row mb-5">
                  <label class="form-check form-check-custom form-check-solid">
                    <Field
                        name="maPrimeRenovBonus"
                        class="form-check-input"
                        v-model="newFolderData.disabledMaPrimeRenovBonus"
                        type="checkbox"
                    />
                    <span class="form-check-label">Désactiver MaPrimeRenov</span>
                  </label>
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="maPrimeRenovBonus" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer flex-center">
            <button
                type="reset"
                id="kt_modal_new_folder_cancel"
                class="btn btn-white me-3"
            >
              Annuler
            </button>

            <button
                ref="submitButtonRef"
                type="submit"
                id="kt_modal_new_folder_submit"
                class="btn btn-primary">
              <span class="indicator-label">
                Valider
              </span>
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ErrorMessage, Field, Form } from 'vee-validate';
import * as Yup from 'yup';
import router from '@/router';

interface NewFolderData {
  type: string;
  customer: string;
  disabledBonus: boolean;
  disabledCeeBonus: boolean;
  enabledHousingAction: boolean;
  disabledMaPrimeRenovBonus: boolean;
}

export default defineComponent( {
                                  name:       'new-folder-modal',
                                  components: {
                                    ErrorMessage,
                                    Field,
                                    Form,
                                  },
                                  setup() {
                                    const submitButtonRef = ref<null | HTMLButtonElement>( null );

                                    const newFolderData = ref<NewFolderData>( {
                                                                                type:                      '',
                                                                                customer:                  '',
                                                                                disabledBonus:             false,
                                                                                disabledCeeBonus:          false,
                                                                                enabledHousingAction:      false,
                                                                                disabledMaPrimeRenovBonus: false,
                                                                              } );

                                    const validationSchema = Yup.object().shape( {
                                                                                   type:     Yup.string()
                                                                                                .required()
                                                                                                .label( 'Type' ),
                                                                                   customer: Yup.string()
                                                                                                .required()
                                                                                                .label( 'Client' ),
                                                                                 } );

                                    const submit = () => {
                                      if ( !submitButtonRef.value ) {
                                        return;
                                      }

                                      //Disable button
                                      submitButtonRef.value.disabled = true;
                                      console.log( newFolderData.value );

                                      router.push( { name: 'folder_show', query: { slug: '79878797798789' } } );
                                    };

                                    return {
                                      newFolderData,
                                      validationSchema,
                                      submit,
                                      submitButtonRef,
                                    };
                                  },
                                } );
</script>
