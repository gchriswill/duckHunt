window.addEventListener("load",function(e){
    var game = new Game();      //instantiate game object
});

var Game = (function(){             //Game class
    function Game(){

    }

    Game.prototype.loadAssets = function(list){             //function to load images

    };

    Game.prototype.setup = function(){                      //game setup function

    };

    Game.prototype.getDistance = function(x1, y1, x2, y2){  //method that returns the distance between 2 points

    };

    Game.prototype.onClick = function(e){                   //callback function that runs when mouse button clicked

    };

    Game.prototype.updateAll = function(e){                 //method that starts main game loop

    };
    return Game
})();

var Sprite = (function(){
    function Sprite(img){
        console.log("sprite created");

    }
    Sprite.prototype.draw = function(){

    };
    Sprite.prototype.stageWrap = function(){

    };
    return Sprite;
})();

var Duck = (function(){
    Duck.prototype = Object.create(Sprite.prototype);
    function Duck(img){
        Sprite.call(this,img);
        console.log("duck created");
    }
    Duck.prototype.hit = function() {

    };
    Duck.prototype.update = function(){

    };
    return Duck;
})();

var CrossHair = (function(){
    function CrossHair(){
        console.log("crosshair created");

    }
    CrossHair.prototype.draw = function(x,y){           //arguments are mouse location
    };
    return CrossHair
})();