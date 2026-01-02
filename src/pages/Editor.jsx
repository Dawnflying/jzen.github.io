import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Save, ArrowLeft, Eye, FileText, Clock } from 'lucide-react'
import Header from '../components/Header'
import { 
  savePost, 
  getPostById, 
  saveDraft, 
  getDraftById,
  saveScheduledPost,
  getScheduledPostById 
} from '../utils/storage'
import './Editor.css'

const Editor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState({
    title: '',
    content: '',
    category: '中国哲学',
    tags: [],
    author: '禅境居士',
  })
  const [tagInput, setTagInput] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduledTime, setScheduledTime] = useState('')
  const [postType, setPostType] = useState('post') // 'post', 'draft', 'scheduled'

  useEffect(() => {
    if (id) {
      // 尝试从不同来源加载
      let existingPost = getPostById(id)
      let type = 'post'
      
      if (!existingPost && id.startsWith('draft_')) {
        existingPost = getDraftById(id)
        type = 'draft'
      }
      
      if (!existingPost && id.startsWith('scheduled_')) {
        existingPost = getScheduledPostById(id)
        type = 'scheduled'
        if (existingPost?.scheduledTime) {
          setScheduledTime(existingPost.scheduledTime)
        }
      }
      
      if (existingPost) {
        setPost(existingPost)
        setPostType(type)
      }
    }
  }, [id])

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'blockquote', 'code-block',
    'align',
    'link'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!post.title.trim() || !post.content.trim()) {
      alert('请填写标题和内容')
      return
    }

    const savedPost = savePost({
      ...post,
      id: id && !id.startsWith('draft_') && !id.startsWith('scheduled_') ? id : undefined,
    })

    alert('文章发布成功！')
    navigate(`/post/${savedPost[0]?.id || id}`)
  }

  const handleSaveDraft = () => {
    if (!post.title.trim()) {
      alert('请至少填写标题')
      return
    }

    saveDraft({
      ...post,
      id: id && id.startsWith('draft_') ? id : undefined,
    })

    alert('草稿保存成功！')
    navigate('/drafts')
  }

  const handleSchedule = () => {
    if (!post.title.trim() || !post.content.trim()) {
      alert('请填写标题和内容')
      return
    }

    if (!scheduledTime) {
      alert('请选择发布时间')
      return
    }

    const selectedDate = new Date(scheduledTime)
    const now = new Date()

    if (selectedDate <= now) {
      alert('发布时间必须晚于当前时间')
      return
    }

    saveScheduledPost({
      ...post,
      id: id && id.startsWith('scheduled_') ? id : undefined,
      scheduledTime,
    })

    alert('定时发布设置成功！')
    setShowScheduleModal(false)
    navigate('/scheduled')
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !post.tags.includes(tagInput.trim())) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="editor-page">
      <Header />
      
      <div className="editor-container">
        <div className="editor-header">
          <Link to="/" className="btn">
            <ArrowLeft size={20} />
            返回
          </Link>
          <div className="editor-actions">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="btn"
            >
              <Eye size={20} />
              {showPreview ? '编辑' : '预览'}
            </button>
            <button 
              type="button"
              onClick={handleSaveDraft} 
              className="btn"
            >
              <FileText size={20} />
              保存草稿
            </button>
            <button 
              type="button"
              onClick={() => setShowScheduleModal(true)} 
              className="btn"
            >
              <Clock size={20} />
              定时发布
            </button>
            <button onClick={handleSubmit} className="btn btn-primary">
              <Save size={20} />
              立即发布
            </button>
          </div>
        </div>

        <div className="editor-content">
          {showPreview ? (
            <div className="preview-mode">
              <div className="preview-header">
                <h1 className="preview-title">{post.title || '未命名文章'}</h1>
                <div className="preview-meta">
                  <span className="preview-category">{post.category}</span>
                  <span className="preview-author">作者：{post.author}</span>
                </div>
                {post.tags.length > 0 && (
                  <div className="preview-tags">
                    {post.tags.map(tag => (
                      <span key={tag} className="preview-tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div 
                className="preview-content" 
                dangerouslySetInnerHTML={{ __html: post.content || '<p>暂无内容</p>' }} 
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="editor-form">
              <div className="form-section">
                <label htmlFor="title">文章标题</label>
                <input
                  id="title"
                  type="text"
                  placeholder="请输入文章标题..."
                  value={post.title}
                  onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                  className="title-input"
                  maxLength={100}
                />
              </div>

              <div className="form-row">
                <div className="form-section half">
                  <label htmlFor="category">分类</label>
                  <select
                    id="category"
                    value={post.category}
                    onChange={(e) => setPost(prev => ({ ...prev, category: e.target.value }))}
                    className="category-select"
                  >
                    <option value="中国哲学">中国哲学</option>
                    <option value="中国历史">中国历史</option>
                  </select>
                </div>

                <div className="form-section half">
                  <label htmlFor="author">作者</label>
                  <input
                    id="author"
                    type="text"
                    placeholder="作者名称"
                    value={post.author}
                    onChange={(e) => setPost(prev => ({ ...prev, author: e.target.value }))}
                    maxLength={50}
                  />
                </div>
              </div>

              <div className="form-section">
                <label htmlFor="tags">标签</label>
                <div className="tags-input-wrapper">
                  <input
                    id="tags"
                    type="text"
                    placeholder="输入标签后按回车..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagInputKeyPress}
                    maxLength={20}
                  />
                  <button type="button" onClick={handleAddTag} className="btn">
                    添加
                  </button>
                </div>
                {post.tags.length > 0 && (
                  <div className="tags-list">
                    {post.tags.map(tag => (
                      <span key={tag} className="tag-badge">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="tag-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-section">
                <label>文章内容</label>
                <ReactQuill
                  theme="snow"
                  value={post.content}
                  onChange={(content) => setPost(prev => ({ ...prev, content }))}
                  modules={modules}
                  formats={formats}
                  placeholder="在这里书写您的文章..."
                  className="content-editor"
                />
              </div>
            </form>
          )}
        </div>

        {/* 定时发布模态框 */}
        {showScheduleModal && (
          <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>设置定时发布</h3>
              <div className="modal-body">
                <label htmlFor="scheduledTime">发布时间</label>
                <input
                  id="scheduledTime"
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="datetime-input"
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="modal-hint">文章将在指定时间自动发布</p>
              </div>
              <div className="modal-actions">
                <button 
                  type="button"
                  onClick={() => setShowScheduleModal(false)} 
                  className="btn"
                >
                  取消
                </button>
                <button 
                  type="button"
                  onClick={handleSchedule} 
                  className="btn btn-primary"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Editor

