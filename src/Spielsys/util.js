/**
 *
 */
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
            .substr(1)
            .split("&")
            .forEach(function (item) {
                tmp = item.split("=");
                if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
            });
    return result;
}
/**
 * Convert from wondows positons to canvas position. x and y
 */
function xF(x, y){
    return {left: x + 50 - 16, top: y + 50 -16};
}

/**
 * Convert from wondows positons to canvas position, parameter as p.x and p.y
 */
function xFPos(p){
    return {left: p.x + 50 - 16, top: p.y + 50 -16};
}

function createCourt(){
    let pf = new fabric.Path('M 0 0 L 300 0 L 300 300 L 0 300 L 0 0 z M 0 100 L 300 100 z');
    pf.set({left: 50, top: 50, strokeWidth: 3, stroke: 'blue', fill: 'rgba(224, 224, 255,1.0)' });
    pf.set('selectable', false);
    return pf;
}
function createCourt2(posX, posY, size){
    let m3 = size/3;
    let pf = new fabric.Path('M 0 0L' + size + ' 0L'+size+' '+size+'L0 '+size+'L0 0 zM0 '+m3+'L'+size+' '+m3+' z');
    //pf.set({left: posX, top: posY, strokeWidth: 3, stroke: 'blue', fill: 'rgba(224, 224, 255,1.0)' });
    pf.set({left: 50, top: 50, strokeWidth: 3, stroke: 'blue', fill: '#E0E0FF' });
    pf.set('selectable', false);
    return pf;
}
function createPlayer2(x, y, func, name, pcolor, size=1, tcolor='#000'){
    let r = 16;
    let fs=12;
    if(size>1){
        r  = 24;
        fs =17;
    }
    let C  = new fabric.Circle({radius: 16, originX:'center', originY:'center', fill: pcolor } );
    let T1 = new fabric.Text(func,  {fontSize: fs, originX: 'center', originY: 'center', fill: tcolor });
    // Fixme: pos?
    let T2 = new fabric.Text(name,  {fontSize: fs, originX: 'center', originY: 'center' , top : r});
    let P  = new fabric.Group([C, T1, T2], {left: x+r/2, top: y+r/2})
    P.set('lockScalingX', true);
    P.set('lockScalingY', true);
    P.hasControls = P.hasBorders = false;
    P.UserData= { dX : r/2, dY: r/2};
    return P;
}
/**
 * Die 50 Offset kommen von der Verschiebung des Courts um 50. Die 16 vom Kreisradius
 */
function createPlayer(rotation, name, x, y){
    if((rotation>1) && (rotation<5)){
	    color = '#C0FFC0';
    }else{
	    color = '#FFC0C0';
    }

    var C = new fabric.Circle({radius:16, originX:'center', originY:'center', fill: color });
    var T = new fabric.Text(name+'-'+rotation,  {fontSize: 12, originX: 'center', originY: 'center' });
    var P = new fabric.Group([ C, T ], {left: x+50-16, top: y+50-16 }); /* 318, 318*/
    P.set('lockScalingX', true);
    P.set('lockScalingY', true);
    P.hasControls = P.hasBorders = false;
    return P;
}

function setPlayersBasePosition( P, anim){
    var xP = [ 270, 270, 150,  30,  30, 150 ];
    var yP = [ 270, 130, 130, 130, 270, 270 ];
    var i;
    let pW= P[0].width / 2;
    if(anim){
	    for(i=0; i<6; i++){
	        P[i].animate({left: xP[i]+50-pW, top: yP[i]+50-pW},
			             { onChange: canvas.renderAll.bind(canvas) }) ;
	    }
    }else{
	    for(i=0; i<6; i++){
	        P[i].set( {left: xP[i]+50-pW, top: yP[i]+50-pW}) ;
	    }
    }
}
function createAllPlayers( names ){
    // Spielerpositionen
    var i;
    // Array with 6 elements
    var R =[1,2,3,4,5,6];
    for(i=0; i<6; i++){
	    R[i] = createPlayer(i+1, names[i] , 0, 0);
    }
    setPlayersBasePosition(R, false);
    return R;
}

function makeAllPlayers( rot, _SPSYS ){
    function name42a(rot, pos){
        var f = (rot+pos) % 3;
        var id;
        switch(f){
            case 0 : id = "H"; break;
            case 1 : id = "M"; break;
            case 2 : id = "S"; break;
        }
        f = 2-Math.floor((rot+pos+2)/3) % 2;
        id = id+f;//+ '-' + pos;

        return id;
    }
    function name51(rot, pos){
        var f = (rot+pos) % 3;
        var id;
        switch(f){
            case 0 : id = "H"; break;
            case 1 : id = "M"; break;
            case 2 : id = "S"; break;
        }
        f = 2-Math.floor((rot+pos+2)/3) % 2;
        id = id+f;//+ '-' + pos;
        if( id == "S2" )
            id = "D";
        return id;
    }


    // Spielerpositionen
    var i;
    // Array with 6 elements
    var R =[1,2,3,4,5,6];
    for(i=0; i<6; i++){
        if(_SPSYS=="5_1"){
            R[i] = createPlayer(i+1, name51(rot, i+1) , 0, 0);
        }
        else if(_SPSYS=="4_2a"){
            R[i] = createPlayer(i+1, name42a(rot, i+1) , 0, 0);
        }
        else{
            R[i] = createPlayer(i+1, name42(rot, i+1) , 0, 0);
        }
    }
    setPlayersBasePosition(R, false);
    return R;
}

function makeAllPlayersExt( rot, _SPSYS, players ){
    // Spielerpositionen
    var i;
    // Array with 6 elements
    var R =[1,2,3,4,5,6];
    for(i=0; i<6; i++){
        var name = players[ (rot-1+i) % 6 ];
        R[i] = createPlayer(i+1, name/*name51(rot, i+1)*/ , 0, 0);
    }
    setPlayersBasePosition(R, false);
    return R;
}

function moveAll(objects, targets){
    objects.forEach(function(item,idx){
        item.animate(targets[idx], {onChange: G_canvas.renderAll.bind(G_canvas)});
    });
}
