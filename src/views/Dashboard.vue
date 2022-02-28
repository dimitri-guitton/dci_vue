<template>

  <div id="map" class="mb-5"></div>
  <button @click="convertOldJsonToNewJson" class="btn btn-info mx-2 my-2">UPDATE OLD JSON</button>
  <button @click="testPdf('address')" class="btn btn-dark mx-2 my-2">PDF Adresse</button>
  <button @click="testPdf('devis')" class="btn btn-dark mx-2 my-2">PDF Devis CET</button>
  <button @click="testPdf('fiche')" class="btn btn-dark mx-2 my-2">PDF Fiche CET</button>
  <button @click="testPdf('cc')" class="btn btn-dark mx-2 my-2">PDF Cadre contribution</button>
  <button @click="testPdf('renov')" class="btn btn-dark mx-2 my-2">PDF MaPrimeRenov</button>
  <button @click="testPdf('tva')" class="btn btn-dark mx-2 my-2">PDF TVA</button>
  <!--  begin::Dashboard-->
  <div class="row gy-5 g-xl-12 mt-10">
    <div class="col-xxl-6">
      <MixedWidget2
          widget-classes="card-xl-stretch mb-xl-8"
          widget-color="danger"
          chart-height="200"
          stroke-color="#cb1e46"
      ></MixedWidget2>
    </div>
    <div class="col-xxl-6">
      <MixedWidget7
          widget-classes="card-xxl-stretch-50 mb-5 mb-xl-8"
          chart-color="primary"
          chart-height="150"
      ></MixedWidget7>
      <MixedWidget10
          widget-classes="card-xxl-stretch-50 mb-5 mb-xl-8"
          chart-color="primary"
          chart-height="168"
      ></MixedWidget10>
    </div>
  </div>

  <div class="row g-5 gx-xxl-12">
    <div class="col-xxl-6">
      <MixedWidget5
          widget-classes="card-xl-stretch mb-xl-8"
          chart-color="success"
          chart-height="150"
      ></MixedWidget5>
    </div>
  </div>
  <!--  end::Dashboard-->
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import MixedWidget2 from '@/components/widgets/mixed/Widget2.vue';
import MixedWidget5 from '@/components/widgets/mixed/Widget5.vue';
import MixedWidget7 from '@/components/widgets/mixed/Widget7.vue';
import MixedWidget10 from '@/components/widgets/mixed/Widget10.vue';
import { setCurrentPageTitle } from '@/core/helpers/breadcrumb';
import { convertAllOldJsonToNewJson } from '@/services/folder/folderService';
// import { geocodingAddress } from '@/services/geocodingService';
// import * as Gp from '@ignf-geoportal/sdk-2d';
import { NewAddressGenerator } from '@/services/pdf/newAddressGenerator';
import { CetFile } from '@/types/v2/File/Cet/CetFile';
import { QuotationGenerator } from '@/services/pdf/quotationGenerator';
import { WorksheetGenerator } from '@/services/pdf/worksheetGenerator';
import { ContributionFrameworkGenerator } from '@/services/pdf/contributionFrameworkGenerator';
import { MaPrimeRenovGenerator } from '@/services/pdf/maPrimeRenovGenerator';
import { TvaCertificateGenerator } from '@/services/pdf/tvaCertificateGenerator';
// import pdfMake from 'pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

