enum ActionKind {
    Walking,
    Idle,
    Jumping,
    Intro
}
namespace SpriteKind {
    export const Splash = SpriteKind.create()
    export const benchBar = SpriteKind.create()
}




let splashObj = new Splash()
let gamesObj = new Games()
let benchObj = new Bench(gamesObj)
let squatObj = new Squat(gamesObj)
let deadliftObj = new Deadlift(gamesObj)
let overObj = new Over(gamesObj)

gamesObj.add(benchObj)
gamesObj.add(squatObj)
gamesObj.add(deadliftObj)
gamesObj.add(overObj)

/**
 * Kick off game
 */
splashObj.show()
pauseUntil(() => controller.A.isPressed())
splashObj.hide()
gamesObj.start()


/**
 * Squat game startup
 */
function squatStart() {

}

/**
 * Squat game loop
 */
function squatLoop() {
    squatStop()
}

function squatStop() {
    // callGameSelector()
}

/**
 * Start deadlift game
 */
function deadliftStart() {
    scene.setBackgroundImage(assets.image`deadliftHolder`)
    music.play(music.melodyPlayable(music.magicWand), music.PlaybackMode.InBackground)
    pauseUntil(() => controller.A.isPressed())
    // callGameSelector()
}




// /**
//  * Whaaa waa waa
//  */
// function gameOver() {
    
//     scene.setBackgroundImage(assets.image`blank160x120`)
//     scene.setBackgroundColor(8)
//     playerSelectorSprite = sprites.create(playersSprites[playerSelectorCurrent], SpriteKind.Player)
//     playerSelectorSprite.y = 40
//     playerSelectorSprite.setScale(0.5, ScaleAnchor.Middle)
//     playerSelectorSprite.startEffect(effects.confetti, 5000)
//     animation.runMovementAnimation(
//         playerSelectorSprite,
//         animation.animationPresets(animation.bobbing),
//         1000,
//         true
//     )
//     story.startCutscene(function () {
//         if (info.score() == 0) {
//             winMessage = "Ouch!  You can do better then that!"
//         } else {
//             if (info.score() > info.highScore()) {
//                 winMessage = "Heck ya! " + info.score() + " points!  New high score!!!!"
//             } else {
//                 winMessage = "Heck ya! " + info.score() + " points!  Hit the gym to level up."
//             }
//         }
//         story.printCharacterText(winMessage, playersNames[playerSelectorCurrent])
//     })
//     timer.after(5000, function () {
//         if (info.score() == 0) {
//             game.gameOver(false)
//         } else {
//             game.gameOver(true)
//         }
//     })
// }



