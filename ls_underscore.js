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


}.call(this));