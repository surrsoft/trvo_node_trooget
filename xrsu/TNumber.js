"use strict";

/* jshint esversion: 6 */

/*
ОПИСАНИЕ: утилитные функции для работы с числами

 */

const lodash = require('lodash');
const TUtil = require('./TUtil');

module.exports = {
  /**
   * Генерирует случайное целое число в диапазоне 0..(1), включая 0 и (1)
   *
   * @param _i {Number} (1) -- целое число, например 2
   * @return {Number} например: 0, 2, 1, 0, 1, ...
   */
  random: function (_i) {
    return lodash.random(_i);
  },

  /**
   * Возвращает случайное числов диапазоне между (1) и (2) включая сами эти (1) и (2).
   * Допускается чтобы (2) был меньше чем (1).
   * Допускаются отрицательные числа в (1) и (2).
   * Не похожие на число значения (1)(2) преобразуются в 0.
   *
   * #exception если число переданных параметров != 2
   *
   * @param _iStart {Number} (1) -- например 2
   * @param _iEnd {Number} (2) -- например 4
   * @return {number} например 2 или 3 или 4
   */
  random_B: function (_iStart, _iEnd) {
    TUtil.argsCountVerifEx(arguments, 2);
    return lodash.random(_iStart, _iEnd);
  },

  // /** {in work}
  //  * Генерирует (3) случайных числе из диапазона чисел (1)(2) (включая (1) и (2)).
  //  * Если (3) больше чем длина диапазона (1)(2) то генерируется ...
  //  *
  //  * @param _iStart
  //  * @param _iEnd
  //  * @param _iCount
  //  */
  // random_C: function (_iStart, _iEnd, _iCount) {
  //
  // }
};
