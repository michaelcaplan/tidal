enum ActionKind {
    Walking,
    Idle,
    Jumping,
    Intro
}

namespace SpriteKind {
    export const Splash = SpriteKind.create()
    export const benchBar = SpriteKind.create()
    export const Lift = SpriteKind.create()
    export const Coatch = SpriteKind.create()
}

namespace StatusBarKind {
    export const Time = StatusBarKind.create()
    export const SquatPower = StatusBarKind.create()
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
