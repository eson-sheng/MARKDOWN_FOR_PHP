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
        <link rel="stylesheet" href="/MARKDOWN_FOR_PHP/layui/css/layui.css" />
        <link rel="stylesheet" href="/MARKDOWN_FOR_PHP/markdown.css" />
        <link rel="stylesheet" href="/MARKDOWN_FOR_PHP/assets/css/md.css" />
        <link rel="stylesheet" href="/MARKDOWN_FOR_PHP/assets/iconfont/iconfont.css">
    </head>
    <body>
        <div id="layout">
            <div id="menuBtn"><i class="iconfont icon-caidanlanzhankaix"></i></div>
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
    <script src="/MARKDOWN_FOR_PHP/layui/layui.js"></script>
    <script src="/MARKDOWN_FOR_PHP/assets/js/md.js"></script>
</html>
