/* -*- mode: Web -*-  */
"use strict";
/**
 * Global variables for this module.
 * @var players[]: holds all player objects
 * @var otherObjects: cones, balls, whatever
 * @var allPaths: Lines
 */
let players = [];
let playerSelected = -1;
let otherObjects = [];
let allPaths = [];
let vLinePatternBrush = null;
let dirty = false;
let allSituations = {};
let list;


var $=function(id){return document.getElementById(id)};
function basePath(segment){
    let indexOfSegment
    // get the segments
    let pathArray = window.location.pathname.split( '/' );
    // find where the segment is located
    if(segment)
        indexOfSegment = pathArray.indexOf(segment);
    else
        indexOfSegment=pathArray.length-1
    // make base_url be the origin plus the path to the segment
    return window.location.origin + pathArray.slice(0,indexOfSegment).join('/') + '/'
}
/* **************************************************************************************** */
/* *** C O O R D I N A T E S   A N D   W O R L D ****************************************** */
/* **************************************************************************************** */
const rwMargin =  1.0;   //
const rwSize   = 11.0;   //
let cnMargin;
let cnSize;
window.onresize = reportWindowSize;
/**
 * Trigger canvas resize on window resize
 */
function reportWindowSize() {
    let heightOutput = document.querySelector("#height");
    let widthOutput = document.querySelector("#width");
    let rc = document.getElementById("ratioClass");
    let xx = Math.min(window.innerHeight, window.innerWidth, rc.clientWidth, rc.clientHeight);
    widthOutput.textContent  = window.innerWidth +'x'+window.innerHeight;
    heightOutput.textContent = rc.clientWidth+'x'+rc.clientHeight+', '+xx;
    cSize = xx-10;
    resizeCanvas(G_canvas, cSize, cSize)

}
/**
 *  xReal = (xCanvas-cnMargin)*rwSize/cnSize
 *  xCanvas = xReal*cnSize/rwSize+cnMargin
 *
 */
function canvasToWorld(G){
    let rCX = (G.left-cnMargin)/cnSize*rwSize;
    let rCY = (G.top -cnMargin)/cnSize*rwSize;
    return {left: rCX, top: rCY};
}

/**
 * Convert world coordinates to canvas coordinates.
 * p: array[2] or object {left:, top:} of world coordinates
 * G: optional, if this is a group, position is corrected to reflect object[0]
 * returns: object {left: x, top: y}
 */
function worldToCanvas(p, G){
    let left = 0;
    let top = 0;
    if(Array.isArray(p)){
        left = p[0];
        top  = p[1];
    }
    else if(p.left !== undefined){
        left = p.left;
        top  = p.top;
    }
    else{
        return undefined;
    }
    // Still needed?
    if(G && G._objects){
        let D = G._objects[0];
        let dCX = 0.25*(D.aCoords.bl.x+D.aCoords.br.x+D.aCoords.tl.x+D.aCoords.tr.x);
        let dCY = 0.25*(D.aCoords.bl.y+D.aCoords.br.y+D.aCoords.tl.y+D.aCoords.tr.y);
        console.log('dCX: %f dCY: %f', dCX, dCY);
        return {left: left*cnSize/rwSize+cnMargin-dCX, top: top*ccSize/rwSize+cnMargin-dCY}
    }
    else{
        return {left: left*cnSize/rwSize+cnMargin, top: top*cnSize/rwSize+cnMargin}
    }
}

function resizeCanvas(c, xDim, yDim) {
    const ratio = c.getWidth()/c.getHeight();
    const scale = xDim / c.getWidth();
    const zoom  = c.getZoom() * scale;
    c.setDimensions({width: xDim, height: xDim/ratio });
    c.setViewportTransform([zoom,0,0,zoom, 0,0]);
}


function createCourt2(posX, posY, size){
    let m3 = size/3;
    let pf = new fabric.Path(`M 0 0 L 0 ${size} L ${size} ${size} L ${size} 0 L 0 0 z M0 ${m3} ${size} ${m3}`);
    pf.set({left: posX, top: posY, strokeWidth: 3, stroke: 'blue', fill: '#E0E0FF', originX: 'left', originY: 'top' });
    pf.set('selectable', false);
    return pf;
}
/* **************************************************************************************** */
/* *** A D D I N G   O B J E C T S ******************************************************** */
/* **************************************************************************************** */
function insertObject(id, params){
    setDirty();
    let I = createImage(id, params);
    G_canvas.add(I);
    otherObjects.push(I);
}

