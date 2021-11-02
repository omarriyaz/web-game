function Bear() {
    this.dBear = 100;
    this.htmlElement = document.getElementById("bear");
    this.id = this.htmlElement.id;
    this.x = this.htmlElement.offsetLeft;
    this.y = this.htmlElement.offsetTop;
    this.fitBounds = function () {
        let parent = this.htmlElement.parentElement;
        let iw = this.htmlElement.offsetWidth;
        let ih = this.htmlElement.offsetHeight;
        let l = parent.offsetLeft;
        let t = parent.offsetTop;
        let w = parent.offsetWidth;
        let h = parent.offsetHeight;
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > w - iw) {
            this.x = w - iw;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y > h - ih) {
            this.y = h - ih;
        }
    };
    this.move = function (xDir, yDir) {
        this.x += this.dBear * xDir;
        this.y += this.dBear * yDir;
        this.fitBounds();
        this.display();
    };
    
    this.display = function () {
        this.htmlElement.style.left = this.x + "px";
        this.htmlElement.style.top = this.y + "px";
        this.htmlElement.style.display = "block";
    };
    // part 4
    this.setSpeed = function () {
        let input = document.getElementById("speedBears").value;
        this.dBear = input;
    };
}

function isHit(defender, offender) {
    if (overlap(defender, offender)) { //check if the two image overlap
        let score = hits.innerHTML;
        score = Number(score) + 1; //increment the score
        hits.innerHTML = score; //display the new score
    }
    if (typeof(lastStingTime) !== 'undefined') {
        let newStingTime = new Date();
        let thisDuration = newStingTime - lastStingTime;
        lastStingTime = Number(newStingTime);
        let longestDuration = Number(document.getElementById("duration").innerHTML);
        if (longestDuration === 0) {
            longestDuration = thisDuration;
        } else {
            // gone past the longest duration by some amount of milliseconds
            longestDuration += thisDuration;
        }
        document.getElementById("duration").innerHTML = longestDuration;
    }
}

function overlap(element1, element2) {
    left1 = element1.htmlElement.offsetLeft; 
    top1 = element1.htmlElement.offsetTop; 
    right1 = element1.htmlElement.offsetLeft + element1.htmlElement.offsetWidth; 
    bottom1 = element1.htmlElement.offsetTop + element1.htmlElement.offsetHeight; 
    //rectangle of the second element
    left2 = element2.htmlElement.offsetLeft; //e2x
    top2 = element2.htmlElement.offsetTop; //e2y
    right2 = element2.htmlElement.offsetLeft + element2.htmlElement.offsetWidth;
    bottom2 = element2.htmlElement.offsetTop + element2.htmlElement.offsetHeight; 
    //calculate the intersection of the two rectangles
    x_intersect = Math.max(0, Math.min(right1, right2) - Math.max(left1, left2));
    y_intersect = Math.max(0, Math.min(bottom1, bottom2) - Math.max(top1, top2));
    intersectArea = x_intersect * y_intersect;
    //if intersection is nil no hit
    if (intersectArea == 0 || isNaN(intersectArea)) {
        return false;
    }
    return true;
}

function start() {
    bear = new Bear();
    document.addEventListener("keydown", moveBear, false);
    // part 4
    document.addEventListener("change", bear.setSpeed(), false);
    bees = new Array();
    makeBees();
    updateBees();
    // part 9
    document.addEventListener("keydown", initLastStingTime(), false);
}

function initLastStingTime() {
    lastStingTime = new Date();
}


function moveBear(e) {
    // key codes
    const KEYUP = 87; // W
    const KEYDOWN = 83; // S
    const KEYRIGHT = 68; // D
    const KEYLEFT = 65; // A

    if (e.keyCode == KEYRIGHT) {
        bear.move(1, 0);
    }
    if (e.keyCode == KEYLEFT) {
        bear.move(-1, 0);
    }
    if (e.keyCode == KEYUP) {
        bear.move(0, -1);
    }
    if (e.keyCode == KEYDOWN) {
        bear.move(0, 1);
    }

}


