/*
planets-wekazaji
A basic ring physics tutorial to build off

 */


var game;

// groups containing crates and planets

var crateGroup;
var planetGroup;
var cursors;

// a force reducer to let the simulation run smoothly

var forceReducer = 0.005;

// graphic object where to draw planet gravity area

var gravityGraphics;

window.onload = function(){
    game = new Phaser.Game(800, 600, Phaser.AUTO, "");
    game.state.add("PlayGame",playGame);
    game.state.start("PlayGame");
};

var playGame = function(game){};

playGame.prototype = {
    preload: function () {
        game.load.image("crate", "crate.png");
        game.load.image("planet", "planet.png");
        game.load.image("bigplanet", "bigplanet.png");
        game.load.image('dude', 'dude.png');
    },
    create: function () {

        // adding groups

        crateGroup = game.add.group();
        planetGroup = game.add.group();

        // adding graphic objects

        gravityGraphics = game.add.graphics(0, 0);
        gravityGraphics.lineStyle(2, 0xffffff, 0.5);

        // stage setup
        game.stage.backgroundColor = "#222222";

        // physics initialization
        game.physics.startSystem(Phaser.Physics.BOX2D);

        // adding a couple of planets. Arguments are:
        // x position
        // y position
        // gravity radius
        // gravity force
        // graphic asset
        // addPlanet(180, 200, 250, 150, "planet");
        addPlanet(400, 300, 400, 250, "bigplanet");

        // waiting for player input
        game.input.onDown.add(addCrate, this);

        // player = game.add.sprite(200, 200, 'dude');
        // game.physics.box2d.enable(player);
        // player.body.fixedRotation = true;

        cursors = game.input.keyboard.createCursorKeys();
    },

    update: function(){

        // looping through all crates
        for (var i = 0; i < crateGroup.total; i++) {
            var c = crateGroup.getChildAt(i);

            // looping through all planets
            for (var j = 0; j < planetGroup.total; j++) {
                var p = planetGroup.getChildAt(j);

                // calculating distance between the planet and the crate
                var distance = Phaser.Math.distance(c.x, c.y, p.x, p.y);

                // checking if the distance is less than gravity radius
                if (distance < p.width / 2 + p.gravityRadius / 2) {

                    // calculating angle between the planet and the crate
                    var angle = Phaser.Math.angleBetween(c.x, c.y, p.x, p.y);

                    // add gravity force to the crate in the direction of planet center
                    c.body.applyForce(p.gravityForce * Math.cos(angle) * forceReducer,
                                      p.gravityForce * Math.sin(angle) * forceReducer);

                }
            }

            //Handle keyboard input for the crates
            if (cursors.left.isDown) {
                c.body.moveLeft(90);
            }
            else if (cursors.right.isDown) {
                c.body.moveRight(90);
            }
            if (cursors.up.isDown) {
                c.body.moveUp(90);
            }
            else if (cursors.down.isDown) {
                c.body.moveDown(90);
            }
        }



    }
};

// function to add a crate

function addCrate(e){
    var crateSprite = game.add.sprite(e.x, e.y, "crate");
    crateGroup.add(crateSprite);
    game.physics.box2d.enable(crateSprite);
}

// function to add a planet
function addPlanet(posX, posY, gravityRadius, gravityForce, asset){
    var planet = game.add.sprite(posX, posY, asset);
    planet.gravityRadius = gravityRadius;
    planet.gravityForce = gravityForce;
    planetGroup.add(planet);
    game.physics.box2d.enable(planet);
    planet.body.static = true;

    // look how I create a circular body
    planet.body.setCircle(planet.width / 2);
    gravityGraphics.drawCircle(planet.x, planet.y, planet.width+planet.gravityRadius);
}