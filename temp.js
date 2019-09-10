"use strict";

/* jshint esversion: 6 */

const util = require('util');
const TObject = require('./xrsu/TObject');
const {User} = require('./temp1');
const TInfo = require('./xrsu/TInfo');
const lodash = require('lodash');
const TTemp = require('./xrsu/TTemp');
const TMap = require('./xrsu/TMap');

//-------------------------------------------------------------------------------------------------

let x = ({n}) => {
    console.log('n ['+n+']');
};

let m = {
    a: 1,
    n: 2
};

x(m);
