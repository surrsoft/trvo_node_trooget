"use strict";

/* jshint esversion: 6 */

module.exports = {

    fn1 : function () {
        console.log('fn1');
    },

    fn2 : function () {
        console.log('fn2');
        this.fn1();
    }

};
