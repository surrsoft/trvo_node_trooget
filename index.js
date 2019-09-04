"use strict";
/* jshint esversion: 6 */

//--- require
const http = require('http');
const lodash = require('lodash');
const fs = require('fs');
//require('console-group').install();
const zintGen = require('./zint_gen');
const ptdo = require('./ptdo');
const config = require('./config');
const tpuf = require('./tpuf_metanode');
const mdPath = require('path');
const mdEncoding = require('encoding');
const mdFromTrooget = require('./fromTrooget');
const adpm = require('./adpmLog');
const TArray = require('./xrsu/TArray');
const TFile = require('./xrsu/TFile');

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
        if (req.url === '/') {
            req.url = '/p_0_p.html';
        }
        //---
        if (req.url === '/favicon.ico') {
            console.log('XGR: -- /favicon.ico');
            let path = pathPrefix + req.url;
            path = fnPathCorrection(path);
            fs.readFile(path, function (err, data) {
                if (!err) {
                    resBack.statusCode = 200;
                    resBack.setHeader('Content-Type', 'image/jpg');
                    resBack.end(data);
                } else {
                    console.log('VRR: ' + err + ' //190809-084001');
                }
            });
        }
        //возвращаем путь к wiki
        else if (req.url === '/pathWiki') {
            console.log('signal /pathWiki //190811-100000');
            const stRet = fnWikiRootPath();
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
        } else if (req.url === '/asrz') {
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
        } else if (req.url === '/epgn') {
            console.log('/epgn //190810-154700');
            //--- абсолютный путь к [uxfy]-файлу
            const stUxfyPathAbs = tpuf.pathAbsByRelative(config.troogetPathRelative + '/' + 'j_x52f.txt');
            const stUxfyText = fs.readFileSync(stUxfyPathAbs, 'ucs2');
            //---
            resBack.statusCode = 200;
            resBack.setHeader('Content-Type', 'text/plain');
            resBack.end(stUxfyText);
        } else if (req.url === '/indexCreate') {
            indexCreate();
            //---
            resBack.statusCode = 200;
            resBack.setHeader('Content-Type', 'text/plain');
            resBack.end('ok');
        } else {
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
            });
        } else if (req.url === '/cmdFileExist') {
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
            });
        } else if (req.url === '/cmdFileGet') {
            // Возвращает содержимое файла. Файл должен быть в кодировке UCS2.
            // НА ВХОДЕ: абсолютный путьфайл файла содержимое которого мы хотим получить, например 'D:/f/file.txt'.
            // RETURN: пустая строка если файл не существует
            req.on('data', function (stPostData) {
                adpm.log('--> /cmdFileGet; stPostData [' + stPostData + ']', adpm.ADPM_OPEN);
                const stFilePathAbs = mdPath.normalize(stPostData + '');
                adpm.log('stFilePathAbs [' + stFilePathAbs + ']', adpm.ADPM_IN);
                let stRet = '';
                if (fs.existsSync(stFilePathAbs)) {
                    adpm.log('(файл наден/не найден): найден', adpm.ADPM_IN);
                    stRet = fs.readFileSync(stFilePathAbs, TFile.UBTM_UCS2);
                    if (stRet.indexOf('txTitle') === -1) {
                        stRet = fs.readFileSync(stFilePathAbs, TFile.UBTM_UTF8);
                    }
                    if (stRet.indexOf('txTitle') === -1) {
                        stRet = fs.readFileSync(stFilePathAbs, TFile.UBTM_UTF16LE);
                    }
                } else {
                    adpm.log('(файл наден/не найден): не найден', adpm.ADPM_IN);
                }
                //---
                resBack.statusCode = 200;
                resBack.setHeader('Content-Type', 'text/plain');
                adpm.log('', adpm.ADPM_CLOSE);
                resBack.end(stRet + '');
            });
        } else if (req.url === '/cmdFileGet_B') {
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
        } else if (req.url === '/cmdFileCreate') {
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
        } else if (req.url === '/cmdFileReplace') {
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
                //--- получаем тело создаваемого файла (stBody)
                let stBody = stMcny.substring(ix + 1);
                //--- перекодируем из UTF8 в UCS2
                stBody = mdEncoding.convert(stBody, 'UCS-2', 'UTF-8');
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
        } else if (req.url === '/cmdFileReplace_B') {
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
        } else if (req.url === '/cmdFileNamesFolder') {
            //Возвращает имена всех ФАЙЛОВ папки (1) подходящих под RegExp (2)
            //@param stFolderPath (1) -- абсолютное имя папки, передается в теле POST-запроса первой строкой
            //@param (2) -- RegExp, передается в теле POST-запроса второй строкой
            //@return JSON-массив, например '["file1.txt", "file2.txt", ..]'
            //--- g8g
            req.on('data', function (stFolderPathAbs) {
                console.log('stFolderPathAbs [' + stFolderPathAbs + ']');
                //---
                const files = fs.readdirSync(stFolderPathAbs);
                console.log('!!!!!!!!! //190812-130100 files=');
                console.log(files);
                const stJsonFiles = JSON.stringify(files);
                //---
                resBack.statusCode = 200;
                resBack.setHeader('Content-Type', 'text/plain');
                resBack.end(stJsonFiles);
            });
        } else if (req.url === '/signal_vamu') {
            req.on('data', function (stBody) {
                console.log('stBody [' + stBody + ']');
                //---
                resBack.statusCode = 200;
                resBack.setHeader('Content-Type', 'text/plain');
                resBack.end('test_ok');
            });
        } else {
            const stMessage = 'undefinded cmd [' + req.url + ']';
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
    if (stPath.indexOf('?') !== -1) { //TODO -real
        return stPath.replace(/\?.*/, '');
    }
    return stPath;
}

