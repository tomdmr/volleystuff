/*
   T1=ANH;CAB:5;EMD:4;FAJ:2;LEB;MAH:3;MIK;PAD;PAE:6;PID:1;REZ;TAS
 */
/* Variable section */
/*********************************************/
let sctBox = null;
let isChain = false;
let pltBtT0 = [];
let pltBtT1 = [];
let plrBt = [];
let rotT = [0,0];
let srvT = 0;
let ptsT = [];

function initDentry(){
    console.log('Into DEntry()');
    sctBox = document.getElementById('sctBox');
    plrBtT0 = [
        document.getElementById('bt00'),
        document.getElementById('bt01'),
        document.getElementById('bt02'),
        document.getElementById('bt03'),
        document.getElementById('bt04'),
        document.getElementById('bt05'),
    ];
    plrBtT1= [
        document.getElementById('bt10'),
        document.getElementById('bt11'),
        document.getElementById('bt12'),
        document.getElementById('bt13'),
        document.getElementById('bt14'),
        document.getElementById('bt15'),
    ];

    plrBt = [plrBtT0, plrBtT1];

    ptsT = [
        document.getElementById('pts0'),
        document.getElementById('pts1'),
    ];
    document.getElementById('divSet').style.display = 'none';
    let x  = findGetParameter("T1");
    if(x)
        x.split(';').forEach(function(plr, idx){
            let f = plr.split(':');
            document.getElementById('a'+idx).value = f[0];
            if(f.length>1)
                document.getElementById('pa'+idx).value = f[1];
            else
                document.getElementById('pa'+idx).value = '';
        });
    x  = findGetParameter("T2");
    if(x)
        x.split(';').forEach(function(plr, idx){
            let f = plr.split(':');
            document.getElementById('b'+idx).value = f[0];
            if(f.length>1)
                document.getElementById('pb'+idx).value = f[1];
            else
                document.getElementById('pb'+idx).value = '';
        });
}
function onPlayer(team, player){
    let rsp= (isChain ? '': ' ');
    rsp  += team ? 'a': '*';
    console.log(rsp);
    isChain = false;
    sctBox.value += rsp + player;
}
function onSkill  (skill){
    console.log(skill);
    sctBox.value += skill;
    window.navigator.vibrate(1000);
    window.navigator.vibrate(0);
}
function onType   (type){
    console.log(type);
    sctBox.value += type;
}
function onQuality(qual){
    sctBox.value += qual;
}
function onChain(){
    sctBox.value += '.';
    isChain = true;
}
function setServ(team){
    plrBt.forEach(function(x,t){
        x.forEach(function(item,idx){
            let cl = (idx>0) && (idx<4) ? 'bg-blue-front': 'bg-blue-back';
            item.classList = "w3-btn " + cl;
        });
    });
    srvT = team;
    plrBt[team][rotT[team]].classList.add('border-red')
    sctBox.value = (srvT==0?'*':'a')+plrBt[team][rotT[team]].value + 's';
    ptsT[0].value = ptsT[1].value = 0;

}
function onPoint(team){
    // Analyze Scouting String
    document.getElementById('sctHist').value += (sctBox.value + '\n');
    // Prepare Next
    if(team != srvT){
        console.log('rotate '+team);
        let ot = 1-team;
        plrBt[ot][rotT[ot]].classList.remove('border-red')
        // rotate
        rotT[team] = (rotT[team]+1) % 6
        plrBt[team].forEach(function(item, idx){
            let rot = (idx - rotT[team]+6) % 6;
            console.log(rot);
            if( (rot>0) && (rot<4) ){
                console.log('Front: '+idx);
                item.classList = "w3-btn bg-blue-front";
            }
            else{
                item.classList = "w3-btn bg-blue-back";
                console.log('Back: '+idx);
            }
        });
        plrBt[team][rotT[team]].classList.add('border-red')
        srvT = team;
    }
    ptsT[team].value = 1 + Number(ptsT[team].value);
    sctBox.value = (srvT==0?'*':'a')+plrBt[team][rotT[team]].value + 's';
}
function transferT0(){
    for(i=0; i<12; i++){
        let p = document.getElementById('pa'+i).value;
        if( p>0){
            let t = document.getElementById('a'+i).value;
            console.log('Have a position ' + p + ' as ' + t);
            plrBt[0][p-1].value = t;
        }
    }
    for(i=0; i<12; i++){
        let p = document.getElementById('pb'+i).value;
        if( p>0){
            let t = document.getElementById('b'+i).value;
            console.log('Have a position ' + p + ' as ' + t);
            plrBt[1][p-1].value = t;
        }
    }
}
