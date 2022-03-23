<template>
  <div class="row mb-10">
    <div class="col-md-8 fv-row">
      Remise
    </div>
    <div class="col-md-2 fv-row">
      <Field
          v-model.number="newDiscount"
          type="number"
          class="form-control"
          name="discount"
          placeholder="100"
          @change="onChangeDiscount()"
      />
      <ErrorMessage
          name="discount"
          class="fv-plugins-message-container invalid-feedback"
      ></ErrorMessage>
    </div>
    <div class="col-md-2 fv-row d-flex justify-content-end align-items-center">
      <h5 class="mb-3">{{ numberToPrice( newDiscount, 1, false ) }}</h5>
    </div>
  </div>

</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import { numberToPrice } from '@/services/commonService';

export default defineComponent( {
                                  name:       'input-discount',
                                  components: {
                                    Field,
                                    ErrorMessage,
                                  },
                                  props:      {
                                    discount: {
                                      type:     Number,
                                      required: true,
                                    },
                                  },
                                  emits:      [ 'discountUpdated' ],
                                  setup( props, ctx ) {
                                    const newDiscount = ref( props.discount );

                                    const onChangeDiscount = () => {
                                      ctx.emit( 'discountUpdated', newDiscount.value );
                                    };

                                    return {
                                      onChangeDiscount,
                                      numberToPrice,
                                      newDiscount,
                                    };
                                  },
                                } );
</script>
