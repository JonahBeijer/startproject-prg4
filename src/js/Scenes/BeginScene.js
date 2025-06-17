import { Scene, Vector, Actor, Animation, SpriteSheet, Sprite } from 'excalibur';
import { Resources } from '../Recources/resources';


export class BeginScene extends Scene {
    constructor(game) {
        super();
        this.game = game;
    }

    onInitialize(engine) {
        
                // Sprite sheet en animatie voor een geanimeerde startknop (niet gebruikt als startknop hieronder)
        const playerSpriteSheet = SpriteSheet.fromImageSource({
            image: Resources.PixelYe,
            grid: {
                rows: 1,
                columns: 6,
                spriteWidth: 32,
                spriteHeight: 32
            }
        });

        const walkAnimation = Animation.fromSpriteSheet(playerSpriteSheet, range(0, 5), 100);
        walkAnimation.scale = new Vector(3, 3);

        // Optioneel: Je zou de walkAnimation kunnen gebruiken voor een geanimeerde knop
        const startButton = new Actor({
            pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2 -150),
            anchor: new Vector(0.5, 0.5)
        });
        startButton.graphics.use(walkAnimation);
        this.add(startButton);


        // Definieer de sprites voor de standaard en hover statussen van de startknop
        const startknopSprite = new Sprite({
            image: Resources.GameStart,
            destSize: { width: 400, height: 100 }
        });

        const startknopHoverSprite = new Sprite({
            image: Resources.GameStartSelect,
            destSize: { width: 400, height: 100 }
        });

        // Maak de startknop actor
        const startknop = new Actor({
            pos: new Vector(engine.drawWidth / 2 + 20, engine.drawHeight / 2 + 30),
            anchor: new Vector(0.5, 0.5)
        });

        // Gebruik de standaard sprite voor de startknop
        startknop.graphics.use(startknopSprite);
        this.add(startknop);

        // Voeg een event handler toe voor wanneer de muis op de knop wordt losgelaten
        startknop.on('pointerup', () => {
            this.game.goToScene('Intro');
        });

        // Voeg event handlers toe voor hover en leave events
        startknop.on('pointerenter', () => {
            // Verander de afbeelding naar de hover afbeelding
            startknop.graphics.use(startknopHoverSprite);
        });

        startknop.on('pointerleave', () => {
            // Verander de afbeelding terug naar de standaard afbeelding
            startknop.graphics.use(startknopSprite);
        });

        // Definieer de sprites voor de standaard en hover statussen van de startknop
        const optionsSprite = new Sprite({
            image: Resources.Options,
            destSize: { width: 350, height: 85 }
        });

        const optionsHoverSprite = new Sprite({
            image: Resources.OptionsSelect,
            destSize: { width: 350, height: 85 }
        });

        // Maak de startknop actor
        const options = new Actor({
            pos: new Vector(engine.drawWidth / 2 + 20, engine.drawHeight / 2 + 210),
            anchor: new Vector(0.5, 0.5)
        });

        // Gebruik de standaard sprite voor de startknop
        options.graphics.use(optionsSprite);
        this.add(options);

        // Voeg een event handler toe voor wanneer de muis op de knop wordt losgelaten
        options.on('pointerup', () => {
            this.game.goToScene('options');
        });

        // Voeg event handlers toe voor hover en leave events
        options.on('pointerenter', () => {
            // Verander de afbeelding naar de hover afbeelding
            options.graphics.use(optionsHoverSprite);
        });

        options.on('pointerleave', () => {
            // Verander de afbeelding terug naar de standaard afbeelding
            options.graphics.use(optionsSprite);
        });



    }
}

// Helper functie om een range van nummers te genereren
function range(start, end) {
    return Array.from({ length: end - start + 1 }, (_, i) => i + start);
}
