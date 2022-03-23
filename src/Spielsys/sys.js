var G_Spielphase = 0;
var G_Rota  = 2;      // _ROTA
var G_spSys = "5_1"; // _SPSYS
var G_canvas;
var G_msg;
var G_B;
var G_Buttons = [];
function pageLoaded(aSpSys, aRota){
    G_spSys = aSpSys
    G_Rota  = aRota;
    /* Navigation rechts, Spielsysteme */
    tmp='';
    if( G_spSys === '5_1'){
        let tmp = '<p>5-1</p><p><a href="4_2_rot'+G_Rota+'.html" id="nav0">4-2 </a></p>';
    }else{
        tmp = '<p><a href="5_1_rot'+G_Rota+'.html" id="nav0">5-1</a></p><p>4-2</p>';
    }
    console.log(tmp);
    document.getElementById('Systeme').innerHTML = tmp;
    tmp=''
    for(i=0; i<7; i++){
        if( i+1 == G_Rota){
            tmp += '<p>Rotation '+G_Rota+'</p>\n';
        }else{
            tmp += '<p><a id="nav'+(i+1)+'" href="LiLa">Rotation '+(i+1)+'</a></p>\n';
        }
    }
    console.log(tmp);
    document.getElementById('Rotationen').innerHTML=tmp;

    G_canvas = new fabric.Canvas('c');
    G_canvas.add( createCourt() )
    G_msg = new fabric.Text('/', {
        fontFamily: 'Arial',
        fontSize: 12,
        fill: 'black',
        fontWeight: 'bold',
        left: 50,
        top: 35,
        selectable: false
    });
    G_canvas.add(G_msg);
    G_canvas.on({'object:moved': function(e){
        G_msg.set('text', 'P:' + (e.target.get('left')-34).toFixed(2) + '/'
                        + (e.target.get('top')-34).toFixed(2)); }
    });
    G_B = new fabric.Image(document.getElementById('my-ball'), {
        left: 150,
        top:  0
    });
    G_B.scale(0.5);
    G_B.set('lockScalingX', true);
    G_B.set('lockScalingY', true);
    G_B.hasControls = G_B.hasBorders = false;
    G_canvas.add(G_B);

    let plNames = findGetParameter("p");
    if(plNames){
        let players = plNames.split(";");
        if(players.length == 6){
            /* Do stuff */
            Q1 = makeAllPlayersExt(G_Rota, G_spSys, players);
            // Rewrite links
            for(i=0; i<7; i++){
                var lnk = document.getElementById("nav"+i);
                if(lnk){
                    lnk.href = lnk.href + "?p=" + plNames;
                }
            }
        }else{
            Q1 = makeAllPlayers(G_Rota, G_spSys);
        }
    }else{
        Q1 = makeAllPlayers(G_Rota, G_spSys);
    }
    console.log(Q1[1]._objects[0].fill);
    Q1.forEach(function(item){G_canvas.add(item);});
    // Possible on the fly:
    //Q1[1]._objects[0].fill = 'rgba(0,255,192,1.0)';
    G_Buttons[0] = document.getElementById('mp-1');
    G_Buttons[1] = document.getElementById('mp-2');
    G_Buttons[2] = document.getElementById('mp-3');
    G_Buttons[3] = document.getElementById('mp-4');
    G_Buttons[4] = document.getElementById('mp-5');
    G_Buttons[5] = document.getElementById('mp-6');
    G_Buttons[6] = document.getElementById('mp-7');
    G_Buttons[7] = document.getElementById('mp-8');
    //doPhase0(0)
}
function changeButton(btn, caption, visibility, onClick){
    btn.innerHTML = '<center>'+caption+'</center>';
    btn.style.visibility = visibility;
    btn.onclick = onClick;
}
function doPhase0(){
    let rState = 0;
    function Annahme34(){
        console.log('Annahme34 triggered');
        rState = 1-rState;
        if(rState == 1){
            G_Buttons[1].innerHTML = '<center>3er-Riegel</center>';
        }
        else{
            G_Buttons[1].innerHTML = '<center>4er-Riegel</center>';
        }
        changeButton(G_Buttons[2], 'Annahme', 'visible',doPhase1 );
    }
    /**
     * Change onclick
     * Change Caption
     */
    console.log('doPhase0() triggered');
    changeButton(G_Buttons[1], '4er-Riegel', 'visible',Annahme34);
    for(let i = 2; i<8; i++){changeButton(G_Buttons[i], '', 'hidden', null);}

    // Reset players to home position
    // put back ball to other side
    // Reset mp-2 and toggle
    // handle phase 1
}
function doPhase1(){
    console.log('doPhase1() triggered');
    changeButton(G_Buttons[1], 'Pass', 'visible',doPhase2 );
    for(let i = 2; i<8; i++){changeButton(G_Buttons[i], '', 'hidden', null);}
}
function doPhase2(){
    console.log('doPhase2 triggered');
    function AttkLMR(){
        console.log('Angriff triggered');
        changeButton(G_Buttons[2], 'Angriff', 'visible',doPhase3 );
    }
    changeButton(G_Buttons[1], 'Links', 'visible',AttkLMR);
    for(let i = 2; i<8; i++){changeButton(G_Buttons[i], '', 'hidden', null);}
}
function doPhase3(){
    console.log('doPhase3 triggered');
    changeButton(G_Buttons[1], 'K2', 'visible',doPhase4);
    for(let i = 2; i<8; i++){changeButton(G_Buttons[i], '', 'hidden', null);}
}
function doPhase4(){
    function BlockLMRD(){
    }
    console.log('doPhase4 triggered');
    
    changeButton(G_Buttons[1], 'Block links', 'visible',BlockLMRD);
}
function doPhase5(){
    console.log('doPhase5 triggered');
}
function doPhase6(){
    console.log('doPhase6 triggered');
}
function doPhase7(){
    console.log('doPhase7 triggered');
}
