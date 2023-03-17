import { readFile } from 'fs/promises'

import { GITHUB_EVENT_PATH } from './constants'

const event = async () => {
  const buffer = await readFile(GITHUB_EVENT_PATH)
  return JSON.parse(buffer.toString())
}

export default event
