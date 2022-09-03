function onObjectMoving(e){
    //console.log(e);
    let X = e.target.left + e.target.UserData.dX - cEdge;
    let Y = e.target.top  + e.target.UserData.dY - cEdge;
    e.target.UserData.loc[0] = X/cSize*9.0;
    e.target.UserData.loc[1] = Y/cSize*9.0;
    G_msg.set('text', 'P:' + e.target.UserData.loc[0].toFixed(2) + '/'
              + e.target.UserData.loc[1].toFixed(2));
}

function canvasOnPathCreated(e){
    console.log('path-created event');
    console.log($('drawing-arrow').checked);
    if($('drawing-arrow').checked){
        console.log('with arrow');
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
        console.log(angle/3.1415926535*180);
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
        console.log('no arrow');
        e.path.set('selectable', false);
        allPaths.push(e.path);
    }
}

function playerOnMouseDown(e){
    console.log(e.e);// e.e.ctrlKey => delete player?
    console.log(e.target);
    playerSelected = -1;
    players.forEach(function(item, i){
        if( item === e.target ){
            playerSelected = i;
        }
    });
    console.log(playerSelected);
    // Copy attributes to dialog area
    $("playerAttributes").rumms = e.target;
    $('plr-func').value = e.target.UserData.func;
    $('plr-name').value = e.target.UserData.name;
    $('plr-X').value = e.target.UserData.loc[0].toFixed(2);
    $('plr-Y').value = e.target.UserData.loc[1].toFixed(2);
    $('plr-color').value = e.target.UserData.pcolor;
    $('txt-color').value = e.target.UserData.tcolor;
}

function playerOnMoving(e){
    let s = e.transform.target;
    let X = s.left + s.UserData.dX - cEdge;
    let Y = s.top  + s.UserData.dY - cEdge;
    s.UserData.loc[0] = X/cSize*9.0;
    s.UserData.loc[1] = Y/cSize*9.0;
    G_msg.set('text', 'P:' + s.UserData.loc[0].toFixed(2) + '/'
              + s.UserData.loc[1].toFixed(2));
}
function playerOnModified(e){
    console.log('Player modified');
    //console.log(e);
    console.log(e.target);
    //console.log(e.target.UserData);
    $("playerAttributes").rumms = e.target;
    $('plr-func').value = e.target.UserData.func;
    $('plr-name').value = e.target.UserData.name;
    $('plr-X').value = e.target.UserData.loc[0].toFixed(2);
    $('plr-Y').value = e.target.UserData.loc[1].toFixed(2);
    $('plr-color').value = e.target.UserData.pcolor;
    $('txt-color').value = e.target.UserData.tcolor;
}


