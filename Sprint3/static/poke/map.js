var mainTheme = new Audio('main-theme.mp3');
mainTheme.loop = true;
mainTheme.volume = 0.1;
mainTheme.play();

var encounterSound = new Audio('encounter-sound.mp3')
encounterSound.loop = false;
encounterSound.volume = 0.3;

// Canvas stuff
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let keyPresses = {};


// Pixels information about the sprite
const ROW_STARTS = [0, 0, 310, 630]; 
const HEIGHT = 300;
const COL_STARTS = [0, 1020, 0, 0];
const WIDTHS = [240, 240, 180, 180];

// Different movement modes, values correspond to the index of the arrays containing sprite informations
const FACING_DOWN = 0;
const FACING_UP = 1;
const FACING_RIGHT = 2;
const FACING_LEFT = 3;

// Movement speed and character size is relative to how the window size
const MOVEMENT_SPEED = Math.round(canvas.height * 0.001);
//const MOVEMENT_SPEED = Math.round(canvas.height * 0.01);
const SCALE = 1/12;

// Handles animation.  Skip frames is to slow the animation down
const SKIP_FRAME = 7;
let curr_frame = 0;
let curr_animation = 0;

// Center the character in the screen, facing down
let pos_x = Math.round(canvas.width / 2);
let pos_y = Math.round(canvas.height / 2);
let curr_direction = FACING_DOWN;
let is_talking = false;

let img = new Image();



//Trees are boundary boxes, you cannot walk through trees
TREES = {
  TopLeftMain: {
    StartX:	0,
    StartY:	0,
    EndX:	125,
    EndY:	232,
  },
  Loner: {
    StartX:	0,
    StartY:	0,
    EndX:	154,
    EndY:	35,
  },
  CenterLeftMain: {
    StartX:	0,
    StartY:	232,
    EndX:	112,
    EndY:	500,
  },
  CenterLeftSecond: {
    StartX:	0,
    StartY:	314,
    EndX:	168,
    EndY:	500,
  },
  CenterLeftThird: {
    StartX:	0,
    StartY:	368,
    EndX:	252,
    EndY:	442,
  },
  BottomLeftMain: {
    StartX:	0,
    StartY:	500,
    EndX:	84,
    EndY:	700,
  },
  BottomLeftSecond: {
    StartX:	0,
    StartY:	620,
    EndX:	252,
    EndY:	700,
  },
  TopPatch: {
    StartX:	252,
    StartY:	0,
    EndX:	615,
    EndY:	35,
  },
  RightMain: {
    StartX:	504,
    StartY:	0,
    EndX:	615,
    EndY:	700,
  },
  CenterRightSecond: {
    StartX:	363,
    StartY:	314,
    EndX:	615,
    EndY:	442,
  },
  CenterRightThird: {
    StartX:	336,
    StartY:	368,
    EndX:	615,
    EndY:	442,
  },
  BottomRightSecond: {
    StartX:	308,
    StartY:	620,
    EndX:	615,
    EndY:	700,
  },
  CenterPatch: {
    StartX:	225,
    StartY:	60,
    EndX:	420,
    EndY:	163,

  },
  GreatLineLeft: {
    StartX:	0,
    StartY:	500,
    EndX:	420,
    EndY:	530,
  },
  GreatLineRight: {
    StartX:	475,
    StartY:	500,
    EndX:	615,
    EndY:	550,
  },
};

