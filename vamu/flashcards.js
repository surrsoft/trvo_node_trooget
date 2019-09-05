"use strict";

/* jshint esversion: 8 */

const Nedb = require('nedb');
const TInfo = require('../xrsu/TInfo');
const TUtil = require('../xrsu/TUtil');
const TObject = require('../xrsu/TObject');
const lodash = require('lodash');
const TNumber = require('../xrsu/TNumber');

//``````

const dbFlashcards = new Nedb({filename: './vamu/flashcards.json'});
dbFlashcards.loadDatabase();


/**
 * Получение всех тегов (уникальных) в виде массива строк
 */
async function tagsGet() {
    return new Promise((resolve, reject) => {
        dbFlashcards.find({}, function (err, ojsDocs) {
            if (err) {
                reject(err);
            }
            //получив все карточки отбираем теги
            const arrStRes = TObject.valuesUnicumGet_B(ojsDocs, 'tag', true);
            resolve(arrStRes);
        });
    });
}

function fnFindOj(ojNmec) {
    const arrStTags = ojNmec.tags;
    const arrStBals = ojNmec.bals;
    TUtil.exceptIf(arrStTags !== undefined);
    TUtil.exceptIf(arrStBals !== undefined);
    //--- find object - ojFind
    let ojFind = {};
    if (arrStTags.length > 0) {
        ojFind.tag = {$in: arrStTags};
    }
    if (arrStBals.length > 0) {
        ojFind.bal = {$in: arrStBals};
    }
    return ojFind;
}

/**
 * Возвращает карточки подпадающие под условия (1)
 *
 * @param ojNmec
 * @return {Promise<*|Promise<unknown>|Promise|Promise>}
 */
async function cardsGet(ojNmec) {
    return new Promise((resolve, reject) => {
        let ojFind = fnFindOj(ojNmec);
        //---
        dbFlashcards.find(ojFind, function (err, docs) {
            if (err) {
                reject(err);
            }
            resolve(docs);
        });
    });
}

/**
 * Возвращает случайную карточку из всех карточек подпадающих под условие (1).
 * Если карточек не найдено, то возвращает null
 *
 * @param ojNmec
 * @return {Promise<{}|*>}
 */
async function cardRandomGet(ojNmec) {
    let cards = await cardsGet(ojNmec);
    //---
    if (cards.length === 0) {
        return null;
    }
    //---
    if (cards.length === 1) {
        return cards[0];
    }
    //---
    return cards[TNumber.random(cards.length - 1)];
}

async function cardCreateOrUpdate(_cardOj) {
    return new Promise((resolve, reject) => {
        dbFlashcards.update({_id: _cardOj._id}, _cardOj, {upsert: true}, function (err, numReplaced, upsert) {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
}

/**
 * Возвращает общее количество карточек
 *
 * @return {Promise<*|Promise<unknown>|Promise|Promise>}
 */
async function cardCount(){
    return new Promise((resolve, reject) => {
        dbFlashcards.count({}, function (err, count) {
            if(err){
                reject(err);
            }
            resolve(count);
        });
    });
}

/**
 * Возвращает общее количество карточек
 *
 * @return {Promise<*|Promise<unknown>|Promise|Promise>}
 */
async function cardCountBySelect(ojNmec){
    return new Promise((resolve, reject) => {
        let ojFind = fnFindOj(ojNmec);
        //---
        dbFlashcards.count(ojFind, function (err, count) {
            if(err){
                reject(err);
            }
            resolve(count);
        });
    });
}

/**
 * Удаляет карточку по id
 *
 * @return {Promise<*|Promise<unknown>|Promise|Promise>}
 */
async function cardDelete(ojNmec){
    return new Promise((resolve, reject) => {
        let ojFind = {_id: ojNmec.cardOj._id};
        //---
        dbFlashcards.remove(ojFind, {}, function (err, numRemoved) {
            if(err){
                reject(err);
            }
            resolve(numRemoved);
        });
    });
}


//``````
exports.tagsGet = tagsGet;
exports.cardsGet = cardsGet;
exports.cardRandomGet = cardRandomGet;
exports.cardCreateOrUpdate = cardCreateOrUpdate;
exports.cardCount = cardCount;
exports.cardCountBySelect = cardCountBySelect;
exports.cardDelete = cardDelete;
