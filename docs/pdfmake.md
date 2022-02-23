# PDF_MAKE

---

* [Github](https://github.com/bpampuch/pdfmake)
* [Documentation](https://pdfmake.github.io/docs/0.1/)
* [Playground](http://pdfmake.org/playground.html)

---

## Ajouter des icons dans Pdfmake

* https://pdfmake.github.io/docs/0.1/fonts/icons/
* https://pdfmake.github.io/docs/0.1/fonts/custom-fonts-client-side/vfs/

### Princpe de base

1. Créer une fonte sur [fontello](http://fontello.com/) avec les icons que l'on veut
2. Ajouter la font custom, dans `node_modules/pdfmake/` ajouter un dossier `examples/fonts` si il n'existe pas et y
   ajouter les fonts que l'on veut
3. Ensuite depuis `node_modules/pdfmake/` lancer la commande `node build-vfs.js "./examples/fonts"` afin de build les
   fonts
4. Dans le code ajouter un style `icon: { font: 'Fontello' }` afin d'avoir les icons et pour utiliser un
   icon `{ text: '', style: 'icon' }`
5. Pour récuperer les les icons, lors du téléchargement de la police Fontello, aller dans le dossier css et ouvrir le
   fichier `fontello-codes.css` et depuis ce fichier on peut copier/coller les icons

**Attention :**  Il faut penser à ajouter la police roboto dans `examples/fonts` police utilisé par défaut de Pdfmake

### Modification dans notre projet

Les fonts ne sont pas dans `node_modules/pdfmake/examples/fonts` car le fichier est supprimer lors des mise à jour des
packages.

Les font sont dans `src/assets/pdfmake_fonts`

Et pour être sûr que les font sont à jour après mise à jour de package dans `postinstall` on lance la
commande `update-pdfmake-fonts`
