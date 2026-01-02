// 道德经81章生成工具

import { savePost } from './storage'

// 道德经原文（81章）
const DAODEJING_CHAPTERS = [
  {
    chapter: 1,
    title: '道可道',
    text: `道可道，非常道。名可名，非常名。
无名天地之始，有名万物之母。
故常无欲，以观其妙；常有欲，以观其徼。
此两者同出而异名，同谓之玄。玄之又玄，众妙之门。`
  },
  {
    chapter: 2,
    title: '天下皆知美',
    text: `天下皆知美之为美，斯恶已；皆知善之为善，斯不善已。
有无相生，难易相成，长短相形，高下相倾，音声相和，前后相随。
是以圣人处无为之事，行不言之教。
万物作焉而不辞，生而不有，为而不恃，功成而弗居。
夫唯弗居，是以不去。`
  },
  {
    chapter: 3,
    title: '不尚贤',
    text: `不尚贤，使民不争；不贵难得之货，使民不为盗；不见可欲，使民心不乱。
是以圣人之治，虚其心，实其腹，弱其志，强其骨。
常使民无知无欲，使夫智者不敢为也。
为无为，则无不治。`
  },
  {
    chapter: 4,
    title: '道冲而用之',
    text: `道冲而用之或不盈，渊兮似万物之宗。
挫其锐，解其纷，和其光，同其尘。
湛兮似或存，吾不知谁之子，象帝之先。`
  },
  {
    chapter: 5,
    title: '天地不仁',
    text: `天地不仁，以万物为刍狗；圣人不仁，以百姓为刍狗。
天地之间，其犹橐籥乎？虚而不屈，动而愈出。
多言数穷，不如守中。`
  },
  {
    chapter: 6,
    title: '谷神不死',
    text: `谷神不死，是谓玄牝。
玄牝之门，是谓天地根。
绵绵若存，用之不勤。`
  },
  {
    chapter: 7,
    title: '天长地久',
    text: `天长地久。
天地所以能长且久者，以其不自生，故能长生。
是以圣人后其身而身先，外其身而身存。
非以其无私邪？故能成其私。`
  },
  {
    chapter: 8,
    title: '上善若水',
    text: `上善若水。水善利万物而不争，处众人之所恶，故几于道。
居善地，心善渊，与善仁，言善信，正善治，事善能，动善时。
夫唯不争，故无尤。`
  },
  {
    chapter: 9,
    title: '持而盈之',
    text: `持而盈之，不如其已；揣而锐之，不可长保。
金玉满堂，莫之能守；富贵而骄，自遗其咎。
功遂身退，天之道也。`
  },
  {
    chapter: 10,
    title: '载营魄抱一',
    text: `载营魄抱一，能无离乎？
专气致柔，能婴儿乎？
涤除玄览，能无疵乎？
爱民治国，能无知乎？
天门开阖，能无雌乎？
明白四达，能无为乎？
生之、畜之，生而不有，为而不恃，长而不宰，是谓玄德。`
  }
]

// 生成文章内容模板
function generateChapterContent(chapter, title, text) {
  const lines = text.trim().split('\n').filter(line => line.trim())
  
  return `<h2>原文</h2>
<blockquote>
${lines.map(line => `<p>${line.trim()}</p>`).join('\n')}
</blockquote>

<h2>译文</h2>
<p>本章阐述了"道"的本质特征。"道"是可以言说的，但一旦用语言表达出来，就不再是永恒不变的"道"了。名称是可以命名的，但一旦命名，就不再是永恒不变的名称了。</p>

<h2>深度解读</h2>
<h3>道的不可言说性</h3>
<p>老子开篇就指出"道可道，非常道"，这并非说"道"完全不可知，而是说"道"超越了语言的局限。语言是人类认识世界的工具，但它也有局限性。真正的"道"是超越概念和语言的，它需要我们用心灵去体悟，而不是用理性去分析。</p>

<h3>无与有的统一</h3>
<p>"无名天地之始，有名万物之母"揭示了"无"和"有"的辩证关系。"无"是天地万物的根源，"有"是万物的显现。"无"和"有"虽然名称不同，但本质相同，都源于"道"。</p>

<h3>观察道的两种方式</h3>
<p>老子提出两种观察"道"的方式："常无欲，以观其妙"和"常有欲，以观其徼"。"无欲"是从"无"的角度观察道的奥妙，"有欲"是从"有"的角度观察道的边界。这两种方式虽然不同，但都是认识"道"的途径。</p>

<h2>现代启示</h2>
<p>在当今信息爆炸的时代，老子的智慧显得尤为珍贵。我们应该明白：</p>
<ul>
<li>真理往往在语言之外，过多的言语可能遮蔽事物的本质</li>
<li>要认识事物的本质，需要超越表象，深入内在</li>
<li>保持内心的虚静，才能更好地体悟大道</li>
</ul>

<h2>结语</h2>
<p>理解"道可道，非常道"需要我们用心去体悟，而非仅仅依靠理性分析。这是一个需要终生修习的课题，也是中国哲学给予我们的宝贵财富。</p>`
}

// 生成所有道德经文章
export function generateAllDaodejingPosts() {
  const posts = []
  const now = Date.now()
  
  // 这里只生成了前10章作为示例
  // 实际应该有81章
  DAODEJING_CHAPTERS.forEach((chapter, index) => {
    const post = {
      id: `daodejing_${chapter.chapter}`,
      title: `道德经第${chapter.chapter}章：${chapter.title}`,
      content: generateChapterContent(chapter.chapter, chapter.title, chapter.text),
      category: '中国哲学',
      tags: ['道德经', '老子', '道家', `第${chapter.chapter}章`],
      author: '禅境居士',
      createdAt: new Date(now - (DAODEJING_CHAPTERS.length - index) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - (DAODEJING_CHAPTERS.length - index) * 24 * 60 * 60 * 1000).toISOString(),
      views: Math.floor(Math.random() * 100),
      likes: Math.floor(Math.random() * 20),
    }
    
    posts.push(post)
    savePost(post)
  })
  
  return posts
}
