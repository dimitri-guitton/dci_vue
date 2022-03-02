<template>
  <div class="row mb-10">
    <div class="col-md-2 fv-row">
      <label class="form-label mb-3">Nombre d'occupant</label>
      <Field
          type="number"
          class="form-control"
          name="nbOccupant"
          placeholder="1"
          value=""
      />
      <ErrorMessage
          name="nbOccupant"
          class="fv-plugins-message-container invalid-feedback"
      ></ErrorMessage>
    </div>
    <div class="col-md-5 fv-row">
      <label class="form-label mb-3">Type de logement</label>
      <Field
          name="housingType"
          as="select"
          class="form-control"
      >
        <item-list :lists="lists.localTypeList"></item-list>
      </Field>
      <ErrorMessage
          name="housingType"
          class="fv-plugins-message-container invalid-feedback"
      ></ErrorMessage>
    </div>
    <div class="col-md-5 fv-row">
      <label class="form-label mb-3">Année de construction</label>
      <Field
          type="number"
          class="form-control"
          name="housingConstructionYear"
          placeholder="1850"
          value=""
      />
      <ErrorMessage
          name="housingConstructionYear"
          class="fv-plugins-message-container invalid-feedback"
      ></ErrorMessage>
    </div>
  </div>

  <div class="row mb-15">
    <div class="col-md-4">
      <label class="form-check form-switch form-check-custom">
        <Field
            type="checkbox"
            class="form-check-input"
            name="housingLessThan2Years"
            :value="true"
        />
        <span class="form-check-label fw-bold text-gray-400">Ce logement à moins de 2 ans</span>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import ItemList from '@/components/DCI/input/ItemList.vue';
import { defineComponent } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';

export default defineComponent( {
                                  name:       'step3-housing',
                                  components: { ItemList, Field, ErrorMessage },
                                  props:      {
                                    lists: Object,
                                  },
                                },
);
</script>
