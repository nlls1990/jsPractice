(function(){
    // Baseline setup
    // --------------

    // 创建根对象, `window` 处于浏览器中, `exports`在服务器端
    var root = this;

    // 保存前置下划线的变量
    var previousUnderscore = root._;

    // 保存字节用于最小版本:
    var 
        ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype;
        
    // 创建快速参考变量用于快速访问核心原型
    var
        push            = ArrayProto.push,
        slice           = ArrayProto.slice,
        toString        = ObjProto.toString,
        hasOwnProperty  = ObjProto.hasOwnProperty;

    // 所有的ES5原生函数实现, 在这里声明
    var
        nativeIsArray   = Array.isArray,
        nativeKeys      = Object.keys,
        nativeBind      = FuncProto.bind,
        nativeCreate    = Object.create;

    //定义一个裸函数
    var Ctor = function(){};

    //创建'_'函数(对象)
    var _ = function(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    // 导出 underscore 对象给 nodejs
    // 后台适配中需要包含API, 当处于浏览器时, 添加 `_` 作为一个全局对象
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    // Current version.
    _.VERSION = '1.8.3'


    // 用于内部使用的高阶函数, 传入回调函数
    // 主要用来执行函数病改变所执行函数的作用域, 最后加了一个argCount参数来制定参数个数
    var optimizeCb = function(func, context, argCount) {
        if (context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
            case 1: return function(value) {
                return func.call(context, value);
            };
            case 2: return function(value, other) {
                return func.call(context, value, other);
            };
            case 3: return function(value, index, collection) {
                return func.call(context, value, index, collection);
            };
            case 4: return function(accumulator, value, index, collection) {
                return func.call(context, accumulator, value, index, collection);
            };
        }
        return function(){
            return func.apply(context, arguments);
        };
    };


    var cb = function(value, context, argCount) {
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value)) return _.matcher(value);
        return _.property(value);
    };
    _.iteratee = function(value, context) {
        return cb(value, context, Infinity);
    };

    // 内部函数用于创建分配器函数
    var createAssigner = function(keysFunc, undefineOnly) {
        return function(obj) {
            var length = arguments.length;
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index],
                    keys = keysFunc(source),
                    l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (!undefinedOnly || obj[key] == void 0) obj[key] = source[key];
                }
            }
            return obj;
        }
    }

    // 内部函数用于创建一个新的对象, 这个对象继承自另外一个???
    var baseCreate = function(prototype) {
        if (!_.isObject(prototype)) return {};
        if (nativeCreate) return nativeCreate(prototype);
        Ctor.prototype = prototype;
        var result = new Ctor;
        Ctor.prototype = null;
        return result;
    };

    var property = function(key) {
        return function(obj) {
            return obj == null ? void 0 : obj[key];
        };
    };

    // 
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = property('length');
    var isArrayLike = function(collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

}.call(this));