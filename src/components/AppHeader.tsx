import { Film, Github, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { StudioMode } from '@/features/studio/StudioFrame'
import type { Theme } from '@/hooks/use-theme'

type Props = {
  mode: StudioMode
  theme: Theme
  onNavigate: (mode: StudioMode) => void
  onToggleTheme: () => void
}

export function AppHeader({ mode, theme, onNavigate, onToggleTheme }: Props) {
  return (
    <header className="site-header">
      <a className="wordmark" href="/" onClick={(event) => {
        if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          event.preventDefault()
          onNavigate('studio')
        }
      }}>
        <span className="wordmark-icon"><Film size={17} aria-hidden="true" /></span>
        Rowcast
      </a>
      <nav className="app-links" aria-label="Rowcast">
        {(['studio', 'walkthrough'] as const).map((item) => (
          <a key={item} className="app-link" href={item === 'studio' ? '/' : '/walkthrough'}
            aria-current={mode === item ? 'page' : undefined}
            onClick={(event) => {
              if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                event.preventDefault()
                onNavigate(item)
              }
            }}>
            {item === 'studio' ? 'Studio' : 'Guided walkthrough'}
          </a>
        ))}
      </nav>
      <div className="header-tools">
        <Button variant="ghost" size="icon" asChild>
          <a href="https://github.com/yagyesh-bobde/rowcast" target="_blank" rel="noreferrer" aria-label="Rowcast on GitHub"><Github aria-hidden="true" /></a>
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
          {theme === 'light' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
        </Button>
      </div>
    </header>
  )
}
