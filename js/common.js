function findGetParameter(parameterName) {
    let result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}
/* ?a=CAH:4;ANH*/


function toggleVisibility(elem){
    let el = document.getElementById(elem);
    if (el.style.display === 'none')
        el.style.display= 'block';
    else
        el.style.display= 'none';
}