export default defineComponent( {
                                  name:       'dashboard',
                                  components: {
                                    MixedWidget2,
                                    MixedWidget5,
                                    MixedWidget7,
                                    MixedWidget10,
                                  },
                                  setup() {
                                    setCurrentPageTitle( 'Tableau de bord' );
                                    console.log( 'Version de l\'app : ', process.env.VUE_APP_VERSION );
                                    console.log( 'Environnement : ', process.env.NODE_ENV );
                                    console.log( 'URL API : ', process.env.VUE_APP_API_URL );
                                    onMounted( async () => {
                                      // On récupère les coordonnées de l'adresse
                                      // let coordinate = await geocodingAddress( '79000 Niort' );
                                      // if ( coordinate === null ) {
                                      //   coordinate = [ 46.160329, -1.151139 ];
                                      // }

                                      // Gp.Map.load(
                                      //     'map', // html div
                                      //     {
                                      //       apiKey:  'essentiels,cartes,parcellaire',
                                      //       zoom:    18,
                                      //       maxZoom: 20,
                                      //       minZoom: 6,
                                      //       center:  {
                                      //         x:          coordinate[ 0 ],
                                      //         y:          coordinate[ 1 ],
                                      //         projection: 'CRS:84',
                                      //       },
                                      //       // layers to display
                                      //       layersOptions: {
                                      //         'ORTHOIMAGERY.ORTHOPHOTOS': {
                                      //           opacity: 0.7,
                                      //         },
                                      //         'CADASTRALPARCELS.PARCELS': {},
                                      //       },
                                      //       // additional tools to display on the map
                                      //       controlsOptions: {
                                      //         'layerSwitcher': {},
                                      //         'drawing':       {},
                                      //         'length':        {},
                                      //         'area':          {},
                                      //       },
                                      //     },
                                      // );
                                    } );

                                    const testPdf = ( type: string ) => {
                                      const rawdata  = '{"version":"1","type":"cet","ref":"ID_COM-20220225152359-CET","folderName":"ID_COM-20220225152359-CET (JHON DOE)","createdAt":"25/02/2022","updatedAt":"25/02/2022","settings":{"ceeCoef":"5.5"},"disabledBonus":false,"disabledCeeBonus":false,"enabledHousingAction":false,"disabledMaPrimeRenovBonus":false,"assents":[{"numFiscal":"0300000343434","refAvis":"76867867667867","civility":"m","isBeneficiary":true,"nom":"Jhon","prenom":"Doe","adresse":"18 Avenue Jean-Moulin","codepostal":"75000","ville":"Paris","revenu":"12000"}],"beneficiary":{"civility":"m","lastName":"Jhon","firstName":"Doe","address":"18 Avenue Jean-Moulin","zipCode":"75000","city":"Paris","email":"jhon.doe@test.fr","phone":"0253461295","mobile":"0634235434","income":"12000"},"codeBonus":null,"energyZone":"H1","housing":{"nbOccupant":"4","type":"maison_individuelle","buildingNature":"nouvelle_residence","heatingType":"combustible","isRentedHouse":false,"isAddressBenef":true,"address":"18 Avenue Jean-Moulin","zipCode":"75000","city":"Paris","plot":"","area":0,"dataGeoportail":{},"location":"","insulationQuality":"","constructionYear":"1990","lessThan2Years":false,"availableVoltage":""},"worksheet":{"period":"2022-03-30","niveauHabitation":"pp","typeChantier":"reno","disjoncteur":false,"tensionDisponible":"monophase","distanceCompteurCet":"10","natureMurExt":"beton","naturePlafond":"beton","visiteComble":true,"chantierHabite":true,"grandeEchelle":false,"demandeVoirie":true,"puissanceCompteur":18,"accesComble":"toit","rueEtroite":true,"typeCouverture":"tige_bottes","etatToiture":"mousse_important","typeCharpente":"traditionnelle","nbCompartimentComble":1,"presenceVolige":true,"nbAccesComble":1,"emplacementCetExistante":"Salon","emplacementCetNew":"Cuisine","aspirationType":"aspiration_extraction_gainee","ballonFixeMur":true,"uniteExtFixeMur":true,"distanceBallonUnitExt":"5","infosSup":"RAS","nbrCompartementComble":"1","nbrAccesComble":"2"},"quotation":{"origin":"Internet","dateTechnicalVisit":"2022-02-25","executionDelay":"2022-03-06","options":[{"id":1,"fileType":"cet","label":"Forfait accessoire nécessaire à la pose, au raccordement de l’installation","unit":"u","defaultPu":100,"pu":100,"defaultNumber":1,"number":1},{"id":2,"fileType":"cet","label":"Forfait pose ( Pose nouvel appareil, mise en service)","unit":"u","defaultPu":350,"pu":"375","defaultNumber":1,"number":1},{"id":3,"fileType":"cet","label":"Raccordement extérieur par chapeau de toiture","unit":"u","defaultPu":100,"pu":100,"defaultNumber":0,"number":0},{"id":4,"fileType":"cet","label":"Raccordement extérieur mural","unit":"u","defaultPu":100,"pu":100,"defaultNumber":0,"number":0}],"blankOptions":[{"id":"sup1","label":"","unit":"u","pu":0,"number":0},{"id":"sup2","label":"","unit":"u","pu":0,"number":0}],"commentary":"","partner":"VTE","texts":[{"title":"Modalité de paiement : Prime CEE  versée directement à Eco Atlantique par Vos Travaux Eco","text":"Les travaux prévus dans ce devis peuvent être conditionnels à un dépôt de déclaration préalable de travaux. Il revient au maître d\'ouvrage (le client) d\'en faire lui-même la demande.\\r\\nLa TVA à taux réduit de 5,5% ne s\'applique qu\'à des commandes passées par des particuliers et relative à des locaux à usage d\'habitation dont la construction est achevée depuis plus de deux ans.\\r\\n\\r\\nLes travaux relatifs à ce document sont éligibles au dispositif des certificats d\'économies d\'énergie. Dans ce cadre, l\'obligé \\"Vos Travaux Eco\\", grâce à son partenaire Eco Atlantique, me fait bénéficier d\'une Prime énergie, dont le montant sera avancé par Eco Atlantique et remboursé par Vos Travaux Eco à Eco Atlantique.\\r\\n\\r\\n* « Dans le cas où l\'aide notifiée au client est inférieure au montant de l\'aide prévisionnelle, l\'usager n\'est pas lié par le devis et l\'entreprise s\'engage à proposer un devis rectificatif. Le client conserve alors un droit de rétractation d\'une durée de quatorze jours à partir de la date de présentation du devis rectificatif.L\'aide MaPrimeRénov\' est conditionnelle et soumise à la conformité des pièces justificatives et informations déclarées par le bénéficiaire. En cas de fausse déclaration, de manœuvre frauduleuse ou de changement du projet de travaux subventionnés, le bénéficiaire s\'expose au retrait et reversement de tout ou partie de l\'aide. Les services de l\'Anah pourront faire procéder à tout contrôle des engagements et sanctionner le bénéficiaire et son mandataire éventuel des manquements constatés »."},{"title":"AIDE A LA RENOVATION ÉNERGÉTIQUE VERSÉE DIRECTEMENT À ECO ATLANTIQUE PAR ACTION LOGEMENT","text":"*«Dans le cas où l’aide notifiée au client est inférieure au montant de l’aide prévisionnelle, l’usager n’est pas lié par le devis et l’entreprise s’engage à proposer un devis rectificatif. Le client conserve alors un droit de rétractation d’une durée de quatorze jours à partir de la date de présentation du devis rectificatif. L’aide « Action Logement » est conditionnelle et soumise à la conformité des pièces justificatives et informations déclarées par le bénéficiaire."}],"tva":5.5,"ceeBonus":84.24,"selectedProducts":[{"id":4,"productType":"cet","label":"CHAUFFE EAU THERMODYNAMIQUE ATLANTIC CALYPSO 270L","reference":"CETACSP270","pu":2666,"defaultPu":2666,"description":"Capacité: 270L SPLIT\\r\\nDimensions HxLxP: 1600*588*652mm poids 55kg\\r\\nPuissance acoustique du groupe: 55 dBa\\r\\nFluide: R513a\\r\\nPuissance max absorbée en PAC: 650W\\r\\nPlage de fonctionnement: -5/+43°c  \\r\\nAppoint électrique: 1800W\\r\\nCOP: 3,18 – Profil de soutirage : L pour une efficacité énergétique de 124%\\r\\nClasse energetique: A+\\r\\nDimesion groupe exterieur HxLxP: 535*743*293 poids 26kg","size":"HxLxP: 1600*588*652","type":"split"}],"products":[{"id":1,"productType":"cet","label":"CHAUFFE EAU THERMODYNAMIQUE ATLANTIC CALYPSO 200L","reference":"CETACMO200","pu":2578,"defaultPu":2578,"description":"Capacité: 200L MONOBLOC\\r\\nDimensions HxLxP: 1689*602*691\\r\\nPuissance acoustique: 50 dBa\\r\\nFluide: R513a\\r\\nPuissance max absorbée en PAC: 650W\\r\\nPlage de fonctionnement: -5/+43°c\\r\\nAppoint électrique: 1800W\\r\\nCOP: 3,18 – Profil de soutirage : L\\r\\nClasse energetique: A+\\r\\n\\r\\nFonctionne sur air ambiant si volume de la pièce> 20M3","size":"HxLxP: 1689*602*691","type":"mono"},{"id":2,"productType":"cet","label":"CHAUFFE EAU THERMODYNAMIQUE ATLANTIC CALYPSO 250L","reference":"CETACMO250","pu":2675,"defaultPu":2675,"description":"Capacité: 250L MONOBLOC\\r\\nDimensions HxLxP: 1929*602*691\\r\\nPuissance acoustique: 50 dBa\\r\\nFluide: R513a\\r\\nPuissance max absorbée en PAC: 650W\\r\\nPlage de fonctionnement: -5/+43°c \\r\\nAppoint électrique: 1800W\\r\\nCOP: 3,12 – Profil de soutirage : L\\r\\nClasse energetique: A+\\r\\n\\r\\nFonctionne sur air ambiant si volume de la pièce> 20M3","size":"HxLxP: 1929*602*691","type":"mono"},{"id":3,"productType":"cet","label":"CHAUFFE EAU THERMODYNAMIQUE ATLANTIC CALYPSO 200L","reference":"CETACSP200","pu":2456,"defaultPu":2456,"description":"Capacité: 200L SPLIT\\r\\nDimensions HxLxP: 1267*588*603mm poids 55kg\\r\\nPuissance acoustique du groupe: 55 dBa\\r\\nFluide: R513a\\r\\nPuissance max absorbée en PAC: 650W\\r\\nPlage de fonctionnement: -5/+43°c \\r\\nAppoint électrique: 1800W\\r\\nCOP: 3,18 – Profil de soutirage : L\\r\\nClasse energetique: A+\\r\\nDimesion groupe exterieur HxLxP: 535*743*293 poids 26kg","size":"HxLxP: 1267*588*60","type":"split"},{"id":4,"productType":"cet","label":"CHAUFFE EAU THERMODYNAMIQUE ATLANTIC CALYPSO 270L","reference":"CETACSP270","pu":2666,"defaultPu":2666,"description":"Capacité: 270L SPLIT\\r\\nDimensions HxLxP: 1600*588*652mm poids 55kg\\r\\nPuissance acoustique du groupe: 55 dBa\\r\\nFluide: R513a\\r\\nPuissance max absorbée en PAC: 650W\\r\\nPlage de fonctionnement: -5/+43°c  \\r\\nAppoint électrique: 1800W\\r\\nCOP: 3,18 – Profil de soutirage : L pour une efficacité énergétique de 124%\\r\\nClasse energetique: A+\\r\\nDimesion groupe exterieur HxLxP: 535*743*293 poids 26kg","size":"HxLxP: 1600*588*652","type":"split"}],"maPrimeRenovBonus":1200,"discount":0,"totalHt":3141,"totalTva":172.755,"totalTtc":3313.755,"remainderToPay":2029.515},"scales":[{"stages":[{"nbr":1,"min":0,"max":15262},{"nbr":2,"min":0,"max":22320},{"nbr":3,"min":0,"max":26844},{"nbr":4,"min":0,"max":31359},{"nbr":5,"min":0,"max":35894},{"nbr":6,"min":0,"max":40420},{"nbr":7,"min":0,"max":44946},{"nbr":8,"min":0,"max":49472},{"nbr":9,"min":0,"max":53998},{"nbr":10,"min":0,"max":58524},{"nbr":11,"min":0,"max":63050},{"nbr":12,"min":0,"max":67576},{"nbr":13,"min":0,"max":72102}],"code":"GP","ceeBonus":{"h1":{"appartement":130.9,"maison_individuelle":171.6},"h2":{"appartement":130.9,"maison_individuelle":171.6},"h3":{"appartement":130.9,"maison_individuelle":171.6}}},{"stages":[{"nbr":1,"min":0,"max":19565},{"nbr":2,"min":0,"max":28614},{"nbr":3,"min":0,"max":34411},{"nbr":4,"min":0,"max":40201},{"nbr":5,"min":0,"max":46015},{"nbr":6,"min":0,"max":51812},{"nbr":7,"min":0,"max":57609},{"nbr":8,"min":0,"max":63406},{"nbr":9,"min":0,"max":69203},{"nbr":10,"min":0,"max":75000},{"nbr":11,"min":0,"max":80797},{"nbr":12,"min":0,"max":86594},{"nbr":13,"min":0,"max":92391}],"code":"P","ceeBonus":{"h1":{"appartement":65.45,"maison_individuelle":85.8},"h2":{"appartement":65.45,"maison_individuelle":85.8},"h3":{"appartement":65.45,"maison_individuelle":85.8}}},{"stages":[{"nbr":1,"min":0,"max":29148},{"nbr":2,"min":0,"max":42848},{"nbr":3,"min":0,"max":51592},{"nbr":4,"min":0,"max":60336},{"nbr":5,"min":0,"max":69081},{"nbr":6,"min":0,"max":77825},{"nbr":7,"min":0,"max":86569},{"nbr":8,"min":0,"max":95313},{"nbr":9,"min":0,"max":104057},{"nbr":10,"min":0,"max":112801},{"nbr":11,"min":0,"max":121545},{"nbr":12,"min":0,"max":130289},{"nbr":13,"min":0,"max":139033}],"code":"IT","ceeBonus":{"h1":{"appartement":65.45,"maison_individuelle":85.8},"h2":{"appartement":65.45,"maison_individuelle":85.8},"h3":{"appartement":65.45,"maison_individuelle":85.8}}},{"stages":[{"nbr":1,"min":0,"max":29148},{"nbr":2,"min":0,"max":42848},{"nbr":3,"min":0,"max":51592},{"nbr":4,"min":0,"max":60336},{"nbr":5,"min":0,"max":69081},{"nbr":6,"min":0,"max":77825},{"nbr":7,"min":0,"max":86569},{"nbr":8,"min":0,"max":95313},{"nbr":9,"min":0,"max":104057},{"nbr":10,"min":0,"max":112801},{"nbr":11,"min":0,"max":121545},{"nbr":12,"min":0,"max":130289},{"nbr":13,"min":0,"max":139033}],"code":"CL","ceeBonus":{"h1":{"appartement":65.45,"maison_individuelle":85.8},"h2":{"appartement":65.45,"maison_individuelle":85.8},"h3":{"appartement":65.45,"maison_individuelle":85.8}}}],"statusInDci":2,"errorsStatusInDci":[],"technician":{"id":1,"lastName":"Durand","firstName":"Pierre","phone":"0643234323"},"lists":{"localTypeList":[{"slug":"maison_individuelle","value":"Maison individuelle"},{"slug":"appartement","value":"Appartement"}],"qualiteIsolationList":[{"slug":"0.6","value":"0.6"},{"slug":"0.65","value":"0.65"},{"slug":"0.8","value":"0.8"},{"slug":"0.9","value":"0.9"},{"slug":"1","value":"1"},{"slug":"1.1","value":"1.1"},{"slug":"1.3","value":"1.3"},{"slug":"1.5","value":"1.5"}],"statutMenageTypeList":[{"slug":"tres_bonifie","value":"Très bonfié"},{"slug":"bonifie","value":"Bonfié"},{"slug":"classique","value":"Classique"},{"slug":"intermediaire","value":"Intermédiaire"}],"batimentNatureList":[{"slug":"","value":"-"},{"slug":"nouvelle_residence","value":"Nouvelle résidence principale"},{"slug":"location","value":"Location"},{"slug":"residence_secondaire","value":"Résidence secondaire"}],"naturePlafondList":[{"slug":"brique","value":"Brique"},{"slug":"placo","value":"Placo"},{"slug":"bois","value":"Bois"},{"slug":"beton","value":"Béton"}],"niveauHabitationList":[{"slug":"pp","value":"Plein Pied"},{"slug":"r1","value":"R+1"},{"slug":"r2","value":"R+2"},{"slug":"r3","value":"R+3"},{"slug":"r4","value":"R+4"},{"slug":"autre","value":"AUTRE"}],"typeChantierList":[{"slug":"neuf","value":"Neuf"},{"slug":"reno","value":"Reno"}],"accesCombleList":[{"slug":"trappe","value":"TRAPPE"},{"slug":"toit","value":"TOITURE"},{"slug":"trappe_et_toit","value":"TRAPPE et TOITURE"}],"typeCouvertureList":[{"slug":"meca","value":"Mecanique"},{"slug":"tige_bottes","value":"Tiges de bottes"},{"slug":"ardoise","value":"Ardoise"},{"slug":"tuiles_plates","value":"Tuiles plates"},{"slug":"tuiles_courbes","value":"Tuiles courbes"}],"typeCharpenteList":[{"slug":"trad","value":"Traditionnelle"},{"slug":"ferm","value":"Fermettes"},{"slug":"metal","value":"Metallique"},{"slug":"autre","value":"Autre"}],"etatToitureList":[{"slug":"propre","value":"Propre"},{"slug":"mousse_faible","value":"Mousse en petite quantité"},{"slug":"mousse_important","value":"Mousse importante"}],"puissanceCompteurList":[{"slug":3,"value":3},{"slug":6,"value":6},{"slug":9,"value":9},{"slug":12,"value":12},{"slug":18,"value":18}],"natureMurExtList":[{"slug":"parpaing","value":"Parpaing"},{"slug":"brique","value":"Brique"},{"slug":"beton","value":"Béton"},{"slug":"pierre","value":"Pierre"},{"slug":"bois","value":"Bois"}],"chauffageTypeList":[{"slug":"electrique","value":"Electrique"},{"slug":"combustible","value":"Combustible"}],"tensionDisponibleList":[{"slug":"monophase","value":"Monophasé"},{"slug":"triphase","value":"Triphasé"}],"aspirationTypeList":[{"slug":"none","value":"Sélectionnez un type d\'installation"},{"slug":"aspiration_extraction_gainee","value":"Aspiration et extraction gainées jusqu\'au toit (tuiles à douilles)"},{"slug":"aspiration_piece","value":"Aspiration dans la pièce (au moins 20m3) et extraction par le toit (tuile à douille)"},{"slug":"aspiration_extraction_piece","value":"Aspiration et extraction dans la pièce (au moins 20m3)"}],"typeOrigineList":[{"slug":"telephone","value":"Téléphone"},{"slug":"internet","value":"Internet"},{"slug":"presse","value":"Presse"},{"slug":"campagne-google","value":"Campagne Google"},{"slug":"autre","value":"Autre"},{"slug":"hello-watt","value":"hello watt"},{"slug":"angelique","value":"Angélique"}]}}';
                                      const fileData = ( JSON.parse( rawdata ) as CetFile );
                                      switch ( type ) {
                                        case 'address':
                                          const aG = new NewAddressGenerator( fileData.housing, fileData.beneficiary );
                                          aG.previewPdf();
                                          break;
                                        case 'devis':
                                          const dG = new QuotationGenerator( fileData );
                                          dG.previewPdf();
                                          break;
                                        case 'fiche':
                                          const fG = new WorksheetGenerator( fileData );
                                          fG.previewPdf();
                                          break;
                                        case 'cc':
                                          const cG = new ContributionFrameworkGenerator( fileData );
                                          cG.previewPdf();
                                          break;
                                        case 'renov':
                                          const rG = new MaPrimeRenovGenerator( fileData );
                                          rG.previewPdf();
                                          break;
                                        case 'tva':
                                          const tG = new TvaCertificateGenerator( fileData );
                                          tG.previewPdf();
                                          break;
                                      }
                                    };

                                    return {
                                      convertOldJsonToNewJson: convertAllOldJsonToNewJson,
                                      testPdf,
                                    };
                                  },
                                } );
</script>

<style>
#map {
  padding    : 5px;
  width      : 100%;
  height     : 600px;
  box-shadow : 0 0 10px #999999;
}
</style>
