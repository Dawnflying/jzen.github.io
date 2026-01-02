# 部署指南

本文档详细说明如何将禅境博客部署到 GitHub Pages。

## 前置要求

- GitHub 账号
- Git 已安装
- Node.js 已安装（建议 v18 或更高版本）

## 步骤 1：创建 GitHub 仓库

1. 登录 GitHub
2. 创建一个新仓库（例如：`my-zen-blog`）
3. 不要初始化 README、.gitignore 或 license（项目已包含这些文件）

## 步骤 2：修改配置

### 2.1 修改 vite.config.js

打开 `vite.config.js`，将 `base` 改为你的仓库名：

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/my-zen-blog/', // 改为你的仓库名
  // ...
})
```

**重要**: 如果你的仓库名是 `username.github.io`（用户站点），则 `base` 应该设置为 `'/'`

### 2.2 修改 App.jsx

打开 `src/App.jsx`，修改 `basename`：

```javascript
<Router basename="/my-zen-blog"> {/* 改为你的仓库名 */}
  {/* ... */}
</Router>
```

如果是用户站点（`username.github.io`），则：

```javascript
<Router basename="/">
  {/* ... */}
</Router>
```

## 步骤 3：推送代码到 GitHub

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加远程仓库
git remote add origin https://github.com/your-username/my-zen-blog.git

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 禅境博客"

# 推送到 GitHub
git push -u origin main
```

## 步骤 4：配置 GitHub Pages

### 方法一：使用 GitHub Actions（推荐）

1. 进入你的 GitHub 仓库
2. 点击 `Settings` > `Pages`
3. 在 `Source` 下拉菜单中选择 `GitHub Actions`
4. GitHub 会自动检测到 `.github/workflows/deploy.yml` 文件
5. 每次推送到 `main` 分支时，会自动构建和部署

### 方法二：手动部署

```bash
# 安装依赖
npm install

# 构建并部署
npm run deploy
```

这会：
- 构建项目
- 将构建结果推送到 `gh-pages` 分支
- GitHub Pages 会自动从该分支部署

如果使用此方法，需要在 GitHub 仓库设置中：
1. 进入 `Settings` > `Pages`
2. `Source` 选择 `Deploy from a branch`
3. 选择 `gh-pages` 分支和 `/ (root)` 目录

## 步骤 5：访问网站

部署完成后，你的网站将在以下地址可访问：

- 项目站点: `https://your-username.github.io/my-zen-blog/`
- 用户站点: `https://your-username.github.io/`

**注意**: 首次部署可能需要几分钟才能生效。

## 常见问题

### 问题 1: 页面空白或 404 错误

**原因**: `base` 路径配置不正确

**解决方案**: 
- 检查 `vite.config.js` 中的 `base` 配置
- 检查 `src/App.jsx` 中的 `basename` 配置
- 确保两者与你的仓库名匹配

### 问题 2: CSS 或 JS 文件加载失败

**原因**: 相对路径问题

**解决方案**:
- 确保 `public/.nojekyll` 文件存在
- 检查 `base` 配置是否正确

### 问题 3: GitHub Actions 构建失败

**原因**: 权限或配置问题

**解决方案**:
1. 检查仓库 `Settings` > `Actions` > `General`
2. 确保 `Workflow permissions` 设置为 `Read and write permissions`
3. 检查 `.github/workflows/deploy.yml` 文件是否正确

### 问题 4: 使用自定义域名

如果要使用自定义域名：

1. 在 `public` 目录创建 `CNAME` 文件
2. 文件内容为你的域名，例如: `blog.example.com`
3. 在域名提供商处添加 CNAME 记录指向 `your-username.github.io`

## 更新网站

要更新已部署的网站：

```bash
# 修改代码后
git add .
git commit -m "Update blog content"
git push

# 如果使用 GitHub Actions，会自动部署
# 如果手动部署，运行:
npm run deploy
```

## 本地测试

在部署前，建议本地测试：

```bash
# 开发模式
npm run dev

# 预览生产版本
npm run build
npm run preview
```

## 性能优化建议

1. **图片优化**: 使用压缩后的图片
2. **音乐文件**: 使用较小的音频文件或外部 CDN
3. **懒加载**: 考虑为大型组件添加懒加载
4. **缓存**: GitHub Pages 自动启用缓存

## 备份数据

由于使用 LocalStorage 存储数据，建议：

1. 定期导出文章内容
2. 考虑使用 GitHub Issues API 作为备份方案
3. 或集成第三方评论系统（如 Giscus、Utterances）

## 进阶配置

### 使用环境变量

创建 `.env` 文件（不要提交到 Git）：

```env
VITE_REPO_NAME=my-zen-blog
VITE_GITHUB_USERNAME=your-username
```

然后在代码中使用：

```javascript
const basePath = import.meta.env.VITE_REPO_NAME
```

### 集成 Google Analytics

在 `index.html` 中添加：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 技术支持

如有问题，请：
1. 查看 [GitHub Pages 文档](https://docs.github.com/en/pages)
2. 查看 [Vite 部署文档](https://vitejs.dev/guide/static-deploy.html)
3. 在项目仓库提交 Issue

---

祝您部署顺利！🚀

