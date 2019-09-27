"use strict";

/* jshint esversion: 6 */

//-------------------------------------------------------------------------------------------------

const _ = require('lodash');
const util = require('util');
const TString = require('./xrsu/TString');

function fn(_st, _iCount) {
  const st = TString.substringFirst(_st, _iCount);
  console.log(`|${_st}| => |${st}|`);
}

fn('string', 0);
fn('string', 1);
fn('string', 12);