//Bushes contain encounters, if you walk through it you might encounter a pokemon
const BUSHES = {
  TopFirst: {
    StartX:	127,
    StartY:	85,
    EndX:	194,
    EndY:	180,
  },
  TopSecond: {
    StartX:	197,
    StartY:	112,
    EndX:	223,
    EndY:	180,
  },
  TopThird: {
    StartX:	225,
    StartY:	169,
    EndX:	335,
    EndY:	195,
  },
  CenterMiddle: {
    StartX:	253,
    StartY:	239,
    EndX:	362,
    EndY:	264,
  },
  CenterLeftFirst: {
    StartX:	113,
    StartY:	253,
    EndX:	166,
    EndY:	320,
  },
  CenterLeftSecond: {
    StartX:	168,
    StartY:	267,
    EndX:	195,
    EndY:	376,
  },
  CenterLeftThird: {
    StartX:	197,
    StartY:	280,
    EndX:	237,
    EndY:	375,
  },
  CenterLeftFourth: {
    StartX:	238,
    StartY:	323,
    EndX:	265,
    EndY:	376,
  },
  CenterLeftFifth: {
    StartX:	253,
    StartY:	379,
    EndX:	334,
    EndY:	446,
  },
  CenterRightFirst: {
    StartX:	392,
    StartY:	281,
    EndX:	446,
    EndY:	320,
  },
  CenterRightSecond: {
    StartX:	449,
    StartY:	253,
    EndX:	502,
    EndY:	321,
  },
  BottomLeftFirst: {
    StartX:	113,
    StartY:	590,
    EndX:	251,
    EndY:	628,
  },
  BottomLeftSecond: {
    StartX:	252,
    StartY:	645,
    EndX:	306,
    EndY:	700,
  },
  BottomRightFirst: {
    StartX:	365,
    StartY:	603,
    EndX:	433,
    EndY:	628,
  },
  BottomRightSecond: {
    StartX:	407,
    StartY:	589,
    EndX:	503,
    EndY:	616,
  },
};

