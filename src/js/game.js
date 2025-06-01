import '../css/style.css';
import { Engine, Vector, Input, Axis, Label, Color, Scene, Actor, DisplayMode, CoordPlane, Font, CollisionType } from 'excalibur';
import { Resources, ResourceLoader } from './resources.js';
import { Player } from './player.js';
import { GameOverScene } from './gameOverScene';
import { BeginScene } from './BeginScene.js';
import { OptionsScene } from './OptionsScene.js';
import { IntroScene } from './IntroScene.js';
import { Coin } from './coin.js';

class Game extends Engine {
    
    constructor() {
        super({
            width: 1920,
            height: 1080,
            displayMode: DisplayMode.FitScreen,
            fixedUpdateFps: 60,
            backgroundColor: Color.White
        });
        
        this.backgrounds = [];
        this.score = 0;
        this.highScore = this.getHighScore();
        this.scoreLabel = null;
        this.highScoreLabel = null;
        this.backgroundMusic = Resources.Muziek;
        this.gameOverMusic = Resources.GameOverMusic;
        this.coinPositions = []; // Bewaar coin posities hier
        this.coinLayer = null; // Referentie naar de coin laag

        this.start(ResourceLoader).then(() => this.initializeGame());
    }

    getHighScore() {
        const storedHighScore = localStorage.getItem('highScore');
        return storedHighScore ? parseInt(storedHighScore, 10) : 0;
    }

    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore.toString());
            this.updateHighScoreLabel();
        }
    }

    initializeGame() {
        this.addScenes();
        this.goToScene('begin');

        if (this.backgroundMusic) {
            this.backgroundMusic.loop = true;
            this.backgroundMusic.play();
        }
    }

    addScenes() {
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
            const introSceneInstance = new IntroScene(this);
            this.add('Intro', introSceneInstance);
        }
    }

    setupMainScene(engine) {
        console.log("Start de game!");

        Resources.Tilemap.load().then(() => {
            this.createBackground();
            this.tilemap = Resources.Tilemap;
            Resources.Tilemap.addToScene(this.currentScene);

            // Bewaar de coin posities
            this.coinPositions = [];
            
            // Find coin layer
            let coinLayer;
            const findLayer = (layers) => {
                return layers.find(layer => 
                    layer.name.toLowerCase().includes('coin') || 
                    layer.name.toLowerCase().includes('collect') ||
                    layer.type === 'objectgroup'
                );
            };

            if (this.tilemap.layers) {
                coinLayer = findLayer(this.tilemap.layers);
            } else if (this.tilemap.data && this.tilemap.data.layers) {
                coinLayer = findLayer(this.tilemap.data.layers);
            } else if (this.tilemap.tiledMap && this.tilemap.tiledMap.layers) {
                coinLayer = findLayer(this.tilemap.tiledMap.layers);
            }

            // Bewaar coin layer voor later gebruik
            this.coinLayer = coinLayer;

            // Add coins
            if (coinLayer && coinLayer.objects) {
                console.log(`Found coin layer: ${coinLayer.name}`);
                
                coinLayer.objects.forEach(coinObject => {
                    if ((coinObject.class === 'coin' || coinObject.type === 'coin' || 
                         coinObject.name === 'coin') && 
                        coinObject.visible !== false) {
                        const coinPos = new Vector(
                            coinObject.x + (coinObject.width || 32) / 2,
                            coinObject.y + (coinObject.height || 32) / 2
                        );
                        
                        // Bewaar positie
                        this.coinPositions.push(coinPos);
                        
                        const coin = new Coin(coinPos, this);
                        this.currentScene.add(coin);
                    }
                });
            } else {
                console.warn("No coin layer found. Creating test coin...");
                const testCoinPos = new Vector(1300, 384);
                this.coinPositions.push(testCoinPos);
                const testCoin = new Coin(testCoinPos, this);
                this.currentScene.add(testCoin);
            }

            this.player = new Player(this.tilemap, this);
            this.currentScene.add(this.player);

            engine.input.keyboard.on('press', (evt) => {
                if (evt.key === Input.Keys.Space && this.player.canJump) {
                    this.player.jump();
                }
            });

            this.currentScene.camera.strategy.lockToActorAxis(this.player, Axis.X);
            this.currentScene.camera.pos.x = this.player.pos.x;
            this.currentScene.camera.zoom = 1.2;

            if (this.backgroundMusic) {
                this.backgroundMusic.loop = true;
                this.backgroundMusic.play();
            }

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
            this.currentScene.add(this.scoreLabel);

            this.highScoreLabel = new Label({
                pos: new Vector(1550, 50),
                text: 'Highscore: ' + this.highScore,
                font,
                coordPlane: CoordPlane.Screen
            });
            this.highScoreLabel.name = 'highscore';
            this.currentScene.add(this.highScoreLabel);

            this.updateScoreLabel();
            this.updateHighScoreLabel();
        });
    }

    // Reset alle coins
    resetCoins() {
        // Verwijder bestaande coins
        const coins = this.currentScene.actors.filter(actor => actor instanceof Coin);
        coins.forEach(coin => coin.kill());
        
        // Maak nieuwe coins aan op de originele posities
        this.coinPositions.forEach(pos => {
            const coin = new Coin(pos.clone(), this);
            this.currentScene.add(coin);
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
        this.backgrounds.forEach(bg => this.currentScene.remove(bg));
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

        this.currentScene.add(background1);
        this.currentScene.add(background2);
        this.currentScene.add(background3);

        this.backgrounds = [background1, background2, background3];
    }

    increaseScore() {
        this.score += 1;
        this.updateScoreLabel();
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
        this.resetScore();
        await this.goToScene('begin');
        this.createBackground();
    
        if (this.player) {
            this.player.reset();
        }
        
        // Reset coins bij herstart
        this.resetCoins();
    
        if (this.backgroundMusic) {
            this.backgroundMusic.loop = true;
            this.backgroundMusic.play();
        }
    }

    showGameOverScene() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }

        if (this.gameOverMusic) {
            this.gameOverMusic.loop = false;
            this.gameOverMusic.play();
        }

        if (this.scenes['gameOver']) {
            this.removeScene('gameOver');
        }

        const gameOverScene = new GameOverScene(this.score, this);
        this.addScene('gameOver', gameOverScene);
        this.goToScene('gameOver');

        this.updateHighScore();
        this.updateHighScoreLabel();
        this.resetScore();
    }

    updateHighScoreLabel() {
        if (this.highScoreLabel) {
            this.highScoreLabel.text = 'Highscore: ' + this.highScore;
        }
    }
}

const gameInstance = new Game();