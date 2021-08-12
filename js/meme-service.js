const gImages = [];
const gKeyWords = {
    'funny': 0,
    'animal': 0,
    'men': 0,
    'women': 0,
    'comic': 0,
    'smile': 0
};

let gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [
        createLine('YOUR TEXT HERE', 40, 'center', 'black', 'Impact', null, null, false)
    ]
}


fillImages();


function fillImages(){
    for(var i = 1; i <= 18; i++){
        createImg(`/images/${i}.jpg`);
    }
}

function createImg(src, keywords){
    let img = {
        id: makeId(),
        src,
        keywords
    }

    gImages.push(img);
}

function createLine(txt, size, align, color, font, x, y, isDraggable, isEditable){
    return {
        txt,
        size,
        align,
        color,
        font,
        x,
        y,
        isDraggable,
        isEditable
    }
}

function createNewLine(canvasW, canvasH){
    gMeme.lines.push(createLine('', 40, 'center', 'black', 'Impact', canvasW/2, (canvasH/8) * (gMeme.selectedLineIdx + 1), false, false))
}

function addNewLine(canvasW, canvasH, txtInput){
    gMeme.lines[gMeme.selectedLineIdx] = createLine(txtInput.toUpperCase(), 40, 'center', 'black', 'Impact', canvasW/2, (canvasH/8) * (gMeme.selectedLineIdx + 1), false, false);
    gMeme.selectedLineIdx = gMeme.lines.length;
}

function deleteCurrentLine(){
    if(gMeme.selectedLineIdx === 0){
        gMeme.lines.splice(gMeme.selectedLineIdx, 1);
        if(gMeme.lines.length === 0){
            gMeme.lines.push(createLine('', 40, 'center', 'black', 'Impact', gCanvas.width/2, gCanvas.height/8));
            gMeme.selectedLineIdx = 0;
        }
        return;
    }
    
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx--; 
}

function switchLine(){
    gMeme.selectedLineIdx++;
    if(gMeme.selectedLineIdx >= gMeme.lines.length){
        gMeme.selectedLineIdx = 0;
    }
}

function increaseFont(){
    gMeme.lines[gMeme.selectedLineIdx].size += 5;
}

function decreaseFont(){
    if(gMeme.lines[gMeme.selectedLineIdx].size <= 5) return;
    gMeme.lines[gMeme.selectedLineIdx].size -= 5;
}

function alignLeft(){
    gMeme.lines[gMeme.selectedLineIdx].align = 'right';
}

function alignCenter(){
    gMeme.lines[gMeme.selectedLineIdx].align = 'center';
}

function alignRight(){
    gMeme.lines[gMeme.selectedLineIdx].align = 'left';
}

function changeStrokeColor(color){
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}

function changeFont(font){
    gMeme.lines[gMeme.selectedLineIdx].font = font;
}

function getLineIdxByPos(pos){
    let x = pos.x;
    let y = pos.y;
    
    let lineIdx = gMeme.lines.findIndex((line, idx)=>{
        let lineSize = getLineSizeById(line);
        
        let lineXStart = line.x - lineSize.width/2;
        let lineXEnd = line.x + lineSize.width/2;
        let lineYStart = line.y - line.size ;
        let lineYEnd = line.y;

        if(line.align === 'left'){
            lineXStart += lineSize.width/2;
            lineXEnd += lineSize.width/2;
        }
        
        if(line.align === 'right'){
            lineXStart -= lineSize.width/2;
            lineXEnd -= lineSize.width/2;
        }


        // gCtx.lineWidth = 5
        // gCtx.moveTo(lineXStart, lineYStart)
        // gCtx.lineTo(lineXEnd, lineYEnd)
        // gCtx.strokeStyle = 'red'
        // gCtx.stroke()


        return ((x >= lineXStart && x <= lineXEnd) && (y >= lineYStart && y <= lineYEnd))
    });

    return(lineIdx);
}

function getLineSizeById(line){
    let metrics = gCtx.measureText(line.txt);

    let width = metrics.width;
    let height = line.size;

    return {width, height};
}

function getLineById(idx){
    return gMeme.lines[idx];
}

function moveLine(dx, dy){
    let line = gMeme.lines[gMeme.selectedLineIdx];

    line.x += dx;
    line.y += dy;
}