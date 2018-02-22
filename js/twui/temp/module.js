/* ------------------------------------------------------------
 * 版本:1.0
 * 描述:modules
 * ------------------------------------------------------------ */
+function ($) {
    // 定义:Conponent组件类
    // ------------------------------
    var Conponent = function ($element) {
        this.$ = $element;
    };

    // 定义:Conponent组件的类选择器
    // ------------------------------
    Conponent.prototype.selector = '.jst-conponent';

    // 方法:twui调用的入口方法
    // ------------------------------
    Conponent.prototype.init = function () {

    };

    // 注册成twui模块
    // ------------------------------
    twui.module(Conponent);
}(jQuery);