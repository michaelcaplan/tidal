class Squat implements Game {

    name: string = "Back Squat"
    icon: Image = assets.image`gameSquat`

    protected gamesEngine: Games = null

    protected hudAction: TextSprite = null
    protected hudWeight: TextSprite = null
    protected hudLevel: TextSprite = null
    protected state = "tutorial"
    protected barPicture: Image = null
    protected bobSprite: Sprite = null
    protected barSprite: Sprite = null
    protected powerBar: StatusBarSprite = null
    protected level = 1
    protected coatchSprite: Sprite = null
    protected arrowSprite: Sprite = null
    protected score = 0
    protected weightBottom = 80
    protected weightTop = 35
    protected weightSprite: Sprite = null
    protected squatterSprite: Sprite = null
    protected currentWeight = 0
    protected ticksOver:number = 0
    protected sweating: boolean = false
    protected cancelTutorial: boolean = false


    constructor(gamesEngine: Games) {
        this.gamesEngine = gamesEngine
    }

    public start() {
        music.play(music.createSong(assets.song`thunderstruck`), music.PlaybackMode.LoopingInBackground)

        // game over
        statusbars.onStatusReached(StatusBarKind.SquatPower, statusbars.StatusComparison.EQ, statusbars.ComparisonType.Fixed, 0, (status) => {
            if (this.name != "Back Squat") {
                return
            }

            this.powerBar.setColor(2, 14)

            if (this.ticksOver === 0) {
                // start 1 second buffer time till loose
                this.ticksOver = game.runtime()
                if (!this.sweating) {
                    this.squatterSprite.startEffect(effects.spray)
                    this.sweating = true
                }
            }
        })

        // lift success
        statusbars.onStatusReached(StatusBarKind.SquatPower, statusbars.StatusComparison.EQ, statusbars.ComparisonType.Fixed, 100, (status) => {
            this.state = "win"
            this.score += this.currentWeight
            info.changeScoreBy(this.currentWeight)
            music.play(music.createSoundEffect(WaveShape.Noise, 3900, 3500, 255, 0, 10, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
            game.splash(this.gamesEngine.saying + " " + this.currentWeight + "LBs!", "Lets go for " + (this.currentWeight + 10) + "LBs")
            this.level += 1
            this.setGym()
            this.state = "decent"
            this.ticksOver = 0
        })

        statusbars.onStatusReached(StatusBarKind.SquatPower, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 25, (status) => {
            this.powerBar.setColor(4, 14)
        })

        statusbars.onStatusReached(StatusBarKind.SquatPower, statusbars.StatusComparison.GT, statusbars.ComparisonType.Percentage, 25, (status) => {
            this.powerBar.setColor(5, 14)
            // reset loose buffer time
            this.ticksOver = 0
        })

        this.setGym()
        this.tutorial()
    }

    protected tutorial() {
        this.state = "tutorial"

        this.coatchSprite = sprites.create(this.gamesEngine.player.coatchImage, SpriteKind.Coatch)
        this.coatchSprite.setPosition(-20, 100)

        this.arrowSprite = sprites.create(assets.image`rightArrow`, SpriteKind.Coatch)
        this.arrowSprite.setPosition(-20, 100)

        story.startCutscene(() => {
            if (!this.cancelTutorial) {
                story.spriteMoveToLocation(this.coatchSprite, 40, 100, 100)
            }

            if (!this.cancelTutorial) {       
                story.spriteSayText(this.coatchSprite, "Squat time! Here are some tips.")
            }

            if (!this.cancelTutorial) {
                story.spriteSayText(this.coatchSprite, "Press A to unrack when prompted.")
            }

            if (!this.cancelTutorial) {
                story.spriteMoveToLocation(this.arrowSprite, 130, 40, 100)
            }

            if (!this.cancelTutorial) {
                story.spriteSayText(this.coatchSprite, "At the the bottom of your squat, press A to keep the green bar lined up with the bobbing weight.")
            }

            if (!this.cancelTutorial) {
                story.spriteMoveToLocation(this.arrowSprite, 130, 60, 100)
                animation.runMovementAnimation(this.bobSprite, animation.animationPresets(animation.bobbing), 1000, false)
            }

            if (!this.cancelTutorial) {
                story.spriteSayText(this.coatchSprite, "Keeping the bobbing weight aligned with the grean bar will push your barbell up.")
            }

            if (!this.cancelTutorial) {
                story.spriteSayText(this.coatchSprite, "Breath deep and keep that core engaged!")
            }
            
            this.state = "start"
        })
    }

    public handleAEvent() {
        if (this.state === "lifting") {
            this.barSprite.vy = -35
        } else if (this.state === "tutorial") {
            this.cancelTutorial = true
            story.cancelAllCutscenes()
            sprites.destroy(this.coatchSprite)
            sprites.destroy(this.arrowSprite)
            this.state = "start"
        }
    }
    
    public handleBEvent() {
        
    }

    public handleLeftEvent() {

    }

    public handleRightEvent() {

    }

    public handleGameLoop() {
        if (this.state === "lifting") {
            if (this.barSprite.overlapsWith(this.bobSprite)) {
                this.powerBar.value += 1
                this.barPicture.fill(7)
                this.moveWeight()
            } else {
                if (!this.sweating) {
                    this.squatterSprite.startEffect(effects.spray)
                    this.sweating = true
                }
                if (this.powerBar.value === 0) {
                    if ((game.runtime() - this.ticksOver) >= 1000) {
                        // 1 second buffer time from hitting 0 lapsed
                        // Drop bar
                        this.state = "lose"

                        this.weightSprite.ay = 150
                        this.weightSprite.setFlag(SpriteFlag.AutoDestroy, true)
                        this.weightSprite.onDestroyed(() => {
                            this.stop()
                        })
                    }
                }

                this.powerBar.value += -1
                this.barPicture.fill(6)
            }
            this.bobBobber()
        } else if (this.state === "decent") {
            this.moveWeight()
        } else if (this.state === "start") {
            sprites.destroy(this.coatchSprite)
            sprites.destroy(this.arrowSprite)
            this.setGym()
            this.state = "racked"
        } else if (this.state === "racked") {
            game.splash("A to unrack")
            this.state = "decent"
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
        this.hudLevel.setPosition(30, 110)

        this.hudWeight = textsprite.create("Weight " + this.currentWeight + "LBs", 15, 0)
        this.hudWeight.setPosition(110, 110)

        if (this.state == "racked") {
            this.hudAction = textsprite.create("Press A To Unrack", 15, 0)
            this.hudAction.setPosition(80, 10)
        } else if (this.state == "lifting") {
            if (!this.barSprite.overlapsWith(this.bobSprite)) {
                this.hudAction = textsprite.create("Keep It Aligned! (A)", 15, 0)
                this.hudAction.setPosition(80, 10)
            } else {
                this.hudAction = textsprite.create("Keep It Steady! (A)", 15, 0)
                this.hudAction.setPosition(80, 10)
            }
        } else if (this.state == "decent") {
            this.hudAction = textsprite.create("Squatting", 15, 0)
            this.hudAction.setPosition(80, 10)
        } else if (this.state == "win") {
            this.hudAction = textsprite.create("Yes!!!", 15, 0)
            this.hudAction.setPosition(80, 10)
        } else if (this.state == "loose") {
            this.hudAction = textsprite.create("Good Try", 15, 0)
            this.hudAction.setPosition(80, 10)
        }
    }

    protected moveWeight() {
        if (this.state === "decent") {
            this.weightSprite.ay = 50

            scaling.scaleToPixels(
                this.squatterSprite,
                (120 - ((this.weightSprite.y - this.weightTop) * 1.5)),
                ScaleDirection.Vertically, 
                ScaleAnchor.Bottom
            )


            if (this.weightSprite.y >= this.weightBottom) {
                this.weightSprite.ay = 0
                this.weightSprite.vy = 0
                this.weightSprite.setPosition(70, this.weightBottom)
                this.state = "lifting"
                this.barSprite.ay = 100
            }
        } else if (this.state === "lifting") {
            let targetY = this.weightBottom - Math.ceil((this.weightBottom - this.weightTop) * (this.powerBar.value / 100))

            if (targetY < this.weightSprite.y) {
                this.weightSprite.y = targetY

                scaling.scaleToPixels(
                    this.squatterSprite,
                    (120 - ((this.weightSprite.y - this.weightTop) * 1.5)),
                    ScaleDirection.Vertically,
                    ScaleAnchor.Bottom
                )
            }

        }
    }

    protected bobBobber () {
        if (Math.percentChance(this.level * 2)) {
            if (Math.percentChance(50)) {
                this.bobSprite.y = Math.constrain(this.bobSprite.y + Math.constrain(randint(0, this.level), 0, 6), 20, 100)
            } else {
                this.bobSprite.y = Math.constrain(this.bobSprite.y + Math.constrain(randint(0, this.level), 0, 6) * -1, 20, 100)
            }
        }
    }

    protected setGym() {
        sprites.destroyAllSpritesOfKind(SpriteKind.Lift)
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        sprites.destroy(this.powerBar)

        this.bobSprite =sprites.create(assets.image`squatWeight`, SpriteKind.Lift)
        this.bobSprite.setPosition(145, 60)
        this.bobSprite.z = 10

        this.drawBar(this.level)

        this.powerBar = statusbars.create(5, 80, StatusBarKind.SquatPower)
        this.powerBar.setPosition(155, 60)
        this.powerBar.setColor(4, 14)
        this.powerBar.max = 100
        this.powerBar.value = 10

        if (this.state != "tutorial") {
            this.weightSprite = sprites.create(assets.image`squatBar`, SpriteKind.Lift)
             this.weightSprite.setPosition(70, this.weightTop)
        }

        if (this.sweating) {
            effects.clearParticles(this.squatterSprite)
            this.sweating = false
        }

        if (this.state != "tutorial") {
            this.squatterSprite = sprites.create(assets.image`squatter`, SpriteKind.Lift)
            this.squatterSprite.setPosition(70, 50)
        }

        this.currentWeight = 65 + this.level * 10
    }

    protected drawBar (level: number) {
        this.barPicture = image.create(11, Math.constrain(50 - level * 3, 25, 50))
        this.barPicture.fill(7)
        this.barSprite = sprites.create(this.barPicture, SpriteKind.Player)
        this.barSprite.setPosition(145, 60)
    }

    protected stop() {
        sprites.destroyAllSpritesOfKind(SpriteKind.Lift)
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        sprites.destroy(this.powerBar)
        sprites.destroy(this.hudLevel)
        sprites.destroy(this.hudWeight)
        sprites.destroy(this.hudAction)

        music.stopAllSounds()

        if (this.score > 0) {

            this.hudAction = textsprite.create("GOOD ATTEMPT!", 15, 0)
            this.hudAction.setPosition(80, 10)

            music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.UntilDone)
            if (this.gamesEngine.leftToPlay() > 0) {
                game.splash("You Benched " + this.score + " points!", "Let's try anther lift.")
            } else {
                game.splash("You Benched " + this.score + " points!", "Time for a coffee break!")
            }

            sprites.destroy(this.hudAction)
        } else {
            music.play(music.melodyPlayable(music.wawawawaa), music.PlaybackMode.UntilDone)
            game.splash("Oh come on!", "Time to get training!")
        }
        

        this.gamesEngine.stop(this)
    }
}