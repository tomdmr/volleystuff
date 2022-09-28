var $=function(id){ return document.getElementById(id)};
/**
 *
 */
function canvasToWorld(G){
    if(G._objects){
        let gCX = 0.25*(G.aCoords.bl.x+G.aCoords.br.x+G.aCoords.tl.x+G.aCoords.tr.x);
        let gCY = 0.25*(G.aCoords.bl.y+G.aCoords.br.y+G.aCoords.tl.y+G.aCoords.tr.y);

        let D = G._objects[0];
        let dCX = 0.25*(D.aCoords.bl.x+D.aCoords.br.x+D.aCoords.tl.x+D.aCoords.tr.x);
        let dCY = 0.25*(D.aCoords.bl.y+D.aCoords.br.y+D.aCoords.tl.y+D.aCoords.tr.y);
        let rCX = (gCX - dCX-cEdge)/cSize*9.0;
        let rCY = (gCY + dCY-cEdge)/cSize*9.0;
        return {left: rCX, top: rCY};
    }else{
        let rCX = (G.left -cEdge)/cSize*9.0;
        let rCY = (G.top  - cEdge)/cSize*9.0;
        return {left: rCX, top: rCY};
    }
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
        //console.log('worldToCanvas: isLeftTop: %f %f', left, top);
    }
    else{
        return undefined;
    }
    if(G && G._objects){
        let D = G._objects[0];
        let dCX = 0.25*(D.aCoords.bl.x+D.aCoords.br.x+D.aCoords.tl.x+D.aCoords.tr.x);
        let dCY = 0.25*(D.aCoords.bl.y+D.aCoords.br.y+D.aCoords.tl.y+D.aCoords.tr.y);
        console.log('dCX: %f dCY: %f', dCX, dCY);
        return {left: left*cSize/9+cEdge-dCX, top: top*cSize/9+cEdge-dCY}
    }
    else{
        return {left: left*cSize/9+cEdge, top: top*cSize/9+cEdge}
    }
}

/**
 */
function createCourt2(posX, posY, size){
    let m3 = size/3;
    let pf = new fabric.Path('M 0 0 L' + size + ' 0 L'+size+' '+size+'L 0 '+size+'L 0 0 z M 0 '+m3+' L'+size+' '+m3+' z');
    //pf.set({left: posX, top: posY, strokeWidth: 3, stroke: 'blue', fill: 'rgba(224, 224, 255,1.0)' });
    pf.set({left: posX, top: posY, strokeWidth: 3, stroke: 'blue', fill: '#E0E0FF' });
    pf.set('selectable', false);
    return pf;
}
/**
 *
 */
