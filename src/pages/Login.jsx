import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { login, isAuthenticated } from '../utils/auth'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 如果已登录，跳转到首页
    if (isAuthenticated()) {
      navigate('/')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = login(username, password)
      
      if (result.success) {
        alert('登录成功！')
        navigate('/admin')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="snow-bg"></div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">独钓寒江雪</h1>
            <p className="login-subtitle">作者登录</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">用户名</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary login-btn"
              disabled={loading}
            >
              <LogIn size={20} />
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="login-footer">
            <p className="login-hint">默认账号: admin / admin123</p>
            <button 
              onClick={() => navigate('/')} 
              className="back-link"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

