"use strict";

/* jshint esversion: 6 */

const util = require('util');
const TObject = require('./xrsu/TObject');
const { User } = require('./temp1');
const TInfo = require('./xrsu/TInfo');
const lodash = require('lodash');
const TTemp = require('./xrsu/TTemp');
const TMap = require('./xrsu/TMap');
const TypeID = require('./xrsu/TypeID');


//-------------------------------------------------------------------------------------------------

const x = {
  a: 1,
  b: { c: 2 }
};

console.log(!!x.b.c);
