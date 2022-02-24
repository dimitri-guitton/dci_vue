#!/bin/bash

# MES FONCTIONS

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

select item in "- Majeur- " "- Mineur -" "- Patch -"
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
    git push && git push --tags
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

