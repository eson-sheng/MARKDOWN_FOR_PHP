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

// Stable entry filenames need a new URL whenever a build changes their contents.
function assetUrl(string $filename): string
{
    $path = __DIR__ . '/dist/assets/' . $filename;
    $version = is_file($path) ? hash_file('sha256', $path) : false;
    $url = '/MARKDOWN_FOR_PHP/dist/assets/' . $filename;
    if ($version !== false) {
        $url .= '?v=' . substr($version, 0, 16);
    }
    return htmlspecialchars($url, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title><?= htmlspecialchars($title, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?></title>
        <link rel="stylesheet" href="<?= assetUrl('app.css') ?>">
    </head>
    <body>
        <div id="app"></div>
        <script id="markdown-source" type="application/json"><?= $payload ?></script>
        <script type="module" src="<?= assetUrl('app.js') ?>"></script>
    </body>
</html>
