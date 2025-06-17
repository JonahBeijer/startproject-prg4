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
        if (evt.other.hasTag('player')) {
            console.log("Munt verzameld!");
            
            this.game.increaseScore(1000);
            
            this.kill();
        }
    }
}