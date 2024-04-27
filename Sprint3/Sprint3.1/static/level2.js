var enemies = []; //enemy objects

var towers = []; //tower objects

var lasersActive = false; //indicating that lasers are present on the screen, so we know to clean

var score = 0; //number of points


const coverName = "coverDiv";
const endingCoverName = "endingDiv";


//------------
const framesPerSecond = 60; //program tested on high refresh rate screens it works fine

const totalTimeInSeconds = 0.1; // Total time for one cycle
const functionTimeInSeconds = totalTimeInSeconds / 2; // Equal time for each function
const firstFunctionTimeInSeconds = functionTimeInSeconds; // Time for the first function
const secondFunctionTimeInSeconds = functionTimeInSeconds; // Time for second function!
const totalFrames = framesPerSecond * totalTimeInSeconds;
const functionFrames = framesPerSecond * functionTimeInSeconds;
var currentFunction = 0; //so we know what func to run

var currentFrame = 0; //current frame we are on, for tracking frames.
//--------------


var canPlace = true; 
var activeTowerPlacement = false; 
// ^ when true that means the user hit the place tower button and hasn't placed yet


var assetsPath = "static/Assets/" //location of assets folder

var homeBaseTop = 0;
var homeBaseLeft = 0;


var credits = 1800; //money

var lives = 300; //lives

var lifeStyle = 25; //range is 20% to 60%;
var criticalStrikeOdds = 25; //range is 10-30%
var enemyDamage = 3; //the range is 6-9
var enemyHP = 1; //range is 4-5
var enemyCount = 1; //the range is 20-35 number of enemies per wave
var enemyWaves = 1; //the range is 20-30, number of waves of enemies sent in 
var towerRange = 200; //the range is 90-140
var maxEnemyCount = 40;
towerPrice = 140; //the range is 120 to 220

towerDamage = 3;


function setup(){

    //get the target object
    var target = document.getElementById("homeBase");

    //get styles of the thing that is being targeted
    var targetStyles = window.getComputedStyle(target);

    // get x and y values of the center of the home planet
    homeBaseTop = parseFloat(targetStyles.top) - (parseFloat(targetStyles.height) / 4);
    homeBaseLeft = parseFloat(targetStyles.left) - (parseFloat(targetStyles.width) / 4);


}


function moveEnemies() {
    //console.log("First function");

    for (var i = 0; i < enemies.length; i++) {

        var enemyStyles = window.getComputedStyle(enemies[i].object);

        // get y value
        var targetTop = homeBaseTop;
        var targetLeft = homeBaseLeft;

        //get x value
        var enemyTop = parseFloat(enemyStyles.top);
        var enemyLeft = parseFloat(enemyStyles.left);
    
    
        // Calculate the fraction of the distance to move in this frame
        var changeX = (targetLeft - enemyLeft) / enemies[i].speed;
        var changeY = (targetTop - enemyTop) / enemies[i].speed;
    
        // Calculate new positions for enemy
        var newX = enemyLeft + changeX;
        var newY = enemyTop + changeY;
    
        // Update the x and y positions of enemies[i] in pixels
        enemies[i].object.style.left = `${newX}px`;
        enemies[i].object.style.top = `${newY}px`;

        //by reducing speed fragment we make it speed up the next time
        //this is to make sure that enemies aren't slowing down
        if(enemies[i].speed > 5){
            enemies[i].speed -= 1;
        }
        
        var contactThreshold = 10; // pixels you need to be close enough to count as a touch
        if (Math.abs(newX - targetLeft) <= contactThreshold && Math.abs(newY - targetTop) <= contactThreshold) {
            
            lives -= enemyDamage; //enemy hit target, delete enemy

            if(randomInt(0, 100) < criticalStrikeOdds){
                lives -= enemyDamage * 2;
            }

            if(lives < 0){
                lives = 0;
            }

            selfDestructEnemy(i, true);


            if(lives == 0){ //force end game upon end of game
                document.getElementById("livesBoard").innerText = "Lives Remaining: 0";
                return;
            }
            
        }

    }

    //update lives count
    document.getElementById("livesBoard").innerText = "Lives Remaining: " + lives.toString();
}

