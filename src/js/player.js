import { Actor, CollisionType, Vector, SpriteSheet, Animation, range, Timer } from 'excalibur';
import { Resources } from './resources';

export class Player extends Actor {
    constructor(tilemap, game) {
        super({
            pos: new Vector(1270, 384),
            width: 32,
            height: 32,
            collisionType: CollisionType.Active,
            name: 'Player' // Add name for debugging
        });

        // Add player tag for coin collision detection
        this.addTag('player');
        
        // Debug: verify tag
        console.log("Player tags:", this.tags);
        
        this.game = game;
        this.isMovingRight = false;
        this.previousX = this.pos.x;
        this.isDead = false; 
        
        // FIXED: Remove explicit collider setup - Excalibur creates it automatically
        // based on the width and height we provided
        
        const playerSpriteSheet = SpriteSheet.fromImageSource({
            image: Resources.PixelYe,
            grid: { rows: 1, columns: 6, spriteWidth: 32, spriteHeight: 32 }
        });

        this.walkAnimation = Animation.fromSpriteSheet(playerSpriteSheet, range(0, 5), 100);
        this.walkAnimation.scale = new Vector(1, 1);

        const jumpSpriteSheet = SpriteSheet.fromImageSource({
            image: Resources.Dude_Monster_Jump_8,
            grid: { rows: 1, columns: 8, spriteWidth: 32, spriteHeight: 32 }
        });

        this.jumpAnimation = Animation.fromSpriteSheet(jumpSpriteSheet, range(0, 7), 100);
        this.jumpAnimation.scale = new Vector(1, 1);

        const deathSpriteSheet = SpriteSheet.fromImageSource({
            image: Resources.Dude_Monster_Death_8,
            grid: { rows: 1, columns: 8, spriteWidth: 32, spriteHeight: 32 }
        });

        this.deathAnimation = Animation.fromSpriteSheet(deathSpriteSheet, range(0, 7), 100);
        this.deathAnimation.scale = new Vector(1, 1);
        this.deathAnimation.loop = false;

        this.graphics.use(this.walkAnimation);

        this.canJump = true;

        this.tilemap = tilemap;
        this.initialSpeed = 100.0;
        this.vel.x = this.initialSpeed;
        this.acceleration = new Vector(0, 800);
        
        this.speedIncreaseRate = 0.05;
        this.currentSpeedMultiplier = 1;
    }

    onPreUpdate(engine, delta) {
        if (!this.isDead) {
            const speed = 300;
    
            this.vel.x = speed;
            this.isMovingRight = this.vel.x > 0;
    
            this.vel.addEqual(this.acceleration.scale(delta / 1000));
    
            if (this.pos.y >= 496 && !this.isDead) {
                this.isDead = true;
                this.graphics.use(this.deathAnimation);
    
                const timer = new Timer({
                    fcn: () => {
                        this.resetPlayer();
                    },
                    interval: 650,
                    repeats: false
                });
    
                engine.add(timer);
                timer.start();
            }
    
            if (this.pos.y + this.height / 2 >= engine.drawHeight) {
                this.pos.y = engine.drawHeight - this.height / 2;
                this.vel.y = 0;
                this.canJump = true;
                if (this.graphics.current !== this.walkAnimation && !this.isDead) {
                    this.graphics.use(this.walkAnimation);
                }
            }
        }
    }

    onPostUpdate(engine, delta) {
        super.onPostUpdate(engine, delta);
        
        this.currentSpeedMultiplier *= Math.pow(1 + this.speedIncreaseRate, delta / 1000);
        this.vel.x = this.initialSpeed * this.currentSpeedMultiplier;
        this.vel.addEqual(this.acceleration.scale(delta / 1000));

        if (this.isMovingRight && this.vel.x > 0 && this.pos.x > this.previousX) {
            this.game.increaseScore();
        } else {
            this.game.stopScore();
        }
    
        this.previousX = this.pos.x;
    }

    jump() {
        if (this.canJump) {
            this.vel.y = -500;
            this.canJump = false;
            if (this.vel.x !== 0) {
                this.graphics.use(this.jumpAnimation);
                setTimeout(() => {
                    if (!this.isDead) {
                        this.graphics.use(this.walkAnimation);
                    }
                }, 600);
            }
            setTimeout(() => {
                this.canJump = true;
            }, 600);
        }
    }
    
    resetPlayer() {
        if (this.game) {
            this.isDead = true;
            this.graphics.use(this.deathAnimation);
            this.game.showGameOverScene();
        }
    }
    
    reset() {
        this.pos.setTo(1270, 384);
        this.initialSpeed = 100;
        this.vel.x = this.initialSpeed;
        this.acceleration = new Vector(0, 800);
        this.speedIncreaseRate = 0.05;
        this.currentSpeedMultiplier = 1;
        this.isDead = false;
        this.graphics.use(this.walkAnimation);
    }
}