class Bee {
    constructor(beeNumber) {
        this.htmlElement = createBeeImg(beeNumber);
        this.id = this.htmlElement.id;
        //the left position (x)
        this.x = this.htmlElement.offsetLeft;
        //the top position (y)
        this.y = this.htmlElement.offsetTop;
        this.move = function(dx, dy) {
            //move the bees by dx, dy
            this.x += dx;
            this.y += dy;
            this.fitBounds();
            this.display();
        };
        this.display = function() {
            //adjust position of bee and display it
            this.htmlElement.style.left = this.x + "px";
            this.htmlElement.style.top = this.y + "px";
            this.htmlElement.style.display = "block";
        };
        this.fitBounds = function() {
            //check and make sure the bees stays in the board space
            let parent = this.htmlElement.parentElement;
            let iw = this.htmlElement.offsetWidth;
            let ih = this.htmlElement.offsetHeight;
            let l = parent.offsetLeft;
            let t = parent.offsetTop;
            let w = parent.offsetWidth;
            let h = parent.offsetHeight;
            if (this.x < 0) this.x = 0;
            if (this.x > w - iw) this.x = w - iw;
            if (this.y < 0) this.y = 0;
            if (this.y > h - ih) this.y = h - ih;
        };
    }
}

// part 10
function addBee() {
    // add bee to bees array
    // create new bee with the number bees.length + 1.
    // when we create a bee, the beeNumber starts at 1, which when incremented, will always be the length of bees array 
    bees.push(new Bee(bees.length + 1));
    // add 1 to the value of the bees input field
    document.getElementById("nbBees").value += 1;
}


function updateBees() {
    //move the bees randomly
    moveBees();
    //use a fixed update period (part 6)
    let period = document.getElementById("periodTimer").value;
    //update the timer for the next move
    // part 7
    let currentStings = document.getElementById("hits").innerHTML;
    // gets a string, but we need a number
    currentStings = Number(currentStings);
    if (currentStings == 1000) {
        // stop timer.
        alert("Game Over!");
        lastStingTime.clearTimeout();
    }
    updateTimer = setTimeout('updateBees()', period);
}

function makeBees() {
     //get number of bees specified by the user
     let nbBees = document.getElementById("nbBees").value;
     nbBees = Number(nbBees); //try converting the content of the input to a number 
     if (isNaN(nbBees)) { //check that the input field contains a valid number
        window.alert("Invalid number of bees");
        return;
     }
     //create bees 
     let i = 1;
     while (i <= nbBees) {
        var num = i;
        var bee = new Bee(num); //create object and its IMG element
        bee.display(); //display the bee
        bees.push(bee); //add the bee object to the bees array
        i++;
    }
}

function moveBees() {
    let speed = document.getElementById("speedBees").value;
    //move each bee to a random location
    for (let i = 0; i < bees.length; i++) {
        let dx = getRandomInt(2 * speed) - speed;
        let dy = getRandomInt(2 * speed) - speed;
        bees[i].move(dx, dy);
        isHit(bees[i], bear);
    }
}


function createBeeImg(beeNumber) {
    //get dimension and position of board div
    let boardDiv = document.getElementById("board");
    let boardDivW = boardDiv.offsetWidth;
    let boardDivH = boardDiv.offsetHeight;
    let boardDivX = boardDiv.offsetLeft;
    let boardDivY = boardDiv.offsetTop;
    //create the IMG element
    let img = document.createElement("img");
    img.setAttribute("src", "images/bee.gif");
    img.setAttribute("width", "100");
    img.setAttribute("alt", "A bee!");
    img.setAttribute("id", "bee" + beeNumber);
    img.setAttribute("class", "bee"); //set class of html tag img
    //add the IMG element to the DOM as a child of the board div
    img.style.position = "absolute";
    boardDiv.appendChild(img);
    //set initial position
    let x = getRandomInt(boardDivW);
    let y = getRandomInt(boardDivH);
    img.style.left = x + "px";
    img.style.top = y + "px";
    //return the img object
    return img;
}

// part 5
function getRandomInt(max) {
    // create random number
    // Math.random() generates a number between 0 and 1
    let rand = Math.floor(Math.random() * max);
    return rand;
}