function createImage(id, params){
    const sizes = [1.0, 1.4, 1.7];
    //let idx=  p.idx ?? 1;
    let idx=1;

    let X = 4.5; let Y = 4.5;
    if(params && params.loc){X = params.loc[0]; Y = params.loc[1]; }
    let p = worldToCanvas([X, Y])

    let I = new fabric.Image(document.getElementById(id));
    I.scale( (params.scale ?? 1)*sizes[idx] );
    I.hasControls = I.hasBorders = false;
    I.set({originX: 'center', originY:'center', 'lockScalingX': true, 'lockScalingY': true});
    I.set({left: p.left, top: p.top, leftW: X, topW: Y, customType: 'other'})
    return I;
}

/**
 * this will become our new player creator
 * Call sign to get to: insertTriangle(params)
 */
function insertTriangle(p){
    setDirty();
    const sizes = [1.0, 1.4, 1.7];
    console.log('insertTriangle ', {p})
    let idx= (p && p.size) ? p.size : document.getElementById('plr-size').value;
    let baseDim = cnSize/18*sizes[idx];
    let pcolor = (p &&p.pcolor) ? p.pcolor : $("plr-color").value;
    let tcolor = (p &&p.tcolor) ? p.tcolor : $("txt-color").value;


    let D = new fabric.Triangle({
        width: baseDim, height: baseDim,
        originX: 'center', originY: 'center',
        fill: pcolor,
        stroke: '#000', // pcolor,
        strokeWidth : 1,
        lockScalingX: true, lockScalingY: true
    });
    let T1  = new fabric.Text(
        $('plr-func').value,
        {
            fontSize: 0.3*baseDim,
            top: 0.3*baseDim, //0.14*baseDim,
            originX: 'center',
            originY: 'center',
            fill: tcolor,
            lockScalingX: true,
            lockScalingY: true
    });
    let T2  = new fabric.Text(
        $('plr-name').value,
        {
            fontSize: 0.389*baseDim,
            top: 0.50*baseDim,
            originX: 'center', originY: 'top',
            fill: tcolor,
            lockScalingX: true, lockScalingY: true
    });
    let G  = new fabric.Group([D, T1, T2]);
    G.set({
        originX: 'center', originY: 'center',
        left: 100, top: 100,
        leftW: 1.0, topW: 2.0,
        customType: 'player',
        lockScalingX: true, lockScalingY: true,
        cornerStrokeColor: '#bbf', //'transparent',
        hasBorders: true
    });
    G.on({'selected': playerOnSelected });
    G.on({'deselected': playerOnDeselected});
    let w = canvasToWorld(G);
    G.set({leftW: w.left, topW: w.top});
    players.push(G);
    G_canvas.add(G);
}

function removePlayers(){
    setDirty();
    //console.log('removing Players')
    players.forEach(function(item){
        G_canvas.remove(item);
        console.log(item);
    });
    players = [];
    //console.log('done removing')
}


function createPlayers(plrs, wPlrs){
    console.log(">>> createPlayers, ", plrs.length);
    removePlayers();
    fabric.util.enlivenObjects(plrs).then(
        objs => {objs.forEach(function(o,i){
            console.log(o);
            players.push(o);
            G_canvas.add(o);
        })
    })
    console.log("<<< createPlayers");
}
function createBall(params){
    let B = new fabric.Image(document.getElementById('my-ball'));
    B.set('lockScalingX', true);
    B.set('lockScalingY', true);
    B.scale(1.0);
    if(params.size && params.size==1) B.scale(0.5);
    B.hasControls = B.hasBorders = false;
    console.log(B);
    B.UserData = {
        dX : -B.aCoords.bl.y/2,
        dY : -B.aCoords.br.x/2
    }
    return B;
}
function updatePlayerFromFields(){
    setDirty();
    let P = $("plr-func").rumms;
    console.log(P, P._objects);
    if(P && P._objects){
        console.log('Modify!', P._objects[2].text);
        G_canvas.discardActiveObject();
        P._objects[0].set({fill:$('plr-color').value});
        P._objects[1].set({fill:$('txt-color').value, text: $("plr-func").value});
        P._objects[2].set({text:$("plr-name").value});
        let leftW = $('plr-X').value*1.0;
        let topW  = $('plr-Y').value*1.0;
        let ePos = worldToCanvas([leftW, topW]);
        console.log(ePos);
        P.set({left: ePos.left, top: ePos.top, angle: $('plr-a').value*1.0, leftW: leftW, topW: topW })
        P.dirty = true;
        //G_canvas.renderAll();
        G_canvas.setActiveObject(P);
        G_canvas.requestRenderAll();
    }
}

