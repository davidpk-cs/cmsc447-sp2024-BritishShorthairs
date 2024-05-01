var enemies = []; //enemy objects

var towers = []; //tower objects
var deadTowers = []; //indexes of towers that have been destroyed

var deadEnemyObjects = [];

var towerOptions = [[3, 3, 4, 5, 6, 0],[2, 2, 2, 3, 1, 0],[0, 1, 4, 2, 5, 0]];
//health,damage, crit chance, laser count, range

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

var homeBaseObject = "";


var credits = 60000; //money

var lives = 600; //lives

var enemyDamage = 1; //the range is 6-9
var enemyHP = 3; //range is 4-5

var enemyCount = 3; //the range is 20-35 number of enemies per wave
var enemyWaves = 60; 
var phase1 = 15;
var phase2 = 30;
var phase3 = 45; 
var phase4 = 60;
var maxEnemyWaves = enemyWaves;
var maxEnemyCount = 15;
towerPrice = 140; //the range is 120 to 220

towerDamage = 3;


function chooseDifficulty(){

    coverScreenWithTranslucentDiv();

    cover = document.getElementById(coverName);

    cover.innerHTML = `<div class = "difficultyContainer">
        <button class = "difficultyButton" onclick="endDifficultyScreen(1)">Normal - Not too Hard</button>
        <button class = "difficultyButton" onclick="endDifficultyScreen(2)">Hard - Tougher Enemies</button>
    </div>`;
    
}

function endDifficultyScreen(difficulty = 1){

    if(difficulty == 2){
        hardMode();
    }

    endUpgrade();

    setup();
}

function setup(){

    homeBaseObject = document.getElementById("homeBase");

    //get the target object
    var target = document.getElementById("homeBase");

    //get styles of the thing that is being targeted
    var targetStyles = window.getComputedStyle(target);

    // get x and y values of the center of the home planet
    homeBaseTop = parseFloat(targetStyles.top) - (parseFloat(targetStyles.height) / 4);
    homeBaseLeft = parseFloat(targetStyles.left) - (parseFloat(targetStyles.width) / 4);


}


//enemies select a target here
function findTarget(){


    for(var i = deadEnemyObjects.length - 1; i >= 0; i--){

        deadEnemyObjects[i].remove();
    }
    deadEnemyObjects = [];


    deadTowers.sort();
    for(var i = deadTowers.length - 1; i >= 0; i--){
        towers[deadTowers[i]].object.remove();
        towers.splice(deadTowers[i], 1);

    }
    deadTowers = [];




    for(var i = 0; i < enemies.length; i++){

        if(enemies[i].selfDestruct){
            enemies[i].target = -1;
            continue;
        }

        enemies[i].hasAttacked = false;

        enemyStyles = window.getComputedStyle(enemies[i].object);
        var top = parseFloat(enemyStyles.top) - (parseFloat(enemyStyles.height));
        var left = parseFloat(enemyStyles.left) - (parseFloat(enemyStyles.width));

        var homeBaseDistance = distanceFormula(left, top, homeBaseLeft, homeBaseTop);
        
        nearestIndex = -1;
        nearestDistance = homeBaseDistance;

        for(var j = 0; j < towers.length; j++){

            distance = distanceFormula(left, top, towers[j].left, towers[j].top)
            
            if(distance < nearestDistance){

                nearestIndex = j;
                nearestDistance = distance;
            }
            
        }

        enemies[i].target = nearestIndex;
    }

}


