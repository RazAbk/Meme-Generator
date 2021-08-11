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
        createLine('YOUR TEXT HERE', 40, 'center', 'black', 'Impact', null, null)
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

function createLine(txt, size, align, color, font, x, y){
    return {
        txt,
        size,
        align,
        color,
        font,
        x,
        y
    }
}

function addNewLine(canvasW, canvasH){
    gMeme.selectedLineIdx++;
    gMeme.lines.push(createLine('YOUR TEXT HERE', 40, 'center', 'black', 'Impact', canvasW/2, (canvasH/8) * (gMeme.selectedLineIdx + 1)));
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
    if(gMeme.selectedLineIdx === gMeme.lines.length){
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

function getLineByPos(pos){
    let x = pos.x;
    let y = pos.y;

    let lineSize = getCurrentLineSize();

    let line = gMeme.lines.findIndex(line=>{

        let lineXStart = line.x - lineSize.width/2;
        let lineXEnd = line.x + lineSize.width/2;
        let lineYStart = line.y - lineSize.height;
        let lineYEnd = line.y + lineSize.height;

        return ((x >= lineXStart && x <= lineXEnd) && (y >= lineYStart && y <= lineYEnd))
    });

    console.log(line);
    return(line);
}

function getCurrentLineSize(){
    let metrics = gCtx.measureText(gMeme.lines[gMeme.selectedLineIdx].txt);

    let width = metrics.width;
    let height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    return {width, height};
}