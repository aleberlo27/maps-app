const { writeFileSync, mkdirSync } = require( 'fs' );

//Leer variables de entorno
require('dotenv').config();

//Definir Path
const targetPath = './src/environments/environment.ts';
const targetPathDev = './src/environments/environment.development.ts';

//Variable de entorno
const mapboxKey = process.env[ 'MAPBOX_KEY' ];


//Si no existe la variable de entorno lanza una excepcion para crearla
if ( !mapboxKey ) {
  throw new Error( 'MAPBOX_KEY is not set' );
}

//Contenido del archivo que vamos a crear de environment (le hemos dicho a .gitignore que no lo suba )
const envFileContent = `
export const environment = {
  mapboxKey: "${ mapboxKey }"
};
`;

mkdirSync( './src/environments', { recursive: true } );

writeFileSync( targetPath, envFileContent );
writeFileSync( targetPathDev, envFileContent );
