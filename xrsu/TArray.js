/*
ОПИСАНИЕ: функции для работы с массивами
 */

"use strict";

/* jshint esversion: 6 */

module.exports = {

    /**
     * Возвращает TRUE если (1) это массив (Array), иначе возвращает FALSE
     *
     * @param _arr {Array} (1) -- предположительно массив
     * @returns {boolean}
     */
    isArray: function (_arr) {
        return Array.isArray(_arr);
    },

    /**
     * Возвращает TRUE если (1) это массив и если он имеет длину > 0, иначе возвращает FALSE
     *
     * @param _arr {Array} (1) -- предположительно массив
     * @returns {boolean}
     */
    isNotEmpty: function (_arr) {
        return Array.isArray(_arr) && _arr.length > 0;
    },

    /**
     * Возвращает TRUE если (1) не массив или если массив, но нулевой длины
     *
     * @param _arr {Array} (1) -- предположительно массив
     * @returns {boolean}
     */
    isEmpty: function (_arr) {
        return !this.isNotEmpty(_arr);
    },


    /**
     * Отбирает из массива (1) элементы в количестве (2) и добавляет их в результирующий массив.
     * Возвращает пустой массив в любом из следующих случаев:
     * -- (1) это не массив
     * -- (2) или (3) меньше 0
     * -- (3) меньше чем (2)
     * -- (3) равно (2)
     * Если (3) больше чем длина массива (1) то на выходе будет копия массива (1)
     *
     * @param _arrFrom {Array} (1) -- предположительно массив
     * @param _iIndexBegin {number} (2) -- индекс начала отбора элементов (элемент располагающийся по этому индексу попадает
     * в результирующий массив)
     * @param _iIndexEnd {number} (3) -- индекс окончания отбора элементов (элемент располагающийся по этому индексу НЕ
     * попадает в результирующий массив)
     */
    subArray: function (_arrFrom, _iIndexBegin, _iIndexEnd) {
        if (this.isArray(_arrFrom)) {
            if (_iIndexBegin >= 0 && _iIndexEnd >= 0 && _iIndexEnd >= _iIndexBegin) {
                return _arrFrom.slice(_iIndexBegin, _iIndexEnd);
            }
        }
        return [];
    },

    /**
     * Отличается от А только тем что (3) работает как "включительно"
     *
     * @param _arrFrom {Array}
     * @param _iIndexBegin {number}
     * @param _iIndexEnd {number}
     */
    subArray_B: function (_arrFrom, _iIndexBegin, _iIndexEnd) {
        return this.subArray(_arrFrom, _iIndexBegin, _iIndexEnd + 1);
    },

};



