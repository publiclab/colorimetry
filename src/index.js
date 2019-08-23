let left_red_channel, right_red_channel,img,ias;
let leftDrag = {
},
rightDrag = {
};

readyScript();

function addImgAreaSelect(){
  let ias = $('img#sel').imgAreaSelect({
    handles: true,
    instance:true,
    onSelectEnd: cb
  });
  return ias;
}


// Handles next button changes
function handleButtonNext(event){
  $(event.target).parents(".screen").fadeOut("slow");
  $(event.target).parents(".screen").next().fadeIn("slow");

  if($(event.target).parents(".screen").attr('class').includes("container-3")){
    document.getElementById('stepTwo').appendChild(img);
    $(".container-4 .btn-next").attr("disabled", true);
    // drag functionality
    ias = addImgAreaSelect();
  }
  else if($(event.target).parents(".screen").attr('class').includes("container-4")){
    var result = (left_red_channel-right_red_channel)*100/right_red_channel; // calculates final result
    var canvas = document.getElementById("result-canvas");
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var canvas = document.getElementById("result-canvas");
    var ctx = canvas.getContext("2d");
    ctx.rect(leftDrag.x,leftDrag.y,leftDrag.w,leftDrag.h);
    ctx.strokeStyle = 'red';
    ctx.stroke();
    ctx.rect(rightDrag.x,rightDrag.y,rightDrag.w,rightDrag.h);
    ctx.strokeStyle = 'red';
    ctx.stroke();
    $('.res-num').html(Math.round(result*100)/100+ " % DARKER");
  }
  if(ias){
    ias.cancelSelection();
  }
}

//Handles back button changes
function handleButtonBack(event){
  $(event.target).parents(".screen").fadeOut("slow");
    $(event.target).parents(".screen").prev().fadeIn("slow");
    if($(event.target).parents(".screen").attr('class').includes("container-5")){
      document.getElementById('stepTwo').appendChild(img);
      addImgAreaSelect();
      right_red_channel = undefined;
      $(".container-4 .btn-next").attr("disabled", true);
    }
    else if($(event.target).parents(".screen").attr('class').includes("container-4")){
      document.getElementById('gallery').appendChild(img);
      addImgAreaSelect();
      left_red_channel = undefined;
      $(".container-3 .btn-next").attr("disabled", true);
    }
    else if($(event.target).parents(".screen").attr('class').includes("container-3")){
      left_red_channel = undefined;
    right_red_channel = undefined;
    readyScript()
    }
}


//handles start over button changes
function handleButtonOver(event){
  $(event.target).parents(".screen").fadeOut("slow");
  $(".container-2").fadeIn("slow");
  left_red_channel = undefined;
  right_red_channel = undefined;
  readyScript();
}

//handles change of different views on screen
function changeScreen(event) {
  var op = event.target.className;
  if (op.includes("btn-next")) {
    handleButtonNext(event);
  } else if (op.includes("btn-back")) {
    handleButtonBack(event);
  } else if (op.includes("btn-over")) {
   handleButtonOver(event);
  }
}

function readyScript(){
  let dropArea = document.getElementById('drop-area');
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(
  eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
  })
function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
}
;
['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})
;
['dragleave', 'drop'].forEach(eventName => {
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
}

// Callback to be executed  after drag and drop functionality 
function cb(img, selection) {
  if (selection.width<11 || selection.height<11){
    alert("Width and height cannot be less than 10px");
    return;
}
if(!leftDrag.x){
  leftDrag.x = selection.x1;
  leftDrag.y = selection.y1;
  leftDrag.w = selection.width;
  leftDrag.h = selection.height;
}
else{
  rightDrag.x = selection.x1;
  rightDrag.y = selection.y1;
  rightDrag.w = selection.width;
  rightDrag.h = selection.height;
}
  $("#loading-1").removeClass("hide");
  $("#loading-2").removeClass("hide");

  var sequencer = imp.ImageSequencer({
    inBrowser: false
  })
  sequencer.loadImage(img.src, function () {
    this.addSteps('crop{x:' + selection.x1 + '|y:' + selection.y1 + '|w:' + selection.width + '|h:' + selection.height + '},average').run(function (out) {
      imp.getPixels(out, function (err, pixels) {
        var i = 0,
          sum = [0, 0, 0, 0];
        while (i < pixels.data.length) {
          sum[0] += pixels.data[i++];
          sum[1] += pixels.data[i++];
          sum[2] += pixels.data[i++];
          sum[3] += pixels.data[i++];
        }
        let divisor = pixels.data.length / 4;
        sum[0] = Math.floor(sum[0] / divisor);
        if(!left_red_channel)
        {
          left_red_channel = sum[0];
          $(".container-3 .btn-next").attr("disabled", false);
        }
        else{
        right_red_channel = sum[0];
        $(".container-4 .btn-next").attr("disabled", false);
        }
        $("#loading-1").addClass("hide");
        $("#loading-2").addClass("hide");

      })
    })
  })
}

function handleFiles(files) {
  
  ([...files]).forEach(previewFile)
}

function previewFile(file) {
  $("input")[0].value='';
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function () {
    img = document.createElement('img')
    img.setAttribute("id", "sel");
    img.src = reader.result
    $("#drop-area").parents(".screen").fadeOut("slow");
    $("#gallery").parents(".screen").fadeIn("slow", displayPreview);
    $(".container-3 .btn-next").attr("disabled", true);
  }

  function displayPreview() {
    if($("#gallery img")) $("#gallery img").remove();
    document.getElementById('gallery').appendChild(img);
    
    addImgAreaSelect();
  }
}