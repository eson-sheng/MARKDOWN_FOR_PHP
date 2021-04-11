<?php
/*判断文件参数合法性*/
if (empty($_GET['file']) || !is_file($_GET['file']) ) {
    exit("<html><head><title>404 Not Found</title></head><body><center><h1>404 Not Found</h1></center><hr><center>nginx</center></body></html>");
}
/*提取md文件内容*/
$text = file_get_contents($_GET['file']);
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title><?= pathinfo($_GET['file'],PATHINFO_BASENAME); ?></title>
        <!-- <link rel="stylesheet" href="/MARKDOWN_FOR_PHP/editor.md/examples/css/style.css" /> -->
        <!-- <link rel="stylesheet" href="/MARKDOWN_FOR_PHP/editor.md/css/editormd.preview.css" /> -->
        <link rel="stylesheet" href="/MARKDOWN_FOR_PHP/markdown.css" />
        <style type="text/css">
            body {
                padding: 40px;
            }
            
            #sidebar {
                width: 320px;
                height: 100%;
                position: fixed;
                top: 0;
                left: 0;
                overflow: hidden;
                background: #fff;
                z-index: 100;
                padding: 18px; 
                border: 1px solid #ddd;
                border-top: none;
                border-bottom: none;
            }
            
            #sidebar:hover {
                overflow: auto;
            }
            
            #sidebar h1 {
                font-size: 16px;
            }

            #sidebar:after{
                content:'.';
            }
            
            #toc {
                padding-left: 0;
            }
            
            #editormd-view {
                width: 100%;
                padding-left: 160px;
                padding-right: 0;
                margin: 0;
            }
        </style>
    </head>
    <body>
        <div id="layout">
            <div id="sidebar">
                <h1>目录</h1>
                <div class="markdown-body editormd-preview-container" id="toc"></div>
                <br>
            </div>
            <div id="editormd-view">
                <xml style="display:none;" id="xml"><?= htmlspecialchars($text); ?></xml>
            </div>
        </div>
    </body>

    <script src="/MARKDOWN_FOR_PHP/editor.md/examples/js/jquery.min.js"></script>
    <script src="/MARKDOWN_FOR_PHP/editor.md/lib/marked.min.js"></script>
    <script src="/MARKDOWN_FOR_PHP/editor.md/lib/prettify.min.js"></script>
    
    <script src="/MARKDOWN_FOR_PHP/editor.md/lib/raphael.min.js"></script>
    <script src="/MARKDOWN_FOR_PHP/editor.md/lib/underscore.min.js"></script>
    <script src="/MARKDOWN_FOR_PHP/editor.md/lib/sequence-diagram.min.js"></script>
    <script src="/MARKDOWN_FOR_PHP/editor.md/lib/flowchart.min.js"></script>
    <script src="/MARKDOWN_FOR_PHP/editor.md/lib/jquery.flowchart.min.js"></script>

    <script src="/MARKDOWN_FOR_PHP/editor.md/editormd.js"></script>

    <script type="text/javascript">
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
            }
        });
    </script>
</html>
