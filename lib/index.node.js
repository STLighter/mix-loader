"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncGenerator2 = require("babel-runtime/helpers/asyncGenerator");

var _asyncGenerator3 = _interopRequireDefault(_asyncGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @file MixLoader
 * @author LeuisKen <leuisken@foxmail.com>
 */

/**
 * 合并多个异步迭代器，返回一个新的异步迭代器
 * 该迭代器每次返回 pickNumber 个数据
 * 数据按照 sortFn 排序
 *
 * @param {Array} iterators 异步迭代器数组对象
 * @param {Function} sortFn 对请求结果进行排序的函数
 * @param {number} pickNumber 迭代器每次返回的元素数量
 */
exports.default = (() => {
    var _ref = _asyncGenerator3.default.wrap(function* (iterators, sortFn, pickNumber) {
        // 用于保存结果的数组
        let dataSet = [];
        // 需要请求的迭代器列表
        let activeIterators = iterators.slice();

        // 还有迭代器可以请求时
        while (activeIterators.length > 0) {
            // 所有迭代器请求一次
            const reqs = activeIterators.map(function (iter) {
                return iter.next();
            });
            let res = yield _asyncGenerator3.default.await(_promise2.default.all(reqs));

            for (let i = 0; i < res.length; i++) {
                let { value, done } = res[i];
                // console.log(value, done);
                // 如果该迭代器迭代完了，就从迭代器列表中移除
                if (done) {
                    activeIterators.splice(i, 1);
                }
                // 否则，将请求到的数组，合并到结果中
                else {
                        dataSet = dataSet.concat(value);
                    }
            }

            // 对结果排序
            dataSet.sort(sortFn);

            // 从结果中取出 pickNumber 个数据
            // console.log(dataSet);
            yield dataSet.splice(0, pickNumber);
        }

        // 所有异步数据都请求完毕后，结果数组有剩余，则不发请求，直接从结果数组中取数据即可
        while (dataSet.length > 0) {
            // console.log(dataSet);
            yield dataSet.splice(0, pickNumber);
        }
    });

    function mixLoader(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    }

    return mixLoader;
})();