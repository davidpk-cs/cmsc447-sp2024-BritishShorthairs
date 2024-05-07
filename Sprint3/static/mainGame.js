var enemies = []; //enemy objects
var deadEnemies = [];

var towers = []; //tower objects

var lasersActive = false; //indicating that lasers are present on the screen, so we know to clean

var score = 0; //number of points

var curr_user = localStorage.getItem('curr_user'); //stores the current user from mainGame.js PUT THIS WITH YOUR OTHER VARS


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

var failureOdds = 40; //range is 20% to 60%;
var criticalStrikeOdds = 25; //range is 10-30%
var enemyDamage = 3; //the range is 6-9
var enemyHP = 1; //range is 4-5
var enemyCount = 1; //the range is 20-35 number of enemies per wave
var enemyWaves = 1; //the range is 20-30, number of waves of enemies sent in 
var towerRange = 200; //the range is 90-140
var maxEnemyCount = 40;
towerPrice = 140; //the range is 120 to 220

towerDamage = 3;

enemySizeOdds = 25;

var curr_user = " ";

function mainGetUser(){
    //should get the name of the user 
    var nameField = document.getElementById("createName");
    var name = nameField.value;
    curr_user = name;
    localStorage.setItem('curr_user', name); //saves into local storage and should be retreivable in other .js files
    console.log("curr_user: " + curr_user);
}

function generateEconomy(){

    var currentSkew = randomInt(1, 10);
    failureOdds = randomSkew(20, 60, currentSkew);
    currentSkew = newSkew(20, 60, failureOdds);
    criticalStrikeOdds = randomSkew(10, 30, currentSkew);
    currentSkew = newSkew(10, 30, criticalStrikeOdds);
    enemyDamage = randomSkew(6, 9, currentSkew);
    currentSkew = newSkew(6, 9, enemyDamage);
    enemyHP = randomSkew(4, 5, currentSkew);
    currentSkew = newSkew(4, 5, enemyHP);
    enemyCount = randomSkew(20, 35, currentSkew);
    currentSkew = newSkew(20, 35, enemyCount);
    enemyWaves = randomSkew(20, 30, currentSkew);
    currentSkew = newSkew(20, 30, enemyWaves);
    towerRange = randomSkew(90, 140, currentSkew);
    currentSkew = newSkew(90, 140, towerRange);
    towerPrice = randomSkew(120, 160, currentSkew);
}

function chooseDifficulty(){

    coverScreenWithTranslucentDiv();

    cover = document.getElementById(coverName);

    cover.innerHTML = `<div class = "difficultyContainer">
        <button class = "difficultyButton" onclick="endDifficultyScreen(1)">Normal - Better Luck, Smaller Asteroids</button>
        <button class = "difficultyButton" onclick="endDifficultyScreen(2)">Hard - Slightly Less Luck, Larger Asteroids</button>
    </div>`;
    
}

function endDifficultyScreen(difficulty = 1){

    if(difficulty == 2){
        hardMode();
    }

    endBriefing();

    setup();
}



function setup(){


    //get the target object
    var target = document.getElementById("homeBase");

    //get styles of the thing that is being targeted
    var targetStyles = window.getComputedStyle(target);

    // get x and y values of the center of the home planet
    homeBaseTop = parseFloat(targetStyles.top) - (parseFloat(targetStyles.height) / 4);
    homeBaseLeft = parseFloat(targetStyles.left) - (parseFloat(targetStyles.width) / 4);

    console.log(homeBaseTop, homeBaseLeft);


    generateEconomy();

    //give the player the briefing
    coverScreenWithTranslucentDiv();

    // Generate an array of 6 random indexes, this is for available contracts
    while (chosenFixersIndexes.length < 6) {
        const index = randomInt(0, fixers.length - 1);
        if (!chosenFixersIndexes.includes(index)) {
            chosenFixersIndexes.push(index);
        }
    }


    setUpBriefing();

}

function cleanDeadAsteroids(){

    for(var i = 0; i < deadEnemies.length; i++){

        deadEnemies[i].object.remove();
    }
}

function randomSkew(min, max, skew) {

    const range = max - min + 1; //establish the range
    
    //make a number
    let randomNumber = Math.random() ** (skew * 0.5); // higher skew pushes it higher
    
    return Math.floor(randomNumber * range) + min;
}

