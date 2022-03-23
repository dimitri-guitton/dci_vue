<template>
  <div class="row mb-5">
    <div class="col-md-4 fv-row">
      <label class="form-label mb-3">{{ areaName }}<sup><var>m2</var></sup></label>
      <Field
          type="number"
          class="form-control"
          name="area"
          placeholder="0"
      />

      <ErrorMessage
          name="area"
          class="fv-plugins-message-container invalid-feedback"
      ></ErrorMessage>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';

export default defineComponent( {
                                  name:       'input-area',
                                  components: { Field, ErrorMessage },
                                  props: {
                                    lists:    Object,
                                    address:  {
                                      type: String,
                                    },
                                    areaName: {
                                      type:    String,
                                      default: 'Superficie',
                                    },
                                  },
                                },
);
</script>
