import { Scene, Vector, Actor, Animation, SpriteSheet } from 'excalibur';
import { Resources } from './resources';

export class IntroScene extends Scene {
    constructor(game) {
        super();
        this.game = game;
    }

    onInitialize(engine) {
        // Sprite sheet en animatie voor een geanimeerde startknop (niet gebruikt als startknop hieronder)
        const playerSpriteSheet = SpriteSheet.fromImageSource({
            image: Resources.Bus,
            grid: {
                rows: 8,  // Aantal rijen in je sprite sheet
                columns: 1,  // Aantal kolommen in je sprite sheet
                spriteWidth: 768,  // Breedte van elke sprite in pixels
                spriteHeight: 192  // Hoogte van elke sprite in pixels
            }
        });
        

        const walkAnimation = Animation.fromSpriteSheet(playerSpriteSheet, this.range(0, 7), 200);
        walkAnimation.scale = new Vector(2, 2);

        // Maak een actor voor de startknop en voeg de animatie toe
        const startButton = new Actor({
            pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2 + 10),
            anchor: new Vector(0.5, 0.5)
        });
        startButton.graphics.use(walkAnimation);
        this.add(startButton);

        // Start de animatie
        walkAnimation.play(); // Start de animatie direct

        // Bepaal de duur van de animatie in milliseconden
        const animationDuration = 7 * 230; // 6 frames * 100 ms per frame

        // Wacht tot de animatie is afgelopen en ga dan door naar de volgende scène
        setTimeout(() => {
            // Hier kan je de game starten door naar de volgende scène te gaan
            this.game.goToScene('main'); // Vervang dit door je eigen logica om naar de volgende scène te gaan
        }, animationDuration);

        console.log(Resources.Bus); 
    }

    

    // Helper functie om een range van nummers te genereren
    range(start, end) {
        return Array.from({ length: end - start + 1 }, (_, i) => i + start);
    }
}
