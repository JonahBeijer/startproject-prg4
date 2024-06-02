import '../css/style.css';
import { Actor, Engine, Vector, Input, Axis, Label, Color } from 'excalibur';
import { Resources, ResourceLoader } from './resources.js';
import { Player } from './player.js';
import { GameOverScene } from './gameOverScene';

class Game extends Engine {
    constructor() {
        super({ width: 1920, height: 1080 });
        this.backgrounds = [];
        this.score = 0;
        this.scoreLabel = null;
        this.backgroundMusic = Resources.Muziek;
        this.gameOverMusic = Resources.GameOverMusic;
        this.start(ResourceLoader).then(() => this.startGame());
    }

    stopScore() {
        if (this.player && !this.player.isMovingRight) {
            return;
        }
    }

    async startGame() {
        console.log("Start de game!");
    
        await Resources.Tilemap.load();
    
        this.createBackground();
    
        this.tilemap = Resources.Tilemap; // Initialiseren van de tilemap-instantie
    
        Resources.Tilemap.addToScene(this.currentScene);
    
        this.player = new Player(this.tilemap, this); // Doorgeven van de tilemap-instantie aan de spelerklasse
        this.add(this.player);
    
        this.input.keyboard.on('press', (evt) => {
            if (evt.key === Input.Keys.Space && this.player.canJump) {
                this.player.jump();
            }
        });
    
        this.currentScene.camera.strategy.lockToActorAxis(this.player, Axis.X);
    
        this.currentScene.camera.pos.x = this.player.pos.x;
    
        this.backgroundMusic.loop = true;
        this.backgroundMusic.play();
    
        this.scoreLabel = new Label({
            pos: new Vector(this.currentScene.camera.pos.x - this.halfDrawWidth + 100, 50),
            text: 'Score: 0',
             // Vergroot de lettergrootte naar 40
            fontFamily: 'Arial', // Stel het lettertype in, indien nodig
           // Stel de uitlijning van de tekst in, indien nodig
            color: Color.Black
        });
    
        this.add(this.scoreLabel);
        this.updateScoreLabel();
    }

    createBackground() {
        this.backgrounds.forEach(bg => this.remove(bg));
        this.backgrounds = [];

        const background1 = new Actor({
            pos: new Vector(this.halfDrawWidth, this.halfDrawHeight),
            width: this.drawWidth,
            height: this.drawHeight,
        });
        background1.graphics.use(Resources.Background.toSprite());

        const background2 = new Actor({
            pos: new Vector(this.halfDrawWidth + this.drawWidth, this.halfDrawHeight),
            width: this.drawWidth,
            height: this.drawHeight,
        });
        background2.graphics.use(Resources.Background.toSprite());

        const background3 = new Actor({
            pos: new Vector(this.halfDrawWidth + 2 * this.drawWidth, this.halfDrawHeight),
            width: this.drawWidth,
            height: this.drawHeight,
        });
        background3.graphics.use(Resources.Background.toSprite());

        this.add(background1);
        this.add(background2);
        this.add(background3);

        this.backgrounds = [background1, background2, background3];
    }

    increaseScore() {
        this.score += 1;
        this.updateScoreLabel();
    }

    updateScoreLabel() {
        this.scoreLabel.text = 'Score: ' + this.score;
    }

    onPostUpdate(engine, delta) {
        super.onPostUpdate(engine, delta);
        
        if (this.player) {
            if (this.player.pos.x > this.player.previousX) {
                this.increaseScore();
            }
        }
    }

    onPreUpdate(engine, delta) {
        super.onPreUpdate(engine, delta);
        this.updateBackgrounds();

        if (this.scoreLabel) {
            this.scoreLabel.pos = new Vector(this.currentScene.camera.pos.x - this.halfDrawWidth + 100, 50);
        }
    }

    updateBackgrounds() {
        if (!this.player) return;

        const playerX = this.player.pos.x;
        const halfWidth = this.drawWidth / 2;

        this.backgrounds.forEach(bg => {
            if (bg.pos.x < playerX - halfWidth - this.drawWidth) {
                bg.pos.x += this.drawWidth * this.backgrounds.length;
            }
        });
    }


    resetScore() {
        this.score = 0;
        this.updateScoreLabel();
    }

    resetGame() {
        this.currentScene.clear();
        this.resetScore();
        this.createBackground();
        this.startGame();
    
        // Reset de speler
        if (this.player) {
            this.player.reset();
        }
    }

   showGameOverScene() {
    if (!this.scenes['gameOver']) {
        // Pauzeer en reset de achtergrondmuziek
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }

        // Speel het gameover muziekeffect af
        this.gameOverMusic = new Audio('images/gameovermuziek.mp3');
        this.gameOverMusic.loop = false;
        this.gameOverMusic.play();

        // Stop de achtergrondmuziek wanneer het spel eindigt
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }

        const gameOverScene = new GameOverScene(this.score, this);
        this.addScene('gameOver', gameOverScene);
    }

    this.goToScene('gameOver');
}


    addScene(name, scene) {
        if (this.scenes[name]) {
            this.removeScene(name); // Verwijder de bestaande scène indien aanwezig
        }
        this.scenes[name] = scene;
        this.add(scene);
    }

    removeScene(name) {
        const scene = this.scenes[name];
        if (scene) {
            this.remove(scene);
            delete this.scenes[name];
        }
    }
}

const gameInstance = new Game();

