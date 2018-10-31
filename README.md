# 使用`nginx`目录解析`Marked`文件

- GitHub - [https://github.com/eson-sheng/MARKDOWN_FOR_PHP](https://github.com/eson-sheng/MARKDOWN_FOR_PHP)
- 将项目克隆到`nginx`服务根目录
- 修改`nginx`配置，将`md`文件转发给`./MARKDOWN_FOR_PHP/md.php`解析。
```nginx
    location ~ \.md$ {
        rewrite .* /MARKDOWN_FOR_PHP/md.php?file=$request_filename last;
    }
```