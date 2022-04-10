/** 
* Players
*/
function enablePlayers(side){
    for(i=0;i<6;i++){
        plrBt[side][i].classList.remove('Player-dis');
        plrBt[side][i].classList.remove('Player-on');
        plrBt[side][i].classList.add('Player-off');
        plrBt[side][i].disabled = false;
    }
}
function disablePlayers(side){
    for(i=0;i<6;i++){
        plrBt[side][i].classList.remove('Player-on');
        plrBt[side][i].classList.remove('Player-off');
        plrBt[side][i].classList.add('Player-dis');
        plrBt[side][i].disabled = true;
    }
}
/**
* Field
*/
function disableField(side){
    document.getElementsByName('btField').forEach(function(item){
        item.classList.remove('Field-on');
        item.classList.remove('Field-off');
        item.classList.add('Field-dis');
        item.value = '';
        item.disabled = true;
    });
}
function enableField(side){
    let vals = [
        ['5', '7', '4', '6', '8', '3', '1', '9', '2'],
        ['2', '9', '1', '3', '8', '6', '4', '7', '5'],
        ['', '', '', '', '', '', '', '', ''],
    ];
    document.getElementsByName('btField').forEach(function(item, idx){
        item.classList.remove('Field-on');
        item.classList.remove('Field-dis');
        item.classList.add('Field-off');
        item.value = vals[side][idx]
        item.disabled = false;
    });
}
function enableFieldBR(side){
    let vals = [
        ['5', '7', '4', '6', '8', '3', '1', '9', '2'],
        ['2', '9', '1', '3', '8', '6', '4', '7', '5'],
        ['', '', '', '', '', '', '', '', ''],
    ];
    disableField(side);
    document.getElementsByName('btField').forEach(function(item, idx){
        if( ((side==0)&&( idx==0 || idx==3 || idx ==6)
          || ((side==1)&&( idx==2 || idx==5 || idx==8)))){
            item.classList.remove('Field-on');
            item.classList.remove('Field-dis');
            item.classList.add('Field-off');
            item.value = vals[side][idx]
            item.disabled= false;
        }
    })
}
/*
** Skills
*/
function disableSkills(){
    skillsBt.forEach(function(item){
        item.classList.remove('Skill-on');
        item.classList.remove('Skill-off');
        item.classList.add('Skill-dis');
        item.disabled = true;
    } );
}
function disableSkill(idx){
    let item = skillsBt[idx];
    item.classList.remove('Skill-on');
    item.classList.remove('Skill-off');
    item.classList.add('Skill-dis');
    item.disabled = true;
}
function enableSkills(){
    console.log('enableSkills()');
    skillsBt.forEach(function(item){
        item.classList.remove('Skill-dis');
        item.classList.remove('Skill-on');
        item.classList.add('Skill-off');
        item.disabled = false;
    } );
}
function enableSkill(idx){
    let item = skillsBt[idx];
    item.classList.remove('Skill-dis');
    item.classList.remove('Skill-on');
    item.classList.add('Skill-off');
    item.disabled = false;
}
function enableK2Skills(){
    enableSkills();
    disableSkill(0);
    disableSkill(1);
}
/*
 ** Types
 */
function disableTypes(){
    typesBt.forEach(function(item){
        item.classList.remove('Type-on');
        item.classList.remove('Type-off');
        item.classList.add('Type-dis');
        item.disabled = true;
    });
}
function enableTypes(){
    typesBt.forEach(function(item){
        item.classList.remove('Type-on');
        item.classList.remove('Type-dis');
        item.classList.add('Type-off');
        item.disabled = false;
    });
}
function enableType(idx){
    let item = typesBt[idx];
    item.classList.remove('Type-on');
    item.classList.remove('Type-dis');
    item.classList.add('Type-off');
    item.disabled = false;
}
/*
 ** Evaluations, Evals
 */
function disableEvals(){
    evalsBt.forEach(function(item){
        item.classList.remove('Eval-off');
        item.classList.remove('Eval-on');
        item.classList.add('Eval-dis');
        item.disabled = true;
    } );
}
function disableEval(idx){
    let item = evalsBt[idx];
    item.classList.remove('Eval-off');
    item.classList.remove('Eval-on');
    item.classList.add('Eval-dis');
    item.disabled = false;
}

function enableEvals(){
    console.log('Enable Eval');
    evalsBt.forEach(function(item){
        item.classList.remove('Eval-on');
        item.classList.remove('Eval-dis');
        item.classList.add('Eval-off');
        item.disabled = false;
    } );
}
function enableEval(idx){
    let item = evalsBt[idx];
    item.classList.remove('Eval-on');
    item.classList.remove('Eval-dis');
    item.classList.add('Eval-off');
    item.disabled = false;
}
function enableChains(){
    enableEval(5);
    enableEval(6);
}
function enableNoChains(){
    enableEvals();
    disableEval(6);
}
function disablePlrXch(){
    //console.log('disable Exchange');
    let btn = document.getElementById('plrXch');
    btn.disabled = true;
    btn.classList.remove('btn-gry-act');
    btn.classList.add('btn-gry-pas');
}
function enablePlrXch(){
    //console.log('enable Exchange');
    let btn = document.getElementById('plrXch');
    //btn.disabled = false;
    btn.classList.remove('btn-gry-pas');
    btn.classList.add('btn-gry-act');
}
