"use strict";
/* jshint esversion: 6 */

/*
[[adpm]] - логгирование с уровнями
 */

//если здесь FALSE то вывод в лог будет только в том случае если функция adpmLog() вызывалась с
// [hnuo]-константой равной HNUO_ALWAYS
const bShow = false;

let iLevelCurr = 1;

const ADPM_OPEN = 1;
const ADPM_IN = 2;
const ADPM_CLOSE = 3;

//--- [[hnuo]]
const HNUO_ALWAYS = 1;


/**
 *
 * @param iLevel
 * @returns {string}
 */
function fnPad(iLevel) {
    let stConfPrefixChunk = '   ';
    //---
    if (iLevel < 0) {
        iLevel = 0;
    }
    //---
    let stRet = "";
    for (let i = 0; i < iLevel; i++) {
        stRet += stConfPrefixChunk;
    }
    //---
    return stRet;
}

function fnConsole(_st, _iHnuoConst) {
    if (_iHnuoConst === HNUO_ALWAYS || bShow) {
        console.log(_st);
    }
}

/**
 *
 * @param _ojToLog
 * @param _iOdpoConst
 * @param _iHnuoConst
 */
function adpmLog(_ojToLog, _iOdpoConst, _iHnuoConst) {
    const stPrefixOpen = "{{ ";
    const stPrefixClose = "}}";
    //---
    let stPad = fnPad(iLevelCurr);
    //---
    if (_iOdpoConst === ADPM_OPEN) {
        fnConsole(stPad + stPrefixOpen + _ojToLog, _iHnuoConst);
    } else if (_iOdpoConst === ADPM_IN) {
        fnConsole(stPad + _ojToLog, _iHnuoConst);
    } else if (_iOdpoConst === ADPM_CLOSE) {
        stPad = fnPad(iLevelCurr - 1);
        fnConsole(stPad + stPrefixClose, _iHnuoConst);
    }
    //---
    if (_iOdpoConst === ADPM_OPEN) {
        iLevelCurr++;
    } else if (_iOdpoConst === ADPM_CLOSE) {
        iLevelCurr--;
    }
}

exports.ADPM_OPEN = ADPM_OPEN;
exports.ADPM_IN = ADPM_IN;
exports.ADPM_CLOSE = ADPM_CLOSE;
exports.HNUO_ALWAYS = HNUO_ALWAYS;
exports.log = adpmLog;
