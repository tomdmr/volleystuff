let sctBox    = null;
let sctHist   = null;
let clickHist = [];           // never used
let teamList  = [{}, {} ];    // Array of objects, describing players
let plrBt     = [];           // Array of button inputs
let skillsBt  = [];           //
let typesBt   = [];
let evalsBt   = [];
let plr       = [[null, null, null, null, null, null],[null, null, null, null, null, null]];
let libSubst  = [null, null];
let left      = 1;
let firstServe= 0;
let serve     = firstServe;
let ballSide  = serve;
let points    = [0,0];
let lastPlr   = null;
let lastPlayer= '';           // Set by onPlayer
let lastSide = -1;
let lastField = '';           // set by onField
let lastSkill = '';
let chndSkill = '';
let lastSpeed = '';
let setEnd    = 25;           //
let timeRalleyStart = ''      //
let ddState = [];             // Enable state before Drag&Drop 
let gamePhase = 0;  // 0: Enter team list. finalize => 1, enter line-up, start => 2, play set
function initDentry(){
    plrBt = [
        [ document.getElementById('bt00'), document.getElementById('bt01'), document.getElementById('bt02'),
          document.getElementById('bt03'), document.getElementById('bt04'), document.getElementById('bt05'),
        ],
        [ document.getElementById('bt10'), document.getElementById('bt11'), document.getElementById('bt12'),
          document.getElementById('bt13'), document.getElementById('bt14'), document.getElementById('bt15'),
        ]
    ];
    plrBt[0].forEach(function(item,idx){item.triState=0; item.player = null, item.pos = idx, item.team = 0});
    plrBt[1].forEach(function(item,idx){item.triState=0; item.player = null, item.pos = idx, item.team = 1});
    skillsBt = [
        document.getElementById('bt20'), document.getElementById('bt21'), document.getElementById('bt22'), document.getElementById('bt23'),
        document.getElementById('bt24'), document.getElementById('bt25'), document.getElementById('bt26'),
    ];
    ['s', 'r', 'a', 'b', 'd', 'e', 'f'].forEach(function(val, idx){
        skillsBt[idx].val = val;
        skillsBt[idx].triState = 0;
    });
    typesBt = [
        document.getElementById('bt30'), document.getElementById('bt31'), document.getElementById('bt32'),
        document.getElementById('bt33'), document.getElementById('bt34'), document.getElementById('bt35'),
        document.getElementById('bt36'),
    ];
    ['H', 'M', 'Q', 'T', 'U', 'F', 'O'].forEach(function(val, idx){
        typesBt[idx].val = val;
        typesBt[idx].triState = 0;
    });
    evalsBt = [
        document.getElementById('bt40'), document.getElementById('bt41'), document.getElementById('bt42'),
        document.getElementById('bt43'), document.getElementById('bt44'), document.getElementById('bt45'),
        document.getElementById('bt46'),
    ];
    evalsBt.forEach(function(item){item.triState=0;});
    sctBox  = document.getElementById('sctBox');
    sctHist = document.getElementById('sctHist');
    sctBox.value = sctHist.value = '';
    plrBt[0][0].classList.add('border-red')
    //document.getElementById('divSet').style.display = 'none';
    //document.getElementById('divTeam').style.display = 'none';
    /*
       window.onbeforeunload = function () {
       return 'Are you sure you want to leave?';
       }
     */
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    for(j=0; j<2; j++){
        let inpPlr = document.getElementsByName('pTag'+j)
        let inpLib = document.getElementsByName('lTag'+j)
        if(urlParams.has('T'+j)){
            let T1 = urlParams.get('T'+j);
            T1.split(';').forEach(function(player,idx){
                plrPos = player.split('?');
                if(plrPos[0].endsWith(',L')){
                    inpPlr[idx].value = plrPos[0].slice(0,-2);
                    inpLib[idx].checked = true;
                }else{
                    inpPlr[idx].value=plrPos[0];
                    inpLib[idx].checked = false;
                }
                let tg = inpPlr[idx].id.slice(-1);
                transferOnePlayer(j,tg);
                if(plrPos.length>1){
                    let pPos = plrPos[1]-1;
                    plrBt[j][pPos].player = teamList[j][tg];
                    plrBt[j][plrPos[1]-1].value  = teamList[j][tg].tag;
                    plr[j][pPos] = teamList[j][tg];
                }
            });
        }
    }
    //document.getElementsByName('btnHead').forEach(function(item){item.disabled=true;});
    document.getElementById('btnStart').disabled= !checkCanStart();
    disablePlayers(0);
    disablePlayers(1);
    disableField(0);
    disableSkills();
    disableTypes();
    disableEvals();
    //toggleVisibility('divTeam')
    disablePlrXch();
    console.log(plr);
    console.log('done initDentry');
    gamePhase = 0;
}
function transferOnePlayer(team, key){
    // if exists, return
    if( key in teamList[team] )
        return;
    // build player, add to team list, ro entries
    let pTag = document.getElementById('pTag'+team+key);
    let lTag = document.getElementById('lTag'+team+key);
    let player = {};
    player.tag = pTag.value.trim();
    if(player.tag.length==0)
        return;
    player.isLibero = lTag.checked;
    teamList[team][key] = player;
    // Enable dragging items
    pTag.readOnly  = true;
    pTag.draggable = true;
    lTag.disabled  = true;
    if(team==0){
        pTag.addEventListener('dragstart', function(ev){
            drag(ev);
            ddState = pushDragDrop(1-left)
        });
        pTag.addEventListener('dragend', function(ev){
            popDragDrop(1-left, ddState);
        })
    }else{
        pTag.addEventListener('dragstart', function(ev){
            drag(ev);
            ddState = pushDragDrop(left)
        });
        pTag.addEventListener('dragend', function(ev){
            popDragDrop(left, ddState);
        })
    }
}
/**
 * @transferTeams: Get team list into variable teamList.
 */
