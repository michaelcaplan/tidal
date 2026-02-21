class Bench implements Game {

    name: string = "Bench Press"
    icon: Image = assets.image`gameBench`

    hudAction: TextSprite = null
    hudWeight: TextSprite = null
    hudLevel: TextSprite = null
    rightArmSprite: Sprite = null
    leftArmSprite: Sprite = null
    barSprite: Sprite = null
    playerSprite: Sprite = null
    statusBar: StatusBarSprite = null
    state = ""
    level = 0
    currentWeight = 0
    barHeight = 0
    gameLoopHealthLast = 0
    gameLoopLast = 0
    rightSprite: Sprite = null
    leftSprite: Sprite = null
    score = 0
    tilt = 0
    maxTilt = 0

    barTop = 35
    barMidTop = 40
    barMidBottom = 50
    barBottom = 60
 


    protected gamesEngine: Games = null

    constructor(gamesEngine: Games) {
        this.gamesEngine = gamesEngine
    }

    public start() {
        music.play(music.createSong(assets.song`benchTunes`), music.PlaybackMode.LoopingInBackground)
        scene.setBackgroundImage(assets.image`benchBackground`)

        this.state = "racked"
        this.level = 1

        this.playerSprite = sprites.create(assets.image`benchPlayer`, SpriteKind.Player)
        this.playerSprite.setPosition(80, 70)
        this.playerSprite.z = 10

        this.leftArmSprite = sprites.create(assets.image`blank10x10`, SpriteKind.Player)
        this.leftArmSprite.setPosition(65, 70)
        this.leftArmSprite.z = 0
        
        this.rightArmSprite = sprites.create(assets.image`blank10x10`, SpriteKind.Player)
        this.rightArmSprite.setPosition(90, 70)
        this.rightArmSprite.z = 0
        
        this.statusBar = statusbars.create(60, 4, StatusBarKind.Health)
        this.statusBar.value = 100
        this.statusBar.positionDirection(CollisionDirection.Bottom)
        this.statusBar.setOffsetPadding(0, 20)
        this.statusBar.attachToSprite(this.playerSprite)
        
        this.rightSprite = sprites.create(assets.image`rightHand`, SpriteKind.benchBar)
        this.rightSprite.setPosition(110, 40)
        
        this.leftSprite = sprites.create(assets.image`leftHand`, SpriteKind.benchBar)
        this.leftSprite.setPosition(50, 40)
        
        this.barSprite = sprites.create(assets.image`benchBar`, SpriteKind.benchBar)
        this.barSprite.setPosition(80, 40)
        this.barSprite.z = -10
        
        this.hudLevel = textsprite.create("Entering Level", 15, 0)
        this.hudLevel.setPosition(50, 110)
        this.hudWeight = textsprite.create("Weight ?", 15, 0)
        this.hudWeight.setPosition(100, 110)
        this.hudAction = textsprite.create("Ready?", 15, 0)
        this.hudAction.setPosition(80, 10)
    }

    public handleAEvent() {
        if (this.state == "press") {
            if (this.leftSprite.y > this.barTop) {
                this.leftSprite.y += -1
            }
        } else if (this.state == "racked") {
            this.state = "unracked"
            music.play(music.createSoundEffect(WaveShape.Noise, 3900, 3500, 255, 0, 10, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
            this.leftSprite.y += -5
            this.rightSprite.y += -5
        } else if (this.state == "unracked") {
            this.state = "decend"
        } else if (this.state == "pressed") {
            this.state = "done"
            music.play(music.createSoundEffect(WaveShape.Noise, 3900, 3500, 255, 0, 10, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
            this.leftSprite.y += 5
            this.rightSprite.y += 5
        }
    }
    
    
    public handleBEvent() {
        if (this.state == "press") {
            if (this.rightSprite.y > this.barTop) {
                this.rightSprite.y += -1
            }
        }

    }

    public handleLeftEvent() {

    }

    public handleRightEvent() {

    }

    public handleGameLoop() {
        if (!(this.leftSprite) || !(this.rightSprite)) {
            return
        }
        
        let gameLoopCurrent = game.runtime() - this.gameLoopLast
        let gameLoopHealthCurrent = game.runtime() - this.gameLoopHealthLast
        this.barHeight = (this.leftSprite.y + this.rightSprite.y) / 2
        this.currentWeight = 65 + this.level * 10
        if (this.state == "press") {
            if (gameLoopHealthCurrent >= 150) {
                this.gameLoopHealthLast = game.runtime()
                this.statusBar.value += -1
                if (this.statusBar.value == 0) {
                    this.stop()
                }
            }
            if (gameLoopCurrent >= 1000) {

                this.gameLoopLast = game.runtime()
                
                if (this.leftSprite.y <= this.barTop && this.rightSprite.y <= this.barTop) {
                    this.state = "pressed"
                    this.rightSprite.y = this.barTop
                    this.leftSprite.y = this.barTop
                    effects.clearParticles(this.playerSprite)
                    this.updateHud()
                }
                
                let gravity = this.currentWeight * 0.01
                
                // Mid point stick
                if (this.barHeight > this.barMidTop && this.barHeight < this.barMidBottom) {
                    gravity = gravity * 1.5
                    this.playerSprite.startEffect(effects.spray)
                }
                
                this.tilt = Math.abs(this.leftSprite.y - this.rightSprite.y)
                this.maxTilt = 20 - this.currentWeight / 20
                
                if (this.tilt > this.maxTilt) {
                    // Severe penalty for uneven lifting
                    gravity = gravity * 2
                    this.playerSprite.startEffect(effects.spray)
                }
                
                if (this.leftSprite.y < this.barBottom) {
                    this.leftSprite.y = this.leftSprite.y + gravity
                } else {
                    this.leftSprite.y = this.barBottom
                }

                if (this.rightSprite.y < this.barBottom) {
                    this.rightSprite.y = this.rightSprite.y + gravity
                } else {
                    this.rightSprite.y = this.barBottom
                }
            }
        } else if (this.state == "decend") {

            this.leftSprite.vy = 60
            this.rightSprite.vy = 60
            if (this.barHeight >= this.barBottom) {
                this.leftSprite.vy = 0
                this.leftSprite.y = this.barBottom
                this.rightSprite.vy = 0
                this.rightSprite.y = this.barBottom
                this.state = "press"
            }
        }

        this.updateBar()
        this.updateArms()
        this.updateHud()
    }


    /**
     * Draw the bench bar height and rotation
     */
    protected updateBar() {
        this.barSprite.y = (this.leftSprite.y + this.rightSprite.y) / 2
        transformSprites.rotateSprite(this.barSprite, this.rightSprite.y - this.leftSprite.y)
    }

    /**
     * Draw those elasta arms running from body up to bar
     */
    protected updateArms() {
        let leftArm = image.create(15, this.playerSprite.y - this.barSprite.y)
        leftArm.drawLine(0, 0, image.getDimension(leftArm, image.Dimension.Width), image.getDimension(leftArm, image.Dimension.Height), 13)
        leftArm.drawLine(1, 0, image.getDimension(leftArm, image.Dimension.Width) + 1, image.getDimension(leftArm, image.Dimension.Height) + 1, 13)
        leftArm.drawLine(2, 0, image.getDimension(leftArm, image.Dimension.Width) + 2, image.getDimension(leftArm, image.Dimension.Height) + 2, 13)
        this.leftArmSprite.setImage(leftArm)
        this.leftArmSprite.top = this.barSprite.bottom
        
        let rightArm = image.create(15, this.playerSprite.y - this.barSprite.y)
        rightArm.drawLine(image.getDimension(rightArm, image.Dimension.Width), 0, 0, image.getDimension(rightArm, image.Dimension.Height), 13)
        rightArm.drawLine(image.getDimension(rightArm, image.Dimension.Width) + 1, 0, 0, image.getDimension(rightArm, image.Dimension.Height) + 1, 13)
        rightArm.drawLine(image.getDimension(rightArm, image.Dimension.Width) + 2, 0, 0, image.getDimension(rightArm, image.Dimension.Height) + 2, 13)
        this.rightArmSprite.setImage(rightArm)
        this.rightArmSprite.top = this.barSprite.bottom
    }

    /**
     * Draw bench heads up display
     */
    protected updateHud() {
        this.hudLevel.setText("Level " + this.level)
        this.hudWeight.setText("Weight " + this.currentWeight + "LBs")
        if (this.state == "racked") {
            this.hudAction.setText("Press A To Unrack")
            this.hudAction.setPosition(80, 10)
        } else if (this.state == "press") {
            if (this.tilt > this.maxTilt) {
                this.hudAction.setText("UNEVEN!!!!")
                this.hudAction.setPosition(80, 10)
            } else {
                this.hudAction.setText("PUSH!! (A+B)")
                this.hudAction.setPosition(80, 10)
            }
        } else if (this.state == "unracked") {
            this.hudAction.setText("Press A To Descend")
            this.hudAction.setPosition(80, 10)
        } else if (this.state == "unracked") {
            this.hudAction.setText("DESCENDING!")
            this.hudAction.setPosition(80, 10)
        } else if (this.state == "pressed") {
            this.hudAction.setText("Press A to Re-Rack")
            this.hudAction.setPosition(80, 10)
        } else if (this.state == "done") {
            music.play(music.stringPlayable("E D G F B A C5 B ", 260), music.PlaybackMode.UntilDone)
            info.changeScoreBy(this.currentWeight)
            this.score += this.currentWeight
            game.splash("An Easy " + this.currentWeight + "LBs!", "Lets go for " + (this.currentWeight + 10) + "LBs")
            this.state = "racked"
            this.level += 1
            this.statusBar.value = 100
        }
    }


    protected stop() {
        this.state = "lose"
        effects.clearParticles(this.playerSprite)
        sprites.destroyAllSpritesOfKind(SpriteKind.benchBar)
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        sprites.destroyAllSpritesOfKind(SpriteKind.Text)

        music.stopAllSounds()
        music.play(music.melodyPlayable(music.wawawawaa), music.PlaybackMode.UntilDone)

        if (this.score > 0) {
            if (this.gamesEngine.leftToPlay() > 0) {
                game.splash("You Benched " + this.score + " points!", "Let's try anther lift.")
            } else {
                game.splash("You Benched " + this.score + " points!", "Time for a coffee break!")
            }
        } else {
            game.splash("Oh common!", "Time to get training!")
        }
 
        this.gamesEngine.stop(this)
    }
}