function createImage(id, params){
    const sizes = [1.0, 1.4, 1.7];
    let idx= (params && params.idx) ? p.idx : 1;

    let X = 4.0; let Y = 4.0;
    if(params && params.loc){X = params.loc[0]; Y = params.loc[1]; }
    let I = new fabric.Image(document.getElementById(id));
    I.scale( (params && params.scale) ? params.scale*sizes[idx] : sizes[idx]);
    I.hasControls = I.hasBorders = false;
    I.set({originX: 'center', originY:'center', 'lockScalingX': true, 'lockScalingY': true});
    I.set({left: X/9*cSize+cEdge, top: Y/9*cSize+cEdge})
    return I;
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
/**
 * stuff
 */
function createPlayer(X, Y, func, name, pcolor, size=1, tcolor='#000'){
    let r = 16;
    let fs=12;
    if(size>1){
        r  = 24;
        fs =17;
    }
    let C  = new fabric.Circle({radius: 16, originX:'center', originY:'center', fill: pcolor,
                                stroke:'#000', strokeWidth: 1  });
    let T1 = new fabric.Text(func,  {fontSize: fs, originX: 'center', originY: 'center', fill: tcolor });
    let T2 = new fabric.Text(name,  {fontSize: fs, originX: 'center', originY: 'center' , top : r});
    let P  = new fabric.Group([C, T1, T2]);
    let leftMin = 1e9;
    let topMin  = 1e9;
    P._objects.forEach(function(o){
        if (o.aCoords.bl.x < leftMin) leftMin = o.aCoords.bl.x;
        if (o.aCoords.tl.x < leftMin) leftMin = o.aCoords.tl.x;
        if (o.aCoords.tl.y < topMin)  topMin  = o.aCoords.tl.y;
        if (o.aCoords.tr.y < topMin)  topMin  = o.aCoords.tr.y;
    });
    console.log(topMin);
    P.UserData = {
        dX : -leftMin,
        dY : -topMin-r/2,
        loc: [X, Y],
        func: func,
        name: name,
        pcolor: pcolor,
        size: size,
        tcolor: tcolor
    };
    P.set({left: X/9*cSize+cEdge-P.UserData.dX, top: Y/9*cSize+cEdge-P.UserData.dY});
    P.set('lockScalingX', true);
    P.set('lockScalingY', true);
    P.hasControls = P.hasBorders = false;
    return P;
}
/*
   function createPlayer2(params){
   let X = 4.5; let Y = 4.5;
   if(params.loc){X = params.loc[0]; Y = params.loc[1]; }
   let func = (params.func)     ? params.func : '';
   let name = (params.name)     ? params.name : '';
   let pcolor = (params.pcolor) ? params.pcolor : '#C0FFC0';
   let size   = (params.size)   ? params.size: 2;
   let tcolor = (params.tcolor) ? params.tcolor: '#000';
   }
 */
/**
 */
function updatePlayer(P, func, name, pcolor, tcolor, loc){
    console.log(P);
    console.log(loc);
    P.UserData.func = func;
    P.UserData.name = name;
    P.UserData.pcolor = pcolor;
    P.UserData.tcolor = tcolor;
    P._objects[0].set('fill', pcolor);
    P._objects[1].set('fill', tcolor);
    P._objects[1].set('text', func);
    P._objects[2].set('text', name);
    P.UserData.loc = loc;
    console.log(P.UserData.dX);
    let leftMin = 1e9;
    let topMin  = 1e9;
    P._objects.forEach(function(o){
        if (o.aCoords.bl.x < leftMin) leftMin = o.aCoords.bl.x;
        if (o.aCoords.tl.x < leftMin) leftMin = o.aCoords.tl.x;
        if (o.aCoords.tl.y < topMin)  topMin  = o.aCoords.tl.y;
        if (o.aCoords.tr.y < topMin)  topMin  = o.aCoords.tr.y;
    });
    console.log(leftMin);
    P.UserData.dX = -leftMin;
    P.UserData.dY = -topMin - 12; //P._objects[0].radius;

    console.log(P.UserData);
    P.set({left: P.UserData.loc[0]/9*cSize+cEdge-P.UserData.dX, top: P.UserData.loc[1]/9*cSize+cEdge-P.UserData.dY});
    P.setCoords();
    P.dirty = true;
    G_canvas.renderAll();
}
function updatePlayer2(P, params){
    if(params.pcolor){
        P._objects[0].set('fill', params.pcolor);
        P.UserData.pcolor = params.pcolor;
    }
    if(params.tcolor){
        P._objects[1].set('fill', params.tcolor);
        P.UserData.tcolor = params.tcolor;
    }
    if(params.func){
        P.UserData.func = params.func;
        P._objects[1].set('text', params.func);
    }
    if(params.name){
        P.UserData.name = params.bane;
        P._objects[2].set('text', params.name);
    }
    let leftMin = 1e9;
    let topMin  = 1e9;
    P._objects.forEach(function(o){
        if (o.aCoords.bl.x < leftMin) leftMin = o.aCoords.bl.x;
        if (o.aCoords.tl.x < leftMin) leftMin = o.aCoords.tl.x;
        if (o.aCoords.tl.y < topMin)  topMin  = o.aCoords.tl.y;
        if (o.aCoords.tr.y < topMin)  topMin  = o.aCoords.tr.y;
    });
    P.UserData.dX = -leftMin;
    P.UserData.dY = -topMin;
    if(params.loc){
        P.UserData.loc[0] = params.loc[0];
        P.UserData.loc[1] = params.loc[1];
    }
    P.set({left: P.UserData.loc[0]/9*cSize+cEdge-P.UserData.dX, top: P.UserData.loc[1]/9*cSize+cEdge-P.UserData.dY});
    G_canvas.renderAll();
}

function calcArrowAngle(x1, y1, x2, y2) {
    let angle = 0,
        x, y;

    x = (x2 - x1);
    y = (y2 - y1);

    if (x === 0) {
        angle = (y === 0) ? 0 : (y > 0) ? Math.PI / 2 : Math.PI * 3 / 2;
    } else if (y === 0) {
        angle = (x > 0) ? 0 : Math.PI;
    } else {
        angle = (x < 0) ? Math.atan(y / x) + Math.PI : (y < 0) ? Math.atan(y / x) + (2 * Math.PI) : Math.atan(y / x);
    }

    return (angle * 180 / Math.PI);
}
