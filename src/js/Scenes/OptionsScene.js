import { Scene, Label, Color, Vector, CoordPlane, Font, Actor, Rectangle, Sprite, SpriteSheet, Animation } from 'excalibur';
import { Resources } from '../Recources/resources';

export class OptionsScene extends Scene {
    constructor(game) {
        super();
        this.game = game;
        this.volume = 0.5; // Initial volume
        this.backgroundMusic = game.backgroundMusic;
        this.gameoverMusic = game.gameoverMusic
    }

    onInitialize(engine) {
        // Voeg range functie toe
        function range(start, end) {
            return Array.from({ length: end - start + 1 }, (_, i) => i + start);
        }

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
            pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2 - 150),
            anchor: new Vector(0.5, 0.5)
        });

        startButton.graphics.use(walkAnimation);
        this.add(startButton);

        walkAnimation.play(); 

        const savedVolume = localStorage.getItem('volume');
        if (savedVolume !== null) {
            this.volume = parseFloat(savedVolume);
            this.backgroundMusic.volume = this.volume;
            
        }

        const volumeLabel = new Label({
            text: 'Volume: ' + Math.round(this.volume * 100) + '%',
            pos: new Vector(engine.drawWidth / 2 - 80, engine.drawHeight / 2 + 60),
            font: new Font({
                size: 30,
                family: 'Arial',
                color: Color.Black,
            }),
            coordPlane: CoordPlane.Screen
        });
        this.add(volumeLabel);

        const volumeBarBackground = new Actor({
            pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2 + 40),
            anchor: new Vector(0.5, 0.5)
        });
        volumeBarBackground.graphics.use(new Rectangle({
            width: 300,
            height: 20,
            color: Color.Gray
        }));
        this.add(volumeBarBackground);

        const volumeBarFill = new Actor({
            pos: new Vector(engine.drawWidth / 2 - 150, engine.drawHeight / 2 + 40),
            anchor: new Vector(0.0, 0.5)
        });
        const volumeFillRectangle = new Rectangle({
            width: this.volume * 300,
            height: 20,
            color: Color.fromHex('#d840fb') 
        });
        volumeBarFill.graphics.use(volumeFillRectangle);
        this.add(volumeBarFill);

        const increaseVolumeButton = new Label({
            text: '+',
            pos: new Vector(engine.drawWidth / 2 + 170, engine.drawHeight / 2 + 25),
            font: new Font({
                size: 30,
                family: 'Arial',
                color: Color.Black,
            }),
            coordPlane: CoordPlane.Screen
        });
        increaseVolumeButton.on('pointerup', () => {
            this.volume = Math.min(1, this.volume + 0.1);
            this.backgroundMusic.volume = this.volume;
            volumeLabel.text = 'Volume: ' + Math.round(this.volume * 100) + '%';
            volumeFillRectangle.width = this.volume * 300;
            localStorage.setItem('volume', this.volume.toString());
        });
        this.add(increaseVolumeButton);

        const decreaseVolumeButton = new Label({
            text: '-',
            pos: new Vector(engine.drawWidth / 2 - 185, engine.drawHeight / 2 + 25),
            font: new Font({
                size: 30,
                family: 'Arial',
                color: Color.Black,
            }),
            coordPlane: CoordPlane.Screen
        });
        decreaseVolumeButton.on('pointerup', () => {
            this.volume = Math.max(0, this.volume - 0.1);
            this.backgroundMusic.volume = this.volume;
            volumeLabel.text = 'Volume: ' + Math.round(this.volume * 100) + '%';
            volumeFillRectangle.width = this.volume * 300;
            localStorage.setItem('volume', this.volume.toString());
        });
        this.add(decreaseVolumeButton);

        // Home button sprite
        const homeSprite = new Sprite({
            image: Resources.Home,
            destSize: { width: 300, height: 75 }
        });
        const homeHoverSprite = new Sprite({
            image: Resources.HomeSelect,
            destSize: { width: 300, height: 75 }
        });

        // Create home button actor
        const home = new Actor({
            pos: new Vector(engine.drawWidth / 2 + 40, engine.drawHeight / 2 + 260),
            anchor: new Vector(0.5, 0.5)
        });
        home.graphics.use(homeSprite);
        this.add(home);

        // Event handler for clicking home button
        home.on('pointerup', () => {
            this.game.goToScene('begin');
        });

        // Event handlers for hover and leave events
        home.on('pointerenter', () => {
            home.graphics.use(homeHoverSprite);
        });

        home.on('pointerleave', () => {
            home.graphics.use(homeSprite);
        });
    }
}
