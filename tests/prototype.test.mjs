import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { JSDOM, VirtualConsole } from 'jsdom'

const html = await readFile(new URL('../public/prototype.html', import.meta.url), 'utf8')

function openPrototype(t) {
  const errors = [], timers = new Map(), downloads = []
  let nextTimer = 1
  const console = new VirtualConsole()
  console.on('jsdomError', (error) => errors.push(error.message))
  const dom = new JSDOM(html, {
    url: 'https://rowcast.test/prototype.html?mode=studio&theme=light',
    runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: console,
    beforeParse(window) {
      window.setInterval = (fn) => { const id = nextTimer++; timers.set(id, fn); return id }
      window.clearInterval = (id) => timers.delete(id)
      window.Blob = Blob
      window.URL.createObjectURL = (blob) => { downloads.push(blob); return 'blob:manifest' }
      window.URL.revokeObjectURL = () => {}
      window.HTMLAnchorElement.prototype.click = () => {}
    },
  })
  const { window } = dom, document = window.document
  const query = (selector) => {
    const element = document.querySelector(selector)
    assert.ok(element, `Expected ${selector}`)
    return element
  }
  const click = (selector) => {
    const element = query(selector)
    assert.equal(element.disabled === true, false, `${selector} is enabled`)
    element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
  }
  const runTimers = () => {
    for (let i = 0; i < 300 && timers.size; i++) {
      for (const fn of [...timers.values()]) fn()
    }
    assert.equal(timers.size, 0, 'Batch terminates')
  }
  t.after(() => { window.close(); assert.deepEqual(errors, []) })
  return { window, document, query, click, runTimers, downloads }
}

test('appearance messages preserve the session and reject other origins', (t) => {
  const { window, document, query, click } = openPrototype(t)
  assert.equal(document.documentElement.dataset.mode, 'studio')
  click('[data-act="pickTpl"]')
  click('.lane.sc .clip[data-i="2"]')
  const message = (origin) => window.dispatchEvent(new window.MessageEvent('message', {
    origin, source: window.parent,
    data: { type: 'rowcast:appearance', mode: 'walkthrough', theme: 'dark' },
  }))
  message('https://another.test')
  assert.equal(document.documentElement.dataset.mode, 'studio')
  message(window.location.origin)
  assert.equal(document.documentElement.dataset.mode, 'walkthrough')
  assert.equal(document.documentElement.dataset.theme, 'dark')
  assert.equal(query('.tr-s[data-i="2"]').getAttribute('aria-expanded'), 'true')
})

test('review, bind, fix, batch and retry retain the original batch manifest', async (t) => {
  const { window, query, click, runTimers, downloads } = openPrototype(t)
  click('[data-act="pickTpl"]')
  click('[data-act="go"][data-v="data"]')
  click('[data-act="import"]')
  assert.match(query('.dsum').textContent, /3 rows to fix/)
  assert.match(query('.dsum').textContent, /97 videos possible/)
  click('[data-act="go"][data-v="connect"]')
  click('[data-act="acceptAll"]')
  assert.match(query('[data-v="connect"]').textContent, /6\/8/)
  click('[data-act="field"][data-f="cd"]')
  click('[data-act="col"][data-c="question"]')
  assert.match(query('#view').textContent, /needs a number of seconds/)
  click('[data-act="col"][data-c="countdown_seconds"]')
  click('[data-act="field"][data-f="hl"]')
  click('[data-act="col"][data-c="correct_option"]')
  assert.match(query('[data-v="connect"]').textContent, /8\/8/)
  click('[data-act="go"][data-v="preview"]')
  for (const row of [37, 58]) {
    click(`[data-act="row"][data-n="${row}"]`)
    query('#fixQ').value = 'What gets wetter as it dries?'
    query('#fixQ').dispatchEvent(new window.Event('input', { bubbles: true }))
    click('[data-act="fixQ"]')
  }
  click('[data-act="row"][data-n="91"]')
  click('[data-act="exclude"]')
  click('[data-act="go"][data-v="export"]')
  assert.match(query('[data-act="start"]').textContent, /99 videos/)
  click('[data-act="start"]')
  runTimers()
  assert.match(query('[data-act="retry"]').textContent, /Retry 2 failed only/)
  assert.equal(window.document.querySelectorAll('.tile.done').length, 97)

  // A later edit must not change the input revision or duration of this batch.
  click('[data-act="go"][data-v="template"]')
  click('.lane.sc .clip[data-i="0"]')
  click('.inspp [data-act="dur"][data-d="1"]')
  click('[data-act="go"][data-v="export"]')
  assert.match(query('#view').textContent, /frozen/i)
  click('[data-act="retry"]')
  runTimers()
  assert.equal(window.document.querySelectorAll('.tile.done').length, 99)
  click('[data-act="manifest"]')
  assert.equal(downloads.length, 1)
  const lines = (await downloads[0].text()).trim().split('\n')
  assert.equal(lines.length, 101, 'Every source row is included, plus the header')
  const records = lines.slice(1).map((line) => line.split(','))
  assert.equal(records.filter((row) => row[2] === 'done').length, 99)
  assert.equal(records.filter((row) => row[2] === 'excluded').length, 1)
  assert.equal(records[0][4], '15', 'R001 duration is frozen before the scene edit')
})
