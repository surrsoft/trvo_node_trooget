"use strict";

/* jshint esversion: 6 */

/*
ОПИСАНИЕ: утилитные функции для работы с типом Map

 */

const TUtil = require('./TUtil');

module.exports = {
    /**
     * Получить ключи Map (1) в виде массива
     *
     * @param _map {Map} (1) --
     * @returns {[]}
     */
    keysGet: function (_map) {
        TUtil.argsCountVerifEx(arguments, 1);
        TUtil.exceptIf(_map, _map + '');
        //---
        return Array.from(_map.keys());
    },

    /**
     * Отличается от А только тем что преобразует ключи к типу String
     *
     * @param _map {Map} (1) --
     * @returns {String[]}
     */
    keysGet_B: function (_map) {
        TUtil.argsCountVerifEx(arguments, 1);
        TUtil.exceptIf(_map, _map + '');
        //---
        const ret = [];
        for (const key of _map.keys()) {
            ret.push(key + '');
        }
        return ret;
    }

};

