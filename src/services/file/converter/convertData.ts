import { QuotationText } from '@/types/v2/File/Common/QuotationText';
import { Beneficiary } from '@/types/v2/File/Common/Beneficiary';
import { Assent } from '@/types/v2/File/Common/Assent';
import { DataGeoportail } from '@/types/v2/File/Common/DataGeoportail';
import { Scale } from '@/types/v2/File/Common/Scale';
import { BlankOption } from '@/types/v2/File/Common/BlankOption';
import { Option } from '@/types/v2/File/Common/Option';

export const getObjectData = ( data: any, keys: any[] ): any => {
    // Si l'élément n'existe pas on retourne un objet vide ou un string
    if ( keys.length > 1 && data[ keys[ 0 ] ] === undefined ) {
        return {};
    } else if ( keys.length > 0 && data[ keys[ 0 ] ] === undefined ) {
        return '';
    }

    // Retourne la data quand l'array keys est vide
    if ( keys.length === 0 ) {
        return data;
    } else {
        const elem = keys.shift();
        return getObjectData( data[ elem ], keys );
    }
};

export const getStringData = ( data: any ): string => {
    return data === undefined ? '' : data;
};

export const getNumberData = ( data: any ): number => {
    return data === undefined ? 0 : +data;
};

export const getBoolData = ( data: any ): boolean => {
    return data === undefined ? false : data;
};

export const getArrayData = ( data: any ): [] => {
    return data === undefined ? [] : data;
};

export const convertOldText = ( oldData ): QuotationText[] => {
    const texts: QuotationText[] = [];
    if ( getObjectData( oldData, [ 'devis', 'texte1' ] ) !== '' ) {
        texts.push( {
                        title: getObjectData( oldData, [ 'devis', 'texte1', 'title' ] ),
                        text:  getObjectData( oldData, [ 'devis', 'texte1', 'text' ] ),
                    } );
    }
    if ( getObjectData( oldData, [ 'devis', 'texte2' ] ) !== '' ) {
        texts.push( {
                        title: getObjectData( oldData, [ 'devis', 'texte2', 'title' ] ),
                        text:  getObjectData( oldData, [ 'devis', 'texte2', 'text' ] ),
                    } );
    }
    if ( getObjectData( oldData, [ 'devis', 'texte3' ] ) !== '' ) {
        texts.push( {
                        title: getObjectData( oldData, [ 'devis', 'texte3', 'title' ] ),
                        text:  getObjectData( oldData, [ 'devis', 'texte3', 'text' ] ),
                    } );
    }

    if ( getObjectData( oldData, [ 'devis', 'texte4' ] ) !== '' ) {
        texts.push( {
                        title: getObjectData( oldData, [ 'devis', 'texte4', 'title' ] ),
                        text:  getObjectData( oldData, [ 'devis', 'texte4', 'text' ] ),
                    } );
    }

    return texts;
};

export const convertOldBeneficiary = ( oldData ): Beneficiary => {

    let income = 0;
    for ( const avis of oldData[ 'avis' ] ) {
        if ( avis.isbeneficiaire ) {
            income = avis.revenu;
        }
    }

    return {
        civility:  getObjectData( oldData, [ 'beneficiaire', 'civilite' ] ),
        lastName:  getObjectData( oldData, [ 'beneficiaire', 'nom' ] ),
        firstName: getObjectData( oldData, [ 'beneficiaire', 'prenom' ] ),
        address:   getObjectData( oldData, [ 'beneficiaire', 'adresse' ] ),
        zipCode:   getObjectData( oldData, [ 'beneficiaire', 'codepostal' ] ),
        city:      getObjectData( oldData, [ 'beneficiaire', 'ville' ] ),
        email:     getStringData( oldData[ 'email' ] ),
        phone:     getStringData( oldData[ 'telfixe' ] ),
        mobile:    getStringData( oldData[ 'telportable' ] ),
        income:    income,
    };
};

export const convertOldAssent = ( oldData ): Assent[] => {
    const assents: Assent[] = [];
    const oldAssents: []    = getArrayData( oldData[ 'avis' ] );
    oldAssents.forEach( assent => {
        assents.push( {
                          // uid:            assent[ 'uid' ],
                          refAvis:       assent[ 'refAvis' ],
                          numFiscal:     assent[ 'numFiscal' ],
                          isBeneficiary: assent[ 'isbeneficiaire' ],
                          datagouv:      {
                              refAvis:   assent[ 'datagouv' ][ 'refAvis' ],
                              numFiscal: assent[ 'datagouv' ][ 'numFiscal' ],
                              loaded:    assent[ 'datagouv' ][ 'loaded' ],
                              nom:       assent[ 'datagouv' ][ 'nom' ],
                              prenom:    assent[ 'datagouv' ][ 'prenom' ],
                              adresse:   assent[ 'datagouv' ][ 'adresse' ],
                              ville:     assent[ 'datagouv' ][ 'ville' ],
                              revenu:    assent[ 'datagouv' ][ 'revenu' ],
                              error:     assent[ 'datagouv' ][ 'error' ],
                          },
                          nom:           assent[ 'nom' ],
                          prenom:        assent[ 'prenom' ],
                          adresse:       assent[ 'adresse' ],
                          codepostal:    assent[ 'codepostal' ],
                          ville:         assent[ 'ville' ],
                          revenu:        assent[ 'revenu' ],
                          civility:      assent[ 'civilite' ],
                      } );
    } );

    return assents;
};

