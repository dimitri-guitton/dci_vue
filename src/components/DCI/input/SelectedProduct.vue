<template>
    <template v-if="currentProduct !== undefined">
        <div class="row" v-bind:class="{ 'mb-10': !alert, 'mb-2': alert }">
            <div class="col-md-6 fv-row">
                <Field :name="`selectedProducts[${index}].id`"
                       class="form-select"
                       as="select"
                       v-model="selectedId"
                       @change="onChangeProduct(selectedId)">
                    <option v-for="product in products" :key="product.id" :value="product.id">
                        <template v-if="showReference">{{ product.reference }} |</template>
                        {{ product.label }}
                    </option>
                </Field>
            </div>
            <div class="col-md-2 fv-row">
                <template v-if="refQuantityArea > 0">
                    <div class="input-group">
                        <Field
                            :disabled="true"
                            type="number"
                            class="form-control"
                            :name="`selectedProducts[${index}].quantity`"
                            placeholder="1"
                            :min="0"
                            v-model="refQuantityArea"
                        />
                        <div class="input-group-append">
                            <span class="input-group-text">U</span>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="input-group">
                        <Field
                            :disabled="!editQuantity"
                            type="number"
                            class="form-control"
                            :name="`selectedProducts[${index}].quantity`"
                            placeholder="1"
                            :min="0"
                            v-model.number="quantity"
                            @change="onChangeQuantity"
                        />
                        <div class="input-group-append">
                            <span class="input-group-text">U</span>
                        </div>
                    </div>

                </template>
            </div>
            <div class="col-md-2 fv-row">
                <Field
                    v-model.number="currentProduct.pu"
                    type="number"
                    class="form-control"
                    :name="`selectedProducts[${index}].pu`"
                    :disabled="disabledPrice"
                    placeholder="100"
                    @change="onChangeProduct(selectedId)"
                />
                <ErrorMessage
                    :name="`selectedProducts[${index}].pu`"
                    class="fv-plugins-message-container invalid-feedback"
                ></ErrorMessage>
            </div>
            <div class="col-md-2 fv-row d-flex justify-content-end align-items-center">
                <template v-if="refQuantityArea > 0">
                    <h5 class="mb-3">{{ numberToPrice( currentProduct.pu, quantityArea ) }}</h5>
                </template>
                <template v-else>
                    <h5 class="mb-3">{{ numberToPrice( currentProduct.pu, quantity ) }}</h5>
                </template>

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
        <div class="row mb-10" v-if="colors.length > 0">
            <div class="col-md-6 fv-row">
                <Field :name="`selectedColors[${index}].name`"
                       class="form-select"
                       as="select"
                       v-model="currentColor"
                       @change="onChangeColor">
                    <option v-for="color in colors" :key="color.name" :value="color.name">
                        {{ color.name }}
                    </option>
                </Field>
            </div>
            <div class="col-md-2 fv-row">
                <div class="input-group">
                    <Field
                        :disabled="true"
                        type="number"
                        class="form-control"
                        :name="`selectedColors[${index}].quantity`"
                        v-model.number="quantity"
                    />
                    <div class="input-group-append">
                        <span class="input-group-text">U</span>
                    </div>
                </div>
            </div>
            <div class="col-md-2 fv-row">
                <Field
                    v-model.number="colorPrice"
                    type="number"
                    class="form-control"
                    :name="`selectedColors[${index}].pu`"
                />
            </div>
            <div class="col-md-2 fv-row d-flex justify-content-end align-items-center">
                <h5 class="mb-3">{{ numberToPrice( colorPrice, quantity ) }}</h5>
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
import { computed, defineComponent, ref, toRef } from 'vue';
import { Product } from '@/types/v2/File/Common/Product';
import { ErrorMessage, Field } from 'vee-validate';
import { numberToPrice } from '@/services/commonService';
import { ElMessage } from 'element-plus';
import { ProductColor } from '@/types/v2/File/Common/ProductColor';

