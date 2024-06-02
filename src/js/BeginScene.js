// BeginScene.js
import { Scene, Label, Color, Input } from 'excalibur';

export class BeginScene extends Scene {
    constructor(game) {
        super();
        this.game = game;
    }

    onInitialize(engine) {
        const instructions = new Label({
            text: 'Druk op SPATIE om te beginnen',
            color: Color.White,
            textAlign: 'center'
        });
        instructions.pos.setTo(engine.drawWidth / 2, engine.drawHeight / 2);
        this.add(instructions);

        engine.input.keyboard.on('press', (evt) => {
            if (evt.key === Input.Keys.Space) {
                this.game.startGame(); // Start de game wanneer op de spatiebalk wordt gedrukt
            }
        });
    }
}
