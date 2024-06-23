import '../css/style.css';
import { Engine, Vector, Input, Axis, Label, Color, Scene, Actor, DisplayMode, CoordPlane, Font } from 'excalibur'; // Voeg Actor toe
import { Resources, ResourceLoader } from './resources.js';
import { Player } from './player.js';
import { GameOverScene } from './gameOverScene';
import { BeginScene } from './BeginScene.js'; // Importeer de BeginScene
import { OptionsScene } from './OptionsScene.js'; // Importeer de OptionsScene
import { IntroScene } from './IntroScene.js';

class Game extends Engine {
    
    constructor() {
        super({
            width: 1920,
            height: 1080,
            displayMode: DisplayMode.FitScreen,
            fixedUpdateFps: 60, // more consistent physics simulation, guarantees 60 fps worth of updates
            backgroundColor: Color.White
        });
        this.backgrounds = [];
        this.score = 0;
        this.highScore = this.getHighScore(); // Voeg deze regel toe
        this.scoreLabel = null;
        this.highScoreLabel = null; // Voeg deze regel toe
        this.backgroundMusic = Resources.Muziek;
        this.gameOverMusic = Resources.GameOverMusic;

        // Start het game resource loading en initialisatie
        this.start(ResourceLoader).then(() => this.initializeGame());
    }

    getHighScore() {
        const storedHighScore = localStorage.getItem('highScore');
        return storedHighScore ? parseInt(storedHighScore, 10) : 0;
    }

    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore.toString()); // Sla de nieuwe highscore op in localStorage
            this.updateHighScoreLabel(); // Update het highscore label
        }
    }

    initializeGame() {
        // Voeg de begin- en hoofdscène toe
        this.addScenes();

        // Ga naar de BeginScene
        this.goToScene('begin');

        // Start playing background music
        if (this.backgroundMusic) {
            this.backgroundMusic.loop = true;
            this.backgroundMusic.play();
        }
    }

    addScenes() {
        // Voeg de begin- en hoofdscène alleen toe als ze nog niet bestaan
        if (!this.scenes['begin']) {
            const beginScene = new BeginScene(this);
            this.add('begin', beginScene);
        }
    
        if (!this.scenes['main']) {
            const mainScene = new Scene();
            mainScene.onInitialize = this.setupMainScene.bind(this);
            this.add('main', mainScene);
        }

        if (!this.scenes['options']) {
            const optionsScene = new OptionsScene(this);
            this.add('options', optionsScene);
        }
        if (!this.scenes['Intro']) {
            const introSceneInstance = new IntroScene(this); // Changed variable name to introSceneInstance
            this.add('Intro', introSceneInstance); // Use the new variable name here
        }
        
    }

    setupMainScene(engine) {
        console.log("Start de game!");

        // Laad de tilemap en voeg achtergrond toe
        Resources.Tilemap.load().then(() => {
            this.createBackground();

            this.tilemap = Resources.Tilemap;
            Resources.Tilemap.addToScene(this.currentScene);

            this.player = new Player(this.tilemap, this);
            this.add(this.player);

            engine.input.keyboard.on('press', (evt) => {
                if (evt.key === Input.Keys.Space && this.player.canJump) {
                    this.player.jump();
                }
            });

            this.currentScene.camera.strategy.lockToActorAxis(this.player, Axis.X);
            this.currentScene.camera.pos.x = this.player.pos.x;
            this.currentScene.camera.zoom = 1.2;

            this.backgroundMusic.loop = true;
            this.backgroundMusic.play();

            const font = new Font({
                size: 40,
                family: 'Arial',
                color: Color.Black,
            });

            // Score label
            this.scoreLabel = new Label({
                pos: new Vector(150, 50),
                text: 'Score: 0',
                font,
                coordPlane: CoordPlane.Screen
            });
            this.scoreLabel.name = 'score';

            this.add(this.scoreLabel);

            // Highscore label
            this.highScoreLabel = new Label({
                pos: new Vector(1550, 50), // Rechtsboven positie
                text: 'Highscore: ' + this.highScore, // Toon de highscore
                font,
                coordPlane: CoordPlane.Screen
            });
            this.highScoreLabel.name = 'highscore';

            this.add(this.highScoreLabel);

            this.updateScoreLabel(); // Update beide labels bij het initialiseren van de main scene
            this.updateHighScoreLabel(); // Zorg ervoor dat de highscore correct wordt weergegeven
        });
    }

    updateScoreLabel() {
        if (this.scoreLabel) {
            this.scoreLabel.text = 'Score: ' + this.score;
        }
        if (this.highScoreLabel) {
            this.highScoreLabel.text = 'Highscore: ' + this.highScore;
        }
    }

    stopScore() {
        if (this.player && !this.player.isMovingRight) {
            return;
        }
    }

    createBackground() {
        this.backgrounds.forEach(bg => this.remove(bg));
        this.backgrounds = [];

        const background1 = new Actor({
            pos: new Vector(this.halfDrawWidth, this.halfDrawHeight),
            width: this.drawWidth,
            height: this.drawHeight,
            z: -1,
        });
        background1.graphics.use(Resources.Background.toSprite());

        const background2 = new Actor({
            pos: new Vector(this.halfDrawWidth + this.drawWidth, this.halfDrawHeight),
            width: this.drawWidth,
            height: this.drawHeight,
            z: -1
        });
        background2.graphics.use(Resources.Background.toSprite());

        const background3 = new Actor({
            pos: new Vector(this.halfDrawWidth + 2 * this.drawWidth, this.halfDrawHeight),
            width: this.drawWidth,
            height: this.drawHeight,
            z: -1
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
        if (this.scoreLabel) {
            this.scoreLabel.text = 'Score: ' + this.score;
        }
    }

    onPostUpdate(engine, delta) {
        super.onPostUpdate(engine, delta);
    
        if (this.player && this.player.pos.x > this.player.previousX) {
            this.increaseScore();
        }
    }

    onPreUpdate(engine, delta) {
        super.onPreUpdate(engine, delta);
        this.updateBackgrounds();
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

    async resetGame() {
        // Reset score
        this.resetScore();
    
        // Ga naar BeginScene
        await this.goToScene('begin');
    
        // Recreate background
        this.createBackground();
    
        // Reset player if exists
        if (this.player) {
            this.player.reset();
        }
    
        // Resume background music if it was playing
        if (this.backgroundMusic) {
            this.backgroundMusic.loop = true;
            this.backgroundMusic.play();
        }
    }

    showGameOverScene() {
        // Pauzeer en reset de achtergrondmuziek
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }

        // Speel game over muziek
        if (this.gameOverMusic) {
            this.gameOverMusic.loop = false;
            this.gameOverMusic.play();
        }

        // Verwijder bestaande gameOver scene als die er is
        if (this.scenes['gameOver']) {
            this.removeScene('gameOver');
        }

        // Maak een nieuwe gameOver scene met de huidige score
        const gameOverScene = new GameOverScene(this.score, this);
        this.addScene('gameOver', gameOverScene);

        // Ga naar de gameOver scene
        this.goToScene('gameOver');

        // Update de highscore voor het resetten van de score
        this.updateHighScore();
        this.updateHighScoreLabel(); // Voeg dit toe om de highscore label bij te werken

        // Reset de score voor het volgende spel
        this.resetScore();
    }

    updateHighScoreLabel() {
        if (this.highScoreLabel) {
            this.highScoreLabel.text = 'Highscore: ' + this.highScore;
        }
    }
}

const gameInstance = new Game();