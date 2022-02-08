<template>
  <div class="w-100">
    <div class="pb-10 pb-lg-15">
      <h2 class="fw-bolder text-dark">Informations logement</h2>
    </div>

    <div class="row mb-15">
      <div class="col-md-4 fv-row">
        <label class="form-label mb-3">Nombre d'occupant</label>
        <Field
            type="number"
            class="form-control form-control-lg form-control-solid"
            name="nbOccupant"
            placeholder="1"
            value=""
        />
        <ErrorMessage
            name="nbOccupant"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>

      <div class="col-md-4 fv-row">
        <label class="form-label mb-3">Type de logement</label>
        <Field
            name="housingType"
            as="select"
            class="form-control form-control-lg form-control-solid"
        >
          <option value="maison_individuelle">Maison individuelle</option>
          <option value="appartement">Appartement</option>
        </Field>
        <ErrorMessage
            name="housingType"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>

      <div class="col-md-4 fv-row">
        <label class="form-label mb-3">Qualité d'isolation</label>
        <Field
            name="housingInsulationQuality"
            as="select"
            class="form-control form-control-lg form-control-solid"
        >
          <option :value="0.6">0.6</option>
          <option :value="0.65">0.65</option>
          <option :value="0.8">0.8</option>
          <option :value="1">1</option>
        </Field>
        <ErrorMessage
            name="housingInsulationQuality"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>
    </div>
    <div class="row mb-15">
      <div class="col-md-4 fv-row">
        <label class="form-label mb-3">Tension disponible</label>
        <Field
            name="housingAvailableVoltage"
            as="select"
            class="form-control form-control-lg form-control-solid"
        >
          <option value="monophase">Monophasé</option>
          <option value="triphase">Triphasé</option>
        </Field>
        <ErrorMessage
            name="housingAvailableVoltage"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>

      <div class="col-md-5 fv-row">
        <label class="form-label mb-3">Année de construction</label>
        <Field
            type="number"
            class="form-control form-control-lg form-control-solid"
            name="housingConstructionYear"
            placeholder="1850"
            value=""
        />
        <ErrorMessage
            name="housingConstructionYear"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>

    </div>

    <!--    TODO faire la logique-->
    <div class="row mb-15">
      <div class="col-md-4">
        <label class="form-label mb-3">Ce logement à moins de 2 ans</label>
        <Field name="housingLessThan2Years" type="checkbox" class="form-check-input ms-5"></Field>
      </div>
    </div>

    <div class="pb-10 pb-lg-15">
      <h2 class="fw-bolder text-dark">Géolocalisation & superficie</h2>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';

export default defineComponent( {
                                  name:       'step-3',
                                  components: {
                                    Field,
                                    ErrorMessage,
                                  },
                                } );
</script>