function moveEnemies() {

    //getting the dimensions of the canvas
    const canvas = document.getElementById("weaponField");
    var canvasRect = canvas.getBoundingClientRect();
    canvas.width = canvasRect.width;
    canvas.height = canvasRect.height;

    for (var i = 0; i < enemies.length; i++) {

        var contactThreshold = enemies[i].target < 0 ? enemies[i].range + 40: enemies[i].range; // pixels you need to be close enough to count as a touch

        if(deadTowers.includes(enemies[i].target)){
            enemies[i].target = -1;
        }

        // get y value
        var targetTop = homeBaseTop;
        var targetLeft = homeBaseLeft;

        if(enemies[i].target >= 0){
            targetTop = towers[enemies[i].target].top;
            targetLeft = towers[enemies[i].target].left;

            var targetStyles = window.getComputedStyle(towers[enemies[i].target].object);

            var targetX = targetLeft + (parseFloat(targetStyles.width) / 2);
            var targetY = targetTop + (parseFloat(targetStyles.height) / 2);
        }
        else{

            baseStyles = window.getComputedStyle(homeBaseObject);
            var targetX = targetLeft + (parseFloat(baseStyles.width) / 2);
            var targetY = targetTop + (parseFloat(baseStyles.height) / 2);
        }
        
        var enemyStyles = window.getComputedStyle(enemies[i].object);

        //get x value
        var enemyTop = parseFloat(enemyStyles.top);
        var enemyLeft = parseFloat(enemyStyles.left);

        var width = parseFloat(enemyStyles.width);
        var height = parseFloat(enemyStyles.height);
        var enemyX =  enemyLeft + (width / 2);
        var enemyY = enemyTop + (height / 2);

        
        if((Math.abs(enemyX - targetX) > contactThreshold || Math.abs(enemyY - targetY) > contactThreshold)){

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

            //now let's establish the new X and new Y values for the canvas, so they are centered
            enemyX = newX + (width / 2);
            enemyY = newY + (height / 2);
        }
        
        if (Math.abs(enemyX - targetX) <= contactThreshold && Math.abs(enemyY - targetY) <= contactThreshold) {
            
            //if targetting homebase
            if(enemies[i].target < 0){

                lives -= enemies[i].damage; //enemy hit target

                if(lives < 0){
                    lives = 0;
                }

            }

            else{
                attackTower(i);
            }

            if(enemies[i].selfDestruct == true){

                selfDestructEnemy(i, true);
                return;
            }

            draw = canvas.getContext("2d");
            draw.beginPath();
            draw.moveTo(enemyX, enemyY);
            draw.lineTo(targetX, targetY);
            draw.strokeStyle = "green";
            draw.stroke();

            if(lives == 0){ //force end game upon end of game
                document.getElementById("livesBoard").innerText = "Lives Remaining: 0";
                return;
            }

        }

    }

    //update lives count
    document.getElementById("livesBoard").innerText = "Lives Remaining: " + lives.toString();
}

function attackTower(enemyIndex){

    towerIndex = enemies[enemyIndex].target;
    towers[towerIndex].health -= enemies[enemyIndex].damage;

    if(towers[towerIndex].health <= 0){
        towers[towerIndex].object.src = assetsPath + "explosions/tile002.png";
        deadTowers.push(towerIndex);
    }

}

function activateTowers() {

    lasersActive = true; //to indicate that things are there and will need to be cleared

    //getting the dimensions of the canvas
    const canvas = document.getElementById("weaponField");
    var canvasRect = canvas.getBoundingClientRect();
    canvas.width = canvasRect.width;
    canvas.height = canvasRect.height;

    for(var i = 0; i < towers.length; i++){

        var attacksLeft = towers[i].laserCount;

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
            if(distance < towers[i].range){

                draw = canvas.getContext("2d");
                draw.beginPath();
                draw.moveTo(towerX, towerY);
                draw.lineTo(enemyX, enemyY);
                draw.strokeStyle = "red";
                draw.stroke();
                attackEnemy(j, i);
                
                attacksLeft--; //make sure towers attack only as many times as they can
                if(attacksLeft == 0){
                    break; 
                }
                
            }


        }

        //update score
        document.getElementById("scoreBoard").innerText = "Score: " + score.toString();
    }
}

function attackEnemy(enemyIndex, towerIndex, destroy=false){

    enemies[enemyIndex].health -= towers[towerIndex].damage;

    //double damage if it is a critical strike
    if(randomInt(0, 100) < towers[towerIndex].critOdds){
        enemies[enemyIndex].health -= towers[towerIndex].damage;
    }

    if(enemies[enemyIndex].health <= 0 || destroy){

        deadEnemyObjects.push(enemies.splice(enemyIndex, 1)[0].object)
        deadEnemyObjects[deadEnemyObjects.length - 1].src = assetsPath + "explosions/tile003.png";

        score++;
    }
    
}

