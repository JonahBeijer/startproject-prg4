import '../css/style.css';
import { Engine, Vector, Input, Axis, Label, Color, Scene, Actor, DisplayMode, CoordPlane, Font } from 'excalibur'; // Voeg Actor toe
import { Resources, ResourceLoader } from './resources.js';
import { Player } from './player.js';
import { GameOverScene } from './gameOverScene';
import { BeginScene } from './BeginScene.js'; // Importeer de BeginScene
class Game extends Engine {

    constructor() {
        super({ 
            width: 1920,
            height: 1080,
            displayMode: DisplayMode.FitScreen,
            fixedUpdateFps: 60 // more consistent physics simulation, guarantees 60 fps worth of updates
        });
        this.backgrounds = [];
        this.score = 0;
        this.scoreLabel = null;
        this.backgroundMusic = Resources.Muziek;
        this.gameOverMusic = Resources.GameOverMusic;
        // Start het game resource loading en initialisatie
        this.start(ResourceLoader).then(() => this.initializeGame());
    }
    initializeGame() {
        // Voeg de begin- en hoofdscène toe
        this.addScenes();
        // Ga naar de BeginScene
        this.goToScene('begin');
    }
    addScenes() {
        const beginScene = new BeginScene(this);
        this.add('begin', beginScene);
        const mainScene = new Scene();
        mainScene.onInitialize = this.setupMainScene.bind(this); // Stel de main game scène in
        this.add('main', mainScene);
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
            this.backgroundMusic.loop = true;
            this.backgroundMusic.play();

            const font = new Font({
                size: 40,
                family: 'Arial',
                color: Color.Black,
            });
            this.scoreLabel = new Label({
                pos: new Vector(150, 50),
                text: 'Score: 0',
                font,
                coordPlane: CoordPlane.Screen
            });
            this.scoreLabel.name = 'score';

            this.add(this.scoreLabel);
            this.updateScoreLabel();
        });
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
        
        if (this.player) {
            if (this.player.pos.x > this.player.previousX) {
                this.increaseScore();
            }
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
        // Huidige scène leegmaken
        // this.currentScene.clear();

        // Score resetten
        this.resetScore();


        // this.createBackground();

        // Spel opnieuw starten door hoofdscène opnieuw in te stellen
        // this.addScenes();

        // GOTO is async
        await this.goToScene('begin');

        // Achtergrond opnieuw maken
        this.createBackground();

        // De speler opnieuw instellen
        if (this.player) {
            this.player.reset();
        }
    }
    
    showGameOverScene() {
        if (!this.scenes['gameOver']) {
            if (this.backgroundMusic) {
                this.backgroundMusic.pause();
                this.backgroundMusic.currentTime = 0;
            }
            this.gameOverMusic = new Audio('images/gameovermuziek.mp3');
            this.gameOverMusic.loop = false;
            this.gameOverMusic.play();
            const gameOverScene = new GameOverScene(this.score, this);
            this.addScene('gameOver', gameOverScene);
        }
