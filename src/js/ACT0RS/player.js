import { Actor, CollisionType, Vector, SpriteSheet, Animation, range, Side, Timer, Input } from 'excalibur';
import { Resources } from '../Recources/resources';

export class Player extends Actor {
    constructor(tilemap, game) {
        super({
            pos: new Vector(1270, 384),
            width: 32,
            height: 32,
            collisionType: CollisionType.Active,
            name: 'Player',
            z: 10
        });

        this.addTag('player');
        this.game = game;
        this.tilemap = tilemap;
        this.isDead = false;
        
        this.maxJumps = 2; 
        this.jumpsLeft = this.maxJumps;

        this.isGrounded = false;
        this.previousX = this.pos.x;
        this.setupGraphics();

        this.initialSpeed = 100.0;
        this.currentSpeedMultiplier = 1;
        this.speedIncreaseRate = 0.05;
        this.vel.x = this.initialSpeed;
        this.acceleration = new Vector(0, 800);
    }

    onInitialize(engine) {
        this.on('precollision', this.onPreCollision.bind(this));
        this.on('postcollision', this.onPostCollision.bind(this));
    }

    setupGraphics() {
        const playerSpriteSheet = SpriteSheet.fromImageSource({
            image: Resources.PixelYe,
            grid: { rows: 1, columns: 6, spriteWidth: 32, spriteHeight: 32 }
        });
        this.walkAnimation = Animation.fromSpriteSheet(playerSpriteSheet, range(0, 5), 100);

        const jumpSpriteSheet = SpriteSheet.fromImageSource({
            image: Resources.Dude_Monster_Jump_8,
            grid: { rows: 1, columns: 8, spriteWidth: 32, spriteHeight: 32 }
        });
        this.jumpAnimation = Animation.fromSpriteSheet(jumpSpriteSheet, range(0, 7), 100);

        const deathSpriteSheet = SpriteSheet.fromImageSource({
            image: Resources.Dude_Monster_Death_8,
            grid: { rows: 1, columns: 8, spriteWidth: 32, spriteHeight: 32 }
        });
        this.deathAnimation = Animation.fromSpriteSheet(deathSpriteSheet, range(0, 7), 100);
        this.deathAnimation.loop = false;

        this.graphics.use(this.walkAnimation);
    }
    
    onPreCollision(evt) {
        this.isGrounded = false;
    }

    onPostCollision(evt) {
        if (evt.side === Side.Bottom) {
            this.isGrounded = true;
        }
    }

    onPreUpdate(engine, delta) {
        if (this.isDead) return;

        
        if (engine.input.keyboard.wasPressed(Input.Keys.Space)) {
            this.jump();
        }

        this.vel.y += this.acceleration.y * (delta / 1000);

        if (this.pos.x > this.previousX) {
            this.game.increaseScore();
        }
        this.previousX = this.pos.x;

        if (this.pos.y > 496) {
            this.die();
        }

        if (this.isGrounded) {
            this.jumpsLeft = this.maxJumps;
            
            if (this.graphics.current !== this.walkAnimation && !this.isDead) {
                this.graphics.use(this.walkAnimation);
            }
        }
    }

    onPostUpdate(engine, delta) {
        if (this.isDead) return;
        super.onPostUpdate(engine, delta);
        this.currentSpeedMultiplier *= (1 + this.speedIncreaseRate * (delta / 1000));
        this.vel.x = this.initialSpeed * this.currentSpeedMultiplier;
    }

    jump() {
        if (this.jumpsLeft > 0 && !this.isDead) {
            this.vel.y = -250;
            this.jumpsLeft--; 
            this.isGrounded = false; 
            this.graphics.use(this.jumpAnimation);
        }
    }

    die() {
        if (!this.isDead) {
            this.isDead = true;
            this.vel.x = 0;
            this.vel.y = 0;
            
            this.graphics.use(this.deathAnimation);
            
            const timer = new Timer({
                fcn: () => {
                    this.game.showGameOverScene();
                },
                interval: 800,
                repeats: false
            });
            
            this.scene.add(timer);
            timer.start();
        }
    }

    reset() {
        this.pos.setTo(1270, 384);
        this.vel.x = this.initialSpeed;
        this.currentSpeedMultiplier = 1;
        this.isDead = false;
        
        this.jumpsLeft = this.maxJumps;
        
        this.isGrounded = false;
        this.graphics.use(this.walkAnimation);
    }
}