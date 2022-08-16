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
    // 图片点击放大查看
    $('img').click(function(){
        // 定义是否为手机查看
        var userAgentInfo = navigator.userAgent;
        var mobileAgents = [ "Android", "iPhone", "SymbianOS", "Windows Phone", "iPad","iPod"];
        var mobile_flag = false;
        //根据userAgent判断是否是手机
        for (var v = 0; v < mobileAgents.length; v++) {
            if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
                mobile_flag = true;
                break;
            }
        }
         var screen_width = window.screen.width;
         var screen_height = window.screen.height;    
         //根据屏幕分辨率判断是否是手机
         if(screen_width < 500 && screen_height < 800){
             mobile_flag = true;
         }
         // 如果是手机就取消点击事件，直接跳转到图片链接。
         if (mobile_flag) {
            window.location.href = $(this).attr('src');
            return false;
         }
        // area 属性设置
        let areaWidth = 'auto',areaHeight = 'auto';
        // 获取当前窗口大小，减去刚好撑满的图片情况。
        let windowWidth = window.innerWidth - 150,windowHeight = window.innerHeight;
        // 获取图片大小
        let imageWidth = $(this)[0].naturalWidth,imageHeight = $(this)[0].naturalHeight;
        // 判断图片大于窗口就最大90%
        if (imageWidth > windowWidth) {
            areaWidth = '90%';
        }
        if (imageHeight > windowHeight) {
            areaHeight = '90%';
        }
        // 解决弹出层滚轮穿透问题
        layer.style.display = 'block';
        document.body.style.overflow = 'hidden';
        // 打开弹出层
        layer.open({
            type: 1,
            title: false,
            closeBtn: 1,
            area: [areaWidth,areaHeight],
            skin: 'layui-layer-nobg', //没有背景色
            shadeClose: true,
            content: $(this),
            cancel: function(){
                // 右上角关闭事件的逻辑
                layer.style.display = 'none';
                document.body.style.overflow = 'auto';
                document.body.style.position = 'static';
            }
        });
    });
});