//There is only one person, Dr. Ghastly
//But he is placed in an object so to fit the structure that isInside() needs
//This is the areas that the player is considered 'talking' to Dr. Ghastly
const PEOPLE = {
  RickGhastly: {
    StartX:	240,
    StartY:	280,
    EndX:	307,
    EndY:	350,
  }
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//ENCOUNTER_RATE is how rare encounters are
//Low rate means frequent encounters
const ENCOUNTER_RATE = 200;
function checkEncounters() {
  for (const key in BUSHES) {

    //If the player is inside a bush patch, then roll for encounter
    if (isInside(0, 0, BUSHES, key)) {
      console.log("Risking Encounter");

      //You got the encounter (ENCOUNTER TO BE IMPLEMENTED)
      if (getRandomInt(ENCOUNTER_RATE) == ENCOUNTER_RATE - 1) {
        console.log("ENCOUNTEER!!!");
        handleEncounter();
      }
    }
  }

  return true;
}

//Checks for if you are close enough to Dr. Ghastly
function talkToRick() {
  //Not necessary to place in for loop, but Im lazy
  for (const key in PEOPLE) {
    //If youre close enough, you enter talking mode
    if (isInside(0, 0, PEOPLE, key)) {
      console.log("You Approach ME??");
      handleRickEncounter();
      /*
      TO DO:
        First talk:
          Some sneering (establishing him as the enemy)
          Loose tutorial prompting
          If you want you can battle him now

        Subsequent talks:
          Wanna fight??
        
        Accepted challenge:
          I should make quick work of you, after all.
          I am Dr. Ghastly, RICK GHASTLY
          *BATTLE SPIRAL*
      */
      return true;
    }
  }
  if (document.getElementById('encounterBox')) {
    let box = document.getElementById('encounterBox');
    box.parentNode.removeChild(box);
  }

  isSameConversation = false;

  return false;
}

function handleEncounter() {
  mainTheme.pause()
  encounterSound.play()
  setTimeout(function() {
    window.location.href = "encounter.html";  // Change location to the encounter_page
  }, 2900)
}

var hasMonologued = false;

//encounger ui
function handleRickEncounter() {
  var pokemon_id = new URLSearchParams(window.location.search).get("pokemonChoice");
  var pokemon_name = "";
  if (pokemon_id == 1) {
    pokemon_name = "Bulbasaur";
  } else if (pokemon_id == 4) {
    pokemon_name = "Charmander";
  } else if (pokemon_id == 7) {
    pokemon_name = "Squirtle";
  } else {
    pokemon_name = "pokemon";
  }

  //check if ui already exists
  if (document.getElementById('encounterBox') || isSameConversation) return;

  var div_width;
  var div_height;
  var text_width;
  var text_height;
  var text_value;

  if (document.cookie.indexOf("hasMonologued=") < 0) {
    div_width = '400px'
    div_height = '450px'

    text_width = '350px';
    text_height = '400px';
    text_value = 'Oh, you approach me, Dr. Ghastly?  What, do you want a challenge?' +  
    '\n\nYour puny pokemon don\'t look like much fun to slaughter.  '+
    'How about you go walk around in some of those bushes and either find something good, or level up your pathetic '+pokemon_name+
    '.\n\nIf you really want to get your pokemon killed, you can challenge me now.'

    var date = new Date();
    date.setHours(23,59,59,999);
    var expires = "expires=" + date.toGMTString();

    document.cookie = "hasMonologued=True; "+expires;
  } else {
    div_width = '350px'
    div_height = '200px'

    text_width = '300px';
    text_height = '150px';
    text_value = 'Come to die?';  
  }

  // Create a div to hold the textbox and buttons
  let encounterDiv = document.createElement('div');
  encounterDiv.id = 'encounterBox';
  encounterDiv.className = "encounter-style";

  let buttonDiv = document.createElement('div');
  buttonDiv.style.display = 'flex';
  buttonDiv.style.justifyContent = 'space-between'; // To give some space between the buttons

  // Create a textbox
  let encounterText = document.createElement('textarea');
  encounterText.id = 'encounterText';
  encounterText.style.width = text_width;
  encounterText.style.height = text_height;
  encounterText.value = text_value;
  encounterText.className = "encounter-style";

  // Create no button
  let noButton = document.createElement('button');
  noButton.innerHTML = 'No';
  noButton.id = "noButton";
  noButton.style.width = '100px';
  noButton.style.height = '50px'; 
  noButton.className = "encounter-style";
  noButton.onclick = function() {
      // Remove the encounter box
      let box = document.getElementById('encounterBox');
      box.parentNode.removeChild(box);
      isSameConversation = true;
  };


  // Create yes button
  let yesButton = document.createElement('button');
  yesButton.innerHTML = 'Yes';
  yesButton.id = "yesButton";
  yesButton.style.width = '100px';
  yesButton.style.height = '50px'; 
  yesButton.className = "encounter-style"; 
  yesButton.onclick = function() {
    encounterText.value = "Ha, you fool.  Tremble before the power of Dr. Ghastly.  Rick Ghastly!!";
    encounterText.style.width = '300px';
    encounterText.style.height = '150px';
    encounterDiv.style.width = '350px'
    encounterDiv.style.height = '200px'

    encounterDiv.appendChild(encounterText);
    document.body.appendChild(encounterDiv);

    let yes_button = document.getElementById('yesButton');
    yes_button.parentNode.removeChild(yes_button);
    let no_button = document.getElementById('noButton');
    no_button.parentNode.removeChild(no_button);

    setTimeout(function() {
      window.location.href = "battle.html";  // Change location to the battle.html page
    },5000);
  };


  buttonDiv.appendChild(yesButton);
  buttonDiv.appendChild(noButton);
  encounterDiv.appendChild(encounterText);
  encounterDiv.appendChild(buttonDiv);
  encounterDiv.style.position = 'absolute'; 
  encounterDiv.style.top = '50%'; 
  encounterDiv.style.left = '0'; 
  encounterDiv.style.transform = 'translateY(-50%)'; 
  encounterDiv.style.display = 'flex';
  encounterDiv.style.justifyContent = 'center';
  encounterDiv.style.alignItems = 'center';
  encounterDiv.style.flexDirection = 'column';
  encounterDiv.style.width = div_width; 
  encounterDiv.style.height = div_height;
  document.body.appendChild(encounterDiv);
}

function validateMovement(deltaX, deltaY) {
  //Teleport player down if player goes up through the top of the screen
  if (pos_y + deltaY < -15) { 
    pos_x = 280;
    pos_y = 715;
  }
  //Teleport player up if player goes down through the bottom of the screen
  if (pos_y + deltaY > canvas.height + 15) {
    pos_x = 200;
    pos_y = -7;  //Magic number, dont touch
  }
    
  //Checks if new player position would be inside tree patch
  //If it would, return false and stop movement
  for (const key in TREES) {
    if (isInside(deltaX, deltaY, TREES, key)) {
      console.log(key);
      console.log("StartX", TREES[key]["StartX"]);
      console.log("StartY", TREES[key]["StartX"]);
      console.log("EndX", TREES[key]["EndX"]);
      console.log("EndY", TREES[key]["EndY"]);
      console.log("NewX", pos_x+deltaX);
      console.log("NewY", pos_y+deltaY);
      return false;
    }
  }

  return true;
}

//Determines if new player position would be inside a box defined by patch coordinates
//Type of obstacle is abstracted, so same code can be used for bushes, trees, and human
function isInside(deltaX, deltaY, obstacle, patch) {
  //If the player is outside of the range of y coordinates, cannot be inside box
  if (pos_y + deltaY + (HEIGHT * SCALE) < obstacle[patch]["StartY"] 
  ||  pos_y + deltaY + (HEIGHT * SCALE) > obstacle[patch]["EndY"]) {
    return false;
  }

  //If the player is outside of the range of x coordinates, cannot be inside box
  if (pos_x + deltaX < obstacle[patch]["StartX"] 
  ||  pos_x + deltaX > obstacle[patch]["EndX"]) {
    return false;
  }

  //Attempts to fix visual glitch, results in "binding"
  //If you are against the right boundary, you cannot move up or down (weird)
  /*  
  if (pos_x + deltaX + (WIDTHS[curr_direction] * SCALE / 2) < obstacle[patch]["StartX"] 
  ||  pos_x + deltaX > obstacle[patch]["EndX"]) {
    return false;
  }
  */

  //If you would be both inside the x range, and y range, you are inside the box
  return true;
}


// Starts movement the second a key is pressed
window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
    keyPresses[event.key] = true;
}

