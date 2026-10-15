import test from 'node:test'
import assert from 'node:assert/strict'

import { experienceTimeline } from '../data.js'

test('experience timeline lists the four resume roles newest first', () => {
  assert.equal(experienceTimeline.length, 4)
  assert.deepEqual(
    experienceTimeline.map((item) => item.period),
    ['2026.03 — 2026.07', '2024.10 — 2025.12', '2023.07 — 2024.06', '2018.08 — 2023.04'],
  )
  assert.ok(experienceTimeline.every((item) => item.company && item.summary && item.tags.length >= 3))
})
