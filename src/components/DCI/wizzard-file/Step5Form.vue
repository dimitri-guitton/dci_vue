<template>
  <template v-if="worksheetBuilder">
    <div class="row">
      <div class="col-md-4 offset-8 fv-row">
        <label class="form-label mb-3">Période de pose souhaité</label>
        <Field
            type="date"
            class="form-control"
            name="worksheet.period"
            placeholder="01/01/1970"
            value=""
        />
      </div>
    </div>

    <template v-for="(step, index) in worksheetBuilder.steps" :key="`step_${index}`">
      <div class="row align-items-end">
        <template v-for="item in step.items" :key="item.name">
          <div class="col-md-4 mb-10 mt-10">
            <template v-if="item.type === selectInput">
              <label class="form-label mb-3">{{ item.label }}</label>
              <Field
                  :name="`worksheet.${item.name}`"
                  as="select"
                  class="form-control"
              >
                <item-list :lists="lists[item.selectList]"></item-list>
              </Field>
            </template>
            <template v-else-if="item.type === numberInput">
              <label class="form-label mb-3">{{ item.label }}</label>
              <Field
                  type="number"
                  :name="`worksheet.${item.name}`"
                  class="form-control"
              >
              </Field>
            </template>
            <template v-else-if="item.type === textInput">
              <label class="form-label mb-3">{{ item.label }}</label>
              <Field
                  type="text"
                  :name="`worksheet.${item.name}`"
                  class="form-control"
              >
              </Field>
            </template>
            <template v-else-if="item.type === checkboxInput">
              <label class="form-check form-switch form-check-custom">
                <span class="form-check-label fw-bold text-gray-600 me-5">{{ item.label }}</span>
                <Field
                    type="checkbox"
                    class="form-check-input h-30px w-55px"
                    :name="`worksheet.${item.name}`"
                    :value="true"
                />
              </label>
            </template>

            <template v-if="item.required">
              <div class="alert alert-danger d-flex align-items-center p-5 mt-5">
                <div class="d-flex flex-column"><span>Cette valeur est obligatoire</span></div>
              </div>
            </template>
          </div>
        </template>
      </div>
      <el-divider class="mb-20"></el-divider>
    </template>
    <div class="row mt-10">
      <div class="col-md-12 fv-row">
        <label class="form-label mb-3">Complément d'information</label>
        <Field
            as="textarea"
            class="form-control"
            name="worksheet.infosSup"
            placeholder="RAS"
            value=""
        />
      </div>
    </div>
  </template>
</template>

<script lang="ts">
import ItemList from '@/components/DCI/input/ItemList.vue';
import { defineComponent } from 'vue';
import { Field } from 'vee-validate';
import { WorksheetBuilder, WorksheetBuilderItemType } from '@/types/v2/Wizzard/WorksheetBuilder';

export default defineComponent( {
                                  name:       'step5-form',
                                  components: { ItemList, Field },
                                  props:      {
                                    worksheetBuilder: Object as () => WorksheetBuilder,
                                    lists:            Object,
                                  },
                                  setup() {
                                    const selectInput: WorksheetBuilderItemType   = WorksheetBuilderItemType.Select;
                                    const numberInput: WorksheetBuilderItemType   = WorksheetBuilderItemType.Number;
                                    const textInput: WorksheetBuilderItemType     = WorksheetBuilderItemType.Text;
                                    const checkboxInput: WorksheetBuilderItemType = WorksheetBuilderItemType.Checkbox;

                                    return {
                                      selectInput,
                                      numberInput,
                                      textInput,
                                      checkboxInput,
                                    };
                                  },
                                },
);
</script>
