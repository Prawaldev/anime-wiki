export function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, '')
}

export function esc(s: string): string {
  const d = document.createElement('div')
  d.textContent = s
  return d.innerHTML
}
