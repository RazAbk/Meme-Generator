/////////////////////////////////////////////////////
//////      Global vars && DOM Elements       ///////
/////////////////////////////////////////////////////
let gElGalleryContent = document.querySelector('.gallery-content');
let gElImageGallery = document.querySelector('.image-gallery');
let gElMemeEditor = document.querySelector('.meme-editor');
let gElMyMemeModal = document.querySelector('.my-meme-modal');
let gElMyMemeModalImg = document.querySelector('.my-meme-image');

let gCanvas = document.querySelector('canvas');
let gCtx = gCanvas.getContext('2d');

const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

let gIsModalDownload = false;
let gFilterBy;
let gCurrentGallery;

function init(){
    gFilterBy = 'all';
    gCurrentGallery = 'gallery';
    renderGallery();
    addEventListeners();
}

function addEventListeners(){
    gCanvas.addEventListener('mousedown', onDown);
    gCanvas.addEventListener('mousemove', onMove);
    gCanvas.addEventListener('mouseup', onUp);

    gCanvas.addEventListener('touchstart', onDown);
    gCanvas.addEventListener('touchmove', onMove);
    gCanvas.addEventListener('touchend', onUp);
}

/////////////////////////////////////////////////////
//////               Rendering                ///////
/////////////////////////////////////////////////////

function renderGallery(){
    let filteredMemes = gImages;

    if(gFilterBy !== 'all'){
        filteredMemes = gImages.filter((image)=>{
            return image.keywords.includes(gFilterBy);
        });
    }

    let strHtmls = filteredMemes.map((image, idx)=>{
        return `<img src="${image.src}" onclick="onImageClick(${getImageIdxById(image.id)})">`;
    });
    
    strHtmls = strHtmls.join('');
    
    gElGalleryContent.innerHTML = strHtmls;
}

function renderCanvas(){
    clearCanvas();
    drawImageOnCanvas(gMeme.selectedImgId);
}

function renderMyMemes(){
    let filteredMemes = gMyImages;

    if(gFilterBy !== 'all'){
        filteredMemes = gMyImages.filter((image)=>{
            return image.keywords.includes(gFilterBy);
        });
    }

    let strHtmls = filteredMemes.map((myImage, idx)=>{
        return `<img src="${myImage.image}" onclick="onSavedImageClick(${idx})">`;
    });
    
    if(strHtmls.length === 0){
        strHtmls = '<img class="no-results-msg" src="images/Btns/noresults.png" alt="no results">';
    } else{
        strHtmls = strHtmls.join('');
    }
    gElGalleryContent.innerHTML = strHtmls;
}

/////////////////////////////////////////////////////
//////             Canvas Render              ///////
/////////////////////////////////////////////////////

function clearCanvas(){
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

function drawImageOnCanvas(imageIdx){
    gCanvas.style.backgroundImage = `URL(images/${imageIdx + 1}.jpg)`;
    renderLines();
}

function drawImageForExport(imageIdx){
    var img = new Image()
    img.src = `images/${imageIdx + 1}.jpg`;

    gCanvas.width = img.width;
    gCanvas.height = img.height;

    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        renderLines();
    }
}

function drawImageOnCanvas(imageIdx){
    gCanvas.style.backgroundImage = `URL(images/${imageIdx + 1}.jpg)`;

    var img = new Image()
    img.src = `images/${imageIdx + 1}.jpg`;

    gCanvas.width = img.width;
    gCanvas.height = img.height;

    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        renderLines();
    }
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
    gCtx.font = `${line.size}px ${line.font}`;
    gCtx.textAlign = line.align;
    gCtx.fillText(line.txt, line.x, line.y);
    gCtx.strokeText(line.txt, line.x, line.y);
}

function drawRectLine(idx){
    let line = getLineById(idx);
    
    let lineSize = getLineSizeById(line);
    
    let lineXStart = line.x - lineSize.width/2 - 10;
    let lineYStart = line.y - line.size - 5;
    
    let lineXEnd = lineSize.width + 20;
    let lineYEnd = line.size + 20;
    
    if(line.align === 'left'){
        lineXStart += lineSize.width/2;
        lineXEnd += lineSize.width/2;
    }
    
    if(line.align === 'right'){
        lineXStart -= lineSize.width/2;
        lineXEnd -= lineSize.width/2;
    }

    gCtx.beginPath()
    gCtx.rect(lineXStart, lineYStart, lineXEnd , lineYEnd)
    gCtx.strokeStyle = '#799ff7'
    gCtx.stroke()
    gCtx.closePath();
}

