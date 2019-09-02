"use strict";

/* jshint esversion: 6 */

const util = require('util');
const TObject = require('./xrsu/TObject');
const {User} = require('./temp1');

//-------------------------------------------------------------------------------------------------

let oj = {
    aa: {cc: 1},
    bb: 2
};

let {aa: {cc}} = oj;

console.log('cc [' + cc + ']');


