
function newGame() {
    // testing purposes
    console.log("newGame has started");
    //should render scoreList.html 
    window.location.href = '/newGame'; //this works 
}


function deleteFxn() {
    //var idToDel = document.getElementById("")
    console.log("Delete Function called");
}

function getVars() {
    event.preventDefault();
    //get the username and points from data inputed
    var newUser = document.getElementById("Username"); 
    var autoPoints = document.getElementById("Points"); 

    var username = newUser.value; 
    var points = autoPoints.value;

    if(points != 0){
        console.log("The score isn't 0. ");
        return;
    }
    console.log(`${username} is added with ${points}`);
    var player_info = [username,points];

    fetch('/scoreForm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: player_info,
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data); //log response to server
            //redirect to scorelist 
            window.location.href = '/scoreList'; 
        })
        .catch(error => {
            console.error('Error:', error);
            //error handling
        });
}


