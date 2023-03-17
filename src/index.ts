import * as core from '@actions/core'

import generateMarkdownReport from './github-markdown'
import processImages from './image-processing'

const run = async (): Promise<void> => {
  console.log('->> Locating images…')

  const imagesPaths = core
    .getInput('images', {
      required: true,
      trimWhitespace: true
    })
    .split(',')
    .map(x => x.trim())

  const processingResults: ProcessedImagesResult = await processImages(
    imagesPaths
  )

  console.log(JSON.stringify(processingResults, null, 2))

  // If nothing was optimised, bail out.
  if (!processingResults.optimisedImages.length) {
    console.log('::warning:: Nothing left to optimise. Stopping…')
    return
  }

  // Generate markdown report, so that it's exported to Action output
  console.log('->> Generating markdown…')
  await generateMarkdownReport({ processingResults: processingResults })
}

export default run
