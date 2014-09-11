/**
 * Created by houyhea on 14-9-11.
 * copyright © houyhea{at}126.com www.filterjs.com
 *
 */
(function () {
    'use strict';
    var VERSION = "0.1.0",
        globalScope = typeof global !== 'undefined' ? global : this,
        oldGlobalMoment;
    var Filterjs = function (tpl, config) {

    }
    Filterjs.version=VERSION;
    Filterjs.prototype = {
        render: function (data) {
            return this.tpl;
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