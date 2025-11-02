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
      {
        id: '5',
        title: '王阳明心学：知行合一与致良知',
        content: `<h2>阳明先生</h2>
<p>王守仁（1472-1529），字伯安，号阳明，世称阳明先生。明代著名思想家、文学家、哲学家和军事家，陆王心学的集大成者。他一生历经坎坷，在龙场悟道后创立了影响深远的心学体系。</p>

<h2>心即理</h2>
<p>王阳明提出"心即理"的核心命题，认为天理就在人心之中。这与朱熹"性即理"的观点不同。王阳明认为，不必向外求理，心外无理，心外无物，一切道理都在人的本心之中。</p>

<blockquote>
<p>心即理也。天下又有心外之事，心外之理乎？</p>
<p>——王阳明</p>
</blockquote>

<h2>知行合一</h2>
<p>"知行合一"是王阳明心学的重要思想。他认为，真知即行，知而不行，只是未知。真正的知识必定伴随着行动，知和行是一体的，不可分割。</p>

<h3>知行关系</h3>
<p>王阳明反对将知行分为两个阶段的观点。他说："知是行的主意，行是知的功夫；知是行之始，行是知之成。"这一思想强调实践的重要性，反对空谈理论。</p>

<h2>致良知</h2>
<p>晚年的王阳明提出"致良知"学说，这是他思想的最高境界。"良知"是人心中固有的道德意识和判断能力。"致良知"就是将这种道德意识发扬光大，在日常生活中处处实践。</p>

<h3>良知的含义</h3>
<p>良知不是后天学习得来的，而是人人生而具有的道德本能。它能够明辨是非善恶，指导人的行为。王阳明认为，只要听从良知的指引，就能达到至善的境界。</p>

<blockquote>
<p>良知者，孟子所谓'是非之心，人皆有之'者也。</p>
<p>致吾心之良知于事事物物，则事事物物皆得其理矣。</p>
<p>——王阳明</p>
</blockquote>

<h2>龙场悟道</h2>
<p>正德三年（1508年），王阳明因得罪宦官刘瑾被贬至贵州龙场。在这荒僻之地，他经历了艰苦的磨难，也在此悟得"心即理"的道理，史称"龙场悟道"。这成为他思想发展的重要转折点。</p>

<h2>四句教</h2>
<p>王阳明晚年提出的"四句教"，精炼地概括了他的心学思想：</p>

<blockquote>
<p>无善无恶心之体，</p>
<p>有善有恶意之动，</p>
<p>知善知恶是良知，</p>
<p>为善去恶是格物。</p>
</blockquote>

<p>这四句话阐明了心、意、知、物的关系，是心学的精髓所在。</p>

<h2>与朱熹理学的区别</h2>
<p>王阳明心学与朱熹理学的主要区别在于：</p>

<p><strong>朱熹：</strong>主张"性即理"，向外格物穷理，通过研究外部事物来认识天理。</p>

<p><strong>王阳明：</strong>主张"心即理"，向内求索，认为天理就在人心之中，不必外求。</p>

<h2>实践与应用</h2>
<p>王阳明不仅是思想家，也是实践家。他平定宁王叛乱，平息南赣盗乱，将心学思想应用于军事和政治实践中，证明了"知行合一"的有效性。</p>

<h2>后世影响</h2>
<p>王阳明心学对后世产生了深远影响。在明代后期，阳明心学成为显学，门徒遍及天下。他的思想不仅影响了中国，还传播到日本，成为日本明治维新的重要思想资源。</p>

<h3>现代价值</h3>
<p>王阳明的"知行合一"思想，强调实践的重要性，反对空谈。"致良知"思想提醒我们要遵从内心的道德准则。这些思想在当今社会仍有重要的启示意义。</p>

<h2>结语</h2>
<p>王阳明心学是中国哲学史上的一座丰碑。它强调内省、实践和道德自觉，为儒家思想开辟了新的道路。"此心光明，亦复何言"，这是王阳明临终前留下的话，也是他一生心学修为的最好注脚。</p>

<blockquote>
<p>你未看此花时，此花与汝心同归于寂；</p>
<p>你来看此花时，则此花颜色一时明白起来。</p>
<p>便知此花不在你的心外。</p>
<p>——王阳明</p>
</blockquote>`,
        category: '中国哲学',
        tags: ['王阳明', '心学', '知行合一', '致良知'],
        author: '禅境居士',
        createdAt: new Date(Date.now() - 0.2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 0.2 * 24 * 60 * 60 * 1000).toISOString(),
        views: 142,
        likes: 28,
      },
      {
        id: '6',
        title: '周敦颐与陆九渊：理学与心学的奠基者',
        content: `<h2>两位哲学巨匠</h2>
<p>周敦颐（1017-1073）和陆九渊（1139-1193）是中国哲学史上的重要人物。周敦颐是理学的开创者，被誉为"理学鼻祖"；陆九渊则是心学的先驱，为后来的王阳明心学奠定了基础。两人虽然分属不同的哲学流派，但都对宋明理学的发展产生了深远影响。</p>

<h2>周敦颐：理学鼻祖</h2>
<p>周敦颐，字茂叔，号濂溪，世称濂溪先生。他开创了宋代理学，其思想主要体现在《太极图说》和《通书》中。周敦颐的哲学以"太极"为核心，构建了一个完整的宇宙论体系。</p>

<h3>太极图说</h3>
<p>周敦颐的《太极图说》是理学的奠基之作。他认为"太极"是宇宙的本源，太极生两仪（阴阳），两仪生四象，四象生八卦，从而化生万物。这个宇宙生成论为后来的理学家提供了重要的理论基础。</p>

<blockquote>
<p>无极而太极。太极动而生阳，动极而静，静而生阴，静极复动。一动一静，互为其根。</p>
<p>——周敦颐《太极图说》</p>
</blockquote>

<h3>诚与神</h3>
<p>周敦颐提出"诚"是宇宙的根本原理。"诚"不仅是道德的最高境界，也是宇宙运行的根本规律。他认为"诚"是"五常之本，百行之源"，是连接天人的纽带。</p>

<h2>陆九渊：心学先驱</h2>
<p>陆九渊，字子静，号象山，世称象山先生。他开创了心学一派，与朱熹的理学形成鲜明对比。陆九渊强调"心即理"，认为宇宙万物之理都在人心之中。</p>

<h3>心即理</h3>
<p>陆九渊提出"心即理"的命题，认为宇宙万物之理都存在于人的心中。他说："宇宙便是吾心，吾心即是宇宙。"这一思想为后来的王阳明心学奠定了基础。</p>

<blockquote>
<p>人皆有是心，心皆具是理，心即理也。</p>
<p>——陆九渊</p>
</blockquote>

<h3>发明本心</h3>
<p>陆九渊强调"发明本心"的重要性。他认为，人心中本来就有道德之理，不需要向外求索，只需要反观内心，就能发现和体认这些道理。</p>

<h2>哲学思想的对比</h2>
<p>周敦颐和陆九渊的哲学思想有着根本性的差异：</p>

<h3>宇宙论</h3>
<p><strong>周敦颐：</strong>主张"太极"是宇宙本源，通过太极→两仪→四象→八卦的生成过程，化生万物。</p>

<p><strong>陆九渊：</strong>认为"心"是宇宙的根本，宇宙万物之理都存在于人的心中。</p>

<h3>认识论</h3>
<p><strong>周敦颐：</strong>强调通过观察宇宙万物的变化规律来认识"理"。</p>

<p><strong>陆九渊：</strong>主张向内求索，通过"发明本心"来认识"理"。</p>

<h3>修养方法</h3>
<p><strong>周敦颐：</strong>提出"主静立人极"，强调通过静坐来体认天理。</p>

<p><strong>陆九渊：</strong>强调"先立乎其大者"，先确立道德本心，然后扩充之。</p>

<h2>周敦颐的《爱莲说》</h2>
<p>周敦颐的《爱莲说》不仅是一篇优美的散文，也体现了他的哲学思想。他以莲花比喻君子，强调"出淤泥而不染，濯清涟而不妖"的高洁品格。</p>

<blockquote>
<p>予独爱莲之出淤泥而不染，濯清涟而不妖，中通外直，不蔓不枝，香远益清，亭亭净植，可远观而不可亵玩焉。</p>
<p>——周敦颐《爱莲说》</p>
</blockquote>

<h2>陆九渊的鹅湖之会</h2>
<p>淳熙二年（1175年），陆九渊与朱熹在江西鹅湖寺进行了一场著名的哲学辩论，史称"鹅湖之会"。双方就"为学之方"展开激烈讨论，陆九渊主张"先立乎其大者"，朱熹主张"格物致知"。</p>

<h3>辩论焦点</h3>
<p>陆九渊认为，为学应该先确立道德本心，然后扩充之；朱熹则认为，应该通过格物致知来认识天理。这场辩论虽然未能达成一致，但促进了理学和心学的发展。</p>

<h2>对后世的影响</h2>
<p>周敦颐和陆九渊的思想对后世产生了深远影响：</p>

<h3>周敦颐的影响</h3>
<p>周敦颐的太极理论为程颢、程颐、朱熹等理学家提供了重要的理论基础。他的宇宙生成论成为理学的核心内容之一。</p>

<h3>陆九渊的影响</h3>
<p>陆九渊的心学思想为王阳明心学奠定了基础。他的"心即理"、"发明本心"等思想被王阳明继承和发展。</p>

<h2>现代意义</h2>
<p>周敦颐和陆九渊的思想在今天仍有重要的启示意义：</p>

<h3>周敦颐的启示</h3>
<p>周敦颐强调宇宙的统一性和规律性，提醒我们要尊重自然规律，追求人与自然的和谐。</p>

<h3>陆九渊的启示</h3>
<p>陆九渊强调内心的道德自觉，提醒我们要重视内在修养，培养独立的人格。</p>

<h2>结语</h2>
<p>周敦颐和陆九渊虽然分属理学和心学两个不同的哲学流派，但他们都为中国哲学的发展做出了重要贡献。周敦颐开创了理学，为后来的程朱理学奠定了基础；陆九渊开创了心学，为后来的陆王心学奠定了基础。他们的思想至今仍具有重要的理论价值和现实意义。</p>

<blockquote>
<p>为天地立心，为生民立命，为往圣继绝学，为万世开太平。</p>
<p>——张载（与周敦颐、陆九渊同时代的理学家）</p>
</blockquote>`,
        category: '中国哲学',
        tags: ['周敦颐', '陆九渊', '理学', '心学', '太极图说'],
        author: '禅境居士',
        createdAt: new Date(Date.now() - 0.1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 0.1 * 24 * 60 * 60 * 1000).toISOString(),
        views: 89,
        likes: 19,
      },
    ]
    
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(samplePosts))
  }
}

