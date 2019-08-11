const fs = require('fs');
const config = require('./config');
const path = require('path');
const tpuf = require('./tpuf_metanode');

//---
//относительный путь к [ptdo]-файлу
const stPtdoPathRelative = config.troogetPathRelative + '/' + 'j_ptdo.txt';
//абсолютный путь к [ptdo]-файлу
const stPtdoPathAbs = tpuf.pathAbsByRelative(stPtdoPathRelative);

//---
//Возвращает TRUE если [zint]-термин (1) присутствует в [ptdo]
function isZintExist(stZint) {
    //--- содержимое [ptdo]-файла; указываем кодировку ucs2 т.к. [pdto]-файл в такой кодировке
    const txt = fs.readFileSync(stPtdoPathAbs, 'ucs2');
    //---
    return txt.indexOf(stZint) !== -1;
}

/**
 Добавляет [zint] (1) в [ptdo]-файл

 @param stZint (1) --
 @return {string} пустая строка если сохранение прошло успешно, иначе не пустая строка
 */
function zintAdd(stZint) {
    if (stZint.length !== 4) {
        return 'длина [zint] должна быть =4; [' + stZint.length + ']';
    }
    //---
    fs.appendFileSync(stPtdoPathAbs, '\n'+stZint, 'ucs2');
    return '';
}

//---
exports.isZintExist = isZintExist;
exports.zintAdd = zintAdd;
