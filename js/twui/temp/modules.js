/* ------------------------------------------------------------
 * 版本:1.0
 * 描述:CheckSelect
 * ------------------------------------------------------------ */
+function ($) {
    // 定义:CheckSelect组件类
    // ------------------------------
    var CheckSelect = function ($element) {
        this.$ = $element;
    };

    // 定义:CheckSelect组件的类选择器
    // ------------------------------
    CheckSelect.prototype.selector = '.jst-checkselect';

    // 方法:twui调用的入口方法
    // ------------------------------
    CheckSelect.prototype.init = function () {
        var me = this;
        var $me = me.$;
        var $inputs = $me.find('input');

        $inputs.on('change.twui.checkselect', function () {
            me.select();
        });
    };

    // 方法:选择选项
    // ------------------------------
    CheckSelect.prototype.select = function () {
        var $me = this.$;
        var $inputs = $me.find('input');
        var text = '';
        var $dataLink = $($me.data('link'));
        var $checkeds = $me.find('input:checked');

        $checkeds.each(function () {
            if (text === '') {
                text += $(this).parent().text();
            } else {
                text += ',' + $(this).parent().text();
            }
        });

        if ($dataLink.length > 0) {
            $dataLink.text(text);
        }
    };

    // 注册成twui模块
    // ------------------------------
    twui.module(CheckSelect);
}(jQuery);
/* ------------------------------------------------------------
 * 版本:1.0
 * 描述:sidebar
 * ------------------------------------------------------------ */
+function ($) {
    // 定义:Collapse组件类
    // ------------------------------
    var Collapse = function ($element) {
        this.$ = $element;
    };

    // 定义:Collapse组件的类选择器
    // ------------------------------
    Collapse.prototype.selector = '.jst-collapse';

    // 方法:切换折叠项的显示与隐藏
    // ------------------------------
    Collapse.prototype.toggle = function () {
        var $me = this.$,
            $target = $($me.data('target')),
            $event=$me.add($target),
            speed = this.speed(),
            showEvent = $.Event('show.twui.collapse', { $collapse: $me }),
            shownEvent = $.Event('shown.twui.collapse'),
            hideEvent = $.Event('hide.twui.collapse'),
            hiddenEvent = $.Event('hidden.twui.collapse');

        if ($target.is(':visible')) {
            $event.trigger(hideEvent);

            if (hideEvent.isDefaultPrevented()) return;

            $target.stop(true, true).slideUp(speed, function () {
                $(this).removeClass('open');
                $me.removeClass('open');
                $event.trigger(hiddenEvent);
            });
        } else {
            $event.trigger(showEvent);

            if (showEvent.isDefaultPrevented()) return;

            $target.stop(true, true).slideDown(speed, function () {
                $(this).addClass('open');
                $me.addClass('open');
                $event.trigger(shownEvent);
            });
        }
    };

    // 方法:在document上委托click事件
    // ------------------------------
    $(document).on('click.twui.collapse','.jst-collapse', function () {
        $(this).twui('toggle','.jst-collapse');
    });

    // 注册成twui模块
    // ------------------------------
    twui.module(Collapse);
}(jQuery);
/* ------------------------------------------------------------
 * 版本:1.0
 * 描述:Curtain(部份半透明背景)
 * ------------------------------------------------------------ */
+function ($) {
    // 定义:Curtain组件类
    // ------------------------------
    var Curtain = function ($element) {
        this.$ = $element;
    };

    // 定义:Curtain组件的类选择器
    // ------------------------------
    Curtain.prototype.selector = '.jst-curtain';

    // 方法:twui调用的入口方法
    // ------------------------------
    Curtain.prototype.init = function () {
        var me = this;
        var $me = me.$;
        var eventName = 'click.twui' + $me.data('twuiId');

        me.calculateTop();

        // 当用于collapse时，显示时重新计算顶部起始点,并注册关闭事件
        $me.on('show.twui.collapse', function (e1) {
            me.calculateTop();

            $(document).off(eventName).on(eventName, function (e2) {
                var $curtainBody = $me.find('.curtain-body');
                var $collapse = e1.$collapse;
                var $eventTarget=$(e2.target);
                var $eventCollapse = $eventTarget.closest('.jst-collapse');
                var $eventCurtainBody = $eventTarget.closest('.curtain-body');

                if (!($eventCollapse.is($collapse) || $eventCurtainBody.is($curtainBody))) {
                    $collapse.twui('toggle', '.jst-collapse');
                }
            });
        });

        $me.on('hide.twui.collapse', function () {
            $(document).off(eventName);
        });
    };

    // 方法:计算顶部起始点
    // ------------------------------
    Curtain.prototype.calculateTop = function () {
        var $me = this.$;
        var $top = $($me.data('top'));

        if ($top.length > 0) {
            var top = $top.offset().top + $top.outerHeight() - 1;
            $me.css('top', top);
        }
    };

    // 注册成twui模块
    // ------------------------------
    twui.module(Curtain);
}(jQuery);
/* ------------------------------------------------------------
 * 版本:1.0
 * 描述:RadioSelect
 * ------------------------------------------------------------ */
+function ($) {
    // 定义:RadioSelect组件类
    // ------------------------------
    var RadioSelect = function ($element) {
        this.$ = $element;
    };

    // 定义:RadioSelect组件的类选择器
    // ------------------------------
    RadioSelect.prototype.selector = '.jst-radioselect';

    // 方法:twui调用的入口方法
    // ------------------------------
    RadioSelect.prototype.init = function () {
        var me = this;
        var $me = me.$;
        var $inputs = $me.find('input');

        $inputs.on('change.twui.radioselect', function () {
            me.select($(this));
        });
    };

    // 方法:选择选项
    // ------------------------------
    RadioSelect.prototype.select = function ($input) {
        var $me = this.$;
        var text = '';
        var $dataLink =$($me.data('link'));

        text = $input.parent().text();

        if ($dataLink.length > 0) {
            $dataLink.text(text);
        }
    };

    // 注册成twui模块
    // ------------------------------
    twui.module(RadioSelect);
}(jQuery);
/* ------------------------------------------------------------
 * 版本:1.0
 * 描述:Score
 * ------------------------------------------------------------ */