/**
 *
 * @returns {String} абсолютный путь к корню wiki
 */
function fnWikiRootPath() {
    return tpuf.pathAbsByRelative(config.troogetPathRelative);
}

/**
 * Возвращает TRUE если строка (1) удовлетворяет регулярному выражению (2), иначе возвращает FALSE
 *
 * @param _st
 * @param _stRegExp
 * @returns {boolean}
 */
function fnIsComplianceRegExp(_st, _stRegExp) {
    const regExp = new RegExp(_stRegExp);
    const st = regExp.exec(_st);
    return st !== null;
}


/**
 * Возвращает TRUE если имя файла (1) удовлетворяет маске y_X_y.html, где y - одна из букв диапазона config.diapasons,
 * X - цифра (см. trooget:[smre])
 *
 * @param _stFileName
 * @returns {boolean}
 */
function fnIsNameValid(_stFileName) {
    adpm.log('--> fnIsNameValid(); _stFileName [' + _stFileName + ']', adpm.ADPM_OPEN);
    for (let i = 0; i < config.diapasons.length; i++) { //LOOP
        const stDiapSymbol = config.diapasons[i];
        const stRegExp = "^[" + stDiapSymbol + "]_\\d+_[" + stDiapSymbol + "].html$";
        const b = fnIsComplianceRegExp(_stFileName, stRegExp);
        if (b) {
            adpm.log('', adpm.ADPM_CLOSE);
            return true;
        }
    } //LOOP
    adpm.log('', adpm.ADPM_CLOSE);
    return false;
}

/**
 *
 */
function indexCreate() {
    adpm.log('indexCreate() //190813-170400', adpm.ADPM_OPEN);
    //---
    const stWikiRootPath = fnWikiRootPath();
    //---
    let arrFileNames = fs.readdirSync(stWikiRootPath);

    //arrFileNames = TArray.subArray_B(arrFileNames, 28, 30); // back

    //--- фильтруем имена -> arrFileNameValids
    adpm.log('ЦИКЛ: фильтруем имена', adpm.ADPM_OPEN);
    const arrFileNameValids = [];
    for (var i = 0; i < arrFileNames.length; i++) { //LOOP
        const stFileName = arrFileNames[i];
        if (fnIsNameValid(stFileName)) {
            adpm.log('имя [' + stFileName + '] прошло фильтрацию', adpm.ADPM_IN);
            arrFileNameValids.push(stFileName);
        } else {
            adpm.log('имя [' + stFileName + '] НЕ прошло фильтрацию', adpm.ADPM_IN);
        }
    } //LOOP
    adpm.log('', adpm.ADPM_CLOSE);

    adpm.log('кол-во имён после фильтрации [' + arrFileNameValids.length + ']', adpm.ADPM_IN);
    adpm.log('arrFileNameValids [' + arrFileNameValids + ']', adpm.ADPM_IN);

    //--- получаем [pker] - массив [cxkk]
    adpm.log('получаем [pker]', adpm.ADPM_OPEN);
    const arrPker = [];
    //[[zcmu]] - тут будут имена файлов которые не удалось распознать
    const arrZcmu = [];
    for (let i2 = 0; i2 < arrFileNameValids.length; i2++) { //LOOP
        const stFileName = arrFileNameValids[i2];
        //[cxkk] - отдельный элемент [pker]
        const ojCxkk = fnCxkkGet(stFileName, stWikiRootPath, arrZcmu);
        if (ojCxkk !== null) {
            arrPker.push(ojCxkk);
        }
    } //LOOP
    adpm.log('количество прочитанных файлов [' + arrFileNameValids.length + ']', adpm.ADPM_IN, adpm.HNUO_ALWAYS);
    adpm.log('имена непрочитанных файлов: [' + arrZcmu + ']', adpm.ADPM_IN, adpm.HNUO_ALWAYS);
    adpm.log('', adpm.ADPM_CLOSE);

    //--- запись в файл
    const stPker = JSON.stringify(arrPker);
    fs.writeFileSync(fnPathJoin(stWikiRootPath, 'j_x50f.txt'), stPker);

    //---
    adpm.log('ИНДЕКС СФОРМИРОВАН', adpm.ADPM_IN, adpm.HNUO_ALWAYS);
    adpm.log('', adpm.ADPM_CLOSE);
}

