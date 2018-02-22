/* ------------------------------------------------------------
 * 版本:1.0
 * 描述:初始化字体
 * ------------------------------------------------------------ */
+function () {
    var initFont = function () {
        var windowWidth = window.innerWidth,
                baseWidth = 375,
                baseFontSize = 20,
                rootFontSize = 0,
                widthRate = (windowWidth / baseWidth).toFixed(2);

        rootFontSize = parseFloat((widthRate * baseFontSize).toFixed(1));

        var htmlElement = document.getElementsByTagName('html')[0];
        htmlElement.style.fontSize = rootFontSize + 'px';
    };

    initFont();
    window.onload = initFont;
}();