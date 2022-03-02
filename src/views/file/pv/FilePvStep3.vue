<template>
  <div class="w-100">
    <div class="pb-10 pb-lg-15">
      <h2 class="fw-bolder text-dark">Informations du logement</h2>
    </div>

    <step3-housing :lists="lists"></step3-housing>

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

    <div class="row mb-15">
      <div class="col-md-4 fv-row">
        <label class="form-label mb-3">Nature du batiment</label>
        <Field
            name="housingBuildingNature"
            as="select"
            class="form-control form-control-lg form-control-solid"
        >
          <item-list :lists="lists.batimentNatureList"></item-list>
        </Field>
        <ErrorMessage
            name="housingBuildingNature"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import ItemList from '@/components/DCI/input/ItemList.vue';
import Step3Housing from '@/components/DCI/wizzard-file/Step3Housing.vue';

export default defineComponent( {
                                  name:       'file-pv-step-3',
                                  components: {
                                    ItemList,
                                    Step3Housing,
                                    Field,
                                    ErrorMessage,
                                  },
                                  props:      {
                                    lists: Object,
                                  },
                                } );
</script>
