import { Actor, CollisionType, Vector } from 'excalibur';
import { Resources } from './resources';

export class Coin extends Actor {
  constructor(pos, game) {
    super({
      pos: pos,
      width: 32,
      height: 32,
      collisionType: CollisionType.Passive
    });

    this.game = game;
    this.graphics.use(Resources.Coin.toSprite());
    
    // Debug: log coin creation
    console.log(`Coin created at ${pos.toString()}`);
  }

  onInitialize() {
    // Debug: log collision setup
    console.log(`Coin initialized at ${this.pos.toString()}`);
    
    this.on('collisionstart', (evt) => {
      console.log(`Coin collision detected with ${evt.other.name || evt.other.constructor.name}`);
      
      if (evt.other.hasTag('player')) {
        console.log("Player collected coin!");
        this.game.score += 1000;
        this.game.updateScoreLabel();
        this.kill();
      }
    });
  }
}