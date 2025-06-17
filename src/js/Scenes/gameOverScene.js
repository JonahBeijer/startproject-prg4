import { Scene, Label, Color, Vector, Actor, TextAlign, Font, Sprite } from 'excalibur';
import { Resources } from '../Recources/resources.js';

export class GameOverScene extends Scene {
    constructor(score, game) {
        super();
        this.score = score;
        this.game = game;
    }

    onInitialize(engine) {
        const centerX = engine.halfDrawWidth;
        const centerY = engine.halfDrawHeight;
        const buttonSpacing = 120;

        const background = new Actor({
            pos: new Vector(centerX, centerY),
            anchor: new Vector(0.5, 1.0) 
        });
        background.graphics.use(Resources.Gameover.toSprite());
        this.add(background);
        
        const scoreLabel = new Label({
            text: 'Jouw Score: ' + this.score,
            pos: new Vector(centerX, centerY + 50),
            font: new Font({
                color: Color.Black, 
                size: 48,
                textAlign: TextAlign.Center,
                family: 'Arial',
                bold: true
            }),
        });
        this.add(scoreLabel);

      
        const retrySprite = new Sprite({
            image: Resources.Retry,
            destSize: { width: 350, height: 85 }
        });

        const retryHoverSprite = new Sprite({
            image: Resources.RetrySelect,
            destSize: { width: 350, height: 85 }
        });

        const retryButton = new Actor({
            pos: new Vector(centerX, centerY + buttonSpacing),
            anchor: new Vector(0.4, -0.3)
        });

        retryButton.graphics.use(retrySprite);
        this.add(retryButton);

        retryButton.on('pointerup', () => {
            this.game.resetGame();
        });
        retryButton.on('pointerenter', () => {
            retryButton.graphics.use(retryHoverSprite);
        });
        retryButton.on('pointerleave', () => {
            retryButton.graphics.use(retrySprite);
        });


        const homeSprite = new Sprite({
            image: Resources.Home,
            destSize: { width: 350, height: 85 }
        });

        const homeHoverSprite = new Sprite({
            image: Resources.HomeSelect,
            destSize: { width: 350, height: 85 }
        });
        
        const homeButton = new Actor({
            pos: new Vector(centerX, centerY + buttonSpacing * 2),
            anchor: new Vector(0.4, -0.3)
        });

        homeButton.graphics.use(homeSprite);
        this.add(homeButton);

        homeButton.on('pointerup', () => {
            this.game.goToScene('begin');
        });
        homeButton.on('pointerenter', () => {
            homeButton.graphics.use(homeHoverSprite);
        });
        homeButton.on('pointerleave', () => {
            homeButton.graphics.use(homeSprite);
        });
    }
}