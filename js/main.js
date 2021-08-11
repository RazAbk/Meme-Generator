let gElGalleryContent = document.querySelector('.gallery-content');
let gElImageGallery = document.querySelector('.image-gallery');
let gElMemeEditor = document.querySelector('.meme-editor');

let gCanvas = document.querySelector('canvas');
let gCtx = gCanvas.getContext('2d');


function init(){

    renderGallery();
    renderCanvas();
    positionFirstLine();
}

function renderGallery(){

    let strHtmls = gImages.map((image, idx)=>{
        return `<img src="/images/${idx + 1}.jpg" onclick="onImageClick(${idx})">`;
    });

    strHtmls = strHtmls.join('');

    gElGalleryContent.innerHTML = strHtmls;
}

function renderCanvas(){
    clearCanvas();
    drawImageOnCanvas(gMeme.selectedImgId);
}

function onImageClick(imageIdx){
    gElImageGallery.style.display = 'none';
    gElMemeEditor.style.display = 'block';

    gMeme.selectedImgId = imageIdx;
    gMeme.selectedLineIdx = 0;

    renderCanvas();
}


function drawImageOnCanvas(imageIdx){
    var img = new Image()
    img.src = `/images/${imageIdx + 1}.jpg`;

    gCanvas.width = img.width;
    gCanvas.height = img.height;

    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        renderLines();
    }
}

function onCreateLine(txt){
    // Dom / Canvas
    txt = txt.toUpperCase();
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = gMeme.lines[gMeme.selectedLineIdx].color;
    gCtx.fillStyle = 'white';
    gCtx.font = `${gMeme.lines[gMeme.selectedLineIdx].size}px Impact`;
    gCtx.fillText(txt, gMeme.lines[gMeme.selectedLineIdx].x, gMeme.lines[gMeme.selectedLineIdx].y);
    gCtx.strokeText(txt, gMeme.lines[gMeme.selectedLineIdx].x, gMeme.lines[gMeme.selectedLineIdx].y);

    //Modal
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;

    renderCanvas();
}

function renderLines(){
    gMeme.lines.forEach(line=>{
        drawTxt(line);
    });
}


function drawTxt(line){
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = line.color;
    gCtx.fillStyle = 'white';
    gCtx.font = `${line.size}px Impact`;
    gCtx.textAlign = line.align;
    gCtx.fillText(line.txt, line.x, line.y);
    gCtx.strokeText(line.txt, line.x, line.y);
}





function onAddLine(){
    let txtInput = document.querySelector('.type-line-box');
    if(!txtInput.value) return;

    addNewLine(gCanvas.width, gCanvas.height);
    txtInput.value = '';
}

function onDeleteLine(){
    deleteCurrentLine();
    renderCanvas();
}

function onDownloadMeme(elLink){
    const data = gCanvas.toDataURL().replace('image/png', 'image/jpeg');
    elLink.href = data;
}

function onSwitchLine(){
    switchLine();
}

function onIncreaseFont(){
    increaseFont();
    renderCanvas();
}

function onDecreaseFont(){
    decreaseFont();
    renderCanvas();
}

function onAlignLeft(){
    alignLeft();
    renderCanvas();
}
function onAlignCenter(){
    alignCenter();
    renderCanvas();
}
function onAlignRight(){
    alignRight();
    renderCanvas();
}





// positioning the first line at the top of the image
function positionFirstLine(){
    if(!gMeme.lines[0].x || !gMeme.lines[0].y){
        gMeme.lines[0].x = gCanvas.width/2;
        gMeme.lines[0].y = gCanvas.height/8;
    }
}

function clearCanvas(){
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

