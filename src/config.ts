import type { PngOptions, JpegOptions, WebpOptions } from 'sharp'

import {
  JPEG_QUALITY,
  JPEG_PROGRESSIVE,
  PNG_QUALITY,
  WEBP_QUALITY
} from './constants'

interface Config {
  jpeg: JpegOptions
  png: PngOptions
  webp: WebpOptions
}

const getConfig = () => {
  const config: Config = {
    jpeg: { quality: JPEG_QUALITY, progressive: JPEG_PROGRESSIVE },
    png: { quality: PNG_QUALITY },
    webp: { quality: WEBP_QUALITY }
  }

  console.log('->> Using config:', JSON.stringify(config, null, '  '))

  return config
}

export default getConfig
