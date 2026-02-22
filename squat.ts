class Squat implements Game {

    name: string = "Back Squat"
    icon: Image = assets.image`gameSquat`

    protected gamesEngine: Games = null

    protected state = "tutorial"
    protected barPicture: Image = null
    protected bobSprite: Sprite = null
    protected barSprite: Sprite = null
    protected powerBar: StatusBarSprite = null
    protected level = 0
    protected coatchSprite: Sprite = null
    protected score = 0
    protected weightBottom = 80
    protected weightTop = 35
    protected weightSprite: Sprite = null
    protected currentWeight = 0


    constructor(gamesEngine: Games) {
        this.gamesEngine = gamesEngine
    }

    public start() {
        
        // game over
        statusbars.onStatusReached(StatusBarKind.SquatPower, statusbars.StatusComparison.EQ, statusbars.ComparisonType.Fixed, 0, (status) => {
            if (this.name != "Back Squat") {
                return
            }

            this.stop()
        })

        // lift success
        statusbars.onStatusReached(StatusBarKind.SquatPower, statusbars.StatusComparison.EQ, statusbars.ComparisonType.Fixed, 100, (status) => {
            this.state = "win"
            this.score += this.currentWeight
            info.changeScoreBy(this.currentWeight)
            game.splash("An Easy " + this.currentWeight + "LBs!", "Lets go for " + (this.currentWeight + 10) + "LBs")
            this.level += 1
            this.setGym()
            this.state = "decent"
        })

        statusbars.onStatusReached(StatusBarKind.SquatPower, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 25, (status) => {
            this.powerBar.setColor(4, 14)
        })

        statusbars.onStatusReached(StatusBarKind.SquatPower, statusbars.StatusComparison.GT, statusbars.ComparisonType.Percentage, 25, (status) => {
            this.powerBar.setColor(5, 14)
        })

        this.tutorial()
    }

    protected tutorial() {
        this.state = "tutorial"

        this.coatchSprite = sprites.create(this.gamesEngine.player.coatchImage, SpriteKind.Coatch)
        this.coatchSprite.setPosition(50, 60)

        story.startCutscene(() => {
            let coatch = "Coach " + this.gamesEngine.player.coatchName + ":";
            let tutorialText = "Squat time! Here are some tips.  \r\n\r\n 1) Press A to unrack when prompted."
            story.printCharacterText(tutorialText, coatch)
            tutorialText = "2) At the the bottom of your squat, press A to keep the green bar lined up with the bobbing weight."
            story.printCharacterText(tutorialText, coatch)
            tutorialText = "This will push your barbell up."
            story.printCharacterText(tutorialText, coatch)
            tutorialText = "Breath deep and keep that core engaged!"
            story.printCharacterText(tutorialText, coatch)
            this.state = "start"
        })
    }

    public handleAEvent() {
        if (this.state === "lifting") {
            this.barSprite.vy = -35
        } else if (this.state === "tutorial") {
            story.cancelCurrentCutscene()
            sprites.destroy(this.coatchSprite)
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
                this.powerBar.value += -1
                this.barPicture.fill(6)
            }
            this.bobBobber()
        } else if (this.state === "decent") {
            this.moveWeight()
        } else if (this.state === "start") {
            sprites.destroy(this.coatchSprite)
            this.setGym()
            this.state = "racked"
        } else if (this.state === "racked") {
            game.splash("A to unrack")
            this.state = "decent"
        }

        this.drawHUD()
    }

    protected moveWeight() {
        if (this.state === "decent") {
            this.weightSprite.ay = 50
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

    protected drawHUD() {

    }

    protected setGym() {
        sprites.destroyAllSpritesOfKind(SpriteKind.Lift)
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        sprites.destroy(this.powerBar)

        this.bobSprite = sprites.create(assets.image`squatWeight`, SpriteKind.Lift)
        this.bobSprite.setPosition(140, 60)
        this.bobSprite.z = 10

        this.drawBar(this.level)

        this.powerBar = statusbars.create(5, 100, StatusBarKind.SquatPower)
        this.powerBar.setPosition(150, 60)
        this.powerBar.setColor(4, 14)
        this.powerBar.max = 100
        this.powerBar.value = 10

        this.weightSprite = sprites.create(assets.image`benchBar`, SpriteKind.Lift)
        this.weightSprite.setPosition(70, this.weightTop)

        this.currentWeight = 65 + this.level * 10
    }

    protected drawBar (level: number) {
        this.barPicture = image.create(11, Math.constrain(50 - level * 3, 25, 50))
        this.barPicture.fill(7)
        this.barSprite = sprites.create(this.barPicture, SpriteKind.Player)
        this.barSprite.setPosition(140, 60)
    }

    protected stop() {
        this.state = "lose"
        sprites.destroyAllSpritesOfKind(SpriteKind.Lift)
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        sprites.destroy(this.powerBar)

        music.stopAllSounds()
        music.play(music.melodyPlayable(music.wawawawaa), music.PlaybackMode.UntilDone)


        if (this.score > 0) {
            if (this.gamesEngine.leftToPlay() > 0) {
                game.splash("You Benched " + this.score + " points!", "Let's try anther lift.")
            } else {
                game.splash("You Benched " + this.score + "  points!", "Time for a coffee break!")
            }
        } else {
            game.splash("Oh common!", "Time to get training!")
        }
        

        this.gamesEngine.stop(this)
    }
}