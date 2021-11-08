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
let points    = [0,0];
let lastSkill = '';
let lastField = '';
let chndSkill = '';
let lastPlr   = null;
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
    disableSkills();
    disableTypes();
    disableEvals();
    sctBox  = document.getElementById('sctBox');
    sctHist = document.getElementById('sctHist');
    sctBox.value = sctHist.value = '';
    plrBt[0][0].classList.add('border-red')
    //document.getElementById('divSet').style.display = 'none';
    //document.getElementById('divTeam').style.display = 'none';
    window.onbeforeunload = function () {
        return 'Are you sure you want to leave?';
    }

     const queryString = window.location.search;
     const urlParams = new URLSearchParams(queryString);
     for(j=0; j<2; j++){
         inpPlr = document.getElementsByName('pTag'+j)
         inpPos = document.getElementsByName('pPos'+j)
         if(urlParams.has('T'+j)){
             let T1 = urlParams.get('T'+j);
             console.log(T1);
             T1.split(';').forEach(function(plr,idx){
                 plrPos = plr.split('?');
                 inpPlr[idx].value = plrPos[0];
                 if( plrPos.length > 1)
                     inpPos[idx].value = plrPos[1];
             });
         }
     }
    hideField();
    document.getElementsByName('btnHead').forEach(function(item){item.disabled=true;});
}

function transferTeams(){
    teamList[0] = '@Home:';
    teamList[1] = '@Away:';
    for(j=0; j<2; j++){
        let inpPlr = document.getElementsByName('pTag'+j);
        let inpPos = document.getElementsByName('pPos'+j);
        inpPlr.forEach(function(item, idx){
            let t = item.value.trim()
            if(t !== '')
                teamList[j] += t+ ';';
            let s = t.indexOf('=');
            if(s>0){
                //console.log('Found =');
                t= t.substring(0,s);
                //console.log(t);
            }
            p = Number(inpPos[idx].value);
            if(p>0){
                plr[left==0?1-j:j][(5+p-rotT[j])%6] = t;
            }
        });
    }
    teamList[0] = teamList[0].slice(0,-1);
    teamList[1] = teamList[1].slice(0,-1);
    console.log(teamList[0]);
    displayTeams();
    document.getElementsByName('btnHead').forEach(function(item){item.disabled=false;});
}
function displayTeams(){
    for(j=0; j<2; j++){
        for(i=0; i<6; i++){
            plrBt[j][i].value = plr[j][i];
        }
    }
}
function rotateTeam(team){
    console.log('Rotating team '+team);
    rotT[team] = (rotT[team]+1) % 6;
    x = plr[team].shift();
    plr[team].push(x);
    displayTeams();
}
function enableTeam(team){
    for(i=0;i<6;i++){
        plrBt[team][i].classList.remove('Player-pas');
        plrBt[team][i].classList.add('Player-act');
        plrBt[team][i].disabled = false;
    }
}
function disableTeam(team){
    for(i=0;i<6;i++){
        plrBt[team][i].classList.remove('Player-act');
        plrBt[team][i].classList.add('Player-pas');
        plrBt[team][i].disabled = true;
    }
}
/*******************************************/
function disableSkills(){
    skillsBt.forEach(function(item){
        item.classList.remove('Skill-act');
        item.classList.add('Skill-pas');
        item.disabled = true;
    } );
}
function disableSkill(idx){
    let item = skillsBt[idx];
    item.classList.remove('Skill-act');
    item.classList.add('Skill-pas');
    item.disabled = true;
}
function enableSkills(){
    console.log('enableSkills()');
    skillsBt.forEach(function(item){
        item.classList.remove('Skill-pas');
        item.classList.add('Skill-act');
        item.disabled = false;
    } );
}
function enableSkill(idx){
    let item = skillsBt[idx];
    item.classList.remove('Skill-pas');
    item.classList.add('Skill-act');
    item.disabled = false;
}
/*******************************************/
function disableTypes(){
    typesBt.forEach(function(item){
        item.classList.remove('Type-act');
        item.classList.add('Type-pas');
        item.disabled = true;
    } );
}
function enableTypes(){
    typesBt.forEach(function(item){
        item.classList.remove('Type-pas');
        item.classList.add('Type-act');
        item.disabled = false;
    } );
}
function enableType(idx){
    let item = typesBt[idx];
    item.classList.remove('Type-pas');
    item.classList.add('Type-act');
    item.disabled = false;
}
/*******************************************/
function disableEvals(){
    evalsBt.forEach(function(item){
        item.classList.remove('Eval-act');
        item.classList.add('Eval-pas');
        item.disabled = true;
    } );
}
function enableEvals(){
    console.log('Enable Eval');
    evalsBt.forEach(function(item){
        item.classList.remove('Eval-pas');
        item.classList.add('Eval-act');
        item.disabled = false;
    } );
}
function enableEval(idx){
    let item = evalsBt[idx];
    item.classList.remove('Eval-pas');
    item.classList.add('Eval-act');
    item.disabled = false;
}
function disableEval(idx){
    let item = evalsBt[idx];
    item.classList.remove('Eval-act');
    item.classList.add('Eval-pas');
    item.disabled = false;
}
function hideField(){
    document.getElementsByName('btField').forEach(function(item){
        item.style.display = 'none';
    });
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
    //sctBox.value = (left?'*':'a') + plrBt[firstServe][0].value + 's';
}
function setSide(){
    left = 1-left;
    transferTeams();
    //activateTeam(left);
    //deactivateTeam(1-left);
}
function startRalley(){
    console.log('startRalley, left='+left+' serve='+serve);
    if(sctHist.value===''){
        sctHist.value += teamList[0]+'\n'+teamList[1]+'\n';;
    }
    enableTypes();
    showField(serve, false);
    sctBox.value = (left?'*':'a') + plrBt[serve][0].value + 's';
    ['Standing', 'Jmp Flt', 'Jmp Top', 'T', 'U', 'F', 'Other'].forEach(function(val, idx){
        typesBt[idx].value = val;
    })
    lastSkill = 's';
}

