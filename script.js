let gameScene = new Phaser.Scene("Game");


let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    
    scene: {
        preload: preload,
        create: create,
        update: update
    },

    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 200 },
            debug: false   //to show colliders
        }
    },

    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false 
    }
}

let player1;
let player2;
let health;
let health2;
let count = 8;
let count2 = 8;
let stars;

let userInput;

let collisionOccurred = false;
let canHit = true;

function preload() {
    this.load.image("bg", "Assets/background0.png");
    this.load.audio("bgMusic", "Assets/fight.mp3");
    //parallex
    this.load.image("bg1", "Assets/bg1.png");
    this.load.image("bg2", "Assets/bg2.png");
    this.load.image("platform", "Assets/p1.png");
    this.load.image("star", "Assets/star.png");
    this.load.image("win", "Assets/winner.png");
    this.load.spritesheet({
        key: "Run",
        url: "Assets/Run.png",
        frameConfig: {
            frameWidth: 100,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 6
        }
    });
    this.load.spritesheet({
        key: "Run2",
        url: "Assets/Run2.png",
        frameConfig: {
            frameWidth: 80,
            frameHeight: 80,
            startFrame: 0,
            endFrame: 7
        }
    });
    this.load.spritesheet({
        key: "Idle",
        url: "Assets/Idle.png",
        frameConfig: {
            frameWidth: 100,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 3
        }
    });
    this.load.spritesheet({
        key: "Idle2",
        url: "Assets/Idle2.png",
        frameConfig: {
            frameWidth: 64,
            frameHeight: 80,
            startFrame: 0,
            endFrame: 3
        }
    });
    this.load.spritesheet({
        key: "Attack",
        url: "Assets/Attack.png",
        frameConfig: {
            frameWidth: 100,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 5
        }
    });
    this.load.spritesheet({
        key: "Attack2",
        url: "Assets/Attack2.png",
        frameConfig: {
            frameWidth: 96,
            frameHeight: 80,
            startFrame: 0,
            endFrame: 7
        }
    });
    this.load.spritesheet({
        key: "Dying",
        url: "Assets/Dying.png",
        frameConfig: {
            frameWidth: 100,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 5
        }
    });
    this.load.spritesheet({
        key: "Dying2",
        url: "Assets/Dying2.png",
        frameConfig: {
            frameWidth: 100,
            frameHeight: 80,
            startFrame: 0,
            endFrame: 8
        }
    });

    this.load.spritesheet({
        key: "health",
        url: "Assets/05.png",
        frameConfig: {
            frameWidth: 48,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 8
        }
    });

    this.load.spritesheet({
        key: "health2",
        url: "Assets/05.png",
        frameConfig: {
            frameWidth: 48,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 8
        }
    });
}
function create() {
    //background
    this.add.image(400, 300, "bg").setScrollFactor(0);
    this.add.image(1200, 300, "bg").setScrollFactor(0);
    this.add.image(2000, 300, "bg").setScrollFactor(0);

    bgMusic = this.sound.add("bgMusic", { volume: 0.1 });
    bgMusic.play();

    this.add.image(400, 210, "bg1").setScale(3.5, 3.5).setScrollFactor(0.25);
    this.add.image(1100, 210, "bg1").setScale(3.5, 3.5).setScrollFactor(0.25);
    this.add.image(1800, 210, "bg1").setScale(3.5, 3.5).setScrollFactor(0.25);

    this.add.image(410, 330, "bg2").setScale(3.5, 3.5).setScrollFactor(0.4);
    this.add.image(1110, 330, "bg2").setScale(3.5, 3.5).setScrollFactor(0.4);
    this.add.image(1810, 330, "bg2").setScale(3.5, 3.5).setScrollFactor(0.4);

    //platforms ground
    let platforms = this.physics.add.staticGroup();
    platforms.create(400, 580, "platform").setScale(0.44, 0.26).refreshBody().setSize(800, 60);
    platforms.create(1200, 580, "platform").setScale(0.44, 0.26).refreshBody().setSize(800, 60);
    platforms.create(2000, 580, "platform").setScale(0.44, 0.26).refreshBody().setSize(800, 60);


    //first 3 platforms
    platforms.create(0, 200, "platform").setScale(0.2).refreshBody().setSize(400, 60);
    platforms.create(700, 200, "platform").setScale(0.2).refreshBody().setSize(400, 60);
    platforms.create(350, 430, "platform").setScale(0.2).refreshBody().setSize(400, 60);

    platforms.create(1300, 400, "platform").setScale(0.2).refreshBody().setSize(400, 60);
    platforms.create(1850, 250, "platform").setScale(0.2).refreshBody().setSize(400, 60);

    platforms.create(0, -40, "platform").setScale(5, 0.2).refreshBody().setSize(5000, 60);
    platforms.create(0, -40, "platform").setScale(0, 0).refreshBody().setSize(5000, 60);
    platforms.create(0, 0, "platform").setScale(0,0).refreshBody().setSize(20, 1200);
    platforms.create(2400, 0, "platform").setScale(0,0).refreshBody().setSize(20, 1200);

    //stars
    stars = this.physics.add.group({
        key: "star",
        repeat: 7,   //3dd l stars
        setXY: {
            x: 100, y: 50,
            stepX: 100 + (Math.random() * 100)
        }
    })
    stars.children.entries.forEach((val) => {
        val.setBounce(0, 0.5);
    })
    this.physics.add.collider(stars, platforms);

    //player1  girl
    player1 = this.physics.add.sprite(200, 300, "Idle").setSize(30, 60);
    this.physics.add.collider(player1, platforms);
    this.physics.add.overlap(player1, player2, onPlayerOverlap, null, this);
    this.physics.add.overlap(player1, stars, onstar , null, this);
    //health player1 girl
    health = this.add.sprite(player1.x, 50, "health").setScale(1, 1);

    //player2  boy
    player2 = this.physics.add.sprite(300, 300, "Idle2").setScale(1.2).setSize(50, 50);
    this.physics.add.collider(player2, platforms);
    this.physics.add.overlap(player2, player1, onPlayerOverlap, null, this);
    //health player2 boy
    health2 = this.add.sprite(player2.x, 50, "health2").setScale(1, 1);
    this.physics.add.overlap(player2, stars, onstar2 , null, this);

    //camera
    const { width, height } = this.sys.game.config;
    this.cameras.main.setBounds(0, 0, width * 3, height);




    this.anims.create({
        key: "8",
        frames: this.anims.generateFrameNumbers("health", { start: 0, end: 0 }),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: "7",
        frames: this.anims.generateFrameNumbers("health", { start: 1, end: 1 }),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: "6",
        frames: this.anims.generateFrameNumbers("health", { start: 2, end: 2 }),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: "5",
        frames: this.anims.generateFrameNumbers("health", { start: 3, end: 3 }),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: "4",
        frames: this.anims.generateFrameNumbers("health", { start: 4, end: 4 }),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: "3",
        frames: this.anims.generateFrameNumbers("health", { start: 5, end: 5 }),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: "2",
        frames: this.anims.generateFrameNumbers("health", { start: 6, end: 6 }),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: "1",
        frames: this.anims.generateFrameNumbers("health", { start: 6, end: 7 }),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: "0",
        frames: this.anims.generateFrameNumbers("health", { start: 7, end: 7 }),
        frameRate: 10,
        repeat: -1,
    });

    //create animation for player 2 boy
    this.anims.create({
        key: "88",
        frames: this.anims.generateFrameNumbers("health2", { start: 0, end: 0 }),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: "77",
        frames: this.anims.generateFrameNumbers("health2", { start: 1, end: 1 }),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: "66",
        frames: this.anims.generateFrameNumbers("health2", { start: 2, end: 2 }),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: "55",
        frames: this.anims.generateFrameNumbers("health2", { start: 3, end: 3 }),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: "44",
        frames: this.anims.generateFrameNumbers("health2", { start: 4, end: 4 }),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: "33",
        frames: this.anims.generateFrameNumbers("health2", { start: 5, end: 5 }),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: "22",
        frames: this.anims.generateFrameNumbers("health2", { start: 6, end: 6 }),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: "11",
        frames: this.anims.generateFrameNumbers("health2", { start: 6, end: 7 }),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: "00",
        frames: this.anims.generateFrameNumbers("health2", { start: 7, end: 7 }),
        frameRate: 10,
        repeat: -1,
    });


    //animation of player1
    player1.anims.create({
        key: "Run",
        frames: this.anims.generateFrameNumbers("Run", { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1,
    });
    player1.anims.create({
        key: "idle",
        frames: this.anims.generateFrameNumbers("Idle", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
    });
    player1.anims.create({
        key: "Dying",
        frames: [{ key: "Dying", frame: 4 }],
        frameRate: 1,
    });
    player1.anims.create({
        key: "Attack",
        frames: this.anims.generateFrameNumbers("Attack", { start: 0, end: 5 }),
        frameRate: 25,
        repeat: -1,
    });


    //animation of player2
    player2.anims.create({
        key: "Run2",
        frames: this.anims.generateFrameNumbers("Run2", { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1,
    });
    player2.anims.create({
        key: "idle2",
        frames: this.anims.generateFrameNumbers("Idle2", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
    });
    player2.anims.create({
        key: "Dying2",
        frames: [{ key: "Dying2", frame: 7 }],
        frameRate: 1
    });
    player2.anims.create({
        key: "Attack2",
        frames: this.anims.generateFrameNumbers("Attack2", { start: 0, end: 7 }),
        frameRate: 25,
        repeat: -1,
    });


    //keyboard handle
    userInput = this.input.keyboard.addKeys({
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
        w: Phaser.Input.Keyboard.KeyCodes.W,
        a: Phaser.Input.Keyboard.KeyCodes.A,
        d: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
}

function onPlayerOverlap(player1, player2) {
    if (!collisionOccurred) {
        collisionOccurred = true;
        canHit = false;

        if (userInput.space.isDown) {
            if (count > 0) {
                count--;
                console.log("Hit  ", count);
            }
        } else if (userInput.enter.isDown) {
            if (count2 !== 0) {
                count2--;
                console.log("Hit  ", count2);
            }
        }

        this.time.delayedCall(200, () => {
            canHit = true;
            collisionOccurred = false;
        }, [], this);
    }
}

function onstar(player1 , star){
    if(count < 8){
        count++;
        star.disableBody(true , true);
    }
    console.log("star");
}
function onstar2(player2 , star){
    if(count2 < 8){
        count2++;
        star.disableBody(true , true);
    }
    console.log("star2");
}

function update() {


    //handle keyboard pressed player1
    if (userInput.right.isDown) {
        player1.anims.play("Run", true);
        player1.setVelocityX(100);
        player1.setFlipX(false);
    }
    else if (userInput.left.isDown) {
        player1.anims.play("Run", true);
        player1.setVelocityX(-100);
        player1.setFlipX(true);
    }
    else if (userInput.enter.isDown) {
        player1.anims.play("Attack", true);
    }
    else {
        player1.anims.play("idle", true);
        player1.setVelocityX(0);
    }

    if (userInput.up.isDown && player1.body.touching.down) {
        player1.setVelocityY(-400);
    }

    //player2
    if (userInput.d.isDown) {
        player2.anims.play("Run2", true);
        player2.setVelocityX(100);
        player2.setFlipX(false);
    }
    else if (userInput.a.isDown) {
        player2.anims.play("Run2", true);
        player2.setVelocityX(-100);
        player2.setFlipX(true);
    }
    else if (userInput.space.isDown) {
        player2.anims.play("Attack2", true);
    }
    else {
        player2.anims.play("idle2", true);
        player2.setVelocityX(0);
    }
    if (userInput.w.isDown && player2.body.touching.down) {
        player2.setVelocityY(-400);
    }


    //check for health player1
    switch (count) {
        case 8:
            health.anims.play("8", true);
            break;
        case 7:
            health.anims.play("7", true);
            break;
        case 6:
            health.anims.play("6", true);
            break;
        case 5:
            health.anims.play("5", true);
            break;
        case 4:
            health.anims.play("4", true);
            break;
        case 3:
            health.anims.play("3", true);
            break;
        case 2:
            health.anims.play("2", true);
            break;
        case 1:
            health.anims.play("1", true);
            break;
        case 0:
            health.anims.play("0", true);
            break;

        default:
            break;
    }

    //health for player2 boy
    switch (count2) {
        case 8:
            health2.anims.play("88", true);
            break;
        case 7:
            health2.anims.play("77", true);
            break;
        case 6:
            health2.anims.play("66", true);
            break;
        case 5:
            health2.anims.play("55", true);
            break;
        case 4:
            health2.anims.play("44", true);
            break;
        case 3:
            health2.anims.play("33", true);
            break;
        case 2:
            health2.anims.play("22", true);
            break;
        case 1:
            health2.anims.play("11", true);
            break;
        case 0:
            health2.anims.play("00", true);
            break;

        default:
            break;
    }

    if (count === 0) {
        player1.anims.play("Dying", true);
        player1.setVelocity(0);
        player1.setFlipX(false);
        setTimeout(() => {
            this.add.image(400, 300, "win").setDepth(5).setScale(0.5);
            this.add.image(400, 300, "bg").setScrollFactor(0);
            this.add.image(400, 225, "bg1").setScale(3.5, 3.5).setScrollFactor(0.25);
            this.add.image(410, 330, "bg2").setScale(3.5, 3.5).setScrollFactor(0.4);
        }, 5000)
    }
    if (count2 === 0) {
        player2.anims.play("Dying2", true);
        player2.setVelocity(0);
        player2.setFlipX(false);
        setTimeout(() => {
            this.add.image(400, 300, "win").setDepth(5).setScale(0.5);
            this.add.image(400, 300, "bg").setScrollFactor(0);
            this.add.image(400, 225, "bg1").setScale(3.5, 3.5).setScrollFactor(0.25);
            this.add.image(410, 330, "bg2").setScale(3.5, 3.5).setScrollFactor(0.4);
        }, 5000)
    }

    //Camera movement 
    const { width } = this.sys.game.config;
    const playerBounds = {
        left: 12,
        right: width * 3 - player1.width,
    };

    player1.x = Phaser.Math.Clamp(player1.x, playerBounds.left, playerBounds.right);

    const cam = this.cameras.main;
    const speed = 3;

    // Adjust camera position based on player1's x-coordinate
    cam.scrollX = player1.x - config.width / 2;

    if (userInput.right.isDown) {
        cam.scrollX += speed;
    } else if (userInput.left.isDown) {
        cam.scrollX -= speed - 6;
    }

    cam.scrollX = Phaser.Math.Clamp(cam.scrollX, 0, width * 3 - cam.width);

    health.setPosition(player1.x, player1.y - 50);
    health2.setPosition(player2.x, player2.y - 50);
}

let game = new Phaser.Game(config);