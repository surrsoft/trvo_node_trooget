"use strict";

/* jshint esversion: 6 */

/*
ОПИСАНИЕ: утилитные функции для работы с числами

 */

const lodash = require('lodash');

module.exports = {
    /**
     * Генерирует случайное целое число в диапазоне 0..(1), включая 0 и (1)
     *
     * @param _i {Number} (1) -- целое число, например 2
     * @return {Number} например: 0, 2, 1, 0, 1, ...
     */
    random : function (_i) {
        return lodash.random(_i);
    }
};
