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
  <div class="row mb-10 d-flex align-items-end">
    <div class="col-md-4">
      <label class="form-check form-switch form-check-custom">
        <Field
            type="checkbox"
            class="form-check-input"
            name="requestTechnicalVisit"
            :value="true"
        />
        <span class="form-check-label fw-bold text-gray-400">Demande de visite technique avant travaux</span>
      </label>
    </div>
    <div class="col-md-4 fv-row">
      <label class="form-label mb-3">Motif</label>
      <Field
          type="text"
          class="form-control"
          name="technicalVisitReason"
          placeholder="Motif"
          value=""
      />
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
            v-model="paymentOnCreditIsActive"
        />
        <span class="form-check-label fw-bold text-gray-400">Paiement à crédit</span>
      </label>
    </div>
    <template v-if="paymentOnCreditIsActive">
      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Prix au comptant <var>€</var></label>
        <Field
            type="number"
            class="form-control"
            name="paymentOnCredit.cashPrice"
            placeholder="0"
            :disabled="true"
            v-model.number="cashPrice"

        />
      </div>
      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Apport <var>€</var></label>
        <Field
            type="number"
            class="form-control"
            name="paymentOnCredit.deposit"
            placeholder="0"
            v-model.number="deposit"
        />
      </div>
      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Montant crédit <var>€</var></label>
        <Field
            type="number"
            class="form-control"
            name="paymentOnCredit.amount"
            placeholder="0"
            :disabled="true"
            v-model.number="amount"
        />
      </div>
      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Nombre d'échéance <var>mois</var></label>
        <Field
            type="number"
            class="form-control"
            name="paymentOnCredit.deadlineNumber"
            placeholder="0"
        />
      </div>
      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Report d'échéance</label>
        <Field
            name="paymentOnCredit.deadlineReport"
            as="select"
            class="form-control"
        >
          <item-list :lists="lists.deadlineReportList"></item-list>
        </Field>
      </div>
      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Mensualité sans assurance <var>€</var></label>
        <Field
            type="number"
            class="form-control"
            name="paymentOnCredit.monthlyPaymentWithoutInsurance"
            placeholder="0"
        />
      </div>
      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Taux débiteur fixe <var>%</var></label>
        <Field
            type="number"
            class="form-control"
            name="paymentOnCredit.rate"
            placeholder="0"
        />
      </div>
      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">TAEG annuel <var>%</var></label>
        <Field
            type="number"
            class="form-control"
            name="paymentOnCredit.TAEG"
            placeholder="0"
        />
      </div>
      <div class="col-md-4 fv-row mb-10">
        <label class="form-label mb-3">Montant total dû sans assurance <var>€</var></label>
        <Field
            type="number"
            class="form-control"
            name="paymentOnCredit.totalAmountDueWithoutInsurance"
            placeholder="0"
        />
      </div>
    </template>
  </div>
  <el-divider class="mb-10"></el-divider>

</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import ItemList from '@/components/DCI/input/ItemList.vue';
import { PaymentOnCredit } from '@/types/v2/File/Common/paymentOnCredit';
import { Price } from '@/types/v2/File/Price';
import { numberToPrice } from '@/services/commonService';


export default defineComponent( {
                                  name:       'step4-header',
                                  components: {
                                    ItemList,
                                    Field,
                                    ErrorMessage,
                                  },
                                  props:      {
                                    price:           {
                                      type:     Object as () => Price,
                                      required: true,
                                    },
                                    paymentOnCredit: {
                                      type:     Object as () => PaymentOnCredit,
                                      required: true,
                                    },
                                    lists:           {
                                      required: true,
                                    },
                                  },
                                  setup( props ) {
                                    console.log( 'props header-->', props );
                                    const paymentOnCreditIsActive = ref<boolean>( props.paymentOnCredit.active );
                                    const cashPrice               = ref<number>( props.price.TTC );
                                    const amount                  = ref<number>( props.paymentOnCredit.amount );
                                    const deposit                 = ref<number>( props.paymentOnCredit.deposit );

                                    watch( deposit, newValue => {
                                      amount.value = +( cashPrice.value - newValue ).toFixed( 2 );
                                    } );

                                    watch( cashPrice, newValue => {
                                      amount.value = +( newValue - deposit.value ).toFixed( 2 );
                                    } );

                                    watch( props, newValue => {
                                      cashPrice.value = newValue.price.TTC;
                                    } );

                                    return {
                                      numberToPrice,
                                      cashPrice,
                                      amount,
                                      deposit,
                                      paymentOnCreditIsActive,
                                    };
                                  },
                                } );
</script>
