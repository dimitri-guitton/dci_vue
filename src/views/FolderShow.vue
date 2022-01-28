<template>
  <div class="row gy-5 g-xl-8">
    <div class="col-xxl-4">
      <h1>DOSSIER : {{ folderRef }}</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent( {
                                  name: 'dashboard',
                                  setup() {
                                    const route     = useRoute();
                                    const folderRef = route.query.slug;

                                    return {
                                      folderRef,
                                    };
                                  },
                                } );
</script>
