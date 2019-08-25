"use strict";

/* jshint esversion: 6 */

const util = require('util');
const TObject = require('./xrsu/TObject');

//-------------------------------------------------------------------------------------------------

function User(name) {
    this.name = name;
}

User.prototype.age = 22;

let pete = new User('Pete');
let mary = new User('Mary');

TObject.infoConsole_B('', pete, '');
