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
        this.frames = [
            [170, 2, 64, 45],   //x,y,width,height
            [236, 2, 68, 40],
            [104, 2, 64, 56],
            [2, 2, 36, 60],
            [40, 2, 62, 58]
        ];
        this.img = img;
        this.ctx = Game.ctx;
        this.index = 0;
        this.aspeed = .15;
        this.x=0;
        this.y=0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.width = 0;

    }
    Sprite.prototype.draw = function(){
        this.ctx.save();
        this.ctx.translate(this.x,this.y);
        this.ctx.scale(this.scaleX,this.scaleY);
        //this.ctx.drawImage(this.img,170,2,64,45,0,0,64,45);
        var temp = ~~(this.index);

        this.ctx.drawImage(this.img,            //img,sx,sy,swidth,sheight,x,y,width,height
            this.frames[temp][0],
            this.frames[temp][1],
            this.frames[temp][2],
            this.frames[temp][3],
            -(this.frames[temp][2]) *.5,        //posx
            -(this.frames[temp][3])*.5,         //posy
            this.frames[temp][2],
            this.frames[temp][3]);
        this.width = this.frames[temp][3];
        this.ctx.restore();
    };
    Sprite.prototype.stageWrap = function(){
        if (this.x>800+this.width*.5){
            this.x = -this.width*.5
        }
        else if (this.x<-this.width*.5){
            this.x = 800+this.width*.5
        }
        else if (this.y>600+this.height*.5){
            this.y = -this.height*.5
        }
        else if (this.y<-this.height*.5){
            this.y = 600+this.height*.5
        }
    };
    return Sprite;
})();

var Duck = (function(){
    Duck.prototype = Object.create(Sprite.prototype);
    function Duck(img){
        Sprite.call(this,img);
        this.status = 0;
        this.dir = 1;
        this.sndQuack = new Audio("sounds/quack.wav");
        if (Math.random()<.5){
            this.scaleX=-1;
            this.dir=-1
        }
        this.speed = ~~(Math.random()*3)+1;
        this.delay = 0;
        console.log("duck created");
    }
    Duck.prototype.hit = function() {
        this.status = 1;    //change status to 1 (hit)
        this.index = 4;     //switch to hit graphic
        this.delay = 30;    //start hit timer
        console.log("hit");
    };
    Duck.prototype.update = function(){
        if(this.status==0) {
            this.index += this.aspeed;
            if (this.index > 3) {           //loop animation sequence
                this.index = 0;
            }
            if (Math.random()<.01){         //randomly quack
                this.sndQuack.cloneNode(true).play();
            }
            this.x+=this.speed*this.dir;    //move duck across screen based off it's speed and direction properties
        }  else if (this.status==1){
            this.delay--;
            if (this.delay<1){
                this.status++;              //falling mode
                this.index=3;               //falling graphic
                this.delay=3;               //hold on kill graphic for a short while
            }
        } else if (this.status==2){         //duck falling state
            this.y+=5;
            if (this.delay<1){          //flipping back and forth with delay
                if (this.scaleX==1){
                    this.scaleX=-1;
                    this.delay=3;
                }else{
                    this.scaleX=1
                }
            }
            this.delay--;
            if (this.y>550){
                this.status++;
            }
        }
        this.stageWrap();
        this.draw();

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