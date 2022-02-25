<template>
  <div class="row">
    <div class="col-md-4 offset-8">
      <el-descriptions :column="1">
        <el-descriptions-item class-name="text" align="right" label="Total HT">{{
            numberToPrice( price.HT )
                                                                               }}
        </el-descriptions-item>
        <el-descriptions-item align="right" label="TVA 5.5%">{{ numberToPrice( price.TVA ) }}</el-descriptions-item>
        <el-descriptions-item align="right" label="Total TTC">{{ numberToPrice( price.TTC ) }}</el-descriptions-item>
        <el-descriptions-item v-if="price.CEE > 0" align="right" label="Prime CEE">
          - {{ numberToPrice( price.CEE ) }}
        </el-descriptions-item>
        <el-descriptions-item v-if="price.maPrimeRenov > 0" align="right" label="MaprimeRenov">
          - {{ numberToPrice( price.maPrimeRenov ) }}
        </el-descriptions-item>
        <el-descriptions-item v-if="price.housingAction > 0" align="right" label="Action logement">
          - {{ numberToPrice( price.housingAction ) }}
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
import { Price } from '@/services/file/wizzard/Price';
import { numberToPrice } from '@/services/commonService';


export default defineComponent( {
                                  name:  'wizzard-file-price',
                                  props: {
                                    price: {
                                      type: Object as () => Price,
                                      default() {
                                        return {
                                          HT:             0,
                                          TTC:            0,
                                          TVA:            0,
                                          CEE:            0,
                                          maPrimeRenov:   0,
                                          housingAction:  0,
                                          remainderToPay: 0,
                                        };
                                      },
                                    },
                                  },
                                  setup() {
                                    const formatNumber = ( number: string | number ): string => {
                                      let convertedNumber: number;
                                      if ( typeof number === 'string' ) {
                                        convertedNumber = +number;
                                      } else if ( isNaN( number ) ) {
                                        convertedNumber = 0;
                                      } else {
                                        convertedNumber = number;
                                      }

                                      return convertedNumber.toFixed( 2 );
                                    };

                                    return {
                                      formatNumber,
                                      numberToPrice: numberToPrice,
                                    };
                                  },
                                } );
</script>
