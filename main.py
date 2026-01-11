enum ActionKind {
    Walking,
    Idle,
    Jumping,
    Intro
}
namespace SpriteKind {
    export const Splash = SpriteKind.create()
}
function benchLoop () {
    benchBarHeight = (benchLeftSprite.y + benchRightSprite.y) / 2
    benchCurrentWeight = 135 + benchLevel * 10
    benchGravity = benchCurrentWeight * 0.01
    if (benchBarHeight > 30 && benchBarHeight < 60) {
        benchGravity = benchGravity * 1.5
    }
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (game2 == "bench") {
        benchBButton()
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (game2 == "bench") {
        benchAButton()
    }
})
function benchAButton () {
    benchLeftSprite.y += -1
}
function clearSplash () {
    music.stopAllSounds()
    music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.InBackground)
    sprites.destroyAllSpritesOfKind(SpriteKind.Splash, effects.spray, 500)
    sprites.destroy(splashStart, effects.spray, 500)
}
function benchStart () {
    benchLevel = 1
    benchRightSprite = sprites.create(assets.image`rightHand`, SpriteKind.Player)
    benchRightSprite.setPosition(110, 80)
    benchLeftSprite = sprites.create(assets.image`leftHand`, SpriteKind.Player)
    benchLeftSprite.setPosition(50, 80)
}
function callGameSelector () {
    game2 = "bench"
    if (game2 == "bench") {
        benchStart()
    }
}
function splash () {
    splashTidal = sprites.create(assets.image`tidal`, SpriteKind.Splash)
    splashTidal.setScale(0.25, ScaleAnchor.Middle)
    splashTidal.setPosition(80, 64)
    splashTitle = sprites.create(assets.image`title-1`, SpriteKind.Splash)
    splashTitle.setPosition(80, 16)
    splashTitleAnimation = animation.createAnimation(ActionKind.Walking, 500)
    splashTitleAnimation.addAnimationFrame(assets.image`title-1`)
    splashTitleAnimation.addAnimationFrame(assets.image`title-2`)
    animation.attachAnimation(splashTitle, splashTitleAnimation)
    animation.setAction(splashTitle, ActionKind.Walking)
    splashStart = textsprite.create(" To Start", 0, 8)
    splashStart.setMaxFontHeight(10)
    splashStart.setIcon(assets.image`abutton`)
    splashStart.setPosition(80, 104)
}
function benchBButton () {
    benchRightSprite.y += -1
}
let splashTitleAnimation: animation.Animation = null
let splashTitle: Sprite = null
let splashTidal: Sprite = null
let splashStart: TextSprite = null
let game2 = ""
let benchGravity = 0
let benchLevel = 0
let benchCurrentWeight = 0
let benchRightSprite: Sprite = null
let benchLeftSprite: Sprite = null
let benchBarHeight = 0
splash()
pauseUntil(() => controller.A.isPressed())
clearSplash()
callGameSelector()
game.onUpdate(function () {
    if (game2 == "bench") {
        benchLoop()
    }
})
