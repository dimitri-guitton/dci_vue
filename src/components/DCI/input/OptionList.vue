<template>
  <option v-for="item in lists" v-bind:key="item.slug" :value="item.slug">{{ item.value }}</option>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

interface OptionList {
  type: string;
  customer: string;
  disabledBonus: boolean;
  disabledCeeBonus: boolean;
  enabledHousingAction: boolean;
  disabledMaPrimeRenovBonus: boolean;
}


export default defineComponent( {
                                  name:  'option-list',
                                  props: {
                                    lists: Object,
                                  },
                                } );
</script>
