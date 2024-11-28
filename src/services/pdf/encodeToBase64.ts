import * as fs from 'fs';
import * as path from 'path';

/**
 * Retourne le type MIME pour une extension de fichier donnée.
 * @param extension Extension de fichier (ex. : .png, .jpg).
 * @returns Le type MIME correspondant.
 */
function getMimeType( extension: string ): string | null {
    const mimeTypes: { [ key: string ]: string } = {
        '.png':  'image/png',
        '.jpg':  'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif':  'image/gif',
        '.svg':  'image/svg+xml',
    };

    return mimeTypes[ extension ] || null;
}


/**
 * Encode une image en base64 dans un projet Electron/Vue.js.
 * @param relativePath Chemin relatif de l'image (depuis le dossier `src` ou `public`).
 * @returns La chaîne encodée en base64 avec le préfixe MIME.
 */
export function encodeImageToBase64( relativePath: string ): string {
    try {
        // Résolution du chemin absolu
        const absolutePath = path.join( __static, relativePath );

        // Vérification de l'existence du fichier
        if ( !fs.existsSync( absolutePath ) ) {
            throw new Error( `Fichier non trouvé : ${ absolutePath }` );
        }

        // Lecture du fichier sous forme de Buffer
        const fileBuffer = fs.readFileSync( absolutePath );

        // Détection du type MIME à partir de l'extension
        const fileExtension = path.extname( absolutePath ).toLowerCase();
        const mimeType      = getMimeType( fileExtension );

        if ( !mimeType ) {
            throw new Error( `Type MIME non supporté pour l'extension : ${ fileExtension }` );
        }

        // Conversion en base64
        const base64String = fileBuffer.toString( 'base64' );

        // Retourne la chaîne encodée avec le préfixe MIME
        return `data:${ mimeType };base64,${ base64String }`;
    } catch ( error ) {
        throw new Error( `Erreur lors de l'encodage de l'image : ${ error.message }` );
    }
}

