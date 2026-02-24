class Splash {

    protected titleAnimation: animation.Animation = null
    protected title: Sprite = null
    protected tidal: Sprite = null
    protected start: TextSprite = null
    protected players: Player = null
    protected showing: boolean = false
    protected count: number = 0

    constructor() {

    }

    public show(players : Player) {

        this.players = players
        
        music.play(music.createSong(assets.song`splashTunes`), music.PlaybackMode.LoopingInBackground)

        this.tidal = sprites.create(assets.image`tidal`, SpriteKind.Splash)
        this.tidal.setScale(0.25, ScaleAnchor.Middle)
        this.tidal.setPosition(80, 64)
        this.title = sprites.create(assets.image`title-1`, SpriteKind.Splash)
        this.title.setPosition(80, 16)
        
        this.titleAnimation = animation.createAnimation(ActionKind.Walking, 500)
        this.titleAnimation.addAnimationFrame(assets.image`title-1`)
        this.titleAnimation.addAnimationFrame(assets.image`title-2`)
        animation.attachAnimation(this.title, this.titleAnimation)
        animation.setAction(this.title, ActionKind.Walking)
        
        this.start = textsprite.create(" To Start", 0, 8)
        this.start.setMaxFontHeight(10)
        this.start.setIcon(assets.image`abutton`)
        this.start.setPosition(80, 104)

        game.onUpdateInterval(4000, () => {
            if (!this.showing) {
                return
            }

            if (this.count < 2) {
                this.count++
                return
            }

            this.count++

            let coatchImage = this.players.randomImage;
            let coatchFlip = randint(0, 4)

            if (coatchFlip === 0) {
                coatchImage.flipX()
            } else if (coatchFlip == 2) {
                coatchImage.flipY()
            } else if (coatchFlip == 3) {
                coatchImage.flipX()
                coatchImage.flipY()
            }

            let coatch = sprites.create(coatchImage, SpriteKind.SplashCoatch)
            coatch.setFlag(SpriteFlag.AutoDestroy, true)
            coatch.setScale(.3, ScaleAnchor.Middle)
            coatch.z = -10

            let position = randint(0, 3)

            let effectChoices = [
                effects.hearts,
                effects.smiles,
                effects.rings,
                effects.fire,
                effects.warmRadial,
                effects.coolRadial,
                effects.halo,
                effects.ashes,
                effects.blizzard,
                effects.bubbles,
                effects.starField
            ]

            // top left
            if (position === 0) {
                coatch.setPosition(0, 0)
                coatch.setVelocity(randint(30, 60), randint(30, 60))
                coatch.startEffect(effectChoices[randint(0, effectChoices.length - 1)])
            } else if (position === 1) {
                // top right
                coatch.setPosition(160, 0)
                coatch.setVelocity(randint(-30, -60), randint(30, 60))
                coatch.startEffect(effectChoices[randint(0, effectChoices.length - 1)])
            } else if (position === 2) {
                // bottom left
                coatch.setPosition(0, 120)
                coatch.setVelocity(randint(30, 60), randint(-30, -60))
                coatch.startEffect(effectChoices[randint(0, effectChoices.length - 1)])
            } else if (position === 3) {
                // bottom right
                coatch.setPosition(160, 120)
                coatch.setVelocity(randint(-30, -60), randint(-30, -60))
                coatch.startEffect(effectChoices[randint(0, effectChoices.length - 1)])
            }
        })


        this.showing = true
    }

    public hide() {
        this.showing = false
        music.stopAllSounds()
        music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
        sprites.destroyAllSpritesOfKind(SpriteKind.Splash, effects.hearts, 500)
        sprites.destroy(this.start, effects.hearts, 500)
        pause(500)
    }
}