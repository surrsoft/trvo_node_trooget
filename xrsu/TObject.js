"use strict";

/* jshint esversion: 6 */

const util = require('util');
const TUtil = require('./TUtil');

/**
 * Возвращает информацию об объекте (1) в удобочитаемом виде
 * @param _oj (1) --
 */
function info(_oj) {
    TUtil.argsVerifEx(arguments, 1);
    return util.inspect(_oj);
}

/**
 * Помимо информации о самом объекте (1) отображает так же информацию о всех его прототипах
 *
 * @param _oj (1) --
 * @returns {string} например { c: 4 } --> { a: 2 } --> {}
 */
function info_B(_oj) {
    TUtil.argsVerifEx(arguments, 1);
    //---
    if (!_oj) {
        return util.inspect(_oj);
    }
    //---
    let stRet = util.inspect(_oj);
    let ojIn = Object.getPrototypeOf(_oj);
    while (ojIn) {
        stRet += ' --> ' + util.inspect(ojIn);
        ojIn = Object.getPrototypeOf(ojIn);
    }
    //---
    return stRet;
}

/**
 * Выводит информацию об объекте (2) в консоль в удобочитаемом виде
 * @param _stPrefix (1) --
 * @param _oj (2) --
 * @param _stSuffix (3) --
 */
function infoConsole(_stPrefix, _oj, _stSuffix) {
    TUtil.argsVerifEx(arguments, 3);
    console.log(_stPrefix + info(_oj) + _stSuffix);
}

/**
 * Выводит информацию об объекте (2) и всех его прототипах в консоль в удобочитаемом виде
 *
 * @param _stPrefix (1) --
 * @param _oj (2) --
 * @param _stSuffix (3) --
 */
function infoConsole_B(_stPrefix, _oj, _stSuffix) {
    TUtil.argsVerifEx(arguments, 3);
    console.log(_stPrefix + info_B(_oj) + _stSuffix);
}

/**
 * Возвращает определение функции которая использовалась как конструктор для создания объекта (1)
 * @param _oj (1) --
 * @returns {string}
 */
function infoConstructor(_oj) {
    TUtil.argsVerifEx(arguments, 1);
    return '' + _oj.constructor;
}

/**
 * Если (1) это функция то возвращает _фан-прототип ([fyxu]) этой функции, иначе просто прототип
 *
 * @param _any (1) --
 * @returns {any}
 */
function prototypeGet(_any){
    if(_any === null){
        return null;
    }
    //---
    if(_any === undefined){
        return undefined;
    }
    //---
    if(typeof _any === 'function'){
        return _any.prototype;
    }
    //---
    return Object.getPrototypeOf(_any);
}

exports.info = info;
exports.infoConsole = infoConsole;
exports.info_B = info_B;
exports.infoConsole_B = infoConsole_B;
exports.infoConstructor = infoConstructor;
exports.prototypeGet = prototypeGet;
