<template>
  <div class="w-100">
    <div class="pb-10 pb-lg-15">
      <h2 class="fw-bolder text-dark">Informations client</h2>
    </div>

    <div class="row mb-15">
      <div class="col-md-4 fv-row">
        <label class="form-label mb-3">Civilité</label>
        <Field
            type="text"
            as="select"
            class="form-control form-control-lg form-control-solid"
            name="civility"
            placeholder="Civilité"
            value="">
          <option value="m">Monsieur</option>
          <option value="f">Madame</option>
        </Field>
        <ErrorMessage
            name="civility"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>

      <div class="col-md-4 fv-row">
        <label class="form-label mb-3">Nom</label>
        <Field
            type="text"
            class="form-control form-control-lg form-control-solid"
            name="lastName"
            placeholder="Nom"
            value=""
        />
        <ErrorMessage
            name="lastName"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>

      <div class="col-md-4 fv-row">
        <label class="form-label mb-3">Prénom</label>
        <Field
            type="text"
            class="form-control form-control-lg form-control-solid"
            name="firstName"
            placeholder="Prénom"
            value=""
        />
        <ErrorMessage
            name="firstName"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>
    </div>
    <div class="row mb-15">
      <div class="col-md-12 fv-row">
        <label class="form-label mb-3">Adresse</label>
        <Field
            type="text"
            class="form-control form-control-lg form-control-solid"
            name="address"
            placeholder="Adresse"
            value=""
        />
        <ErrorMessage
            name="address"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>
    </div>
    <div class="row mb-15">
      <div class="col-md-4 fv-row">
        <label class="form-label mb-3">Code Postal</label>
        <Field
            type="text"
            class="form-control form-control-lg form-control-solid"
            name="zipCode"
            placeholder="Code Postal"
            value=""
        />
        <ErrorMessage
            name="zipCode"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>

      <div class="col-md-8 fv-row">
        <label class="form-label mb-3">Ville</label>
        <Field
            type="text"
            class="form-control form-control-lg form-control-solid"
            name="city"
            placeholder="Ville"
            value=""
        />
        <ErrorMessage
            name="city"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>
    </div>
    <div class="row mb-15">
      <div class="col-md-6 fv-row">
        <label class="form-label mb-3">Revenu</label>
        <Field
            type="number"
            class="form-control form-control-lg form-control-solid"
            name="income"
            placeholder="0"
            value=""
        />
        <ErrorMessage
            name="income"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>
    </div>

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

export default defineComponent( {
                                  name:       'step-2',
                                  components: {
                                    Field,
                                    ErrorMessage,
                                  },
                                } );
</script>
