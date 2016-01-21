window.addEventListener("load",function(e){
    var game = new Game();      //instantiate game object
});

var Game = (function(){             //Game class
    function Game(){
        console.log("game started");
        //set up properties for Game object
        this.ducks = [];                                    //array of ducks
        Game.screen = document.querySelector("#canvas");    //static reference to canvas node in HTML
        Game.ctx = Game.screen.getContext("2d");            //static reference to canvas context
        this.ss = null;                                     //sprite sheet
        this.crossHair = null;                              //cross hair
        this.images = [];                                   //array of loaded images
        this.mouse = {x:0,y:0};                             //mouse position
        this.score = 0;                                     //game score
        this.scoreTxt = document.querySelector("#score");   //score node in HTML
        this.sndShoot=new Audio("sounds/shoot.wav");        //sound reference
        this.sndVictory=new Audio("sounds/start.wav");      //sound reference
        this.loadAssets(["dh_bg.jpg", "dh2.png"]);
    }

    Game.prototype.loadAssets = function(list){             //function to load images, image array as argument
        var that = this;                                    //keep reference to game object
        var count = 0;                                      //keep track of current image being loaded
        (function loadAsset(){                              //recursive function that calls itself for each iamge
            console.log("loading assets");
            var img = new Image();                          //instantiate image object
            img.src = "imgs/"+list[count];                  //set src property to image object
            console.log(img.src);
            img.addEventListener("load",function(){         //listen for load event
                that.images.push(img);                      //put loaded image into images array
                count++;                                    //continue to next image to load
                if (count<list.length){                     //check to see if all images are loaded
                    loadAsset();
                }  else
                {
                    that.setup();                           //continue on to set() function after all images loaded
                }
            });
        })();
    };

    Game.prototype.setup = function(){                      //game setup function
        console.log("all images loaded");
        this.ss = this.images[1];                           //assign ss property to second image im images array
        Game.screen.style.background = "url("+this.images[0].src+")";   //set canvas bg to bg jpg
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