/////////////////////////////////////////////////////
//////                 UX UI                  ///////
/////////////////////////////////////////////////////

function onImageClick(imageIdx){
    gMeme.lines = [createLine('YOUR TEXT HERE', 40, 'center', 'black', 'Impact', null, null, false)];

    gElImageGallery.style.display = 'none';
    gElMemeEditor.style.display = 'flex';
    
    gMeme.selectedImgId = imageIdx;
    gMeme.selectedLineIdx = 0;
    
    renderCanvas();
    positionFirstLine();
}

function onGalleryClicked(){
    gCurrentGallery = 'gallery';
    gFilterBy = 'all';
    returnHome()

    gElImageGallery.style.display = 'grid';
    gElMemeEditor.style.display = 'none';
    
    
    renderGallery();
}

function onMyMemesClicked(){
    gCurrentGallery = 'mymemes';
    gFilterBy = 'all';
    returnHome()
    gElGalleryContent.innerHTML = '';
    
    renderMyMemes();

    gElMemeEditor.style.display = 'none';
    gElImageGallery.style.display = 'flex';
}

function onAboutClicked(ev){
    let elBody =  document.querySelector('body');

    elBody.classList.toggle('open-about')
    if(elBody.classList.contains('show-screen')){
        elBody.classList.toggle('menu-open');
    }else{
        elBody.classList.toggle('show-screen');
    }
    elBody.style.overflow = 'hidden';
}

function onSavedImageClick(myMemeIdx){
    // Set the href of <a> tag for downloading the current meme
    document.querySelector('.download-saved-meme-btn a').href = loadFromStorage('myImages')[myMemeIdx].image;
    gIsModalDownload = true;

    // Add Delete && Share buttons with idx to the DOM
    document.querySelector('.delete-meme-btn').setAttribute('onclick', `onDeleteMeme(${myMemeIdx})`);
    document.querySelector('.share-saved-meme-btn').setAttribute('onclick', `onShare(${myMemeIdx})`);

    // Render Modal to DOM
    let meme = getMemeById(myMemeIdx);
    let strHtml = `<img src="${meme.image}">`;
    gElMyMemeModalImg.innerHTML = strHtml;

    // Show modal on DOM
    gElMyMemeModal.style.opacity = 1;
    gElMyMemeModal.style.pointerEvents = 'auto';

    // Toggle screen and disable body
    let elBody =  document.querySelector('body');
    elBody.style.overflow = 'hidden';

    toggleScreen();
}

function openMenu(){
    let elBody =  document.querySelector('body');
    
    elBody.classList.toggle('menu-open');
    elBody.classList.toggle('show-screen');
    elBody.style.overflow = 'hidden';
}

function returnHome(){
    if(gElMyMemeModal.style.opacity === '1'){
        gElMyMemeModal.style.opacity = 0;
        gElMyMemeModal.style.pointerEvents = 'none';
        toggleScreen();
        return;
    }

    let elBody =  document.querySelector('body');
    
    if(elBody.classList.contains('menu-open')) elBody.classList.toggle('menu-open');
    if(elBody.classList.contains('show-screen')) elBody.classList.toggle('show-screen');
    if(elBody.classList.contains('open-about')) elBody.classList.toggle('open-about');
    elBody.style.overflow = 'visible';
}

function toggleScreen(){
    let elBody =  document.querySelector('body');
    elBody.classList.toggle('show-screen');
}

function onDeleteMeme(idx){
    deleteMemeFromMemory(idx);
    renderMyMemes();
    returnHome();
}

function onShare(idx = -1){
    uploadImage(idx);
}

function onFilterSearch(txt){

}

function onFilterClick(filter){
    filter = filter.toLowerCase();
        gFilterBy = filter;
        if(gCurrentGallery === 'gallery') renderGallery();
        if(gCurrentGallery === 'mymemes') renderMyMemes();
}

/////////////////////////////////////////////////////
//////              Meme Editor               ///////
/////////////////////////////////////////////////////

