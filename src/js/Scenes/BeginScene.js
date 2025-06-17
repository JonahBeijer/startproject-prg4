import { Scene, Vector, Actor, Animation, SpriteSheet, Sprite } from 'excalibur';
import { Resources } from '../Recources/resources';


export class BeginScene extends Scene {
    constructor(game) {
        super();
        this.game = game;
    }

    onInitialize(engine) {
        
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

        const startButton = new Actor({
            pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2 -150),
            anchor: new Vector(0.5, 0.5)
        });
        startButton.graphics.use(walkAnimation);
        this.add(startButton);


        const startknopSprite = new Sprite({
            image: Resources.GameStart,
            destSize: { width: 400, height: 100 }
        });

        const startknopHoverSprite = new Sprite({
            image: Resources.GameStartSelect,
            destSize: { width: 400, height: 100 }
        });

        const startknop = new Actor({
            pos: new Vector(engine.drawWidth / 2 + 20, engine.drawHeight / 2 + 30),
            anchor: new Vector(0.5, 0.5)
        });

        startknop.graphics.use(startknopSprite);
        this.add(startknop);

        startknop.on('pointerup', () => {
            this.game.goToScene('Intro');
        });

        startknop.on('pointerenter', () => {
            startknop.graphics.use(startknopHoverSprite);
        });

        startknop.on('pointerleave', () => {
            startknop.graphics.use(startknopSprite);
        });

        const optionsSprite = new Sprite({
            image: Resources.Options,
            destSize: { width: 350, height: 85 }
        });

        const optionsHoverSprite = new Sprite({
            image: Resources.OptionsSelect,
            destSize: { width: 350, height: 85 }
        });

        const options = new Actor({
            pos: new Vector(engine.drawWidth / 2 + 20, engine.drawHeight / 2 + 210),
            anchor: new Vector(0.5, 0.5)
        });

        options.graphics.use(optionsSprite);
        this.add(options);

        options.on('pointerup', () => {
            this.game.goToScene('options');
        });

        options.on('pointerenter', () => {
            options.graphics.use(optionsHoverSprite);
        });

        options.on('pointerleave', () => {
            options.graphics.use(optionsSprite);
        });



    }
}

function range(start, end) {
    return Array.from({ length: end - start + 1 }, (_, i) => i + start);
}
