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
        funcNameReg = /^[_a-zA-Z]\w*/,
        g_templates = {},
        g_filters = {},
        CONFIG = {
            cache: true         //是否缓存模板编译后的函数
        };

    function extend(a, b) {
        if (!b || !a)
            return a;

        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }

        if (b.hasOwnProperty("toString")) {
            a.toString = b.toString;
        }

        if (b.hasOwnProperty("valueOf")) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function compile(str, config) {
        if (g_templates[str]) {
            return g_templates[str];
        }
        var sreg = /{{#([^#]+)#}}/g;//语句
        var vreg = /{{([^0-9][^#]+)}}/g;//变量
        str = str.replace(/[\r\t\n]/g, ' ');
        str = str.replace(/"/g, "'");//双引号变单引号，原因：构造的函数里，字符串通过双引号。所以里面的字符串必须用单引号。
        str = str.replace(vreg,function (s, w) {
            return '"+(' + parseFilter(w) + ');results+="';

        }).replace(sreg, function (s, w) {
                s = s.replace(/^{{#/g, '').replace(/#}}$/g, '');
                return '";' + s.replace(/\\/g, '') + '; results+="';

            });
        str = '"use strict";try{var results = "' + str + '";return results;}catch(err){return "error:"+err.stack;}';
        console.log(str);

        try {
            var func = new Function("filters", str);
            g_templates[str] = func;
            return func;
        }
        catch (err) {
            var msg = "error:" + err.stack;
            var code = "return '" + msg + "'";
            return new Function("filters", code);
        }
    }

    function parseFilter(str) {
        str = str || "";
        var index = str.lastIndexOf("|");
        if (index < 0) {
            return str;
        }
        var f1 = str.substr(0, index);
        var f2 = str.substr(index + 1);
        var param = parseFilter(f1);
        var func = f2.split(":");
        var f = "filters[\"" + func[0].trim() + "\"]";
        if (func.length > 1)
            return f + '(' + param + ',' + func[1].trim() + ')';
        return f + '(' + param + ')';

    }

    var Filterjs = function (tpl, config) {
        if (this instanceof Filterjs) {
            this._tpl = tpl;
            this._config = extend(CONFIG, config);
        } else {
            return new Filterjs(tpl, config);
        }


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
            var func = compile(this._tpl, this._config);
            var result = func(data, g_filters);
            return result;
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
            else {
                extend(this.filters, a[0]);
            }
        },
        unregister: function (name) {
            if (this.filters.hasOwnProperty(name)) {
                return delete this.filters[name];
            }
        },
        config: function (config) {
            if (config == null) {
                return this._config;
            }
            extend(this._config, config);
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