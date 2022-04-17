let sctBox    = null;
let sctHist   = null;
let clickHist = [];
let teamList  = [];
let plrBt     = [];
let skillsBt  = [];
let typesBt   = [];
let evalsBt   = [];
let plr       = [[],[]];
let rotT      = [0,0];
let left      = 1;
let firstServe= 0;
let serve     = firstServe;
let ballSide  = serve;
let points    = [0,0];
let lastPlr   = null;
let lastPlayer= '';    // Set by onPlayer
let lastSide = -1;
let lastField = '';    // set by onField
let lastSkill = '';
let chndSkill = '';
let lastSpeed = '';
let setEnd    = 25;
let timeRalleyStart = ''
function initDentry(){
    plrBt = [
        [ document.getElementById('bt00'), document.getElementById('bt01'), document.getElementById('bt02'),
          document.getElementById('bt03'), document.getElementById('bt04'), document.getElementById('bt05'),
        ],
        [ document.getElementById('bt10'), document.getElementById('bt11'), document.getElementById('bt12'),
          document.getElementById('bt13'), document.getElementById('bt14'), document.getElementById('bt15'),
        ]
    ];
    skillsBt = [
        document.getElementById('bt20'), document.getElementById('bt21'), document.getElementById('bt22'), document.getElementById('bt23'),
        document.getElementById('bt24'), document.getElementById('bt25'), document.getElementById('bt26'),
    ];
    typesBt = [
        document.getElementById('bt30'), document.getElementById('bt31'), document.getElementById('bt32'),
        document.getElementById('bt33'), document.getElementById('bt34'), document.getElementById('bt35'),
        document.getElementById('bt36'),
    ];
    evalsBt = [
        document.getElementById('bt40'), document.getElementById('bt41'), document.getElementById('bt42'),
        document.getElementById('bt43'), document.getElementById('bt44'), document.getElementById('bt45'),
        document.getElementById('bt46'),
    ];
    ['H', 'M', 'Q', 'T', 'U', 'F', 'O'].forEach(function(val, idx){
        typesBt[idx].val = val;
    });
    ['s', 'r', 'a', 'b', 'd', 'e', 'f'].forEach(function(val, idx){
        skillsBt[idx].val = val;
    });
    //disableSkills();
    //disableTypes();
    //disableEvals();
    sctBox  = document.getElementById('sctBox');
    sctHist = document.getElementById('sctHist');
    sctBox.value = sctHist.value = '';
    plrBt[0][0].classList.add('border-red')
    plrBt.forEach(function(team){
        team.forEach(function(bt){
            bt.addEventListener('dragover', function(ev){console.log('in dragover'); ev.preventDefault(); });
            bt.addEventListener('drop', function(ev){
                console.log('in drop');
                ev.preventDefault();
                let data = ev.dataTransfer.getData('text');
                ev.target.value = data;
                document.getElementById('btnStart').disabled = !checkCanStart();
            });
        });
    });
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
        //let inpPos = document.getElementsByName('pPos'+j)
        if(urlParams.has('T'+j)){
            let T1 = urlParams.get('T'+j);
            T1.split(';').forEach(function(plr,idx){
                // Run through all player from cmd-line
                plrPos = plr.split('?');
                inpPlr[idx].value = plrPos[0];
                if(plrPos.length > 1){
                    let ofs = plrPos[0].indexOf('=');
                    if(ofs > 0)
                        plrBt[j][plrPos[1]-1].value = plrPos[0].substring(0, plrPos[0].indexOf('='));
                    else
                        plrBt[j][plrPos[1]-1].value = plrPos[0];
                }
            });
        }
    }
    collectTeams();
    document.getElementsByName('btnHead').forEach(function(item){item.disabled=true;});
    document.getElementById('btnStart').disabled= !checkCanStart();
    disablePlayers(0);
    disablePlayers(1);
    disableField(0);
    disableSkills();
    disableTypes();
    disableEvals();
    toggleVisibility('divTeam')
    disablePlrXch();
    console.log('done initDentry');
}
/**
 * @transferTeams: Get team list into variable teamList.
 */
function transferTeams(){
    /* Build team list for header */
    teamList[0] = '@Home:';
    teamList[1] = '@Away:';
    for(j=0; j<2; j++){
        let inpPlr = document.getElementsByName('pTag'+j);
        inpPlr.forEach(function(item, idx){
            let t = item.value.trim()
            if(t !== '')
                teamList[j] += t+ ';';
            let s = t.indexOf('=');
            if(s>0){
                t= t.substring(0,s);
            }
        });
    }
    teamList[0] = teamList[0].slice(0,-1);
    teamList[1] = teamList[1].slice(0,-1);
}

function checkCanStart(){
    let OK = true;
    plrBt.forEach(function(t,idxT){
        t.forEach(function(item, idxP){
            plr[idxT][idxP] = item.value;
            OK = OK && (item.value !== '' )
        })
    });
    document.getElementsByName('btnHead').forEach(function(item){item.disabled=!OK;});
    return OK;
}
/**
 * Collect teams from plr buffer
 */
function collectTeams(){
    plrBt[0].forEach(function(item, idx){ plr[0][idx]=item.value;});
    plrBt[1].forEach(function(item, idx){ plr[1][idx]=item.value;});
}
function displayTeams(){
    plrBt[0].forEach(function(item, idx){ item.value = plr[0][idx]; });
    plrBt[1].forEach(function(item, idx){ item.value = plr[1][idx]; });
}
/**
 * Handlers for top line buttons
 */
function setSide(){
    plrBt[0].forEach(function(item, idx){ plr[1][idx] = item.value;});
    plrBt[1].forEach(function(item, idx){ plr[0][idx] = item.value;});
    left = 1-left;
    displayTeams();
}

