<template>
  <template v-if="options !== undefined && options.length > 0">
    <template v-for="(option, index) in optionList" :key="option.id">
      <div class="row mb-10">
        <div class="col-md-6 fv-row">
          {{ option.label }}
        </div>
        <div class="col-md-2 fv-row">
          <Field
              v-model.number="option.number"
              type="number"
              class="form-control form-control-lg form-control-solid"
              :name="`option[${index}].number`"
              placeholder="1"
          />
          <ErrorMessage
              :name="`option[${index}].number`"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
        <div class="col-md-2 fv-row">
          <Field
              v-model.number="option.pu"
              type="number"
              class="form-control form-control-lg form-control-solid"
              :name="`option[${index}].pu`"
              placeholder="100"
          />
          <ErrorMessage
              :name="`option[${index}].pu`"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
        <div class="col-md-2 fv-row d-flex justify-content-end align-items-center">
          <h5 class="mb-3">{{ ( option.pu * option.number ).toFixed( 2 ) }} €</h5>
        </div>
      </div>
    </template>
  </template>
  <template v-else>
    <div class="row mb-10">
      <p>Aucun produit trouvé</p>
    </div>
  </template>

</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import { Option } from '@/types/v2/File/Common/Option';

export default defineComponent( {
                                  name:       'options',
                                  components: {
                                    Field,
                                    ErrorMessage,
                                  },
                                  props:      {
                                    options: {
                                      type:    Array as () => Option[],
                                      default: () => [],
                                    },
                                  },
                                  setup( props ) {
                                    console.log( 'Props -->', props );
                                    console.log( 'Option -->', props.options );

                                    const optionList = ref( props.options );

                                    return {
                                      optionList,
                                    };
                                  },
                                } );
</script>
