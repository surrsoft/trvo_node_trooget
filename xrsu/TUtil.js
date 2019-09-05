"use strict";

/* jshint esversion: 6 */

/**
 * Выбрасывает ошибку если количество аргументов в (1) не равно (2)
 * @param _arguments (1) --
 * @param _iCount (2) --
 */
function argsVerifEx(_arguments, _iCount) {
    if (arguments.length !== 2) {
        throw new Error('_args.length [' + _arguments.length + ']');
    }
    if (_iCount < 0) {
        throw new Error('_iCount [' + _iCount + ']');
    }
    //---
    if (_arguments.length !== _iCount) {
        throw new Error('incorrect number of arguments; [' + _arguments.length + '] instead [' + _iCount + ']');
    }
}

function exceptIf(_b, _stText) {
    if (!_b) {
        throw Error(_stText);
    }
}

exports.argsCountVerifEx = argsVerifEx;
exports.exceptIf = exceptIf;
