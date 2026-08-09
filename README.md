# MARKDOWN_FOR_PHP

使用 PHP 读取本地 Markdown 文件，并通过 Vue 3 在浏览器中渲染。项目保留原有 Nginx 重写入口，现有 `.md` 地址无需变更。

## 技术栈

- Vue 3
- Vite
- Yarn 1
- markdown-it（Markdown、目录、任务列表）
- highlight.js（代码高亮）
- KaTeX（数学公式）
- Mermaid（流程图与时序图，按需加载）

## 本地开发

```bash
yarn install
yarn dev
```

Vite 开发服务器用于前端组件开发。完整的 PHP 页面联调可先构建资源，再通过 PHP 或 Nginx 访问：

```bash
yarn build
php -S 127.0.0.1:8765 -t /path/to/nginx/root
```

示例地址：

```text
http://127.0.0.1:8765/MARKDOWN_FOR_PHP/md.php?file=/absolute/path/to/document.md
```

## 生产部署

安装锁定依赖并生成 `dist` 资源：

```bash
yarn install --frozen-lockfile
yarn build
```

将项目放到 Nginx 服务根目录，并保留原有 Markdown 转发规则：

```nginx
location ~ \.md$ {
    rewrite .* /MARKDOWN_FOR_PHP/md.php?file=$request_filename last;
}
```

如果项目部署目录不是 `/MARKDOWN_FOR_PHP/`，需要同步修改 `vite.config.js` 的 `base`，以及 `md.php` 中两个构建资源地址。

## 功能说明

- 桌面端默认显示目录，移动端默认收起。
- 相对文档链接和页内锚点在当前页面打开；外部协议链接在新标签页打开。
- 桌面端点击图片打开灯箱，移动端直接访问原图。
- `mermaid`、`flow`、`seq` fenced code block 会交给 Mermaid 渲染。
- HTML 会经过 DOMPurify 清理；可信 Markdown 仍可使用常见 HTML 和 iframe。

## 目录结构

```text
src/
├── App.vue              # 阅读器页面与交互
├── lib/document.js      # Markdown 渲染、目录和链接规则
├── main.js              # Vue 入口
└── styles/app.css       # 页面与 Markdown 样式
md.php                   # PHP 文件入口与 Vue 容器
vite.config.js           # Vite 构建配置
```

`editor.md/`、`layui/` 和旧 `assets/js/md.js` 当前仅作为迁移对照保留，新页面不再加载这些运行时依赖。确认线上文档兼容后，可以在后续版本中删除。
