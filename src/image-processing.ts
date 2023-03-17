import { statSync, writeFileSync } from 'fs'
import path from 'path'
import sharp from 'sharp'

import { REPO_DIRECTORY, EXTENSION_TO_SHARP_FORMAT_MAPPING } from './constants'

import getConfig from './config'

const processImages = async (
  imagePaths: string[]
): Promise<ProcessedImagesResult> => {
  console.log(
    'To turn on DEBUG level logging for image-actions, see this reference: https://docs.github.com/en/actions/managing-workflow-runs/enabling-debug-logging'
  )
  console.log('::debug:: === Sharp library info ===')
  console.log('::debug::', sharp.versions)
  console.log('::debug::', sharp.format)
  console.log('::debug:: === Sharp library info ===')

  const config = getConfig()

  const optimisedImages: ProcessedImage[] = []
  const unoptimisedImages: ProcessedImage[] = []

  for await (const imgPath of imagePaths) {
    const extension = path.extname(imgPath)
    const sharpFormat =
      EXTENSION_TO_SHARP_FORMAT_MAPPING[extension.toLowerCase()]

    if (!sharpFormat) {
      console.log('::warning::', imgPath, 'is not a supported image format')
      continue
    }

    const options = config[sharpFormat]
    const beforeStats = statSync(imgPath).size

    try {
      const { data, info } = await sharp(imgPath)
        .toFormat(sharpFormat, options)
        .toBuffer({ resolveWithObject: true })

      console.log(
        '    - Processing:',
        imgPath,
        `config=${JSON.stringify(options)}`,
        `output=${JSON.stringify(info)}`
      )

      // Remove the /github/home/ path (including the slash)
      const name = imgPath.replace(REPO_DIRECTORY, '').replace(/\//, '')
      const afterStats = info.size
      const percentChange = (afterStats / beforeStats) * 100 - 100

      // Add a flag to tell if the optimisation was worthwhile
      const compressionWasSignificant = percentChange < -1

      const processedImage: ProcessedImage = {
        name,
        path: imgPath,
        beforeStats,
        afterStats,
        percentChange,
        compressionWasSignificant
      }

      if (compressionWasSignificant) {
        // Only write if there was a worthwhile optimisation
        writeFileSync(imgPath, data)

        // Add to optimisedImages array for reporting
        optimisedImages.push(processedImage)
      } else {
        // Add to unoptimisedImages array for reporting
        unoptimisedImages.push(processedImage)
      }
    } catch (e) {
      console.error('::error:: ', e, imgPath)
      continue
    }
  }

  const metrics = await calculateOverallMetrics(optimisedImages)

  return {
    optimisedImages,
    unoptimisedImages,
    metrics
  }
}

const calculateOverallMetrics = async (
  images: ProcessedImage[]
): Promise<ProcessedImageMetrics> => {
  let bytesBeforeCompression = 0
  let bytesAfterCompression = 0

  for await (const image of images) {
    if (image.compressionWasSignificant) {
      bytesBeforeCompression += image.beforeStats
      bytesAfterCompression += image.afterStats
    }
  }

  const bytesSaved = bytesBeforeCompression - bytesAfterCompression
  const percentChange =
    (bytesAfterCompression / bytesBeforeCompression) * 100 - 100

  return {
    bytesSaved,
    percentChange
  }
}

export default processImages
