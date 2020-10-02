/*
 TP: juvejersey
 Author: Christophe DUFOUR
*/

var thumbs              = document.getElementById('thumbs');
var mainImg             = thumbs.previousElementSibling;
var sectionFlocking     = document.getElementById('sectionFlocking');
var flockForm           = sectionFlocking.querySelector('#flockForm');
var flockLayer          = document.getElementById('flockLayer');
var flockName           = flockLayer.querySelector('#flockName');
var flockNumber         = flockLayer.querySelector('#flockNumber');
var badgesSelector      = document.getElementById('badgesSelector');
var totalPrice          = document.getElementById('totalPrice');
var selectQty           = document.getElementById('selectQty');

var unitPrice           = 120;
var qty                 = 1;
var isFlocked           = false;
var numBadges           = 0;

function init() {
    addEventListenerToCollection(
        thumbs.children, 'click', displayBigPicture)

    sectionFlocking.children[2]
        .addEventListener('click', showFlockForm)

    sectionFlocking.children[1]
        .addEventListener('click', hideFlockForm)

    addEventListenerToCollection(
        flockForm.children, 'keyup', inputFlockValue)

    addEventListenerToCollection(
        badgesSelector.children, 'click', selectBadge)

    selectQty.addEventListener('change', changeQty)
    
}

function addEventListenerToCollection(coll, eventType, cb) {
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener(eventType, cb)
    }
}

function displayBigPicture(e) {
    var src = e.target.getAttribute('src');
    mainImg.setAttribute('src', src);
}

function showFlockForm(e) {
    e.target.classList.toggle('selected');
    e.target.previousElementSibling.classList.toggle('selected');
    flockForm.classList.remove('hide');
    mainImg.src = 'images/3.jpg';
    flockLayer.classList.remove('hide');
    isFlocked = true;
    computeTotal();
}

function hideFlockForm(e) {
    e.target.classList.toggle('selected');
    e.target.nextElementSibling.classList.toggle('selected');
    flockForm.classList.add('hide');
    flockLayer.classList.add('hide');
    flockForm.children[0].value = '';
    flockForm.children[1].value = '';
    flockName.innerText = '';
    flockNumber.innerText = '';
    isFlocked = false;
    computeTotal();
}

function inputFlockValue(e) {
    var value = e.target.value;
    if (e.target.dataset.id === 'name') {
        flockName.innerText = value;
    } else {
        flockNumber.innerText = value;
    }
}

function selectBadge(e) {
    if (e.target.checked) {
        numBadges += 1;
    } else {
        numBadges -= 1;
    }
    computeTotal();
}

function changeQty(e) {
    qty = e.target.value;
    computeTotal();
}

function computeTotal() {
    var total = unitPrice + (numBadges * 10);
    total += isFlocked ? 10 : 0;
    total *= qty;
    totalPrice.innerText = total;
}

init();