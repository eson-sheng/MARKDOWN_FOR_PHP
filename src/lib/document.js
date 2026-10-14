import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItTaskLists from 'markdown-it-task-lists'
import { katex } from '@mdit/plugin-katex'
import { highlightCode } from './syntax'
import DOMPurify from 'dompurify'

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
  parsed.querySelectorAll('pre > code').forEach((code) => {
    if (code.matches('.language-mermaid, .language-flow, .language-seq')) return
    const declared = [...code.classList].find((name) => name.startsWith('language-'))?.slice(9).toLowerCase()
    const highlighted = highlightCode(code.textContent, declared)
    if (highlighted.html !== null) code.innerHTML = highlighted.html
    code.classList.add('hljs')
    const wrapper = parsed.createElement('div')
    wrapper.className = 'code-block-wrapper'
    const header = parsed.createElement('div')
    header.className = 'code-block__header'
    const label = parsed.createElement('span')
    label.className = 'code-block__language'
    label.textContent = highlighted.label
    const copy = parsed.createElement('button')
    copy.type = 'button'
    copy.className = 'code-block__copy'
    copy.textContent = '复制'
    copy.setAttribute('aria-label', '复制代码')
    copy.setAttribute('title', '复制代码')
    copy.setAttribute('aria-live', 'polite')
    header.append(label, copy)
    const pre = code.parentElement
    pre.replaceWith(wrapper)
    wrapper.append(header, pre)
    pre.classList.add('code-block')
    const lines = code.textContent.replace(/\n$/, '').split('\n').length
    const gutter = parsed.createElement('span')
    gutter.className = 'code-block__numbers'
    gutter.setAttribute('aria-hidden', 'true')
    gutter.textContent = Array.from({ length: lines }, (_, index) => index + 1).join('\n')
    pre.prepend(gutter)
  })
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
