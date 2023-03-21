import axios from 'axios';
import * as GpLib from 'geoportal-access-lib/dist/GpServices';

export const geocodingAddress = async ( address: string ): Promise<number[] | null> => {
    const response = await axios.get( `https://wxs.ign.fr/calcul/look4/user/search?indices=locating&method=fuzzy&match[fulltext]=${ address }&nb=1` );

    if ( response.status === 200 && response.data.features.length > 0 ) {
        return response.data.features[ 0 ].geometry.coordinates;
    }

    return null;
};

export const getGeoportalAddress = ( coordinate: number[], onSuccess ) => {
    GpLib.Services.reverseGeocode( {
                                       apiKey:           'calcul', // clef d'accès à la plateforme
                                       position:         {
                                           x: coordinate[ 0 ],
                                           y: coordinate[ 1 ],
                                       },
                                       maximumResponses: 1,
                                       filterOptions:    {
                                           type: [ 'StreetAddress' ],
                                       },
                                       onSuccess,
                                   } );
};

export const getGeoportalPlot = ( coordinate: number[], onSuccess ) => {
    GpLib.Services.reverseGeocode( {
                                       apiKey:           'calcul', // clef d'accès à la plateforme
                                       position:         {
                                           x: coordinate[ 0 ],
                                           y: coordinate[ 1 ],
                                       },
                                       maximumResponses: 1,
                                       filterOptions:    {
                                           type: [ 'CadastralParcel' ],
                                       },
                                       onSuccess,
                                   } );

};

