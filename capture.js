// context
;(() => {
  // console.log("veces en que se corre") // 1

  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 400 // We will scale the photo width to this
  var height = 0 // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null
  var canvas = null
  var photo = null
  var startbutton = null

  function startup() {
    video = document.getElementById("video")
    canvas = document.getElementById("canvas")
    photo = document.getElementById("photo")
    startbutton = document.getElementById("startbutton")
    addBlurButton = document.getElementById("addBlurButton")

    const startWithTheVideo = () => {
      // console.log("::: navigator : ", navigator)

      // en el navegador hay unos dispositivos de comunicacion
      navigator.mediaDevices
        // entonces hay pedimos al usuario su media
        .getUserMedia({ video: true, audio: false })
        //  y despues devuelve el MediaStream
        // que lo vamos a usar para rellenar el elemento video con el srcObject
        // que solo se puede ver si imprimes el video en la consola
        // con console.dir
        .then((MediaStream) => {
          // console.log("::: MediaStream : ", MediaStream)
          // console.dir(video)
          video.srcObject = MediaStream
          // console.dir(video)
          video.play()
        })
        // y si pasas algo que no debe entonces el error
        .catch(function (err) {
          console.log("An error occurred: " + err)
        })
    }

    const setHeightVideo = () => {
      // console.log("::: height : ", height)
      height = video.videoHeight / (video.videoWidth / width)

      // console.log(`${video.videoHeight} / (${video.videoWidth} / ${width})`)
      // console.log("::: height : ", height)

      // Firefox currently has a bug where the height can't be read from
      // the video, so we will make assumptions if this happens.

      if (isNaN(height)) {
        height = width / (4 / 3)
        // console.log("::: height : ", height)
      }
    }

    const HandlerEventCanPlay = (ev) => {
      if (!streaming) {
        setHeightVideo()

        // set atributes video

        video.setAttribute("width", width)
        video.setAttribute("height", height)

        // set atributes canvas

        canvas.setAttribute("width", width)
        canvas.setAttribute("height", height)

        streaming = true
      }
    }

    // Fill the photo with an indication that none has been
    // captured.

    const clearPhoto = () => {
      const canvasContext = canvas.getContext("2d")

      canvasContext.fillStyle = "#AAA"
      canvasContext.fillRect(0, 0, canvas.width, canvas.height)

      const imageFromCanvas = canvas.toDataURL("image/png")

      photo.setAttribute("src", imageFromCanvas)
    }

    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.

    function takepicture() {
      const canvasContext = canvas.getContext("2d")

      // si el ancho y la altura son distintos de cero
      // (lo que significa que hay al menos datos de imagen potencialmente válidos)
      if (width && height) {
        // , establecemos el ancho y la altura del lienzo para que coincida con el marco capturado,
        canvas.width = width
        canvas.height = height

        // luego llamamos drawImage()para dibujar el marco actual del video en el contexto,
        // llenando todo el lienzo con la imagen del marco.
        canvasContext.drawImage(video, 0, 0, width, height)

        const canvasToImage = canvas.toDataURL("image/png")
        // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAADwCAYAAABxLb1rAAAAAXNSR0IArs4c6QAAAERlWElmTU..."
        console.log("::: canvasToImage : ", canvasToImage)

        photo.setAttribute("src", canvasToImage)
      } else {
        clearphoto()
      }
    }

    const HandlerClickStartButton = (ev) => {
      takepicture()
      ev.preventDefault()
    }

    let isBlur = false

    const HandlerAddBlurButton = (ev) => {
      video.style.filter = isBlur ? "" : "blur(3px)"
      isBlur = !isBlur
    }

    // Execution oder

    startWithTheVideo()

    // cuando el video lanza el evento canplay
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
    video.addEventListener("canplay", HandlerEventCanPlay, false)

    startbutton.addEventListener("click", HandlerClickStartButton, false)

    addBlurButton.addEventListener("click", HandlerAddBlurButton, false)

    clearPhoto()
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener("load", startup, false)
})()
