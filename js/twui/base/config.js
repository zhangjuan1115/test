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