function onCreateLine(txt){
    let lineIdx = gMeme.selectedLineIdx;

    if(!gMeme.lines[lineIdx]){
        createNewLine(gCanvas.width, gCanvas.height);
        renderCanvas();
    }

    // Dom / Canvas
    txt = txt.toUpperCase();
    clearCanvas();
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = gMeme.lines[lineIdx].color;
    gCtx.fillStyle = 'white';
    gCtx.font = `${gMeme.lines[lineIdx].size}px ${gMeme.lines[lineIdx].font}`;
    gCtx.fillText(txt, gMeme.lines[lineIdx].x, gMeme.lines[lineIdx].y);
    gCtx.strokeText(txt, gMeme.lines[lineIdx].x, gMeme.lines[lineIdx].y);

    //Modal
    gMeme.lines[lineIdx].txt = txt;

    renderCanvas();
}

function onAddLine(){
    if(!gMeme.lines[gMeme.selectedLineIdx] && gMeme.lines[gMeme.selectedLineIdx].isEditable) return;

    let elTextInput = document.querySelector('.type-line-box');
    if(!elTextInput.value || elTextInput.value === 'YOUR TEXT HERE' || elTextInput.value === ' ') return;

    addNewLine(gCanvas.width, gCanvas.height, elTextInput.value);
    elTextInput.value = '';
}

function onDeleteLine(){
    deleteCurrentLine();
    renderCanvas();
}

function onDownloadMeme(elLink){
    const data = gCanvas.toDataURL().replace('image/png', 'image/jpeg');

    // if Download from view Modal
    if(gIsModalDownload){
        setTimeout(function(){
            elLink.href = data;
        },200)
        return;
    }
    
    elLink.href = data;
}

function onSaveMeme(){
    const data = gCanvas.toDataURL().replace('image/png', 'image/jpeg');
    saveMeme(data);
}

function onSwitchLine(){
    switchLine();

    let elTextInput = document.querySelector('.type-line-box');
    elTextInput.value = gMeme.lines[gMeme.selectedLineIdx].txt;

    clearCanvas();
    renderCanvas();

    setTimeout(drawRectLine, 50, gMeme.selectedLineIdx)
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

function openColorPopup(){
    document.querySelector('.color-picker input').click();
}

function onColorChange(color){
    changeStrokeColor(color);
    renderCanvas();
}

function onChangeFont(font){
    changeFont(font);
    renderCanvas();
}

// positioning the first line at the top of the image
function positionFirstLine(){
    if(!gMeme.lines[0].x || !gMeme.lines[0].y){
        gMeme.lines[0].x = gCanvas.width/2;
        gMeme.lines[0].y = gCanvas.height/8;
    }
}

/////////////////////////////////////////////////////
//////         Mouse && Touch events          ///////
/////////////////////////////////////////////////////

function onDown(ev){
    let pos = getEvPos(ev);

    let lineClickedIdx = getLineIdxByPos(pos);
    
    if(lineClickedIdx === -1){
        gMeme.lines.forEach(line=>{
            line.isEditable = false;
        });

        document.querySelector('.type-line-box').value = '';

        gMeme.selectedLineIdx = gMeme.lines.length;
        renderCanvas();
        return;
    }
    gMeme.selectedLineIdx = lineClickedIdx;
    
    clearCanvas();
    renderCanvas();

    setTimeout(drawRectLine, 50, gMeme.selectedLineIdx)

    gMeme.lines[lineClickedIdx].isDraggable = true;
    gMeme.lines[lineClickedIdx].isEditable = true;
}

function onMove(ev){
    if(gMeme.lines[gMeme.selectedLineIdx] && gMeme.lines[gMeme.selectedLineIdx].isDraggable){
        let line = gMeme.lines[gMeme.selectedLineIdx];

        let pos = getEvPos(ev);
        let dx = pos.x - line.x;
        let dy = pos.y - line.y;
        
        renderCanvas();
        moveLine(dx, dy);
    }
}

function onUp(ev){
    if(!gMeme.lines[gMeme.selectedLineIdx]) return;
    gMeme.lines[gMeme.selectedLineIdx].isDraggable = false;
    setTimeout(drawRectLine, 50, gMeme.selectedLineIdx);
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }

    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