function rotateTeam(team){
    rotT[team] = (rotT[team]+1) % 6;
    x = plr[team].shift();
    plr[team].push(x);
    displayTeams();
}


function decPoints(side){
    if(points[side]!=0) --points[side];
    document.getElementById('Spielstand').innerHTML = points[0] + ':' + points[1];
}

function onPoint(side){
    lastPlr = null;
    sctHist.value += sctBox.value + '|' + (side==left?'a':'*')+'|' + timeRalleyStart + '\n';
    sctBox.value = '';
    points[side] += 1;
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
            //console.log(btn);
            btn.classList.remove('Field-off');
            btn.classList.add('Field-on');
            lastField = btn.value;
        }
        else{
            item.classList.remove('Field-on');
            item.classList.add('Field-off');
        }
    });
    return 0;
}
/*******************************************/
function onSkill(btn, skill){
    console.log('>>> onSkill '+skill);
    lastSkill = skill;
    document.getElementById('lastSkill').value = skill;
    skillsBt.forEach(function(item){
        if(item === btn ){
            //console.log(btn);
            // This player on
            btn.classList.remove('Skill-off');
            btn.classList.add('Skill-on');
            //lastSkill = item.val;
        }
        else{
            item.classList.remove('Skill-on');
            item.classList.add('Skill-off');
        }
    });
    if( lastSkill === 's'){
        ['Standing', 'Jmp Flt', 'Jmp Top', 'T', 'U', 'F', 'Other'].forEach(function(val, idx){
            typesBt[idx].value = val;
        })
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
    console.log('<<< onSkill');
    return 0;
}
/*******************************************/
function onType(btn, type){
    console.log('onType');
    disablePlrXch();

    typesBt.forEach(function(item){
        if(item === btn ){
            console.log(btn);
            // This player on
            btn.classList.remove('Type-off');
            btn.classList.add('Type-on');
            lastType = btn.val;
            document.getElementById('lastType').value = btn.val;
        }
        else{
            item.classList.remove('Type-on');
            item.classList.add('Type-off');
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
    sctBox.value += rsp;
    if(eval === '='){
        onPoint(1-lastSide);
        return 0;
    }
    else if( eval === '#' ){
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
        // Select 'Serve' Button
        skillsBt[1].classList.remove('Skill-dis');
        skillsBt[1].classList.add('Skill-on');
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
function onChain(){
    console.log('onChain, lastSkill='+lastSkill);
    if(lastField !==''){
        sctBox.value += lastField;
        lastField = '';
    }
    sctBox.value += '.';
    chndSkill = lastSkill;
    console.log('setting chained skill to '+lastSkill);
    disableEvals();
    enablePlayers(0);
    enablePlayers(1);
    //hideField();
    showField(1-serve, true);
    if( lastSkill === 's'){
        disableSkills();
        enableSkill(1);
    }
}
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
function showField(side,full){
    let vals = [ ['5', '7', '4', '6', '8', '3', '1', '9', '2'],
                 ['2', '9', '1', '3', '8', '6', '4', '7', '5']];
    document.getElementsByName('btField').forEach(function(item, idx){
        item.value = vals[side][idx];
        if(full){
            item.classList.remove('Field-pas');
            item.classList.add('Field-act');
            item.disabled = false;
        }
        else{
            if( ((side==0)&&( idx==0 || idx==3 || idx ==6)
              || ((side==1)&&( idx==2 || idx==5 || idx==8)))){
                item.classList.remove('Field-pas');
                item.classList.add('Field-act');
                item.disabled = false;
            }else{
                item.classList.remove('Field-act');
                item.classList.add('Field-pas');
                item.disabled = true;
            }
        }
        item.style.display = 'block';
    });
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
function setSide(){
    plrBt[0].forEach(function(item, idx){ plr[1][idx] = item.value;});
    plrBt[1].forEach(function(item, idx){ plr[0][idx] = item.value;});
    left = 1-left;
    console.log(left);
    displayTeams();
}
function setService(team){
    plrBt[  team][0].classList.add('border-red')
    plrBt[1-team][0].classList.remove('border-red')
    serve = team;
    sctBox.value = '';
}
function startRalley(){
    enablePlrXch();
    console.log('startRalley, left='+left+' serve='+serve);
    if(sctHist.value===''){
        transferTeams();
        sctHist.value += teamList[0]+'\n'+teamList[1]+'\n';;
    }
    // Disable teams
    disablePlayers(0);
    disablePlayers(1);
    disableSkills();
    disableEvals();
    // Select 'Serve' Button
    skillsBt[0].classList.remove('Skill-dis');
    skillsBt[0].classList.add('Skill-on');
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
}

function zapAll(){
    points[0] = points[1] = 0;
    disablePlayers(0);
    disablePlayers(1);
    document.getElementById('Spielstand').innerHTML = points[0] + ':' + points[1];
    rotT[0] = rotT[1] = 0;
    transferTeams();
    startRalley();
}
function copyHistory(){
    console.log('Try to copy');
    var copyText = document.getElementById("sctHist");
    copyText.select();
    document.execCommand("copy");
}
function clearHistory(){
    document.getElementById("sctHist").value='';
}
function drag(ev){
    let data = ev.target.id.substring(1,100);
    data = document.getElementById(data).value;
    let s = data.indexOf('=');
    if(s>0){
        ev.dataTransfer.setData('text', data.substring(0,s));
    }
    else{
        ev.dataTransfer.setData('text', data);
    }
    console.log(data);
}
function allowDrop(ev){
    console.log('allowDrop');
    ev.preventDefault();
}
function drop(ev){
    console.log('drop');
    ev.preventDefault();
    let data = ev.dataTransfer.getData('text');
    ev.target.value = data;
}
