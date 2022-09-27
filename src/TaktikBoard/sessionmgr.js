/**
*
 */
function setDirty(){
    if(!dirty){
        dirty = true;
        $('idSavSit').innerHTML = '<center>Übernehmen*</center>';
    }
}
function undoDirty(){
    if(dirty){
        dirty = false;
        $('idSavSit').innerHTML = '<center>Übernehmen</center>';
    }
}
/**
 * Load a whole workspace from disk.
 */
function loadWorkspace(){
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
        // you can use this method to get file and perform respective operations
        let files =   Array.from(input.files);
        fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(files[0]);
        function receivedText(e){
            // Try to parse
            let myWS = JSON.parse(e.target.result);
            // if OK, go on, sort by keys
            myWS.sort((a, b) => {
                const nameA = a.key.toUpperCase(); // ignore upper and lowercase
                const nameB = b.key.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {return -1;}
                if (nameA > nameB) {return 1;}
                // names must be equal
                return 0;
            });
            localStorage.clear();
            // selector clear
            let select=$('session-select');
            for(let len=select.options.length-1, i=len; i>=0; i--){
                select.remove(i);
            }
            myWS.forEach(function(e){
                localStorage.setItem(e.key, JSON.stringify(e.data));
                // select Append e.key
                let option = document.createElement('option');
                option.text = e.key;
                document.getElementById('session-select').add(option);
            });
            if(myWS.length > 0){
                selectSituation();
                undoDirty();
            }
        }
    }
    // Trigger the whole story
    input.click();
}
/**
 * Save the entire workspace from localStorage to disk
 */
function saveWorkspace(){
    let myWS=[];
    console.log('Saving %d items', localStorage.length);
    for(let i=0, len=localStorage.length; i<len; i++){
        key = localStorage.key(i);
        let data = localStorage.getItem(key)
        myWS.push({key: key, data:JSON.parse(data)});
    }
    console.log(JSON.parse(JSON.stringify(myWS)));
    // (A) CREATE BLOB OBJECT
    let myBlob = new Blob([JSON.stringify(myWS)], {type: "text/plain"});

    // (B) CREATE DOWNLOAD LINK
    let url = window.URL.createObjectURL(myBlob);
    let anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "demo.json";

    // (C) "FORCE DOWNLOAD"
    // NOTE: MAY NOT ALWAYS WORK DUE TO BROWSER SECURITY
    // BETTER TO LET USERS CLICK ON THEIR OWN
    anchor.click();
    window.URL.revokeObjectURL(url);
    document.removeChild(anchor);
}
/**
 * Create a new situation
 */
function newSituation(){
    let wtf = prompt("Name", '01-L4-01');
    console.log(wtf);
    if(wtf){
        // If in keys: reject
        for(let i=0, len=localStorage.length; i<len; i++){
            if( localStorage.key(i) === wtf ){
                console.log('exists');
                return;
            }
        }
        // add to select
        let option = document.createElement('option');
        option.text = wtf;
        $('session-select').add(option);
        $('session-select').value = wtf;
        selectSituation();
    }
    else{}
}
/**
 *  Save the current canvas to localStorage
 *  TODO: Rest a marker to show situation is clean,
 */
function savSituation(){
    // get key from select
    let key = $('session-select').value;
    if( key !== ''){
        let data = JSON.stringify(doSerialize());
        console.log(data);
        // save data to key
        localStorage.setItem(key, data);
        undoDirty();
    }
 }
/**
 * Delete the current situation in localStorage. Keep canvas untouched, so it 
* can be saved under a new name.
 */
function delSituation(){
    // get Key from select
    let key =  document.getElementById('session-select').value;
    // delet from storage
    localStorage.removeItem(key);
    // delete all from select
    let select=document.getElementById('session-select');
    for(let len=select.options.length-1, i=len; i>=0; i--){
        select.remove(i);
    }
    // rebuild from keys
    for(let i=0, len=localStorage.length; i<len; i++){
        let option = document.createElement('option');
        option.text = localStorage.key(i);
        document.getElementById('session-select').add(option);
    }
    undoDirty();
}
/**
 * Selector has changed, grab situation from storage and
 * build it on canvas
 */
function selectSituation(){
    let key = document.getElementById('session-select').value;
    console.log('Setting situation %s', key);
    let myJSON = JSON.parse(localStorage.getItem(key));
    console.log(myJSON);
    if(myJSON){
        let origRenderOnAddRemove = G_canvas.renderOnAddRemove;
        G_canvas.renderOnAddRemove = false;
        createPlayers(myJSON['players'], myJSON.wPlayers);
        //console.log(myJSON['objects']);
        console.log('calling createObjects');
        createObjects(myJSON['objects'], myJSON.wObjects);
        /*
           createPaths(myJSON['paths']);
           //createCanvasObjects(myJSON['canvasObjects']);
         */
        G_canvas.renderOnAddRemove = origRenderOnAddRemove;
        G_canvas.renderAll();
        undoDirty();
    }
}
