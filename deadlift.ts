class Deadlift implements Game {

    name: string = "Deadlift"
    icon: Image = assets.image`gameDeadlift`

    protected gamesEngine: Games = null
    protected gripBar: StatusBarSprite = null
    protected timerBar: StatusBarSprite = null
    protected liftBar: StatusBarSprite = null
    protected arrowRightSprite: Sprite = null
    protected arrowDownSprite: Sprite = null
    protected state = "tutorial"
    protected hudAction: TextSprite = null
    protected hudWeight: TextSprite = null
    protected hudLevel: TextSprite = null
    protected weightBottom = 100
    protected weightTop = 65
    protected weightSprite: Sprite = null
    protected lifterSprite: Sprite = null
    protected level = 1
    protected score = 0
    protected coatchSprite: Sprite = null
    protected sweating: boolean = false
    protected cancelTutorial: boolean = false
    protected currentWeight = 0
    protected barSprite: Sprite = null
    protected timerLast: number = 0
    protected gripLast: number = 0


    constructor(gamesEngine: Games) {
        this.gamesEngine = gamesEngine
    }

    public start() {

        music.play(music.createSong(assets.song`footloose`), music.PlaybackMode.LoopingInBackground)

        // grip good
        statusbars.onStatusReached(StatusBarKind.DeadliftGrip, statusbars.StatusComparison.GTE, statusbars.ComparisonType.Fixed, 50, (status) => {
            this.gripBar.setColor(7, 14)
        })

        // grip bad
        statusbars.onStatusReached(StatusBarKind.DeadliftGrip, statusbars.StatusComparison.LT, statusbars.ComparisonType.Fixed, 50, (status) => {
            this.gripBar.setColor(2, 14)

            if (this.state === "lifting" && this.liftBar.value > 0) {
                this.state = "lose"
            }
        })

        // time running out 
        statusbars.onStatusReached(StatusBarKind.DeadliftTimer, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Fixed, 20, (status) => {
            this.timerBar.setColor(2, 14)
        })

        // lift near win
        statusbars.onStatusReached(StatusBarKind.DeadliftLift, statusbars.StatusComparison.GTE, statusbars.ComparisonType.Fixed, 70, (status) => {
            this.liftBar.setColor(9, 14)
        })

        // lift not there
        statusbars.onStatusReached(StatusBarKind.DeadliftLift, statusbars.StatusComparison.LT, statusbars.ComparisonType.Fixed, 70, (status) => {
            this.liftBar.setColor(4, 14)
        })

        // time up
        statusbars.onStatusReached(StatusBarKind.DeadliftTimer, statusbars.StatusComparison.EQ, statusbars.ComparisonType.Fixed, 0, (status) => {
            this.state = "lose"
            this.stop()
        })

        this.setGym()
        this.tutorial()

    }

    protected tutorial() {
        this.state = "tutorial"

        this.coatchSprite = sprites.create(this.gamesEngine.player.coatchImage, SpriteKind.Coatch)
        this.coatchSprite.setPosition(-20, 100)
        this.coatchSprite.z = 100

        this.arrowDownSprite = sprites.create(assets.image`downArrow`, SpriteKind.Coatch)
        this.arrowDownSprite.setPosition(80, -20)
        this.arrowDownSprite.z = 300

        this.arrowRightSprite = sprites.create(assets.image`rightArrow`, SpriteKind.Coatch)
        this.arrowRightSprite.setPosition(-20, 100)
        this.arrowRightSprite.z = 300

        story.startCutscene(() => {
            if (!this.cancelTutorial) {
                story.spriteMoveToLocation(this.coatchSprite, 40, 100, 100)
            }

            if (!this.cancelTutorial) {
                story.spriteSayText(this.coatchSprite, "Doing the Deadlift! Here are some tips.")
            }

            if (!this.cancelTutorial) {
                story.spriteSayText(this.coatchSprite, "Press A to get ready to lift when prompted.")
            }

            if (!this.cancelTutorial) {
                story.spriteMoveToLocation(this.arrowDownSprite, 80, 85, 100)
            }

            if (!this.cancelTutorial) {
                this.gripBar.value = 60
                this.gripBar.setColor(7, 14)
                story.spriteSayText(this.coatchSprite, "Press A+B to juice up your grip, getting it into the green zone.")
            }

            if (!this.cancelTutorial) {
                story.spriteSayText(this.coatchSprite, "Keep mashing A+B to keep your grip strong.")
            }

            if (!this.cancelTutorial) {
                sprites.destroy(this.arrowDownSprite)
                story.spriteMoveToLocation(this.arrowRightSprite, 130, 60, 100)
            }

            if (!this.cancelTutorial) {
                this.liftBar.value = 60
                this.liftBar.setColor(9, 14)
                story.spriteSayText(this.coatchSprite, "With your grip juiced, press UP repeatedly to pull that bar up.")
            }

            if (!this.cancelTutorial) {
                story.spriteMoveToLocation(this.arrowRightSprite, 140, 60, 100)
            }

            if (!this.cancelTutorial) {
                this.timerBar.value = 40
                this.timerBar.setColor(2, 14)
                story.spriteSayText(this.coatchSprite, "Lift fast to beat the clock.")
            }

            if (!this.cancelTutorial) {
                story.spriteSayText(this.coatchSprite, "Enage your core by breathing deep!")
            }

            this.state = "start"
        })
    }

    public handleAEvent() {
        if (this.state === "racked") {
            this.state = "decent"
        } if (this.state === "lifting") {
            if (controller.B.isPressed()) {
                // juice grip
                this.gripBar.value += Math.constrain(11 - this.level, 2, 10)
            }

        } else if (this.state === "tutorial") {
            this.cancelTutorial = true
            story.cancelCurrentCutscene()
            sprites.destroy(this.coatchSprite)
            sprites.destroy(this.arrowRightSprite)
            sprites.destroy(this.arrowDownSprite)
            
            this.state = "start"
        }
    }

    public handleBEvent() {
        if (this.state === "lifting") {
            if (controller.A.isPressed()) {
                // juice grip
                this.gripBar.value += Math.constrain(11 - this.level, 2, 10)
            }
        }
    }

    public handleUpEvent() {
        if (this.state === "lifting") {
            let lift = (this.weightBottom - this.weightTop) / this.level

            if (this.gripBar.value < 50) {
                // drop bar
                this.state = "lose"
                this.weightSprite.ay = 150
                this.weightSprite.setFlag(SpriteFlag.AutoDestroy, true)
                this.weightSprite.onDestroyed(() => {
                    this.stop()
                })
            } else {
                this.liftBar.value += lift

                if (this.liftBar.value === 100) {
                    this.state = "win"
                    this.score += this.currentWeight
                    info.changeScoreBy(this.currentWeight)
                    
                    music.play(music.melodyPlayable(music.magicWand), music.PlaybackMode.UntilDone)

                    game.splash(this.gamesEngine.saying + " " + this.currentWeight + "LBs!", "Lets go for " + (this.currentWeight + 25) + "LBs")
                    this.level += 1
                    this.setGym()
                    this.state = "decent"
                }
            }
        
        }
    }

    public handleLeftEvent() {

    }

    public handleRightEvent() {

    }

    public handleGameLoop() {
        if (this.state === "lose") {
            return
        }
        
        if (this.state === "lifting") {

            let timerCurrent = game.runtime() - this.timerLast
            let gripCurrent = game.runtime() - this.gripLast

            if (timerCurrent >= 150) {
                this.timerLast = game.runtime()
                this.timerBar.value += -1
            }

            if (gripCurrent >= 2000 - (this.level * 10)) {
                this.gripLast = game.runtime()
                this.gripBar.value -= Math.constrain(9 + Math.floor(this.level / 2), 10, 20)
            }

            if (this.timerBar.value < 50 && this.liftBar.value < 50) {
                if (!this.sweating) {
                    this.lifterSprite.startEffect(effects.spray)
                    this.sweating = true
                }
            }

            // check if grip was lost
            if (this.liftBar.value > 0 && this.gripBar.value < 50) {
                // drop bar
                this.state = "lose"
                this.weightSprite.ay = 150
                this.weightSprite.setFlag(SpriteFlag.AutoDestroy, true)
                this.weightSprite.onDestroyed(() => {
                    this.stop()
                })
            }

            this.moveWeight()

        } else if (this.state === "decent") {
            this.moveWeight()
        } else if (this.state === "start") {
            sprites.destroy(this.coatchSprite)
            sprites.destroy(this.arrowRightSprite)
            sprites.destroy(this.arrowDownSprite)
            this.setGym()
            this.state = "racked"
        } else if (this.state === "racked") {
            game.splash("A to start")
            this.state = "decent"
        } else {
            this.timerLast = game.runtime()
            this.gripLast = game.runtime()
        }

        this.drawHUD()
    }

    /**
     * Draw squat heads up display
     */
    protected drawHUD() {
        if (this.state == "lose" || this.state == "tutorial") {
            return
        }

        if (this.hudLevel) {
            sprites.destroy(this.hudLevel)
        }

        if (this.hudWeight) {
            sprites.destroy(this.hudWeight)
        }

        if (this.hudAction) {
            sprites.destroy(this.hudAction)
        }

        this.hudLevel = textsprite.create("Level " + this.level, 15, 0)
        this.hudLevel.setPosition(30, 111)

        this.hudWeight = textsprite.create("Weight " + this.currentWeight + "LBs", 15, 0)
        this.hudWeight.setPosition(110, 111)

        if (this.state == "racked") {
            this.hudAction = textsprite.create("Press A To Start", 15, 0)
            this.hudAction.setPosition(80, 10)
        } else if (this.state == "lifting") {
            if (this.gripBar.value < 60) {
                this.hudAction = textsprite.create("Build Grip with A+B", 15, 0)
                this.hudAction.setPosition(80, 10)
            } else {
                this.hudAction = textsprite.create("Press UP repeatedly", 15, 0)
                this.hudAction.setPosition(80, 10)
            }
        } else if (this.state == "decent") {
            this.hudAction = textsprite.create("Squatting", 15, 0)
            this.hudAction.setPosition(80, 10)
        } else if (this.state == "win") {
            this.hudAction = textsprite.create("Yes!!!", 15, 0)
            this.hudAction.setPosition(80, 10)
        } else if (this.state == "lose") {
            this.hudAction = textsprite.create("Good Try", 15, 0)
            this.hudAction.setPosition(80, 10)
        }
    }

    protected moveWeight() {
        if (this.state === "decent") {

            if (this.lifterSprite.height > 50) {

                scaling.scaleToPixels(
                    this.lifterSprite,
                    this.lifterSprite.height - 1,
                    ScaleDirection.Vertically,
                    ScaleAnchor.Bottom
                )
            } else {
                this.state = "lifting"
            }
            


        } else if (this.state === "lifting") {
            let targetY = this.weightBottom - Math.ceil((this.weightBottom - this.weightTop) * (this.liftBar.value / 100))

            this.weightSprite.y = targetY
            
            let scaleY = 50 + Math.ceil((120 - 50) * (this.liftBar.value / 100))

            scaling.scaleToPixels(
                this.lifterSprite,
                scaleY,
                ScaleDirection.Vertically,
                ScaleAnchor.Bottom
            )

        }
    }

    protected setGym() {

        if (this.state === "lose") {
            return
        }

        sprites.destroyAllSpritesOfKind(SpriteKind.Lift)
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        sprites.destroy(this.gripBar)
        sprites.destroy(this.timerBar)
        sprites.destroy(this.liftBar)

        this.gripBar = statusbars.create(40, 5, StatusBarKind.DeadliftGrip)
        if (this.state === "tutorial") {
            this.gripBar.setPosition(60, 100)
        } else {
            this.gripBar.setPosition(60, 20)
        }
        this.gripBar.z = 200
        this.gripBar.setColor(2, 14)
        this.gripBar.setLabel("Grip ")
        this.gripBar.value = 0

        this.timerBar = statusbars.create(5, 80, StatusBarKind.DeadliftTimer)
        this.timerBar.setPosition(155, 60)
        this.timerBar.z = 200
        this.timerBar.setColor(7, 14)
        this.timerBar.max = 100
        this.timerBar.value = 100

        this.liftBar = statusbars.create(5, 80, StatusBarKind.DeadliftLift)
        this.liftBar.setPosition(145, 60)
        this.liftBar.z = 200
        this.liftBar.setColor(4, 14)
        this.liftBar.max = 100
        this.liftBar.value = 0

        if (this.sweating) {
            effects.clearParticles(this.lifterSprite)
            this.sweating = false
        }

        if (this.state != "tutorial") {
            this.weightSprite = sprites.create(assets.image`squatBar`, SpriteKind.Lift)
            this.weightSprite.setPosition(70, this.weightBottom)
        }

        if (this.state != "tutorial") {
            this.lifterSprite = sprites.create(assets.image`deadlifter`, SpriteKind.Lift)
            this.lifterSprite.setPosition(70, 50)
        }

        this.currentWeight = 50 + this.level * 25
    }

    protected stop() {
        let gripValue = this.gripBar.value
        let liftValue = this.liftBar.value

        sprites.destroyAllSpritesOfKind(SpriteKind.Lift)
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        sprites.destroy(this.liftBar)
        sprites.destroy(this.timerBar)
        sprites.destroy(this.gripBar)
        sprites.destroy(this.hudLevel)
        sprites.destroy(this.hudWeight)
        sprites.destroy(this.hudAction)

        music.stopAllSounds()

        if (this.score > 0) {

            this.hudAction = textsprite.create("GOOD ATTEMPT!", 15, 0)
            this.hudAction.setPosition(80, 10)

            music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.UntilDone)
            if (this.gamesEngine.leftToPlay() > 0) {
                game.splash("You Lifted " + this.score + " points!", "Let's try anther lift.")
            } else {
                game.splash("You Lifted " + this.score + " points!", "Time for a coffee break!")
            }

            sprites.destroy(this.hudAction)
        } else {
            music.play(music.melodyPlayable(music.wawawawaa), music.PlaybackMode.UntilDone)

            if (liftValue === 0 && gripValue === 0) {
                game.splash("Get a grip before lifting", "Try again another time")
            } else {
                game.splash("Oh come on!", "Time to get training!")
            }
        }


        this.gamesEngine.stop(this)
    }
}