/**
 * Created by houyhea on 14-9-11.
 * copyright © houyhea{at}126.com www.filterjs.com
 *
 */
(function () {
    'use strict';
    var VERSION = "0.1.0",
        globalScope = typeof global !== 'undefined' ? global : this,
        oldGlobalMoment,
        funcNameReg = /^[_a-zA-Z]\w*/;
    g_filters = {};
    var Filterjs = function (tpl, config) {

    }
    Filterjs.version = VERSION;

    Filterjs.register = function (name, func) {
        if (funcNameReg.test(name)) {
            g_filters[name] = func;
            return this;
        }
        throw '"' + name + '" is not valid filter name.';
    };
    Filterjs.prototype = {
        render: function (data) {
            return this.tpl;
        },
        register: function () {
            var a = arguments;
            if (a.length <= 0)
                return;
            if (typeof a[0] === "string") {
                if (!funcNameReg.test(a[0])) {
                    throw '"' + a[0] + '" is not valid filter name.';
                }
                if (typeof a[1] !== "function")
                    throw "need a function param.";
                this.filters[a[0]] = a[1];
            }
        },
        config: function (config) {

        }

    }
    Filterjs.noConflict = function () {
        globalScope.Filterjs = oldGlobalMoment;
        return Filterjs;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Filterjs;

    } else if (typeof window.define === 'function' && window.define.amd) {
        window.define('Filterjs', [], function () {
            return Filterjs;
        });
    }
    else {
        oldGlobalMoment = globalScope.Filterjs;
        globalScope.Filterjs = Filterjs;
    }

    return Filterjs;

}).call(this);