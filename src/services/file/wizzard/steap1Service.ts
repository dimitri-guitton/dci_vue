import { FileStep } from '@/types/v2/Wizzard/FileStep';
import { AssentForm } from '@/types/v2/Wizzard/AssentForm';
import SvairAvisImpot from '@/types/SvairAvisImpot';
import { DataGouv } from '@/types/v2/File/Common/DataGouv';
import { addAssent } from '@/services/data/dataService';
import Svair from 'svair-api/index';
import { Assent } from '@/types/v2/File/Common/Assent';

/**
 * Promise
 * @param promise
 */
const promiseEvery = ( promise ) => {
    return promise.then(
        ( v ) => ( { result: v, status: 'resolved' } ),
        ( e ) => ( { result: e, status: 'rejected' } ),
    );
};

/**
 * Check un avis d'impot avec l'api du gouvernement
 * @param assents
 */
const checkAssentOnSvair = async ( assents: AssentForm[] ) => {
    const svair                         = new Svair( 'https://cfsmsp.impots.gouv.fr' );
    const svairCall: Promise<unknown>[] = [];

    assents.forEach( ( assent ) => {
        const { numFiscal, refAvis } = assent;

        const p = new Promise( ( resolve, reject ) => {
            svair( numFiscal, refAvis, ( err, resp ) => {
                if ( err ) {
                    reject( new Error( err ) );
                } else {
                    resolve( { resp, item: assent } );
                }
            } );
        } );
        svairCall.push( p );
    } );

    return await Promise.all( svairCall.map( promiseEvery ) );
};

/**
 * Validation de l'étape 1
 * @param data
 */
export const validateStepOne = async ( data: FileStep ): Promise<{ assents: Assent[]; formData: FileStep }> => {
    // Avis à vérifier pas l'api Svair
    const assentsToSvair: AssentForm[] = [];

    data.assents.forEach( assent => {
        if ( assent.numFiscal !== '' && assent.refAvis !== '' ) {
            assentsToSvair.push( assent );
        }
    } );

    const assents: Assent[] = [];
    if ( assentsToSvair.length === 0 ) {
        return {
            assents,
            formData: data,
        };
    }

    const svairData = await checkAssentOnSvair( assentsToSvair );


    let index = 0;

    svairData.forEach( ( response: { result: { item: AssentForm; resp: SvairAvisImpot }; status: string } ) => {
        const isResolved = response.status === 'resolved';

        // Si l'avis d'impos est bon on ajoute les données récupérées
        if ( isResolved ) {
            const datagouv: DataGouv = {
                refAvis:   response.result.item.refAvis,
                numFiscal: response.result.item.numFiscal,
                loaded:    isResolved,
                nom:       response.result.resp.declarant1.nom,
                prenom:    response.result.resp.declarant1.prenoms,
                adresse:   response.result.resp.foyerFiscal.adresse,
                ville:     response.result.resp.foyerFiscal.ville,
                revenu:    response.result.resp.revenuFiscalReference,
                error:     !isResolved,
            };

            // Par défaut le premier avis d'impot est sélectionner
            let isBeneficiary = false;
            if ( index === 0 ) {
                isBeneficiary = true;
            }

            // Ajooute l'avis dans le json si il n'existe pas
            const newAssent = addAssent( response.result.resp, datagouv, isBeneficiary );

            assents.push( newAssent );

            // On set les values pour l'étape2 avec les données récupérer
            data.assentsDatas[ index ] = {
                civility:  newAssent.civility,
                lastName:  newAssent.nom,
                firstName: newAssent.prenom,
                address:   newAssent.adresse,
                zipCode:   newAssent.codepostal,
                city:      newAssent.ville,
                income:    newAssent.revenu,
            };
            index++;
        }

    } );

    return {
        assents,
        formData: data,
    };
};
