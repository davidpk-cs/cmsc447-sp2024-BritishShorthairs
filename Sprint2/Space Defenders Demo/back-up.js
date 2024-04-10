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