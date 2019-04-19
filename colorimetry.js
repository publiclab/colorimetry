const ImageSequencer = require('image-sequencer')

const testSequencer = ImageSequencer({ ui : false })
const resultSequencer = ImageSequencer({ ui : false })
const testOptions = {
          x: '130',
          y: '115',
          w: '50',
          h: '50'
      }
const resultOptions = {
          x: '550',
          y: '115',
          w: '50',
          h: '50'
      }

testSequencer.loadImages('images/test.jpg')
testSequencer.addSteps('crop', resultOptions)
testSequencer.addSteps('average')
testSequencer.run(function cb(out) {
  console.log(testSequencer.steps[2].output.src)
})

resultSequencer.loadImages('images/test.jpg')
resultSequencer.addSteps('crop', resultOptions)
resultSequencer.addSteps('average')
resultSequencer.run(function cb(out) {
  console.log(resultSequencer.steps[2].output.src)
})