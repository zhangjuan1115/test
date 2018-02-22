/*! ------------------------------------------------------------
 *! 版本:1.0
 *! 描述:twui
 *! ------------------------------------------------------------ */
+function ($) {
    // 构造函数:用于构造twui对象实例
     window.twui = function (constructor) {
        var prefix = /^.jst-[a-zA-Z][a-zA-Z0-9]{0,19}$/,
            temp = new constructor(),
            selector = temp.selector;

        if (!prefix.test(selector)) {
            throw Error('选择器无效，请以".jst-"开头，然后输入模块名字（需符合js变量规则）!');
        }

        this.selector = selector;
        this.name = selector.substring(5);
        this.constructor = constructor;
    };

    // 构造twui组件
    twui.prototype.build=function ($initElements) {
        var $elements = $(),
            name = this.name,
            constructor = this.constructor;

        $elements = $initElements ? $initElements : $(this.selector);

        $elements.each(function () {
            var $this = $(this),
                id = twui.id++,
                component = $this.data('twui.' + name);

            if (!component) {
                component = new constructor($this);
                $this.data('twuiId', id);

                if (typeof component.init == 'function') {
                    component.init();
                }
                
                $this.data('twui.' + name, component);
            }
        });
    };
    
    // twui模块容器
    twui.modules = {};

    // 注册twui模块
    twui.module = function (constructor) {
        var module = null;

        // 为所有组件添加animate方法
        constructor.prototype.animate = function () {
            return twui.config.animate && this.$.data('animate') != false;
        };

        // 为所有组件添加speed方法
        constructor.prototype.speed = function () {
            var speed = twui.config.speed;

            if (!this.animate()) speed = 0;

            return speed;
        };

        module = new twui(constructor);

        this.modules[module.name] = module;
    };

    // 通过选择器获取模块名称
    twui.getModuleName = function (selector) {
        var moduleName = '';

        if (typeof selector == 'string') {
            moduleName = selector.substring(5);
        }

        if (this.modules[moduleName] instanceof this) {
            return moduleName;
        }
    };

    // 初始化所有模块
    twui.init = function () {
        var modules = this.modules;

        for (var propName in modules) {
            modules[propName].build();
        }
    };

    // 页面加载时初始化所有UI模块
    $(document).ready(function () {
        $(function () {
            FastClick.attach(document.body);
        });

        twui.init();
    });
}(jQuery);