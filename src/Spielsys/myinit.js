/** Global variables
 */
var Phase;

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

function createCourt(){
    var pf = new fabric.Path('M 0 0 L 300 0 L 300 300 L 0 300 L 0 0 z M 0 100 L 300 100 z');
    pf.set({left: 50, top: 50, strokeWidth: 3, stroke: 'blue', fill: 'rgba(224, 224, 255,1.0)' });
    pf.set('selectable', false);
    return pf;
}

function createPlayer(rotation, name, x, y){
    if((rotation>1) && (rotation<5)){
	    color = 'rgba(192, 255, 192, 1.0)';
    }else{
	    color = 'rgba(255, 192, 192, 1.0)';
    }

    var C = new fabric.Circle({radius:16, originX:'center', originY:'center', fill: color });
    var T = new fabric.Text(name+'-'+rotation,  {fontSize: 12, originX: 'center', originY: 'center' });
    var P = new fabric.Group([ C, T ], {left: x+50-16, top: y+50-16 }); /* 318, 318*/
    P.set('lockScalingX', true);
    P.set('lockScalingY', true);
    //T.hasControls = T.hasBorders = false;
    //C.hasControls = C.hasBorders = false;
    P.hasControls = P.hasBorders = false;
    return P;
}
function xF(x, y){
    return {left: x + 50 - 16, top: y + 50 -16};
}
function xFPos(p){
    return {left: p.x + 50 - 16, top: p.y + 50 -16};
}
function setPlayersBasePosition( P, anim){
    var xP = [ 270, 270, 150,  30,  30, 150 ];
    var yP = [ 270, 130, 130, 130, 270, 270 ];
    var i;
    if(anim){
	    for(i=0; i<6; i++){
	        P[i].animate({left: xP[i]+50-16, top: yP[i]+50-16},
			             { onChange: canvas.renderAll.bind(canvas) }) ;
	    }
    }else{
	    for(i=0; i<6; i++){
	        P[i].set( {left: xP[i]+50-16, top: yP[i]+50-16}) ;
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
function resetSituation(){
    LCR=0;
    Phase = 0;
    document.getElementById("status").innerHTML = 'Phase:' + Phase;
    B.set({left:150, top:5});
    document.getElementById("mp-4").innerHTML = "Annahme";
    setPlayersBasePosition( Q1, true );
    canvas.renderAll();
    if( document.getElementById("li-5") ){
	    document.getElementById("li-5").style.visibility="hidden";
	    document.getElementById("mp-5").innerHTML = "Links";
    }
}
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}
function name42(rot, pos){
    var f = (rot+pos) % 3;
    var id;
    switch(f){
        case 0 : id = "M"; break;
        case 1 : id = "H"; break;
        case 2 : id = "S"; break;
    }
    f = 2-Math.floor((rot+pos+2)/3) % 2;
    id = id+f;//+ '-' + pos;

    return id;
}
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

function makeAllPlayers( rot, _SPSYS ){
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

/*
 * Use like this:
   <div class="fabric-canvas-wrapper">
   <canvas id="theCanvas"></canvas>
   </div>
 */
function resizeCanvas() {
    const outerCanvasContainer = document.getElementById('fabric-canvas-wrapper');

    const ratio          = canvas.getWidth() / canvas.getHeight();
    const containerWidth = outerCanvasContainer.clientWidth;
    const scale          = containerWidth / canvas.getWidth();
    const zoom           = canvas.getZoom() * scale;

    canvas.setDimensions({width: containerWidth, height: containerWidth / ratio});
    canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
    console.log('Done on resize');
}

/*
   window.onresize = resizeCanvas() {
   const outerCanvasContainer = document.getElementById('fabric-canvas-wrapper');

   const ratio          = canvas.getWidth() / canvas.getHeight();
   const containerWidth = outerCanvasContainer.clientWidth;
   const scale          = containerWidth / canvas.getWidth();
   const zoom           = canvas.getZoom() * scale;

   canvas.setDimensions({width: containerWidth, height: containerWidth / ratio});
   canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
   }
 */

function setK1_0(spsys, rota){
    riegel = 1 - riegel;
    doK1_0(spsys, rota, riegel, Q1);
    document.getElementById("mp-2").innerHTML = "<center>" + (riegel ? "4er-Riegel" : "3er-Riegel") + "</center>";
    document.getElementById('mp-3').style.display = 'block';
}
function setK1_1(spsys, rota){
    doK1_1(spsys, rota, riegel, Q1);
    document.getElementById('mp-2').style.display = 'none';
    document.getElementById('mp-3').style.display = 'none';
    document.getElementById('mp-4').style.display = 'block';
}

function reset(){
    document.getElementById('mp-1').style.display = 'block';
    document.getElementById('mp-2').style.display = 'block';
    document.getElementById('mp-3').style.display = 'none';
    document.getElementById('mp-4').style.display = 'none';
    document.getElementById('mp-5').style.display = 'none';
    document.getElementById('mp-6').style.display = 'none';
    document.getElementById('mp-7').style.display = 'none';
    state = bState = 0;
    setPlayersBasePosition( Q1, true);
    B.animate({left:150, top:5}, {onChange: canvas.renderAll.bind(canvas)});
}
