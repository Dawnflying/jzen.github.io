import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, Eye, Heart, Tag, ArrowLeft, Edit, Trash2, History } from 'lucide-react'
import Header from '../components/Header'
import Comments from '../components/Comments'
import { getPostById, incrementViews, deletePost, toggleLike, getLikes, getPostHistory } from '../utils/storage'
import { canEdit, canDelete } from '../utils/auth'
import './BlogPost.css'

const BlogPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [likes, setLikes] = useState({ count: 0, liked: false })
  const [historyCount, setHistoryCount] = useState(0)

  useEffect(() => {
    const foundPost = getPostById(id)
    if (foundPost) {
      setPost(foundPost)
      incrementViews(id)
      const likesData = getLikes(id)
      setLikes(likesData)
      
      // 获取历史记录数量
      if (canEdit()) {
        const history = getPostHistory(id)
        setHistoryCount(history.length)
      }
    }
  }, [id])

  const handleLike = () => {
    const newLikes = toggleLike(id)
    setLikes(newLikes)
    setPost(prev => ({ ...prev, likes: newLikes.count }))
  }

  const handleDelete = () => {
    if (!canDelete()) {
      alert('您没有权限删除文章')
      return
    }
    
    if (window.confirm('确定要删除这篇文章吗？')) {
      deletePost(id)
      navigate('/')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!post) {
    return (
      <div className="blog-post-page">
        <Header />
        <div className="content-container">
          <div className="not-found">
            <h2>文章未找到</h2>
            <Link to="/" className="btn">返回首页</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-post-page">
      <Header />
      
      <div className="content-container">
        <div className="post-actions">
          <Link to="/" className="btn">
            <ArrowLeft size={20} />
            返回
          </Link>
          <div className="action-group">
            {canEdit() && (
              <>
                <Link to={`/history/${id}`} className="btn">
                  <History size={20} />
                  历史 {historyCount > 0 && `(${historyCount})`}
                </Link>
                <Link to={`/editor/${id}`} className="btn">
                  <Edit size={20} />
                  编辑
                </Link>
                <button onClick={handleDelete} className="btn btn-danger">
                  <Trash2 size={20} />
                  删除
                </button>
              </>
            )}
          </div>
        </div>

        <article className="post-detail">
          <div className="post-header">
            <div className="post-category-badge">{post.category}</div>
            <h1 className="post-title">{post.title}</h1>
            
            <div className="post-meta-info">
              <span className="meta-item">
                <Calendar size={18} />
                {formatDate(post.createdAt)}
              </span>
              <span className="meta-item">
                <Eye size={18} />
                {post.views || 0} 次阅读
              </span>
            </div>

            <div className="post-tags-list">
              {post.tags?.map(tag => (
                <span key={tag} className="tag-item">
                  <Tag size={16} />
                  {tag}
                </span>
              ))}
            </div>

            <div className="post-author-info">
              作者：{post.author}
            </div>
          </div>

          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="post-footer">
            <button 
              onClick={handleLike} 
              className={`like-button ${likes.liked ? 'liked' : ''}`}
            >
              <Heart size={24} fill={likes.liked ? 'currentColor' : 'none'} />
              <span>{likes.count}</span>
            </button>
          </div>
        </article>

        <Comments postId={id} />
      </div>
    </div>
  )
}

export default BlogPost

