import { expect, test } from 'bun:test'

import { add } from './main.ts'

test('add', () => {
  expect(add(2, 3)).toBe(5)
})
