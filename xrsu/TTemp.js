"use strict";

/* jshint esversion: 8 */

/*
DESCRIPTION : for experiments

 */

const { valueGet } = require('./TPromise.js');

function fn() {
    return new Promise((resolve, reject) => {
        resolve('ok');
    });
}

async function fn2() {
    const p = await fn().catch((err) => {
        console.log('!!!-!!!-!!! err {9/27/19-1:01 PM}\n', err); //del
    });
    const x = valueGet(p);
    console.log('!!!-!!!-!!! x {9/27/19-12:56 PM}\n', x); //del
}

fn2();


