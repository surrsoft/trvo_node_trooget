"use strict";

/* jshint esversion: 6 */

const util = require('util');
const TUtil = require('./TUtil');

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

exports.prototypeGet = prototypeGet;
exports.prototypeSet = prototypeSet;