export const convertOldDataGeoportail = ( oldData ): DataGeoportail | null => {
    let dataGeoportail: DataGeoportail | null = null;

    if ( getObjectData( oldData, [ 'logement', 'dataGeoportail' ] ) !== '' ) {
        dataGeoportail = {
            zoom:     oldData[ 'logement' ][ 'dataGeoportail' ][ 'zoom' ],
            center:   oldData[ 'logement' ][ 'dataGeoportail' ][ 'center' ],
            position: oldData[ 'logement' ][ 'dataGeoportail' ][ 'position' ],
            zipCode:  oldData[ 'logement' ][ 'dataGeoportail' ][ 'codepostal' ],
            city:     oldData[ 'logement' ][ 'dataGeoportail' ][ 'ville' ],
            address:  oldData[ 'logement' ][ 'dataGeoportail' ][ 'adresse' ],
            plot:     oldData[ 'logement' ][ 'dataGeoportail' ][ 'parcelle' ],
        };
    }

    return dataGeoportail;
};

export const convertOldScales = ( oldData ): Scale[] => {
    const scales: Scale[] = [];
    const oldScales: []   = getArrayData( oldData[ 'baremes' ] );
    oldScales.forEach( scale => {
        const stages: {
            nbr: number;
            min: number;
            max: number;
        }[] = [];

        const oldStages: [] = getArrayData( scale[ 'palierRevenu' ] );

        oldStages.forEach( stage => {
            {
                stages.push( {
                                 nbr: stage[ 'nbre' ],
                                 min: stage[ 'min' ],
                                 max: stage[ 'max' ],
                             } );
            }
        } );

        scales.push( {
                         stages:   stages,
                         code:     scale[ 'code' ],
                         ceeBonus: {
                             h1: scale[ 'primeCEE' ][ 'H1' ],
                             h2: scale[ 'primeCEE' ][ 'H3' ],
                             h3: scale[ 'primeCEE' ][ 'H1' ],
                         },
                     } )
        ;
    } );

    return scales;
};

export const convertOldBlankOptions = ( oldData ): BlankOption[] => {
    const blankOptions: BlankOption[] = [];
    const oldBlankOptions: []         = getArrayData( oldData[ 'devis' ][ 'blankOptions' ] );

    oldBlankOptions.forEach( option => {
        blankOptions.push( {
                               id:    option[ 'id' ],
                               label: option[ 'label' ],
                               unit:  option[ 'unit' ],
                               pu:    option[ 'pu' ],
                               value: option[ 'value' ],
                           } );
    } );

    return blankOptions;
};

export const convertOldOptions = ( oldData ): Option[] => {
    const newOptions: Option[] = [];
    const oldOption: []        = getArrayData( oldData[ 'devis' ][ 'options' ] );

    const type = oldData[ 'type' ].toLowerCase();
    console.log( 'Type des options -->', type );
    let fileType = 'default';

    if ( type === 'pac' && oldData[ 'pacType' ].toLowerCase() === 'ro' ) {
        fileType = 'pac_ro';
    } else if ( type === 'pac' && oldData[ 'pacType' ].toLowerCase() === 'rr' ) {
        fileType = 'pac_rr';
    } else if ( type === 'cet' ) {
        fileType = 'cet';
    } else if ( type === 'poele' ) {
        fileType = 'pg';
    } else if ( type === 'comble' ) {
        fileType = 'comble';
    } else if ( type === 'sol' ) {
        fileType = 'sol';
    }

    let index = 1;
    oldOption.forEach( option => {
        newOptions.push( {
                             id:            option[ 'id' ],
                             fileType,
                             label:         option[ 'label' ],
                             unit:          option[ 'unit' ],
                             defaultPu:     option[ 'default' ],
                             pu:            option[ 'value' ],
                             defaultNumber: option[ 'value' ],
                             number:        option[ 'value' ],
                             position:      index,
                         } );

        index++;
    } );

    return newOptions;
};


export const convertOldTotalHt = ( oldData ): number => {
    return oldData[ 'devis' ][ 'totalHT' ] !== undefined ? oldData[ 'devis' ][ 'totalHT' ] : 0;
};

export const convertOldTotalTva = ( oldData ): number => {
    return oldData[ 'devis' ][ 'totalTVA' ] !== undefined ? oldData[ 'devis' ][ 'totalTVA' ] : 0;
};

export const convertOldStatusDci = ( oldData ): number => {
    return oldData[ 'statutInDCI' ] !== undefined ? oldData[ 'statutInDCI' ] : 1;
};

export const convertOldErrorStatusDci = ( oldData ): number[] => {
    return oldData[ 'statutInDCIErrors' ] !== undefined ? oldData[ 'statutInDCIErrors' ] : [];
};
