import { useEffect, useState } from 'react'
import { AppHeader } from '@/components/AppHeader'
import { StudioFrame, type StudioMode } from '@/features/studio/StudioFrame'
import { useTheme } from '@/hooks/use-theme'
import './App.css'

const readMode = (): StudioMode =>
  window.location.pathname.replace(/\/$/, '') === '/walkthrough' ? 'walkthrough' : 'studio'

function App() {
  const [mode, setMode] = useState<StudioMode>(readMode)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const onPopState = () => setMode(readMode())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (nextMode: StudioMode) => {
    window.history.pushState(null, '', nextMode === 'studio' ? '/' : '/walkthrough')
    setMode(nextMode)
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#workspace">Skip to workspace</a>
      <AppHeader mode={mode} onNavigate={navigate} theme={theme} onToggleTheme={toggleTheme} />
      {mode === 'studio' && (
        <div className="prototype-notice" role="note">
          <span className="notice-dot" aria-hidden="true" />
          <p><strong>Interactive prototype.</strong> Try the sample workbook. Video rendering and delivery are simulated; the manifest CSV is real.</p>
          <a href="/samples/riddles-100.xlsx" download>Get the sample sheet ↗</a>
        </div>
      )}
      <main id="workspace" className="workspace" tabIndex={-1}>
        <StudioFrame mode={mode} theme={theme} />
      </main>
    </div>
  )
}

export default App
