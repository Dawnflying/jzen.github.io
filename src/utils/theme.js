// 主题管理工具

const THEME_KEY = 'zen_blog_theme'

// 获取当前主题
export const getTheme = () => {
  const saved = localStorage.getItem(THEME_KEY)
  return saved || 'light'
}

// 设置主题
export const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme)
  applyTheme(theme)
}

// 切换主题
export const toggleTheme = () => {
  const current = getTheme()
  const newTheme = current === 'light' ? 'dark' : 'light'
  setTheme(newTheme)
  return newTheme
}

// 应用主题到DOM
export const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
}

// 初始化主题
export const initTheme = () => {
  const theme = getTheme()
  applyTheme(theme)
  return theme
}

