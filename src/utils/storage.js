// 本地存储工具函数

const STORAGE_KEYS = {
  POSTS: 'zen_blog_posts',
  DRAFTS: 'zen_blog_drafts',
  SCHEDULED: 'zen_blog_scheduled',
  COMMENTS: 'zen_blog_comments',
  LIKES: 'zen_blog_likes',
  HISTORY: 'zen_blog_history',
}

// 获取所有文章
export const getPosts = () => {
  const posts = localStorage.getItem(STORAGE_KEYS.POSTS)
  return posts ? JSON.parse(posts) : []
}

// 保存文章
export const savePost = (post) => {
  const posts = getPosts()
  const existingIndex = posts.findIndex(p => p.id === post.id)
  
  if (existingIndex !== -1) {
    // 保存历史版本
    savePostHistory(posts[existingIndex])
    
    posts[existingIndex] = { 
      ...posts[existingIndex], 
      ...post, 
      updatedAt: new Date().toISOString(),
      version: (posts[existingIndex].version || 1) + 1,
    }
  } else {
    const newPost = {
      ...post,
      id: post.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      version: 1,
    }
    posts.unshift(newPost)
  }
  
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts))
  return posts
}

// 获取单篇文章
export const getPostById = (id) => {
  const posts = getPosts()
  return posts.find(p => p.id === id)
}

// 删除文章
export const deletePost = (id) => {
  const posts = getPosts()
  const filtered = posts.filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(filtered))
  return filtered
}

// 增加浏览量
export const incrementViews = (id) => {
  const posts = getPosts()
  const post = posts.find(p => p.id === id)
  if (post) {
    post.views = (post.views || 0) + 1
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts))
  }
}

// 评论相关
export const getComments = (postId) => {
  const allComments = localStorage.getItem(STORAGE_KEYS.COMMENTS)
  const comments = allComments ? JSON.parse(allComments) : {}
  return comments[postId] || []
}

export const addComment = (postId, comment) => {
  const allComments = localStorage.getItem(STORAGE_KEYS.COMMENTS)
  const comments = allComments ? JSON.parse(allComments) : {}
  
  if (!comments[postId]) {
    comments[postId] = []
  }
  
  const newComment = {
    ...comment,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  
  comments[postId].unshift(newComment)
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments))
  return newComment
}

// 点赞相关
export const getLikes = (postId) => {
  const allLikes = localStorage.getItem(STORAGE_KEYS.LIKES)
  const likes = allLikes ? JSON.parse(allLikes) : {}
  return likes[postId] || { count: 0, liked: false }
}

export const toggleLike = (postId) => {
  const allLikes = localStorage.getItem(STORAGE_KEYS.LIKES)
  const likes = allLikes ? JSON.parse(allLikes) : {}
  
  if (!likes[postId]) {
    likes[postId] = { count: 0, liked: false }
  }
  
  likes[postId].liked = !likes[postId].liked
  likes[postId].count += likes[postId].liked ? 1 : -1
  
  localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likes))
  
  // 同时更新文章的点赞数
  const posts = getPosts()
  const post = posts.find(p => p.id === postId)
  if (post) {
    post.likes = likes[postId].count
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts))
  }
  
  return likes[postId]
}

// ==================== 草稿相关 ====================

// 获取所有草稿
export const getDrafts = () => {
  const drafts = localStorage.getItem(STORAGE_KEYS.DRAFTS)
  return drafts ? JSON.parse(drafts) : []
}

