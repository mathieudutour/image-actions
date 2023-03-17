const results = {
  optimisedImages: [
    {
      name: 'icon.png',
      path: '__tests__/test-images/icon.png',
      beforeStats: 8914,
      afterStats: 3361,
      percentChange: -62.29526587390622,
      compressionWasSignificant: true
    },
    {
      name: 'roo.jpg',
      path: '__tests__/test-images/roo.jpg',
      beforeStats: 485742,
      afterStats: 468895,
      percentChange: -3.592915258213452,
      compressionWasSignificant: true
    }
  ],
  unoptimisedImages: [
    {
      name: 'optimised-image.png',
      path: '__tests__/test-images/optimised-image.png',
      beforeStats: 3361,
      afterStats: 3361,
      percentChange: 0,
      compressionWasSignificant: false
    },
    {
      name: 'another-optimised-image.png',
      path: '__tests__/test-images/another-optimised-image.png',
      beforeStats: 3361,
      afterStats: 3361,
      percentChange: 0,
      compressionWasSignificant: false
    }
  ],
  metrics: {
    bytesSaved: 5553,
    percentChange: -62.29526587390622
  }
}

const markdown = require('../dist/github-markdown').default

test('writes the markdown report', async () => {
  const markdownResult = await markdown({
    processingResults: results
  })

  expect(markdownResult).toMatchSnapshot()
})
