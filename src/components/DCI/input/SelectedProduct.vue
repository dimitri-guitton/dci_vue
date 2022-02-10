<template>
  <template v-if="currentProduct !== undefined">
    <div class="row" v-bind:class="{ 'mb-10': !alert, 'mb-2': alert }">
      <div class="col-md-6 fv-row">
        <Field :name="`selectedProducts[${index}].id`"
               class="form-select form-select-solid"
               as="select"
               v-model="selectedP"
               @change="onChangeProduct(selectedP)">
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.label }}
          </option>
        </Field>
      </div>
      <div class="col-md-2 fv-row">
        <Field
            :disabled="true"
            type="text"
            class="form-control form-control-lg"
            name="selectedProductQuantity"
            placeholder="1"
            value="1"
        />
      </div>
      <div class="col-md-2 fv-row">
        <Field
            v-model.number="currentProduct.pu"
            type="number"
            class="form-control form-control-lg form-control-solid"
            :name="`selectedProducts[${index}].pu`"
            placeholder="10"
        />
        <ErrorMessage
            :name="`selectedProducts[${index}].pu`"
            class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>
      <div class="col-md-2 fv-row d-flex justify-content-end align-items-center">
        <h5 class="mb-3">{{ currentProduct.pu.toFixed( 2 ) }} €</h5>
      </div>
    </div>
    <div class="row mb-10" v-if="alert">
      <div class="col-md-8">
        <div class="alert alert-primary d-flex align-items-center p-5 mt-5">
          <i class="fa fa-exclamation fs-2hx text-primary me-5"></i>
          <div class="d-flex flex-column" v-html="htmlAlert"></div>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="row mb-10">
      <p>Aucun produit trouvé</p>
    </div>
  </template>

</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { Product } from '@/types/v2/File/Common/Product';
import { ErrorMessage, Field } from 'vee-validate';

export default defineComponent( {
                                  name:       'selected-product',
                                  components: {
                                    Field,
                                    ErrorMessage,
                                  },
                                  props:      {
                                    index:            {
                                      type:    Number,
                                      default: 0,
                                    },
                                    selectedProducts: {
                                      type:    Array as () => Product[],
                                      default: () => [],
                                    },
                                    products:         {
                                      type:    Array as () => Product[],
                                      default: () => [],
                                    },
                                    // Affichage du alert en dessous du produit
                                    alert: String,
                                  },
                                  setup( props ) {
                                    let currentProduct = ref<Product>();

                                    console.log( 'Props -->', props );
                                    console.log( 'Index -->', props.index );
                                    console.log( 'Products -->', props.products );
                                    console.log( 'SelectProducts -->', props.selectedProducts );
                                    console.log( '%c ', 'background: #975CFF; color: #000000' );


                                    if ( props.selectedProducts.length > 0 ) {
                                      currentProduct = ref( props.selectedProducts[ 0 ] );
                                    } else {
                                      currentProduct = ref( props.products[ 0 ] );
                                    }

                                    const onChangeProduct = ( value ) => {
                                      console.log( '%c ON CHANGE', 'background: #fdd835; color: #000000' );
                                      console.log( 'Val -->', value );
                                      console.log( 'currentProduct -->', currentProduct );

                                      currentProduct.value = props.products.find( p => p.id === value );
                                    };

                                    // Récupère le texte de l'alerte check si il y a des données envoyé et les remplaces
                                    const htmlAlert = computed( () => {
                                      if ( props.alert === undefined ) {
                                        return '';
                                      }
                                      // keep a map of all your variables
                                      const valueMap = {
                                        size: currentProduct.value?.size,
                                      };

                                      let value     = props.alert;
                                      const allKeys = Object.keys( valueMap );
                                      allKeys.forEach( ( key ) => {
                                        const myRegExp = new RegExp( `{{ ${key} }}`, 'i' );
                                        value          = value.replace( myRegExp, valueMap[ key ] );
                                      } );
                                      return value;
                                    } );

                                    console.log( 'Current product -->', currentProduct );
                                    return {
                                      onChangeProduct,
                                      htmlAlert,
                                      selectedP: 3,
                                      currentProduct,
                                    };
                                  },
                                } );
</script>
