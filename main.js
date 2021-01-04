const {app, BrowserWindow, globalShortcut, ipcMain, dialog} = require('electron');
const path = require('path');
const fs = require('fs');
const ck3 = require('./js/ck3');

let win = null;

initConfig();
startApplication();

function initConfig() {
    fs.mkdir('./data', (err) => {});
    fs.mkdir('./data/img', (err) => {});
}

function startApplication() {
    app.whenReady().then(createWindow);
    registerAppHandler();
    registerIpcHandler();
}

function createWindow() {
    win = new BrowserWindow({
        width : 1248,
        height : 730,
        icon : `${__dirname}/icon/ck3_256.png`,
        resizable : false,
        useContentSize : true,
        center : true,
        webPreferences : {
            nodeIntegration: true
        }
    });

    win.removeMenu();
    registerWinHandler(win);

    win.loadFile('main.html');
}


function registerAppHandler() {

    app.on('window-all-closed', (e) => {

        if (process.platform !== 'darwin') {
            globalShortcut.unregisterAll();
            app.quit();
        }
    });

    app.on('activate', (e) => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
        }
    });
}

function registerWinHandler(win) {

    win.on('close', (e) => {

        e.preventDefault();

        app.focus();

        let choice = dialog.showMessageBoxSync(win, {
              type: 'question',
              buttons: ['저장 ( &S )', '저장 안함 ( &N )', '취소 ( &C )'],
              title: 'Crusader Kings 3 DNA Manager',
              message: '내용을 저장하고 종료 하시겠습니까?',
              icon : `${__dirname}/icon/ck3_256.png`,
              noLink : false,
              cancelId : 2,
              normalizeAccessKeys: true
        });

        if (choice === 0) {
            win.webContents.send('REQ_CTX_DATA', 'save_exit');
            win = null;
        }
        else if(choice === 1) {
            win.webContents.send('REQ_CTX_DATA', 'exit');
            win = null;
        }
        else { }
    });

    win.webContents.on('before-input-event', (event, input) => {

        /*
        if(input.key.toLowerCase() === 'f12') {
            win.webContents.openDevTools();
            event.preventDefault();
        }

        if(input.key.toLowerCase() === 'f5') {
            win.reload();
            event.preventDefault();
        }
        */
    });

    globalShortcut.register('CommandOrControl+D', () => {
        win.webContents.send('EVT-KEYBOARD', 'Ctrl-D');
    });

    globalShortcut.register('CommandOrControl+I', () => {
        win.webContents.send('EVT-KEYBOARD', 'Ctrl-I');
    });
}

function registerIpcHandler() {
    ipcMain.on('REQ_DNA_DB', (event, arg) => {
        let result = {};

        try {
            result.data = ck3.loadDnaDb();
            result.status = "success";

        } catch (error) {
            result.error = error;
            result.status = "error";
        }

        event.reply('DATA_DNA_DB', result);
    });

    ipcMain.on('RES_CTX_DATA_SAVE_EXIT', (event, arg) => {
        let ctxData = arg;
        let dataArray = [];

        for(let item of ctxData) {

            if(item.hasOwnProperty('remove')) {
                fs.unlink(`data/img/${item.id}.png`,function(err) {
                    if(err) return console.log(err);
                });
            } else {
                let data = {};
                data.id = item.id;
                data.name = item.name;
                data.dna = item.dna;

                dataArray.push(data);
            }
        }

        let dnaData = { data : dataArray };
        let jsonString = JSON.stringify(dnaData);
        ck3.saveDnaDb(jsonString);

        app.exit();
    });

    ipcMain.on('RES_CTX_DATA_EXIT', (event, arg) => {
        let ctxData = arg;
        let dataArray = [];

        for(let item of ctxData) {

            if(item.hasOwnProperty('remove') || (item.temp == true)) {
                fs.unlink(`data/img/${item.id}.png`,function(err) {
                    if(err) return console.log(err);
                });
            } else {
                let data = {};
                data.id = item.id;
                data.name = item.name;
                data.dna = item.dna;

                dataArray.push(data);
            }
        }

        let dnaData = { data : dataArray };
        let jsonString = JSON.stringify(dnaData);
        ck3.saveDnaDb(jsonString);

        app.exit();
    });
}