function transferTeams(){
    // Enable drag and drop 
    plrBt.forEach(function(team){
        team.forEach(function(bt){
            bt.addEventListener('dragover', function(ev){
                ev.preventDefault();
            });
            bt.addEventListener('drop', function(ev){
                ev.preventDefault();
                let data = ev.dataTransfer.getData('text/plain');
                let team = parseInt(data[0]);
                let player = teamList[team][data[1]];
                console.log('drop data: '+data);
                console.log('dropping on '+ev.target.id);
                console.log('in game phase '+gamePhase);
                console.log(plr[team]);
                if( gamePhase == 1){
                    // Line up, accept all but libero
                    if( !player.isLibero ){
                        console.log('drop OK')
                        ev.target.player = player;
                        ev.target.value  = player.tag;
                        plr[team][ev.target.pos] = player;
                    }
                    document.getElementById('btnStart').disabled = !checkCanStart();
                }
                else if(gamePhase == 2){
                    console.log('drop in phase 2');
                    if(player.isLibero){
                        console.log('Try to get libero in');
                        if( libSubst[team]){
                            // We already have a libero, refuse
                            console.log('Already libero on field, refused');
                            return;
                        }
                        else{
                            console.log('libero subst: Libero for ');
                            console.log(ev.target.player);
                            libSubst[team]   = ev.target.player;
                            ev.target.player = player;
                            plr[team][ev.target.pos] = player;
                        }
                    }
                    else{
                        console.log('Try to get regular in');
                        if(ev.target.player.isLibero){
                            console.log('Kicking out libero');
                            libSubst[team]=null
                        }
                        ev.target.player = player;
                        plr[team][ev.target.pos] = player;
                    }
                    startRalley();
                }
            });
        });
    });
    /* Build team list for header */
    for(let j=0; j<2; j++){
        let inpPlr = document.getElementsByName('pTag'+j);
        inpPlr.forEach(function(item, idx){
            let listPos = item.id.substring(5);
            transferOnePlayer(j,listPos);
        });
    }
    sctHist.value = '';
    for(let j=0; j<2; j++){
        let x= j ? "@Away:" : "@Home:";
        for(const [key, value] of Object.entries(teamList[j])){
            x += value.tag + (value.isLibero ? "=L": "") +";";
        }
        sctHist.value += (x+'\n');
    }
    gamePhase = 1;
}

function checkCanStart(){
    let OK = true;
    plrBt.forEach(function(t,idxT){
        t.forEach(function(item, idxP){
            OK = OK && (item.value !== '' )
        })
    });
    document.getElementsByName('btnHead').forEach(function(item){item.disabled=!OK;});
    if(OK)collectTeams();
    return OK;
}
/**
 * Collect teams from plr buffer
 */
function collectTeams(){
    displayTeams();
}
function displayTeams(){
    plrBt[0].forEach(function(item, idx){ item.player = plr[1-left][idx]; item.value = item.player.tag; });
    plrBt[1].forEach(function(item, idx){ item.player = plr[  left][idx]; item.value = item.player.tag; });
}
/**
 * Handlers for top line buttons
 */
function setSide(){
    left = 1-left;
    displayTeams();
}

function rotateTeam(side){
    let team = side == left ? 1:0;
    let x = plr[team].shift();
    plr[team].push(x);
    // x = plr[team][1], check if we have a lib,and
    // if x wants a lib. Then grab lib
    x = plr[team][3];
    if(x.isLibero){
        plr[team][3]=libSubst[team];
        libSubst[team]=null;
    }
    displayTeams();
}

function decPoints(side){
    if(points[side]!=0) --points[side];
    document.getElementById('Spielstand').innerHTML = points[0] + ':' + points[1];
}

