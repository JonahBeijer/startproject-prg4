import { Engine, DisplayMode, Color } from 'excalibur';
import { Resources, ResourceLoader } from './Recources/resources.js';
import { BeginScene } from './Scenes/BeginScene.js';
import { OptionsScene } from './Scenes/OptionsScene.js'; // Aangenomen dat dit bestand bestaat
import { IntroScene } from './Scenes/IntroScene.js';
import { MainScene } from './Scenes/mainScene.js';
import { GameOverScene } from './Scenes/gameOverScene.js'; // Aangenomen dat dit bestand bestaat

export class Game extends Engine {

    constructor() {
        super({
            width: 1920,
            height: 1080,
            displayMode: DisplayMode.FitScreen,
            fixedUpdateFps: 60,
            backgroundColor: Color.White
        });

        this.score = 0;
        this.highScore = this.getHighScore();
        this.backgroundMusic = Resources.Muziek;
        this.gameOverMusic = Resources.GameOverMusic;
    }

    /**
     * Start de resource loader en initialiseer daarna het spel.
     */
    start() {
        this.addScenes();
        return super.start(ResourceLoader).then(() => this.initializeGame());
    }

    initializeGame() {
        this.goToScene('begin');

        if (this.backgroundMusic) {
            this.backgroundMusic.loop = true;
            this.backgroundMusic.play();
        }
    }

    addScenes() {
        this.add('begin', new BeginScene(this));
        this.add('options', new OptionsScene(this));
        this.add('Intro', new IntroScene(this));
        this.add('main', new MainScene(this));
    }

    // --- Score Management ---
    getHighScore() {
        return parseInt(localStorage.getItem('highScore') || '0', 10);
    }

    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore.toString());
        }
    }

    increaseScore(amount = 1) {
        this.score += amount;
        if (this.currentScene instanceof MainScene) {
            this.currentScene.ui.updateScore(this.score);
        }
    }
    
    stopScore() {
      
    }

    resetScore() {
        this.score = 0;
        if (this.currentScene instanceof MainScene) {
            this.currentScene.ui.updateScore(this.score);
        }
    }

    showGameOverScene() {
        this.updateHighScore();

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
        this.add('gameOver', gameOverScene);
        this.goToScene('gameOver');
    }

    async resetGame() {
        this.resetScore();
        await this.goToScene('main');
        
        if (this.backgroundMusic) {
            this.backgroundMusic.loop = true;
            this.backgroundMusic.play();
        }
    }
}