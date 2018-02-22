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
/* ------------------------------------------------------------
 * 版本:1.0
 * 描述:twui基础模块
 * ------------------------------------------------------------ */
+function ($) {
    // 注册jQuery事件:lazyScroll(减少滚动时滚动事件重复触发次数)
    $.event.special.lazyScroll = {
        setup: function (data) {
            var timer = 0;

            $(this).on('scroll.lazyScroll', function (event) {
                if (!timer) {
                    timer = setTimeout(function () {
                        $(this).triggerHandler('lazyScroll');
                        timer = 0;
                    }, 150);
                }
            });
        },
        teardown: function () {
            $(this).off('scroll.lazyScroll');
        }
    };

    // 注册jQuery事件:lazyResize(减少窗口大小变化时resize事件重复触发次数)
    $.event.special.lazyResize = {
        setup: function (data) {
            var timer = 0;

            $(this).on('resize.lazyResize', function (event) {
                if (!timer) {
                    timer = setTimeout(function () {
                        $(this).triggerHandler('lazyResize');
                        timer = 0;
                    }, 200);
                }
            });
        },
        teardown: function () {
            $(this).off('resize.lazyResize');
        }
    };

    // 注册jQuery实例方法:获取jquery对象class属性中与twui模块相关的模块名称
    $.fn.getTwuiNames = function () {
        var moduleSelectorRegex = /\bjst-[^\s"]+/g,
            classString = this.attr('class'),
            matches = '',
            moduleName='',
            moduleNames = [];

        // 获取所有的以jst-开头的class类名
        do {
            matches = moduleSelectorRegex.exec(classString);
            if (matches == null) {
                break;
            }

            moduleName = matches[0].substring(4);

            if(twui.modules[moduleName] instanceof twui){
                moduleNames.push(moduleName);
            }
        } while (true)

        return moduleNames;
    };

    // 注册jQuery实例方法:获取对应的twui模块实例
    $.fn.getTwuiModules = function () {
        var moduleNames = this.getTwuiNames(),
            modules = [];

        // 初始化相关的模块
        for (var i = 0; i < moduleNames.length; i++) {
            modules.push(twui.modules[moduleNames[i]]);
        }

        return modules;
    };

    /* ------------------------------------------------------------------------------------------------------------------------
     * 注册jQuery实例方法twui，参数说明：
     * 1.methodName:可选，要调用的方法名,不指定或指定的方法在组件上不存在，会将方法自动赋值为init初始化方法。
     * 2.moduleSelector:模块选择器，可选，当该元素绑定了多个twui组件对象时且对象存在同名方法时，必须指定。
     * 3.如果该元素还未构造成twui组件，将在其上自动运行twui.build()方法使其转变为twui组件。
     * 4.如需指定参数，moduleSelector可指定为null,后跟参数列表:$(selector).twui(methodName,null,arg1,arg2,arg3...)。
     * ------------------------------------------------------------------------------------------------------------------------ */
    $.fn.twui = function (methodName, moduleSelector) {
        var args = [];

        for (var i = 2; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        return this.each(function () {
            var $this = $(this),
                tagName = $(this).tagName,
                moduleNames = $this.getTwuiNames(),
                optionName = twui.getModuleName(moduleSelector),
                moduleName = name = '',
                conflict = -1,
                component = null;

            // 指定默认方法名
            if (!typeof methodName == 'string') {
                methodName = 'init';
            }

            // 构建twui组件及检测方法是否有冲突
            for (var i = 0; i < moduleNames.length; i++) {
                name = moduleNames[i];

                component = $this.data('twui.' + name);

                if (!component) {
                    twui.modules[name].build($this);
                    component = $this.data('twui.' + name);
                }

                if (methodName != 'init' && component[methodName]) {
                    moduleName = name;
                    conflict++;
                }
            }

            // 方法冲突处理
            if (conflict > 0) {
                if (typeof optionName != 'string') {
                    if (console.error) {
                        console.error(this, '\n以上元素绑定了多个twui组件且组件存在同名方法，调用方法时必须指定模块选择器".jst-moduleName"!');
                    }
                    throw Error('元素【' + $this[0].tagName + '.' + $this.attr('class').replace(/\s+/g, '.') + '】绑定了多个twui组件且组件存在同名方法，调用方法时必须指定模块选择器".jst-moduleName"!');
                } else {
                    moduleName = optionName;
                }
            }

            component = $this.data('twui.' + moduleName);

            if (component && component[methodName]) {
                component[methodName].apply(component, args);
            }
        });
    };
}(jQuery);

/* ------------------------------------------------------------
 * 版本:1.0
 * 描述:默认配置项
 * ------------------------------------------------------------ */
+function ($) {
    twui.config = {
        animate: false,
        speed: 300,
        winOption: {
            content: '',
            time: 0,
            miniTime:3000
        },
        confirmOption: {
            title: '确定',
            btns: [
                {
                    html:'<a class="btn large btn-blue">确定</a>'
                },
                {
                    html:'<a class="btn large btn-default">取消</a>'
                }
            ]
        },
        successOption: {
            title: '成功',
            icon: '<i class="ico ico-success"></i>',
            btns: [
                {
                    html: '<a class="btn large btn-default">关闭</a>'
                }
            ]
        },
        alertOption: {
            title: '警告',
            icon: '<i class="ico ico-warning"></i>',
            btns: [
                {
                    html: '<a class="btn large btn-default">关闭</a>'
                }
            ]
        },
        errorOption: {
            title: '错误',
            icon: '<i class="ico ico-error"></i>',
            btns: [
                {
                    html: '<a class="btn large btn-default">关闭</a>'
                }
            ]
        },
        msgOption: {
            time:2000
        }
    };
}(jQuery);

/* ------------------------------------------------------------
 * 版本:1.0
 * 描述:html模板
 * ------------------------------------------------------------ */
+function ($) {
    twui.templete = {
        editInput: '<input class="c-editinput" type="text" />',
        win: '<div class="m-win info jst-win"><div class="win-body"><div></div></div></div>',
        winHeader: '<div class="win-header"><a class="shut js-win-close" title="关闭">×</a><h4></h4></div>',
        winMax:'<a class="max js-win-max" title="最大化"></a>',
        winFooter:'<div class="win-footer"></div>',
        msgWin: '<div class="m-win msg jst-win"><i></i><div></div></div>',
        editItem: '<li class="jst-edititem"><a><span class="js-value"></span><div class="sidebar-edititems-icons"><span class="js-editbtn"><i class="ico ico-edit2"></i></span><span class="js-delbtn"><i class="ico ico-delete2"></i></span></div></a></li>',
        tabMore: '<div class="tabnav-more js-more"><span>更多<b class="caret"></b></span><div></div></div>',
        backdrop: '<div class="c-backdrop"></div>'
    };
}(jQuery);
/* ------------------------------------------------------------
 * 版本:1.0
 * 描述:twui公用函数
 * ------------------------------------------------------------ */
+function ($) {
    // 组件唯一标识符
    twui.id = 0;

    // 获取元素的三维矩阵信息
    twui.getElementMatrix = function ($element) {
        var top = $element.offset().top,
            left = $element.offset().left,
            width = $element.outerWidth(),
            height = $element.outerHeight();

        return { top: top, left: left, width: width, height: height };
    };

    // 复制元素的矩阵信息
    twui.copyMatrix = function ($source) {
        var matrix = twui.getElementMatrix($source);

        for (var i = 1; i < arguments.length; i++) {
            arguments[i].css({
                left: matrix.left,
                top: matrix.top,
                width: matrix.width,
                height: matrix.height
            });
        }
    };

    // 居中元素
    twui.center = function ($source, $element, nonnegative) {
        var sourceWidth = $source.outerWidth(),
            sourceHeight = $source.outerHeight(),
            elementWidth = $element.outerWidth(),
            elementHeight = $element.outerHeight(),
            x = (sourceWidth - elementWidth) / 2,
            y = (sourceHeight - elementHeight) / 2;

        if (nonnegative) {
            x = x < 0 ? 0 : x;
            y = y < 0 ? 0 : y;
        }

        $element.css({ left: x, top: y });
    };
}(jQuery);
