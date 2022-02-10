<template>
  <div class="row mb-15">
    <div class="col-md-4 fv-row">
      <label class="form-label mb-3">Date visite technique</label>
      <Field
          type="text"
          class="form-control form-control-lg form-control-solid"
          name="dateTechnicalVisit"
          placeholder="01/01/1970"
          value=""
      />
      <ErrorMessage
          name="dateTechnicalVisit"
          class="fv-plugins-message-container invalid-feedback"
      ></ErrorMessage>
    </div>
    <div class="col-md-4 fv-row">
      <label class="form-label mb-3">Délais d'éxécution</label>
      <Field
          type="text"
          class="form-control form-control-lg form-control-solid"
          name="executionDelay"
          placeholder="01/01/1970"
          value=""
      />
      <ErrorMessage
          name="executionDelay"
          class="fv-plugins-message-container invalid-feedback"
      ></ErrorMessage>
    </div>

    <div class="col-md-4 fv-row">
      <label class="form-label mb-3">Origine</label>
      <Field
          type="text"
          class="form-control form-control-lg form-control-solid"
          name="origin"
          placeholder="Origine"
          value=""
      />
      <ErrorMessage
          name="origin"
          class="fv-plugins-message-container invalid-feedback"
      ></ErrorMessage>
    </div>
  </div>
  <el-divider class="mb-10"></el-divider>

</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';


export default defineComponent( {
                                  name:       'step4-header',
                                  components: {
                                    Field,
                                    ErrorMessage,
                                  },
                                } );
</script>
