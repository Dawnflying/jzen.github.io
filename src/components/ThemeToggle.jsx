import React, { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { getTheme, toggleTheme } from '../utils/theme'
import './ThemeToggle.css'

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const currentTheme = getTheme()
    setTheme(currentTheme)
  }, [])

  const handleToggle = () => {
    const newTheme = toggleTheme()
    setTheme(newTheme)
  }

  return (
    <button 
      className="theme-toggle" 
      onClick={handleToggle}
      aria-label="切换主题"
      title={theme === 'light' ? '切换到暗色模式' : '切换到明色模式'}
    >
      <div className="theme-toggle-inner">
        {theme === 'light' ? (
          <>
            <Moon size={20} className="theme-icon" />
            <span className="theme-text">夜</span>
          </>
        ) : (
          <>
            <Sun size={20} className="theme-icon" />
            <span className="theme-text">昼</span>
          </>
        )}
      </div>
    </button>
  )
}

export default ThemeToggle

