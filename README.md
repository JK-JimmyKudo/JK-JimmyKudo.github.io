# 个人网页

基于 [Hugo](https://gohugo.io/) + [PaperMod](https://github.com/adityatelange/hugo-PaperMod) 主题搭建的个人主页 + 博客。

## 目录结构

```
.
├── hugo.toml            # 站点配置（改这里：名字、简介、社交链接、baseURL）
├── content/
│   ├── about.md         # 关于我页面
│   ├── archives.md      # 归档页（勿删）
│   ├── search.md        # 搜索页（勿删）
│   └── posts/           # 博客文章，每个 .md 文件就是一篇文章
├── static/images/       # 图片（头像等）
└── themes/PaperMod/     # 主题（已内置，勿改）
```

## 本地预览

```bash
brew install hugo   # 只需一次
hugo server -D
# 浏览器打开 http://localhost:1313
```

## 修改个人信息

打开 `hugo.toml`，把 `你的名字`、`你的用户名`、`你的邮箱@example.com`、简介等替换成真实内容；
头像换成 `static/images/avatar.png`（然后把 `hugo.toml` 里的 `imageUrl` 改成 `images/avatar.png`）。

## 发布新文章

在 `content/posts/` 里新建一个 `.md` 文件，格式参考 `content/posts/hello-world.md`。
写完后推送到 GitHub 即自动发布。

## 部署到 GitHub Pages（免费）

1. 在 GitHub 新建一个仓库，名字必须是 `<你的GitHub用户名>.github.io`（例如 `zhangsan.github.io`）
2. 把本目录推上去：
   ```bash
   git remote add origin https://github.com/<你的GitHub用户名>/<你的GitHub用户名>.github.io.git
   git push -u origin main
   ```
3. 在仓库 Settings → Pages 里，Source 选择 **GitHub Actions**
4. 等几分钟，访问 `https://<你的GitHub用户名>.github.io/` 即可
5. 之后每次 `git push` 都会自动重新构建发布
