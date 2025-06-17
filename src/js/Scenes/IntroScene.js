import { Scene, Vector, Actor, Animation, SpriteSheet } from 'excalibur';
import { Resources } from '../Recources/resources';

export class IntroScene extends Scene {
    sceneTimer = null;
    busAnimation = null;

    constructor(game) {
        super();
        this.game = game;
    }

    onInitialize(engine) {
       
        const busSpriteSheet = SpriteSheet.fromImageSource({
            image: Resources.Bus,
            grid: { rows: 8, columns: 1, spriteWidth: 768, spriteHeight: 192 }
        });
        
        this.busAnimation = Animation.fromSpriteSheet(busSpriteSheet, this.range(0, 7), 200);
        this.busAnimation.scale = new Vector(2, 2);
        this.busAnimation.loop = false;

        
        const busActor = new Actor({
            pos: new Vector(engine.halfDrawWidth, engine.halfDrawHeight + 10),
            anchor: new Vector(0.5, 0.5)
        });
        busActor.graphics.use(this.busAnimation);
        this.add(busActor);
    }

    onActivate() {
        console.log("IntroScene geactiveerd.");

        if (this.busAnimation) {
            this.busAnimation.reset();
        }
        
        
        const animationDuration = 8 * 200;

        this.sceneTimer = setTimeout(() => {
            console.log("Timer afgelopen, ga naar MainScene.");
            this.game.goToScene('main');
        }, animationDuration);
    }

    onDeactivate() {
        console.log("IntroScene gedeactiveerd, timer wordt opgeruimd.");
        if (this.sceneTimer) {
            clearTimeout(this.sceneTimer);
        }
    }

    range(start, end) {
        return Array.from({ length: end - start + 1 }, (_, i) => i + start);
    }
}