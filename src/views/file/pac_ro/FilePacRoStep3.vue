<template>
  <div class="w-100">
    <div class="pb-10 pb-lg-15">
      <h2 class="fw-bolder text-dark">Informations du logement</h2>
    </div>

    <step3-housing :lists="lists"></step3-housing>

    <div class="row mb-10">
      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Hauteur sous plafond</label>
        <Field
            type="number"
            class="form-control"
            name="housingCeilingHeight"
            placeholder="2.5"
            value=""
        />
        <ErrorMessage
            name="housingCeilingHeight"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>
      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Coefficient de construction</label>
        <Field
            name="housingBuildingCoefficient"
            as="select"
            class="form-control"
        >
          <item-list :lists="lists.buildingCoefficientList"></item-list>
        </Field>
        <ErrorMessage
            name="housingBuildingCoefficient"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>

      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Tension disponible</label>
        <Field
            name="housingAvailableVoltage"
            as="select"
            class="form-control"
        >
          <item-list :lists="lists.tensionDisponibleList"></item-list>
        </Field>
        <ErrorMessage
            name="housingAvailableVoltage"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>

      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Température de consigne</label>
        <Field
            name="housingSetPointTemperature"
            as="select"
            class="form-control"
        >
          <item-list :lists="lists.setPointTemperatureList"></item-list>
        </Field>
        <ErrorMessage
            name="housingSetPointTemperature"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>

      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Zone climatique</label>
        <Field
            name="housingClimaticZone"
            as="select"
            class="form-control"
        >
          <item-list :lists="lists.climaticZoneList"></item-list>
        </Field>
        <ErrorMessage
            name="housingClimaticZone"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>

      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Altitude</label>
        <Field
            name="housingAltitude"
            as="select"
            class="form-control"
        >
          <item-list :lists="lists.altitudeList"></item-list>
        </Field>
        <ErrorMessage
            name="housingAltitude"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>

      <div class="col-md-4 fv-row">
        <label class="form-label mb-3">Radiateurs</label>
        <Field
            name="housingHeaters"
            as="select"
            class="form-control"
        >
          <item-list :lists="lists.heatersList"></item-list>
        </Field>
        <ErrorMessage
            name="housingHeaters"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>

    </div>

    <input-area></input-area>

    <step3-address :lists="lists" :file-data="fileData"></step3-address>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import ItemList from '@/components/DCI/input/ItemList.vue';
import Step3Housing from '@/components/DCI/wizzard-file/Step3Housing.vue';
import Step3Address from '@/components/DCI/wizzard-file/Step3Address.vue';
import InputArea from '@/components/DCI/input/Area.vue';
import RoList from '@/types/v2/File/Ro/RoList';
import { RoFile } from '@/types/v2/File/Ro/RoFile';

export default defineComponent( {
                                  name:       'file-pac-ro-step-3',
                                  components: {
                                    InputArea,
                                    Step3Address,
                                    ItemList,
                                    Step3Housing,
                                    Field,
                                    ErrorMessage,
                                  },
                                  props:      {
                                    lists:    Object as () => RoList,
                                    fileData: {
                                      type:     Object as () => RoFile,
                                      required: true,
                                    },
                                  },
                                } );
</script>
