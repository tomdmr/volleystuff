/*
   T1=ANH;CAB:5;EMD:4;FAJ:2;LEB;MAH:3;MIK;PAD;PAE:6;PID:1;REZ;TAS
 */
/* Variable section */
/*********************************************/
let sctBox    = null;
let isChain   = false;
let pltBtT0   = [];
let pltBtT1   = [];
let plrBt     = [];
let rotT      = [0,0];
let srvT      = 0;
let ptsT      = [];
let btnStyle  = [];
let btnArray  = [];
let setEnd    = 25;
let firstServ = 0;
function initDentry(){
    console.log('Into DEntry()');
    btnArray = [
        [
            document.getElementById('bt00'),
            document.getElementById('bt01'),
            document.getElementById('bt02'),
            document.getElementById('bt03'),
            document.getElementById('bt04'),
            document.getElementById('bt05'),
            document.getElementById('bt06'),
            //document.getElementById('bt07'),
        ],
        [
            document.getElementById('bt10'),
            document.getElementById('bt11'),
            document.getElementById('bt12'),
            document.getElementById('bt13'),
            document.getElementById('bt14'),
            document.getElementById('bt15'),
            document.getElementById('bt16'),
        ],
        [
            document.getElementById('bt20'),
            document.getElementById('bt21'),
            document.getElementById('bt22'),
            document.getElementById('bt23'),
            document.getElementById('bt24'),
            document.getElementById('bt25'),
        ],
        [
            document.getElementById('bt30'),
            document.getElementById('bt31'),
            document.getElementById('bt32'),
            document.getElementById('bt33'),
            document.getElementById('bt34'),
            document.getElementById('bt35'),
            document.getElementById('bt36'),
        ],
        [
            document.getElementById('bt40'),
            document.getElementById('bt41'),
            document.getElementById('bt42'),
            document.getElementById('bt43'),
            document.getElementById('bt44'),
            document.getElementById('bt45'),
            document.getElementById('bt46'),
        ],
        [
            document.getElementById('bt50'),
            document.getElementById('bt60'),
            document.getElementById('bt70'),
            document.getElementById('bt51'),
            document.getElementById('bt61'),
            document.getElementById('bt71'),
            document.getElementById('bt52'),
            document.getElementById('bt62'),
            document.getElementById('bt72'),
        ],
        [],
    ];
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
    btnStyle[2]= {true: "btn-gry-act", false: 'btn-gry-pas'};
    btnStyle[3]= {true: "btn-gry-act", false: 'btn-gry-pas'};
    btnStyle[4]= {true: "btn-grn-act", false: 'btn-grn-pas'};
    btnStyle[5]= {true: "btn-yel-act", false: 'btn-yel-pas'};
    btnStyle[6]= {true: "btn-yel-act", false: 'btn-yel-pas'};
}
function onPlayer(team, player){
    let rsp= (isChain ? '': ' ');
    rsp  += team ? 'a': '*';
    console.log(rsp);
    isChain = false;
    sctBox.value += rsp + player;
    changeStateButtonCol(2, true );
}
/**
 * Trigered, when one of the skills is pressed
 * Which skill requires/allows type?
 */
