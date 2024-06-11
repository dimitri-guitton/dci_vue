<template>
    <div class="w-100">
        <div class="pb-10 pb-lg-15">
            <h2 class="fw-bolder text-dark">Informations du logement</h2>
        </div>

        <step3-housing :lists="lists"></step3-housing>

        <step3-address :file-data="fileData" :lists="lists"></step3-address>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Step3Housing from '@/components/DCI/wizzard-file/Step3Housing.vue';
import Step3Address from '@/components/DCI/wizzard-file/Step3Address.vue';
import { BaseList } from '@/types/v2/File/Common/BaseList';
import { BrveFile } from '@/types/v2/File/Brve/BrveFile';

export default defineComponent( {
                                    name:       'file-brve-step-3',
                                    components: {
                                        Step3Address,
                                        Step3Housing,
                                    },
                                    props:      {
                                        lists:    Object as () => BaseList,
                                        fileData: {
                                            type:     Object as () => BrveFile,
                                            required: true,
                                        },
                                    },
                                } );
</script>
