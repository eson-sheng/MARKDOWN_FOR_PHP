$(function() {
    EditormdView = editormd.markdownToHTML("editormd-view", {
        markdown        : "\r\n" + $("#xml").text(),//+ "\r\n" + $("#append-test").text(),
        //htmlDecode      : true,       // 开启 HTML 标签解析，为了安全性，默认不开启
        htmlDecode      : "style,script,iframe",  // you can filter tags decode
        //toc             : false,
        tocm            : true,    // Using [TOCM]
        tocContainer    : "#toc", // 自定义 ToC 容器层
        //gfm             : false,
        //tocDropdown     : true,
        // markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
        emoji           : true,
        taskList        : true,
        tex             : true,  // 默认不解析
        flowChart       : true,  // 默认不解析
        sequenceDiagram : true,  // 默认不解析
    });
    // 手机屏幕适配
    if (screen.width < 500) {
        var t = document.getElementById('sidebar');
        t.style.display = 'none';
        var v = document.getElementById('editormd-view');
        v.style.paddingLeft = 0;
        $("#menuBtn i").css("fontSize","50px");
        $("#menuBtn i").removeClass('icon-caidanlanzhankaix');
        $("#menuBtn i").addClass('icon-caidanlanshouqix');
        $("#sidebar").hide();
        $("#sidebar").width(0);
        $("#sidebar").css("fontSize","35px");
        $("#sidebar h1").css("fontSize","35px");
        $("#editormd-view").css("marginTop","50px");
        $("#editormd-view").css("paddingLeft","0");
        $("#menuBtn").css("left","5%");
        // 点击图标收缩目录框
        $("#menuBtn").click(function(e){
            if ($("#sidebar").is(":hidden")) {
                $("#menuBtn i").removeClass('icon-caidanlanshouqix');
                $("#menuBtn i").addClass('icon-caidanlanzhankaix');
                $("#sidebar").show();
                $("#sidebar").width("20%");
                $("#editormd-view").css("paddingLeft","220px");
                $("#menuBtn").css("left","28%");
            } else {
                $("#menuBtn i").removeClass('icon-caidanlanzhankaix');
                $("#menuBtn i").addClass('icon-caidanlanshouqix');
                $("#sidebar").hide();
                $("#sidebar").width(0);
                $("#editormd-view").css("paddingLeft","0");
                $("#menuBtn").css("left","5%");
            }
        });
    } else {
        // 点击图标收缩目录框
        $("#menuBtn").click(function(e){
            if ($("#sidebar").is(":hidden")) {
                $("#menuBtn i").removeClass('icon-caidanlanshouqix');
                $("#menuBtn i").addClass('icon-caidanlanzhankaix');
                $("#sidebar").show();
                $("#sidebar").width("20%");
                $("#editormd-view").css("paddingLeft","160px");
                $("#menuBtn").css("left","25%");
            } else {
                $("#menuBtn i").removeClass('icon-caidanlanzhankaix');
                $("#menuBtn i").addClass('icon-caidanlanshouqix');
                $("#sidebar").hide();
                $("#sidebar").width(0);
                $("#editormd-view").css("paddingLeft","0");
                $("#menuBtn").css("left","5%");
            }
        });
    }
});