function onSkill(skill){
    disableSkills();
    if(     skill ==='r' ){
        enableEvals();
        disableEval(2);
    }
    else if(skill ==='a'){
        // Type buttons: Hard, Quick, Tip etc.
        enableTypes();
    }
    else if(skill ==='b'){
        enableEvals();
    }
    else if(skill ==='d'){
        enableEvals();
    }
    else if(skill ==='e'){
        enableTypes();
    }
    else if(skill ==='f'){
        enableTypes();
    }
    else{
        console.log('Unknown skill: '+skill);
    }
    lastSkill     = skill;
    sctBox.value += skill;
}
function onType(type){
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

    disableTypes();
    if(lastSkill === 's'){
        timeRalleyStart = new Date().toISOString();
        disableEvals();
        enableEval(5);
        enableEval(6);
        ['H', 'M', 'Q', 'T', 'U', 'F', 'O'].forEach(function(val, idx){
            typesBt[idx].value = val;
        })
    }
    else{
        enableEvals();
    }
}
function onEval(eval){
    if(lastField !==''){
        sctBox.value += lastField;
        lastField = '';
    }
    console.log(lastPlr);
    if(     eval === '#'){
        if(lastSkill ==='b' || lastSkill === 'a'){
            sctBox.value +='#';
            onPoint(lastPlr.side);
            disableEvals();
            return;
        }
    }
    else if(eval === '+'){}
    else if(eval === '!'){}
    else if(eval === '-'){}
    else if(eval === '/'){}
    else if(eval === '='){
        if( lastSkill === 's' ){
            console.log('Service FU, serve='+serve);
            sctBox.value +='=';
            onPoint(1-serve);
            disableEvals();
            return;
        }
        else if (lastSkill == 'r'){
            sctBox.value +='=';
            onPoint(serve);
            disableEvals();
            return;
        }
    }
    else{
        console.log('Unknown quality '+ eval);
    }
    sctBox.value += eval +' ';
    chndSkill = '';
    disableEvals();
    enableTeam(0);
    enableTeam(1);
}
function onChain(){
    if(lastField !==''){
        sctBox.value += lastField;
        lastField = '';
    }
    sctBox.value += '.';
    chndSkill = lastSkill;
    console.log('setting chained skill to '+lastSkill);
    disableEvals();
    enableTeam(0);
    enableTeam(1);
    hideField();

}
function onPlayer(side, btn){
    showField(side, true);
    sctBox.value += (side==left? 'a': '*') +btn.value;
    lastPlr = {side: side, tag: btn.value};
    if( chndSkill === 's' ){
        chndSkill = '';
        sctBox.value += 'r';
        lastSkill    =  'r';
        enableEvals();
        disableEval(2);
    }
    else{
        console.log('had player, enabling skills');
        enableSkills();
        disableSkill(0);
        // Can we disable Receive, too?
        disableSkill(1);

    }
}
function onPoint(side){
    lastPlr = null;
    sctHist.value += sctBox.value + '|' + (side==left?'a':'*')+'|' + timeRalleyStart + '\n';
    console.log('Point on side ' + side);
    console.log(serve);
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
            disableTeam(0);
            disableTeam(1);
        }
        startRalley();
    }
}
function onField(btn){
    console.log('onField, value '+btn.value);
    console.log('Last skill: '+lastSkill);
    lastField = btn.value;
    hideField();
}
function decPoints(side){
    if(points[side]!=0) --points[side];
    document.getElementById('Spielstand').innerHTML = points[0] + ':' + points[1];
}
function zapAll(){
    points[0] = points[1] = 0;
    disableTeam(0);
    disableTeam(1);
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
