<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { renderDocument } from './lib/document'

const payload = JSON.parse(document.querySelector('#markdown-source')?.textContent || '{}')
const source = payload.content || ''
const title = payload.title || 'Markdown'
const sidebarOpen = ref(window.matchMedia('(min-width: 768px)').matches)
const lightboxImage = ref(null)
const article = ref(null)
const rendered = computed(() => renderDocument(source))

function closeLightbox() {
  lightboxImage.value = null
  document.body.classList.remove('is-locked')
}

function handleArticleClick(event) {
  const image = event.target.closest('img')
  if (!image || !article.value?.contains(image)) return

  if (window.matchMedia('(max-width: 767px)').matches) {
    window.location.href = image.currentSrc || image.src
    return
  }

  lightboxImage.value = { src: image.currentSrc || image.src, alt: image.alt || title }
  document.body.classList.add('is-locked')
}

async function renderDiagrams() {
  await nextTick()
  const blocks = article.value?.querySelectorAll('pre code.language-mermaid, pre code.language-flow, pre code.language-seq') || []
  if (!blocks.length) return

  blocks.forEach((code) => {
    const container = document.createElement('div')
    container.className = 'mermaid'
    container.textContent = code.textContent
    code.parentElement.replaceWith(container)
  })
  const { default: mermaid } = await import('mermaid')
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'neutral' })
  await mermaid.run({ nodes: article.value.querySelectorAll('.mermaid') })
}

onMounted(() => {
  renderDiagrams()
})
</script>

<template>
  <div class="reader" :class="{ 'reader--sidebar-open': sidebarOpen }">
    <button
      class="menu-button"
      type="button"
      :aria-expanded="sidebarOpen"
      aria-controls="document-toc"
      :aria-label="sidebarOpen ? '收起目录' : '展开目录'"
      @click="sidebarOpen = !sidebarOpen"
    >
      <span></span><span></span><span></span>
    </button>

    <aside id="document-toc" class="sidebar" :aria-hidden="!sidebarOpen">
      <div class="sidebar__header">
        <p>目录</p>
        <span>{{ rendered.headings.length }} 个章节</span>
      </div>
      <nav v-if="rendered.headings.length" aria-label="文档目录">
        <a
          v-for="heading in rendered.headings"
          :key="heading.id"
          :href="`#${heading.id}`"
          :class="`toc-level-${heading.level}`"
          @click="window.innerWidth < 768 && (sidebarOpen = false)"
        >{{ heading.text }}</a>
      </nav>
      <p v-else class="sidebar__empty">当前文档没有标题</p>
    </aside>

    <main class="content">
      <article
        ref="article"
        class="markdown-body"
        v-html="rendered.html"
        @click="handleArticleClick"
      ></article>
    </main>

    <div v-if="lightboxImage" class="lightbox" role="dialog" aria-modal="true" @click.self="closeLightbox">
      <button type="button" aria-label="关闭图片预览" @click="closeLightbox">×</button>
      <img :src="lightboxImage.src" :alt="lightboxImage.alt">
    </div>
  </div>
</template>