/**
 * Возвращает TRUE если текст (1) распознаётся без ошибок
 *
 * @param stFileBody {String} (1) --
 * @returns {boolean}
 */
function fnIsEncodeOk(stFileBody) {
    const ix = stFileBody.indexOf('title'); //при проблеме с кодировкой здесь будет -1
    return ix !== -1;
}

/**
 * Конкатенирует пути (1) (2) через разделитель. Разделителем будет '/' если (1) не содежрит обратного слэша, иначе
 * разделителем будет обратный слэш
 * @param _stPath1 (1) --
 * @param _stPath2 (2) --
 * @returns {string|*}
 */
function fnPathJoin(_stPath1, _stPath2) {
    if (_stPath1 && _stPath2) {
        let stDiv = '/';
        if (_stPath1.indexOf('\\') !== -1) {
            stDiv = '\\';
        }
        //---
        return _stPath1 + stDiv + _stPath2;
    } else {
        return _stPath1 + _stPath2;
    }
}

/**
 * Формирует [cxkk] - отдельный элемент [pker]
 *
 * @param _stFileName {String}
 * @param _stWikiRootPath {String}
 * @param _arrZcmuBack {Array}
 * @returns {null|{isTitle: boolean, isComm: boolean, stZxuw: (*), txThxx: *, txTitle: *, txComm: *, arSts: []}}
 */
function fnCxkkGet(_stFileName, _stWikiRootPath, _arrZcmuBack) {
    adpm.log('--> fnCxkkGet(..); _stFileName [' + _stFileName + ']; _stWikiRootPath [' + _stWikiRootPath + ']', adpm.ADPM_OPEN);
    const stFileNameAbs = fnPathJoin(_stWikiRootPath, _stFileName);

    //--- читаем файл (сначала используем одну кодировку, в случае неудачи - вторую)
    let stFileBody = fs.readFileSync(stFileNameAbs, TFile.UBTM_UTF16LE);
    if (!fnIsEncodeOk(stFileBody)) {
        stFileBody = fs.readFileSync(stFileNameAbs, TFile.UBTM_UTF8);
        if (!fnIsEncodeOk(stFileBody)) {
            _arrZcmuBack.push(_stFileName);
            return null;  //===>
        }
    }

    //---
    const ojWmowTitle = mdFromTrooget.tagGet(stFileBody, 'title', 'p_innerHTML');
    const ojWmowComm = mdFromTrooget.tagGet(stFileBody, '#x44z_comm', 'p_innerHTML');
    const ojWmowThxx = mdFromTrooget.tagGet(stFileBody, 'div#x41z_blocks', 'p_innerHTML');

    const stTitle = ojWmowTitle.blockInner;
    const stComm = ojWmowComm.blockInner;
    const stThxx = ojWmowThxx.blockInner;

    //--- объект [[cxkk]]
    const ojCxkk = {
        isTitle: false,
        txTitle: stTitle,
        isComm: false,
        txComm: stComm,
        txThxx: stThxx,
        //[[zxuw]] - тут находится либо полный путь к странице ([crip]) либо только имя страницы ([stDtof])
        stZxuw: _stFileName === null ? stFileNameAbs : _stFileName,
        arSts: []
    };

    //---
    adpm.log('', adpm.ADPM_CLOSE);
    return ojCxkk;
}




