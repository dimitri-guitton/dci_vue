<template>
  <div class="w-100">
    <div class="pb-10 pb-lg-15">
      <h2 class="fw-bolder text-dark">Informations du logement</h2>
    </div>

    <step3-housing :lists="lists"></step3-housing>

    <step3-address :lists="lists" address="62 Boulevard Malesherbes 75000 Paris"></step3-address>

    <div class="row mb-15">
      <div class="col-md-4 fv-row">
        <label class="form-label mb-3">Superficie <sup><var>m2</var></sup></label>
        <Field
            type="number"
            class="form-control"
            name="area"
            placeholder="0"
            value=""
        />
        <ErrorMessage
            name="area"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import Step3Housing from '@/components/DCI/wizzard-file/Step3Housing.vue';
import Step3Address from '@/components/DCI/wizzard-file/Step3Address.vue';

export default defineComponent( {
                                  name:       'file-pb-step-3',
                                  components: {
                                    Step3Address,
                                    Step3Housing,
                                    Field,
                                    ErrorMessage,
                                  },
                                  props:      {
                                    lists: Object,
                                  },
                                } );
</script>
