import { Actor, CollisionType, Vector } from 'excalibur';
import { Resources } from '../Recources/resources';

export class Coin extends Actor {
    constructor(pos, game) {
        super({
            pos: pos,
            width: 32,
            height: 32,
            collisionType: CollisionType.Passive
        });
        this.game = game;
    }

    onInitialize() {
        this.graphics.use(Resources.Coin.toSprite());
        this.on('collisionstart', (evt) => this.onCollision(evt));
    }

    onCollision(evt) {
        // Controleer of de botsing met de speler is
        if (evt.other.hasTag('player')) {
            console.log("Munt verzameld!");
            
            // FIX: Roep de centrale 'increaseScore' methode aan op het game-object.
            // Deze methode zorgt zelf voor het bijwerken van de data én de UI.
            this.game.increaseScore(1000);
            
            // Verwijder de munt uit het spel
            this.kill();
        }
    }
}