/*
ОПИСАНИЕ: функции для работы с файлами и директориями
 */

"use strict";
/* jshint esversion: 6 */

//require
//`````````````````````````````````````````````````````````````````````````````````````````````````
const fs = require('fs');

//`````````````````````````````````````````````````````````````````````````````````````````````````
//--- [[ubtm]] - кодировки для использования в 'options' функций модуля 'fs'
const UBTM_ASCII = 'ascii';
const UBTM_UTF8 = 'utf8';
const UBTM_UTF16LE = 'utf16le';
const UBTM_UCS2 = 'ucs2';
const UBTM_LATIN1 = 'latin1';
const UBTM_BINARY = 'binary';

//`````````````````````````````````````````````````````````````````````````````````````````````````
/**
 * {В РАЗРАБОТКЕ}
 * Получение содержимого файла (1) в виде строки из файла в кодировке UTF-8
 *
 * @param _stFileNameAbs (1) -- файл в кодировке UTF8
 * @returns {string} строка в кодировке UTF8
 */
function readFileSync(_stFileNameAbs) {
    return fs.readFileSync(_stFileNameAbs, UBTM_UTF8);
}

exports.UBTM_ASCII = UBTM_ASCII;
exports.UBTM_UTF8 = UBTM_UTF8;
exports.UBTM_UTF16LE = UBTM_UTF16LE;
exports.UBTM_UCS2 = UBTM_UCS2;
exports.UBTM_LATIN1 = UBTM_LATIN1;
exports.UBTM_BINARY = UBTM_BINARY;
