// src/audioManager.js

import { Resources } from './Recources/resources.js';

export class AudioManager {
    constructor() {
        this.backgroundMusic = Resources.Muziek;
        this.gameOverMusic = Resources.GameOverMusic;
        this.jumpSound = Resources.JumpSound; // Aangenomen dat je een spring-geluid hebt

        this.backgroundMusic.loop = true;
    }

    playMusic(type) {
        if (type === 'background') {
            // Stop de game-over muziek als die nog speelt
            if (this.gameOverMusic.isPlaying()) {
                this.gameOverMusic.stop();
            }
            // Speel de achtergrondmuziek als die niet al speelt
            if (!this.backgroundMusic.isPlaying()) {
                this.backgroundMusic.play();
            }
        } else if (type === 'gameover') {
            // Stop de achtergrondmuziek
            if (this.backgroundMusic.isPlaying()) {
                this.backgroundMusic.stop();
            }
            // Speel de game-over muziek
            this.gameOverMusic.play();
        }
    }

    // Een aparte functie voor geluidseffecten is een goede gewoonte
    playSound(type) {
        if (type === 'jump' && this.jumpSound) {
            this.jumpSound.play();
        }
    }
}