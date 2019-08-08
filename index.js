//--- imports
const express = require('express');
const http = require('http');
const lodash = require('lodash');
const page = require('./page.js');
const fs = require('fs');
require('console-group').install();

//--- константы
const hostname = '127.0.0.1';
const port = 3001;
const pathPrefix = '../m80m_Trooget/_wiki';


//---
/*
 Обработчик запросов от клиента.

 @param req (1) -- запрос от клиента
 @param resBack (2) -- сформированный нами ответ на запрос
 */
const requestHandler = (req, resBack) => {
    console.group('XGR: createServer');
    console.log('XGR: req.url [' + req.url + ']');

    if (req.url === '/favicon.ico') {
        console.log('XGR: -- /favicon.ico');
    } else {
        let path = pathPrefix + req.url;
        path = fnPathCorrection(path);
        console.log('path [' + path + ']');
        //--- считываем файл и возвращаем его как ответ на запрос
        fs.readFile(path, function (err, data) {
            if (!err) {
                resBack.statusCode = 200;
                resBack.setHeader('Content-Type', 'text/html');
                resBack.end(data);
            } else {
                console.log('VRR: ' + err);
            }
        });
    }
    console.groupEnd();
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
    if (stPath.indexOf('?') != -1) {
        return stPath.replace(/\?.*/, '');
    }
    return stPath;
}

