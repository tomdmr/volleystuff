let animationRunning = 0;
/* Position der Abwehrspieler im Riegel */
let
rcvPos= {
    r4: [{x: 37.5,y:210}, {x:112.5, y:240}, {x:187.5, y:240}, {x:262.5, y:210},],
    r3: [{x:  65, y: 210}, {x: 150, y: 240}, {x: 235, y: 210},]
};
/************* Postionen für die Annahme **************/
let K1_0 = {
    s4_2: {
        r3:[
            { d: [ 4, 5, 0 ],    s:  {idx: 3, x: 230, y: 32 }, o: [{idx: 2, x: 265, y: 30 },{idx:1, x:285, y:100} ], },
            { d: [ 4, 5, 0 ],    s:  {idx: 2, x: 230, y: 32 }, o: [{idx: 1, x: 285, y:100 },{idx:3, x: 20, y:100} ], },
            { d: [ 4, 5, 0 ],    s:  {idx: 1, x: 230, y: 32 }, o: [{idx: 2, x: 175, y: 30,},{idx:3, x: 16, y:100} ], },
            { d: [ 4, 5, 1 ],    s:  {idx: 0, x: 268, y:227 }, o: [{idx: 2, x: 150, y: 30 },{idx:3, x: 16, y:100} ], },
            { d: [ 4, 0, 1 ],    s:  {idx: 5, x: 135, y: 48 }, o: [{idx: 2, x: 150, y: 16 },{idx:3, x: 20, y:100} ], },
            { d: [ 5, 0, 1 ],    s:  {idx: 4, x:  35, y: 45 }, o: [{idx: 2, x: 115, y: 16 },{idx:3, x: 16, y: 16} ], },
        ],
        r4:[
            { d: [ 4, 5, 0, 1 ], s:  {idx: 3, x: 190, y: 30 }, o: [{idx: 2, x: 230, y: 30 },], },
            { d: [ 4, 5, 0, 1 ], s:  {idx: 2, x: 225, y: 30 }, o: [{idx: 3, x:  16, y:100 },], },
            { d: [ 3, 4, 5, 0 ], s:  {idx: 1, x: 235, y: 32 }, o: [{idx: 2, x: 175, y: 30 },], },
            { d: [ 3, 4, 5, 2 ], s:  {idx: 0, x: 284, y:225 }, o: [{idx: 1, x: 285, y: 16 },], },
            { d: [ 3, 4, 0, 1 ], s:  {idx: 5, x: 150, y: 48 }, o: [{idx: 2, x: 150, y: 16 },], },
            { d: [ 2, 5, 0, 1 ], s:  {idx: 4, x:  70, y: 40 }, o: [{idx: 3, x:  16, y: 16 },], },
        ],
    },
    s5_1: {
        r3:[
            { d: [ 4, 5, 1 ],    s:  {idx: 0, x: 268, y:227 }, o: [{idx: 2, x: 150, y: 30 },{idx:3, x: 20, y: 30} ], },
            { d: [ 3, 4, 0 ],    s:  {idx: 5, x: 165, y: 48 }, o: [{idx: 2, x: 150, y: 16 },{idx:1, x:280, y:100} ], },
            { d: [ 2, 5, 0 ],    s:  {idx: 4, x: 125, y: 30 }, o: [{idx: 1, x: 283, y:100 },{idx:3, x: 17, y:100} ], },
            { d: [ 1, 4, 5 ],    s:  {idx: 3, x:  19, y: 19 }, o: [{idx: 2, x:  30, y: 60 },{idx:0, x:283, y:283} ], },
            { d: [ 3, 4, 0 ],    s:  {idx: 2, x: 225, y: 35 }, o: [{idx: 1, x: 285, y:100 },{idx:5, x:225, y:281} ], },
            { d: [ 2, 5, 0 ],    s:  {idx: 1, x: 245, y: 35 }, o: [{idx: 3, x:  15, y:100 },{idx:4, x:115, y:281} ], },
        ],
        r4:[
            { d: [ 3, 4, 5, 1 ], s:  {idx: 0, x: 284, y:225 }, o: [{idx: 2, x: 150, y: 30 },], },
            { d: [ 3, 4, 0, 1 ], s:  {idx: 5, x: 150, y: 48 }, o: [{idx: 2, x: 150, y: 16 },], },
            { d: [ 2, 5, 0, 1 ], s:  {idx: 4, x:  70, y: 40 }, o: [{idx: 3, x:  17, y:100 },], },
            { d: [ 4, 5, 0, 1 ], s:  {idx: 3, x:  70, y: 40 }, o: [{idx: 2, x:  50, y:100 },], },
            { d: [ 4, 5, 0, 1 ], s:  {idx: 2, x: 225, y: 35 }, o: [{idx: 3, x:  15, y:100 },], },
            { d: [ 4, 5, 0, 2 ], s:  {idx: 1, x: 275, y: 35 }, o: [{idx: 3, x:  15, y:100 },], },
        ],
    },
}
// Position der nicht-Annahe Spieler während der Annahme (vor Pass)
let K1_1 = {
    s4_2:[
        [{idx:1, x:150, y: 100}, {idx:2, x:275, y:100} ],
        [{idx:1, x:300, y: 100}, {idx:2, x:175, y:100} ],
        [{idx:3, x:  5, y: 100}, {idx:2, x:175, y:100} ],
        [{idx:3, x:  5, y: 100}, {idx:2, x:175, y:100} ],
        [{idx:2, x:175, y: 100}, {idx:1, x:300, y: 100}],
        [{idx:3, x:  5, y: 100}, {idx:1, x:300, y: 100}],
    ],
    s5_1:[
        [{idx:3, x:  5, y: 100}, {idx:2, x:175, y:100} ],
        [{idx:2, x:300, y: 100}, {idx:1, x:175, y:100} ],
        [{idx:1, x:300, y: 100}, {idx:3, x:175, y:100} ],
        [{idx:0, x:300, y: 100}, {idx:2, x:175, y:100} ],
        [{idx:1, x:175, y:100 } ],
        [{idx:4, x:281, y: 281}, {idx:3, x:175, y:100} ],
    ],
}
/* Aufstellen im Annahmeriegel */
function doK1_0(sys, rot, rieg, Q){
    let def = rieg ? 'r3' : 'r4';
    console.log('System: ' + sys + ', Annahme: '+ def + ' Rotation ' + rot);
    let sit = K1_0['s'+sys][def][rot];
    sit.d.forEach(function(item, idx){
        Q[item].animate( xFPos(rcvPos[def][idx]));
    });
    sit.o.forEach(function(item){
        Q[item.idx].animate( xFPos(item));
    });
    animationRunning = 1;
    Q[sit.s.idx].animate(xFPos(sit.s), { onChange: canvas.renderAll.bind(canvas), onComplete: animationRunning = 0 })
    Phase = 1;
}
let K1_3Pos0 = [
    [ {x:225, y: 35}, {x:  5,y:100}, {x:175,y:100}, {x:300,y:100}, {x:112.5,y:200}, {x:187.5,y:200}, ],
    [ {x:225, y: 35}, {x:  5,y:100}, {x:175,y:100}, {x:300,y:185}, {x:112.5,y:200}, {x:187.5,y:200}, ],
];
let K1_3Pos1 = [
    [
        [ {x:225, y: 35}, {x: 25,y:45}, {x:120,y: 65}, {x:215,y:100}, {x: 15  ,y:185}, {x: 135 ,y:160}, ],
        [ {x:225, y: 35}, {x: 82,y:54}, {x:160,y: 45}, {x:270,y: 80}, {x:125  ,y:134}, {x: 213 ,y:132}, ],
        [ {x:225, y: 35}, {x: 95,y:40}, {x:160,y: 87}, {x:275,y: 45}, {x: 200 ,y:140}, {x:285  ,y:145}, ],
    ],
    [
        [ {x:225, y: 35}, {x: 25,y:45}, {x:120,y: 65}, {x:215,y:100}, {x: 15  ,y:185}, {x: 135 ,y:160}, ],
        [ {x:225, y: 35}, {x: 82,y:54}, {x:160,y: 45}, {x:270,y: 80}, {x:125  ,y:134}, {x: 213 ,y:132}, ],
        [ {x:225, y: 35}, {x: 95,y:40}, {x:160,y: 87}, {x:285,y:140}, {x: 205 ,y:135}, {x:225  ,y:200}, ],
    ],
];

