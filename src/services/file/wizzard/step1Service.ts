import { AssentForm } from '@/types/v2/Wizzard/AssentForm';
import SvairAvisImpot from '@/types/SvairAvisImpot';
import { DataGouv } from '@/types/v2/File/Common/DataGouv';
import { addAssent } from '@/services/data/dataService';
import Svair from 'svair-api/index';
import { Assent } from '@/types/v2/File/Common/Assent';
import * as Yup from 'yup';
import { ElLoading } from 'element-plus';
import { checkInternet } from '@/services/commonService';

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
 * @param assentOnJson  Avis déja présent dans le JSON
 */
export const validateStepOne = async ( data, assentOnJson: Assent[] ): Promise<{ assents: Assent[]; formData }> => {

    // Avis à vérifier pas l'api Svair
    const assentsToSvair: AssentForm[] = [];
    const assents: Assent[]            = [];


    if ( !checkInternet() ) {
        return {
            assents,
            formData: data,
        };
    }

    const assentAlreadyExistList: Assent[] = [];

    data.assents.forEach( assent => {
        if ( assent.numFiscal !== '' && assent.refAvis !== '' ) {

            // On check si l'avis existe déja dans le Json et s'il a des données de Datagouv
            // Si c'est le cas, on ne fait pas la requete API.
            const assentAlreadyExist = assentOnJson.find( ( a ) => a.refAvis === assent.refAvis && a.numFiscal === assent.numFiscal && Object.keys(
                a.datagouv ).length > 0 );

            if ( assentAlreadyExist === undefined ) {
                assentsToSvair.push( assent );
            } else {
                assentAlreadyExistList.push( assentAlreadyExist );
            }

        }
    } );

    console.log( 'assentAlreadyExistList', assentAlreadyExistList );

    if ( assentsToSvair.length === 0 ) {
        return {
            assents:  assentAlreadyExistList,
            formData: data,
        };
    }

    // Loader
    const loadingInstance = ElLoading.service( { fullscreen: true } );

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

            // Par défaut le premier avis d'impot est sélectionné
            let isBeneficiary = false;
            if ( index === 0 ) {
                isBeneficiary = true;
            }

            // Ajooute l'avis dans le json s'il n'existe pas
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

    loadingInstance.close();
    return {
        assents,
        formData: data,
    };
};

export const yupConfigStep1 = () => {
    return Yup.object( {
                           assents: Yup.array()
                                       .of(
                                           Yup.object().shape( {
                                                                   numFiscal: Yup.string()
                                                                                 .matches(
                                                                                     /^[0-9a-zA-Z]{13,14}$/m,
                                                                                     {
                                                                                         message:            'Le numéro est incorrect',
                                                                                         excludeEmptyString: true,
                                                                                     } ),
                                                                   refAvis:   Yup.string()
                                                                                 .matches(
                                                                                     /^[0-9a-zA-Z]{13,14}$/m,
                                                                                     {
                                                                                         message:            'Le numéro est incorrect',
                                                                                         excludeEmptyString: true,
                                                                                     } ),
                                                               } ),
                                       ),
                       } );
};
