class Over implements Game {

    name: string = "Coffee Break"
    icon: Image = assets.image`gameCoffee`

    protected gameEngine: Games = null

    constructor(gamesEngine: Games) {
        this.gameEngine = gamesEngine
    }

    public start() {

        scene.setBackgroundImage(assets.image`blank160x120`)
        scene.setBackgroundColor(8)
        let sprite = sprites.create(this.gameEngine.player.selectedPlayerImage, SpriteKind.Player)
        sprite.y = 40
        sprite.setScale(0.5, ScaleAnchor.Middle)
        if (info.score() > 0) {
            if (info.score() > info.highScore()) {
                sprite.startEffect(effects.hearts, 5000)
            } else {
                sprite.startEffect(effects.confetti, 5000)
            }
            animation.runMovementAnimation(
                sprite,
                animation.animationPresets(animation.bobbing),
                1000,
                true
            )
        } else {
            sprite.startEffect(effects.ashes, 5000)
        }   
        
        story.startCutscene(() => {
            let winMessage = ""
            
            if (info.score() == 0) {
                winMessage = "Ouch!  You can do better then that!"
            } else {
                if (info.score() > info.highScore()) {
                    winMessage = "Heck ya! " + info.score() + " points!  New high score!!!!"
                } else {
                    winMessage = "Heck ya! " + info.score() + " points!  Hit the gym to level up."
                }
            }
 
            story.printCharacterText(winMessage, this.gameEngine.player.selectedPlayerName)

        })

        timer.after(5000, function () {
            if (info.score() == 0) {
                game.gameOver(false)
            } else {
                game.gameOver(true)
            }
        })

    }

    public handleAEvent() {
        // do nothing
    }
    
    
    public handleBEvent() {
        // do nothing
    }

    public handleLeftEvent() {
        // do nothing
    }

    public handleRightEvent() {
        // do nothing
    }

    public handleGameLoop() {
        // do nothing
    }
}