function onSkill  (skill){
    if(     skill ==='r' ){
        changeStateButtonCol(3, false);
        changeStateButtonCol(4, true );
    }
    else if(skill ==='a'){
        changeStateButtonCol(3, true );
        changeStateButtonCol(4, true );
    }
    else if(skill ==='b'){
        changeStateButtonCol(3, false);
        changeStateButtonCol(4, true );
    }
    else if(skill ==='d'){
        changeStateButtonCol(3, false);
        changeStateButtonCol(4, true );
    }
    else if(skill ==='e'){
        changeStateButtonCol(3, true );
        changeStateButtonCol(4, true );
    }
    else if(skill ==='f'){
        changeStateButtonCol(3, false);
        changeStateButtonCol(4, true );
    }
    else{
        console.log('Unknown skill: '+skill);
    }
    sctBox.value += skill;
    window.navigator.vibrate(1000);
    window.navigator.vibrate(0);
    console.log('Disable skill, enable quality');
    changeStateButtonCol(2, false);
}
function onType   (type){
    if(     type === 'h'){}
    else if(type === 'm'){}
    else if(type === 'q'){}
    else if(type === 't'){}
    else if(type === 'u'){}
    else if(type === 'f'){}
    else if(type === 'o'){}
    else{
        console.log('Unknown play-type '+type);
    }
    sctBox.value += type;
    ['H', 'M', 'Q', 'T', 'U', 'F', 'O'].forEach(function(val, idx){
        btnArray[3][idx].value = val;
    })
    changeStateButtonCol(3, false);
    changeStateButtonCol(4, true);
    changeStateButtonCol(5, true);
}
function onQuality(qual){
    if(     qual === '#'){}
    else if(qual === '+'){}
    else if(qual === '!'){}
    else if(qual === '-'){}
    else if(qual === '/'){}
    else if(qual === '='){}
    else{
        console.log('Unknown quality '+ qual);
    }
    sctBox.value += qual;
    changeStateButtonCol(4, false);
}
function onChain(){
    sctBox.value += '.';
    isChain = true;
    changeStateButtonCol(4, false);
    //changeStateButtonCol(2, true);
}
function onHomeField(btn){
    changeStateButtonCol(5, false);
    changeStateButtonCol(6, true );
    sctBox.value += this.value;
}
function onGuestField(btn){
    changeStateButtonCol(6, false);
    sctBox.value += this.value;
}

function setServ(team){
    firstServ = team;
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
    ['Standing','Jmp Flt', 'Jmp Rot', 'T', 'U', 'F', 'Other'].forEach(function(val, idx){
        btnArray[3][idx].value = val;
    })
    changeStateButtonCol(2, false);
    changeStateButtonCol(3, true);
}

/**
 * Wird ausgelöst, wenn eine Ralley abgeschlossen ist und ein Punkt
 * zugeordnet wird.
 */
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

    let aTeam = team;
    let bTeam = 1-team;
    let ptsA = ptsT[aTeam].value;
    let ptsB = ptsT[bTeam].value;
    if(ptsA >= setEnd && ptsA-ptsB > 1){
        console.log('Team '+team+' hat Satz gewonnen');
        let setA = Number(document.getElementById('set'+aTeam).innerHTML);
        let setB = Number(document.getElementById('set'+bTeam).innerHTML);
        setA += 1;
        document.getElementById('set'+aTeam).innerHTML = setA;
        ptsT[0].value = ptsT[1].value = rotT[0] = rotT[1] = 0;
        // FIXME: 0 or 1.
        setServ(1-firstServ);
        return;
    }

    ['Standing','Jmp Flt', 'Jmp Rot', 'T', 'U', 'F', 'Other'].forEach(function(val, idx){
        btnArray[3][idx].value = val;
    })
    changeStateButtonCol(2, false);
    changeStateButtonCol(3, true);
}
/**
 *
 */
function changeStateButtonCol(col, enabled){
    console.log('changeState '+col+' to '+enabled);
    //console.log(btnArray[col][0]);
    //console.log(btnStyle[col][enabled]);
    btnArray[col].forEach(function(item){
        item.disabled = !enabled;
        item.classList = 'w3-btn '+ btnStyle[col][enabled];
    });
}
function transferT0(){
    for(i=0; i<12; i++){
        let p = document.getElementById('pa'+i).value;
        if( p>0){
            let t = document.getElementById('a'+i).value;
            plrBt[0][p-1].value = t;
        }
    }
    for(i=0; i<12; i++){
        let p = document.getElementById('pb'+i).value;
        if( p>0){
            let t = document.getElementById('b'+i).value;
            plrBt[1][p-1].value = t;
        }
    }
}
function copyHistory() {
    console.log('Try to copy');
    var copyText = document.getElementById("sctHist");
    copyText.select();
    document.execCommand("copy");
}
