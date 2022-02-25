<template>
  <div class="w-100">

    <template v-if="assents.length > 0">
      <template v-for="(assent, index) in assents" v-bind:key="'assent_'+index">
        <el-descriptions
            class="mb-15"
            title="Avis Imposition"
            :column="2"
            size="large"
            border
        >
          <el-descriptions-item label="N° Fiscal">{{ assent.datagouv.numFiscal }}</el-descriptions-item>
          <el-descriptions-item label="Référence Avis">{{ assent.datagouv.refAvis }}</el-descriptions-item>
          <el-descriptions-item label="Nom">{{ assent.datagouv.nom }}</el-descriptions-item>
          <el-descriptions-item label="Prénom">{{ assent.datagouv.prenom }}</el-descriptions-item>
          <el-descriptions-item label="Adresse">{{ assent.datagouv.adresse }}</el-descriptions-item>
          <el-descriptions-item label="Ville">{{ assent.datagouv.ville }}</el-descriptions-item>
          <el-descriptions-item label="Revenus référence">{{ assent.datagouv.revenu }}</el-descriptions-item>
        </el-descriptions>

        <div class="pb-10 pb-lg-15">
          <h2 class="fw-bolder text-dark">Informations client</h2>
        </div>

        <div class="row mb-15">
          <div class="col-md-2 fv-row">
            <label class="form-label mb-3">Civilité</label>
            <Field
                :name="`assentsDatas[${index}].civility`"
                as="select"
                class="form-control form-control-lg form-control-solid"
            >
              <option value="m">Monsieur</option>
              <option value="f">Madame</option>
            </Field>
            <ErrorMessage
                :name="`assentsDatas[${index}].civility`"
                class="fv-plugins-message-container invalid-feedback"
            ></ErrorMessage>
          </div>

          <div class="col-md-5 fv-row">
            <label class="form-label mb-3">Nom</label>
            <Field
                type="text"
                class="form-control form-control-lg form-control-solid"
                :name="`assentsDatas[${index}].lastName`"
                placeholder="Nom"
                value=""
            />
            <ErrorMessage
                :name="`assentsDatas[${index}].lastName`"
                class="fv-plugins-message-container invalid-feedback"
            ></ErrorMessage>
          </div>

          <div class="col-md-5 fv-row">
            <label class="form-label mb-3">Prénom</label>
            <Field
                type="text"
                class="form-control form-control-lg form-control-solid"
                :name="`assentsDatas[${index}].firstName`"
                placeholder="Prénom"
                value=""
            />
            <ErrorMessage
                :name="`assentsDatas[${index}].firstName`"
                class="fv-plugins-message-container invalid-feedback"
            ></ErrorMessage>
          </div>
        </div>
        <div class="row mb-15">
          <div class="col-md-8 fv-row">
            <label class="form-label mb-3">Adresse</label>
            <Field
                type="text"
                class="form-control form-control-lg form-control-solid"
                :name="`assentsDatas[${index}].address`"
                placeholder="Adresse"
                value=""
            />
            <ErrorMessage
                :name="`assentsDatas[${index}].address`"
                class="fv-plugins-message-container invalid-feedback"
            ></ErrorMessage>
          </div>
          <div class="col-md-4 fv-row">
            <label class="form-label mb-3">Code Postal</label>
            <Field
                type="text"
                class="form-control form-control-lg form-control-solid"
                :name="`assentsDatas[${index}].zipCode`"
                placeholder="Code Postal"
                value=""
            />
            <ErrorMessage
                :name="`assentsDatas[${index}].zipCode`"
                class="fv-plugins-message-container invalid-feedback"
            ></ErrorMessage>
          </div>
        </div>
        <div class="row mb-15">
          <div class="col-md-8 fv-row">
            <label class="form-label mb-3">Ville</label>
            <Field
                type="text"
                class="form-control form-control-lg form-control-solid"
                :name="`assentsDatas[${index}].city`"
                placeholder="Ville"
                value=""
            />
            <ErrorMessage
                :name="`assentsDatas[${index}].city`"
                class="fv-plugins-message-container invalid-feedback"
            ></ErrorMessage>
          </div>

          <div class="col-md-4 fv-row">
            <label class="form-label mb-3">Revenu</label>
            <Field
                type="number"
                class="form-control form-control-lg form-control-solid"
                :name="`assentsDatas[${index}].income`"
                placeholder="0"
                value=""
            />
            <ErrorMessage
                :name="`assentsDatas[${index}].income`"
                class="fv-plugins-message-container invalid-feedback"
            ></ErrorMessage>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <label class="form-label mb-3">Est bénéficiaire</label>
            <Field name="indexBeneficiary" type="radio" :value="index" class="form-check-input ms-5"></Field>
          </div>
        </div>

        <el-divider class="mb-15">
          <i class="fa fa-user"></i>
        </el-divider>
      </template>
    </template>

    <template v-else>
      <div class="pb-10 pb-lg-15">
        <h2 class="fw-bolder text-dark">Informations client</h2>
      </div>

      <div class="row mb-15">
        <div class="col-md-2 fv-row">
          <label class="form-label mb-3">Civilité</label>
          <Field
              :name="`assentsDatas[0].civility`"
              as="select"
              class="form-control form-control-lg form-control-solid"
          >
            <option value="m">Monsieur</option>
            <option value="f">Madame</option>
          </Field>
          <ErrorMessage
              :name="`assentsDatas[0].civility`"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>

        <div class="col-md-5 fv-row">
          <label class="form-label mb-3">Nom</label>
          <Field
              type="text"
              class="form-control form-control-lg form-control-solid"
              :name="`assentsDatas[0].lastName`"
              placeholder="Nom"
              value=""
          />
          <ErrorMessage
              :name="`assentsDatas[0].lastName`"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>

        <div class="col-md-5 fv-row">
          <label class="form-label mb-3">Prénom</label>
          <Field
              type="text"
              class="form-control form-control-lg form-control-solid"
              :name="`assentsDatas[0].firstName`"
              placeholder="Prénom"
              value=""
          />
          <ErrorMessage
              :name="`assentsDatas[0].firstName`"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
      </div>
      <div class="row mb-15">
        <div class="col-md-8 fv-row">
          <label class="form-label mb-3">Adresse</label>
          <Field
              type="text"
              class="form-control form-control-lg form-control-solid"
              :name="`assentsDatas[0].address`"
              placeholder="Adresse"
              value=""
          />
          <ErrorMessage
              :name="`assentsDatas[0].address`"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
        <div class="col-md-4 fv-row">
          <label class="form-label mb-3">Code Postal</label>
          <Field
              type="text"
              class="form-control form-control-lg form-control-solid"
              :name="`assentsDatas[0].zipCode`"
              placeholder="Code Postal"
              value=""
          />
          <ErrorMessage
              :name="`assentsDatas[0].zipCode`"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
      </div>
      <div class="row mb-15">
        <div class="col-md-8 fv-row">
          <label class="form-label mb-3">Ville</label>
          <Field
              type="text"
              class="form-control form-control-lg form-control-solid"
              :name="`assentsDatas[0].city`"
              placeholder="Ville"
              value=""
          />
          <ErrorMessage
              :name="`assentsDatas[0].city`"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>

        <div class="col-md-4 fv-row">
          <label class="form-label mb-3">Revenu</label>
          <Field
              type="number"
              class="form-control form-control-lg form-control-solid"
              :name="`assentsDatas[0].income`"
              placeholder="0"
              value=""
          />
          <ErrorMessage
              :name="`assentsDatas[0].income`"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
      </div>

      <div class="row mb-15">
        <div class="col-md-4">
          <label class="form-label mb-3">Est bénéficiaire</label>
          <Field name="indexBeneficiary" type="radio" :value="0" class="form-check-input ms-5"></Field>
        </div>
      </div>
    </template>

    <div class="pb-10 pb-lg-15">
      <h2 class="fw-bolder text-dark">Informations complémentaires</h2>
    </div>

    <div class="row mb-15">
      <div class="col-md-6 fv-row">
        <label class="form-label mb-3">E-mail</label>
        <Field
            type="text"
            class="form-control form-control-lg form-control-solid"
            name="email"
            placeholder="E-mail"
            value=""
        />
        <ErrorMessage
            name="email"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>
    </div>

    <div class="row mb-15">
      <div class="col-md-6 fv-row">
        <label class="form-label mb-3">Téléphone</label>
        <Field
            type="text"
            class="form-control form-control-lg form-control-solid"
            name="phone"
            placeholder="0200000000"
            value=""
        />
        <ErrorMessage
            name="phone"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>

      <div class="col-md-6 fv-row">
        <label class="form-label mb-3">Potable</label>
        <Field
            type="text"
            class="form-control form-control-lg form-control-solid"
            name="mobile"
            placeholder="0600000000"
            value=""
        />
        <ErrorMessage
            name="mobile"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import { Assent } from '@/types/v2/File/Common/Assent';

export default defineComponent( {
                                  name:       'common-step-2',
                                  components: {
                                    Field,
                                    ErrorMessage,
                                  },
                                  props:      {
                                    assents: Array,
                                  },
                                  setup() {
                                    const copyAssentToForm = ( assent: Assent ) => {
                                      console.log( assent );
                                    };

                                    return {
                                      copyAssentToForm,
                                    };
                                  },
                                } );
</script>
