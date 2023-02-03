<template>
    <div class="w-100">
        <div class="pb-10 pb-lg-15">
            <h2 class="fw-bolder text-dark">Informations du logement</h2>
        </div>

        <step3-housing :lists="lists"></step3-housing>

        <input-area area-name="Surface exploitable toiture"></input-area>

        <step3-address :file-data="fileData" :lists="lists"></step3-address>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Step3Housing from '@/components/DCI/wizzard-file/Step3Housing.vue';
import Step3Address from '@/components/DCI/wizzard-file/Step3Address.vue';
import PvList from '@/types/v2/File/Pv/PvList';
import { PvFile } from '@/types/v2/File/Pv/PvFile';
import InputArea from '@/components/DCI/input/Area.vue';

export default defineComponent( {
                                    name:       'file-pv-step-3',
                                    components: {
                                        InputArea,
                                        Step3Address,
                                        Step3Housing,
                                    },
                                    props:      {
                                        lists:    Object as () => PvList,
                                        fileData: {
                                            type:     Object as () => PvFile,
                                            required: true,
                                        },
                                    },
                                } );
</script>
