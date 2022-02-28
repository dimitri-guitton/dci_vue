<template>
  <template v-if="options !== undefined && options.length > 0">
    <template v-for="(option, index) in optionList" :key="option.id">

      <!-- Pour avoir l'id dans les datas-->
      <Field
          v-model.number="option.id"
          type="number"
          class="form-control d-none"
          :name="`options[${index}].id`"
          @change="onChangeOption()"
      />

      <div class="row mb-10">
        <div class="col-md-6 fv-row">
          {{ option.label }}
        </div>
        <div class="col-md-2 fv-row">
          <div class="input-group">
            <Field
                v-model.number="option.number"
                type="number"
                class="form-control"
                :name="`options[${index}].number`"
                placeholder="1"
                @change="onChangeOption()"
            />
            <div class="input-group-append">
              <span class="input-group-text">{{ option.unit }}</span>
            </div>
          </div>
          <ErrorMessage
              :name="`options[${index}].number`"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
        <div class="col-md-2 fv-row">
          <Field
              v-model.number="option.pu"
              type="number"
              class="form-control"
              :name="`options[${index}].pu`"
              placeholder="100"
              @change="onChangeOption()"
          />
          <ErrorMessage
              :name="`options[${index}].pu`"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
        <div class="col-md-2 fv-row d-flex justify-content-end align-items-center">
          <h5 class="mb-3">{{ ( option.pu * option.number ).toFixed( 2 ) }} €</h5>
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
                                  emits:      [ 'optionsAreUpdated' ],
                                  setup( props, ctx ) {
                                    const optionList = ref( props.options );

                                    const onChangeOption = () => {
                                      ctx.emit( 'optionsAreUpdated', props.options );
                                    };

                                    return {
                                      optionList,
                                      onChangeOption,
                                    };
                                  },
                                } );
</script>
