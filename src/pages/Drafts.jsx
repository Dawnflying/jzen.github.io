import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, Edit, Trash2, Send, Calendar } from 'lucide-react'
import Header from '../components/Header'
import { getDrafts, deleteDraft, publishDraft } from '../utils/storage'
import { canEdit } from '../utils/auth'
import './Drafts.css'

const Drafts = () => {
  const navigate = useNavigate()
  const [drafts, setDrafts] = useState([])

  useEffect(() => {
    if (!canEdit()) {
      alert('您没有权限访问此页面')
      navigate('/')
      return
    }

    loadDrafts()
  }, [navigate])

  const loadDrafts = () => {
    const allDrafts = getDrafts()
    setDrafts(allDrafts)
  }

  const handleDelete = (id) => {
    if (window.confirm('确定要删除这篇草稿吗？')) {
      deleteDraft(id)
      loadDrafts()
    }
  }

  const handlePublish = (id) => {
    if (window.confirm('确定要发布这篇草稿吗？')) {
      const post = publishDraft(id)
      if (post) {
        alert('发布成功！')
        navigate(`/post/${post.id}`)
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

  const stripHtml = (html) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  return (
    <div className="drafts-page">
      <Header />
      
      <div className="drafts-container">
        <div className="drafts-header">
          <h1 className="drafts-title">
            <FileText size={32} />
            草稿箱
          </h1>
          <Link to="/editor" className="btn btn-primary">
            <Edit size={20} />
            新建文章
          </Link>
        </div>

        {drafts.length === 0 ? (
          <div className="empty-state">
            <FileText size={64} />
            <h2>暂无草稿</h2>
            <p>您还没有保存任何草稿</p>
            <Link to="/editor" className="btn btn-primary">
              开始写作
            </Link>
          </div>
        ) : (
          <div className="drafts-grid">
            {drafts.map(draft => (
              <div key={draft.id} className="draft-card">
                <div className="draft-header">
                  <span className="draft-badge">草稿</span>
                  <span className="draft-date">{formatDate(draft.updatedAt)}</span>
                </div>
                
                <h3 className="draft-title">{draft.title || '未命名'}</h3>
                
                <div className="draft-meta">
                  <span className="draft-category">{draft.category}</span>
                  {draft.tags && draft.tags.length > 0 && (
                    <span className="draft-tags">
                      {draft.tags.slice(0, 2).join(', ')}
                      {draft.tags.length > 2 && '...'}
                    </span>
                  )}
                </div>

                <p className="draft-excerpt">
                  {draft.content ? stripHtml(draft.content).substring(0, 100) : '暂无内容'}...
                </p>

                <div className="draft-actions">
                  <Link to={`/editor/${draft.id}`} className="btn">
                    <Edit size={16} />
                    编辑
                  </Link>
                  <button 
                    onClick={() => handlePublish(draft.id)} 
                    className="btn btn-primary"
                  >
                    <Send size={16} />
                    发布
                  </button>
                  <button 
                    onClick={() => handleDelete(draft.id)} 
                    className="btn btn-danger"
                  >
                    <Trash2 size={16} />
                    删除
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

export default Drafts