// 保存草稿
export const saveDraft = (draft) => {
  const drafts = getDrafts()
  const existingIndex = drafts.findIndex(d => d.id === draft.id)
  
  if (existingIndex !== -1) {
    drafts[existingIndex] = { 
      ...drafts[existingIndex], 
      ...draft, 
      updatedAt: new Date().toISOString() 
    }
  } else {
    const newDraft = {
      ...draft,
      id: draft.id || `draft_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
    }
    drafts.unshift(newDraft)
  }
  
  localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts))
  return drafts
}

// 获取单个草稿
export const getDraftById = (id) => {
  const drafts = getDrafts()
  return drafts.find(d => d.id === id)
}

// 删除草稿
export const deleteDraft = (id) => {
  const drafts = getDrafts()
  const filtered = drafts.filter(d => d.id !== id)
  localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(filtered))
  return filtered
}

// 草稿转为正式发布
export const publishDraft = (draftId) => {
  const draft = getDraftById(draftId)
  if (!draft) return null
  
  // 移除草稿ID前缀，生成新ID
  const postId = Date.now().toString()
  const post = {
    ...draft,
    id: postId,
    status: 'published',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    likes: 0,
  }
  
  // 保存为正式文章
  savePost(post)
  
  // 删除草稿
  deleteDraft(draftId)
  
  return post
}

// ==================== 定时发布相关 ====================

// 获取所有定时发布
export const getScheduledPosts = () => {
  const scheduled = localStorage.getItem(STORAGE_KEYS.SCHEDULED)
  return scheduled ? JSON.parse(scheduled) : []
}

// 保存定时发布
export const saveScheduledPost = (post) => {
  const scheduled = getScheduledPosts()
  const existingIndex = scheduled.findIndex(p => p.id === post.id)
  
  if (existingIndex !== -1) {
    scheduled[existingIndex] = { 
      ...scheduled[existingIndex], 
      ...post, 
      updatedAt: new Date().toISOString() 
    }
  } else {
    const newScheduled = {
      ...post,
      id: post.id || `scheduled_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'scheduled',
    }
    scheduled.unshift(newScheduled)
  }
  
  localStorage.setItem(STORAGE_KEYS.SCHEDULED, JSON.stringify(scheduled))
  return scheduled
}

// 获取单个定时发布
export const getScheduledPostById = (id) => {
  const scheduled = getScheduledPosts()
  return scheduled.find(p => p.id === id)
}

// 删除定时发布
export const deleteScheduledPost = (id) => {
  const scheduled = getScheduledPosts()
  const filtered = scheduled.filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEYS.SCHEDULED, JSON.stringify(filtered))
  return filtered
}

// 检查并发布到期的定时文章
export const checkAndPublishScheduled = () => {
  const scheduled = getScheduledPosts()
  const now = new Date()
  const published = []
  
  scheduled.forEach(post => {
    if (post.scheduledTime && new Date(post.scheduledTime) <= now) {
      // 发布文章
      const postId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      const publishedPost = {
        ...post,
        id: postId,
        status: 'published',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
      }
      
      savePost(publishedPost)
      published.push(post.id)
    }
  })
  
  // 删除已发布的定时文章
  if (published.length > 0) {
    const remaining = scheduled.filter(p => !published.includes(p.id))
    localStorage.setItem(STORAGE_KEYS.SCHEDULED, JSON.stringify(remaining))
  }
  
  return published.length
}

// 定时发布转为立即发布
export const publishScheduledNow = (scheduledId) => {
  const scheduled = getScheduledPostById(scheduledId)
  if (!scheduled) return null
  
  const postId = Date.now().toString()
  const post = {
    ...scheduled,
    id: postId,
    status: 'published',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    likes: 0,
  }
  
  savePost(post)
  deleteScheduledPost(scheduledId)
  
  return post
}

// 定时发布转为草稿
export const scheduledToDraft = (scheduledId) => {
  const scheduled = getScheduledPostById(scheduledId)
  if (!scheduled) return null
  
  const draft = {
    ...scheduled,
    id: `draft_${Date.now()}`,
    status: 'draft',
    scheduledTime: null,
  }
  
  saveDraft(draft)
  deleteScheduledPost(scheduledId)
  
  return draft
}

// ==================== 文章历史记录 ====================

// 获取文章的所有历史记录
export const getPostHistory = (postId) => {
  const allHistory = localStorage.getItem(STORAGE_KEYS.HISTORY)
  const history = allHistory ? JSON.parse(allHistory) : {}
  return history[postId] || []
}

