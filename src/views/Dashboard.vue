<template>
  <button @click="convertOldJsonToNewJson" class="btn btn-info mx-2 my-2">UPDATE OLD JSON</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { setCurrentPageTitle } from '@/core/helpers/breadcrumb';
import { convertAllOldJsonToNewJson } from '@/services/folder/folderService';
import { calcRequiredPower, getUnitExtRo } from '@/services/file/RoAlgo2';
import { PacHousing } from '@/types/v2/File/Pac/PacHousing';


export default defineComponent( {
                                  name: 'dashboard',
                                  setup() {
                                    setCurrentPageTitle( 'Tableau de bord' );
                                    console.log( 'Version de l\'app : ', process.env.VUE_APP_VERSION );
                                    console.log( 'Environnement : ', process.env.NODE_ENV );
                                    console.log( 'URL API : ', process.env.VUE_APP_API_URL );

                                    const housing: PacHousing = {
                                      nbOccupant:          1,
                                      type:                'maison_individuelle',
                                      heatingType:         '',
                                      buildingNature:      '',
                                      isRentedHouse:       false,
                                      isAddressBenef:      true,
                                      address:             '',
                                      zipCode:             '',
                                      city:                '',
                                      plot:                '',
                                      area:                100,
                                      dataGeoportail:      null,
                                      location:            '',
                                      insulationQuality:   0.8,
                                      constructionYear:    2000,
                                      lessThan2Years:      false,
                                      availableVoltage:    'triphase',
                                      buildingCoefficient: 1.4,
                                      climaticZone:        'D',
                                      altitude:            601,
                                      heaters:             'p_chauffant',
                                      ceilingHeight:       2.4,
                                      setPointTemperature: 20,
                                    };
                                    const p                   = calcRequiredPower( housing );
                                    getUnitExtRo( p, housing );
                                    return {
                                      convertOldJsonToNewJson: convertAllOldJsonToNewJson,
                                    };
                                  },
                                } );
</script>
