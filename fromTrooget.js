/*
Функции перенесенные с клиента для обеспечения функционала создания индекса
 */

"use strict";
/* jshint esversion: 6 */

const adpm = require('./adpmLog');

/**
 * Возвращает ThHtmlIdPar на базе селектора. Отличается от А только тем что возвращает в виде объекта, а не массива;
 * также тем, что селектор может быть типа ThSelC
 *
 * СТАРОЕ ИМЯ: yg54g_Strings_html_convertSr_B
 *
 * @param stSelector (1) -- селектор типа ThSelС
 * вместо # и . ничего другого быть не может
 * @returns {object} объект ThHtmlIdPar, например {tag: "div", comma: "id", name: "nameId"}
 */
function fnSelectorConvert(stSelector) {
    let rx = new RegExp("(.{0,})([\\.#])(.{0,})", "i");
    let match = rx.exec(stSelector);
    //---
    let name = "", comma = "", tag = "";
    if (match) {
        name = match[2];
        if (name === ".") {
            name = "class";
        }
        if (name === "#") {
            name = "id";
        }
        //
        comma = match[3];
        tag = match[1];
    } else {
        if (stSelector.length > 0) {
            tag = stSelector;
        }
    }

    //--- формирование выходного объекта
    let ojRes = {tag: "", comma: "", name: ""};
    ojRes.tag = tag;
    ojRes.comma = name;
    ojRes.name = comma;

    return ojRes;
}


/**
 *
 * Извлечение из строки (1) outerHTML или innerHTML первого тега удовлетворяющего селектору (2).
 * Возвращает объект формата ([[wmow]])
 * {
 *   newst: строка (1) без блока (2),
 *   blockOuter: outerHTML блока (2),
 *   blockInner: innerHTML блока (2)
 * }
 *
 * Опции:
 * А) извлекается только первый встретившийся тег.
 * B) Извлечение идет строго в таком виде в каком тег
 * содержится в (1) - jQuery не используется.
 * C) ThTTag (2) могут быть вложенными друг в друга.
 * <b>ОТЛИЧИЯ ОТ А:</b>
 * 1) возвращает и искомый блок и исходную строку без данного блока
 *
 * СТАРОЕ ИМЯ: yg54g_Strings_html_getTg_C
 *
 * @param _stFrom (1) -- строка из которой извлекается тег
 * @param _stSelector (2) -- селектор типа ThSelC, например "#name" или "div"
 * @param _stMode (3) -- "p_innerHTML" или "p_outerHTML"* по умолчанию (* или что угодно)
 * @returns {object} если блок не находит, то возвращает объект типа
 * {newst: "исходная-строка-(1)", blockOuter: "", blockInner: ""}
 */
function tagGet(_stFrom, _stSelector, _stMode) {
    adpm.log('tagGet', adpm.ADPM_OPEN);
    const iTemp = _stFrom.indexOf('html');

    //результирующий объект
    const res = {newst: "", blockOuter: "", blockInner: ""};

    //разбивка селектора
    const ojSelector = fnSelectorConvert(_stSelector);

    const stRegExp = fnSelectorToStRegExp(_stSelector);
    const regExp37 = new RegExp(stRegExp, "gim");

    //используется техника m85m (циклическое добавление закрывающей конструкции (тега))
    let arrExResult;
    let ct = 1;
    let stMatch;
    do { //LOOP
        arrExResult = regExp37.exec(_stFrom);
        if (arrExResult !== null) {
            stMatch = arrExResult[0];
            //---
            let stTag = ojSelector.tag;
            //для случая когда в селекторе не указан тег
            if (arrExResult[1]) {
                stTag = arrExResult[1];
            }

            //--- определение количества открывающих тегов в отобранном
            const rx2 = new RegExp("\\<\\s*" + stTag + "[\\s\\>]+", "gim");
            //--- количество совпадений
            const ctOpenTags = stMatch.match(rx2).length;

            //--- определение количества закрывающих тегов в отобранном
            const rx3 = new RegExp("\\<\\s{0,}/" + stTag + "\\s{0,}\\>", "igm");
            const ctCloseTags = stMatch.match(rx3).length;

            if (ctOpenTags !== ctCloseTags) {
                //--- строка для RegExp с дополнительной закрывающей конструкцией на конце
                const newRx = fnSelectorToStRegExp_B(_stSelector, ct);

                const rx1 = new RegExp(newRx, "gim");
                ct++;
            } else {
                break;
            }
        }
    } while (arrExResult !== null); //LOOP

    //---
    if (stMatch) {
        res.newst = _stFrom.replace(stMatch, "");
        res.blockOuter = stMatch;
        if (_stMode === "p_innerHTML") {
            //выделяется все что внутри parent-конструкции <x>..</x>
            const regex = new RegExp("^\\<[\\s\\S]*?\\>([\\s\\S]*)\\r*\\n*\\<[\\s\\S]*?\\>$", "i");
            const ex = regex.exec(stMatch);
            if (ex) {
                res.blockInner = ex[1];
            }
        }
    } else {
        res.newst = _stFrom;
    }

    adpm.log('', adpm.ADPM_CLOSE);
    return res;
}


