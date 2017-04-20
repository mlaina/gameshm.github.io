var game = function() {

// Set up an instance of the Quintus engine  and include
// the Sprites, Scenes, Input and 2D module. The 2D module
// includes the `TileLayer` class as well as the `2d` componet.
var Q = window.Q = Quintus({ audioSupported: [ 'mp3' ] })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio").enableSound()
        // Maximize this game to whatever the size of the browser is
        .setup({ maximize: true })
        // And turn on default input controls and touch input (for UI)
        .controls().touch();



Q.animations("mario_anim", {
  walk_right: { frames: [0,1,2,3], rate: 1/10, flip: false, loop: true}, 
  walk_left: { frames: [15,16,17], rate: 1/10, flip:false, loop: true}, 
  jump_right: { frames: [4], rate: 1/10, flip: false },
  jump_left: { frames: [18], rate: 1/10, flip: false },
  stand_right: { frames:[0], rate: 1/10, flip: false },
  stand_left: { frames: [14], rate: 1/10, flip:false },
  duck_right: { frames: [15], rate: 1/10, flip: false },
  duck_left: { frames: [15], rate: 1/10, flip: "x" },
  climb: { frames: [16, 17], rate: 1/3, flip: false }
});


// ## Player Sprite
// The very basic player sprite, this is just a normal sprite
// using the player sprite sheet with default controls added to it.
Q.Sprite.extend("Mario",{

  // the init constructor is called on creation
  init: function(p) {

    // You can call the parent's constructor with this._super(..)
    this._super(p, {
      sprite: "mario_anim",
      sheet: "marioR",  // Setting a sprite sheet sets sprite width and height
      x: 150,           // You can also set additional properties that can
      y: 380,           // be overridden on object creation
      gravity: 0.6             
    });
    this.add('2d, platformerControls, animation');

    this.on("bump.top",function(collision) {
        if(collision.obj.isA("Mario")) {
          this.destroy(); 
          collision.obj.p.vy = -300;
        }
    });

  },

  step: function(dt){
    if(this.p.vy!=0){
      this.play("jump_"+this.p.direction);
    }else if(this.p.vx > 0) {
      this.play("walk_right"); 
    } else if(this.p.vx < 0) {
      this.play("walk_left"); 
    } else {
      this.play("stand_" + this.p.direction);
    }



    if(this.p.y > 550){
      this.p.x = 150;
      this.p.y = 380;
      this.p.vy = 0;
    }
  }

});

Q.Sprite.extend("Goomba",{//seta
  init: function(p) {
    this._super(p, {
      sprite: "goomba",
      sheet: "goomba",  // Setting a sprite sheet sets sprite width and height
      x: 250,           // You can also set additional properties that can
      y: 380,           // be overridden on object creation
      gravity: 1,
      vx: 100             
    });
    this.add('2d, animation, aiBounce');
    this.on("bump.top",function(collision) {
        if(collision.obj.isA("Mario")) {
          this.destroy(); 
          collision.obj.p.vy = -300;
        }
    });
    this.on("bump.left,bump.right,bump.bottom",function(collision) {
        if(collision.obj.isA("Mario")) { 
            Q.stageScene("endGame",1, { label: "You Died" }); 
            collision.obj.destroy();
        }
    });
  },
  step: function(dt){

    if(this.p.y > 550){
      this.p.x = 150;
      this.p.y = 380;
      this.p.vy = 0;
    }
  }

});

Q.Sprite.extend("Bloopa",{//calamar
  init: function(p) {
    this._super(p, {
      sprite: "bloopa",
      sheet: "bloopa",  // Setting a sprite sheet sets sprite width and height
      x: 350,           // You can also set additional properties that can
      y: 380,           // be overridden on object creation
      gravity: 0.1       
    });
    this.add('2d, animation, aiBounce');
    this.on("bump.top",function(collision) {
        if(collision.obj.isA("Mario")) {
          this.destroy(); 
          collision.obj.p.vy = -300;
        }
    });
    this.on("bump.bottom",function(collision) {
      this.vy = -100;
    });
    this.on("bump.left,bump.right,bump.bottom",function(collision) {
        if(collision.obj.isA("Mario")) { 
            Q.stageScene("endGame",1, { label: "You Died" }); 
            collision.obj.destroy();
        }
    });
  },
  step: function(dt){
    if(this.p.y > 550){
      this.p.x = 150;
      this.p.y = 380;
      this.p.vy = 200;
    }
  }

});
Q.load([ "music_main.mp3" ], function() { 
  Q.audio.play('music_main.mp3',{ loop: true });
});

Q.load(["mario_small.png", "mario_small.json", "goomba.png", "goomba.json", "bloopa.png", "bloopa.json"], function(){
        Q.compileSheets("mario_small.png", "mario_small.json");
        Q.compileSheets("goomba.png", "goomba.json");
        Q.compileSheets("bloopa.png", "bloopa.json");
      });

Q.scene("level1",function(stage) {
      Q.stageTMX("level.tmx",stage);
      var mario = stage.insert(new Q.Mario());
      var goomba = stage.insert(new Q.Goomba());
      var bloopa = stage.insert(new Q.Bloopa());
      stage.add("viewport").follow(mario,{ x: true, y: false });
});
 
Q.loadTMX("level.tmx", function() {

    Q.stageScene("level1");

});


}