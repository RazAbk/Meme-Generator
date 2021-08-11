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
        createLine('YOUR TEXT HERE', 40, 'center', 'black', null, null)
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

function createLine(txt, size, align, color, x, y){
    return {
        txt,
        size,
        align,
        color,
        x,
        y
    }
}

function addNewLine(canvasW, canvasH){
    gMeme.selectedLineIdx++;
    gMeme.lines.push(createLine('YOUR TEXT HERE', 40, 'center', 'black', canvasW/2, (canvasH/8) * (gMeme.selectedLineIdx + 1)));
}

function deleteCurrentLine(){
    if(gMeme.selectedLineIdx === 0){
        gMeme.lines.splice(gMeme.selectedLineIdx, 1);
        if(gMeme.lines.length === 0){
            gMeme.lines.push(createLine('', 40, 'center', 'black', gCanvas.width/2, gCanvas.height/8));
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
