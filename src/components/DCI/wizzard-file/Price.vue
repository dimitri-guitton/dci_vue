<template>
  <div class="row">
    <div class="col-md-4 offset-8">
      <el-descriptions :column="1">
        <el-descriptions-item class-name="text" align="right" label="Total HT">{{ formatNumber( price.HT ) }} €
        </el-descriptions-item>
        <el-descriptions-item align="right" label="TVA 5.5%">{{ formatNumber( price.TVA ) }} €</el-descriptions-item>
        <el-descriptions-item align="right" label="Total TTC">{{ formatNumber( price.TTC ) }} €</el-descriptions-item>
        <el-descriptions-item align="right" label="Prime CEE">- {{ formatNumber( price.CEE ) }} €</el-descriptions-item>
        <el-descriptions-item align="right" label="MaprimeRenov">- {{ formatNumber( price.maPrimeRenov ) }} €
        </el-descriptions-item>
        <el-descriptions-item align="right" label="Reste à Payer">{{ formatNumber( price.remainderToPay ) }} €
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Price } from '@/services/file/wizzard/Price';


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
                                          maPrimeRenov:   0,
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
                                    };
                                  },
                                } );
</script>
