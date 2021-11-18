<template>
  <!--begin::Dashboard-->
  <div class="row gy-5">
    <div v-if="flashActive">
      <div class="alert alert-success d-flex align-items-center p-5 mb-10">
    <span class="svg-icon svg-icon-2hx svg-icon-success me-4">
      <i class="far fa-check-circle text-success fs-2x me-2"></i>
    </span>
        <div class="d-flex flex-column">
          <h4 class="mb-1 text-success">Modifications enregistrées</h4>
          <span>Vos modifications ont été prises en compte</span>
        </div>
      </div>
    </div>

    <Form @submit="onSubmit" :validation-schema="simpleSchema">
      <div class="row">
        <div class="mb-10 col-6">
          <label for="apiKey" class="required form-label">Clé API</label>
          <Field v-model="apiKey"
                 id="apiKey"
                 name="apiKey"
                 type="text"
                 placeholder="A0B3S5F3G6Q2F5HHF6DS6"
                 class="form-control" />
          <ErrorMessage name="apiKey" class="text-danger" />
        </div>
        <div class="mb-10 col-6">
          <label for="dropboxPath" class="required form-label">Chemin Dropbox</label>
          <Field v-model="dropboxPath"
                 id="dropboxPath"
                 name="dropboxPath"
                 type="text"
                 placeholder="mon/chemin/vers/dropbox"
                 class="form-control" />
          <ErrorMessage name="dropboxPath" class="text-danger" />
        </div>
      </div>
      <div class="float-end">
        <button type="submit" class="btn btn-success"><i class="far fa-check-circle fs-4 me-2"></i>Valider</button>
      </div>
    </Form>
  </div>
  <!--end::Dashboard-->
</template>

<script lang="ts">
// DOC https://vee-validate.logaretm.com/v4/guide/components/validation#displaying-error-messages

import { defineComponent, ref } from 'vue';
import { ErrorMessage, Field, Form } from 'vee-validate';

import Store from 'electron-store';

const schema = {
  apiKey:      {
    type:    'string',
    default: '',
  },
  dropboxPath: {
    type:    'string',
    default: '',
  },
} as const;

// Store pour stoker les users Data
const store = new Store( { schema } );

export default defineComponent( {
                                  name:       'parameters',
                                  components: {
                                    Form,
                                    Field,
                                    ErrorMessage,
                                  },
                                  setup() {

                                    // Recup les données du users
                                    const apiKey      = store.get( 'apiKey' );
                                    const dropboxPath = store.get( 'dropboxPath' );
                                    const flashActive = ref( false );

                                    // Set up les schémas pour le formulaire
                                    const simpleSchema = {
                                      apiKey( value ) {
                                        if ( value ) {
                                          return true;
                                        }
                                        return 'La clé API est requise';
                                      },
                                      dropboxPath( value ) {
                                        if ( value ) {
                                          return true;
                                        }
                                        return 'Le chemin vers Dropbox est requis';
                                      },
                                    };

                                    return {
                                      simpleSchema, apiKey, dropboxPath, flashActive,
                                    };
                                  },
                                  methods: {
                                    onSubmit( values ) {
                                      store.set( 'apiKey', values.apiKey );
                                      store.set( 'dropboxPath', values.dropboxPath );

                                      this.flashActive = true;
                                      setTimeout( () => {
                                        this.flashActive = false;
                                      }, 5000 );

                                    },
                                  },
                                } );
</script>
