/**
 * Helper function to set state of an array of buttons.
 * @buttons: Array of buttons to set state.
 * @newState: integer 0-2, stting state to 'dis', 'off', of 'on'
 * @stem: the name of the base css-class.
 */
function setButtonsState(buttons, newState, stem){
    let classArray = [ stem+'-dis', stem+'-off', stem+'-on' ];
    let disabled = (newState == 0);
    buttons.forEach(function(item){
        if( item.triState != newState ){
            item.classList.remove(classArray[item.triState]);
            item.classList.add(classArray[newState]);
            item.triState = newState;
            item.disabled = disabled;
        }
    });
}
function setButtonState(item, newState, stem){
    let classArray = [ stem+'-dis', stem+'-off', stem+'-on' ];
    let disabled = (newState == 0);
    if( item.triState != newState ){
        item.classList.remove(classArray[item.triState]);
        item.classList.add(classArray[newState]);
        item.triState = newState;
        item.disabled = disabled;
    }
}
/**
 * Players
 */
function enablePlayers(side){
    // setButtonsState(plrBt[side], 1, ['Player-dis', 'Player-off', 'Player-On'] );
    for(i=0;i<6;i++){
        plrBt[side][i].classList.remove('Player-dis');
        plrBt[side][i].classList.remove('Player-on');
        plrBt[side][i].classList.add('Player-off');
        plrBt[side][i].disabled = false;
    }
}
function disablePlayers(side){
    for(let i=0;i<6;i++){
        plrBt[side][i].classList.remove('Player-on');
        plrBt[side][i].classList.remove('Player-off');
        plrBt[side][i].classList.add('Player-dis');
        plrBt[side][i].disabled = true;
    }
}
function pushDragDrop(side){
    let state=[];
    for(let i=0;i<6;i++){
        state[i] = plrBt[side][i].disabled;
        plrBt[side][i].disabled = false;
    }
    return state;
}
function popDragDrop(side, state){
    for(let i=0;i<6;i++){
        plrBt[side][i].disabled = state[i];
    }
}
/**
 * Field
 */
function disableField(side){
    setButtonsState(document.getElementsByName('btField'), 0, 'Field' );
    document.getElementsByName('btField').forEach(function(item){
        item.value = '';
    });
}
function enableField(side){
    let vals = [
        ['5', '7', '4', '6', '8', '3', '1', '9', '2'],
        ['2', '9', '1', '3', '8', '6', '4', '7', '5'],
        ['', '', '', '', '', '', '', '', ''],
    ];
    setButtonsState(document.getElementsByName('btField'), 1, 'Field');
    document.getElementsByName('btField').forEach(function(item, idx){
        item.value = vals[side][idx]
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
            //item.classList.remove('Field-on');
            item.classList.remove('Field-dis');
            item.classList.add('Field-off');
            item.value = vals[side][idx]
            item.disabled= false;
            item.triState = 1;
        }
    })
}
/*
 ** Skills
 */
function disableSkills(){
    setButtonsState(skillsBt, 0, 'Skill');
}
function disableSkill(idx){
    let item = skillsBt[idx];
    setButtonState(item, 0, 'Skill');
}
function enableSkills(){
    console.log('enableSkills()');
    setButtonsState(skillsBt, 1, 'Skill');
}
function enableSkill(idx){
    let item = skillsBt[idx];
    setButtonState(item, 1, 'Skill');
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
    setButtonsState(typesBt, 0, 'Type');
}
function enableTypes(){
    setButtonsState(typesBt, 1, 'Type');
}
function enableType(idx){
    setButtonsState(typesBt[idx], 1, 'Type');
}
/*
 ** Evaluations, Evals
 */
function disableEvals(){
    setButtonsState(evalsBt, 0, 'Eval');
}
function disableEval(idx){
    setButtonState(evalsBt[idx], 0, 'Eval');
}

function enableEvals(){
    setButtonsState(evalsBt, 1, 'Eval');
}
function enableEval(idx){
    setButtonState(evalsBt[idx], 1, 'Eval');
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