// 保存文章历史版本
export const savePostHistory = (post) => {
  const allHistory = localStorage.getItem(STORAGE_KEYS.HISTORY)
  const history = allHistory ? JSON.parse(allHistory) : {}
  
  if (!history[post.id]) {
    history[post.id] = []
  }
  
  // 创建历史记录
  const historyItem = {
    ...post,
    historyId: `history_${Date.now()}`,
    savedAt: new Date().toISOString(),
    version: post.version || 1,
  }
  
  // 添加到历史记录开头
  history[post.id].unshift(historyItem)
  
  // 只保留最近20个版本
  if (history[post.id].length > 20) {
    history[post.id] = history[post.id].slice(0, 20)
  }
  
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history))
  return historyItem
}

// 从历史版本恢复文章
export const restoreFromHistory = (postId, historyId) => {
  const history = getPostHistory(postId)
  const historyItem = history.find(h => h.historyId === historyId)
  
  if (!historyItem) {
    return null
  }
  
  // 创建恢复的文章（移除历史相关字段）
  const { historyId: _, savedAt: __, ...restoredPost } = historyItem
  
  // 保存当前版本到历史
  const currentPost = getPostById(postId)
  if (currentPost) {
    savePostHistory(currentPost)
  }
  
  // 更新文章
  const posts = getPosts()
  const postIndex = posts.findIndex(p => p.id === postId)
  
  if (postIndex !== -1) {
    posts[postIndex] = {
      ...restoredPost,
      updatedAt: new Date().toISOString(),
      version: (restoredPost.version || 1) + 1,
      restoredFrom: historyId,
    }
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts))
    return posts[postIndex]
  }
  
  return null
}

// 删除文章的所有历史记录
export const deletePostHistory = (postId) => {
  const allHistory = localStorage.getItem(STORAGE_KEYS.HISTORY)
  const history = allHistory ? JSON.parse(allHistory) : {}
  
  delete history[postId]
  
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history))
}

// 获取历史版本的内容差异
export const getHistoryDiff = (postId, historyId) => {
  const currentPost = getPostById(postId)
  const history = getPostHistory(postId)
  const historyItem = history.find(h => h.historyId === historyId)
  
  if (!currentPost || !historyItem) {
    return null
  }
  
  return {
    current: {
      title: currentPost.title,
      content: currentPost.content,
      version: currentPost.version,
      updatedAt: currentPost.updatedAt,
    },
    history: {
      title: historyItem.title,
      content: historyItem.content,
      version: historyItem.version,
      savedAt: historyItem.savedAt,
    },
  }
}

// ==================== 初始化示例数据 ====================

