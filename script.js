const codeInput = document.getElementById("code")

codeInput.onblur=()=>{
    codeInput.innerHTML=PR.prettyPrintOne(codeInput.innerText)
}

const processButton = document.getElementById("process")

const canvas = document.getElementById("image")
const ctx = canvas.getContext("2d")

const originalCanvas = document.createElement("canvas")
originalCanvas.style.display="none"
const originalCtx = originalCanvas.getContext("2d")
document.body.appendChild(originalCanvas)
function drawImageFromUrl(sourceurl) {
    var img = new Image();

    img.addEventListener("load", function() {
       canvas.height = 500
       canvas.width = img.width/img.height*500
       originalCanvas.height = 500
       originalCanvas.width = img.width/img.height*500
       ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
       originalCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    });
 
    img.setAttribute("src", sourceurl);
    
 }

drawImageFromUrl("./templateimg.jpg")

processButton.onclick = () => {
    processButton.innerText="Processing..."

    ctx.fillStyle="rgba(0,0,0,0.9)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle="rgba(255,255,255,0.9)"
    ctx.font = "30px monospace";
    const measurements = ctx.measureText("Processing image...")
    ctx.fillText("Processing image...", canvas.width/2-measurements.width/2, canvas.height/2-measurements.fontBoundingBoxAscent/2)
    setTimeout(() => {
        let imgData = originalCtx.getImageData(0,0,canvas.width,canvas.height)
        let newImageData = ctx.getImageData(0,0,canvas.width,canvas.height)
        let pixels = []
        for(let i = 0; i < imgData.data.length; i+=4){
            pixels.push([imgData.data[i],imgData.data[i+1],imgData.data[i+2],imgData.data[i+3]])
        }
        eval(codeInput.innerText)
        newImageData.data.set(pixels.flat(1))
        ctx.putImageData(newImageData, 0, 0)
        processButton.innerText = "Process"
    }, 100);
 
    console.log("Processed")
}

const revertButton = document.getElementById("revert")
revertButton.onclick = () => {
    ctx.drawImage(originalCanvas,0,0)
}

const input = document.getElementById("file-upload")

input.onchange = ()=>{
    const file=input.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload= (ev)=>{
      var src_image = new Image();
      src_image.src=reader.result
      src_image.onload = ()=> {
        canvas.height = 500
        canvas.width = src_image.width/src_image.height*500
        originalCanvas.height = 500
        originalCanvas.width = src_image.width/src_image.height*500
        originalCtx.drawImage(src_image, 0, 0, src_image.width/src_image.height*500, 500);
        ctx.drawImage(src_image, 0, 0, src_image.width/src_image.height*500, 500);
      }
    };
    console.log("e")

}
