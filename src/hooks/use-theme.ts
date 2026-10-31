import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

function readTheme(): Theme {
  try {
    const value = localStorage.getItem('rowcast:theme')
    if (value === 'light' || value === 'dark') return value
  } catch { /* Theme still works when storage is unavailable. */ }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
    try { localStorage.setItem('rowcast:theme', theme) } catch { /* Optional preference. */ }
  }, [theme])
  return { theme, toggleTheme: () => setTheme((value) => value === 'light' ? 'dark' : 'light') }
}
