
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
    //get the username and points from data inputed
    var newUser = document.getElementById("Username"); 
    var autoPoints = document.getElementById("Points"); 

    var username = newUser.value; 
    var points = autoPoints.value;

    if(points != 0){
        console.log("The score isn't 0. ");
        return;
    }
    console.log('${username} is added with ${points}',)
}
