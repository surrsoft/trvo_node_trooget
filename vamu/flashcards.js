"use strict";

/* jshint esversion: 6 */

const Nedb = require('nedb');
const TInfo = require('../xrsu/TInfo');
const TUtil = require('../xrsu/TUtil');
const TObject = require('../xrsu/TObject');

//``````

const dbFlashcards = new Nedb({filename: './vamu/flashcards.json'});
dbFlashcards.loadDatabase();



function tagsGet() {
    dbFlashcards.find({}, function (err, docs) {
        //TInfo.infoConsole('', docs, ''); //del
        console.log(docs);
        const map = TObject.valuesGet(docs, 'tag');
        console.log(map);
    });
}

//``````
exports.tagsGet = tagsGet;
