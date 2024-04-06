var enemies = [];
var enemyIds = [];

var towers = [];

var enemyCount = 12;
var enemySpeed = 10;

var lasersActive = false;

const framesPerSecond = 60;

const totalTimeInSeconds = 0.1; // Total time for one cycle
const functionTimeInSeconds = totalTimeInSeconds / 2; // Equal time for each function

const firstFunctionTimeInSeconds = functionTimeInSeconds; // Time for the first function
const secondFunctionTimeInSeconds = functionTimeInSeconds; // Time for the second function

const totalFrames = framesPerSecond * totalTimeInSeconds;
const functionFrames = framesPerSecond * functionTimeInSeconds;

var currentFunction = 0; // Keeps track of which function to run


var currentFrame = 0;

function moveEnemies() {
    //console.log("First function");

    for (var i = 0; i < enemies.length; i++) {
        var target = document.getElementById("homeBase");

        var targetStyles = window.getComputedStyle(target);
        var enemyStyles = window.getComputedStyle(enemies[i]);

        // Assuming the top and left values are in percentages in CSS, calculate their pixel values relative to the parent container
        var targetTop = parseFloat(targetStyles.top);
        var targetLeft = parseFloat(targetStyles.left);

        var enemyTop = parseFloat(enemyStyles.top);
        var enemyLeft = parseFloat(enemyStyles.left);

        //console.log(targetTop, targetLeft, enemyTop, enemyLeft);

        // Calculate 1/1000th of the distance
        var changeX = (targetLeft - enemyLeft) / 200;
        var changeY = (targetTop - enemyTop) / 200;

        // Calculate new positions for enemy
        var newX = enemyLeft + changeX;
        var newY = enemyTop + changeY;

        // Update the x and y positions of enemies[i] in pixels
        enemies[i].style.left = `${newX}px`;
        enemies[i].style.top = `${newY}px`;
    }

}

function activateTowers() {

    lasersActive = true;

    const canvas = document.getElementById("weaponField");
    var canvasRect = canvas.getBoundingClientRect();
    canvas.width = canvasRect.width;
    canvas.height = canvasRect.height;

    for(var i = 0; i < towers.length; i++){

        var towerStyles = window.getComputedStyle(towers[i])
        var towerTop = parseInt(towerStyles.top);
        var towerLeft = parseInt(towerStyles.left);

        // Set the drawing buffer size to match the displayed size

        var towerRect = towers[i].getBoundingClientRect();

        const towerX = towerRect.left - canvasRect.left;
        const towerY = towerRect.top - canvasRect.top

        console.log(towerX, towerY);

    
        for(var j = 0; j < enemies.length; j++){
            
            
            var enemyStyles = window.getComputedStyle(enemies[j]);
            var enemyTop = parseInt(enemyStyles.top);
            var enemyLeft = parseInt(enemyStyles.left);
            
            var enemyRect = enemies[j].getBoundingClientRect();
            const enemyX = enemyRect.left - canvasRect.left;
            const enemyY = enemyRect.top - canvasRect.top;
            

            var distance = Math.sqrt((enemyTop - towerTop)**2 + (enemyLeft - towerLeft)**2);

            //console.log(distance);
            if(distance < 100){
                //console.log("found");

                draw = canvas.getContext("2d");

                draw.beginPath();

                draw.moveTo(towerX, towerY);
                draw.lineTo(enemyX, enemyY);

                draw.stroke();

                enemies[j].parentNode.removeChild(enemies[j]);

                enemies.splice(j, 1);
                break;
            }
            else{
                //console.log("not found");
            }

        }
    }
}

function runRound() {
    if (currentFrame < functionFrames) {


        if (currentFunction === 0) {

            var canvas = document.getElementById('weaponField'); // Replace 'myCanvas' with the id of your canvas
            var ctx = canvas.getContext('2d');
            // Clear the entire canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            moveEnemies();
        } else {
            activateTowers();
        }
    } else if (currentFrame < 2 * functionFrames) {
        if (currentFunction === 1) {
            moveEnemies();
        } else {
            //nothing over here, just keep existing canvas
        }
    }
    
    currentFrame++;

    if (currentFrame >= 2 * functionFrames) {
        currentFrame = 0;
        currentFunction = (currentFunction + 1) % 2; // Switch between functions
    }

    requestAnimationFrame(runRound);
}

function mainFunc(){

    for(var i = 0; i < enemyCount; i++){
    
        var newRock = document.createElement("div");

        newID = "enemy" + i.toString();

        newRock.id= newID;

        newRock.style.width ='40px';
        newRock.style.height = '40px';
        newRock.style.backgroundColor = 'pink';
        newRock.style.borderRadius = "50%";

        newRock.style.position="absolute";

        var position = randomInt(10, 80);
        
        newRock.style.left="1%";
        newRock.style.top= position.toString() + "%";
        //newRock.style.top = "50%";


        var enemyHolder = document.getElementById("viewPort")

        enemyHolder.appendChild(newRock);

        enemies.push(newRock);
    }

    runRound();
}


function placeTower(){

    document.getElementById('viewPort').addEventListener('click', function(event) {

        //console.log("here");

        var viewPortPos = event.currentTarget.getBoundingClientRect();

        var x = event.clientX - viewPortPos.left;
        var y = event.clientY - viewPortPos.top;

        var newTower = document.createElement("div");

        newTower.style.position = "absolute";
        
        newTower.style.width ='60px';
        newTower.style.height = '60px';
        newTower.style.backgroundColor = 'black';
        newTower.style.borderRadius = "50%";

        newTower.style.top = y.toString() + "px";
        newTower.style.left = x.toString() + "px";

        newTower.id = "tower" + towers.length.toString();

        document.getElementById("viewPort").appendChild(newTower);

        towers.push(newTower);
    
    }, { once: true });

}



function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }