<template>
  <div class="w-100">
    <div class="pb-10 pb-lg-15">
      <h2 class="fw-bolder text-dark">Informations du logement</h2>
    </div>

    <step3-housing :lists="lists"></step3-housing>

    <step3-address :lists="lists" address="11 Rue Françoise Giroud, 17000 La Rochelle"></step3-address>

    <input-area></input-area>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Step3Housing from '@/components/DCI/wizzard-file/Step3Housing.vue';
import Step3Address from '@/components/DCI/wizzard-file/Step3Address.vue';
import InputArea from '@/components/DCI/input/Area.vue';

export default defineComponent( {
                                  name:       'file-pb-step-3',
                                  components: {
                                    InputArea,
                                    Step3Address,
                                    Step3Housing,
                                  },
                                  props:      {
                                    lists: Object,
                                  },
                                } );
</script>
