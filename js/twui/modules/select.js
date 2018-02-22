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