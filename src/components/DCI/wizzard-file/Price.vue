<template>
  <div class="row">
    <div class="col-md-4 offset-8">
      <el-descriptions :column="1">

        <el-descriptions-item v-if="price.laying > 0" class-name="text" align="right" label="Pose">
          {{ numberToPrice( price.laying ) }}
        </el-descriptions-item>

        <el-descriptions-item class-name="text" align="right" label="Total HT">
          {{ numberToPrice( price.HT ) }}
        </el-descriptions-item>

        <el-descriptions-item v-if="price.TVA > 0" align="right" label="TVA 5.5%">
          {{ numberToPrice( price.TVA ) }}
        </el-descriptions-item>

        <el-descriptions-item v-if="price.TVA10 > 0" align="right" label="TVA 10%">
          {{ numberToPrice( price.TVA10 ) }}
        </el-descriptions-item>

        <el-descriptions-item v-if="price.TVA20 > 0" align="right" label="TVA 20%">
          {{ numberToPrice( price.TVA20 ) }}
        </el-descriptions-item>

        <el-descriptions-item align="right" label="Total TTC">
          {{ numberToPrice( price.TTC ) }}
        </el-descriptions-item>

        <el-descriptions-item v-if="price.CEE > 0" align="right" label="Prime CEE">
          - {{ numberToPrice( price.CEE ) }}
        </el-descriptions-item>

        <el-descriptions-item v-if="price.maPrimeRenov > 0" align="right" label="MaprimeRenov">
          - {{ numberToPrice( price.maPrimeRenov ) }}
        </el-descriptions-item>

        <el-descriptions-item align="right" label="Remise">
          - {{ numberToPrice( price.discount, 1, false ) }}
        </el-descriptions-item>

        <el-descriptions-item align="right" label="Reste à Payer">
          {{ numberToPrice( price.remainderToPay ) }}
        </el-descriptions-item>

      </el-descriptions>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Price } from '@/types/v2/File/Price';
import { numberToPrice } from '@/services/commonService';


export default defineComponent( {
                                  name:  'wizzard-file-price',
                                  props: {
                                    price: {
                                      type: Object as () => Price,
                                      default() {
                                        return {
                                          laying:         0,
                                          HT:             0,
                                          TTC:            0,
                                          TVA:            0,
                                          CEE:            0,
                                          maPrimeRenov:   0,
                                          remainderToPay: 0,
                                          discount:       0,
                                        };
                                      },
                                    },
                                  },
                                  setup() {
                                    return {
                                      numberToPrice,
                                    };
                                  },
                                } );
</script>
