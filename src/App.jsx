import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BlogPost from './pages/BlogPost'
import Editor from './pages/Editor'
import Login from './pages/Login'
import Drafts from './pages/Drafts'
import Scheduled from './pages/Scheduled'
import PostHistory from './pages/PostHistory'
import StarChart from './pages/StarChart'
import SnowEffect from './components/SnowEffect'
import MusicPlayer from './components/MusicPlayer'
import ThemeToggle from './components/ThemeToggle'
import { checkAndPublishScheduled } from './utils/storage'
import { initTheme } from './utils/theme'
import './App.css'

function App() {
  useEffect(() => {
    // 初始化主题
    initTheme()
    
    // 每分钟检查一次定时发布
    const checkScheduled = () => {
      const published = checkAndPublishScheduled()
      if (published > 0) {
        console.log(`自动发布了 ${published} 篇文章`)
      }
    }

    // 立即检查一次
    checkScheduled()

    // 设置定时检查
    const interval = setInterval(checkScheduled, 60000) // 每分钟

    return () => clearInterval(interval)
  }, [])

  return (
    <Router basename="/jarvis-zen-blog">
      <div className="app">
        <SnowEffect />
        <MusicPlayer />
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<BlogPost />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Drafts />} />
          <Route path="/drafts" element={<Drafts />} />
          <Route path="/scheduled" element={<Scheduled />} />
          <Route path="/history/:id" element={<PostHistory />} />
          <Route path="/starchart" element={<StarChart />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

