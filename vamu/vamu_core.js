"use strict";

/* jshint esversion: 8 */

const Flashcards = require('./flashcards');

async function go(_ojNmec) {
    if(_ojNmec.action === 'tagsGet'){
        return await Flashcards.tagsGet();
    }
    else if(_ojNmec.action === 'cardRandomGet'){
        return await Flashcards.cardRandomGet(_ojNmec);
    }
    else if(_ojNmec.action === 'createOrUpdate'){
        return await Flashcards.cardCreateOrUpdate(_ojNmec.cardOj);
    }
    else if(_ojNmec.action === 'count'){
        return await Flashcards.cardCount();
    }
    else if(_ojNmec.action === 'countBySelect'){
        return await Flashcards.cardCountBySelect(_ojNmec);
    }
    else if(_ojNmec.action === 'cardDelete'){
        return await Flashcards.cardDelete(_ojNmec);
    }
    else if(_ojNmec.action === 'esistsFront'){
        return await Flashcards.cardExist(_ojNmec.cardOj);
    }
    return new Promise();
}

exports.go = go;
