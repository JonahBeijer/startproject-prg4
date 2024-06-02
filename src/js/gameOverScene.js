import { Scene, Label, Color, Vector } from 'excalibur';

export class GameOverScene extends Scene {
    constructor(score, game) {
        super();
        this.score = score;
        this.game = game;
        this.handleRestart = this.handleRestart.bind(this);
    }

    handleRestart() {
        this.game.resetGame();
    }

    onInitialize(engine) {
        const gameOverLabel = new Label({
            text: 'Game Over',
            pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2 - 50),
            fontSize: 48,
            color: Color.Red,
            textAlign: 'center'
        });
        this.add(gameOverLabel);

        const scoreLabel = new Label({
            text: 'Score: ' + this.score,
            pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2),
            fontSize: 36,
            color: Color.White,
            textAlign: 'center'
        });
        this.add(scoreLabel);

        const restartLabel = new Label({
            text: 'Klik om opnieuw te starten',
            pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2 + 50),
            fontSize: 24,
            color: Color.White,
            textAlign: 'center'
        });
        this.add(restartLabel);

        engine.input.pointers.primary.on('down', this.handleRestart);
    }

    onDeactivate() {
        this.engine.input.pointers.primary.off('down', this.handleRestart);
    }
}
