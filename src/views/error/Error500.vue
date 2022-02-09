<template>
  <div
      class="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
  >
    <!--begin::Content-->
    <div class="d-flex flex-column flex-column-fluid text-center p-10 py-lg-20">

      <!--begin::Wrapper-->
      <div class="pt-lg-10">
        <!--begin::Logo-->
        <h1 class="fw-bolder fs-4x text-gray-700 mb-10">Erreur système</h1>
        <!--end::Logo-->

        <!--begin::Message-->
        <div class="fw-bold fs-3 text-gray-400 mb-15">
          Il y a eu un problème ! <br />
          Merci de réessayer plus tard.
        </div>
        <!--end::Message-->

        <!--begin::Action-->
        <div class="text-center">
          <a href="/" class="btn btn-lg btn-primary fw-bolder"
          >Aller à la page d'accueil</a
          >
        </div>
        <!--end::Action-->
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Content-->

    <!--begin::Footer-->
    <!--end::Footer-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent( {
                                  name:       'error-500',
                                  components: {},
                                } );
</script>
