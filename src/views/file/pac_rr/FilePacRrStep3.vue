<template>
  <div class="w-100">
    <div class="pb-10 pb-lg-15">
      <h2 class="fw-bolder text-dark">Informations du logement</h2>
    </div>

    <step3-housing :lists="lists"></step3-housing>

    <div class="row mb-15">
      <div class="col-md-4 fv-row">
        <label class="form-label mb-3">Qualité d'isolation</label>
        <Field
            name="housingInsulationQuality"
            as="select"
            class="form-control"
        >
          <item-list :lists="lists.qualiteIsolationList"></item-list>
        </Field>
        <ErrorMessage
            name="housingInsulationQuality"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>

      <div class="col-md-4 fv-row">
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
    </div>

    <step3-address :lists="lists" address="11 Rue Françoise Giroud, 17000 La Rochelle"></step3-address>

    <input-area></input-area>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import ItemList from '@/components/DCI/input/ItemList.vue';
import Step3Housing from '@/components/DCI/wizzard-file/Step3Housing.vue';
import RrList from '@/types/v2/File/Rr/RrList';
import Step3Address from '@/components/DCI/wizzard-file/Step3Address.vue';
import InputArea from '@/components/DCI/input/Area.vue';

export default defineComponent( {
                                  name:       'file-pac-rr-step-3',
                                  components: {
                                    InputArea,
                                    Step3Address,
                                    ItemList,
                                    Step3Housing,
                                    Field,
                                    ErrorMessage,
                                  },
                                  props:      {
                                    lists: Object as () => RrList,
                                  },
                                } );
</script>
