// Ciblage du DOM et références globales
var txtCodecli      = document.getElementById('txtCodecli');
var btnValid        = document.getElementById('btnValid');
var virtualKb       = document.getElementById('virtualKb');
var passwdBox       = document.getElementById('passwdBox');
var infoBox         = document.getElementById('infoBox');
var btnSwitch       = document.getElementsByClassName('btnSwitch')[0];
var btnInfo         = document.getElementsByClassName('btnInfo')[0];

function init() {
    txtCodecli.addEventListener('keyup', checkConditions)
    btnValid.addEventListener('click', initVirtualKb)
}

function checkConditions(e) {
    var cond = e.target.value.length === 8 &&
        Number.isInteger(+e.target.value);
    
    // le bouton de validation devient clicable
    btnValid.disabled = !cond; 

    if (cond) {
        e.target.style.borderBottomColor = 'green';
    } else {
        e.target.style.borderBottomColor = 'red';
    }
    
}

function initVirtualKb() {
    virtualKb.appendChild(buildVirtualKb());
}

function buildVirtualKb() {
    var keys = document.createElement('div');

    // création de 4 lignes
    for (var i = 0; i < 4; i++) {
        var row = document.createElement('div');
        row.classList.add('row')

        //création de 4 cases (touches)
        for (var j = 0; j < 4; j++) {
            row.appendChild(buildKey())
        }
        keys.appendChild(row);
    }

    return keys;
}

function buildKey() {
    var key = document.createElement('div');
    key.innerText = "6";
    key.classList.add('key');
    return key;
}



init();