function activateTowers() {

    lasersActive = true; //to indicate that things are there and will need to be cleared

    //getting the dimensions of the canvas
    const canvas = document.getElementById("weaponField");
    var canvasRect = canvas.getBoundingClientRect();
    canvas.width = canvasRect.width;
    canvas.height = canvasRect.height;

    for(var i = 0; i < towers.length; i++){

        if(randomInt(0, 100) < failureOdds){
            continue;
        }

        var towerTop = towers[i].top;
        var towerLeft = towers[i].left;   

        // Set the drawing buffer size to match the displayed size so we can draw on full canvas
        var towerRect = towers[i].object.getBoundingClientRect();

        // Tower dimensions so we can center
        const towerWidth = towerRect.width; 
        const towerHeight = towerRect.height; 

        //this puts the laser it fires in the center!
        const towerX = towerRect.left - canvasRect.left + (towerWidth / 2); 
        const towerY = towerRect.top - canvasRect.top + (towerHeight / 2); 


        for(var j = 0; j < enemies.length; j++){
            
            //enemy styles
            var enemyStyles = window.getComputedStyle(enemies[j].object);
            var enemyTop = parseInt(enemyStyles.top);
            var enemyLeft = parseInt(enemyStyles.left);
            
            //enemy dimensions
            var enemyRect = enemies[j].object.getBoundingClientRect();
            const enemyX = enemyRect.left - canvasRect.left + (enemyRect.width);
            const enemyY = enemyRect.top - canvasRect.top + (enemyRect.height);
            
            //calculate distance
            var distance = distanceFormula(towerX, towerY, enemyX, enemyY);

            //if close enough, attack!
            if(distance < towerRange){

                draw = canvas.getContext("2d");
                draw.beginPath();
                draw.moveTo(towerX, towerY);
                draw.lineTo(enemyX, enemyY);
                draw.strokeStyle = "red";
                draw.stroke();
                attackEnemy(j, i);
                
                break; //towers only attack one enemy a frame
            }
            else{
                //console.log("not found");
            }

        }

        //update score
        document.getElementById("scoreBoard").innerText = "Score: " + score.toString();
    }
}

function attackEnemy(enemyIndex, towerIndex, destroy=false){

    enemies[enemyIndex].health -= towers[towerIndex].damage;

    if(enemies[enemyIndex].health <= 0 || destroy){

        enemies[enemyIndex].object.parentNode.removeChild(enemies[enemyIndex].object);
        enemies.splice(enemyIndex, 1);

        score++;
    }
    
}

//j the index of array
//destroy is a parameter to indicate kill enemy even if it has sufficient hp
function selfDestructEnemy(enemyIndex, destroy=false){

    enemies[enemyIndex].health -= 1;

    if(enemies[enemyIndex].health == 0 || destroy){

        enemies[enemyIndex].object.parentNode.removeChild(enemies[enemyIndex].object);
        enemies.splice(enemyIndex, 1);

        score++;
    }
    
}

