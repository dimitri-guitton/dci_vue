# Ajout d'un nouveau devis

1. Créer les types TypeScript dans `src/types/v2/File/[slug_devis]`
2. Ajouter les nouvelles constantes dans `src/services/constantService.ts`
    * `FILE[slug_devis]`
    * `FILE[slug_devis]_TYPE`
    * `LIST_FILE_TYPE`
3. Dans le fichier `src/services/sqliteService.ts`
   * Mettre à jour `fileTypes` en ajoutant le nouveau type de devis
3. Ajouter une nouvelle interface `[slug]FileStep` dans `src/types/v2/Wizzard/FileStep.ts`
    * Il peut être nécessaire de créer de nouvelles interfaces dans :
        * `src/types/v2/Wizzard/step3`
        * `src/types/v2/Wizzard/step4`
        * `src/types/v2/Wizzard/step5`
4. Dans `src/types/v2/File/All.ts` ajouter les nouvelles interfaces dans _AllFile_ et _AllQuotation_
4. Dans `src/services/data/dataService.ts` ajouter une nouvelle méthode `getCurrent[slug_devis]FileData`
5. Créer les services `src/services/file/wizzard/[slug_devis]`
    * `src/services/file/wizzard/[slug_devis]/step3Service.ts`
    * `src/services/file/wizzard/[slug_devis]/step4Service.ts`
    * `src/services/file/wizzard/[slug_devis]/step5Service.ts`
6. Créer le composant `src/views/file/[slug_devis]`
    * Copier le contenu depuis un autre composant similaire et modifier les données pour correspondre au nouveau devis
7. Créer la route `/file-[slug_devis]-edit` dans `src/router/index.ts`
8. Dans `src/services/pdf/quotationGenerator.ts` mettre à jour différentes méthodes:
    * `_getHeaderCertificate`
   * `_getHousingData`
    * `_getPriceColumn`