let K1_30={
    s4_2:[ // Steller, links, mitte, rechts, LB, RB
        [3, 3, 1, 2, 4, 5],
        [5, 3, 2, 1, 4, 0],
        [1, 3, 2, 0, 4, 5],
        [0, 3, 2, 1, 4, 5],
        [5, 3, 2, 1, 4, 0],
        [4, 3, 2, 1, 5, 0],
    ],
    s5_1:[
        [0, 3, 2, 1, 4, 5],
        [5, 3, 1, 2, 4, 0],
        [4, 2, 3, 1, 5, 0],
        [3, 1, 2, 0, 4, 5],
        [2, 3, 1, 5, 4, 0],
        [1, 2, 3, 4, 5, 0],
    ],
}
function doK1_1(spsys, rot, rieg, Q){
    let xt = fabric.util.getRandomInt( 50, 350);
    let yt = fabric.util.getRandomInt(150, 330);
    let dmin = 1e5;
    let pp = -1;
    B.set({left:150, top:5});
    // Finde den nächsten Annahmespieler
    let def = rieg ? 'r3' : 'r4';
    console.log('Into doK1_1 with spsys: '+spsys+' rieg: '+rieg+' def: '+def);
    let sit = K1_0['s'+spsys][def][rot];
    sit.d.forEach(function(item, idx){
        //console.log('Player: '+item);
        pos = xF(rcvPos[def][idx].x, rcvPos[def][idx].y);
        //console.log(pos);
        let d = Math.pow(xt-pos.left,2) + Math.pow(yt-pos.top,2);
        if(d<dmin){
            dmin=d;
            pp=sit.d[idx];
        }
    });
    // Steller
    Q1[sit.s.idx].animate(xF(225, 35));
    console.log('Steller: '+sit.s.idx);
    // AnnahmeSpieler
    Q1[pp].animate( {left: xt, top:yt+15},
                    {easing: fabric.util.ease.easeInOutQuad});
    // Rest
    K1_1['s'+ spsys][rot].forEach(function(item){
        console.log('item.idx: '+item.idx);
        console.log('pp: '+pp);
        if(item.idx != pp )
            Q1[item.idx].animate(xF(item.x, item.y));
    });
    //Ball
    setTimeout(function(){
        B.animate( {left: xt, top:yt}, { onChange: canvas.renderAll.bind(canvas),})}, 1000);
    console.log('Done doK1_1');
}
function doK1_2(spsys, rot, Q){
    console.log('Running doK1_2 with spsys: s'+spsys);
    K1_30['s'+spsys][rot].forEach(function(item, idx){
        //console.log(item);
        //console.log(K1_3Pos0[Math.floor(rot/3)][idx]);
        Q[item].animate(xFPos(K1_3Pos0[Math.floor(rot/3)][idx]));
    });
    // Ball zum Steller
    B.animate(xF(230,20),{onChange: canvas.renderAll.bind(canvas)});
    console.log('done running doK1_2');
}
function doK1_3(spsys, rot, state, Q){
    console.log('Running doK1_3');
    B.set(xF(230,20));
    K1_30['s'+spsys][rot].forEach(function(item, idx){
        //console.log(item);
        //console.log(K1_3Pos0[Math.floor(rot/3)][idx]);
        Q[item].set(xFPos(K1_3Pos0[Math.floor(rot/3)][idx]));
    });

    K1_30['s'+spsys][rot].forEach(function(item, idx){
        //console.log(item);
        //console.log(K1_3Pos1[Math.floor(rot/3)][state][idx]);
        Q[item].animate(xFPos(K1_3Pos1[Math.floor(rot/3)][state][idx]));
    });
    switch(state){
        case 0:
            B.animate(xF( 55,35),{onChange: canvas.renderAll.bind(canvas)});
            break;
        case 1:
            B.animate(xF(180,35),{onChange: canvas.renderAll.bind(canvas)});
            break;
        case 2:
            if(rot>2)
                B.animate(xF(295,120),{onChange: canvas.renderAll.bind(canvas)});
            else
                B.animate(xF(295,35),{onChange: canvas.renderAll.bind(canvas)});
            break;
    }

}

