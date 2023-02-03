'use strict';

import { app, BrowserWindow, ipcMain, protocol } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import { autoUpdater } from 'electron-updater';
import ElectronStore from 'electron-store';
import fs from 'fs';

ElectronStore.initRenderer();

const isDevelopment = process.env.NODE_ENV !== 'production';

const schema = {
    windowWidth:  {
        type:    'number',
        minimum: 200,
        default: 1000,
    },
    windowHeight: {
        type:    'number',
        minimum: 100,
        default: 500,
    },
    connectedToInternet: {
        type:    'boolean',
        default: true,
    },
} as const;

// First instantiate
const store = new ElectronStore( { schema } );

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged( [
                                          { scheme: 'app', privileges: { secure: true, standard: true } },
                                      ] );

async function createWindow() {
    // First we'll get our height and width. This will be the defaults if there wasn't anything saved
    const width  = ( store.get( 'windowWidth' ) as number );
    const height = ( store.get( 'windowHeight' ) as number );
    // Create the browser window.
    mainWindow   = new BrowserWindow( {
                                          width,
                                          height,
                                          autoHideMenuBar: true,// Masquer la barre de menu sauf si la touche Alt est enfoncée
                                          webPreferences:  {
                                              // Use pluginOptions.nodeIntegration, leave this alone
                                              // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
                                              nodeIntegration:    ( process.env
                                                  .ELECTRON_NODE_INTEGRATION as unknown ) as boolean,
                                              contextIsolation:   !process.env.ELECTRON_NODE_INTEGRATION,
                                              enableRemoteModule: true,
                                              webSecurity:        false,
                                          },
                                      } );


    if ( process.env.WEBPACK_DEV_SERVER_URL ) {
        // Load the url of the dev server if in development mode
        await mainWindow.loadURL( process.env.WEBPACK_DEV_SERVER_URL as string );
        if ( !process.env.IS_TEST ) {
            mainWindow.webContents.openDevTools();
        }
    } else {
        createProtocol( 'app' );
        // Load the index.html when not in development
        mainWindow.loadURL( 'app://./index.html' );
        const response = await autoUpdater.checkForUpdatesAndNotify();

        if ( response?.downloadPromise !== undefined ) {
            setTimeout( () => {
                mainWindow.webContents.send( 'download_update' );
            }, 5000 );
        }
    }

    mainWindow.on( 'resize', () => {
        // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
        // the height, width, and x and y coordinates.
        const { width, height } = mainWindow.getBounds();
        // Now that we have them, save them using the `set` method.
        store.set( 'windowWidth', width );
        store.set( 'windowHeight', height );
    } );

    mainWindow.on( 'closed', () => {
        mainWindow = null;
    } );
}

// Quit when all windows are closed.
app.on( 'window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if ( process.platform !== 'darwin' ) {
        app.quit();
    }
} );

app.on( 'activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if ( mainWindow === null ) {
        createWindow();
    }
} );

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on( 'ready', async () => {
    if ( isDevelopment && !process.env.IS_TEST ) {
        // Install Vue Devtools
        try {
            await installExtension( VUEJS3_DEVTOOLS );
        } catch ( e ) {
            console.error( 'Vue Devtools failed to install:', e.toString() );
        }
    }
    createWindow();
} );

// Exit cleanly on request from parent process in development mode.
if ( isDevelopment ) {
    if ( process.platform === 'win32' ) {
        process.on( 'message', data => {
            if ( data === 'graceful-exit' ) {
                app.quit();
            }
        } );
    } else {
        process.on( 'SIGTERM', () => {
            app.quit();
        } );
    }
}

// const dialog   = electron.dialog;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { download } = require( 'electron-dl' );

ipcMain.on( 'download', async ( event, { payload } ) => {
    // Handle dowload
    if ( store.get( 'connectedToInternet' ) ) {
        try {
            for ( const url of payload.urls ) {
                await download( BrowserWindow.getFocusedWindow(), url, {
                    directory: payload.properties.directory,
                    saveAs:    false,
                    overwrite: true,
                } );
            }
        } catch ( e ) {
            console.error( e );
        }

        mainWindow.webContents.send( 'all-download-complete' );
    } else {
        mainWindow.webContents.send( 'no-internet' );
    }
} );

ipcMain.on( 'save-screenshot', ( event, data ) => {
    const { target } = data;
    mainWindow.webContents.capturePage().then( image => {
        //writing  image to the disk
        fs.writeFile( target, image.toPNG(), ( err ) => {
            if ( err ) {
                throw err;
            }
        } );
    } );
} );

autoUpdater.on( 'update-downloaded', () => {
    mainWindow.webContents.send( 'update_downloaded' );
} );

ipcMain.on( 'restart_app', () => {
    autoUpdater.quitAndInstall();
} );