/* **************************************************************************************** */
/* *** W O R K S P A C E   H A N D L I N G ************************************************ */
/* **************************************************************************************** */
/**
 * Indicate indicators that situation has changed
 * Enable reset indicator
 */
function setDirty(){
    let btn=document.getElementById('idUpdateSit');
    if(!dirty){
        dirty = true;
        if($('session-select').value != ""){
            btn.classList.remove('disabled');
        }
        btn.classList.remove('btn-info');
        btn.classList.add('btn-warning');
        $('idResetSit').classList.remove('disabled');
    }
}
function unsetDirty(){
    let btn=document.getElementById('idUpdateSit');
    if(dirty){
        dirty = false;
        btn.classList.remove('btn-warning');
        btn.classList.add('btn-info');
        $('idResetSit').classList.add('disabled');
    }
}

/**
 * Create situation
 *  - create a new option in session_select
 *  - Sort options
 *  - select this option
 * Some option-handling ideas:
 * https://getbutterfly.com/enhancing-select-dropdowns-removing-duplicates-and-sorting-options-with-vanilla-javascript/
 */
function createSituation(){
    let wtf = prompt("Name", '01-L4-01');
    console.log(wtf);
    if(wtf && !(wtf in situations)){
        let select = $('session-select');
        select.disabled = false;
        if(dirty){
            document.getElementById('idUpdateSit').classList.remove('disabled');
        }
        document.getElementById('idDeleteSit').classList.remove('disabled');;
        console.log(wtf, 'is new');
        situations[wtf] = {};
        let option = document.createElement('option');
        option.text = wtf;
        select.add(option);
        let options=Array.from(document.getElementById('session-select').options);
        options.sort((a, b) => a.text.localeCompare(b.text))
        select.innerHTML='<option hidden value="">Situations</option>';
        options.forEach(option => select.appendChild(option))
        select.value = wtf;
    }
    else{
        console.log('Key exists already');
    }
}
/**
 * Update situation
 * - get current situation key
 * - Transform to JSON
 * - Update in situations-array
 */
function updateSituation(){
    let select = $('session-select');
    let val = select.value;
    let idx = select.selectedIndex;
    console.log('update situation', val, 'at ', idx);
    situations[val] = G_canvas.toJSON();
    unsetDirty();
    //enableRest();
}
/**
 * Retrieve situation
 * - clear canvas, objects, etc
 * - get new key
 * - populate canvas
 * Retrieve with non-existing key will just reset to clean state.
 */
function retrieveSituation(){
    let select = $('session-select');
    let val = select.value;
    let idx = select.selectedIndex;
    console.log('retrieving situation', val, 'at ', idx);
    G_canvas.clear();
    reportWindowSize();
    G_canvas.loadFromJSON(situations[val]).then((a=>{
        G_canvas.renderAll();
        G_msg = G_canvas.getObjects()[1];
        G_canvas.on({
            'object:moving':   canvasOnObjectMoving,
            'object:modified': canvasOnObjectModified,
            'path:created'   : canvasOnPathCreated
        });
        players= [];
        otherObjects= [];
        allPaths= [];
        G_canvas.getObjects().forEach(function(e){
            if('customType' in e){
                console.log('Dynamic thing', e.customType);
                switch(e.customType){
                    case 'player':
                        e.on({
                            'selected': playerOnSelected,
                            'deselected': playerOnDeselected,
                        });
                        players.push(e);
                        break;
                    case 'path':
                        break;
                    case 'other':
                        e.set({originX: 'center', originY:'center', 'lockScalingX': true, 'lockScalingY': true, hasControls: false, hasBorders: false});
                        otherObjects.push(e);
                    default:
                }
                console.log('grabbing element at current', e.leftW.toFixed(2), e.topW.toFixed(2), e.left, e.top);
                let cPos = worldToCanvas([e.leftW, e.topW]);
                e.set({left: cPos.left, top: cPos.top});
                console.log('position is now', e.leftW.toFixed(2), e.topW.toFixed(2), e.left, e.top);
            }
            else{
                console.log('static thing', e);
                e.set({selectable: false});
            }
        })
        unsetDirty();
    }));
}
/**
 * Delete situation
 */