function newSkew(min, max, generatedNumber) {

    const range = max - min + 1;
    
    //see where in the range the number was generated
    const position = (generatedNumber - min) / range;
    
    //produce a new skew
    const skew = 10 - Math.floor(position * 10);
    
    // get it within range
    return Math.max(1, Math.min(skew, 10));
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

        
        deadEnemies.push(enemies.splice(enemyIndex, 1)[0]);
        deadEnemies[deadEnemies.length - 1].object.src = assetsPath + 'explosions/tile000.png'

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
                enemyWaves--;
            }

            moveEnemies();
        } 
        else {
            cleanDeadAsteroids();
        }
    }

    if(lives == 0 || (enemies.length == 0 && enemyWaves == 0)){

        if(enemies.length == 0 && lives > 0){
        
            //sendHighScores(score)
            sendHighScores(curr_user, score, "level1");
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

        if(randomInt(0, 100) < enemySizeOdds){
            newRock.style.width = '100px';
            newRock.style.height = '100px';
        }
    


        var enemyHolder = document.getElementById("viewPort")

        enemyHolder.appendChild(newRock);

        var enemyToPush = new enemy(newRock, enemyHP, enemyDamage);

        if(randomInt(0, 100) < enemySizeOdds){
            newRock.style.width = '100px';
            newRock.style.height = '100px';
            enemyToPush.health *= 2;
        }

        enemies.push(enemyToPush);
    }

}


function placeTower(){

    if(credits < towerPrice){
        return;
    }

    credits -= towerPrice;

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

    constructor(object, xPos, yPos, health = 35, damage = towerDamage, laserCount = 0){

        this.object = object;
        this.health = health;
        this.damage = damage;
        this.laserCount = laserCount;

        this.top = xPos;
        this.left = yPos;
    }
}

class failureFixer{ 
    constructor(){
        this.price = randomInt(90, 175);
        this.message = "I can roll out a fix to ensure your UFOs can't miss!" }
    purchase(){
        if(credits < this.price){
            return false;}
        else{ credits -= this.price;
            failureOdds = 0;
            return true;} } }

class criticalStrikeFixer{ 
    constructor(){
        this.price = randomInt(60, 115);
        this.message = "I'll put extra shielding in weak spots on our planet!" }
    purchase(){
        if(credits < this.price){
            return false;}
        else{ credits -= this.price;
            criticalStrikeOdds = Math.floor(0.35 * criticalStrikeOdds);
            return true;} } }


class enemyDamageFixer{ 
    constructor(){
        this.price = randomInt(160, 265);
        this.message = "I'll reduce the impact if they hit our planet!" }
    purchase(){
        if(credits < this.price){
            return false;}
        else{ credits -= this.price;
            enemyDamage -= randomInt(2, 3);
            return true;} } }

class enemyHealthFixer{ 
    constructor(){
        this.price = randomInt(150, 230);
        this.message = "I'll go on ahead and make the asteroids more brittle." }
    purchase(){
        if(credits < this.price){
            return false;}
        else{ credits -= this.price;
            enemyHP -= randomInt(1, 2);
            return true;} } }


class enemyCountFixer{ 
    constructor(){
        this.price = randomInt(200, 320);
        this.message = "I'll destroy a portion of every wave of asteroids before they come near!" }
    purchase(){
        if(credits < this.price){
            return false;}
        else{ credits -= this.price;
            enemyCount = Math.floor(0.70 * enemyCount);
            return true;} } }

class enemyWaveFixer{ 
    constructor(){
        this.price = randomInt(260, 410);
        this.message = "I'll destroy as many waves of asteroids as I can!" }
    purchase(){
        if(credits < this.price){
            return false;}
        else{ credits -= this.price;
            enemyWaves -= Math.floor(this.price / 50);
            return true;} } }


class towerRangeFixer{ 
    constructor(){
        this.price = randomInt(300, 500);
        this.message = "I'll upgrade the range of all your towers!" }
    purchase(){
        if(credits < this.price){
            return false;}
        else{ credits -= this.price;
            towerRange += Math.floor(this.price / 3.8);
            return true;} } }


class livesFixer{ 
    constructor(){
        this.price = randomInt(100, 200);
        this.message = "I'll fortify the defenses on the planet so it can withstand more hits!" }
    purchase(){
        if(credits < this.price){
            return false;}
        else{ credits -= this.price;
            lives += Math.floor(lives * 0.75);
            return true;} } }


