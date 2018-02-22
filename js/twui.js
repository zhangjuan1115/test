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

/* ------------------------------------------------------------
 * 版本:1.0
 * 描述:自定义MultiSelect,移动端专用
 * ------------------------------------------------------------ */
+function ($) {
    // 定义:MultiSelect组件类
    // ------------------------------
    var MultiSelect = function ($element) {
        this.$ = $element;
    };

    // 定义:MultiSelect组件的类选择器
    // ------------------------------
    MultiSelect.prototype.selector = '.jst-muliSelect';

    // 方法:twui调用的入口方法
    // ------------------------------
    MultiSelect.prototype.init = function () {

    };

    // 属性:MultiSelect组件的半透明背景
    // ------------------------------
    MultiSelect.prototype.backdrop = $(twui.templete.backdrop);

    // 属性:最后一个打开的Select
    // ------------------------------
    MultiSelect.prototype.activeSelect = null;

    // 方法:关闭MultiSelect选项
    // ------------------------------
    MultiSelect.prototype.close = function ($select) {
        $select.removeClass('active');
        this.backdrop.remove();
        MultiSelect.prototype.activeSelect = null;
        $(document).off('click.twui.MultiSelect.toggle');
    };

    // 方法:打开MultiSelect选项
    // ------------------------------
    MultiSelect.prototype.open = function ($select) {
      var me = this;
        var $list = $select.find('.js-selcon');
        var offsetX = $select.offset().left;
        var winWidth = $(window).width();
        var activeSelect = me.activeSelect;

        if (activeSelect instanceof $) {
            me.close(activeSelect);
        }

        $list.css({ width: winWidth, left: -offsetX });
        $select.addClass('active');
        $('body').append(me.backdrop);
        MultiSelect.prototype.activeSelect = $select;

        $(document).on('click.twui.MultiSelect.toggle', function (event) {
            var $evntSelf = $(event.target).closest('.jst-muliSelect');

            if (!$evntSelf.is(me.activeSelect) && me.activeSelect != null) me.close(me.activeSelect);
        });
    };



    // 方法:切换MultiSelect选项
    // ------------------------------
    MultiSelect.prototype.toggle = function () {
        var $me = this.$;

        if ($me.hasClass('active')) {
            this.close($me);
        } else {
            this.open($me);
        }
    };

    // 方法:在document上委托click事件
    // ------------------------------
  $(document).on('click.twui.MultiSelect', '.jst-muliSelect', function (event) {
        $(this).twui('toggle', '.jst-muliSelect');
    });
  
  //点击确定按钮关闭
    $(document).on('click.twui.MultiSelect', '.jst-muliSelect .btn-green', function (event) {
       $(this).parents('.jst-muliSelect').twui('toggle', '.jst-muliSelect');
    });

  

    // 注册成twui模块
    // ------------------------------
    twui.module(MultiSelect);
}(jQuery);
/* ------------------------------------------------------------
 * 版本:1.0
 * 描述:自定义Select,移动端专用
 * ------------------------------------------------------------ */
