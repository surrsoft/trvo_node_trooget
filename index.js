//--- imports
const express = require('express');
const http = require('http');
const lodash = require('lodash');
const page = require('./page.js');
const fs = require('fs');
//require('console-group').install();
const zintGen = require('./zint_gen');
const ptdo = require('./ptdo');
const config = require('./config');
const tpuf = require('./tpuf_metanode');
const mdPath = require('path');
const mdEncoding = require('encoding');
const mdBuffer = require('buffer');

//--- константы
const hostname = '127.0.0.1';
const port = 3001;
const pathPrefix = config.troogetPathRelative; //'../m80m_Trooget/_wiki';
const stUmok = '/umok_';

//---
/*
 Обработчик запросов от клиента.

 @param req (1) -- запрос от клиента
 @param resBack (2) -- сформированный нами ответ на запрос
 */
const requestHandler = (req, resBack) => {
    console.log('XGR: --> requestHandler');
    console.log('XGR: req.url [' + req.url + '] //190810-185900');
    console.log('XGR: req.method [' + req.method + '] //190810-185901');

    if (req.method === 'GET') {
        //---
        if (req.url === '/favicon.ico') {
            console.log('XGR: -- /favicon.ico');
        }
        //возвращаем путь к wiki
        else if (req.url === '/pathWiki') {
            console.log('signal /pathWiki //190811-100000');
            const stRet = tpuf.pathAbsByRelative(config.troogetPathRelative);
            //---
            resBack.statusCode = 200;
            resBack.setHeader('Content-Type', 'text/plain');
            resBack.end(stRet);
        }
        //генерируем термин
        else if (req.url === '/aifm_signal') {
            console.log('aifm_signal');
            //--- генерируем четырех-буквенный термин ([zint]-термин)
            let stGenEng = zintGen.generateEng();
            //--- проверяем существование сгенерированного термина в [ptdo]
            const isExist = ptdo.isZintExist(stGenEng);
            console.log('bExist [' + isExist + ']');
            //--- данные в браузер
            const ret = {
                stGenEng,
                isExist
            };
            //---
            resBack.statusCode = 200;
            resBack.setHeader('Content-Type', 'text/plain');
            resBack.end(JSON.stringify(ret));
        }
        //сохраняем термин в файл-терминов ([ptdo])
        else if (req.url.indexOf(stUmok) !== -1) {
            //--- выделяем [zint]
            const stZint = req.url.replace(stUmok, '');
            //---
            const stResSave = ptdo.zintAdd(stZint);
            if (stResSave.length > 0) {
                resBack.statusCode = 400;
                resBack.setHeader('Content-Type', 'text/plain');
                resBack.end('KO');
            } else {
                //---
                resBack.statusCode = 200;
                resBack.setHeader('Content-Type', 'text/plain');
                resBack.end('OK');
            }
        }
        else if (req.url === '/asrz') {
            const stAsrzPathAbs = tpuf.pathAbsByRelative(config.troogetPathRelative + '/' + '_js/x46z_config_fi.txt');
            const stAsrzText = fs.readFileSync(stAsrzPathAbs) + '';
            //---
            const st = 'x46z_last_diap: ';
            const ix = stAsrzText.indexOf(st);
            const ret = stAsrzText.substr(ix + st.length, 1);
            //---
            resBack.statusCode = 200;
            resBack.setHeader('Content-Type', 'text/plain');
            resBack.end(ret);
        }
        else if (req.url === '/epgn') {
            console.log('/epgn //190810-154700');
            //--- абсолютный путь к [uxfy]-файлу
            const stUxfyPathAbs = tpuf.pathAbsByRelative(config.troogetPathRelative + '/' + 'j_x52f.txt');
            const stUxfyText = fs.readFileSync(stUxfyPathAbs, 'ucs2');
            //---
            resBack.statusCode = 200;
            resBack.setHeader('Content-Type', 'text/plain');
            resBack.end(stUxfyText);
        }
        else {
            //---
            let path = pathPrefix + req.url;
            path = fnPathCorrection(path);
            console.log('path [' + path + ']');
            //--- MIME-тип
            let stMime = 'text/html';
            if (lodash.endsWith(path, '.js')) {
                stMime = 'text/javascript';
            }
            console.log('stMime [' + stMime + '] ' + path);
            //--- считываем файл и возвращаем его как ответ на запрос
            fs.readFile(path, function (err, data) {
                if (!err) {
                    resBack.statusCode = 200;
                    resBack.setHeader('Content-Type', stMime);
                    resBack.end(data);
                } else {
                    console.log('VRR: ' + err + ' //190809-084001');
                }
            });
        }
    } else if (req.method === 'POST') {
        if (req.url === '/testSignal') {
            console.log('req.url [' + req.url + '] //190810-185001');
            req.on('data', function (data) {
                console.log('data [' + data + ']');
            })
        }
        else if (req.url === '/cmdFileExist') {
            // Метод возвращает строку 'true' если файл существует, иначе строку 'false'.
            // НА ВХОДЕ: абсолютный путь файла (существование которого мы хотим проверить) в теле POST
            // (например: D:/f/file.txt)
            req.on('data', function (stPostData) {
                console.log('stPostData [' + (stPostData + '') + '] //190810-191900');
                //---
                const stFilePathAbs = mdPath.normalize(stPostData + '') + '';
                console.log('!!!!!!!!! stFilePathAbs [' + stFilePathAbs + '] //190811-102800');
                //---
                const bRet = fs.existsSync(stFilePathAbs);
                const stRet = bRet + '';
                console.log('!!!!!!!!! stRet [' + stRet + '] //190811-103500');
                //---
                resBack.statusCode = 200;
                resBack.setHeader('Content-Type', 'text/plain');
                resBack.end(stRet);
            })
        }
        else if (req.url === '/cmdFileGet') {
            // Возвращает содержимое файла. Файл должен быть в кодировке UCS2.
            // НА ВХОДЕ: абсолютный путьфайл файла содержимое которого мы хотим получить, например 'D:/f/file.txt'.
            // RETURN: пустая строка если файл не существует
            req.on('data', function (stPostData) {
                console.log('stPostData [' + stPostData + '] //190811-083300 /cmdFileGet');
                console.log('!!!!!!!!! 1');
                const stFilePathAbs = mdPath.normalize(stPostData + '');
                console.log('stFilePathAbs [' + stFilePathAbs + '] //190811-101800');
                console.log('!!!!!!!!! 2');
                let stRet = '';
                if (fs.existsSync(stFilePathAbs)) {
                    stRet = fs.readFileSync(stFilePathAbs, 'ucs2');
                }
                //---
                resBack.statusCode = 200;
                resBack.setHeader('Content-Type', 'text/plain');
                resBack.end(stRet + '');
            });
        }
        else if (req.url === '/cmdFileGet_B') {
            //От А отличается только тем что считает что файл в кодировке UTF-8
            req.on('data', function (stPostData) {
                console.log('stPostData [' + stPostData + '] //190811-083300 /cmdFileGet');
                console.log('!!!!!!!!! 1');
                const stFilePathAbs = mdPath.normalize(stPostData + '');
                console.log('stFilePathAbs [' + stFilePathAbs + '] //190811-101800');
                console.log('!!!!!!!!! 2');
                let stRet = '';
                if (fs.existsSync(stFilePathAbs)) {
                    stRet = fs.readFileSync(stFilePathAbs);
                }
                //---
                resBack.statusCode = 200;
                resBack.setHeader('Content-Type', 'text/plain');
                resBack.end(stRet + '');
            });
        }
        else if (req.url === '/cmdFileCreate') {
            req.on('data', function (stMcny) { //[mcny] - см. Notion
                stMcny += '';
                //--- получаем путьфайл создаваемого файла (stFileNameAbs)
                const ix = stMcny.indexOf('^') - 0;
                const stFileNameAbs = stMcny.substring(0, ix);
                console.log('!!!!!!!!! stFileNameAbs [' + stFileNameAbs + ']');
                //--- получаем тело создаваемого файла (stBody)
                let stBody = stMcny.substring(ix + 1);
                console.log('!!!!!!!!! 1 stBody [' + stBody + ']');
                //--- перекодируем из UTF8 в UCS2
                // stBody = mdEncoding.convert(stBody, 'UCS-2', 'UTF-8');
                // console.log('!!!!!!!!! 2 stBody [' + stBody + ']');
                //---
                if (fs.existsSync(stFileNameAbs)) {
                    //^ проверяем нет ли уже такого файла
                    console.log('файл уже существует [' + stFileNameAbs + '] //190811-115300');
                    resBack.statusCode = 200;
                    resBack.setHeader('Content-Type', 'text/plain');
                    resBack.end('1');
                } else {
                    //--- создаём файл
                    // fs.writeFileSync(stFileNameAbs, stBody, 'utf16le');
                    fs.writeFileSync(stFileNameAbs, stBody);
                    console.log('файл создан [' + stFileNameAbs + '] //190811-115400');
                    //---
                    resBack.statusCode = 200;
                    resBack.setHeader('Content-Type', 'text/plain');
                    resBack.end('2');
                }
            });
        }
        else if (req.url === '/cmdFileReplace') {
            // Заменяет содежимое файла (1) текстом (2). Текст (2) должен быть в кодировке UTF-8. Перед записью в
            // файл (1) текст (2) перекодируется в кодировку UCS-2
            //
            // @param file (1) -- абсолютное имя файла
            // @param st (2) -- новое содержимое для файла (1)
            // @return '2' если файл успешно перезаписан, '1' если файла (1) не найдено
            req.on('data', function (stMcny) { //[mcny] - см. Notion
                stMcny += '';
                //--- получаем путьфайл создаваемого файла (stFileNameAbs)
                const ix = stMcny.indexOf('^') - 0;
                const stFileNameAbs = stMcny.substring(0, ix);
                console.log('!!!!!!!!! stFileNameAbs [' + stFileNameAbs + ']');
                //--- получаем тело создаваемого файла (stBody)
                let stBody = stMcny.substring(ix + 1);
                console.log('-//190811-194800 1 stBody [' + stBody + ']');
                //--- перекодируем из UTF8 в UCS2
                stBody = mdEncoding.convert(stBody, 'UCS-2', 'UTF-8');
                console.log('-//190811-194801 2 stBody [' + stBody + ']');
                //---
                if (fs.existsSync(stFileNameAbs)) {
                    //^ проверяем существование файла
                    console.log('OK - файл существует [' + stFileNameAbs + '] //190811-115305');
                    //--- перезаписываем файл
                    fs.writeFileSync(stFileNameAbs, stBody);
                    console.log('файл перезаписан [' + stFileNameAbs + '] //190811-115405');
                    //---
                    resBack.statusCode = 200;
                    resBack.setHeader('Content-Type', 'text/plain');
                    resBack.end('2');
                } else {
                    resBack.statusCode = 200;
                    resBack.setHeader('Content-Type', 'text/plain');
                    resBack.end('1');
                }
            });
        }
        else if (req.url === '/cmdFileReplace_B') {
            // Отличается от А тем что не выполняется перекодировка текста (2)
            //
            req.on('data', function (stMcny) { //[mcny] - см. Notion
                stMcny += '';
                //--- получаем путьфайл создаваемого файла (stFileNameAbs)
                const ix = stMcny.indexOf('^') - 0;
                const stFileNameAbs = stMcny.substring(0, ix);
                console.log('!!!!!!!!! stFileNameAbs [' + stFileNameAbs + ']');
                //--- получаем тело создаваемого файла (stBody)
                let stBody = stMcny.substring(ix + 1);
                console.log('-//190811-194805 1 stBody [' + stBody + '] //190811-192500');
                //--- перекодируем из UTF8 в UCS2
                // stBody = mdEncoding.convert(stBody, 'UCS-2', 'UTF-8');
                // console.log('-//190811-194806 2 stBody [' + stBody + '] //190811-192501');
                //---
                if (fs.existsSync(stFileNameAbs)) {
                    //^ проверяем существование файла
                    console.log('OK - файл существует [' + stFileNameAbs + '] //190811-115305');
                    //--- перезаписываем файл
                    fs.writeFileSync(stFileNameAbs, stBody);
                    console.log('файл перезаписан [' + stFileNameAbs + '] //190811-115405');
                    //---
                    resBack.statusCode = 200;
                    resBack.setHeader('Content-Type', 'text/plain');
                    resBack.end('2');
                } else {
                    resBack.statusCode = 200;
                    resBack.setHeader('Content-Type', 'text/plain');
                    resBack.end('1');
                }
            });
        }
        else {
            var stMessage = 'undefinded cmd [' + req.url + ']';
            throw Error(stMessage);
        }
    }
};

//---
const server = http.createServer(requestHandler);

//---
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


/*
 У скриптов на конце почему-то оказывется знак вопроса и далее непонятные цифры, например
 "/_js/ixwa.js?_=1565280059951". Удаляет этот знак вопроса и всё что после него
 */
function fnPathCorrection(stPath) {
    if (stPath.indexOf('?') != -1) { //TODO -real
        return stPath.replace(/\?.*/, '');
    }
    return stPath;
}

