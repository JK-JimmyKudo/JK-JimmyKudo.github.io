#!/usr/bin/env node
/**
 * 用本机 Chrome 无头模式渲染本地页面并核对结果 + 截图。
 *
 * 用法：
 *   node scripts/verify-page.mjs                                  # 项目区块：卡片数与封面加载
 *   node scripts/verify-page.mjs --hash '#project/beichen'        # 项目详情页：标题/分类/时间/角色/经历条数
 *   node scripts/verify-page.mjs --hash '#project/beichen' --width 420 --out /tmp/detail-mobile.png
 *
 * 前置：本地 dev server 已在跑（cd portfolio && npm run dev -- --port 5175）。
 * 说明：截图前会先滚到页面底部再回顶部，触发 .reveal 显现动画，否则视口外的区块是透明的。
 */
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { setTimeout as delay } from 'node:timers/promises'

const args = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = args.indexOf(name)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}

const CHROME = arg('--chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
const PORT = Number(arg('--port', 9340))
const BASE = arg('--url', 'http://localhost:5175/')
const HASH = arg('--hash', '')
const WIDTH = Number(arg('--width', 1440))
const OUT = arg('--out', '/tmp/verify-page.png')
const NO_SHOT = args.includes('--no-shot')
const isDetail = /^#project\//.test(HASH)
const SELECTOR = arg('--selector', isDetail ? '.detail' : '#work')

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--disable-extensions', '--hide-scrollbars', `--remote-debugging-port=${PORT}`,
  `--user-data-dir=/tmp/chrome-verify-${PORT}`, '--window-size=1440,1000', 'about:blank',
], { stdio: 'ignore' })

const sleep = (ms) => delay(ms)

async function findTarget() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
      if (page) return page
    } catch {}
    await sleep(250)
  }
  throw new Error('连接不上 Chrome 调试端口，检查是否有残留的 headless 进程占用该端口')
}

const target = await findTarget()
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, { once: true })
  ws.addEventListener('error', reject, { once: true })
})

let seq = 0
const pending = new Map()
const events = []
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id)
    pending.delete(msg.id)
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)
  } else if (msg.method) {
    events.push(msg.method)
  }
})
const send = (method, params = {}) => new Promise((resolve, reject) => {
  seq += 1
  pending.set(seq, { resolve, reject })
  ws.send(JSON.stringify({ id: seq, method, params }))
})
const evaluate = async (expression) => {
  const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (res.exceptionDetails) {
    console.error('页面内报错:', res.exceptionDetails.exception?.description || '')
    return undefined
  }
  return res.result.value
}

await send('Page.enable')
await send('Runtime.enable')
if (WIDTH !== 1440) {
  await send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: 1000, deviceScaleFactor: 1, mobile: false })
}
await send('Page.navigate', { url: BASE + HASH })
for (let i = 0; i < 60 && !events.includes('Page.loadEventFired'); i += 1) await sleep(200)
await sleep(2600)

// 触发视口外区块的显现动画
await evaluate('window.scrollTo(0, document.body.scrollHeight)')
await sleep(1200)
await evaluate('window.scrollTo(0, 0)')
await sleep(900)

const facts = await evaluate(`(() => {
  const out = { url: window.location.hash || '(首页)', width: window.innerWidth }
  const carousel = document.querySelector('.circular-carousel')
  if (carousel) {
    const imgs = [...carousel.querySelectorAll('img')]
    const uniq = [...new Set(imgs.map((i) => i.getAttribute('src')))]
    out.cards = document.querySelectorAll('[data-cc-index]').length
    out.covers = uniq.map((src) => ({ src, ok: imgs.find((i) => i.getAttribute('src') === src).naturalWidth > 0 }))
  }
  const detail = document.querySelector('.detail')
  if (detail) {
    out.project = {
      index: document.querySelector('.detail-index')?.textContent.trim(),
      title: document.querySelector('.detail-title')?.textContent.trim(),
      meta: Object.fromEntries([...document.querySelectorAll('.detail-meta div')].map((d) => [
        d.querySelector('dt').textContent.trim(), d.querySelector('dd').textContent.trim()])),
      tags: [...document.querySelectorAll('.detail-tags span')].map((s) => s.textContent.trim()),
      sections: [...document.querySelectorAll('.detail-section h2')].map((h) => h.textContent.trim()),
      experienceCount: document.querySelectorAll('.detail-list li').length,
      coverLoaded: (document.querySelector('.detail-cover img')?.naturalWidth || 0) > 0,
    }
  }
  const el = document.querySelector(${JSON.stringify(SELECTOR)})
  if (el) {
    const r = el.getBoundingClientRect()
    out.clip = { x: Math.max(0, r.left), y: r.top + window.scrollY, width: Math.min(r.width, window.innerWidth), height: r.height }
  }
  return out
})()`)

const { clip, ...report } = facts || {}
console.log(JSON.stringify(report, null, 2))

if (clip && !NO_SHOT) {
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { ...clip, scale: 1 } })
  writeFileSync(OUT, Buffer.from(shot.data, 'base64'))
  console.log('截图:', OUT)
}

ws.close()
chrome.kill('SIGKILL')
