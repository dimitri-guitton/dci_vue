<template>
    <div
        class="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
    >
        <!--begin::Content-->
        <div class="d-flex flex-column flex-column-fluid text-center p-10 py-lg-20">
            <!--begin::Wrapper-->
            <div class="pt-lg-10">
                <!--begin::Logo-->
                <h1 class="fw-bolder fs-4x text-gray-700 mb-10">Page Non Trouvée</h1>
                <!--end::Logo-->

                <!--begin::Message-->
                <div class="fw-bold fs-3 text-gray-400 mb-15">
                    La page que vous avez cherchée n'a pas été trouvée ! <br />
                </div>
                <!--end::Message-->

                <!--begin::Action-->
                <div class="text-center">
                    <a class="btn btn-lg btn-primary fw-bolder" href="/"
                    >Aller à la page d'accueil</a
                    >
                </div>
                <!--end::Action-->
            </div>
            <!--end::Wrapper-->
        </div>
        <!--end::Content-->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent( {
                                    name:       'error-404',
                                    components: {},
                                } );
</script>