function deleteSituation(){
    let select = $('session-select');
    let val = select.value;
    let idx = select.selectedIndex;
    console.log('delete situation', val, 'at ', idx);
    select.options.remove(idx);
    situations[val]='';
    delete situations[val]


    if(select.options.length==1){
        select.disabled=true;
        document.getElementById('idUpdateSit').classList.add('disabled');;
        document.getElementById('idDeleteSit').classList.add('disabled');;
    }
}
function saveWorkspace(){
    // Clean up objects in situations that have a src,
    // and remove the http.../-part of the path.
    let bp=basePath();
    Object.keys(situations).forEach(function(k){
        situations[k].objects.forEach(function(o){
            if(o.src && o.src.startsWith(bp)){
                o.src = o.src.substring(bp.length);
            }
        })
    });
    // (A) CREATE BLOB OBJECT
    let myBlob = new Blob([JSON.stringify({
        canvas:{
            width: G_canvas.width,
            height: G_canvas.height,
            viewportTransform: G_canvas.viewportTransform,
            vptCoords: G_canvas.vptCoords,
        },
        situations: situations,
    })], {type: "text/plain"});
    // (B) CREATE DOWNLOAD LINK
    let url = window.URL.createObjectURL(myBlob);
    let anchor = document.createElement("a");
    anchor.href = url;
    console.log(url);
    // TODO: Test on mobiles what happens if this is unset
    anchor.download = "demo2.json";

    // (C) "FORCE DOWNLOAD"
    // NOTE: MAY NOT ALWAYS WORK DUE TO BROWSER SECURITY
    // BETTER TO LET USERS CLICK ON THEIR OWN
    anchor.click();
    //window.URL.revokeObjectURL(url);
    //document.removeChild(anchor);
}
function loadWorkspace(){
    reportWindowSize();
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
        // you can use this method to get file and perform respective operations
        let files =   Array.from(input.files);
        console.log(files);
        let fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(files[0]);
        function receivedText(e){
            let data = JSON.parse(e.target.result);
            let cData = data.canvas;
            console.log(cData);
            situations = data.situations;
            let select = $('session-select');
            select.disabled = false;
            // Remove all existing situations, keep only hidden
            select.innerHTML='<option hidden value="">Situations</option>';
            // iterate over keys and add option
            Object.keys(situations).sort().forEach(function(k){
                //console.log(k)
                let option = document.createElement('option');
                option.text = k;
                select.add(option);
            });
            // Select the first visible option
            // and trigger redraw
            if(select.options.length > 1){
                select.selectedIndex=1;
                select.disabled=false;
                retrieveSituation();
                document.getElementById('idDeleteSit').classList.remove('disabled');;
            }
        }
    }
    // Trigger the whole story
    input.click();
}
/* **************************************************************************************** */
/* *** E V E N T H A N D L E R S ********************************************************** */
/* **************************************************************************************** */
/**
 * find any in list, and remove if found from canvas and list
 */
let removeAnyFromList = function(any, list){
    let idx=-1;
    for(let i=0; i< list.length; i++){
        if(list[i] === any){
            idx=i;
        }
        if(idx>-1){
            list.splice(idx,1);
            G_canvas.remove(any);
            return 0;
        }
    }
    return 1;
}
/**
 * Eventhandler of the canvas, so it has to handle several cases
 * A fabric.Group has _objects, by my convention, the center of the
 * first object determines the center.
 * For single objects, the e.transform.target is of interest and tells, where
 * the object is moving.
 * This works for ALL objects so far, nothing special for players.
 */
function canvasOnObjectMoving(e){
    setDirty();
    let ePos;
    let src;
    // TODO: Is this distinction still required?
    if(e.target && e.target._objects){
        src = e.target;
        ePos= canvasToWorld(e.target);
    }
    else{
        src = e.transform.target;
        ePos= canvasToWorld(e.transform.target);
    }
    ePos = canvasToWorld(src)
    //console.log(e.target.topW);
    e.target.topW  = ePos.top;
    e.target.leftW = ePos.left;
    // TODO: Update e.topW and e.leftW
    G_msg.set('text', 'P:' + ePos.left.toFixed(2) + '/'
                    + ePos.top.toFixed(2));
}
/**
 * If an object has moved from the field far enough, remove it from
 * the otherObjects list and from canvas.
 */
