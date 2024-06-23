import { Scene, Label, Color, Vector, Actor, CoordPlane, TextAlign, Font, Sprite } from 'excalibur';
import { Resources } from './resources';

export class GameOverScene extends Scene {
    constructor(score, game) {
        super();
        this.score = score;
        this.game = game;
        this.handleRestart = this.handleRestart.bind(this);
    }

    handleRestart() {
        this.game.resetGame();
        this.game.goToScene('main'); // Start het spel opnieuw na reset
    }

    onInitialize(engine) {

    
        const homeSprite = new Sprite({
            image: Resources.Retry,
            destSize: { width: 350, height: 85 }
        });
        const homeHoverSprite = new Sprite({
            image: Resources.RetrySelect,
            destSize: {width: 350, height: 85 }
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
    

            // Maak de herstartknop sprite
        const restartButtonSprite = new Sprite({
            image: Resources.Gameover,  // Gebruik de ImageSource voor de herstartknop
            destSize: { width: 600, height: 300 }  // Pas de grootte aan zoals gewenst
        });

        const restartButton = new Actor({
            pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2 + -200),
            anchor: new Vector(0.5, 0.5)

            
        });

        restartButton.graphics.use(restartButtonSprite);


       
        
        

        const scoreLabel = new Label({
            text: 'Score: ' + this.score,
            pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2 - 50),
            font: new Font({
                color: Color.Black,
                size: 36,
                textAlign: TextAlign.Center,
                family: 'Arial',
            }),
            coordPlane: CoordPlane.Screen
        });
        this.add(scoreLabel);

        

        // Voeg click-event toe aan de herstartknop
        restartButton.on('pointerup', () => {
            this.handleRestart();
        });

        // Voeg de herstartknop toe aan de scene
        this.add(restartButton);
    




     
    }

    onActivate() {
        // Add the event listener when the scene is activated
        this.engine.input.pointers.primary.on('down', this.handleRestart);
    }

    onDeactivate() {
        // Remove the event listener when the scene is deactivated
        this.engine.input.pointers.primary.off('down', this.handleRestart);
    }

    
}