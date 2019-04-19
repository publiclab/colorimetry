const ImageSequencer = require('image-sequencer')
const base64 = require('base64-img')

const subject = ImageSequencer()
const result = ImageSequencer()
const target = 'outputs'

// hardcoded crop values (for now)
const subjectOptions = { x: '130', y: '115', w: '50', h: '50' }
const resultOptions = { x: '550', y: '115', w: '50', h: '50' }

let subjectRedChannel = ''
let resultRedChannel = ''
let imageRatio = ''

// returns promise to subject image
var subjectPromise = new Promise((resolve, reject) => {
    subject.loadImage('images/test.jpg')
    subject.addSteps('crop', subjectOptions)
    subject.addSteps('average')
    subject.run(function cb(out) {
      resolve(subject.steps[2])
    })
})

// returns promise to result image
var resultPromise = new Promise((resolve, reject) => {
    result.loadImage('images/test.jpg')
    result.addSteps('crop', resultOptions)
    result.addSteps('average')
    result.run(function cb(out) {
      resolve(result.steps[2])
    })
})

Promise.all([subjectPromise, resultPromise]).then(function(steps) {
  // Extract red channel average value for both ImageSequencer
  subjectRedChannel = parseInt(steps[0].options.step.metadata.averages[0])
  resultRedChannel = parseInt(steps[1].options.step.metadata.averages[0])

  // Write both averaged images to output folder
  let subjectOutput = steps[0].output.src
  let resultOutput = steps[1].output.src
  base64.imgSync(subjectOutput, target, 'subject')
  base64.imgSync(resultOutput, target, 'result')

  // TODO: Find better parameter for colorimetry standardization
  imageRatio = subjectRedChannel/resultRedChannel
  console.log(imageRatio)
})