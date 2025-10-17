import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Eye, Heart, Tag } from 'lucide-react'
import Header from '../components/Header'
import { getPosts, initializeSampleData } from '../utils/storage'
import './HomePage.css'

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('全部')

  useEffect(() => {
    initializeSampleData()
    const allPosts = getPosts()
    setPosts(allPosts)
  }, [])

  const categories = ['全部', '中国哲学', '中国历史']
  
  const filteredPosts = selectedCategory === '全部' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const stripHtml = (html) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  return (
    <div className="home-page">
      <Header />
      
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">独钓寒江雪</h1>
          <p className="hero-subtitle">千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。</p>
          <div className="hero-decoration">
            <span className="decoration-char">❄</span>
            <span className="decoration-line"></span>
            <span className="decoration-char">雪</span>
            <span className="decoration-line"></span>
            <span className="decoration-char">❄</span>
          </div>
        </div>
      </div>

      <div className="content-container">
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="posts-grid">
          {filteredPosts.length === 0 ? (
            <div className="empty-state">
              <p>暂无文章，点击"写文章"开始创作吧！</p>
            </div>
          ) : (
            filteredPosts.map(post => {
              const postDate = new Date(post.createdAt)
              const month = postDate.toLocaleDateString('zh-CN', { month: 'short' })
              const day = postDate.getDate()
              
              return (
                <Link key={post.id} to={`/post/${post.id}`} className="post-card">
                  <div className="post-card-left">
                    <div className="post-category">{post.category}</div>
                    <div className="post-date-badge">
                      <div className="post-date-month">{month}</div>
                      <div className="post-date-day">{day}</div>
                    </div>
                  </div>
                  
                  <div className="post-card-content">
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-excerpt">
                      {stripHtml(post.content).substring(0, 200)}...
                    </p>
                    <div className="post-tags">
                      {post.tags?.map(tag => (
                        <span key={tag} className="tag">
                          <Tag size={14} />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="post-meta">
                      <span className="meta-item">
                        <Eye size={16} />
                        {post.views || 0} 次阅读
                      </span>
                      <span className="meta-item">
                        <Heart size={16} />
                        {post.likes || 0} 点赞
                      </span>
                      <span className="post-author">作者：{post.author}</span>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>独钓寒江雪 © 2025 - 探索中国传统文化</p>
          <p className="footer-quote">"孤舟蓑笠翁，独钓寒江雪"</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage

