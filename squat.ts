class Squat implements Game {

    name: string = "Back Squat"
    icon: Image = assets.image`gameSquat`

    protected gamesEngine: Games = null

    protected state = "tutorial"
    protected barPicture: Image = null
    protected weightSprite: Sprite = null
    protected barSprite: Sprite = null
    protected powerBar: StatusBarSprite = null
    protected level = 0
    protected coatchSprite: Sprite = null
    protected score = 0


    constructor(gamesEngine: Games) {
        this.gamesEngine = gamesEngine
    }

    public start() {
        
        // game over
        statusbars.onStatusReached(StatusBarKind.Health, statusbars.StatusComparison.EQ, statusbars.ComparisonType.Fixed, 0, (status) => {
            this.stop()
        })

        // lift success
        statusbars.onStatusReached(StatusBarKind.Health, statusbars.StatusComparison.EQ, statusbars.ComparisonType.Fixed, 100, (status) => {
            sprites.destroyAllSpritesOfKind(SpriteKind.Lift)
            sprites.destroyAllSpritesOfKind(SpriteKind.Player)
            sprites.destroy(this.powerBar)
            this.level += 1
            this.setGym()
            this.state = "racked"
        })

        statusbars.onStatusReached(StatusBarKind.Health, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 25, (status) => {
            this.powerBar.setColor(4, 14)
        })

        statusbars.onStatusReached(StatusBarKind.Health, statusbars.StatusComparison.GT, statusbars.ComparisonType.Percentage, 25, (status) => {
            this.powerBar.setColor(5, 14)
        })

        this.setGym()
        this.tutorial()
    }

    protected tutorial() {
        this.state = "tutorial"

        this.coatchSprite = sprites.create(this.gamesEngine.player.coatchImage, SpriteKind.Coatch)

        story.startCutscene(() => {
            this.coatchSprite.setPosition(70, 70)
            let coatch = this.gamesEngine.player.coatchName + " says: ";
            let tutorialText = "Time to learn how to squat! Press A to lift the bar, and try to keep it steady. If you can get the power bar all the way up, you'll level up and get a heavier weight!"
            story.printCharacterText(tutorialText, coatch)
            sprites.destroy(this.coatchSprite)
            this.state = "racked"
            game.splash("A to unrack")
        })
    }

    public handleAEvent() {
        if (this.state === "lifting") {
            this.barSprite.vy = -35
        } else if (this.state === "tutorial") {
            story.cancelAllCutscenes()
            sprites.destroy(this.coatchSprite)
            this.state = "racked"
            game.splash("A to unrack")
        } else if (this.state = "racked") {
            this.squat()
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
            game.splash("Keep it steady!")
            if (this.barSprite.overlapsWith(this.weightSprite)) {
                this.powerBar.value += 1
                this.barPicture.fill(7)
            } else {
                this.powerBar.value += -1
                this.barPicture.fill(6)
            }
            this.bobWeight()
        }
    }

    protected squat() {
        pause(2000)
        this.state = "lifting"
    }

    protected bobWeight () {
        if (Math.percentChance(this.level * 2)) {
            if (Math.percentChance(50)) {
                this.weightSprite.y = Math.constrain(this.weightSprite.y + Math.constrain(randint(0, this.level), 0, 6), 20, 100)
            } else {
                this.weightSprite.y = Math.constrain(this.weightSprite.y + Math.constrain(randint(0, this.level), 0, 6) * -1, 20, 100)
            }
        }
    }

    protected setGym() {
        this.weightSprite = sprites.create(assets.image`squatWeight`, SpriteKind.Lift)
        this.weightSprite.setPosition(140, 60)
        this.weightSprite.z = 10

        this.drawBar(this.level)

        this.powerBar = statusbars.create(5, 100, StatusBarKind.Health)
        this.powerBar.setPosition(150, 60)
        this.powerBar.setColor(4, 14)
        this.powerBar.max = 100
        this.powerBar.value = 20
    }

    protected drawBar (level: number) {
        this.barPicture = image.create(11, Math.constrain(50 - level * 3, 25, 50))
        this.barPicture.fill(7)
        this.barSprite = sprites.create(this.barPicture, SpriteKind.Player)
        this.barSprite.setPosition(140, 60)
        this.barSprite.ay = 100
    }

    protected stop() {
        
        sprites.destroyAllSpritesOfKind(SpriteKind.Lift)
        sprites.destroy(this.powerBar)

        if (this.score > 0) {
            if (this.gamesEngine.leftToPlay() > 1) {
                game.splash("You Benched " + this.score + "LBs!", "Let's try anther lift.")
            } else {
                game.splash("You Benched " + this.score + "LBs!", "Time for a coffee break!")
            }
        } else {
            game.splash("Oh common!", "Time to get training!")
        }
        music.stopAllSounds()

        this.gamesEngine.stop(this)
    }
}