function canvasOnObjectModified(e){
    console.log('canvasOnObjectModified');
    setDirty();
    let rCX=0;
    let rCY=0;
    let collection = null;
    let G = e.target;
    if(otherObjects.includes(G)){
        console.log('    otherObject');
        collection = otherObjects;
    }
    if(players.includes(G)){
        console.log('    a Player');
        collection = players;
    }
    let ePos= canvasToWorld(e.target);
    if(collection && ((ePos.left < -1) || (ePos.left > 12) || (ePos.top<-1) || (ePos.top>12)) ){
        console.log('removing object from', collection);
        return removeAnyFromList(e.target, collection);
    }
    e.target.leftW = ePos.left;
    e.target.topW  = ePos.top;
    if( collection == players){
        $('plr-X').value = ePos.left.toFixed(2);
        $('plr-Y').value = ePos.top.toFixed(2);
        $('plr-a').value = G.angle.toFixed(2);
    }
    return 1;
}

/**
 * When a player is selected, copy its properties to the
 * GUI controls
 */
function playerOnSelected(e){
    //console.log('>>>playerOnSelected');
    $("plr-func").rumms = e.target;
    let G = e.target;
    console.log(G);
    let ePos= canvasToWorld(e.target);
    $('plr-func').value=G._objects[1].text;
    $('plr-name').value=G._objects[2].text;
    $('plr-X').value = ePos.left.toFixed(2);
    $('plr-Y').value = ePos.top.toFixed(2);
    $('plr-a').value = G.angle.toFixed(2);
    $('plr-color').value = G._objects[0].fill;
    $('txt-color').value = G._objects[1].fill;
    //console.log('<<<playerOnSelected');
}
function playerOnDeselected(e){
    console.log('Deselected');
    $("plr-func").rumms = null;
}

function pColorChange(){
    let G=$("plr-func").rumms;
    if(G){
        G._objects[0].set({fill:$('plr-color').value});
        G_canvas.requestRenderAll();
    }
}
function pAngleChange(){
    /*
       let G=$("plr-func").rumms;
       if(G){
       G.set({'angle':$('plr-a').value} );
       G_canvas.requestRenderAll();
       }
     */
}
/**
 * When a path is created, we either just make it not selectable, or
 * compute a small triangle at the end, create a group of path
 * and arrow, and finally remove the original path.
 */
function canvasOnPathCreated(e){
    if($('drawing-arrow').checked){
        console.log('with arrow');
        // Get some direction
        let pts = e.path.path.length;
        let np =  e.path.path;
        console.log(np);
        let P1 = pts-3;
        let P2 = pts-1;
        let x1 = np[P1][0] === 'Q' ? np[P1][3] : np[P1][5];
        let y1 = np[P1][0] === 'Q' ? np[P1][4] : np[P1][6];
        let x2 = np[pts-1][1];
        let y2 = np[pts-1][2];

        let xDiff = x2 - x1;
        let yDiff = y2 - y1;
        let angle = Math.atan2(yDiff, xDiff);
        //console.log(angle/3.1415926535*180);
        //angle =  $('plr-X').value*1.0
        angle = angle/3.1415926535*180;
        // Add a triangle at the last point
        let tH = 15; // 3
        let tW = 10; // 2
        let xE = x2;
        let yE = y2;
        let T = new fabric.Triangle({
            width: tW, height: tH, left: xE, top:yE,
            angle: angle+90,
            fill: e.path.stroke,
            originX:'center', originY:'center'
        });
        let G = new fabric.Group([e.path, T])
        G.set('selectable', false);
        G_canvas.remove(e.path);
        // Create a group out of this.
        G_canvas.add(G);
        allPaths.push(G);
    }
    else{
        //console.log('no arrow');
        e.path.set('selectable', false);
        allPaths.push(e.path);
    }
    setDirty();
}
function onAddLines(){
    G_canvas.isDrawingMode = !G_canvas.isDrawingMode;
    console.log(G_canvas.isDrawingMode)
    if(G_canvas.isDrawingMode){
        $('addLines').innerHTML= 'Linie'
        $("drawing-mode-selector").onchange();
        $('drawing-line-width').onchange();
        $('drawing-color').onchange();
    }
    else{
        $('addLines').innerHTML= 'Auswahl'
    }
}
function removeLines(){
    setDirty();
    //console.log('removing lines')
    allPaths.forEach(function(item){
        G_canvas.remove(item);
    });
    allPaths = [];
    //console.log('done removing')
}