let K2Pos = [
    [ {x:110,y: 20}, {x:160,y: 20}, {x:225,y: 20}, {x: 70,y:160}, {x:160,y:230}, {x:250,y:160}, ],
    [ {x: 40,y: 20}, {x: 70,y: 20}, {x:170,y: 40}, {x: 15,y:175}, {x:160,y:230}, {x:230,y:140}, ],
    [ {x:140,y: 20}, {x:170,y: 20}, {x:250,y: 50}, {x: 35,y:120}, {x:150,y:230}, {x:250,y:165}, ],
    [ {x:110,y: 50}, {x:230,y: 20}, {x:260,y: 20}, {x: 40,y:170}, {x:170,y:230}, {x:285,y:170}, ],
    [ {x: 30,y:120}, {x:150,y:120}, {x:270,y:120}, {x: 90,y:220}, {x:210,y:220}, {x:225,y: 35}, ],
];
let K2_0 = [
    [1, 2, 3, 4, 5, 0], [3, 1, 2, 0, 4, 5], [2, 3, 1, 5, 0, 4],
    [1, 2, 3, 4, 5, 0], [3, 1, 2, 0, 4, 5], [2, 3, 1, 5, 0, 4],
];

function doK2(spsys, rot, state, Q){
    console.log(K2_0[rot]);
    Q1[K2_0[rot][0]].animate( xFPos(K2Pos[state][0]));
    Q1[K2_0[rot][1]].animate( xFPos(K2Pos[state][1]));
    Q1[K2_0[rot][3]].animate( xFPos(K2Pos[state][3]));
    Q1[K2_0[rot][4]].animate( xFPos(K2Pos[state][4]));
    if(rot>2 && state==4){
        Q1[K2_0[rot][5]].animate( xFPos(K2Pos[state][2]));
        Q1[K2_0[rot][2]].animate( xFPos(K2Pos[state][5]),{onChange: canvas.renderAll.bind(canvas)});
    }
    else{
        Q1[K2_0[rot][2]].animate( xFPos(K2Pos[state][2]));
        Q1[K2_0[rot][5]].animate( xFPos(K2Pos[state][5]),{onChange: canvas.renderAll.bind(canvas)});
    }
}


