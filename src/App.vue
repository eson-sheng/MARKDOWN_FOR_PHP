<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { renderDocument } from './lib/document'

const payload = JSON.parse(document.querySelector('#markdown-source')?.textContent || '{}')
const source = payload.content || ''
const title = payload.title || 'Markdown'
const sidebarOpen = ref(window.matchMedia('(min-width: 768px)').matches)
const lightboxImage = ref(null)
const article = ref(null)
const tocNav = ref(null)
const rendered = computed(() => renderDocument(source))
const activeHeadingId = ref(rendered.value.headings[0]?.id || '')
const theme = ref(scheduledTheme())
let themeTimer = 0
let manualThemeUntil = 0
let scrollFrame = 0

function scheduledTheme(date = new Date()) {
  const hour = date.getHours()
  return hour >= 7 && hour < 19 ? 'light' : 'dark'
}

function nextThemeBoundary(date = new Date()) {
  const boundary = new Date(date)
  if (date.getHours() < 7) {
    boundary.setHours(7, 0, 0, 0)
  } else if (date.getHours() < 19) {
    boundary.setHours(19, 0, 0, 0)
  } else {
    boundary.setDate(boundary.getDate() + 1)
    boundary.setHours(7, 0, 0, 0)
  }
  return boundary.getTime()
}

function syncScheduledTheme() {
  if (Date.now() >= manualThemeUntil) theme.value = scheduledTheme()
}

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  manualThemeUntil = nextThemeBoundary()
}

watch(theme, (value) => {
  document.documentElement.dataset.theme = value
}, { immediate: true })

function updateActiveHeading() {
  scrollFrame = 0
  const headings = article.value?.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]') || []
  if (!headings.length) return

  const activationLine = Math.min(140, window.innerHeight * 0.25)
  let current = headings[0]
  for (const heading of headings) {
    if (heading.getBoundingClientRect().top > activationLine) break
    current = heading
  }

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    current = headings[headings.length - 1]
  }

  if (activeHeadingId.value === current.id) return
  activeHeadingId.value = current.id
  nextTick(() => {
    tocNav.value?.querySelector('a[aria-current="location"]')?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    })
  })
}

function scheduleActiveHeadingUpdate() {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateActiveHeading)
}

function selectHeading(id) {
  activeHeadingId.value = id
  if (window.innerWidth < 768) sidebarOpen.value = false
}

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
  syncScheduledTheme()
  themeTimer = window.setInterval(syncScheduledTheme, 60 * 1000)
  renderDiagrams()
  updateActiveHeading()
  window.addEventListener('scroll', scheduleActiveHeadingUpdate, { passive: true })
  window.addEventListener('resize', scheduleActiveHeadingUpdate)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scheduleActiveHeadingUpdate)
  window.removeEventListener('resize', scheduleActiveHeadingUpdate)
  window.clearInterval(themeTimer)
  if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
})
</script>

<template>
  <div class="reader" :class="{ 'reader--sidebar-open': sidebarOpen }">
    <button
      class="theme-button"
      type="button"
      :aria-label="theme === 'light' ? '切换到夜间模式' : '切换到白天模式'"
      :title="theme === 'light' ? '切换到夜间模式' : '切换到白天模式'"
      @click="toggleTheme"
    >
      <svg v-if="theme === 'light'" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.25 15.25A8.5 8.5 0 0 1 8.75 3.75a8.5 8.5 0 1 0 11.5 11.5Z" />
      </svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3.75" />
        <path d="M12 2.75v2M12 19.25v2M21.25 12h-2M4.75 12h-2M18.54 5.46l-1.42 1.42M6.88 17.12l-1.42 1.42M18.54 18.54l-1.42-1.42M6.88 6.88 5.46 5.46" />
      </svg>
    </button>

    <button
      class="menu-button"
      type="button"
      :aria-expanded="sidebarOpen"
      aria-controls="document-toc"
      :aria-label="sidebarOpen ? '收起目录' : '展开目录'"
      @click="sidebarOpen = !sidebarOpen"
    >
      <svg v-if="sidebarOpen" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.75" y="4.25" width="16.5" height="15.5" rx="3" />
        <path d="M9.25 4.5v15M15.25 9.25 12.5 12l2.75 2.75" />
      </svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.75" y="4.25" width="16.5" height="15.5" rx="3" />
        <path d="M9.25 4.5v15M12.75 9.25 15.5 12l-2.75 2.75" />
      </svg>
    </button>

    <aside id="document-toc" class="sidebar" :aria-hidden="!sidebarOpen">
      <div class="sidebar__header">
        <p>目录</p>
        <span>{{ rendered.headings.length }} 个章节</span>
      </div>
      <nav v-if="rendered.headings.length" ref="tocNav" aria-label="文档目录">
        <a
          v-for="heading in rendered.headings"
          :key="heading.id"
          :href="`#${heading.id}`"
          :class="[`toc-level-${heading.level}`, { 'is-active': activeHeadingId === heading.id }]"
          :aria-current="activeHeadingId === heading.id ? 'location' : undefined"
          @click="selectHeading(heading.id)"
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
