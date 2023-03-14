<template>
    <div class="w-100">

        <template v-if="assents.length > 0">
            <template v-for="(assent, index) in assents" v-bind:key="'assent_'+index">
                <template v-if="assent.datagouv !== undefined">
                    <el-descriptions
                        :column="2"
                        border
                        class="mb-15"
                        size="large"
                        title="Avis Imposition"
                    >
                        <el-descriptions-item label="N° Fiscal">{{ assent.datagouv.numFiscal }}</el-descriptions-item>
                        <el-descriptions-item label="Référence Avis">{{
                                assent.datagouv.refAvis
                                                                     }}
                        </el-descriptions-item>
                        <el-descriptions-item label="Nom">{{ assent.datagouv.nom }}</el-descriptions-item>
                        <el-descriptions-item label="Prénom">{{ assent.datagouv.prenom }}</el-descriptions-item>
                        <el-descriptions-item label="Adresse">{{ assent.datagouv.adresse }}</el-descriptions-item>
                        <el-descriptions-item label="Ville">{{ assent.datagouv.ville }}</el-descriptions-item>
                        <el-descriptions-item label="Revenus référence">{{
                                assent.datagouv.revenu
                                                                        }}
                        </el-descriptions-item>
                    </el-descriptions>
                </template>
                <div class="pb-10 pb-lg-15">
                    <h2 class="fw-bolder text-dark">Informations client</h2>
                </div>

                <div class="row mb-15">
                    <div class="col-md-2 fv-row">
                        <label class="form-label mb-3">Civilité</label>
                        <Field
                            :name="`assentsDatas[${index}].civility`"
                            as="select"
                            class="form-control"
                        >
                            <option value="m">Monsieur</option>
                            <option value="f">Madame</option>
                        </Field>
                        <ErrorMessage
                            :name="`assentsDatas[${index}].civility`"
                            class="fv-plugins-message-container invalid-feedback"
                        ></ErrorMessage>
                    </div>

                    <div class="col-md-5 fv-row">
                        <label class="form-label mb-3">Nom</label>
                        <Field
                            :name="`assentsDatas[${index}].lastName`"
                            class="form-control"
                            placeholder="Nom"
                            type="text"
                            value=""
                        />
                        <ErrorMessage
                            :name="`assentsDatas[${index}].lastName`"
                            class="fv-plugins-message-container invalid-feedback"
                        ></ErrorMessage>
                    </div>

                    <div class="col-md-5 fv-row">
                        <label class="form-label mb-3">Prénom</label>
                        <Field
                            :name="`assentsDatas[${index}].firstName`"
                            class="form-control"
                            placeholder="Prénom"
                            type="text"
                            value=""
                        />
                        <ErrorMessage
                            :name="`assentsDatas[${index}].firstName`"
                            class="fv-plugins-message-container invalid-feedback"
                        ></ErrorMessage>
                    </div>
                </div>
                <div class="row mb-15">
                    <div class="col-md-8 fv-row">
                        <label class="form-label mb-3">Adresse</label>
                        <Field
                            :name="`assentsDatas[${index}].address`"
                            class="form-control"
                            placeholder="Adresse"
                            type="text"
                            value=""
                        />
                        <ErrorMessage
                            :name="`assentsDatas[${index}].address`"
                            class="fv-plugins-message-container invalid-feedback"
                        ></ErrorMessage>
                    </div>
                    <div class="col-md-4 fv-row">
                        <label class="form-label mb-3">Code Postal</label>
                        <Field
                            :name="`assentsDatas[${index}].zipCode`"
                            class="form-control"
                            placeholder="Code Postal"
                            type="text"
                            value=""
                        />
                        <ErrorMessage
                            :name="`assentsDatas[${index}].zipCode`"
                            class="fv-plugins-message-container invalid-feedback"
                        ></ErrorMessage>
                    </div>
                </div>
                <div class="row mb-15">
                    <div class="col-md-8 fv-row">
                        <label class="form-label mb-3">Ville</label>
                        <Field
                            :name="`assentsDatas[${index}].city`"
                            class="form-control"
                            placeholder="Ville"
                            type="text"
                            value=""
                        />
                        <ErrorMessage
                            :name="`assentsDatas[${index}].city`"
                            class="fv-plugins-message-container invalid-feedback"
                        ></ErrorMessage>
                    </div>

                    <div class="col-md-4 fv-row">
                        <label class="form-label mb-3">Revenu</label>
                        <Field
                            :name="`assentsDatas[${index}].income`"
                            class="form-control"
                            placeholder="0"
                            type="number"
                            value=""
                        />
                        <ErrorMessage
                            :name="`assentsDatas[${index}].income`"
                            class="fv-plugins-message-container invalid-feedback"
                        ></ErrorMessage>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-4">
                        <label class="form-label mb-3">Est bénéficiaire</label>
                        <Field :value="index"
                               class="form-check-input ms-5"
                               name="indexBeneficiary"
                               type="radio"></Field>
                    </div>
                </div>

                <el-divider class="mb-15">
                    <i class="fa fa-user"></i>
                </el-divider>
            </template>
        </template>

        <template v-else>
            <div class="pb-10 pb-lg-15">
                <h2 class="fw-bolder text-dark">Informations client</h2>
            </div>

            <div class="row mb-15">
                <div class="col-md-2 fv-row">
                    <label class="form-label mb-3">Civilité</label>
                    <Field
                        :name="`assentsDatas[0].civility`"
                        as="select"
                        class="form-control"
                    >
                        <option value="m">Monsieur</option>
                        <option value="f">Madame</option>
                    </Field>
                    <ErrorMessage
                        :name="`assentsDatas[0].civility`"
                        class="fv-plugins-message-container invalid-feedback"
                    ></ErrorMessage>
                </div>

                <div class="col-md-5 fv-row">
                    <label class="form-label mb-3">Nom</label>
                    <Field
                        :name="`assentsDatas[0].lastName`"
                        class="form-control"
                        placeholder="Nom"
                        type="text"
                        value=""
                    />
                    <ErrorMessage
                        :name="`assentsDatas[0].lastName`"
                        class="fv-plugins-message-container invalid-feedback"
                    ></ErrorMessage>
                </div>

                <div class="col-md-5 fv-row">
                    <label class="form-label mb-3">Prénom</label>
                    <Field
                        :name="`assentsDatas[0].firstName`"
                        class="form-control"
                        placeholder="Prénom"
                        type="text"
                        value=""
                    />
                    <ErrorMessage
                        :name="`assentsDatas[0].firstName`"
                        class="fv-plugins-message-container invalid-feedback"
                    ></ErrorMessage>
                </div>
            </div>
            <div class="row mb-15">
                <div class="col-md-8 fv-row">
                    <label class="form-label mb-3">Adresse</label>
                    <Field
                        :name="`assentsDatas[0].address`"
                        class="form-control"
                        placeholder="Adresse"
                        type="text"
                        value=""
                    />
                    <ErrorMessage
                        :name="`assentsDatas[0].address`"
                        class="fv-plugins-message-container invalid-feedback"
                    ></ErrorMessage>
                </div>
                <div class="col-md-4 fv-row">
                    <label class="form-label mb-3">Code Postal</label>
                    <Field
                        :name="`assentsDatas[0].zipCode`"
                        class="form-control"
                        placeholder="Code Postal"
                        type="text"
                        value=""
                    />
                    <ErrorMessage
                        :name="`assentsDatas[0].zipCode`"
                        class="fv-plugins-message-container invalid-feedback"
                    ></ErrorMessage>
                </div>
            </div>
            <div class="row mb-15">
                <div class="col-md-8 fv-row">
                    <label class="form-label mb-3">Ville</label>
                    <Field
                        :name="`assentsDatas[0].city`"
                        class="form-control"
                        placeholder="Ville"
                        type="text"
                        value=""
                    />
                    <ErrorMessage
                        :name="`assentsDatas[0].city`"
                        class="fv-plugins-message-container invalid-feedback"
                    ></ErrorMessage>
                </div>

                <div class="col-md-4 fv-row">
                    <label class="form-label mb-3">Revenu</label>
                    <Field
                        :name="`assentsDatas[0].income`"
                        class="form-control"
                        placeholder="0"
                        type="number"
                        value=""
                    />
                    <ErrorMessage
                        :name="`assentsDatas[0].income`"
                        class="fv-plugins-message-container invalid-feedback"
                    ></ErrorMessage>
                </div>
            </div>

            <div class="row mb-15">
                <div class="col-md-4">
                    <label class="form-label mb-3">Est bénéficiaire</label>
                    <Field :value="0" class="form-check-input ms-5" name="indexBeneficiary" type="radio"></Field>
                </div>
            </div>
        </template>

        <div class="pb-10 pb-lg-15">
            <h2 class="fw-bolder text-dark">Informations complémentaires</h2>
        </div>

        <div class="row mb-15">
            <div class="col-md-6 fv-row">
                <label class="form-label mb-3">E-mail</label>
                <Field
                    class="form-control"
                    name="email"
                    placeholder="E-mail"
                    type="text"
                    value=""
                />
                <ErrorMessage
                    class="fv-plugins-message-container invalid-feedback"
                    name="email"
                ></ErrorMessage>
            </div>
        </div>

        <div class="row mb-15">
            <div class="col-md-6 fv-row">
                <label class="form-label mb-3">Téléphone</label>
                <Field
                    class="form-control"
                    name="phone"
                    placeholder="0200000000"
                    type="text"
                    value=""
                />
                <ErrorMessage
                    class="fv-plugins-message-container invalid-feedback"
                    name="phone"
                ></ErrorMessage>
            </div>

            <div class="col-md-6 fv-row">
                <label class="form-label mb-3">Portable</label>
                <Field
                    class="form-control"
                    name="mobile"
                    placeholder="0600000000"
                    type="text"
                    value=""
                />
                <ErrorMessage
                    class="fv-plugins-message-container invalid-feedback"
                    name="mobile"
                ></ErrorMessage>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';

export default defineComponent( {
                                    name: 'common-step-2',
                                    components: {
                                        Field,
                                        ErrorMessage,
                                    },
                                    props: {
                                        assents: Array,
                                    },
                                } );
</script>
