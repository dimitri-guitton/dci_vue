<template>
  <div class="stepper-nav py-5 mt-5">
    <div class="stepper-item current" data-kt-stepper-element="nav">
      <h3 class="stepper-title">
        Avis
      </h3>
    </div>

    <div class="stepper-item" data-kt-stepper-element="nav">
      <h3 class="stepper-title">
        Client
      </h3>
    </div>

    <div class="stepper-item" data-kt-stepper-element="nav">
      <h3 class="stepper-title">
        Logement
      </h3>
    </div>

    <div class="stepper-item" data-kt-stepper-element="nav">
      <h3 class="stepper-title">
        Devis
      </h3>
    </div>

    <div class="stepper-item" data-kt-stepper-element="nav">
      <h3 class="stepper-title">
        Fiche
      </h3>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { ItemList } from '@/types/v2/File/Common/ItemList';


export default defineComponent( {
                                  name:  'wizzard-file-header',
                                  props: {
                                    lists: Object as () => ItemList,
                                  },
                                } );
</script>
