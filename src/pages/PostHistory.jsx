import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { History, ArrowLeft, RotateCcw, Eye } from 'lucide-react'
import Header from '../components/Header'
import { getPostById, getPostHistory, restoreFromHistory } from '../utils/storage'
import { canEdit } from '../utils/auth'
import './PostHistory.css'

const PostHistory = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [history, setHistory] = useState([])
  const [selectedHistory, setSelectedHistory] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (!canEdit()) {
      alert('您没有权限查看历史记录')
      navigate('/')
      return
    }

    const currentPost = getPostById(id)
    if (currentPost) {
      setPost(currentPost)
      const postHistory = getPostHistory(id)
      setHistory(postHistory)
    } else {
      alert('文章不存在')
      navigate('/')
    }
  }, [id, navigate])

  const handleRestore = (historyId) => {
    if (!window.confirm('确定要恢复到这个版本吗？当前版本将被保存到历史记录中。')) {
      return
    }

    const restored = restoreFromHistory(id, historyId)
    if (restored) {
      alert('恢复成功！')
      navigate(`/post/${id}`)
    } else {
      alert('恢复失败')
    }
  }

  const handlePreview = (historyItem) => {
    setSelectedHistory(historyItem)
    setShowPreview(true)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const stripHtml = (html) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  if (!post) {
    return null
  }

  return (
    <div className="history-page">
      <Header />
      
      <div className="history-container">
        <div className="history-header">
          <Link to={`/post/${id}`} className="btn">
            <ArrowLeft size={20} />
            返回文章
          </Link>
          <h2 className="history-title">
            <History size={24} />
            历史版本
          </h2>
        </div>

        <div className="current-version">
          <h3>当前版本</h3>
          <div className="version-card current">
            <div className="version-header">
              <span className="version-badge">版本 {post.version || 1}</span>
              <span className="version-date">{formatDate(post.updatedAt)}</span>
            </div>
            <h4 className="version-title">{post.title}</h4>
            <p className="version-excerpt">{stripHtml(post.content).substring(0, 150)}...</p>
          </div>
        </div>

        <div className="history-list">
          <h3>历史版本 ({history.length})</h3>
          {history.length === 0 ? (
            <div className="empty-history">
              <p>暂无历史记录</p>
            </div>
          ) : (
            <div className="history-grid">
              {history.map((item) => (
                <div key={item.historyId} className="version-card">
                  <div className="version-header">
                    <span className="version-badge">版本 {item.version || 1}</span>
                    <span className="version-date">{formatDate(item.savedAt)}</span>
                  </div>
                  <h4 className="version-title">{item.title}</h4>
                  <p className="version-excerpt">
                    {stripHtml(item.content).substring(0, 150)}...
                  </p>
                  <div className="version-actions">
                    <button
                      onClick={() => handlePreview(item)}
                      className="btn"
                    >
                      <Eye size={16} />
                      预览
                    </button>
                    <button
                      onClick={() => handleRestore(item.historyId)}
                      className="btn btn-primary"
                    >
                      <RotateCcw size={16} />
                      恢复
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 预览模态框 */}
      {showPreview && selectedHistory && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>版本 {selectedHistory.version} 预览</h3>
              <span className="modal-date">{formatDate(selectedHistory.savedAt)}</span>
            </div>
            <div className="modal-body">
              <h2 className="preview-title">{selectedHistory.title}</h2>
              <div 
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: selectedHistory.content }}
              />
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowPreview(false)}
                className="btn"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  setShowPreview(false)
                  handleRestore(selectedHistory.historyId)
                }}
                className="btn btn-primary"
              >
                <RotateCcw size={16} />
                恢复此版本
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostHistory

