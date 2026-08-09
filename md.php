<?php
declare(strict_types=1);

$requestedFile = isset($_GET['file']) ? (string) $_GET['file'] : '';
$resolvedFile = $requestedFile !== '' ? realpath($requestedFile) : false;
$isMarkdown = $resolvedFile !== false && strtolower(pathinfo($resolvedFile, PATHINFO_EXTENSION)) === 'md';

if (!$isMarkdown || !is_file($resolvedFile) || !is_readable($resolvedFile)) {
    http_response_code(404);
    exit('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>404 Not Found</title></head><body><h1>404 Not Found</h1></body></html>');
}

$text = file_get_contents($resolvedFile);
if ($text === false) {
    http_response_code(500);
    exit('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>读取失败</title></head><body><h1>Markdown 文件读取失败</h1></body></html>');
}

$title = pathinfo($resolvedFile, PATHINFO_BASENAME);
$payload = json_encode(
    ['title' => $title, 'content' => $text],
    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_THROW_ON_ERROR
);
?>
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title><?= htmlspecialchars($title, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?></title>
        <link rel="stylesheet" href="/MARKDOWN_FOR_PHP/dist/assets/app.css">
    </head>
    <body>
        <div id="app"></div>
        <script id="markdown-source" type="application/json"><?= $payload ?></script>
        <script type="module" src="/MARKDOWN_FOR_PHP/dist/assets/app.js"></script>
    </body>
</html>