class towerDamageFixer{
    constructor(){
        this.price = randomInt(300, 540);
        this.message = "I'll boost the damage capabilities of your towers!" }
    purchase(){
        if(credits < this.price){
            return false;}
        else{ credits -= this.price;
            towerDamage += 1;
            return true;} }   
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
 

function setUpBriefing(){

    var div = document.getElementById(coverName);

    div.innerHTML = defaultBrief;


    //----------

    briefingInfo = document.getElementById("briefingInfo");

    briefingInfo.innerHTML += "<p> Credits: " + credits.toString() + "<p>";
    briefingInfo.innerHTML += "<p> Planet HP: " + lives.toString() + "<p>"; 
    briefingInfo.innerHTML += "<p> Tower Failure Likelihood " + failureOdds.toString() + "<p>";
    briefingInfo.innerHTML += "<p> Enemy Crit Chance " + criticalStrikeOdds.toString() + "<p>";
    briefingInfo.innerHTML += "<p> Enemy Damage " + enemyDamage.toString() + "<p>";
    briefingInfo.innerHTML += "<p> Enemy HP " + enemyHP.toString() + "<p>";
    briefingInfo.innerHTML += "<p> Tower Range " + towerRange.toString() + "<p>";
    briefingInfo.innerHTML += "<p> Tower Price " + towerPrice.toString() + "<p>";


    //----------

    contractShop = document.getElementById("contractShop");

    toAppend = "";

    for(var i = 0; i < chosenFixersIndexes.length; i++){

        j = chosenFixersIndexes[i];

        toAppend += "<div class=\"contractOffer\">";
        toAppend += "<p>" + fixers[j].message + "<p>"
        toAppend += "<button onclick = \"" +  "doContract(" + j.toString() + ")\">" + "Contract: " + fixers[j].price.toString() + " Credits" + "</button>"
        toAppend += "</div>";
    }

    contractShop.innerHTML = toAppend;

}


function endBriefing(){

    finishedBriefing = document.getElementById(coverName);
    finishedBriefing.remove();


}

function doContract(index){

    if (fixers[index].purchase()){
    
        var toRemove = chosenFixersIndexes.indexOf(index);

        chosenFixersIndexes.splice(toRemove, 1);

        endBriefing();
        coverScreenWithTranslucentDiv();
        setUpBriefing(); 

    }

    else{

        return;
    }
}


const defaultBrief = `

<div id="missionBrief">

        <div id="missionBriefingReport">

            <h1 id="briefingTitle">Briefing</h1>

            <div id="briefingInfo">
                <p>Aliens have stirred the asteroid Belts around our home planet! Thank you for taking on the role of defending our home!
                    Unfortunately, the only available towers we have for purchase are UFOs.... The good news is, we have several contractors
                    offering their services to you, for a cost. See if any of these things are worth it! Just make sure that you save some 
                    money for UFOs..... You are going to need it!
                </p>
            </div>

        </div>

        <div id="contractShop">

        </div>

        <button id="enterGameButton" onclick="endBriefing()">Finished</button>

    </div>
    
`

const fixers = [
    new failureFixer(),
    new criticalStrikeFixer(),
    new enemyDamageFixer(),
    new enemyHealthFixer(),
    new enemyCountFixer(),
    new enemyWaveFixer(),
    new towerRangeFixer(),
    new livesFixer(),
    new towerDamageFixer()
];

const chosenFixersIndexes = [];

function hardMode(){

}


var cClicks = 0;
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'c') {
            cClicks++;

            if(cClicks == 6){
                score = 4;
                sendHighScores(curr_user, score, "level1");
                createEndingCover("Go On, Cheater!")
            }
        }
    });
});

var dClicks = 0;
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'd') {
            dClicks++;

            if(dClicks == 6){
                for(var i = 0; i < towers.length; towers++){
                    towers[i].health += 10000000;
                    lives += 100000000;
                }
            }
        }
    });
});


//---------------------------------------

//Please put some functions here for connecting to flask
//One should take a high score and pass it into flask to be put in the database for level 1
//
function sendHighScores(username,score,level = "level1"){
    //this takes in a  username and a score and posts updates the score to the 
    //specified username (works kind of like add and delete)
    console.log("sendHighScores called");
    console.log("username" + curr_user + " and score" + score);
    fetch('/updateScore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            score: score,
            level: level
        })
    })
    .then(response => {
        if (response.ok) {
            updateStatus("Score Updated Successfully");
        } else {
            updateStatus("sendHighScores Failed");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        updateStatus("sendHighScores Failed");
    });

}

function sendLoot(lootInfo){
    //this would send the string lootInfo and me and Rippy figure out what the Flask side does with it
}

function nextLevel(){

    window.location.href = '/level2'; //this works 
}

  