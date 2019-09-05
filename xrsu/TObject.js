"use strict";

/* jshint esversion: 6 */

const util = require('util');
const TUtil = require('./TUtil');
const lodash = require('lodash');

/**
 * Если (1) это функция то возвращает _фан-прототип ([fyxu]) этой функции, иначе просто прототип
 *
 * @param _any (1) --
 * @returns {any}
 */
function prototypeGet(_any) {
    if (_any === null) {
        return null;
    }
    //---
    if (_any === undefined) {
        return undefined;
    }
    //---
    if (typeof _any === 'function') {
        return _any.prototype;
    }
    //---
    return Object.getPrototypeOf(_any);
}

/**
 * Устанавливает для (1) в качестве прототипа сущность (2)
 * @param _any (1) --
 * @param _proto (2) --
 */
function prototypeSet(_any, _proto) {
    if (_any && _proto) {
        Object.setPrototypeOf(_any, _proto);
    }
}

/**
 * Проходит по объектам из массива объектов (1) и отбирает УНИКАЛЬНЫЕ значения поля (2) этих объектов. Эти значения
 * пишет в ключи выходного Map, а в значения ключей пишет количество повторений этих значений.
 * Не отбирает значения у которых "typeof === 'function' || 'object'". Если (3) == TRUE то не отбирает также undefined
 * значения.
 *
 * @param _ojs {Array} (1) -- массив объектов
 * @param _stFieldPath {String} (2) -- [kmkx]; путь к свойству, например 'b.a' или 'b'
 * @param _bUndefIgnore {Boolean} (3) -- если TRUE то значения 'undefined' не попадают в итоговый Map
 * @returns {Map<any, any>}
 */
function valuesGet(_ojs, _stFieldPath, _bUndefIgnore) {
    TUtil.argsCountVerifEx(arguments, 3);
    TUtil.exceptIf(_ojs, '=[' + _ojs + ']');
    TUtil.exceptIf(_stFieldPath, '=[' + _stFieldPath + ']');
    //---
    const mapRet = new Map();
    _ojs.forEach((oj) => {
        const stVal = fieldValueGet(oj, _stFieldPath);
        if (!_bUndefIgnore || stVal !== undefined) {
            if (mapRet.has(stVal)) {
                mapRet.set(stVal, mapRet.get(stVal) + 1);
            } else {
                mapRet.set(stVal, 1);
            }
        }
    });
    return mapRet;
}

/**
 * Возвращает TRUE если объект (1) имеет собственное свойство (2)
 *
 * @param _oj {Object} (1) --
 * @param _stFieldName {String} (2) --
 * @returns {boolean}
 */
function fieldOwnExist(_oj, _stFieldName) {
    TUtil.argsCountVerifEx(arguments, 2);
    TUtil.exceptIf(_oj, _oj + '');
    TUtil.exceptIf(_stFieldName, _stFieldName);
    //---
    return _oj.hasOwnProperty(_stFieldName);
}

/**
 * Ищет в объекте (1) поле (2). Если находит, и значение этого поля не функция и не объект (т.е. и не null),
 * то возвращает это значение, иначе возвращает undefined
 *
 * @param _oj {Object} --
 * @param _stFieldPath {String} (2) -- [kmkx]; путь к свойству, например 'b.a' или 'b'
 * @returns {*}
 */
function fieldValueGet(_oj, _stFieldPath) {
    TUtil.argsCountVerifEx(arguments, 2);
    TUtil.exceptIf(_oj, _oj + '');
    TUtil.exceptIf(_stFieldPath, _stFieldPath);
    //---
    let ret = lodash.property(_stFieldPath)(_oj);
    if (typeof ret !== 'function' && typeof ret !== 'object') {
        return ret;
    }
    return undefined;
}

exports.prototypeGet = prototypeGet;
exports.prototypeSet = prototypeSet;
exports.valuesGet = valuesGet;
exports.fieldValueGet = fieldValueGet;
exports.fieldOwnExist = fieldOwnExist;