//j the index of array
//destroy is a parameter to indicate kill enemy even if it has sufficient hp
function selfDestructEnemy(enemyIndex, destroy=false){

    enemies[enemyIndex].health -= 1;

    if(enemies[enemyIndex].health == 0 || destroy){

        deadEnemyObjects.push(enemies.splice(enemyIndex, 1)[0].object)
        deadEnemyObjects[deadEnemyObjects.length - 1].src = assetsPath + "explosions/tile001.png";

        score++;
    }
    
}

function runRound() {

    //lock the player from pressing buttons
    coverScreenWithTransparentDiv();

    //the game alternates between 4 frames
    if (currentFrame < functionFrames) {

        if (currentFunction === 0) {

            var canvas = document.getElementById('weaponField'); 
            var ctx = canvas.getContext('2d');
            // Clear the entire canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            moveEnemies();
        } 
        
        //frame 2
        else {

            var canvas = document.getElementById('weaponField'); 
            var ctx = canvas.getContext('2d');
            // Clear the entire canvas of enemy lasers
            ctx.clearRect(0, 0, canvas.width, canvas.height);


            activateTowers();
        }
    } 
    
    else if (currentFrame < 2 * functionFrames) {

        if (currentFunction === 1) {

            if(enemyWaves && enemies.length < maxEnemyCount){
                
                sendEnemyWave();
                enemyWaves--;
            }

            moveEnemies();
        } 
        else {
            findTarget(); 
            //this is an uneventful frame where enemies search and identify targets
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
        else if(spawnSide == 2){
            newRock.style.top = "97%";
            newRock.style.left = randomInt(3, 97).toString() + "%";
        }
        else if(spawnSide == 3){
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

        var phase = determineQuarter(maxEnemyWaves - enemyWaves, maxEnemyWaves);
        
        //spawn a mix of different levels instead of blasting top level ones at the end
        phase = randomInt(1, phase); 

        if(phase <= 1){
            var roll = randomInt(0, 5);
            if (roll == 0){enemyToPush.level1();}
            else if(roll == 1){enemyToPush.level2();}
            else if(roll == 2){enemyToPush.level3();}
            else if(roll == 3){enemyToPush.level4();}
            else if(roll == 4){enemyToPush.killerAsteroid();}
            else if(roll = 5){enemyToPush.boss1()};
        }
        else if (phase == 2){
            var roll = randomInt(0, 5);
            if (roll == 0){enemyToPush.level3();}
            else if(roll == 1){enemyToPush.level4();}
            else if(roll == 2){enemyToPush.level5();}
            else if(roll == 3){enemyToPush.level6();}
            else if(roll == 4){enemyToPush.killerAsteroid();}
            else if(roll = 5){enemyToPush.boss1()};
        }
        else if (phase == 3){
            var roll = randomInt(0, 5);
            if (roll == 0){enemyToPush.level5();}
            else if(roll == 1){enemyToPush.level6();}
            else if(roll == 2){enemyToPush.level7();}
            else if(roll == 3){enemyToPush.level8();}
            else if(roll == 4){enemyToPush.superAsteroid();}
            else if(roll = 5){enemyToPush.boss1()};
        }
        else if(phase == 4){
            var roll = randomInt(0, 5);
            if (roll == 0){enemyToPush.level5();}
            else if(roll == 1){enemyToPush.level6();}
            else if(roll == 2){enemyToPush.level7();}
            else if(roll == 3){enemyToPush.level8();}
            else if(roll == 4){enemyToPush.superAsteroid();}
            else if(roll = 5){enemyToPush.boss2()};
        }

        enemies.push(enemyToPush);
    }

}


function placeTower(){

    document.getElementById("creditBoard").innerText = "Credits Remaining: " + credits.toString();

    document.getElementById("messageBoard").innerText = "Please Place Down Your Tower!"


    activeTowerPlacement = true;


    document.getElementById('viewPort').addEventListener('click', function(event) {


        var viewPortPos = event.currentTarget.getBoundingClientRect();

        var x = event.clientX - viewPortPos.left;
        var y = event.clientY - viewPortPos.top;

        var newTower = pendingTower.object;

        newTower.src = assetsPath + "enemies/ufoBlue.png"; // Setting the source of the image

        newTower.style.position = "absolute";
        newTower.style.width = '60px';
        newTower.style.height = '60px';

        newTower.style.borderRadius = "50%";


        newTower.style.top = y.toString() + "px";
        newTower.style.left = x.toString() + "px";

        newTower.id = "tower" + towers.length.toString();

        document.getElementById("viewPort").appendChild(newTower);


        // Check if the tower is sticking out of the right or bottom edges
        var parentWidth = viewPortPos.width;
        var parentHeight = viewPortPos.height;

        var towerStyles = window.getComputedStyle(newTower);

        var towerTop = parseInt(towerStyles.top);
        var towerLeft = parseInt(towerStyles.left);

        if (towerLeft + parseInt(towerStyles.width) > parentWidth) {
            // If the tower is sticking out of the right edge, adjust its left position
            newTower.style.left = (parentWidth - parseInt(towerStyles.width)) + 'px';
        }

        if (towerTop + parseInt(towerStyles.height) > parentHeight) {
            // If the tower is sticking out of the bottom edge, adjust its top position
            newTower.style.top = (parentHeight - parseInt(towerStyles.height)) + 'px';
        }

        pendingTower.left = towerLeft;
        pendingTower.top = towerTop;

        towers.push(pendingTower);

        activeTowerPlacement = false;
        document.getElementById("messageBoard").innerText = "200 To Purchase a New Tower";
    
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

    constructor(object, health = 1, damage = 1, range = 90, speed = 201){

        this.health = health;
        this.speed = speed;
        this.object = object;
        this.range = range;

        this.damage = damage;

        this.target = -1;

        this.selfDestruct = false;

        this.hasAttacked = false; //if the enemy already dished an attack in a cycle
    }

    level1(){
        this.health = 15;
        this.damage = 1;
        this.range = 120;

        this.object.src = assetsPath + "enemies/ufo8.png";
    }
    level2(){
        this.health = 20;
        this.damage = 2;
        this.range = 120;

        this.object.src = assetsPath + "enemies/ufo9.png";
    }
    level3(){
        this.health = 25;
        this.damage = 3;
        this.range = 120;
        this.object.src = assetsPath + "enemies/ufo10.png";
    }
    level4(){
        this.health = 30;
        this.damage = 5;
        this.range = 120;
        this.object.src = assetsPath + "enemies/ufo11.png";
    }
    killerAsteroid(){
        this.health = 120;
        this.damage = 10;
        this.range = 10;

        this.selfDestruct = true;

        this.object.src = assetsPath + "projectiles/asteroid 01 - base.png"
    }
    superAsteroid(){
        this.health = 250;
        this.damage = 15;
        this.range = 10;

        this.selfDestruct = true;

        this.object.src = assetsPath + "projectiles/asteroid 01 - base.png"
        this.object.style.height="100px";
        this.object.style.width = "100px";
    }
    boss1(){
        this.health = 75;
        this.damage = 8;
        this.range = 120;
        this.object.src = assetsPath + "enemies/ufo3.png";
    }
    level5(){
        this.health = 35;
        this.damage = 6;
        this.range = 120;
        this.object.src = assetsPath + "enemies/ufo4.png";
    }
    level6(){
        this.health = 45;
        this.damage = 10;
        this.range = 120;
        this.object.src = assetsPath + "enemies/ufo5.png";
    }
    level7(){
        this.health = 52;
        this.damage = 15;
        this.range = 120;
        this.object.src = assetsPath + "enemies/ufo6.png";
    }
    level8(){
        this.health = 80;
        this.damage = 16;
        this.range = 120;
        this.object.src = assetsPath + "enemies/ufo7.png";
    }
    boss2(){
        this.health = 200;
        this.damage = 25;
        this.range = 120;
        this.object.src = assetsPath + "enemies/ufo2.png";
    }

}

class tower{

    constructor(object, xPos, yPos, health = 60, damage = towerDamage, laserCount = 1, criticalStrikeOdds = 25, range = 120){

        this.object = object;
        this.health = health;
        this.damage = damage;
        this.laserCount = laserCount;
        this.critOdds = criticalStrikeOdds;
        this.range = range;

        this.top = xPos;
        this.left = yPos;

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
    

    //----------

    upgradeShop = document.getElementById("contractShop");

    toAppend = "";

    for(var i = 0; i < towerOptions.length; i++){

        var buttonMsg = towerOptions[i][5].toString() + " Credits";

        if(towerOptions[i][5] == 0){
            buttonMsg = "Deploy";
        }

        j = i;

        toAppend += "<div class=\"contractOffer\">";;
        toAppend += "<p>Health: " + towerOptions[i][0] + "<p>";
        toAppend += "<p>Damage: " + towerOptions[i][1] + "<p>";
        toAppend += "<p>Crit Chance: " + towerOptions[i][2] + "<p>";
        toAppend += "<p>Lasers: " + towerOptions[i][3] + "<p>";
        toAppend += "<p>Range: " + towerOptions[i][4] + "<p>";
        toAppend += "<button onclick = \"" +  "deployTower(" + j.toString() + ")\">" + buttonMsg + "</button>";
        toAppend += "</div>";
    }

    upgradeShop.innerHTML = toAppend;

}

function deployTower(index){

    if(credits < towerOptions[index][5]){
        return;
    }
    credits -= towerOptions[index][5];
    pendingTower.health = setHealth(towerOptions[index][0]);
    pendingTower.damage = setDamage(towerOptions[index][1]);
    pendingTower.critOdds = setCrit(towerOptions[index][2]);
    pendingTower.laserCount = setLasers(towerOptions[index][3]);
    pendingTower.range = setRange(towerOptions[index][4]);

    console.log(pendingTower);

    towerOptions.splice(index, 1);

    endUpgrade();
    placeTower();
}

function setHealth(level){
    health = 150;
    health += level * 40;
    return health;
}
function setDamage(level){
    damage = 3;
    damage += level * 1;
    return damage;
}
function setCrit(level){
    crit = 10;
    crit += level * 15;
    return crit;
}
function setLasers(level){
    lasers = 1;
    lasers += level;
    return lasers;
}
function setRange(level){
    range = 150;
    range += level * 15;
    return range;
}

function initiatePurchase(){


    if(activeTowerPlacement){
        return;
    }

    while(towerOptions.length < 20){
        towerOptions.push(generateTower());
    }

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




const defaultBrief = `

<div id="missionBrief">

        <div id="missionBriefingReport">

            <h1 id="briefingTitle">Choose your Tower!</h1>

            <div id="briefingInfo">
                <p>Which of Your Towers do you want to deploy? If you have cash to spare, we have some
                preowned UFOs for cheap!
                </p>
            </div>

        </div>

        <div id="contractShop">

        </div>

        <button id="enterGameButton" onclick="endUpgrade()">Exit</button>

    </div>
    
`

//this will let me see how much progress of the round has been
function determineQuarter(value1, value2) {
    currWave = maxEnemyWaves - enemyWaves;

    if(currWave <= phase1){
        return 1;}
    else if(currWave <= phase2){
        return 2;}
    else if(currWave <= phase3){
        return 3;}
    return 4;
}

function hardMode(){

}

function generateTower(){
    var price = 200;

    var health = randomInt(0, 4);
    price += (150 * health);
    var damage = randomInt(0, 4);
    price += (150 * damage);
    var crit = randomInt(0, 4);
    price += (200 * crit);
    var laserCount = randomInt(0, 3);
    price += (320 * laserCount);
    var range = randomInt(0, 5);
    price += (350 * range);

    return [health, damage, crit, laserCount, range, price];
}


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

  