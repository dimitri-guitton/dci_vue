<template>
  <div class="row mb-10">
    <div class="col-md-4 fv-row">
      <label class="form-label mb-3">Date visite technique</label>
      <Field
          type="date"
          class="form-control form-control-lg"
          name="dateTechnicalVisit"
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
          type="date"
          class="form-control form-control-lg"
          name="executionDelay"
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
          class="form-control form-control-lg"
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
  <div class="row mb-10">
    <div class="col-md-4 mb-10">
      <label class="form-check form-switch form-check-custom">
        <Field
            type="checkbox"
            class="form-check-input"
            name="paymentOnCredit.active"
            :value="true"
            v-model="paymentOnCredit"
        />
        <span class="form-check-label fw-bold text-gray-400">Paiement à crédit</span>
      </label>
    </div>
    <template v-if="paymentOnCredit">
      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Montant</label>
        <Field
            type="number"
            class="form-control"
            name="paymentOnCredit.amount"
            placeholder="Montant"
        />
      </div>
      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Mensualité sans assurance</label>
        <Field
            type="number"
            class="form-control"
            name="paymentOnCredit.withoutInsurance"
            placeholder="Mensualité sans assurance"
        />
      </div>
      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Mensualité avec assurance</label>
        <Field
            type="number"
            class="form-control"
            name="paymentOnCredit.withInsurance"
            placeholder="Mensualité avec assurance"
        />
      </div>
      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Durée</label>
        <Field
            type="number"
            class="form-control"
            name="paymentOnCredit.duration"
            placeholder="Durée"
        />
      </div>
      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">TAEG</label>
        <Field
            type="number"
            class="form-control"
            name="paymentOnCredit.TAEG"
            placeholder="TAEG"
        />
      </div>
      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Coût total</label>
        <Field
            type="number"
            class="form-control"
            name="paymentOnCredit.total"
            placeholder="Coût total"
        />
      </div>
    </template>
  </div>
  <el-divider class="mb-10"></el-divider>

</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';


export default defineComponent( {
                                  name:       'step4-header',
                                  components: {
                                    Field,
                                    ErrorMessage,
                                  },
                                  setup() {
                                    const paymentOnCredit = ref<boolean>();
                                    return {
                                      paymentOnCredit,
                                    };
                                  },
                                } );
</script>
