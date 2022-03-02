<template>
  <template v-if="options !== undefined && options.length > 0">
    <template v-for="(option, index) in optionList" :key="option.id">

      <!-- Pour avoir l'id dans les datas-->
      <Field
          v-model.number="option.id"
          type="number"
          class="form-control d-none"
          :name="`blankOptions[${index}].id`"
          @change="onChangeOption()"
      />

      <div class="row mb-10">
        <div class="col-md-6 fv-row">
          <Field
              v-model.number="option.label"
              type="text"
              class="form-control"
              :name="`blankOptions[${index}].label`"
              :placeholder="`Supplément ${index + 1}`"
              @change="onChangeOption()"
          />
          <ErrorMessage
              :name="`blankOptions[${index}].label`"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
        <div class="col-md-2 fv-row">
          <div class="input-group">
            <Field
                v-model.number="option.number"
                type="number"
                class="form-control"
                :name="`blankOptions[${index}].number`"
                placeholder="1"
                @change="onChangeOption()"
            />
            <div class="input-group-append">
              <span class="input-group-text">U</span>
            </div>
          </div>
          <ErrorMessage
              :name="`blankOptions[${index}].number`"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
        <div class="col-md-2 fv-row">
          <Field
              v-model.number="option.pu"
              type="number"
              class="form-control"
              :name="`blankOptions[${index}].pu`"
              placeholder="100"
              @change="onChangeOption()"
          />
          <ErrorMessage
              :name="`blankOptions[${index}].pu`"
              class="fv-plugins-message-container invalid-feedback"
          ></ErrorMessage>
        </div>
        <div class="col-md-2 fv-row d-flex justify-content-end align-items-center">
          <template v-if="option.number && option.label !== ''">
            <h5 class="mb-3">{{ numberToPrice( option.pu, option.number ) }}</h5>
          </template>
          <template v-else>
            <h5>0.00 €</h5>
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
import { numberToPrice } from '@/services/commonService';

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
                                  emits:      [ 'optionsAreUpdated' ],
                                  setup( props, ctx ) {
                                    const optionList = ref( props.options );

                                    const onChangeOption = () => {
                                      ctx.emit( 'optionsAreUpdated', props.options );
                                    };


                                    return {
                                      optionList,
                                      onChangeOption,
                                      numberToPrice,
                                    };
                                  },
                                } );
</script>
