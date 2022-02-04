import axios from 'axios';

export const geocodingAddress = async ( address: string ): Promise<number[] | null> => {
    const response = await axios.get( `https://wxs.ign.fr/calcul/look4/user/search?indices=locating&method=fuzzy&match[fulltext]=${ address }&nb=1` );

    if ( response.status === 200 && response.data.features.length > 0 ) {
        console.log( response.data.features[ 0 ] );
        return response.data.features[ 0 ].geometry.coordinates;
    }

    return null;
};
