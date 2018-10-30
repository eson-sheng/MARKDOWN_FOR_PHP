<?php
spl_autoload_register(function($class){
    require str_replace('\\', DIRECTORY_SEPARATOR, ltrim("php-markdown/{$class}", '\\')).'.php';
});

use Michelf\Markdown;

if (empty($_GET['file'])) {
    exit("<html><head><title>404 Not Found</title></head><body><center><h1>404 Not Found</h1></center><hr><center>nginx</center></body></html>");
}

$text = file_get_contents($_GET['file']);
$html = Markdown::defaultTransform($text);

?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title><?= pathinfo($_GET['file'],PATHINFO_BASENAME); ?></title>
    </head>
    <body>
        <?= htmlspecialchars($html); ?>
    </body>
</html>
