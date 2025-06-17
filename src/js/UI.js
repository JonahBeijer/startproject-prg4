import { Actor, Label, Vector, Color, Font, CoordPlane } from 'excalibur';

export class UI extends Actor {
    constructor() {
        super({
            pos: Vector.Zero,
            coordPlane: CoordPlane.Screen // Belangrijk voor UI!
        });
    }

    onInitialize(engine) {
        const font = new Font({
            size: 40,
            family: 'Arial',
            color: Color.Black,
        });

        this.scoreLabel = new Label({
            text: 'Score: 0',
            pos: new Vector(150, 50),
            font,
        });
        this.addChild(this.scoreLabel);

        this.highScoreLabel = new Label({
            text: 'Highscore: 0',
            pos: new Vector(engine.drawWidth - 150, 50),
            font,
            anchor: new Vector(1, 0) // Anker rechtsboven
        });
        this.addChild(this.highScoreLabel);
    }

    updateScore(score) {
        if (this.scoreLabel) {
            this.scoreLabel.text = `Score: ${score}`;
        }
    }

    updateHighScore(highScore) {
        if (this.highScoreLabel) {
            this.highScoreLabel.text = `Highscore: ${highScore}`;
        }
    }
}