<template>
  <div class="w-100">

    <step4-header></step4-header>

    <step4-quotation-header></step4-quotation-header>

    <selected-product :alert="alert"
                      :products="products"
                      :selectedProducts="selectedProducts"></selected-product>

    <options :options="options"></options>

    <blank-options :options="blankOptions"></blank-options>

    <wizzard-file-price></wizzard-file-price>

    <div class="row mt-10">
      <div class="col-md-12 fv-row">
        <label class="form-label mb-3">Commentaire</label>
        <Field
            as="textarea"
            class="form-control form-control-lg form-control-solid"
            name="commentary"
            placeholder="RAS"
            value=""
        />
        <ErrorMessage
            name="commentary"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>
    </div>

    <el-divider class="mb-10"></el-divider>

    <div class="row mt-5">
      <div class="col-md-6 offset-md-3 d-flex justify-content-around">
        <button class="btn btn-outline btn-outline-info">Générer l'attestation d'adresse</button>
        <button class="btn btn-info">Générer le devis</button>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import SelectedProduct from '@/components/DCI/input/SelectedProduct.vue';
import { Product } from '@/types/v2/File/Common/Product';
import Step4QuotationHeader from '@/components/DCI/wizzard-file/Step4QuotationHeader.vue';
import Options from '@/components/DCI/input/Options.vue';
import { Option } from '@/types/v2/File/Common/Option';
import BlankOptions from '@/components/DCI/input/BlankOptions.vue';
import { BlankOption } from '@/types/v2/File/Common/BlankOption';
import WizzardFilePrice from '@/components/DCI/wizzard-file/Price.vue';
import Step4Header from '@/components/DCI/wizzard-file/Step4Header.vue';

export default defineComponent( {
                                  name:       'cet-step-4',
                                  components: {
                                    Step4Header,
                                    WizzardFilePrice,
                                    BlankOptions,
                                    Options,
                                    Step4QuotationHeader,
                                    SelectedProduct,
                                    Field,
                                    ErrorMessage,
                                  },
                                  props:      {
                                    products:         Array as () => Product[],
                                    selectedProducts: Array as () => Product[],
                                    options:          Array as () => Option[],
                                    blankOptions:     Array as () => BlankOption[],
                                  },
                                  setup() {
                                    return {
                                      alert: `<span>Veuillez bien vérifier que l'installation est réalisable par rapport à la taille du chauffe-eau ? (escalier...)</span>
                                                <br>
                                              <span>Dimensions : {{ size }}</span>`,
                                    };
                                  },
                                } );
</script>

<style>
textarea {
  resize : none;
}
</style>
