#!/bin/bash

# MES FONCTIONS

# Créer un tag GIT et PUSH
createTag()
{
git tag "v${PACKAGE_VERSION//[[:blank:]]/}"
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

# Lancement du script
start()
{
echo "Changement de version : "

select item in "- Majeur- " "- Mineur -" "- Fix -"
do
  error=$( updateVersion $REPLY )

  if [ "$error" == "true" ]
  then
    echo "Error: Please try again (select 1..3)!"
  else
    PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

    echo "Nouvelle version" $PACKAGE_VERSION
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

start

