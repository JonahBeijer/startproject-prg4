import { Scene, Vector, Axis, Input } from 'excalibur';
import { Resources } from '../Recources/resources.js';
import { Player } from '../ACT0RS/player.js';
import { Coin } from '../ACT0RS/coin.js';
import { Background } from '../ACT0RS/background.js';
import { UI } from '../UI.js';

export class MainScene extends Scene {
    constructor(game) {
        super();
        this.game = game;
        this.coinPositions = [];
    }

    onInitialize(engine) {
        console.log("Start de game!");
        
        this.background = new Background();
        this.add(this.background);

        this.ui = new UI();
        this.add(this.ui);

        Resources.Tilemap.addToScene(this);
        
        this.extractCoinPositions();
        this.spawnCoins();

        this.player = new Player(Resources.Tilemap, this.game);
        this.add(this.player);
        
        this.camera.strategy.lockToActorAxis(this.player, Axis.X);
        this.camera.zoom = 1.2;

      
    }


    onActivate(context) {
        super.onActivate(context);
        this.game.resetScore();
        this.ui.updateHighScore(this.game.getHighScore());

        if (this.player) {
            this.player.reset();
            this.player.graphics.visible = true; 
        }

        if (this.background) {
            this.background.reset(context.engine);
        }

        this.spawnCoins();
    }

    onDeactivate(context) {
        super.onDeactivate(context);
        if (this.player) {
            this.player.graphics.visible = false;
        }
    }

    onPreUpdate(engine, delta) {
        if (this.player && this.background) {
            this.background.update(this.player.pos.x, engine.drawWidth);
        }
    }

    extractCoinPositions() {
        this.coinPositions = [];
        const findLayer = (layers) => {
            return layers.find(layer => 
                layer.name.toLowerCase().includes('coin') || 
                layer.name.toLowerCase().includes('collect') ||
                layer.type === 'objectgroup'
            );
        };
        let coinLayer;
        const tilemapResource = Resources.Tilemap;
        if (tilemapResource.layers) {
            coinLayer = findLayer(tilemapResource.layers);
        } else if (tilemapResource.data && tilemapResource.data.layers) {
            coinLayer = findLayer(tilemapResource.data.layers);
        } else if (tilemapResource.tiledMap && tilemapResource.tiledMap.layers) {
            coinLayer = findLayer(tilemapResource.tiledMap.layers);
        }
        if (coinLayer && coinLayer.objects) {
            console.log(`Flexibele zoekopdracht vond de laag: ${coinLayer.name}`);
            coinLayer.objects.forEach(coinObject => {
                if ((coinObject.class === 'coin' || coinObject.type === 'coin' || coinObject.name === 'coin') && coinObject.visible !== false) {
                    const coinPos = new Vector(
                        coinObject.x + (coinObject.width || 32) / 2,
                        coinObject.y + (coinObject.height || 32) / 2
                    );
                    this.coinPositions.push(coinPos);
                }
            });
        } 
        if (this.coinPositions.length === 0) {
            const testCoinPos = new Vector(1300, 384);
            this.coinPositions.push(testCoinPos);
        }
    }

    spawnCoins() {
        this.actors.filter(actor => actor instanceof Coin).forEach(coin => coin.kill());
        for (const pos of this.coinPositions) {
            this.add(new Coin(pos.clone(), this.game));
        }
    }
}