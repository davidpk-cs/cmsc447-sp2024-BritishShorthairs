var enemies = [];
var enemyFragments = [];
var enemyHP = [];

var towers = [];

var enemyCount = 3;
var enemyWaves = -1;

var enemySpeed = 10;

var lasersActive = false;

var score = 0;

var credits = 10;

var lives = 100;

const framesPerSecond = 60; //program tested on high refresh rate screens it works fine

const totalTimeInSeconds = 0.1; // Total time for one cycle
const functionTimeInSeconds = totalTimeInSeconds / 2; // Equal time for each function
const firstFunctionTimeInSeconds = functionTimeInSeconds; // Time for the first function
const secondFunctionTimeInSeconds = functionTimeInSeconds; // Time for second function!
const totalFrames = framesPerSecond * totalTimeInSeconds;
const functionFrames = framesPerSecond * functionTimeInSeconds;
var currentFunction = 0; //so we know what func to run

var canPlace = true;
var activeTowerPlacement = false;

var assetsPath = "../assets/"


var currentFrame = 0;

function moveEnemies() {
    //console.log("First function");

    for (var i = 0; i < enemies.length; i++) {
        var target = document.getElementById("homeBase");
    
        var targetStyles = window.getComputedStyle(target);
        var enemyStyles = window.getComputedStyle(enemies[i]);
    
        var targetTop = parseFloat(targetStyles.top);
        var targetLeft = parseFloat(targetStyles.left);
    
        var enemyTop = parseFloat(enemyStyles.top);
        var enemyLeft = parseFloat(enemyStyles.left);
    
        //console.log(targetTop, targetLeft, enemyTop, enemyLeft);
    
        // Calculate 1/1000th of the distance
        var changeX = (targetLeft - enemyLeft) / enemyFragments[i];
        var changeY = (targetTop - enemyTop) / enemyFragments[i];
    
        // Calculate new positions for enemy
        var newX = enemyLeft + changeX;
        var newY = enemyTop + changeY;
    
        // Update the x and y positions of enemies[i] in pixels
        enemies[i].style.left = `${newX}px`;
        enemies[i].style.top = `${newY}px`;

        if(enemyFragments[i] > 5){
            enemyFragments[i] -= 1;
        }
        
        var contactThreshold = 10; // pixels you need to be close enough to count as a touch
        if (Math.abs(newX - targetLeft) <= contactThreshold && Math.abs(newY - targetTop) <= contactThreshold) {
            lives--;

            if(lives == 0){
                document.getElementById("livesBoard").innerText = "Lives Remaining: 0";
                return;
            }
            
        }

        if (enemyFragments[i] > 5) {
            enemyFragments[i] -= 1;
        }

    }

    document.getElementById("livesBoard").innerText = "Lives Remaining: " + lives.toString();
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

        // Set the drawing buffer size to match the displayed size so we can draw on full canvas

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

                draw.strokeStyle = "red";

                draw.stroke();

                attackEnemy(j);
                
                break;
            }
            else{
                //console.log("not found");
            }

        }

        document.getElementById("scoreBoard").innerText = "Score: " + score.toString();
    }
}

function attackEnemy(j){

    enemyHP[j] -= 1;

    if(enemyHP[j] == 0){

        enemies[j].parentNode.removeChild(enemies[j]);
        enemies.splice(j, 1);
        enemyFragments.splice(j, 1);
        enemyHP.splice(j, 1);

        score++;
    }
    
}

function runRound() {

    coverScreenWithTransparentDiv();

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

            if(enemyWaves){
                sendEnemyWave();
                enemyCount++;
                enemyWaves--;
            }

            moveEnemies();
        } else {
            //nothing over here, just keep existing canvas
        }
    }

    if(lives == 0){

        createEndingCover("Good Game! Total Score: " + score.toString());

        return;
    }
    
    currentFrame++;

    if (currentFrame >= 2 * functionFrames) {
        currentFrame = 0;
        currentFunction = (currentFunction + 1) % 2; // Switch between functions
    }

    requestAnimationFrame(runRound);
}

function mainFunc(){

    sendEnemyWave();

    enemyWaves--;

    runRound();
}

function sendEnemyWave(){

    for(var i = 0; i < enemyCount; i++){
    
        var newRock = document.createElement("img"); // Change 'div' to 'img'

        newID = "enemy" + i.toString();
        newRock.id = newID;

        newRock.style.width = '60px';
        newRock.style.height = '60px';
        // The backgroundColor and borderRadius are not needed for an image, so those lines are removed.

        newRock.src = assetsPath + 'enemies/tile007.png'; // Set the source to the PNG sprite

        newRock.style.position="absolute";

        var position = randomInt(10, 80);
        
        newRock.style.left="1%";
        newRock.style.top= position.toString() + "%";
        //newRock.style.top = "50%";


        var enemyHolder = document.getElementById("viewPort")

        enemyHolder.appendChild(newRock);

        enemies.push(newRock);
        enemyFragments.push(201);
        enemyHP.push(1);
    }

}


function placeTower(){

    if(credits == 0){
        return;
    }

    credits--;

    document.getElementById("creditBoard").innerText = "Credits Remaining: " + credits.toString();

    document.getElementById('viewPort').addEventListener('click', function(event) {

        //console.log("here");

        var viewPortPos = event.currentTarget.getBoundingClientRect();

        var x = event.clientX - viewPortPos.left;
        var y = event.clientY - viewPortPos.top;

        var newTower = document.createElement("img");

        newTower.src = assetsPath + "enemies/ufoBlue.png"; // Setting the source of the image

        newTower.style.position = "absolute";
        newTower.style.width = '60px';
        newTower.style.height = '60px';

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


function coverScreenWithTransparentDiv() {

    //this is to make sure you can't do anything once you start the game
   
    const overlay = document.createElement('div');
  
    // Style the div to be fully transparent
    overlay.style.position = 'fixed'; 
    overlay.style.top = '0'; 
    overlay.style.left = '0';
    overlay.style.width = '100vw'; // Cover the full viewport width
    overlay.style.height = '100vh'; // Cover the full viewport height
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)'; //  transparent background
    overlay.style.zIndex = '1000'; 
  
    document.body.appendChild(overlay);
}


function createEndingCover(message) {

    // Check if overlay already exists and kill if needed
    const existingOverlay = document.getElementById('customOverlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }
  
    // make the div
    const overlay = document.createElement('div');
    overlay.id = 'customOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'; // a bit of transparent white
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000'; // this is to cover everything
  
    // Create the header with the message
    const header = document.createElement('h2');
    header.textContent = message;
    header.style.textAlign = 'center';
  
    // Create the reload button
    const button = document.createElement('button');
    button.textContent = "Restart Game";
    button.onclick = function() {
      window.location.reload();
    };
  
    // add message to the div
    overlay.appendChild(header);
    overlay.appendChild(button);
  
    // deploy!!
    document.body.appendChild(overlay);
}
  
 
  