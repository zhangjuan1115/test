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