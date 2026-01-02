// 权限管理工具

const AUTH_KEY = 'zen_blog_auth'
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123', // 实际使用时应该加密
}

// 获取当前登录状态
export const isAuthenticated = () => {
  const auth = localStorage.getItem(AUTH_KEY)
  if (!auth) return false
  
  try {
    const authData = JSON.parse(auth)
    // 检查token是否过期（24小时）
    const loginTime = new Date(authData.loginTime)
    const now = new Date()
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60)
    
    if (hoursDiff > 24) {
      logout()
      return false
    }
    
    return true
  } catch (error) {
    return false
  }
}

// 获取当前用户信息
export const getCurrentUser = () => {
  const auth = localStorage.getItem(AUTH_KEY)
  if (!auth) return null
  
  try {
    const authData = JSON.parse(auth)
    return {
      username: authData.username,
      role: authData.role,
      loginTime: authData.loginTime,
    }
  } catch (error) {
    return null
  }
}

// 登录
export const login = (username, password) => {
  // 简单的验证（实际应该使用服务器验证）
  if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
    const authData = {
      username,
      role: 'admin',
      loginTime: new Date().toISOString(),
      token: generateToken(),
    }
    
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData))
    return { success: true, user: authData }
  }
  
  return { success: false, error: '用户名或密码错误' }
}

// 登出
export const logout = () => {
  localStorage.removeItem(AUTH_KEY)
}

// 生成简单的token
const generateToken = () => {
  return btoa(`${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
}

// 检查是否有编辑权限
export const canEdit = () => {
  return isAuthenticated()
}

// 检查是否有删除权限
export const canDelete = () => {
  return isAuthenticated()
}

// 检查是否可以访问后台
export const canAccessAdmin = () => {
  return isAuthenticated()
}