+function ($) {
    // 定义:Score组件类
    // ------------------------------
    var Score = function ($element) {
        this.$ = $element;
    };

    // 定义:Score组件的类选择器
    // ------------------------------
    Score.prototype.selector = '.jst-score';

    // 方法:twui调用的入口方法
    // ------------------------------
    Score.prototype.init = function () {
        this.create(this.$);
    };

    // 方法:重新初始化
    Score.prototype.setScore = function (score) {
        var $me = this.$;
        $me.data('score', score + '');

        $me.html('');
        this.create($me);
    };

    // 方法:生成html
    Score.prototype.create = function ($score) {
        var strScore = $score.data('score') + '',
            html = '',
            strnum = '';

        if (strScore !== undefined) {
            for (var i = 0; i < strScore.length; i++) {
                strnum = strScore.substr(i, 1);
                if (strnum !== '.') {
                    html += '<i class="u-score num' + strnum + '"></i>';
                } else {
                    html += '<i class="u-score dot"></i>';
                }
            }
        }

        $score.prepend(html);
    };

    // 注册成twui模块
    // ------------------------------
    twui.module(Score);
}(jQuery);
/* ------------------------------------------------------------
 * 版本:1.0
 * 描述:tab
 * ------------------------------------------------------------ */
+function ($) {
    var speed = twui.config.speed;

    // 定义:tab组件类
    // ------------------------------
    var Tab = function ($element) {
        this.$ = $element;
    };

    // 定义:Conponent组件的类选择器
    // ------------------------------
    Tab.prototype.selector = '.jst-tabnav';

    // 方法:twui调用的入口方法
    // ------------------------------
    Tab.prototype.init = function () {
        var me = this,
            $me = me.$,
            $tabBtn = $me.find('a');

        $me.on('click.twui.tab', 'a', function () {
            me.show($(this));
        });

        $me.on('click.twui.tab', '.js-more > span', function () {
            me.showMore($(this));
        });

        me.createMore();
    };

    // 方法:生成more菜单
    // ------------------------------
    Tab.prototype.createMore = function () {
        var $tab = this.$,
            type=$tab.data('type'),
            tabWidth = $tab.outerWidth(),
            width = 0,
            $oldMore = $tab.find('.js-more'),
            $oldMoreLinks = $oldMore.find('div > a'),
            $more = $(twui.templete.tabMore),
            $moreBody = $more.find('div'),
            more = false;

        // 如果类型是按钮式tab，不生成more菜单
        if (type == 'button') return;

        // 删除存在的more
        $oldMore.remove();
        $tab.append($oldMoreLinks);

        var $tabLinks = $tab.find('a');

        $tabLinks.each(function () {
            var $this = $(this);

            width += $this.outerWidth();

            if (tabWidth- width < 60) {
                more = true;
                $this.appendTo($moreBody);
            }
        });

        if ($more.find('a.active').length > 0) {
            $more.addClass('active');
        }

        if (more) {
            $tab.append($more);
        }
    };

    // 方法:显示more菜单
    // ------------------------------
    Tab.prototype.showMore = function ($moreBtn) {
        var $more = $moreBtn.parent(),
            $moreBody = $more.find('div'),
            speed = this.speed();

        $moreBody.stop().slideToggle(speed);
        this.hideMore($moreBody);
    };

    // 方法:隐藏more菜单
    // -----------------------------------
    Tab.prototype.hideMore = function ($moreBody) {
        var me = this;

        $(document).one('click.twui.tab.more', function (event) {
            var $target = $(event.target).parent().find(' > div');

            if ($target.is($moreBody)) {
                me.hideMore($moreBody);
                return;
            }

            $moreBody.stop().slideUp(speed);
        });
    };

    // 方法:显示tab
    // ------------------------------
    Tab.prototype.show = function ($tabBtn) {
        var $me = this.$,
            $more=$me.find('.js-more'),
            $tem=$tabBtn.parent().parent(),
            $prevTabBtn = $tabBtn.closest('.jst-tabnav').find('a.active'),
            $target = $($tabBtn.data('target')),
            $activeTab = $target.parent().find(' > .active'),
            changeEvent = $.Event('change.twui', { relatedTarget: $prevTabBtn[0], currentTarget: $tabBtn[0] }),
            changedEvent = $.Event('changed.twui', { relatedTarget: $prevTabBtn[0], currentTarget: $tabBtn[0] }),
            speed = this.speed();

        if ($tabBtn.hasClass('active')) return;

        $me.trigger(changeEvent);

        if (changeEvent.isDefaultPrevented()) return;

        $tabBtn.addClass('active');
        if ($tem.is($more)) {
            $more.addClass('active');
        }

        $prevTabBtn.removeClass('active');
        if ($prevTabBtn.parent().parent().is($more) && !$tem.is($more)) {
            $more.removeClass('active');
        }

        $activeTab.hide().removeClass('active');
        $target.stop(true,true).fadeIn(speed, function () {
            $me.trigger(changedEvent);
        }).addClass('active');
    };

    // 方法:浏览器变化尺寸时，重新生成more菜单
    // ---------------------------------
    $(window).on('lazyResize.twui.tab', function () {
        $('.jst-tabnav').twui('createMore');
    });

    // 注册成twui模块
    // ------------------------------
    twui.module(Tab);
}(jQuery);