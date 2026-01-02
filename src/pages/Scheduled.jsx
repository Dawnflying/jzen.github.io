import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Clock, Edit, Trash2, Send } from 'lucide-react'
import Header from '../components/Header'
import { 
  getScheduledPosts, 
  deleteScheduledPost, 
  publishScheduledNow,
  scheduledToDraft 
} from '../utils/storage'
import { canEdit } from '../utils/auth'
import './Scheduled.css'

const Scheduled = () => {
  const navigate = useNavigate()
  const [scheduled, setScheduled] = useState([])

  useEffect(() => {
    if (!canEdit()) {
      alert('您没有权限访问此页面')
      navigate('/')
      return
    }

    loadScheduled()
  }, [navigate])

  const loadScheduled = () => {
    const allScheduled = getScheduledPosts()
    setScheduled(allScheduled)
  }

  const handleDelete = (id) => {
    if (window.confirm('确定要删除这篇定时发布吗？')) {
      deleteScheduledPost(id)
      loadScheduled()
    }
  }

  const handlePublishNow = (id) => {
    if (window.confirm('确定要立即发布这篇文章吗？')) {
      const post = publishScheduledNow(id)
      if (post) {
        alert('发布成功！')
        navigate(`/post/${post.id}`)
      }
    }
  }

  const handleMoveToDraft = (id) => {
    if (window.confirm('确定要将这篇文章移至草稿箱吗？')) {
      const draft = scheduledToDraft(id)
      if (draft) {
        alert('已移至草稿箱！')
        loadScheduled()
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTimeRemaining = (scheduledTime) => {
    const now = new Date()
    const scheduled = new Date(scheduledTime)
    const diff = scheduled - now
    
    if (diff <= 0) {
      return '待发布'
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) {
      return `${days}天后`
    } else if (hours > 0) {
      return `${hours}小时后`
    } else {
      return `${minutes}分钟后`
    }
  }

  const stripHtml = (html) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  return (
    <div className="scheduled-page">
      <Header />
      
      <div className="scheduled-container">
        <div className="scheduled-header">
          <h1 className="scheduled-title">
            <Clock size={32} />
            定时发布
          </h1>
          <Link to="/editor" className="btn btn-primary">
            <Edit size={20} />
            新建文章
          </Link>
        </div>

        {scheduled.length === 0 ? (
          <div className="empty-state">
            <Clock size={64} />
            <h2>暂无定时发布</h2>
            <p>您还没有设置任何定时发布</p>
            <Link to="/editor" className="btn btn-primary">
              开始写作
            </Link>
          </div>
        ) : (
          <div className="scheduled-grid">
            {scheduled.map(post => (
              <div key={post.id} className="scheduled-card">
                <div className="scheduled-header-info">
                  <span className="scheduled-badge">定时发布</span>
                  <span className="scheduled-time">
                    {getTimeRemaining(post.scheduledTime)}
                  </span>
                </div>
                
                <h3 className="scheduled-title-text">{post.title || '未命名'}</h3>
                
                <div className="scheduled-meta">
                  <span className="scheduled-category">{post.category}</span>
                  <span className="scheduled-date">
                    {formatDate(post.scheduledTime)}
                  </span>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="scheduled-tags">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                    {post.tags.length > 3 && <span className="tag">...</span>}
                  </div>
                )}

                <p className="scheduled-excerpt">
                  {post.content ? stripHtml(post.content).substring(0, 100) : '暂无内容'}...
                </p>

                <div className="scheduled-actions">
                  <Link to={`/editor/${post.id}`} className="btn btn-small">
                    <Edit size={14} />
                    编辑
                  </Link>
                  <button 
                    onClick={() => handlePublishNow(post.id)} 
                    className="btn btn-primary btn-small"
                  >
                    <Send size={14} />
                    立即发布
                  </button>
                  <button 
                    onClick={() => handleMoveToDraft(post.id)} 
                    className="btn btn-small"
                  >
                    移至草稿
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)} 
                    className="btn btn-danger btn-small"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Scheduled

