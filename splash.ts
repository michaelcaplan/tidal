class Splash {

    protected titleAnimation: animation.Animation = null
    protected title: Sprite = null
    protected tidal: Sprite = null
    protected start: TextSprite = null


    constructor() {
    }

    public show() {
        
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
    }

    public hide() {
        music.stopAllSounds()
        music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
        sprites.destroyAllSpritesOfKind(SpriteKind.Splash, effects.hearts, 500)
        sprites.destroy(this.start, effects.hearts, 500)
        pause(500)
    }
}