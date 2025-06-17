import { Actor, Vector } from 'excalibur';
import { Resources } from '../Recources/resources';

export class Background extends Actor {
    constructor() {
        super({
            pos: Vector.Zero,
            z: -1
        });
        this.backgroundActors = [];
        this.bgWidth = 0; // Sla de breedte hier op
    }

    onInitialize(engine) {
        const bgSprite = Resources.Background.toSprite();
        this.bgWidth = engine.drawWidth; 
        
        for (let i = 0; i < 3; i++) {
            const bgActor = new Actor({
                pos: new Vector(i * this.bgWidth + this.bgWidth / 2, engine.halfDrawHeight),
                width: this.bgWidth,
                height: engine.drawHeight,
            });
            bgActor.graphics.use(bgSprite);
            this.addChild(bgActor);
            this.backgroundActors.push(bgActor);
        }
    }

    update(playerX, screenWidth) {
        for (const bg of this.backgroundActors) {
            if (bg.pos.x + screenWidth / 2 < playerX - screenWidth) {
                bg.pos.x += this.backgroundActors.length * screenWidth;
            }
        }
    }

    reset(engine) {
        console.log("Achtergrond wordt gereset...");
        for (let i = 0; i < this.backgroundActors.length; i++) {
            const actor = this.backgroundActors[i];
            actor.pos.x = i * this.bgWidth + this.bgWidth / 2;
        }
    }
}