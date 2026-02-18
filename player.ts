class Player implements Game {
    
    name: string = "Player Select"
    icon: Image = assets.image`blank16x16`
    
    private names: string[] = [
        "Brendan",
        "Catherine",
        "Mitchell",
        "Glenn",
        "Courtney",
        "Tom",
        "Abi",
        "Elsa",
        "Tobi"
    ]
    private sprites: Image[] = [
        assets.image`playerBrendan`,
        assets.image`playerCatherine`,
        assets.image`playerMitchell`,
        assets.image`playerGlenn`,
        assets.image`playerCourtney`,
        assets.image`playerTom`,
        assets.image`playerAbi`,
        assets.image`playerElsa`,
        assets.image`playerToby`
    ]
    private selectorName: TextSprite = null
    private selectorTitle: TextSprite = null
    private selectorSprite: Sprite = null
    private gamesEngine: Games = null
    /**
     * Holds the selected player
     */
    public current = 0

    constructor(gamesEngine: Games) {
        this.gamesEngine = gamesEngine
    }
    
    public start() {
        scene.setBackgroundColor(8)
        this.selectorTitle = textsprite.create("<- Choose Your Athlete ->", 0, 1)
        this.selectorTitle.setKind(SpriteKind.Player)
        this.selectorTitle.setPosition(80, 20)
        
        this.current = 0
        
        this.selectorSprite = sprites.create(assets.image`blank16x16`, SpriteKind.Player)
        this.selectorName = textsprite.create("")
        this.selectorName.setPosition(80, 100)
        this.selectorName.setKind(SpriteKind.Player)
        this.drawCurrent()
    }

    get selectedPlayerName() {
        return this.names[this.current]
    }

    get selectedPlayerImage() {
        return this.sprites[this.current]
    }

    protected drawCurrent() {
        this.selectorSprite.setImage(this.sprites[this.current])
        this.selectorSprite.setScale(0.5, ScaleAnchor.Middle)
        this.selectorSprite.setPosition(80, 60)
        this.selectorName.setText(this.names[this.current])
        this.selectorName.setPosition(80, 100)
    }

    /**
     * Choose your player right button event
     */
    public handleRightEvent() {
        this.current += 1
        if (this.current >= this.sprites.length) {
            this.current = 0
        }
        music.play(music.melodyPlayable(music.magicWand), music.PlaybackMode.InBackground)
        this.drawCurrent()
    }

    /**
     * Choose your player left button event
     */
    public handleLeftEvent() {
        this.current += -1
        if (this.current < 0) {
            this.current = this.sprites.length - 1
        }
        music.play(music.melodyPlayable(music.magicWand), music.PlaybackMode.InBackground)
        this.drawCurrent()
    }

    /**
     * Choose your player A button event
     */
    public handleAEvent() {
        music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.UntilDone)
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        scene.setBackgroundColor(15)

        this.gamesEngine.stop(this)
    }

    public handleBEvent() {
        // do nothing
    }

    public handleGameLoop() {
        // do nothing
    }

}