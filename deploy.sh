#!/bin/bash

# MES FONCTIONS

# Créer un tag GIT et PUSH
createTag()
{
git tag "v$PACKAGE_VERSION"
git git push && git push --tags
}

# Met à jour la version selon le type de nouvelle version
updateVersion()
{
  error="false"
case $1 in
 1)
    npm version major
    ;;
 2)
    npm version minor
    ;;
 3)
    npm version patch
    ;;
 *)
    error="true"
   ;;
esac

echo "$error"
}

# Affiche le choix des version possible
displayChoice()
{
echo "Changement de version : "
select item in "- Majeur- " "- Mineur -" "- Fix -"
do
  error=$( updateVersion $REPLY )

  if [ "$error" == "true" ]
  then
    echo "Error: Please try again (select 1..3)!"
  else
    createTag
    break;
  fi
done
}

OLD_PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

echo "Version précédente : $OLD_PACKAGE_VERSION"

displayChoice

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

OLD_PACKAGE_VERSION=$PACKAGE_VERSION
echo "Nouvelle version" $PACKAGE_VERSION

