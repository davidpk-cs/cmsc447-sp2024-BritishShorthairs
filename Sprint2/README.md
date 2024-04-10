# Space Defenders - CMSC447
* Group - David Premkumar, Shianne Marbley, Kevin Rippy, Matthew Makila, Justin Quedit
* JIRA - https://umbc-mmakila1.atlassian.net/jira/software/projects/SCRUM/boards/1

# IMPORTANT NOTE
* This project has many components, and currently two of these components are seperated.
* We plan to merge these components into one flask application in Sprint 3
* In the homepage folder, there is our homepage as well as the start of the Production side of the game.
* In the Space Defender Demo folder, there is a demo of the Tower Defense side of the game.
* Both of these are important aspects of the game, and need to be run seperately.

# How to run
## FOR SPACE DEFENDERS DEMO
* Go to Code/src/Space Defenders Demo
* Open main.html in a browser
## FOR HOMEPAGE
* Go to Code/src/Homepage
* run in terminal: pip install requirements.txt
* run in terminal: python -m flask run

# Misc
### How to Play Tower Defense
* When the game loads, you can place towers down by hitting the place tower button and then clicking on the viewport (the box with a space background) to put the tower down.
* That will use up one credit (you have a total count displayed).
* You can continue to use credits to place more towers down (hit place tower again and click on the viewport). 
* Hit play game to start the game, and see how long you last.
### What is the Production side?
* Currently the production side is showcasing a grid based system where you can place buildings (right now just boxes)
* You cannot place a building that would collide with another, and you cannot place them off screen
* Next sprint, we will add functionality to these buildings allowing resources to flow in or from these buildings using conveyor belts
