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
        Game.screen.style.cursor = 'none';                  //hide the cursor over canvas
        for (var i = 0;i<10;i++){                           //loop that creates the ducks
            var duck = new Duck(this.ss);                   //instantiate a duck
            duck.x = Math.random()*380+100;                 //position the x coordinate of the duck
            duck.y = Math.random()*200+50;                  //position the y coordinate of the duck
            this.ducks.push(duck);                          //put the duck in ducks array
        }
        Game.screen.addEventListener("mousedown",this.onClick.bind(this),false); //listen for mousedown event
        //bind the onClick callback function to keep the this context to the game
        this.crossHair = new CrossHair();                   //instantiate Cross hair
        this.crossHair.draw();                              //invoke draw() that will draw the stroke on canvas
        Game.screen.addEventListener("mousemove", function (e) {    //listen for mousemove event
            //every time the mouse moves get the location of the cursor
            //this.mouse = {x: 0, y: 0};
            var offsetLeft = Game.screen.offsetLeft,
                offsetTop = Game.screen.offsetTop,
                x, y;
            x = e.pageX;
            y = e.pageY;
            x -= offsetLeft;
            y -= offsetTop;
            this.mouse.x = x;
            this.mouse.y = y;
        }.bind(this));
        this.updateAll();                                   //invoke updateAll() method on Game object
    };

    Game.prototype.getDistance = function(x1, y1, x2, y2){  //method that returns the distance between 2 points
        var dx = x1 - x2;
        var dy = y1 - y2;
        var dist = Math.sqrt(dx*dx+dy*dy);
        return dist;
    };

    Game.prototype.onClick = function(e){                   //callback function that runs when mouse button clicked
        this.sndShoot.cloneNode(true).play();               //play sound
        var that = this;                                    //get reference to game instance
        this.ducks.forEach(function(duck) {
            if (duck.status == 0 && that.getDistance(duck.x, duck.y, that.mouse.x, that.mouse.y) < 35) {
                that.sndVictory.cloneNode(true).play();     //keyword "this" references inside function. use that var.
                duck.hit();
                that.score+=5;
                that.scoreTxt.innerHTML ="SCORE:"+that.score;
            }
        });
    };

    Game.prototype.updateAll = function(e){                 //method that starts main game loop
        var that = this;                                    //get reference to game instance
        (function drawFrame(){                              //recursive function that occurs 60 FPS
            window.requestAnimationFrame(drawFrame);        //JS function that renders canvas at 60 FPS
            Game.ctx.clearRect(0,0,800,600);                //erase entire canvas
            that.ducks.forEach(function(e){                 //iterate through all the ducks and update all living ducks
                if (e.status<3){
                    e.update();
                }
            });
            that.crossHair.draw(that.mouse.x,that.mouse.y); //draw the cross hair object
        })()

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
        this.draw();
    }
    CrossHair.prototype.draw = function(x,y){
        Game.ctx.save();
        Game.ctx.translate(x,y);
        Game.ctx.beginPath();
        Game.ctx.arc(0, 0, 30, 0, 2 * Math.PI, false);
        Game.ctx.lineWidth = 2;
        Game.ctx.strokeStyle = '#ff3300';
        Game.ctx.stroke();
        // Game.ctx.beginPath();
        Game.ctx.moveTo(0,-30);
        Game.ctx.lineTo(0,30);
        Game.ctx.stroke();
        Game.ctx.moveTo(-30,0);
        Game.ctx.lineTo(30,0);
        Game.ctx.stroke();
        Game.ctx.restore();
    };
    return CrossHair
})();
