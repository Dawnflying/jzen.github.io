# GitHub Pages 快速部署指南

## 🚀 自动部署（推荐）

项目已配置 GitHub Actions，每次推送到 `main` 分支会自动部署。

### 首次部署步骤：

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "准备部署"
   git push origin main
   ```

2. **配置 GitHub Pages 设置**
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"
   - 保存设置

3. **触发首次部署**
   - 方式一：推送代码会自动触发
   - 方式二：在 Actions 标签页手动运行工作流

4. **访问网站**
   - 部署完成后约 1-2 分钟，访问：
   - `https://your-username.github.io/jarvis-zen-blog/`

## 📝 手动部署（备选）

如果自动部署有问题，可以使用手动方式：

```bash
# 构建项目
npm run build

# 部署到 gh-pages 分支
npm run deploy
```

然后在 GitHub 仓库设置中：
- Settings → Pages
- Source 选择 "Deploy from a branch"
- Branch 选择 "gh-pages"，目录选择 "/ (root)"

## ⚙️ 配置检查清单

确保以下配置正确：

- [x] `vite.config.js` 中 `base: '/jarvis-zen-blog/'`
- [x] `src/App.jsx` 中 `basename="/jarvis-zen-blog"`
- [x] `.github/workflows/deploy.yml` 存在
- [x] `public/.nojekyll` 文件存在

## 🔧 权限设置

如果 GitHub Actions 部署失败，检查：

1. Settings → Actions → General
2. Workflow permissions 设置为 "Read and write permissions"
3. 勾选 "Allow GitHub Actions to create and approve pull requests"

## 📌 注意事项

- 首次部署需要几分钟时间
- 如果仓库名不是 `jarvis-zen-blog`，需要修改：
  - `vite.config.js` 中的 `base`
  - `src/App.jsx` 中的 `basename`
- 如果需要自定义域名，在 `public` 目录创建 `CNAME` 文件

## ✅ 验证部署

部署成功后，检查：
- [ ] 网站可以正常访问
- [ ] 所有路由正常工作
- [ ] CSS 和 JS 文件加载正常
- [ ] 静态资源路径正确

---

**需要帮助？** 查看完整的 [DEPLOYMENT.md](./DEPLOYMENT.md) 文档。

