import React, { useState, useEffect } from 'react'
import { MessageCircle, Send, User } from 'lucide-react'
import { getComments, addComment } from '../utils/storage'
import './Comments.css'

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState({ name: '', content: '' })

  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = () => {
    const postComments = getComments(postId)
    setComments(postComments)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!newComment.name.trim() || !newComment.content.trim()) {
      alert('请填写姓名和评论内容')
      return
    }

    const comment = addComment(postId, {
      name: newComment.name.trim(),
      content: newComment.content.trim(),
    })

    setComments(prev => [comment, ...prev])
    setNewComment({ name: '', content: '' })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)

    if (diff < 60) return '刚刚'
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
    if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`
    
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <div className="comments-section">
      <div className="comments-header">
        <MessageCircle size={24} />
        <h2>评论 ({comments.length})</h2>
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="您的名字"
            value={newComment.name}
            onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
            maxLength={50}
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="写下您的评论..."
            value={newComment.content}
            onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
            rows={4}
            maxLength={500}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          <Send size={20} />
          发表评论
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="empty-comments">
            <p>暂无评论，来发表第一条评论吧！</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-avatar">
                <User size={24} />
              </div>
              <div className="comment-content-wrapper">
                <div className="comment-header">
                  <span className="comment-author">{comment.name}</span>
                  <span className="comment-time">{formatDate(comment.createdAt)}</span>
                </div>
                <div className="comment-content">{comment.content}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Comments

