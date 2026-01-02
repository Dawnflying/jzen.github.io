# 快速启动指南

## 🚀 5分钟快速启动

### 第1步：安装依赖（约1-2分钟）

```bash
npm install
```

### 第2步：启动开发服务器

```bash
npm run dev
```

浏览器会自动打开 `http://localhost:3000`

### 第3步：探索功能

✅ 查看首页的三篇示例文章  
✅ 点击文章卡片阅读详情  
✅ 尝试点赞和评论  
✅ 点击"写文章"创建自己的内容  
✅ 使用富文本编辑器编写文章  
✅ 点击右下角播放背景音乐  
✅ 欣赏飘雪动画效果  

## 📦 一键部署到 GitHub Pages

### 前提条件

- 已有 GitHub 账号
- 已创建 GitHub 仓库

### 部署步骤

1. **修改配置文件**

编辑 `vite.config.js`：
```javascript
base: '/你的仓库名/',  // 例如：'/my-blog/'
```

编辑 `src/App.jsx`：
```javascript
<Router basename="/你的仓库名">  // 例如："/my-blog"
```

2. **推送代码**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

3. **启用 GitHub Pages**

- 进入仓库 Settings → Pages
- Source 选择 "GitHub Actions"
- 等待自动部署完成

4. **访问网站**

```
https://你的用户名.github.io/你的仓库名/
```

## 🎨 快速自定义

### 更改网站标题

编辑 `index.html`：
```html
<title>你的博客名称</title>
```

编辑 `src/components/Header.jsx`：
```javascript
<h1 className="logo-text">你的博客名称</h1>
```

### 更改作者名

编辑 `src/pages/Editor.jsx`：
```javascript
author: '你的名字',
```

### 更改主题颜色

编辑 `src/index.css`：
```css
:root {
  --primary-red: #c8102e;    /* 改为你喜欢的颜色 */
  --primary-gold: #d4af37;   /* 改为你喜欢的颜色 */
}
```

### 添加背景音乐

1. 将音乐文件放入 `public` 目录
2. 编辑 `src/components/MusicPlayer.jsx`：
```javascript
const musicUrl = '/your-music.mp3'
```

## 📝 第一篇文章

1. 点击"写文章"
2. 填写标题：例如 "我的第一篇文章"
3. 选择分类：中国哲学 或 中国历史
4. 添加标签：输入后按回车
5. 在编辑器中写内容
6. 点击"预览"查看效果
7. 点击"保存文章"发布

## 🛠️ 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 部署到 GitHub Pages（手动）
npm run deploy
```

## 💡 提示

- 所有数据保存在浏览器本地（LocalStorage）
- 清除浏览器数据会丢失文章，建议定期备份
- 支持 Markdown 语法
- 完全响应式设计，支持手机访问
- 飘雪效果可在 `SnowEffect.jsx` 中调整

## 🆘 遇到问题？

### 端口被占用

```bash
# 使用其他端口
npm run dev -- --port 3001
```

### 依赖安装失败

```bash
# 清除缓存后重试
npm cache clean --force
npm install
```

### 页面无法访问

1. 检查是否运行 `npm run dev`
2. 检查端口是否被占用
3. 尝试重启开发服务器

## 📚 进阶学习

- 详细功能说明：查看 `USAGE_GUIDE.md`
- 部署详细教程：查看 `DEPLOYMENT.md`
- 项目介绍：查看 `README.md`

## 🎯 下一步

- ✨ 自定义主题样式
- 📝 创作更多文章
- 💬 与读者互动评论
- 🚀 部署到线上
- 🔗 分享给朋友

---

**开始您的博客之旅吧！** ✍️

有任何问题，欢迎查看文档或提交 Issue。

