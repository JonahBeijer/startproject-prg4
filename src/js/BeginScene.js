// BeginScene.js
import { Scene, Label, Color, Vector, Loader, Sprite } from 'excalibur';
import { Resources } from './resources';

export class BeginScene extends Scene {
    constructor(game) {
        super();
        this.game = game;
    }

    onInitialize(engine) {
        const title = new Label({
            text: 'Pinkie',
            pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 4),
            color: Color.Pink,
            textAlign: 'center',
            fontSize: 60,
            fontFamily: 'Arial',
        });

        const startButton = new Label({
            text: 'Start Game',
            pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2),
            color: Color.White,
            fontSize: 20,
            fontFamily: 'Arial',
        });

        startButton.on('pointerup', () => {
            this.game.goToScene('main');
        });

        // Maak een nieuwe Loader
        const loader = new Loader();

        // Voeg de bron toe aan de loader
        // Voeg de bron toe aan de loader
    loader.addResource(Resources.PixelYe); 

    // Laad de bronnen
    loader.load().then(() => {
        // Maak een sprite van de geladen bron
        const playerSprite = new Sprite(Resources.PixelYe);

        // Plaats de sprite in het midden van het scherm
        playerSprite.pos = new Vector(engine.drawWidth / 2, engine.drawHeight / 2);

        // Voeg de sprite toe aan de scene
        this.add(playerSprite);
    }).catch((error) => {
        console.error('Error loading resources:', error);
    });

        

        this.add(title);
        this.add(startButton);
    }
}