function onPoint(side){
    lastPlr = null;
    points[side] += 1;
    sctHist.value += sctBox.value + '|' + (side==left?'a':'*')+'|' + timeRalleyStart + '|'+ points[0] +':' +points[1]+'\n';
    sctBox.value = '';
    document.getElementById('Spielstand').innerHTML = points[0] + ':' + points[1];
    // Satzende?
    if( points[side] >= setEnd && points[side] - points[1-side] > 1){
        console.log('Satzende');
        copyHistory();
        clearHistory();
        setSide();
        setService(firstServe);
        points[0] = points[1] = 0;
        disableTeam(0);
        disableTeam(1);
        document.getElementById('Spielstand').innerHTML = points[0] + ':' + points[1];
        rotT[0] = rotT[1] = 0;
        transferTeams();
        startRalley();
    }
    else{
        if(side != serve){
            console.log('Rotating');
            rotateTeam(side);
            setService(side);
            ballSide = side;
            disablePlayers(0);
            disablePlayers(1);
        }
        startRalley();
    }
}

/*******************************************/
function onPlayer(btn, side){
    console.log('onPlayer '+ side);
    document.getElementById('lastPlayer').value = btn.value;
    // All players off
    plrBt[side].forEach(function(item){
        if(item === btn ){
            // This player on
            btn.classList.remove('Player-off');
            btn.classList.add('Player-on');
            lastPlayer = (side==left? 'a': '*') + btn.value;
            lastSide = side;
        }
        else{
            item.classList.remove('Player-on');
            item.classList.add('Player-off');
        }
    });
    console.log('lastSkill: '+ lastSkill);
    if( lastSkill === 's' ){
        enableChains();
    }else if(lastSkill !==''){
        //enableField(side);
        enableNoChains();
    }
    setFieldTags(side)
    return 0;
}
/*******************************************/
function onField(btn){
    document.getElementById('lastField').value = btn.value;
    document.getElementsByName('btField').forEach(function(item){
        if(item === btn ){
            setButtonState(item, 2, 'Field');
            lastField = btn.value;
        }
        else{
            if(item.triState == 2)
                setButtonState(item, 1, 'Field');
        }
    });
    return 0;
}
/*******************************************/
function onSkill(btn, skill){
    // console.log('>>> onSkill '+skill);
    lastSkill = skill;
    document.getElementById('lastSkill').value = skill;
    skillsBt.forEach(function(item){
        if(item === btn ){
            //console.log(btn);
            // This player on
            setButtonState(item, 2, 'Skill');
            //lastSkill = item.val;
        }
        else{
            setButtonState(item, 1, 'Skill');
        }
    });
    if( lastSkill === 's'){
        ['Standing', 'Jmp Flt', 'Jmp Top', 'T', 'U', 'F', 'Other'].forEach(function(val, idx){
            typesBt[idx].value = val;
        })
    }
    else if( lastSkill === 'e'){
        ['Shoot', 'Meter', 'Quick', 'High', 'U', 'F', 'Pass'].forEach(function(val, idx){
            typesBt[idx].value = val;
        })
        if( lastPlayer !== ''){
            enableNoChains();
        }
    }
    else{
        ['H', 'M', 'Q', 'T', 'U', 'F', 'O'].forEach(function(val, idx){
            typesBt[idx].value = val;
        })
        if( lastPlayer !== ''){
            enableNoChains();
        }
    }
    if( (lastSkill === 's' ) || (lastSkill === 'a' ) || (lastSkill === 'e') ){
        enableTypes();
    }
    else{
        disableTypes();
    }
    // console.log('<<< onSkill');
    return 0;
}
/*******************************************/
function onType(btn, type){
    console.log('onType');
    disablePlrXch();

    typesBt.forEach(function(item){
        if(item === btn ){
            setButtonState(item, 2, 'Type');
            lastType = btn.val;
            document.getElementById('lastType').value = btn.val;
        }
        else{
            setButtonState(item, 1, 'Type');
        }
    });
    if(lastSkill === 's'){
        timeRalleyStart = new Date().toISOString();
    }
    return 0;
}
/*******************************************/
/*
 * This one should set a new state of the field
 */