/**
 * Преобразует селектор (1) в строку для RegExp (ThRxStbb).
 * От А отличается добавлением закрвающих конструкций (тегов) в количестве (2).
 *
 * СТАРОЕ ИМЯ: yg54g_Strings_html_SrToRx_B
 *
 * @param _stSelector (1) -- селектор типа ThSelC, например "div", ".name", "div.name"
 * @param _iCtClose (2) -- количество закрывающих конструкций которые нужно добавить
 * @return {string} строка для использования в конструкции "new RegExp(.., ..)", например "\\<\\s*div"
 */
function fnSelectorToStRegExp_B(_stSelector, _iCtClose) {
    //селектор в виде объекта спец. формата
    let ojSr = fnSelectorConvert(_stSelector);
    //:{tag: "div", comma: "id", name: "test"}
    let sRx;
    if (ojSr.tag && ojSr.comma && ojSr.name) {
        let tag1 = ojSr.tag + "\\s+";
        let tag2 = ojSr.tag;
        let attr = "[^\\<\\>]*?" + ojSr.comma + "\\s*=\\s*\"*'*" + ojSr.name;
        let x2 = "[\\s\"']";
        sRx = "\\<\\s*" + tag1 + attr + "(?:\\>|" + x2 + "[^\\<\\>]*?\\>)[\\s\\S]*?\\<\\s*/\\s*" + tag2 + "\\s*\\>";
    }
    if (ojSr.tag && !ojSr.comma && !ojSr.name) {
        let tag1 = ojSr.tag;
        let tag2 = ojSr.tag;
        let attr = "";
        let x2 = "\\s+";
        sRx = "\\<\\s*" + tag1 + attr + "(?:\\>|" + x2 + "[^\\<\\>]*?\\>)[\\s\\S]*?\\<\\s*/\\s*" + tag2 + "\\s*\\>";
    }
    if (!ojSr.tag && ojSr.comma && ojSr.name) {
        let tag1 = "([^\\<\\>]*?)\\s+";
        let tag2 = "\\1";
        let attr = "[^\\<\\>]*?" + ojSr.comma + "\\s*=\\s*\"*'*" + ojSr.name;
        let x2 = "[\\s\"']";
        sRx = "\\<\\s*" + tag1 + attr + "(?:\\>|" + x2 + "[^\\<\\>]*?\\>)[\\s\\S]*?\\<\\s*/\\s*" + tag2 + "\\s*\\>";
    }
    //добавление закрывающих конструкций
    for (let i = 0; i < _iCtClose; i++) {
        let tag;
        if (ojSr.tag) {
            tag = ojSr.tag;
        } else {
            tag = "\\1";
        }
        sRx = sRx + "[\\s\\S]*?\\<\\s*/\\s*" + tag + "\\s*\\>";
    }
    return sRx;
}


/**
 * Преобразует селектор (1) в строку для RegExp (ThRxStbb).
 *
 * СТАРОЕ ИМЯ: yg54g_Strings_html_SrToRx
 *
 * @param _stSelector (1) -- селектор типа ThSelC, например "div", ".name", "div.name"
 * @retruns {string} строка для использования в конструкции "new RegExp(.., ..)", например "\\<\\s*div"
 */
function fnSelectorToStRegExp(_stSelector) {
    //селектор в виде объекта спец. формата
    let ojSr = fnSelectorConvert(_stSelector);
    //:{tag: "div", comma: "id", name: "test"}
    let sRx;
    if (ojSr.tag && ojSr.comma && ojSr.name) {
        let tag1 = ojSr.tag + "\\s+";
        let tag2 = ojSr.tag;
        let attr = "[^\\<\\>]*?" + ojSr.comma + "\\s*=\\s*\"*'*" + ojSr.name;
        let x2 = "[\\s\"']";
        sRx = "\\<\\s*" + tag1 + attr + "(?:\\>|" + x2 + "[^\\<\\>]*?\\>)[\\s\\S]*?\\<\\s*/\\s*" + tag2 + "\\s*\\>";
    }
    if (ojSr.tag && !ojSr.comma && !ojSr.name) {
        let tag1 = ojSr.tag;
        let tag2 = ojSr.tag;
        let attr = "";
        let x2 = "\\s+";
        sRx = "\\<\\s*" + tag1 + attr + "(?:\\>|" + x2 + "[^\\<\\>]*?\\>)[\\s\\S]*?\\<\\s*/\\s*" + tag2 + "\\s*\\>";
    }
    if (!ojSr.tag && ojSr.comma && ojSr.name) {
        let tag1 = "([^\\<\\>]*?)\\s+";
        let tag2 = "\\1";
        let attr = "[^\\<\\>]*?" + ojSr.comma + "\\s*=\\s*\"*'*" + ojSr.name;
        let x2 = "[\\s\"']";
        sRx = "\\<\\s*" + tag1 + attr + "(?:\\>|" + x2 + "[^\\<\\>]*?\\>)[\\s\\S]*?\\<\\s*/\\s*" + tag2 + "\\s*\\>";
    }
    return sRx;
}

exports.tagGet = tagGet;