export default defineComponent( {
                                    name:       'selected-product',
                                    components: {
                                        Field,
                                        ErrorMessage,
                                    },
                                    props: {
                                        index:            {
                                            type:    Number,
                                            default: 0,
                                        },
                                        quantityArea:     { // Quantité au metre carré
                                            type:    Number,
                                            default: 0,
                                        },
                                        editQuantity:  {
                                            type:    Boolean,
                                            default: true,
                                        },
                                        disabledPrice:    { // Quantité au metre carré
                                            type:    Boolean,
                                            default: false,
                                        },
                                        selectedProducts: {
                                            type:    Array as () => Product[],
                                            default: () => [],
                                        },
                                        products:         {
                                            type:    Array as () => Product[],
                                            default: () => [],
                                        },
                                        showReference:    {
                                            type:    Boolean,
                                            default: false,
                                        },
                                        selectedColor: {
                                            type:    String,
                                            default: '',
                                        },
                                        // Affichage du alert en dessous du produit
                                        alert: String,
                                    },
                                    emits: [
                                        'selectedProductIsUpdated',
                                        'quantityIsUpdated',
                                        'selectedColorIsUpdated',
                                    ],
                                    setup( props, ctx ) {
                                        let currentProduct = ref<Product>();
                                        const currentColor = ref<string>();
                                        const quantity     = ref( 1 );
                                        const selectedId   = ref<number>();
                                        const colors       = computed<ProductColor[]>( () => {
                                            console.log( 'COMPUTED COLORS' );
                                            if ( currentProduct.value?.productColors !== undefined ) {
                                                return currentProduct.value.productColors.filter( ( color ) => {
                                                    return color.enabled;
                                                } );
                                            }
                                            return [];
                                        } );


                                        const onChangeProduct = ( value ) => {
                                            currentProduct.value = props.products.find( p => p.id === value );
                                            if ( currentProduct.value ) {
                                                currentProduct.value.quantity = quantity.value;
                                            }
                                            ctx.emit( 'selectedProductIsUpdated', currentProduct.value, 'product' );
                                        };


                                        const colorPrice = computed( () => {
                                            console.log( 'COMPUTED COLORS PRICE' );
                                            const color = colors.value.find( c => c.name === currentColor.value );
                                            let price   = 0;

                                            if ( color ) {

                                                if ( color.relativeAdditionalPrice > 0 ) {
                                                    const percentage = color.relativeAdditionalPrice / 100;
                                                    if ( currentProduct.value ) {
                                                        price = currentProduct.value.pu * percentage;
                                                    }
                                                } else if ( color.additionalPrice > 0 ) {
                                                    price = color.additionalPrice / 100;
                                                }
                                            }

                                            ctx.emit( 'selectedColorIsUpdated', price );
                                            return price;
                                        } );

                                        const onChangeColor = () => {
                                            if ( currentProduct.value ) {
                                                currentProduct.value.selectedColor = {
                                                    name: currentColor.value ?? '',
                                                    pu:   colorPrice.value,
                                                };
                                            }
                                        };


                                        const onChangeQuantity = () => {
                                            ctx.emit( 'quantityIsUpdated', quantity.value );
                                            if ( currentProduct.value ) {
                                                currentProduct.value.quantity = quantity.value;
                                            }
                                        };

                                        try {
                                            if ( props.selectedProducts.length > 0 && props.selectedProducts[ props.index ] !== undefined ) {
                                                currentProduct = ref( props.selectedProducts[ props.index ] );
                                            } else {
                                                currentProduct = ref( props.products[ 0 ] );
                                                onChangeProduct( props.products[ 0 ].id );
                                            }
                                            quantity.value = currentProduct.value?.quantity ?? 1;
                                            currentColor.value = currentProduct.value?.selectedColor?.name ?? '';
                                        } catch ( e ) {
                                            console.warn( e );
                                            ElMessage( {
                                                           showClose:                true,
                                                           duration:                 5000,
                                                           dangerouslyUseHTMLString: true,
                                                           message:                  `<strong>Malheureusement, ce dossier n'est plus à jour. <br>Merci d'en créer un nouveau</strong>`,
                                                           center:                   true,
                                                           type:                     'error',
                                                       } );
                                        }

                                        const refQuantityArea = toRef( props, 'quantityArea' );

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


                                        const resetSelectedValue = ( products: Product[] ) => {
                                            currentProduct.value = products[ 0 ];
                                            selectedId.value     = currentProduct.value?.id;
                                            return currentProduct.value;
                                        };

                                        selectedId.value = currentProduct.value?.id;

                                        return {
                                            onChangeProduct,
                                            onChangeColor,
                                            onChangeQuantity,
                                            resetSelectedValue,
                                            colors,
                                            currentColor,
                                            colorPrice,
                                            refQuantityArea,
                                            htmlAlert,
                                            selectedId,
                                            currentProduct,
                                            numberToPrice,
                                            quantity,
                                        };
                                    },
                                } );
</script>