+function ($) {
    // 定义:Select组件类
    // ------------------------------
    var Select = function ($element) {
        this.$ = $element;
    };

    // 定义:Select组件的类选择器
    // ------------------------------
    Select.prototype.selector = '.jst-select';

    // 方法:twui调用的入口方法
    // ------------------------------
    Select.prototype.init = function () {
        var $me = this.$;
        var $value = $me.find('> .js-sv');
        var text = $me.find('> .js-sl > .selected').text();

        $value.attr('data-text', text);
    };

    // 属性:Select组件的半透明背景
    // ------------------------------
    Select.prototype.backdrop = $(twui.templete.backdrop);

    // 属性:最后一个打开的Select
    // ------------------------------
    Select.prototype.activeSelect = null;

    // 方法:关闭Select选项
    // ------------------------------
    Select.prototype.close = function ($select) {
        $select.removeClass('active');
        this.backdrop.remove();
        Select.prototype.activeSelect = null;
        $(document).off('click.twui.select.toggle');
    };

    // 方法:打开Select选项
    // ------------------------------
    Select.prototype.open = function ($select) {
        var me = this;
        var $list = $select.find('.js-sl');
        var offsetX = $select.offset().left;
        var winWidth = $(window).width();
        var activeSelect = me.activeSelect;

        if (activeSelect instanceof $) {
            me.close(activeSelect);
        }

        $list.css({ width: winWidth, left: -offsetX });
        $select.addClass('active');
        $('body').append(me.backdrop);
        Select.prototype.activeSelect = $select;

        $(document).on('click.twui.select.toggle', function (event) {
            var $evntSelf = $(event.target).closest('.jst-select');

            if (!$evntSelf.is(me.activeSelect) && me.activeSelect != null) me.close(me.activeSelect);
        });
    };

    // 方法:获取值
    // ------------------------------
    Select.prototype.setValue = function () {
        return this.$.data('value');
    };

    // 方法:设置值
    // ------------------------------
    Select.prototype.setValue = function ($option) {
        var $me = this.$;
        var $value = $me.find('.js-sv');
        var value = $me.data('value');
        var optionValue = $option.data('value');
        var text = $option.text();
        var currentValue = optionValue;

        if (typeof optionValue == 'undefined') currentValue = text;
        if (value == currentValue) return;

        $option.addClass('selected').siblings().removeClass('selected');
        $value.attr('data-text', currentValue);

        var changeEvent = $.Event('change', { value: currentValue, $target: $option });
        $me.trigger(changeEvent);
    };

    // 方法:切换Select选项
    // ------------------------------
    Select.prototype.toggle = function () {
        var $me = this.$;

        if ($me.hasClass('active')) {
            this.close($me);
        } else {
            this.open($me);
        }
    };

    // 方法:在document上委托click事件
    // ------------------------------
    $(document).on('click.twui.select', '.jst-select', function (event) {
        $(this).twui('toggle', '.jst-select');
    });

    // 方法:在document上委托option的click事件
    // ------------------------------------------------------------
    $(document).on('click.twui.select', '.jst-select > .js-sl > *', function (event) {
        var $option = $(this);
        var $select = $option.parent().parent();

        $select.twui('setValue', '.jst-select', $option);
    });

    // 注册成twui模块
    // ------------------------------
    twui.module(Select);
}(jQuery);
var UIMobile = {
    //初始化自定义checkbox
    initCheckBox: function($checks) {
        var $checkBoxes = $checks.children('input'),
            $disabledChecks = $checks.find('input[disabled]').parent(),
            $selectedChecks = $checks.find('input[checked]').parent();

        $checks.addClass('c-checkbox');
        $disabledChecks.addClass('disabled');
        $selectedChecks.addClass('selected');

        //随checkbox的checked值，确定是否启用选中样式
        $checkBoxes.off('change.twui');
        $checkBoxes.on('change.twui', function() {
            var $me = $(this),
                $label = $me.parent().find(".ico-check"),
                checked = $me.prop('checked');

            if (checked) {
                $label.addClass('active');
            } else {
                $label.removeClass('active');
            }
        });
    },

    //列表内容超过5行，显示查看更多
    initContHeight: function($cont) {
        var windowWidth = window.innerWidth,
            baseWidth = 375,
            baseFontSize = 20,
            rootFontSize = 0,
            widthRate = (windowWidth / baseWidth).toFixed(2);
        rootFontSize = parseFloat((widthRate * baseFontSize).toFixed(1));
        $cont.each(function(index, el) {
            var $item = $(el)
            var height = $(el).innerHeight();
            if (height > rootFontSize * 4.4) {
                $item.css('max-height', '4.4rem')
                $item.addClass('active')
            }
        })
    },

        // 点击图片预览
    initPreview: function($preview) {
        $preview.each(function(indexParent, elParent) {
            var phItem = []
            $self = $(this)
            $self.find('img').each(function(index, el) {
                $item = $(this)
                phItem[index] = $item.attr("src")
            })
            ph[indexParent] = phItem
        })
    },

    //获取当前移动端设备的basefont
    getFontSize: function() {
        var windowWidth = window.innerWidth,
            baseWidth = 375,
            baseFontSize = 20,
            rootFontSize = 0,
            widthRate = (windowWidth / baseWidth).toFixed(2);
        rootFontSize = parseFloat((widthRate * baseFontSize).toFixed(1));
        return rootFontSize
    }


}
//页面加载后初始化控件
$(document).ready(function() {
    ph = []
    var $checks = $('.js-checkbox');
    var $cont = $('.js-moretxt');
    var $preview = $('.js-preview');

    //初始化自定义checkbox
    if ($checks.length > 0) {
        UIMobile.initCheckBox($checks);
    }

    //列表内容超过5行，显示查看更多
    if ($cont.length > 0) {
        UIMobile.initContHeight($cont);
    }

     //点击图片预览
    if ($preview.length > 0) {
        UIMobile.initPreview($preview);
    }

    //  点击查看更多 展开全部
    $(".m-list").on('click','.js-more', function() {
        var $this = $(this)
        $this.parent(".js-moretxt").addClass('open')
        $this.parent(".js-moretxt").removeClass('active')
    })

    //  点击图片预览，初始化图片图标
    $('.m-list').on('click','.js-preview img', function() {
        $me = $(this)
        var $parent = $me.parents('.m-gallery')
        var parentIndex = $preview.index($parent)
        var childIndex = $me.index()
        var phObject = $.photoBrowser({
            items: ph[parentIndex],
            initIndex: childIndex - 1 ? childIndex : 0
        })
        phObject.open()
    })

     // 自定义picker控件相关的input元素每次单击都初始化最初值并全局记录当前激活的input元素
     $(document).on('click.picker', '.js-picker-input',function() {
        var $this = $(this)
        var type = $this.data('type')

        $this.picker('open')
        window.currentPickerInput = this
        $this.data('originalDisplayText', $this.val())

        if(type !== 'datetime') {
            var value = $this.attr('data-value')
            $this.picker("setValue", [value]);
        }
    })

    // 自定义picker控件相关的input元素每次值改变值都赋回初始值
     $(document).on('change.picker','.js-picker-input', function() {
        var $this = $(this)
        var type = $this.data('type')
        
        if(type === 'datetime') $this.data('datetime', $this.val())

        if (!$this.data('originalDisplayText')) $this.data('originalDisplayText', $this.val())
        $this.val($this.data('originalDisplayText'))
    })

    // 自定义picker控件点确定按钮才最终赋值并触发changed事件
    $(document).on("click", ".weui-picker-container .close-picker.picker-button", function() {
        var yesEvent = $.Event('changed')
        var $currentPickerInput = $(window.currentPickerInput)
        var type = $currentPickerInput.data('type')

        if(type !== 'datetime') {
            $currentPickerInput.val($currentPickerInput.data('picker').displayValue)
            $currentPickerInput.attr('data-value', [$currentPickerInput.data('picker').value])
            $currentPickerInput.trigger(yesEvent, [$currentPickerInput.data('picker').value])
        } else {
            $currentPickerInput.val($currentPickerInput.data('datetime'))
            $currentPickerInput.trigger(yesEvent, [$currentPickerInput.data('datetime')])
        }
    })


    //底层弹出窗选择学生
    $(".js-selectStu").click(function() {
        $("#selectStu").addClass('active')
    })

    //底层弹出窗选择周次
    $(".js-selWeek").click(function() {
        $("#selectWeek").addClass('active')
    })

    //底层弹出窗选择指标项
    $(".js-selIndex").click(function() {
        $("#selectIndex").addClass('active')
    })

    //底层弹出窗选择项目名称
    $(".js-seltItem").click(function() {
        $("#selectItem").addClass('active')
    })

    //底层弹出窗点击阴影和取消按钮关闭
    $('.m-pop-select .close-picker,.m-pop-select').click(function() {
        $(".m-pop-select").removeClass('active')
    })

    //底层弹出窗阻止冒泡
    $('.m-pop-select .list').click(function(e) {
        e.stopPropagation()
    })

    //  点击展开关怀记录
    $(".m-list").on('click','.js-carebox', function() {
        var $this = $(this)
        $this.toggleClass('open')
        $this.siblings('.m-carebox').toggleClass('open');
    })

      //点击关怀记录列表收起
    $(".m-list").on('click','.js-xarrow', function() {
        var $this = $(this)
        $this.parent('.m-carebox').removeClass('open')
         $this.parent('.m-carebox').siblings('.js-carebox').removeClass('open');
    })

});