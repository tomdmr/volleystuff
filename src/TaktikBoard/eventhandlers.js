/**
 * Eventhandler of the canvas, so it has to handle several cases
 * A fabric.Group has _objects, by my convention, the center of the
 * first object determines the center.
 * For single objects, the e.transform.target is of interest and tells, wher
 * the object is moving.
 * This works for ALL objects so far, nothing special for players.
 */
function canvasOnObjectMoving(e){
    if(e.target && e.target._objects){
        // Some kind of group. First object determines the real center
        let G = e.target;
        let gCX = 0.25*(G.aCoords.bl.x+G.aCoords.br.x+G.aCoords.tl.x+G.aCoords.tr.x);
        let gCY = 0.25*(G.aCoords.bl.y+G.aCoords.br.y+G.aCoords.tl.y+G.aCoords.tr.y);

        let D = G._objects[0];
        let dCX = 0.25*(D.aCoords.bl.x+D.aCoords.br.x+D.aCoords.tl.x+D.aCoords.tr.x);
        let dCY = 0.25*(D.aCoords.bl.y+D.aCoords.br.y+D.aCoords.tl.y+D.aCoords.tr.y);
        let rCX = (gCX - dCX-cEdge)/cSize*9.0;
        let rCY = (gCY + dCY-cEdge)/cSize*9.0;
        G_msg.set('text', 'P:' + rCX.toFixed(2) + '/'
                        + rCY.toFixed(2));
    }
    else{
        //console.log(e);
        let G = e.transform.target;
        let rCX = (G.left -cEdge)/cSize*9.0;
        let rCY = (G.top  - cEdge)/cSize*9.0;

        //console.log(G);
        G_msg.set('text', 'P:' + rCX.toFixed(2) + '/'
                        + rCY.toFixed(2));
    }
}
/**
* When a path is created, we either just make it not selectable, or
* compute a small triangle at the end, create a group of path
* and arrow, and finally remove the original path.
*/
function canvasOnPathCreated(e){
    if($('drawing-arrow').checked){
        //console.log('with arrow');
        // Get some direction
        let pts = e.path.path.length;
        let np =  e.path.path;
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
        T = new fabric.Triangle({
            width: tW, height: tH, left: xE, top:yE,
            angle: angle+90,
            fill: e.path.stroke,
            originX:'center', originY:'center'
        });
        G = new fabric.Group([e.path, T])
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
}
/******************************************************************************/
/*
 *
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
 * If an object has moved from the field far enough, remove it from
 * the otherObjects list and from canvas.
 */
function canvasOnObjectModified(e){
    console.log('canvasOnObjectModified');
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

    if(e.target._objects){
        console.log(e.target);
        let G = e.target;
        let gCX = 0.25*(G.aCoords.bl.x+G.aCoords.br.x+G.aCoords.tl.x+G.aCoords.tr.x);
        let gCY = 0.25*(G.aCoords.bl.y+G.aCoords.br.y+G.aCoords.tl.y+G.aCoords.tr.y);

        let D = G._objects[0];
        let dCX = 0.25*(D.aCoords.bl.x+D.aCoords.br.x+D.aCoords.tl.x+D.aCoords.tr.x);
        let dCY = 0.25*(D.aCoords.bl.y+D.aCoords.br.y+D.aCoords.tl.y+D.aCoords.tr.y);
        rCX = (gCX - dCX-cEdge)/cSize*9.0;
        rCY = (gCY + dCY-cEdge)/cSize*9.0;
    }else{
        let gCX = 0.25*(G.aCoords.bl.x+G.aCoords.br.x+G.aCoords.tl.x+G.aCoords.tr.x);
        let gCY = 0.25*(G.aCoords.bl.y+G.aCoords.br.y+G.aCoords.tl.y+G.aCoords.tr.y);

        rCX = (gCX -cEdge)/cSize*9.0;
        rCY = (gCY -cEdge)/cSize*9.0;
    }
    if( (rCX < -1) || (rCX > 11) || (rCY<-1) || (rCY>11) ){
        console.log('removeing object');
        return removeAnyFromList(e.target, collection);
    }else if( collection == players){
        $('plr-X').value = rCX.toFixed(2);
        $('plr-Y').value = rCY.toFixed(2);
    }
    return 1;
}
/**
 *
 */
function playerOnSelected(e){
    console.log('playerOnSelected');
    $("playerAttributes").rumms = e.target;
    let G = e.target;
    let ePos= canvasToWorld(e.target);
    // Identisch zu top und left??
    let gCX = 0.25*(G.aCoords.bl.x+G.aCoords.br.x+G.aCoords.tl.x+G.aCoords.tr.x);
    let gCY = 0.25*(G.aCoords.bl.y+G.aCoords.br.y+G.aCoords.tl.y+G.aCoords.tr.y);

    let D = G._objects[0];
    let dCX = 0.25*(D.aCoords.bl.x+D.aCoords.br.x+D.aCoords.tl.x+D.aCoords.tr.x);
    let dCY = 0.25*(D.aCoords.bl.y+D.aCoords.br.y+D.aCoords.tl.y+D.aCoords.tr.y);

    let rCX = (gCX - dCX-cEdge)/cSize*9.0;
    let rCY = (gCY + dCY-cEdge)/cSize*9.0;

    console.log(['gCX:', gCX, 'gCY', gCY].join(' '));
    console.log(['dCX:', dCX, 'gCY', dCY].join(' '));
    console.log(['rCX:', rCX, 'rCY', rCY].join(' '));

    $('plr-func').value=G._objects[1].text;
    $('plr-name').value=G._objects[2].text;
    $('plr-X').value = rCX.toFixed(2);
    $('plr-Y').value = rCY.toFixed(2);
    $('plr-color').value = G._objects[0].fill;
    $('txt-color').value = G._objects[1].fill;
}
/**
 * Player has been modified and properties will now be reflected back into
 * the property box.
 *
 */
function playerOnModified(e){
    /*
    console.log('playerOnModified');
    //console.log(e);
    let ePos= canvasToWorld(e.target);
    if(e.target._objects){
        console.log(e.target);
        let G = e.target;
        let gCX = 0.25*(G.aCoords.bl.x+G.aCoords.br.x+G.aCoords.tl.x+G.aCoords.tr.x);
        let gCY = 0.25*(G.aCoords.bl.y+G.aCoords.br.y+G.aCoords.tl.y+G.aCoords.tr.y);

        let D = G._objects[0];
        let dCX = 0.25*(D.aCoords.bl.x+D.aCoords.br.x+D.aCoords.tl.x+D.aCoords.tr.x);
        let dCY = 0.25*(D.aCoords.bl.y+D.aCoords.br.y+D.aCoords.tl.y+D.aCoords.tr.y);
        let rCX = (gCX - dCX-cEdge)/cSize*9.0;
        let rCY = (gCY + dCY-cEdge)/cSize*9.0;
        if( (rCX < -1) || (rCX > 10)){
            // This may not be neccessary because done already by canvas handled.
            console.log('   playerOnModified: removing player');
            removeAnyFromList(e.target, players);
        }
        else{
            $('plr-X').value = rCX.toFixed(2);
            $('plr-Y').value = rCY.toFixed(2);
        }
    }
    */
}
