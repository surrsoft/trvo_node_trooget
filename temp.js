"use strict";

/* jshint esversion: 6 */

const util = require('util');
const TObject = require('./xrsu/TObject');
const {User} = require('./temp1');
const TInfo = require('./xrsu/TInfo');

//-------------------------------------------------------------------------------------------------

let a1 = 'b';
let a2 = a1;

a1 = 'c';

console.log('a1 ['+a1+']');
console.log('a2 ['+a2+']');

