#!/bin/bash

# MES FONCTIONS

# Créer un tag GIT
createTag()
{
#git tag "v$PACKAGE_VERSION"
#git push --tags
sed -i '' "s/${OLD_PACKAGE_VERSION}/${PACKAGE_VERSION}/" package.json
cat package.json
exit 0;
}

# Met à jour la version selon le type de nouvelle version
updateVersion()
{

#major=3
#minor=0
#fix=0
#beta=0
#
#re='([0-9]+)\.([0-9]+)\.([0-9]+)(-beta\.([0-9]+))?'
#if [[ $PACKAGE_VERSION =~ $re ]]; then
#  major=${BASH_REMATCH[1]}
#  minor=${BASH_REMATCH[2]}
#  fix=${BASH_REMATCH[3]}
#  beta=${BASH_REMATCH[5]}
#fi

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
   if [ "$OLD_PACKAGE_VERSION" != "$PACKAGE_VERSION" ]; then
       createTag PACKAGE_VERSION
   else
       echo "Error: Please try again (select 1..3)!"
   fi
   ;;
esac


#if [ "$1" != "4" ]; then
#PACKAGE_VERSION="$major.$minor.$fix"
#else
#PACKAGE_VERSION="$major.$minor.$fix-beta.$beta"
#fi

#echo "Nouvelle version : $PACKAGE_VERSION"
}

# Affiche le choix des version possible
displayChoice()
{
echo "Changement de version : "
select item in "- Majeur- " "- Mineur -" "- Fix -"
do
  updateVersion $REPLY
  break;
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

