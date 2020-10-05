/*
 TP: cantiusers
 Author: Christophe DUFOUR
*/

var API = 'http://192.168.0.25:8080/lunchtime';
var token = '';
var users = [];
var usersFiltered = [];
var userList = document.getElementById('userList');
var txtUser = document.getElementById('txtUser');
var log = document.getElementById('log');
var numUsers = txtUser.nextElementSibling;
var walletData = { value: null, index: -1, userId : -1 };

async function login() {
    var credentials = {
        email: 'toto@gmail.com',
        password: 'bonjour'
    };
    var options = {
        method: 'POST',
        body: JSON.stringify(credentials)
    };
    return await fetch(API + '/login', options)
}

async function getUsers(token) {
    var options = {
        headers: { "Authorization": token }
    };
    var res = await fetch(API + '/user/findall', options);
    return res.json();
}

function creditOrDebit(operation, value, userId) {
    var options = {
        method: 'POST',
        headers: { "Authorization": token }
    };
    var url = 'user/' + operation + '/' + userId + '?amount=' + value;
    fetch(API + '/' + url, options).then(res => {
        log.innerText = 'Wallet updated';
        log.classList.toggle('hide');
        return res.json();
    })
    .then(user => {
        walletData.value = user.wallet;
        rmPreviousInput();
    })
} 

async function init() {
    var res = await login();
    token = res.headers.get('Authorization');
    users = await getUsers(token);
    usersFiltered = [...users]; // copy
    buildUserList(usersFiltered);
    txtUser.addEventListener('keyup', searchUser);
    log.addEventListener('click', hideLog);
}

function buildUserList(users) {
    userList.innerHTML = '';
    users.forEach((user, index) => {
        var userRow = document.createElement('div');
        var evenOrOdd = index % 2 ? 'even' : 'odd';
        userRow.classList.add('row', evenOrOdd);
        userRow.dataset.index = index;
        userRow.dataset.userId = user.id;
        buildUserRow(userRow, user);
        userList.appendChild(userRow);
    })
    numUsers.innerText = users.length;
}

function buildUserRow(userRow, user) {
    var userName = document.createElement('div');
    var userFirstname = document.createElement('div');
    var userWallet = document.createElement('div');
    var userActions = document.createElement('div');
    var btnEdit = document.createElement('button');

    btnEdit.addEventListener('click', editWallet);
    
    userName.innerText = user.name;
    userFirstname.innerText = user.firstname;
    userWallet.innerText = user.wallet;
    btnEdit.innerText = 'Edit wallet';

    userRow.appendChild(userName);
    userRow.appendChild(userFirstname);
    userRow.appendChild(userWallet);
    userActions.appendChild(btnEdit);
    userRow.appendChild(userActions);
}

function editWallet(e) {
    e.target.parentNode.parentNode.classList.add('selected');

    if (e.target.innerText === 'Save') {
        updateWallet(e);
        return;
    }

    rmPreviousInput();
    var divWallet = e.target.parentNode.parentNode.children[2];
    var txtWallet = document.createElement('input');

    txtWallet.setAttribute('type', 'text');
    txtWallet.classList.add('wallet');

    walletData.value = parseFloat(divWallet.innerText);
    walletData.index = divWallet.parentNode.dataset.index;
    walletData.userId = divWallet.parentNode.dataset.userId;
    
    var savedWalletValue = divWallet.innerText;
    txtWallet.value = savedWalletValue;
    divWallet.textContent = '';
    
    divWallet.appendChild(txtWallet);
    e.target.innerText = 'Save';
}

function rmPreviousInput() {
    if (walletData.index === -1) return;
    userList.children[walletData.index].classList.remove('selected');
    userList.children[walletData.index].children[2].innerText = walletData.value;
    userList.children[walletData.index].children[3].children[0].innerText = 'Edit wallet';
}

function updateWallet(e) {
    var divWallet = e.target.parentNode.parentNode.children[2];
    var oldValue = walletData.value;
    var newValue = parseFloat(divWallet.children[0].value).toFixed(2);

    if (oldValue === newValue) return;

    if (oldValue < newValue) {
        creditOrDebit('credit', newValue - oldValue, walletData.userId);
    } else {
        creditOrDebit('debit', oldValue - newValue, walletData.userId);
    }
}

function searchUser(e) {
    var searchText = e.target.value.toLowerCase();
    if (searchText.length > 2) {
        var newUserList = users.filter(user => 
            user.name.toLowerCase().indexOf(searchText) !== -1)
        buildUserList(newUserList);
    } else {
        buildUserList(users);
    }
}

function hideLog() {
    log.innerText = '';
    log.classList.toggle('hide');
}

init();