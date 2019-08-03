function changeScreen(event) {
    var op = event.target.className;
    if (op.includes("btn-next")) {
      $(event.target).parents(".screen").fadeOut("slow");
      $(event.target).parents(".screen").next().fadeIn("slow");
    } else if (op.includes("btn-back")) {
      $(event.target).parents(".screen").fadeOut("slow");
      $(event.target).parents(".screen").prev().fadeIn("slow");
    } else if (op.includes("btn-over")) {
      $(event.target).parents(".screen").fadeOut("slow");
      $(".container-2").fadeIn("slow");
    }
  }

  let dropArea = document.getElementById('drop-area');
  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(
    eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false)
    })

  function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  ;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
  })


  ;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
  })

  function highlight(e) {
    dropArea.classList.add('highlight')
  }

  function unhighlight(e) {
    dropArea.classList.remove('highlight')
  }

  dropArea.addEventListener('drop', handleDrop, false)

  function handleDrop(e) {
    let dt = e.dataTransfer
    let files = dt.files

    handleFiles(files)
  }
  function handleFiles(files) {
([...files]).forEach(previewFile)
}

function previewFile(file) {
let reader = new FileReader()
reader.readAsDataURL(file)
let img;
reader.onloadend = function() {
  img = document.createElement('img')
  img.setAttribute("id", "sel");
  img.src = reader.result
  $("#drop-area").parents(".screen").fadeOut("slow");
  $("#gallery").parents(".screen").fadeIn("slow",displayPreview);
}
function displayPreview(){
  document.getElementById('gallery').appendChild(img)
  var sequencer = imp.ImageSequencer({inBrowser:false})
  
  $('img#sel').imgAreaSelect({
      handles: true,
      onSelectEnd: cb
  });
  function cb(img, selection) {
    sequencer.loadImage(img.src, function(){
      this.addSteps('crop{x:'+selection.x1+'|y:'+selection.y1+'|w:'+selection.width+'|h:'+selection.height+'},average').run(function (out){
        imp.getPixels(out, function (err, pixels) {
          var i = 0, sum = [0, 0, 0, 0];
      while (i < pixels.data.length) {
        sum[0] += pixels.data[i++];
        sum[1] += pixels.data[i++];
        sum[2] += pixels.data[i++];
        sum[3] += pixels.data[i++];
      }

      let divisor = pixels.data.length / 4;

      sum[0] = Math.floor(sum[0] / divisor);
      console.log("red channel: "+sum[0])
        })
      })
      

    })
    
}
}
}