// Stops the movement when the key is let go
window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
    keyPresses[event.key] = false;
}

// Responsible for loading image each frame of game loop
function loadImage() {
  img.src = 'sans.png';
  img.onload = function() {
    window.requestAnimationFrame(gameLoop);
  };
}

// Draws the image onto the screen
function draw_frame() {
  //Takes:
  //  image, 
  //  the top right pixel coordinates of the segment of the sprite we display, 
  //  the width and height of the segment we display
  //  the position on the canvas that the image displays to
  //  the the size of the image that appears on canvas
  ctx.drawImage(img,
                COL_STARTS[curr_direction] + curr_animation * WIDTHS[curr_direction], 
                ROW_STARTS[curr_direction], 
                WIDTHS[curr_direction], HEIGHT,
                pos_x, pos_y, 
                WIDTHS[curr_direction] * SCALE, HEIGHT * SCALE);
}

loadImage();

function gameLoop() {
  // I dont know, just doesnt work without this
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let hasMoved = false;

  // Saves the direction that the character is facing, and moves the charcter on the canvas
  if (keyPresses.w && !keyPresses.s && !keyPresses.a && !keyPresses.d) {
    curr_direction = FACING_UP;
    move_character(0, -MOVEMENT_SPEED);
    hasMoved = true;
  } else if (keyPresses.s && !keyPresses.w && !keyPresses.a && !keyPresses.d) {
    curr_direction = FACING_DOWN;
    move_character(0, MOVEMENT_SPEED);
    hasMoved = true;
  } else if (keyPresses.a && !keyPresses.d && !keyPresses.w && !keyPresses.s) {
    curr_direction = FACING_LEFT;
    move_character(-MOVEMENT_SPEED, 0);
    hasMoved = true;
  } else if (keyPresses.d && !keyPresses.a && !keyPresses.w && !keyPresses.s) {
    curr_direction = FACING_RIGHT;
    move_character(MOVEMENT_SPEED, 0);
    hasMoved = true;
  } else {
    curr_animation = 0;
    // If you are talking to Dr. Ghastly, then you face him if not currently moving
    // Else you face forward
    if (is_talking) {
      curr_direction = FACING_UP;
    } else {
      curr_direction = FACING_DOWN;
    }
  }


  // Calls the method to draw the image
  draw_frame();
  window.requestAnimationFrame(gameLoop);
}

// Calculates the movement based on the specified speed
function move_character(deltaX, deltaY) {
  // If the character is on the edge of the screen, don't move the character
  if (validateMovement(deltaX, deltaY)) {
    pos_y += deltaY;
    pos_x += deltaX;

    // If you are not running against a wall, check for encounters
    checkEncounters();
    // Also check to see if you're talking to Dr. Ghastly
    is_talking = talkToRick();
  }

  console.log("pos_x: " + pos_x + ", pos_y: " + pos_y)

  // This controls how often the animation frame switches.
  curr_frame++;
  curr_frame = curr_frame % SKIP_FRAME;

  // Every {SKIP_FRAME} loops, the animation gets to change frames
  if (curr_frame == 0) {
    curr_animation += 1;
    curr_animation = curr_animation % 4;
  }
}