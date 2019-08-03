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
  var sequencer = ImageSequencer()
  console.log(sequencer)

  $('img#sel').imgAreaSelect({
      handles: true,
      onSelectEnd: function (img, selection) {
        
      console.log('width: ' + selection.width + '; height: ' + selection.height);
  }
  });
}
}
