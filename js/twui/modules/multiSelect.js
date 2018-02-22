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