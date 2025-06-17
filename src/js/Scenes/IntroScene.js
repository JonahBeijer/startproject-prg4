import { Scene, Vector, Actor, Animation, SpriteSheet } from 'excalibur';
import { Resources } from '../Recources/resources';

export class IntroScene extends Scene {
    // We slaan referenties op naar de dingen die we moeten aansturen
    sceneTimer = null;
    busAnimation = null;

    constructor(game) {
        super();
        this.game = game;
    }

    onInitialize(engine) {
        // --- SETUP DIE MAAR ÉÉN KEER HOEFT ---

        // 1. Maak de animatie en sla de referentie op
        const busSpriteSheet = SpriteSheet.fromImageSource({
            image: Resources.Bus,
            grid: { rows: 8, columns: 1, spriteWidth: 768, spriteHeight: 192 }
        });
        
        // Sla de animatie op in 'this' zodat we hem later kunnen resetten
        this.busAnimation = Animation.fromSpriteSheet(busSpriteSheet, this.range(0, 7), 200);
        this.busAnimation.scale = new Vector(2, 2);
        this.busAnimation.loop = false;

        // 2. Maak de actor en wijs de animatie toe
        const busActor = new Actor({
            pos: new Vector(engine.halfDrawWidth, engine.halfDrawHeight + 10),
            anchor: new Vector(0.5, 0.5)
        });
        busActor.graphics.use(this.busAnimation);
        this.add(busActor);
    }

    onActivate() {
        // --- LOGICA DIE ELKE KEER MOET DRAAIEN ---
        console.log("IntroScene geactiveerd.");

        // FIX 1: Reset de animatie, zodat hij altijd opnieuw afspeelt.
        if (this.busAnimation) {
            this.busAnimation.reset();
        }
        
        // FIX 2: Gebruik de CORRECTE duur voor de timer.
        // 8 frames * 200 milliseconden per frame = 1600 ms
        const animationDuration = 8 * 200;

        // Start de timer
        this.sceneTimer = setTimeout(() => {
            console.log("Timer afgelopen, ga naar MainScene.");
            this.game.goToScene('main');
        }, animationDuration);
    }

    onDeactivate() {
        // Ruim de timer op als we de scene verlaten. Dit is nog steeds een goede gewoonte.
        console.log("IntroScene gedeactiveerd, timer wordt opgeruimd.");
        if (this.sceneTimer) {
            clearTimeout(this.sceneTimer);
        }
    }

    range(start, end) {
        return Array.from({ length: end - start + 1 }, (_, i) => i + start);
    }
}