$(document).ready(function () {
    //Canvas stuff
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    var w = $("#canvas").width();
    var h = $("#canvas").height();
    var remaining_letters_in_array;
    var letter_location_in_array = 0;
    var snake_letter_array;
    var snake_word_body_length;
    var gamePaused = false;
    var displayWin = false;

    //Lets save the cell width in a variable for easy control
    var cw = 60;
    var d;
    var food;
    var score;
    var word;
    var token;
    var tmpAIvalue;

    //START MENU VARIABLES
    var bg;
    var difficulty;
    var control;
    var degree;

    //Lets create the snake now
    var snake_array; //an array of cells to make up the snake

    //vocabulary arrays
    var grass = ["Bold", "Chill", "Doze", "Fresh", "Gift", "Idea", "Insect", "Safe", "Search", "Skill", "Smooth", "Team", "Tower", "Travel", "Wise", "Artist", "Belt", "Blast", "Blue", "Bold", "Braid", "Bread", "Brush", "Cactus", "Candy", "Candy", "Chance", "Cherry", "Coal", "Corn", "Cotton", "Craft", "Crowd", "Disk", "Dress", "Dust", "Effort", "Enjoy", "Famous", "Flight", "Floss", "Friend", "Fruit", "Jelly", "Lemon", "Proud", "Success", "Thirsty", "Tulip", "Tunnel", "Violet"];
    var space = ["Cosmic", "Capsule", "Space", "Meteor", "Alien", "Earth", "Rocket", "Comet", "Stars", "Moon", "Solar", "Asteroid", "Astronaut", "Gravity", "Eclipse", "Galaxy", "Rays", "Lunar", "Nebula", "Nova", "Orbit", "Ozone", "Planet", "Revolve", "Satellite", "Solstice", "Mercury", "Venus", "Mars", "Sun", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Explore", "Voyage", "Rover", "NASA", "Shuttle", "Launch", "Rings", "Mission", "Dipper", "Aurora", "Crater", "Cosmo", "Telescope", "Pilot", "Sunspot"];
    var underwater = ["Diver", "Scuba", "Fish", "Marine", "Pearl", "Starfish", "Shark", "Coral", "Reef", "Fins", "Goggles", "Ocean", "Lake", "Sea", "Snorkel", "Algae", "Barnacle", "Clam", "Dolphin", "Conch", "Currents", "Crab", "Flouder", "Squid", "Jellyfish", "Kelp", "Lobster", "Manatee", "Mussel", "Narwhal", "Octopus", "Otter", "Oyster", "Sponge", "Squid", "Tuna", "Tides", "Urchin", "Waves", "Whale", "Swim", "Float", "Dive", "Ship", "Boat", "Stingray", "Trench", "Plankton"];
    var school = ["Pencil", "Pen", "Notes", "Scissors", "Paper", "Folder", "Books", "Computer", "Clock", "Board", "Markers", "Teacher", "Chair", "Desk", "Ruler", "Notebook", "Backpack", "Calendar", "Schedule", "Highlight", "Quiz", "Test", "Homework", "Student", "Eraser", "Learn", "Study", "Reading", "Laptop", "Agenda", "Lunch", "Recess", "Math", "Science", "History", "English", "Numbers", "Project", "Report", "Essay", "Grades", "Gym", "Music", "Locker", "Tape", "Paperclip", "Friends", "School", "Class", "Clubs"];
    var custom;
    var foodSound = document.getElementById("foodSounds")

    var word_array;
    $(".start").click(start);

    function start() {
        //START MENU

        //game background

        bg = $(".environment").val();
        if (bg == "custom") {
            var cus = document.getElementById("customWords").value;
            custom = cus.split(/[ ,\s]+/).filter(Boolean); ;
        }
        difficulty = $(".difficulty").val();
        //switch or directional
        control = $(".controls").val();
        //degree of freedom
        degree = $(".degrees").val();

        displayWin = false;

        d = "right"; //default direction
        create_snake();
        //Changing vocabulary set based on setting 
        if (bg == "grass") word_array = grass;
        else if (bg == "space") word_array = space;
        else if (bg == "underwater") word_array = underwater;
        else if (bg == "school") word_array = school;
        else if (bg == "custom") word_array = custom;

        //randomizing the selection of the word in the word array
        var max = word_array.length;
        var min = 0;
        var random = Math.floor(Math.random() * (max - min + 1) + min);
        word = word_array[random];
        while (word == null) {
            random = Math.floor(Math.random() * (max - min + 1) + min);
            word = word_array[random];
        }
        word = word.toLowerCase();
        token = word.split("");
        letter_location_in_array = 0;
        document.getElementById("currentWord").style.display = "block";
        $('#currentWord').empty();
        document.getElementById("win").style.display = "none";
        document.getElementById("win").innerHTML = "You spelled <b>" + word.toUpperCase() + "</b>!<br><br>Get ready for another word!";
        create_food(); //Now we can see the food particle
        //finally lets display the score
        remaining_letters_in_array = token.length;
        snake_letter_array = [];
        snake_word_body_length = 0;
        score = 0;

        paint();
        //Lets move the snake now using a timer which will trigger the paint function
        //every 60ms
        if (typeof game_loop != "undefined") clearInterval(game_loop);
        if (parseInt(degree) != 1) {
            game_loop = setInterval(paint, difficulty);
        }
    }
    //init();

    // Option to use AI
    function use_AI() {
        if (snake_array[0].x < food.x) {
            d = "right";
        }

        else if (snake_array[0].x > food.x) {
            d = "left";
        }

        else if (snake_array[0].y < food.y) {
            d = "down";
        }

        else if (snake_array[0].y > food.y) {
            d = "up";
        }

        tmpAIvalue = d;
    }

    function create_snake() {
        var length = 3; //Length of the snake
        snake_array = []; //Empty array to start with
        for (var i = length - 1; i >= 0; i--) {
            //This will create a horizontal snake starting from the top left
            snake_array.push({ x: i, y: 0 });
        }
    }


    //Lets create the food now
    function create_food() {
        food = {
            x: Math.floor(Math.random() * (w - cw) / cw),
            y: Math.floor(Math.random() * (h - cw) / cw),
            letter: token[letter_location_in_array]
        };
        remaining_letters_in_array--;
        //This will create a cell with x/y between 0-44
        //Because there are 45(450/10) positions accross the rows and columns
    }

    //Lets paint the snake now
    function paint() {
        if (parseInt(degree) == 0) {
            use_AI();       // Using the AI to play the game
        }

        if (parseInt(degree) == 1) {

            if (d == "right" || d == "left") {
                if (snake_array[0].x == food.x) {
                    clearInterval(game_loop);
                    return;
                }
            }

            else if (d == "up" || d == "down") {
                if (snake_array[0].y == food.y) {
                    clearInterval(game_loop);
                    return;
                }
            }
        }
        //To avoid the snake trail we need to paint the BG on every frame
        //Lets paint the canvas now
        var img = new Image();
        if (bg == "custom") {
            var URL = document.getElementById("customBG").value;
            img.src = URL;

        }
        else {
            img.src = "img/" + bg + "%20env/" + bg + "bg.png";

        }

        ctx.drawImage(img, 0, 0, w, h);
        //ctx.fillStyle = "white";
        //ctx.fillRect(0, 0, w , h );
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);

        //The movement code for the snake to come here.
        //The logic is simple
        //Pop out the tail cell and place it infront of the head cell
        var nx = snake_array[0].x;
        var ny = snake_array[0].y;
        //These were the position of the head cell.
        //We will increment it to get the new head position
        //Lets add proper direction based movement now
        if (d == "right") nx++;
        else if (d == "left") nx--;
        else if (d == "up") ny--;
        else if (d == "down") ny++;

        //Lets add the game over clauses now
        //This will restart the game if the snake hits the wall
        //Lets add the code for body collision
        //Now if the head of the snake bumps into its body, the game will restart
        if (nx == -1 || nx == Math.floor(w / cw) || ny == -1 || ny == Math.floor(h / cw)) {
            //restart game
            start();
            //Lets organize the code a bit now.
            return;
        }

        //Lets write the code to make the snake eat the food
        //The logic is simple
        //If the new head position matches with that of the food,
        //Create a new head instead of moving the tail
        if (nx == food.x && ny == food.y) {

            var tail = { x: nx, y: ny };
            score++;

            //Put letter into snake letter array to add to body of snake;
            //snake_letter_array.push(token[letter_location_in_array]);
            letter_location_in_array++;

            if (parseInt(degree) == 1) {
                clearInterval(game_loop);
            }
            //snake_word_body_length++;
            //Create new food
            document.getElementById("currentWord").innerHTML += token[letter_location_in_array - 1].toUpperCase();
            foodSound.pause();
            foodSound.currentTime = 0;
            foodSound.play();
            create_food();
        }
        else {
            var tail = snake_array.pop(); //pops out the last cell
            tail.x = nx; tail.y = ny;
        }
        //The snake can now eat the food.

        snake_array.unshift(tail); //puts back the tail as the first cell
        paint_snake();

        //Lets paint the food
        if (remaining_letters_in_array == 0) {

            if (parseInt(degree) != 1) {
                game_loop = clearTimeout(game_loop);
            }

            var pause;
            //wait before starting with new word;
            //$("#word_spelt").html = "You spelled: "+word;
            //$('#word_modal').modal('show');
            // pause = setTimeout(start, 4000);
            displayWin = true;
            document.getElementById("win").style.display = "block";
            pause = setTimeout(start, 4000);
            //$("#word_modal").modal('hide');
            return;
        }

        paint_food(food.x, food.y, food.letter);
        //Lets paint the score
        var score_text = "Score: " + score;
        ctx.fillText(score_text, 5, h - 5);
    }

    function paint_snake() {
        for (var i = 0; i < snake_array.length; i++) {
            var c = snake_array[i];
            if (i == 0) {
                paint_head(c.x, c.y);
            }
            else if (i == snake_array.length - 1) {
                paint_tail_small(c.x, c.y);
            }
            else if (i == snake_array.length - 2) {
                paint_tail_big(c.x, c.y);
            }
            else {
                paint_cell(c.x, c.y, i);
            }
            //Lets paint 10px wide cells

        }
    }

    //Lets first create a generic function to paint cells

    function paint_head(x, y) {
        if (bg == "custom") {
            var img = new Image();
            var options = {
                left: "img/" + "grass" + "%20env/60x60/snakehead-left.png",
                right: "img/" + "grass" + "%20env/60x60/snakehead-right.png",
                up: "img/" + "grass" + "%20env/60x60/snakehead-up.png",
                down: "img/" + "grass" + "%20env/60x60/snakehead-down.png"
            }
        }
        else {
            var img = new Image();
            var options = {
                left: "img/" + bg + "%20env/60x60/snakehead-left.png",
                right: "img/" + bg + "%20env/60x60/snakehead-right.png",
                up: "img/" + bg + "%20env/60x60/snakehead-up.png",
                down: "img/" + bg + "%20env/60x60/snakehead-down.png"
            }
        }
        img.src = options[d];
        ctx.drawImage(img, x * cw, y * cw);

    }

    function paint_cell(x, y, letter_location) {

        var img = new Image();
        img.src = "img/letters/" + token[letter_location - 1] + ".png"

        ctx.drawImage(img, x * cw, y * cw);
    }

    function paint_tail_big(x, y) {
        var img = new Image();
        img.src = "img/grass%20env/60x60/tail-big.png"
        ctx.drawImage(img, x * cw, y * cw);
    }

    function paint_tail_small(x, y) {
        var img = new Image();
        img.src = "img/grass%20env/60x60/tail-small.png"
        ctx.drawImage(img, x * cw, y * cw);
    }

    function paint_food(x, y, letter) {

        var img = new Image();
        img.src = "img/letters/" + letter + ".png"
        ctx.drawImage(img, x * cw, y * cw);
    }

    function check_collision(x, y, array) {
        //This function will check if the provided x/y coordinates exist
        //in an array of cells or not
        for (var i = 0; i < array.length; i++) {
            if (array[i].x == x && array[i].y == y)
                return true;
        }
        return false;
    }

    //Lets add the keyboard controls now

    var arrows = ["down", "left", "up", "right"];
    var arrows_index = 0;
    $(document).keydown(function (e) {

        if (displayWin) {
            return;
        }
        var key = e.which;
        //We will add another clause to prevent reverse gear
        if (control == "switch") {
            if (key == "32") pauseGame(); //spacebar
            else if (key == "13") { //enter - rotate each click
                d = arrows[arrows_index];
                arrows_index++;
                if (arrows_index == 4) {
                    arrows_index = 0;
                }
                var img = new Image();
                img.src = "img/" + bg + "%20env/" + bg + "bg.png"
                ctx.drawImage(img, 0, 0, w, h);

                paint_snake();
                paint_food(food.x, food.y, food.letter);
            }
        }
        else if (control == "arrows") {
            if (key == "37") d = "left";
            else if (key == "38") d = "up";
            else if (key == "39") d = "right";
            else if (key == "40") d = "down";
        }
        if (key == "80") pauseGame(); //80 is p
        //The snake is now keyboard controllable
        if (key == "16") { // 16 is shift
            $('#myModal').modal('show');
            game_loop = clearTimeout(game_loop);

        }

        if (parseInt(degree) == 1) {
            if (d == "right" || d == "left") {

                if ((d == "right" && snake_array[0].x < food.x) || (d == "left" && snake_array[0].x > food.x)) {
                    //      || (d == "up" && snake_array[0].x < food.x) || (d == "down" && snake_array[0].x > food.x)) {*/
                    //alert("hi");
                    if (snake_array[0].x != food.x) {
                        if (typeof game_loop != "undefined") clearInterval(game_loop);
                        game_loop = setInterval(paint, difficulty);
                    }
                }
            }

            else if (d == "up" || d == "down") {

                if ((d == "up" && snake_array[0].y > food.y) || (d == "down" && snake_array[0].y < food.y)) {
                    if (snake_array[0].y != food.y) {
                        if (typeof game_loop != "undefined") clearInterval(game_loop);
                        game_loop = setInterval(paint, difficulty);
                    }
                }
            }
        }
    })


    function pauseGame() {
        if (!gamePaused) {
            game_loop = clearTimeout(game_loop);
            gamePaused = true;
        } else if (gamePaused) {
            game_loop = setInterval(paint, difficulty);
            gamePaused = false;
        }
    }
})