function onEval(btn, eval){
    console.log('onEval');
    console.log('lastPlayer: '+ lastPlayer
               +' lastField: '+ lastField
               +' lastSkill: '+ lastSkill
               +' lastType: '+ lastType
    );
    let rsp = lastPlayer + lastSkill + lastType + lastField + eval;
    if(rsp ===''){ alert('rsp is empty!'); }
    sctBox.value += rsp;
    if(eval === '='){
        onPoint(1-lastSide);
        return 0;
    }
    // only valid if not receive, maybe others...
    else if( (eval === '#') &&  (lastSkill !== 'r') ){
        onPoint(lastSide);
        return 0;
    }
    if(lastSkill === 's'){
        ['H', 'M', 'Q', 'T', 'U', 'F', 'O'].forEach(function(val, idx){
            typesBt[idx].value = val;
        })
        disablePlayers(ballSide);
        ballSide= 1-ballSide;
        enableField(ballSide);
        enablePlayers(ballSide);
        disableSkills();
        // Select 'Receive' Button
        setButtonState(skillsBt[1], 2, 'Skill');
        onSkill(skillsBt[1], 'r');
        lastPlayer =  lastType = lastField = '';
        document.getElementById('lastPlayer').value
            = document.getElementById('lastType').value
            = document.getElementById('lastField').value = '';
        disableEvals();
        disableTypes();
        return 0;
    }
    else if( lastSkill === 'r' ){
        console.log('after receive eval');
        enableK2Skills();
        enablePlayers(0);
        enablePlayers(1);
        enableField(2);
        disableTypes();
    }
    /*
       else if( eval ==='/' ){
       // Overpass: Pull over to other side
       disablePlayers(ballSide);
       ballSide = 1 -ballSide;
       enablePlayers(ballSide);
       enableField(ballSide);
       enableSkills();
       disableSkill(0);
       disableSkill(1);
       disableEvals();
       }*/
    else{
        enablePlayers(0);
        enablePlayers(1);
        enableField(2);
        enableK2Skills();
        disableTypes();
    }
    lastPlayer = lastSkill = lastType = lastField = '';
    document.getElementById('lastPlayer').value
    = document.getElementById('lastSkill').value
    = document.getElementById('lastType').value
    = document.getElementById('lastField').value = '';
    disableEvals();
    return 0;
}
/*******************************************/
/*******************************************/
/*
   function activateField(side, aIdx){
   document.getElementsByName('btField').forEach(function(item, idx){
   if( idx == aIdx){
   item.classList.remove('Field-off');
   item.classList.add('Field-on');
   }
   });
   }
 */
function setFieldTags(side){
    let vals = [
        ['5', '7', '4', '6', '8', '3', '1', '9', '2'],
        ['2', '9', '1', '3', '8', '6', '4', '7', '5'],
        ['', '', '', '', '', '', '', '', ''],
    ];
    document.getElementsByName('btField').forEach(function(item, idx){
        item.value = vals[side][idx];
    })
}
/** End clean-up **/
function disableTeamEvent(team){
    plrBt[team].forEach(function(item){
    });
}
/*******************************************/
function serviceField(side){}
function receiveField(side){}
/*******************************************/
function toggleFirstService(){
    firstServe = 1- firstServe;
    setService(firstServe);
}
function setService(team){
    plrBt[  team][0].classList.add('border-red')
    plrBt[1-team][0].classList.remove('border-red')
    serve = team;
    sctBox.value = '';
}
function startRalley(){
    displayTeams();
    enablePlrXch();
    //console.log('startRalley, left='+left+' serve='+serve);
    // Disable teams
    disablePlayers(0);
    disablePlayers(1);
    disableSkills();
    disableEvals();
    // Select 'Serve' Button
    setButtonState(skillsBt[0], 2, 'Skill');
    onSkill(skillsBt[0], 's');
    lastSkill = 's';
    // Enable and select service player
    plrBt[serve][0].classList.remove('Player-dis');
    plrBt[serve][0].classList.add('Player-on');
    // This is BS, right?
    onPlayer(plrBt[serve][0], serve);
    //enableTypes();
    //onSkill(btSkills[0]);
    // show partial field
    enableFieldBR(serve);
    ballSide = serve;
    gamePhase = 2;
}

function zapAll(){
    points[0] = points[1] = 0;
    disablePlayers(0);
    disablePlayers(1);
    document.getElementById('Spielstand').innerHTML = points[0] + ':' + points[1];
    transferTeams();
    startRalley();
}
function copyHistory(){
    var copyText = document.getElementById("sctHist");
    copyText.select();
    document.execCommand("copy");
}
function clearHistory(){
    document.getElementById("sctHist").value='';
}
function drag(ev){
    /*
    let data = ev.target.id.substring(1,100);
    let team = data.substring(4,5);
    let listPos = data.substring(5,6);
    */
    let data = ev.target.id;
    let dLen = data.length;
    let team = data[dLen-2];
    let listPos = data[dLen-1];
    ev.dataTransfer.setData('text/plain', team+listPos)
}
// ?T0=LEB;CAB;EMD;PID;PAE;ANH;MAH;FAJ;REZ&T1=1;2;3;4;5;6;7;8;9;10;11;12;16,L
// ?T0=LEB;CAB?5;EMD?4;PID?1;PAE?6;ANH;MAH?3;FAJ?2;REZ&T1=1;2;3;4?3;5?6;6?4;7?5;8?2;9;10;11;12?1;16,L
