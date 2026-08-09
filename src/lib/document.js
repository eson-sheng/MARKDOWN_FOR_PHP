import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItTaskLists from 'markdown-it-task-lists'
import { katex } from '@mdit/plugin-katex'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdownLanguage from 'highlight.js/lib/languages/markdown'
import php from 'highlight.js/lib/languages/php'
import sql from 'highlight.js/lib/languages/sql'
import xml from 'highlight.js/lib/languages/xml'
import DOMPurify from 'dompurify'

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('css', css)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdownLanguage)
hljs.registerLanguage('md', markdownLanguage)
hljs.registerLanguage('php', php)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)

const slugCounts = new Map()

function slugify(value) {
  const base = String(value)
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-|-$/g, '') || 'section'
  const count = slugCounts.get(base) || 0
  slugCounts.set(base, count + 1)
  return count ? `${base}-${count}` : base
}

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  typographer: false,
  highlight(code, language) {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language, ignoreIllegals: true }).value
    }
    return markdown.utils.escapeHtml(code)
  },
})
  .use(markdownItAnchor, { slugify })
  .use(markdownItTaskLists, { enabled: false, label: true })
  .use(katex)

export function renderDocument(source) {
  slugCounts.clear()
  const rawHtml = markdown.render(source)
  const html = DOMPurify.sanitize(rawHtml, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['target', 'allow', 'allowfullscreen', 'frameborder'],
  })

  const parsed = new DOMParser().parseFromString(html, 'text/html')
  const headings = [...parsed.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((node) => ({
    id: node.id,
    level: Number(node.tagName.slice(1)),
    text: node.textContent.trim(),
  }))

  parsed.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href') || ''
    const isRelative = href[0] !== '#' && !href.startsWith('//') && !/^[a-z][a-z\d+.-]*:/i.test(href)
    if (href && !isRelative && href[0] !== '#') {
      link.setAttribute('target', '_blank')
      link.setAttribute('rel', 'noopener noreferrer')
    }
  })

  return { html: parsed.body.innerHTML, headings }
}
