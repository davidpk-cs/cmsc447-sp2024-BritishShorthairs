//global to hold players
curr_users = []; //will hold all players 
 i = 0; //index of the array

function newGame() {
    // testing purposes
    //console.log("newGame has started");
    createMaterialDB(); //init materials DB
    createProductDB(); //initialize products DB
    //should render newGame 
   window.location.href = '/newGame'; //this works 
}

function startPoke(){
    window.location.href = '/pokemon'; //this works 
}

function inputUser() {
    // testing purposes
    console.log("username has started");
    //should render newGame 
   window.location.href = '/input'; //this works 
}

function getData(){
    return fetch('/request', { method: 'GET'})
    .then(response => {
        return response.json();
    })
    .then(data => {
        return data
    });

}


function loadData() {
    
    getData().then(data => {

    var table = document.getElementById("scoreTable");

    var newHTML = "<tr>\
    <th>Name</th>\
    <th>Level 1</th>\
    <th>Level 2</th>\
    <th>Level 3</th>\
    <th>Final</th>\
    </tr>";

    for(var i = 0; i < data.length; i++){
    
        newHTML += "<tr>";
        newHTML += "<th>" + data[i][0] + "</th>";
        newHTML += "<th>" + data[i][1].toString() + "</th>";
        newHTML += "<th>" + data[i][2].toString() + "</th>";
        newHTML += "<th>" + data[i][3].toString() + "</th>";
        newHTML += "<th>" + data[i][4].toString() + "</th>";
        newHTML += "</tr>";
    }

    table.innerHTML = newHTML;

    updateStatus("Table Is Up To Date");

    });
}

function deleteEntry(){

    var idField = document.getElementById("deleteID");
    var id = idField.value;

    updateStatus("Deleted Student Of the ID specified If that student exists: Update Page to See New Table")

    fetch('/delete', 
    {method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        data: id,
    })
    });

}
function returningPlayer() {
    //grab value
    let username = document.getElementById('returningName').value;

    fetch('/returnPlayer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username })
    })
    .then(response => response.json())
    .then(data => {
        if ('redirect' in data) {
            window.location.href = data.redirect; //redirect server based on repsosne
        } else {
            console.log(data); // Handle other responses or errors
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function addEntry(){
    var nameField = document.getElementById("createName");
    var name = nameField.value;
    var score1 = 0; //all new players must start at score 0
    var score2 = 0;
    var score3 = 0;
    var final = 0;

    if(isValidNum(score1) == 0){
        updateStatus("Failed to Add, Invalid ID or Score, ID and Score must be an integer");
        return;
    }


    var fullTuple = [name,score1,score2,score3,final];

    updateStatus("Added New Student If ID Is Unique and Entry Sizes do not Exceed the Set Max: Update Page to See New Table");

    fetch('/add', 
    {method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        data: fullTuple,
    })
    });

    //update the curr_user arrays and index
    curr_users[i] = name;
    i++; //increase index for next addition
    //after player is added they will be redirected to start the game
    newGame();
    
}



function search(){
    
    var searchSelect = document.getElementById("searchType");
    var searchType = searchSelect.value;
    var searchBar = document.getElementById("searchField");
    var searchValue = searchBar.value;

    var toSend = [searchValue, searchType];

    console.log(toSend);

    fetch('/search', 
    {method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        data: toSend,
    })
    }).then(response => {
        return response.json();
    })
    .then(data => {
        
        var table = document.getElementById("scoreTable");

        var newHTML = "<tr>\
        <th>Name</th>\
        <th>Points</th>\
        </tr>";

        for(var i = 0; i < data.length; i++){
        
            newHTML += "<tr>";
            newHTML += "<th>" + data[i][0] + "</th>";
            newHTML += "<th>" + data[i][1].toString() + "</th>";
            newHTML += "</tr>";
        }

        table.innerHTML = newHTML;

        updateStatus("Query Executed: Tables that Match your Search Term Have Been Singled Out");

    });
}

function reset(){
    curr_users = []; //clear the database

    return fetch('/reset', { method: 'GET'})
    .then(response => {
        return response.json();
    })
    .then(data => {
        updateStatus("Reset the Database: Update to See Default");
    });
}
/*
function sendTopScores(){
    //call the route that handles this database
    fetch('/sendTopScores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})  
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);  
        })
        .catch(error => {
            console.error('Error sending top scores:', error);
        });
}
*/
function createMaterialDB(){
    //this fxn  inits the materials DB
    return fetch('/createMaterial', { method: 'GET'})
    .then(response => {
        return response.json();
    })
    .then(data => {
        updateStatus("Materials Database Created !");
    });
}

function createProductDB(){
    //this fxn  inits the products DB
    return fetch('/createProduct', { method: 'GET'})
    .then(response => {
        return response.json();
    })
    .then(data => {
        updateStatus("Products Database created !");
    });
}

function updateStatus(newStatus){

    statusMsg = document.getElementById("status");

    statusMsg.innerHTML = "Status: " + newStatus;

}

function isValidNum(theString) {
    // Use regex to make sure its an int 
    const regex = /^\d+$/;

    return regex.test(theString);
}




window.addEventListener('load', loadData);

