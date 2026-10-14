import hljs from 'highlight.js'

// Extra fence names commonly used in Markdown, in addition to built-in aliases.
const aliases = { curl: 'bash', shellscript: 'bash', vue: 'xml', svelte: 'xml', 'objective-c': 'objectivec', 'c++': 'cpp', 'c#': 'csharp' }
const names = { html: 'HTML', htm: 'HTML', vue: 'Vue', svelte: 'Svelte', jsx: 'JSX', tsx: 'TSX', curl: 'Bash' }
const plainNames = new Set(['text', 'txt', 'plaintext', 'plain', 'none', 'nohighlight'])

export function highlightCode(raw, declared) {
  const requested = declared?.toLowerCase()
  if (plainNames.has(requested)) return { label: '纯文本', html: null }
  // Preserve a declared language; infer cURL before generic auto-detection.
  const language = aliases[requested] || requested || (/^\s*(?:\$\s*)?curl\b/m.test(raw) ? 'bash' : undefined)
  const grammar = language && hljs.getLanguage(language)
  if (language && !grammar) return { label: declared, html: null }
  const result = language
    ? hljs.highlight(raw, { language, ignoreIllegals: true })
    : hljs.highlightAuto(raw)
  const detected = grammar || hljs.getLanguage(result.language || '')
  return {
    label: names[requested] || detected?.name || result.language || '纯文本',
    html: result.value,
  }
}
