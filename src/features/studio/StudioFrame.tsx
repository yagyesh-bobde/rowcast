import { useEffect, useRef } from 'react'
import type { Theme } from '@/hooks/use-theme'

export type StudioMode = 'studio' | 'walkthrough'

export function StudioFrame({ mode, theme }: { mode: StudioMode; theme: Theme }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const initialSource = useRef(`/prototype.html?mode=${mode}&theme=${theme}`)
  const sync = () => frame.current?.contentWindow?.postMessage({
    type: 'rowcast:appearance', mode, theme,
  }, window.location.origin)

  useEffect(() => {
    frame.current?.contentWindow?.postMessage({
      type: 'rowcast:appearance', mode, theme,
    }, window.location.origin)
  }, [mode, theme])

  return <iframe ref={frame} className="studio-frame" src={initialSource.current}
    title="Rowcast spreadsheet-to-video workspace" onLoad={sync} />
}
