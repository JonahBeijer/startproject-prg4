import { Scene, Label, Color, Vector, CoordPlane, TextAlign, Font } from 'excalibur';

export class GameOverScene extends Scene {
    constructor(score, game) {
        super();
        this.score = score;
        this.game = game;
        this.handleRestart = this.handleRestart.bind(this);
    }

    handleRestart() {
        this.game.resetGame();
        this.game.goToScene('main'); // Start het spel opnieuw na reset
    }

    onInitialize(engine) {
        const gameOverLabel = new Label({
            text: 'Game Over',
            pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2 - 50),
            font: new Font({
                color: Color.Red,
                size: 48,
                textAlign: TextAlign.Center,
                family: 'Arial',
            }),
            coordPlane: CoordPlane.Screen
        });
        this.add(gameOverLabel);

        const scoreLabel = new Label({
            text: 'Score: ' + this.score,
            pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2),
            font: new Font({
                color: Color.White,
                size: 36,
                textAlign: TextAlign.Center,
                family: 'Arial',
            }),
            coordPlane: CoordPlane.Screen
        });
        this.add(scoreLabel);

        const restartLabel = new Label({
            text: 'Klik om opnieuw te starten',
            pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2 + 50),
            font: new Font({
                color: Color.White,
                size: 24,
                textAlign: TextAlign.Center,
                family: 'Arial',
            }),
            coordPlane: CoordPlane.Screen
        });
        this.add(restartLabel);

     
    }

    onActivate() {
        // Add the event listener when the scene is activated
        this.engine.input.pointers.primary.on('down', this.handleRestart);
    }

    onDeactivate() {
        // Remove the event listener when the scene is deactivated
        this.engine.input.pointers.primary.off('down', this.handleRestart);
    }
}
