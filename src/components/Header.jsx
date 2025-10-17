import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, PenTool, FileText, Clock, LogIn, LogOut, Settings } from 'lucide-react'
import { isAuthenticated, logout, getCurrentUser } from '../utils/auth'
import './Header.css'

const Header = () => {
  const navigate = useNavigate()
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      setIsAuth(isAuthenticated())
      setUser(getCurrentUser())
    }
    
    checkAuth()
    
    // 监听存储变化
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      logout()
      setIsAuth(false)
      setUser(null)
      setShowUserMenu(false)
      navigate('/')
      alert('已退出登录')
    }
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1 className="logo-text">独钓寒江雪</h1>
          <p className="logo-subtitle">千山鸟飞绝 万径人踪灭</p>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">
            <Home size={20} />
            <span>首页</span>
          </Link>
          
          {isAuth ? (
            <>
              <Link to="/editor" className="nav-link">
                <PenTool size={20} />
                <span>写文章</span>
              </Link>
              <Link to="/drafts" className="nav-link">
                <FileText size={20} />
                <span>草稿</span>
              </Link>
              <Link to="/scheduled" className="nav-link">
                <Clock size={20} />
                <span>定时</span>
              </Link>
              
              <div className="user-menu">
                <button 
                  className="nav-link user-btn" 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <Settings size={20} />
                  <span>{user?.username}</span>
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown">
                    <button onClick={handleLogout} className="dropdown-item">
                      <LogOut size={16} />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="nav-link">
              <LogIn size={20} />
              <span>登录</span>
            </Link>
          )}
        </nav>
      </div>
      
      <div className="header-decoration">
        <div className="decoration-line"></div>
      </div>
    </header>
  )
}

export default Header