function runRound() {

    //lock the player from pressing buttons
    coverScreenWithTransparentDiv();

    //the game alternates between 4 frames
    if (currentFrame < functionFrames) {

        if (currentFunction === 0) {

            var canvas = document.getElementById('weaponField'); // Replace 'myCanvas' with the id of your canvas
            var ctx = canvas.getContext('2d');
            // Clear the entire canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            moveEnemies();
        } 
        
        //frame 2
        else {
            activateTowers();
        }
    } 
    
    else if (currentFrame < 2 * functionFrames) {

        if (currentFunction === 1) {

            if(enemyWaves && enemies.length < maxEnemyCount){
                sendEnemyWave();
                enemyCount++;
                enemyWaves--;
            }

            moveEnemies();
        } 
        else {
            //nothing over here, just keep existing canvas
        }
    }

    if(lives == 0 || (enemies.length == 0 && enemyWaves == 0)){

        if(enemies.length == 0 && lives > 0){
            createEndingCover("Mission Success! Total Score: " + score.toString());
        }
        else{
            createEndingCover("Nice Try! Better Luck Next Time!", false);
        }

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

    //starting wave
    sendEnemyWave();

    //decrement wave count
    enemyWaves--;

    //go!
    runRound();
}

function sendEnemyWave(){

    for(var i = 0; i < enemyCount; i++){
    
        var newRock = document.createElement("img"); // creating the new element

        newID = "enemy" + i.toString();
        newRock.id = newID;

        //dimensions
        newRock.style.width = '60px';
        newRock.style.height = '60px'; 

        //enemyType
        newRock.src = assetsPath + 'projectiles/Asteroid 01 - Base.png'; // Set the source to the PNG sprite

        newRock.style.position="absolute"; //better for placement

        var spawnSide = randomInt(1, 4); 
        //1 top, 2 right, 3 bottom, 4left

        if(spawnSide == 1){
            newRock.style.top = "3%";
            newRock.style.left = randomInt(3, 97).toString() + "%";
        }
        else if(spawnSide == 3){
            newRock.style.top = "97%";
            newRock.style.left = randomInt(3, 97).toString() + "%";
        }
        else if(spawnSide == 2){
            newRock.style.top = randomInt(3, 97).toString() + "%";
            newRock.style.left = "97%";
        }
        else if(spawnSide == 4){
            newRock.style.top = randomInt(3, 97).toString() + "%";
            newRock.style.left = "3%";
        }
    


        var enemyHolder = document.getElementById("viewPort")

        enemyHolder.appendChild(newRock);

        var enemyToPush = new enemy(newRock, enemyHP, enemyDamage);

        enemies.push(enemyToPush);
    }

}


function placeTower(){

    document.getElementById("creditBoard").innerText = "Credits Remaining: " + credits.toString();

    document.getElementById('viewPort').addEventListener('click', function(event) {


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

        var towerStyles = window.getComputedStyle(newTower)
        var towerTop = parseInt(towerStyles.top);
        var towerLeft = parseInt(towerStyles.left);

        towerToPush = new tower(newTower, towerLeft, towerTop);

        towers.push(towerToPush);

        // Check if the tower is sticking out of the right or bottom edges
        var parentWidth = viewPortPos.width;
        var parentHeight = viewPortPos.height;

        if (towerLeft + parseInt(towerStyles.width) > parentWidth) {
            // If the tower is sticking out of the right edge, adjust its left position
            newTower.style.left = (parentWidth - parseInt(towerStyles.width)) + 'px';
        }

        if (towerTop + parseInt(towerStyles.height) > parentHeight) {
            // If the tower is sticking out of the bottom edge, adjust its top position
            newTower.style.top = (parentHeight - parseInt(towerStyles.height)) + 'px';
        }
    
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

    overlay.id = coverName;
  
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

function coverScreenWithTranslucentDiv() {

    //this is to make sure you can't do anything once you start the game
   
    const overlay = document.createElement('div');

    overlay.id = coverName;
  
    // Style the div to be fully transparent
    overlay.style.position = 'fixed'; 
    overlay.style.top = '0'; 
    overlay.style.left = '0';
    overlay.style.width = '100vw'; // Cover the full viewport width
    overlay.style.height = '100vh'; // Cover the full viewport height
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'; //  transparent background
    overlay.style.zIndex = '1000'; 
  
    document.body.appendChild(overlay);
}


function createEndingCover(message, won=true) {

    // Check if overlay already exists and kill if needed
    const existingOverlay = document.getElementById('customOverlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }
  
    // make the div
    const overlay = document.createElement('div');
    overlay.id = endingCoverName;
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
    header.id = "endingMessage";
    header.textContent = message;
    header.style.textAlign = 'center';
  
    // Create the reload button
    const button = document.createElement('button');
    button.id = "restartButton";
    
    if(won == false){
        button.textContent = "Restart Game";
        button.onclick = function() {
        window.location.reload();
        };
    }
    else{
        button.textContent = "Next"
        button.onclick = function(){
            nextLevel();
        }
    }


  
    // add message to the div
    overlay.appendChild(header);
    overlay.appendChild(button);
  
    // deploy!!
    document.body.appendChild(overlay);
}
  

class enemy{

    constructor(object, health = 1, damage = 1, speed = 201){

        this.health = health;
        this.speed = speed;
        this.object = object;

        this.damage = damage;
    } 

}

class tower{

    constructor(object, xPos, yPos, health = 35, damage = towerDamage, laserCount = 0, criticalStrikeOdds = 25){

        this.object = object;
        this.health = health;
        this.damage = damage;
        this.laserCount = laserCount;
        this.critOdds = criticalStrikeOdds;

        this.top = xPos;
        this.left = yPos;


        this.healthUpgradesLeft = 3;
        this.damageUpgradesLeft = 3;
        this.laserCountUpgradesLeft = 1;
        this.critUpgradesLeft = 3;
    }
}



function distanceFormula(x1, y1, x2, y2) {
    
    var dx = x2 - x1;
    var dy = y2 - y1;

    var dxSquared = Math.pow(dx, 2);
    var dySquared = Math.pow(dy, 2);
    
    var distanceSquared = dxSquared + dySquared;
    
    var distance = Math.sqrt(distanceSquared);
    
    return distance;
}
 

function setUpPurchase(){

    var div = document.getElementById(coverName);

    div.innerHTML = defaultBrief;


    //----------

    briefingInfo = document.getElementById("briefingInfo");

    briefingInfo.innerHTML += "<p> Credits: " + credits.toString() + "<p>";
    briefingInfo.innerHTML += "<p> Tower Health: " + pendingTower.health.toString() + "<p>"; 
    briefingInfo.innerHTML += "<p> Tower Crit Chance " + pendingTower.critOdds.toString() + "<p>";
    briefingInfo.innerHTML += "<p> Tower Laser Count " + pendingTower.laserCount.toString() + "<p>";
    briefingInfo.innerHTML += "<p> Tower Damage " + pendingTower.damage.toString() + "<p>";
    briefingInfo.innerHTML += "<p> Remaining Health Upgrades " + pendingTower.healthUpgradesLeft.toString() + "<p>";
    briefingInfo.innerHTML += "<p> Remaining Crit Upgrades " + pendingTower.critUpgradesLeft.toString() + "<p>";
    briefingInfo.innerHTML += "<p> Remaining Laser Count Upgrades " + pendingTower.laserCountUpgradesLeft.toString() + "<p>";
    briefingInfo.innerHTML += "<p> Remaining Damage Upgrades " + pendingTower.damageUpgradesLeft.toString() + "<p>";

    //----------

    upgradeShop = document.getElementById("contractShop");

    toAppend = "";

    for(var i = 0; i < upgradeOptions.length; i++){

        j = i;

        toAppend += "<div class=\"contractOffer\">";;
        toAppend += "<p>" + upgradeOptions[j].message + "<p>";
        toAppend += "<button onclick = \"" +  "doUpgrade(" + j.toString() + ")\">" + "Contract: " + upgradeOptions[j].price.toString() + " Credits" + "</button>";
        toAppend += "</div>";
    }

    upgradeShop.innerHTML = toAppend;

}

function initiatePurchase(){

    var newTower = document.createElement("img");

    newTower.src = assetsPath + "enemies/ufoBlue.png"; // Setting the source of the image

    newTower.style.position = "absolute";
    newTower.style.width = '60px';
    newTower.style.height = '60px';

    newTower.style.borderRadius = "50%";


    pendingTower = new tower(newTower, 0, 0);


    coverScreenWithTranslucentDiv();

    setUpPurchase();
}


function endUpgrade(){

    finishedBriefing = document.getElementById(coverName);
    finishedBriefing.remove();

}

function doUpgrade(index){
    upgradeOptions[index].purchase();
}





const defaultBrief = `

<div id="missionBrief">

        <div id="missionBriefingReport">

            <h1 id="briefingTitle">Briefing</h1>

            <div id="briefingInfo">
                <p>Your UFO is being made for you! Would you like to upgrade it?
                </p>
            </div>

        </div>

        <div id="contractShop">

        </div>

        <button id="enterGameButton" onclick="placeTower()">Finalize</button>

    </div>
    
`


class healthUpgrade{
    constructor(){
        this.price = 50;
        this.message = "Upgrade Health";
    }
    purchase(){
        if(credits < this.price || pendingTower.healthUpgradesLeft == 0){
            return false;
        }
        credits -= this.price;
        pendingTower.health += 25;
        pandingTower.healthUpgradesLeft -= 1;
        return true;
    }
}

class damageUpgrade{
    constructor(){
        this.price = 50;
        this.message = "Upgrade Damage";
    }
    purchase(){
        if(credits < this.price || pendingTower.damageUpgradesLeft == 0){
            return false;
        }
        credits -= this.price;
        pendingTower.damage += 3;
        pendingTower.damageUpgradesLeft -= 1;
        return true;
    }
}

class laserCountUpgrade{
    constructor(){
        this.price = 150;
        this.message = "Add another Laser";
    }
    purchase(){
        if(credits < this.price || pendingTower.laserCountUpgradesLeft == 0){
            return false;
        }
        credits -= this.price;
        pendingTower.laserCount += 1;
        pendingTower.laserCountUpgradesLeft -= 1;
        return true;
    }
}

class criticalStrikeUpgrade{
    constructor(){
        this.price = 100;
        this.message = "Boost the Crit Chance";
    }
    purchase(){
        if(credits < this.price || pendingTower.critUpgradesLeft == 0){
            return false;
        }
        credits -= this.price;
        pendingTower.critOdds += 15;
        pendingTower.critUpgradesLeft -= 1;
        return true;
    }
}

upgradeOptions = [new healthUpgrade(), 
    new damageUpgrade(), 
    new laserCountUpgrade(),
    new criticalStrikeUpgrade()];


var pendingTower = new tower("none", 0, 0);

//---------------------------------------

//Please put some functions here for connecting to flask
//One should take a high score and pass it into flask to be put in the database for level 1
//

function sendHighScores(score){
    //please get something to send high scores, I'll call it once it is done
}

function sendLoot(lootInfo){
    //this would send the string lootInfo and me and Rippy figure out what the Flask side does with it
}

function nextLevel(){

    window.location.href = '/level2'; //this works 
}

  