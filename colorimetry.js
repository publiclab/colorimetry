const ImageSequencer = require('image-sequencer')
const base64 = require('base64-img')

const subject = ImageSequencer()
const result = ImageSequencer()
const target = 'outputs'
const subjectOptions = { x: '130', y: '115', w: '50', h: '50' }
const resultOptions = { x: '550', y: '115', w: '50', h: '50' }

subject.loadImages('images/test.jpg')
subject.addSteps('crop', subjectOptions)
subject.addSteps('average')
subject.run(function cb(out) {
  let subjectOutput = subject.steps[2].output.src
  base64.imgSync(subjectOutput, target, 'subject')
})

result.loadImages('images/test.jpg')
result.addSteps('crop', resultOptions)
result.addSteps('average')
result.run(function cb(out) {
  let resultOutput = result.steps[2].output.src
  base64.imgSync(resultOutput, target, 'result')
})