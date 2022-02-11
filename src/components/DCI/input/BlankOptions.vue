<template>
  <template v-if="options !== undefined && options.length > 0">
    <template v-for="(option, index) in optionList" :key="option.id">

      <!-- Pour avoir l'id dans les datas-->
      <Field
          v-model.number="option.id"
          type="number"
          class="form-control form-control-lg form-control-solid d-none"
          :name="`blankOptions[${index}].id`"
      />

      <div class="row mb-10">
        <div class="col-md-6 fv-row">
          <Field
              v-model.number="option.label"
              type="text"
              class="form-control form-control-lg form-control-solid"
              :name="`blankOptions[${index}].label`"
              :placeholder="`Supplément ${index + 1}`"
          />
          <ErrorMessage
              :name="`blankOptions[${index}].label`"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
        <div class="col-md-2 fv-row">
          <Field
              v-model.number="option.number"
              type="number"
              class="form-control form-control-lg form-control-solid"
              :name="`blankOptions[${index}].number`"
              placeholder="1"
          />
          <ErrorMessage
              :name="`blankOptions[${index}].number`"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
        <div class="col-md-2 fv-row">
          <Field
              v-model.number="option.pu"
              type="number"
              class="form-control form-control-lg form-control-solid"
              :name="`blankOptions[${index}].pu`"
              placeholder="100"
          />
          <ErrorMessage
              :name="`blankOptions[${index}].pu`"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
        <div class="col-md-2 fv-row d-flex justify-content-end align-items-center">
          <template v-if="option.pu && option.number">
            <h5 class="mb-3">{{ ( option.pu * option.number ).toFixed( 2 ) }} €</h5>
          </template>
          <template v-else>
            <h5>0 €</h5>
          </template>

        </div>
      </div>
    </template>
  </template>

</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import { Option } from '@/types/v2/File/Common/Option';

export default defineComponent( {
                                  name:       'blank-options',
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
