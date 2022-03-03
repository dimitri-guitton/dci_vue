<template>
  <div class="w-100">
    <div class="pb-10 pb-lg-15">
      <h2 class="fw-bolder text-dark">Informations du logement</h2>
    </div>

    <step3-housing :lists="lists"></step3-housing>

    <div class="row mb-15">
      <div class="col-md-4 fv-row">
        <label class="form-label mb-3">Type de chauffage</label>
        <Field
            name="housingHeatingType"
            as="select"
            class="form-control form-control-lg form-control-solid"
        >
          <item-list :lists="lists.chauffageTypeList"></item-list>
        </Field>
        <ErrorMessage
            name="housingHeatingType"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>
    </div>

    <step3-address :lists="lists" address="11 Rue Françoise Giroud, 17000 La Rochelle"></step3-address>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import ItemList from '@/components/DCI/input/ItemList.vue';
import Step3Housing from '@/components/DCI/wizzard-file/Step3Housing.vue';
import Step3Address from '@/components/DCI/wizzard-file/Step3Address.vue';

export default defineComponent( {
                                  name:       'file-cet-step-3',
                                  components: {
                                    Step3Address,
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
