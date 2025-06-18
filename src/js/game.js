import { Engine, DisplayMode, Color } from 'excalibur';
import { Resources, ResourceLoader } from './Recources/resources.js';
import { BeginScene } from './Scenes/BeginScene.js';
import { OptionsScene } from './Scenes/OptionsScene.js'; 
import { IntroScene } from './Scenes/IntroScene.js';
import { MainScene } from './Scenes/mainScene.js';
import { GameOverScene } from './Scenes/gameOverScene.js';
import { AudioManager } from './Audio/audioManager.js'; 

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
        this.audioManager = new AudioManager();
    }

    start() {
        this.addScenes();
        return super.start(ResourceLoader).then(() => this.initializeGame());
    }

    initializeGame() {
        this.goToScene('begin');

        this.audioManager.playMusic('background');
    }

    addScenes() {
        this.add('begin', new BeginScene(this));
        this.add('options', new OptionsScene(this));
        this.add('Intro', new IntroScene(this));
        this.add('main', new MainScene(this));
    }

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
    

    resetScore() {
        this.score = 0;
        if (this.currentScene instanceof MainScene) {
            this.currentScene.ui.updateScore(this.score);
        }
    }

    showGameOverScene() {
        this.updateHighScore();

        this.audioManager.playMusic('gameover');
        
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
        
        this.audioManager.playMusic('background');
    }
}