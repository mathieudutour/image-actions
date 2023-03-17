import { readFileSync } from 'fs'

import { GITHUB_EVENT_PATH } from './constants'

const event = () => {
  const buffer = readFileSync(GITHUB_EVENT_PATH)
  return JSON.parse(buffer.toString())
}

export default event
