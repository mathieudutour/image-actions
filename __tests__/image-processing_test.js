const path = require('path')
const fs = require('fs').promises

const EXAMPLE_IMAGES_DIR = `${process.cwd()}/__tests__/example-images`
const TMP_TEST_IMAGES_DIR = `${process.cwd()}/__tests__/test-images`

const EXAMPLE_IMAGES = [
  'icon.png',
  'roo.webp',
  'roo.jpg',
  'optimised-image.png'
]

const IMAGE_PATHS = EXAMPLE_IMAGES.map(image =>
  path.join(TMP_TEST_IMAGES_DIR, image)
)

beforeEach(async () => {
  try {
    await fs.mkdir(TMP_TEST_IMAGES_DIR)
  } catch (e) {
    console.log(TMP_TEST_IMAGES_DIR, 'already exists')
  }

  // Copy in reference images for stats
  for await (const image of EXAMPLE_IMAGES) {
    await fs.copyFile(
      path.join(EXAMPLE_IMAGES_DIR, image),
      path.join(TMP_TEST_IMAGES_DIR, image)
    )
  }
})

afterEach(async () => {
  for await (const image of EXAMPLE_IMAGES) {
    await fs.unlink(path.join(TMP_TEST_IMAGES_DIR, image))
  }
  await fs.rmdir(TMP_TEST_IMAGES_DIR)
})

const imageProcessing = require('../dist/image-processing').default

test('returns metrics for images', async () => {
  const results = await imageProcessing(IMAGE_PATHS)

  expect(results.metrics).toEqual({
    bytesSaved: expect.any(Number),
    percentChange: expect.any(Number)
  })
})

test('returns the correct number of optimised/untouched images', async () => {
  const results = await imageProcessing(IMAGE_PATHS)

  expect(results.optimisedImages).toHaveLength(2)
  expect(results.unoptimisedImages).toHaveLength(2)
})

test('returns images with stats', async () => {
  const results = await imageProcessing(IMAGE_PATHS)

  expect(results.optimisedImages[0]).toEqual({
    afterStats: expect.any(Number),
    beforeStats: expect.any(Number),
    compressionWasSignificant: true,
    name: expect.any(String),
    path: IMAGE_PATHS[0],
    percentChange: expect.any(Number)
  })
})
