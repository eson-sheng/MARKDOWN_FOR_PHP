export const diagramConfig = {
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'base',
  look: 'handDrawn',
  handDrawnSeed: 42,
  fontFamily: '"Fira Code", "JetBrains Mono", "PingFang SC", "Microsoft YaHei", sans-serif',
  // Palette adapted from 不惑_: https://juejin.cn/post/7525324923222818826
  themeVariables: {
    background: 'transparent',
    primaryColor: '#fbcfe8',
    primaryTextColor: '#4b5563',
    primaryBorderColor: '#f472b6',
    lineColor: '#f9a8d4',
    textColor: '#4b5563',
    mainBkg: '#a5f3fc',
    secondaryColor: '#fde68a',
    tertiaryColor: '#c4b5fd',
    nodeBorder: '#fda4af',
    nodeTextColor: '#1f2937',
    fontFamily: '"Fira Code", "JetBrains Mono", "PingFang SC", "Microsoft YaHei", sans-serif',
    fontSize: '15px',
    noteBkgColor: '#fef9c3',
    noteTextColor: '#78350f',
    actorBkg: '#d8b4fe',
    actorBorder: '#a78bfa',
    actorTextColor: '#4b5563',
    sequenceNumberColor: '#f472b6',
    classText: '#6b21a8',
    classBackground: '#fbcfe8',
    classBorder: '#d946ef',
    labelBoxBkgColor: '#fef3c7',
    labelBoxBorderColor: '#facc15',
    edgeLabelBackground: 'transparent',
    clusterBkg: '#faf5ff',
    clusterBorder: '#c4b5fd',
  },
  flowchart: { curve: 'basis', nodeSpacing: 28, rankSpacing: 40, padding: 14, htmlLabels: true },
}

export function decorateDiagram(container) {
  const svg = container.querySelector('svg')
  const bounds = svg?.viewBox.baseVal
  if (bounds?.width > 0 && bounds.height > 0) {
    // Mermaid emits width="100%"; use its actual geometry to avoid enlarging small diagrams.
    const scale = Math.min(0.9, 620 / bounds.width, 520 / bounds.height)
    svg.style.width = `${Math.round(bounds.width * scale)}px`
    svg.style.maxWidth = '100%'
  }
  // Rough.js draws separate paths for the colored hatching and pencil outline.
  // Preserve their geometry and paint roles while allowing live theme changes.
  const fills = {
    '#a5f3fc': '--diagram-hatch',
    '#fbcfe8': '--diagram-pink',
    '#fde68a': '--diagram-yellow',
    '#c4b5fd': '--diagram-purple',
  }
  container.querySelectorAll('.rough-node path').forEach((path) => {
    const stroke = path.getAttribute('stroke')
    const fill = path.getAttribute('fill')
    if (stroke && stroke !== 'none') {
      const paint = fills[stroke.toLowerCase()] || '--diagram-border'
      path.style.setProperty('stroke', `var(${paint})`, 'important')
      if (fills[stroke.toLowerCase()]) {
        path.classList.add('diagram-hatching')
        // Preserve Rough.js's original double pencil strokes and irregular
        // spacing; this is the texture used by the reference hand-drawn look.
      }
    }
    if (fill && fill !== 'none') {
      path.style.setProperty('fill', `var(${fills[fill.toLowerCase()] || '--diagram-hatch'})`, 'important')
    }
  })
}
