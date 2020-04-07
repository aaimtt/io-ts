var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * @since 3.0.0
 */
import * as A from 'fp-ts/es6/Array';
import * as E from 'fp-ts/es6/Eq';
import * as R from 'fp-ts/es6/Record';
import * as S from './Schemable';
// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export var string = E.eqString;
/**
 * @since 3.0.0
 */
export var number = E.eqNumber;
/**
 * @since 3.0.0
 */
export var boolean = E.eqBoolean;
/**
 * @since 3.0.0
 */
export var UnknownArray = E.fromEquals(function (x, y) { return x.length === y.length; });
/**
 * @since 3.0.0
 */
export var UnknownRecord = E.fromEquals(function (x, y) {
    for (var k in x) {
        if (!(k in y)) {
            return false;
        }
    }
    for (var k in y) {
        if (!(k in x)) {
            return false;
        }
    }
    return true;
});
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 3.0.0
 */
export function nullable(or) {
    return {
        equals: function (x, y) { return (x === null || y === null ? x === y : or.equals(x, y)); }
    };
}
/**
 * @since 3.0.0
 */
export var type = E.getStructEq;
/**
 * @since 3.0.0
 */
export function partial(properties) {
    return {
        equals: function (x, y) {
            for (var k in properties) {
                var xk = x[k];
                var yk = y[k];
                if (!(xk === undefined || yk === undefined ? xk === yk : properties[k].equals(xk, yk))) {
                    return false;
                }
            }
            return true;
        }
    };
}
/**
 * @since 3.0.0
 */
export var record = R.getEq;
/**
 * @since 3.0.0
 */
export var array = A.getEq;
/**
 * @since 3.0.0
 */
export var tuple = E.getTupleEq;
/**
 * @since 3.0.0
 */
export function intersection(left, right) {
    return {
        equals: function (x, y) { return left.equals(x, y) && right.equals(x, y); }
    };
}
/**
 * @since 3.0.0
 */
export function sum(tag) {
    return function (members) {
        return {
            equals: function (x, y) {
                var vx = x[tag];
                var vy = y[tag];
                if (vx !== vy) {
                    return false;
                }
                return members[vx].equals(x, y);
            }
        };
    };
}
/**
 * @since 3.0.0
 */
export function lazy(f) {
    var get = S.memoize(f);
    return {
        equals: function (x, y) { return get().equals(x, y); }
    };
}
/**
 * @since 3.0.0
 */
export var eq = __assign(__assign({}, E.eq), { literal: function () { return E.eqStrict; }, string: string,
    number: number,
    boolean: boolean,
    UnknownArray: UnknownArray,
    UnknownRecord: UnknownRecord,
    nullable: nullable,
    type: type,
    partial: partial,
    record: record,
    array: array,
    tuple: tuple,
    intersection: intersection,
    sum: sum, lazy: function (_, f) { return lazy(f); } });