// 初始化示例数据
export const initializeSampleData = () => {
  const posts = getPosts()
  
  if (posts.length === 0) {
    const samplePosts = [
      {
        id: '1',
        title: '道德经解读：道可道，非常道',
        content: `<h2>引言</h2>
<p>《道德经》开篇第一句"道可道，非常道"，是老子哲学思想的核心。这句话深刻地揭示了"道"的本质——它是可以言说的，但一旦言说出来，就不再是永恒不变的"道"了。</p>

<h2>道的含义</h2>
<p>"道"在中国哲学中是一个极其重要的概念。它既指宇宙万物的本源和规律，也指人生修养的方法和境界。老子认为，真正的"道"是超越语言和概念的，它无形无名，却又无处不在。</p>

<h2>非常道的智慧</h2>
<p>老子告诉我们，任何试图用语言完全描述"道"的努力都是徒劳的。这不是说"道"不可知，而是说它超越了语言的局限。就像我们无法用语言完整描述音乐的美妙，或者绘画的意境一样。</p>

<h2>现代启示</h2>
<p>在当今这个信息爆炸的时代，老子的智慧显得尤为珍贵。我们应该明白，真理往往在语言之外，在静默之中。过多的言语可能反而遮蔽了事物的本质。</p>

<blockquote>
<p>道可道，非常道。名可名，非常名。</p>
<p>无名天地之始，有名万物之母。</p>
</blockquote>

<h2>结语</h2>
<p>理解"道可道，非常道"，需要我们用心去体悟，而非仅仅依靠理性分析。这是一个需要终生修习的课题，也是中国哲学给予我们的宝贵财富。</p>`,
        category: '中国哲学',
        tags: ['道德经', '老子', '道家'],
        author: '禅境居士',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        views: 128,
        likes: 23,
      },
      {
        id: '2',
        title: '从《史记》看司马迁的历史观',
        content: `<h2>司马迁与《史记》</h2>
<p>司马迁，字子长，是中国历史上最伟大的史学家之一。他所著的《史记》不仅是一部历史著作，更是一部文学巨著，被鲁迅先生誉为"史家之绝唱，无韵之离骚"。</p>

<h2>究天人之际</h2>
<p>司马迁在《报任安书》中说："究天人之际，通古今之变，成一家之言。"这句话清楚地表达了他的历史观。他不仅要记录历史事件，更要探索人与自然、人与社会、过去与现在之间的深层关系。</p>

<h2>人物传记的艺术</h2>
<p>《史记》中的人物传记，如《项羽本纪》、《刺客列传》等，不仅真实记录了历史人物的事迹，更通过生动的描写展现了人物的性格和命运。司马迁用他的笔，让两千多年前的人物栩栩如生地展现在我们面前。</p>

<h2>历史的公正性</h2>
<p>司马迁坚持"不虚美，不隐恶"的原则，即使是帝王将相，他也敢于指出其过失。这种求真务实的精神，使《史记》成为后世史学家的典范。</p>

<h2>个人际遇与历史书写</h2>
<p>司马迁因李陵事件受宫刑，但他没有因此放弃，反而更加坚定了完成《史记》的决心。他说："人固有一死，或重于泰山，或轻于鸿毛。"他选择了用自己的生命和尊严，完成这部不朽的历史著作。</p>

<blockquote>
<p>究天人之际，通古今之变，成一家之言。</p>
</blockquote>

<h2>结语</h2>
<p>司马迁的历史观和他的人格精神，影响了中国两千多年的史学传统。他告诉我们，历史不仅是记录，更是思考；不仅是过去，更是现在和未来的镜子。</p>`,
        category: '中国历史',
        tags: ['史记', '司马迁', '历史'],
        author: '禅境居士',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        views: 86,
        likes: 15,
      },
      {
        id: '3',
        title: '禅宗心法：明心见性',
        content: `<h2>什么是禅</h2>
<p>禅，源于梵文"dhyana"，意为"静虑"或"思维修"。在中国，禅宗发展出了独特的修行方法和哲学思想，成为影响最为深远的佛教宗派之一。</p>

<h2>明心见性的含义</h2>
<p>"明心见性"是禅宗的核心要义。"明心"就是明了自己的心，"见性"就是见到自己的本性，也就是佛性。禅宗认为，人人都有佛性，只是被妄念遮蔽，因此需要通过修行来"明心见性"。</p>

<h2>顿悟与渐修</h2>
<p>禅宗分为南宗和北宗，南宗主张"顿悟"，认为可以在一刹那间明心见性；北宗主张"渐修"，认为需要长期修行才能开悟。这两种方法各有特点，但最终目的都是一样的。</p>

<h2>禅的生活化</h2>
<p>禅宗强调"平常心是道"，认为禅不在寺庙中，而在日常生活中。吃饭、睡觉、走路，无不是禅。正如赵州禅师所说："吃茶去。"这简单的三个字，包含了深刻的禅意。</p>

<h2>公案与参悟</h2>
<p>禅宗有许多著名的公案，如"庭前柏树子"、"狗子无佛性"等。这些看似荒诞的对话，实际上是禅师引导弟子破除执着、直指本心的方法。</p>

<blockquote>
<p>菩提本无树，明镜亦非台。</p>
<p>本来无一物，何处惹尘埃。</p>
<p>——六祖慧能</p>
</blockquote>

<h2>现代意义</h2>
<p>在当今社会，人们的心灵常常被各种欲望和焦虑困扰。禅宗的智慧提醒我们，要回归内心，找到真正的宁静。这不是逃避现实，而是以更清醒的心态面对生活。</p>`,
        category: '中国哲学',
        tags: ['禅宗', '佛教', '修行'],
        author: '禅境居士',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        views: 156,
        likes: 34,
      },
      {
        id: '4',
        title: '朱熹理学：格物致知与存天理去人欲',
        content: `<h2>朱熹其人</h2>
<p>朱熹（1130-1200），字元晦，号晦庵，南宋著名理学家、思想家、哲学家、教育家。他是程颢、程颐之后理学的集大成者，其学说对后世产生了深远影响，被尊称为"朱子"。</p>

<h2>理学的核心概念</h2>
<p>朱熹理学的核心是"理"与"气"的关系。他认为，"理"是宇宙万物的本源和规律，是形而上的存在；"气"是构成万物的质料，是形而下的存在。理在气先，理生气，气聚而成物。</p>

<h3>天理与人欲</h3>
<p>朱熹提出"存天理，去人欲"的主张。"天理"是指符合道德规范的欲望和行为，"人欲"则是指私欲。他认为，人应该通过修养功夫，保存天理，克制私欲，达到道德的完善。</p>

<h2>格物致知</h2>
<p>"格物致知"是朱熹理学的重要方法论。"格物"就是研究事物，"致知"就是获得知识。朱熹认为，通过对事物的深入研究，可以认识事物所蕴含的"理"，从而达到对宇宙本质的认识。</p>

<blockquote>
<p>格物致知，即物穷理。</p>
<p>理一分殊，万物一体。</p>
<p>——朱熹</p>
</blockquote>

<h2>四书的地位</h2>
<p>朱熹将《大学》、《中庸》、《论语》、《孟子》合称为"四书"，并为之作注解。他认为这四部经典是儒家思想的精髓，是学习儒家思想的必读书目。朱熹的《四书章句集注》成为后世科举考试的标准教材。</p>

<h2>居敬穷理</h2>
<p>朱熹提出"居敬穷理"的修养方法。"居敬"是指保持内心的敬畏和专注，"穷理"是指深入研究事物的道理。他认为，只有内心敬畏，才能专心致志地研究学问；只有穷究事理，才能达到对天理的认识。</p>

<h3>修养功夫</h3>
<p>朱熹强调日常修养的重要性。他提出"主敬涵养"和"格物穷理"相结合的修养方法。在日常生活中，要时刻保持敬畏之心，在学习中，要深入研究事物的本质。</p>

<h2>理一分殊</h2>
<p>"理一分殊"是朱熹理学的重要命题。"理一"是指天理的统一性和普遍性，"分殊"是指天理在不同事物中的具体表现。朱熹认为，虽然万物各异，但都遵循同一个天理。</p>

<h2>对后世的影响</h2>
<p>朱熹理学对中国思想史产生了深远影响。他的思想不仅在中国广为传播，还影响了日本、韩国等东亚国家。在中国，朱熹理学成为元、明、清三代的官方哲学，影响了中国社会数百年。</p>

<h3>现代反思</h3>
<p>朱熹理学强调道德修养和理性思考，这些思想在今天仍有重要价值。然而，"存天理，去人欲"的主张也曾被批评为压抑人性。我们应该在继承传统的同时，批判地吸收其精华。</p>

<h2>朱子家训</h2>
<p>朱熹不仅是思想家，还是教育家。他的教育思想和家训影响深远。他强调"读书明理"，认为读书的目的是明白事理，成为有德之人。</p>

<blockquote>
<p>问渠那得清如许？为有源头活水来。</p>
<p>——朱熹《观书有感》</p>
</blockquote>

<h2>结语</h2>
<p>朱熹理学是中国传统哲学的重要组成部分。它强调道德修养、理性思考和格物致知，对中国文化产生了深远影响。在今天，我们仍然可以从朱熹理学中汲取智慧，提升个人修养，追求真理。</p>`,
        category: '中国哲学',
        tags: ['朱熹', '理学', '儒家', '格物致知'],
        author: '禅境居士',
        createdAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
        views: 98,
        likes: 21,
      },
    ]
    
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(samplePosts))
  }
}

