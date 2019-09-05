"use strict";

/* jshint esversion: 6 */

/*
ОПИСАНИЕ: утилитные функции для получения отладочной информации о различных сущностях

 */

const util = require('util');
const TUtil = require('./TUtil');

//`````````````````````````````````````````````````````````````````````````````````````````````````

/**
 * Если TRUE то при выводе показывается так же typeof объекта
 * @type {boolean}
 */
let mOptTypeof = false;

/**
 * Возвращает информацию об объекте (1) в удобочитаемом виде
 * @param _oj (1) --
 */
function info(_oj) {
    TUtil.argsCountVerifEx(arguments, 1);
    return fnInspect(_oj);
}

/**
 * Помимо информации о самом объекте (1) отображает так же информацию о всех его прототипах
 *
 * @param _oj (1) --
 * @returns {string} например { c: 4 } --> { a: 2 } --> {}
 */
function info_B(_oj) {
    TUtil.argsCountVerifEx(arguments, 1);
    //---
    if (!_oj) {
        return fnInspect(_oj);
    }
    //---
    let stRet = fnInspect(_oj);
    let ojIn = Object.getPrototypeOf(_oj);
    while (ojIn) {
        stRet += ' --> ' + fnInspect(ojIn);
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
    TUtil.argsCountVerifEx(arguments, 3);
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
    TUtil.argsCountVerifEx(arguments, 3);
    console.log(_stPrefix + info_B(_oj) + _stSuffix);
}

/**
 * Возвращает определение функции которая использовалась как конструктор для создания объекта (1)
 * @param _oj (1) --
 * @returns {string}
 */
function infoConstructor(_oj) {
    TUtil.argsCountVerifEx(arguments, 1);
    return '' + _oj.constructor;
}

function optTypeof(_bool) {
    mOptTypeof = _bool;
}

function fnInspect(_oj) {
    let x = '';
    if(mOptTypeof){
        x = ' ^typeof=[' + (typeof _oj) + ']';
    }
    //---
    return util.inspect(_oj) + x;
}

//`````````````````````````````````````````````````````````````````````````````````````````````````
exports.info = info;
exports.infoConsole = infoConsole;
exports.info_B = info_B;
exports.infoConsole_B = infoConsole_B;
exports.infoConstructor = infoConstructor;
exports.optTypeof = optTypeof;
