"use strict";

/* jshint esversion: 6 */

const util = require('util');
const TObject = require('./xrsu/TObject');
const {User} = require('./temp1');
const TInfo = require('./xrsu/TInfo');
const lodash = require('lodash');

//-------------------------------------------------------------------------------------------------

let ojs = [
    {s: 1, w: {a: 3}},
    {s: 1, w: {a: null}},
    {s: 1, w: {}},
    {s: 1, w: {a: undefined}},
    {s: 1, w: {a: function () {}}},
    {s: 1, w: {a: 3}},
    {s: 1, w: {a: 'r'}},
    {s: 1, w: {a: 'r'}},
];

let valuesMap = TObject.valuesGet(ojs, 'w.a', true);
console.log(valuesMap);
