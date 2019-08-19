"use strict";

/* jshint esversion: 6 */

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

const stDiapSymbol = "t";
const stRegExp = "^[" + stDiapSymbol + "]_\\d+_[" + stDiapSymbol + "].html$";

const res = fnIsComplianceRegExp("t_18_t.html", stRegExp);
console.log('res [' + res + ']');

