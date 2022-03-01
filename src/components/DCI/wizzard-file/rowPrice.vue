<template>
  <div class="row mb-10">
    <div class="col-md-6 fv-row">
      <p>{{ product.label }}</p>
    </div>

    <div class="col-md-2 fv-row">
      <div class="input-group">
        <input :disabled="true" type="number" class="form-control" :value="product.quantity" />
        <div class="input-group-append">
          <span class="input-group-text">u</span>
        </div>
      </div>
    </div>

    <div class="col-md-2 fv-row d-flex align-items-center">
      <h5 class="mb-3">{{ numberToPrice( product.pu ) }}</h5>
    </div>

    <div class="col-md-2 fv-row d-flex justify-content-end align-items-center">
      <h5 class="mb-3">{{ numberToPrice( product.pu * product.quantity ) }}</h5>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Product } from '@/types/v2/File/Common/Product';
import { numberToPrice } from '@/services/commonService';

export default defineComponent( {
                                  name:  'row-price',
                                  props: {
                                    product: {
                                      type:     Object as () => Product,
                                      required: true,
                                    },
                                  },
                                  setup() {
                                    return {
                                      numberToPrice,
                                    };
                                  },
                                } );
</script>
