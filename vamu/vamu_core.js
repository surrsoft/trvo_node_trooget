"use strict";

/* jshint esversion: 6 */

const Flashcards = require('./flashcards');

function go(ojNmec) {
    if(ojNmec.action === 'tagsGet'){
        Flashcards.tagsGet();
    }
    return '';
}

exports.go = go;
