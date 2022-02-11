<template>
  <div class="w-100">
    <div class="pb-10 pb-lg-15">
      <h2 class="fw-bolder text-dark">Caractéristique du chantier</h2>
    </div>

    <step5-form :lists="lists" :worksheet-builder="worksheetBuilder"></step5-form>

    <!--    <div class="row mb-15">-->
    <!--      &lt;!&ndash;      TODO IF PRODCUT TYPE MONO&ndash;&gt;-->
    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">Type d'installation</label>-->
    <!--        <Field-->
    <!--            name="aspirationType"-->
    <!--            as="select"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--          <item-list :lists="lists.aspirationTypeList"></item-list>-->
    <!--        </Field>-->
    <!--        <ErrorMessage-->
    <!--            name="aspirationType"-->
    <!--            class="fv-plugins-message-container invalid-feedback"-->
    <!--        ></ErrorMessage>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <el-divider></el-divider>-->

    <!--    <div class="row mb-15">-->
    <!--      <div class="col-md-4">-->
    <!--        <label class="form-check form-switch form-check-custom form-check-solid">-->
    <!--          <Field-->
    <!--              type="checkbox"-->
    <!--              class="form-check-input"-->
    <!--              name="visiteComble"-->
    <!--              :value="false"-->
    <!--          />-->
    <!--          <span class="form-check-label fw-bold text-gray-400">-->
    <!--            Visite des combles-->
    <!--          </span>-->
    <!--        </label>-->
    <!--      </div>-->

    <!--      <div class="col-md-4">-->
    <!--        <label class="form-check form-switch form-check-custom form-check-solid">-->
    <!--          <Field-->
    <!--              type="checkbox"-->
    <!--              class="form-check-input"-->
    <!--              name="chantierHabite"-->
    <!--              :value="false"-->
    <!--          />-->
    <!--          <span class="form-check-label fw-bold text-gray-400">-->
    <!--            Chantier habité-->
    <!--          </span>-->
    <!--        </label>-->
    <!--      </div>-->

    <!--      <div class="col-md-4">-->
    <!--        <label class="form-check form-switch form-check-custom form-check-solid">-->
    <!--          <Field-->
    <!--              type="checkbox"-->
    <!--              class="form-check-input"-->
    <!--              name="grandeEchelle"-->
    <!--              :value="false"-->
    <!--          />-->
    <!--          <span class="form-check-label fw-bold text-gray-400">-->
    <!--            Grande échelle nécessaire-->
    <!--          </span>-->
    <!--        </label>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div class="row mb-15">-->
    <!--      <div class="col-md-4">-->
    <!--        <label class="form-check form-switch form-check-custom form-check-solid">-->
    <!--          <Field-->
    <!--              type="checkbox"-->
    <!--              class="form-check-input"-->
    <!--              name="demandeVoirie"-->
    <!--              :value="false"-->
    <!--          />-->
    <!--          <span class="form-check-label fw-bold text-gray-400">-->
    <!--            Demande de voirie / accès PL-->
    <!--          </span>-->
    <!--        </label>-->
    <!--      </div>-->

    <!--      <div class="col-md-4">-->
    <!--        <label class="form-check form-switch form-check-custom form-check-solid">-->
    <!--          <Field-->
    <!--              type="checkbox"-->
    <!--              class="form-check-input"-->
    <!--              name="rueEtroite"-->
    <!--              :value="false"-->
    <!--          />-->
    <!--          <span class="form-check-label fw-bold text-gray-400">-->
    <!--           Rue étroite / sens unique-->
    <!--          </span>-->
    <!--        </label>-->
    <!--      </div>-->

    <!--      <div class="col-md-4">-->
    <!--        <label class="form-check form-switch form-check-custom form-check-solid">-->
    <!--          <Field-->
    <!--              type="checkbox"-->
    <!--              class="form-check-input"-->
    <!--              name="presenceVolige"-->
    <!--              :value="false"-->
    <!--          />-->
    <!--          <span class="form-check-label fw-bold text-gray-400">-->
    <!--            Présence volige-->
    <!--          </span>-->
    <!--        </label>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div class="row mb-15">-->
    <!--      <div class="col-md-4">-->
    <!--        <label class="form-check form-switch form-check-custom form-check-solid">-->
    <!--          <Field-->
    <!--              type="checkbox"-->
    <!--              class="form-check-input"-->
    <!--              name="disjoncteur"-->
    <!--              :value="false"-->
    <!--          />-->
    <!--          <span class="form-check-label fw-bold text-gray-400">-->
    <!--           Disjoncteur 30 mA-->
    <!--          </span>-->
    <!--        </label>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div class="row mb-15">-->
    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">Niveau habitation</label>-->
    <!--        <Field-->
    <!--            name="niveauHabitation"-->
    <!--            as="select"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--          <item-list :lists="lists.niveauHabitationList"></item-list>-->
    <!--        </Field>-->
    <!--      </div>-->

    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">Type de chantier</label>-->
    <!--        <Field-->
    <!--            name="typeChantier"-->
    <!--            as="select"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--          <item-list :lists="lists.typeChantierList"></item-list>-->
    <!--        </Field>-->
    <!--      </div>-->

    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">Accès des combles</label>-->
    <!--        <Field-->
    <!--            name="accesComble"-->
    <!--            as="select"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--          <item-list :lists="lists.accesCombleList"></item-list>-->
    <!--        </Field>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div class="row mb-15">-->
    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">Type de couverture</label>-->
    <!--        <Field-->
    <!--            name="typeCouverture"-->
    <!--            as="select"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--          <item-list :lists="lists.typeCouvertureList"></item-list>-->
    <!--        </Field>-->
    <!--      </div>-->

    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">Type de charpente</label>-->
    <!--        <Field-->
    <!--            name="typeCharpente"-->
    <!--            as="select"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--          <item-list :lists="lists.typeCharpenteList"></item-list>-->
    <!--        </Field>-->
    <!--      </div>-->

    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">État de la toiture</label>-->
    <!--        <Field-->
    <!--            name="etatToiture"-->
    <!--            as="select"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--          <item-list :lists="lists.etatToitureList"></item-list>-->
    <!--        </Field>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div class="row mb-15">-->
    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">Nature des murs extérieurs</label>-->
    <!--        <Field-->
    <!--            name="natureMurExt"-->
    <!--            as="select"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--          <item-list :lists="lists.natureMurExtList"></item-list>-->
    <!--        </Field>-->
    <!--      </div>-->

    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">Nature de plafond</label>-->
    <!--        <Field-->
    <!--            name="naturePlafond"-->
    <!--            as="select"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--          <item-list :lists="lists.naturePlafondList"></item-list>-->
    <!--        </Field>-->
    <!--      </div>-->

    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">Tension disponible</label>-->
    <!--        <Field-->
    <!--            name="tensionDisponible"-->
    <!--            as="select"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--          <item-list :lists="lists.tensionDisponibleList"></item-list>-->
    <!--        </Field>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    <div class="row mb-15">-->
    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">Puissance du compteur</label>-->
    <!--        <Field-->
    <!--            name="puissanceCompteur"-->
    <!--            as="select"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--          <item-list :lists="lists.puissanceCompteurList"></item-list>-->
    <!--        </Field>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div class="row mb-15">-->
    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">Nombre de compartiment des combles</label>-->
    <!--        <Field-->
    <!--            type="number"-->
    <!--            name="nbrCompartementComble"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--        </Field>-->
    <!--      </div>-->

    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">Nombre d'accès aux combles</label>-->
    <!--        <Field-->
    <!--            type="number"-->
    <!--            name="nbrAccesComble"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--        </Field>-->
    <!--      </div>-->

    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">Distance entre le compteur électrique et le chauffe-eau</label>-->
    <!--        <Field-->
    <!--            type="number"-->
    <!--            name="distanceCompteurCet"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--        </Field>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    <div class="row mb-15">-->
    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">Période de pose souhaité</label>-->
    <!--        <Field-->
    <!--            type="number"-->
    <!--            name="period"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--        </Field>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <el-divider></el-divider>-->

    <!--    <div class="row mb-15">-->
    <!--      <div class="col-md-4">-->
    <!--        <label class="form-check form-switch form-check-custom form-check-solid">-->
    <!--          <Field-->
    <!--              type="checkbox"-->
    <!--              class="form-check-input"-->
    <!--              name="ballonFixeMur"-->
    <!--              :value="false"-->
    <!--          />-->
    <!--          <span class="form-check-label fw-bold text-gray-400">-->
    <!--          Ballon fixé au mur (uniquement sur mur solide exemple : parpaing, béton, brique)-->
    <!--          </span>-->
    <!--        </label>-->
    <!--      </div>-->
    <!--      <div class="col-md-4">-->
    <!--        <label class="form-check form-switch form-check-custom form-check-solid">-->
    <!--          <Field-->
    <!--              type="checkbox"-->
    <!--              class="form-check-input"-->
    <!--              name="uniteExtFixeMur"-->
    <!--              :value="false"-->
    <!--          />-->
    <!--          <span class="form-check-label fw-bold text-gray-400">-->
    <!--         Unité exterieur fixée au mur-->
    <!--          </span>-->
    <!--        </label>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div class="row mb-15">-->
    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">Emplacement du chauffe-eau (ou de la chaudière) existante</label>-->
    <!--        <Field-->
    <!--            type="number"-->
    <!--            name="emplacementCetExistante"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--        </Field>-->
    <!--      </div>-->

    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">Emplacement du chauffe-eau thermodynamique</label>-->
    <!--        <Field-->
    <!--            type="number"-->
    <!--            name="emplacementCetNew"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--        </Field>-->
    <!--      </div>-->

    <!--      <div class="col-md-4 fv-row">-->
    <!--        <label class="form-label mb-3">Distance entre le ballon et l’unité exterieur</label>-->
    <!--        <Field-->
    <!--            type="number"-->
    <!--            name="distanceBallonUnitExt"-->
    <!--            class="form-control form-control-lg form-control-solid"-->
    <!--        >-->
    <!--        </Field>-->
    <!--      </div>-->
    <!--    </div>-->

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CetList } from '@/types/v2/File/Cet/CetList';
import Step5Form from '@/components/DCI/wizzard-file/Step5Form.vue';
import { cetWorksheetBuilder } from '@/services/file/wizzard/cet/step5Service';

export default defineComponent( {
                                  name:       'cet-step-5',
                                  components: {
                                    Step5Form,
                                  },
                                  props:      {
                                    lists: Object as () => CetList,
                                  },
                                  setup() {
                                    return {
                                      worksheetBuilder: cetWorksheetBuilder(),
                                    };
                                  },
                                } );
</script>
