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
          <option-list :lists="lists.localTypeList"></option-list>
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
          <option-list :lists="lists.qualiteIsolationList"></option-list>
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
          <option-list :lists="lists.tensionDisponibleList"></option-list>
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

    <div class="row mb-15">
      <label
          class="form-check form-switch form-check-custom form-check-solid"
      >
        <Field
            type="checkbox"
            class="form-check-input"
            name="housingLessThan2Years"
            :value="true"
        />
        <span class="form-check-label fw-bold text-gray-400">
            Ce logement à moins de 2 ans
          </span>
      </label>
    </div>

    <div class="pb-10 pb-lg-15">
      <h2 class="fw-bolder text-dark">Géolocalisation & superficie</h2>
    </div>

    <div class="row mb-15">
      <label
          class="form-check form-switch form-check-custom form-check-solid"
      >
        <Field
            type="checkbox"
            class="form-check-input"
            name="housingIsAddressBenef"
            :value="true"
        />
        <span class="form-check-label fw-bold text-gray-400">
            L'adresse du logement est la même que le bénéficiaire
          </span>
      </label>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import OptionList from '@/components/DCI/input/OptionList.vue';

export default defineComponent( {
                                  name:       'common-step-3',
                                  components: {
                                    OptionList,
                                    Field,
                                    ErrorMessage,
                                  },
                                  props:      {
                                    lists: Object,
                                  },
                                  setup( props ) {
                                    console.log( '%c SET UP', 'background: #fdd835; color: #000000' );
                                    console.log( 'Assent -->', props.lists );

                                  },
                                } );
</script>
