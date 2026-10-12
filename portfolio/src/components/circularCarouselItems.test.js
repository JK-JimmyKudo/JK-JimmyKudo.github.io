import test from 'node:test'
import assert from 'node:assert/strict'

import { createCarouselItems } from './circularCarouselItems.js'

test('maps every portfolio project into a carousel item without losing its identity', () => {
  const projects = [
    {
      index: '01',
      title: '智小伴 · AI 智能体',
      category: 'AI 应用',
      cover: '/images/project-ai.svg',
    },
  ]

  assert.deepEqual(createCarouselItems(projects), [
    {
      src: '/images/project-ai.svg',
      alt: '智小伴 · AI 智能体项目封面',
      title: '智小伴 · AI 智能体',
      subtitle: '01 · AI 应用',
    },
  ])
})
