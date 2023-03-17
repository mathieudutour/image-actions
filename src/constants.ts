import { ImageKind } from './enums'

const GITHUB_EVENT_NAME = process.env['GITHUB_EVENT_NAME']
const GITHUB_EVENT_PATH = process.env['GITHUB_EVENT_PATH']
const GITHUB_REPOSITORY = process.env['GITHUB_REPOSITORY']

const REPO_DIRECTORY = process.env['GITHUB_WORKSPACE']

const JPEG_QUALITY = parseInt(process.env['INPUT_JPEGQUALITY']) || 80
const PNG_QUALITY = parseInt(process.env['INPUT_PNGQUALITY']) || 80
const WEBP_QUALITY = parseInt(process.env['INPUT_WEBPQUALITY']) || 80
const JPEG_PROGRESSIVE = process.env['INPUT_JPEGPROGRESSIVE'] === 'true'

if (!REPO_DIRECTORY) {
  console.log('::error:: There is no GITHUB_WORKSPACE environment variable')
  process.exit(1)
}

interface SharpExtensionFormat {
  [key: string]: ImageKind
}

const EXTENSION_TO_SHARP_FORMAT_MAPPING: SharpExtensionFormat = {
  '.png': ImageKind.Png,
  '.jpeg': ImageKind.Jpeg,
  '.jpg': ImageKind.Jpeg,
  '.webp': ImageKind.Webp
}

export {
  GITHUB_EVENT_NAME,
  GITHUB_EVENT_PATH,
  GITHUB_REPOSITORY,
  REPO_DIRECTORY,
  EXTENSION_TO_SHARP_FORMAT_MAPPING,
  JPEG_QUALITY,
  JPEG_PROGRESSIVE,
  PNG_QUALITY,
  WEBP_QUALITY
}
