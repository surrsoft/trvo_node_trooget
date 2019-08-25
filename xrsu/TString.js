"use strict";

/* jshint esversion: 6 */

/**
 * Возвращает TRUE если строка (1) удовлетворяет регулярному выражению (2), иначе возвращает FALSE
 *
 * @param _st
 * @param _stRegExp
 * @returns {boolean}
 */
function isComplianceRegExp(_st, _stRegExp) {
    const regExp = new RegExp(_stRegExp);
    const st = regExp.exec(_st);
    return st !== null;
}

exports.isComplianceRegExp = isComplianceRegExp;
