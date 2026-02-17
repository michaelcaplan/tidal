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


let splashTitleAnimation: animation.Animation = null
let splashTitle: Sprite = null
let splashTidal: Sprite = null
let splashStart: TextSprite = null

/**
 * Hold current game
 */
let gameSelected = ""
let games = [
    miniMenu.createMenuItem("Bench Press", assets.image`gameBench`),
    miniMenu.createMenuItem("Back Squat", assets.image`gameSquat`),
    miniMenu.createMenuItem("Deadlift", assets.image`gameDeadlift`),
    miniMenu.createMenuItem("Coffee Break", assets.image`gameCoffee`)
]

let playersNames: string[] = []
let playersSprites: Image[] = []
let playerSelectorName: TextSprite = null
let playerSelectorTitle: TextSprite = null
let playerSelectorSprite: Sprite = null
playersSprites = [
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
playersNames = [
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
/**
 * Holds the selected player
 */
let playerSelectorCurrent = 0

let benchHudAction: TextSprite = null
let benchHudWeight: TextSprite = null
let benchHudLevel: TextSprite = null
let benchRightArmSprite: Sprite = null
let benchLeftArmSprite: Sprite = null
let benchBarSprite: Sprite = null
let benchBarBottom = 0
let benchMaxTilt = 0
let benchTilt = 0
let benchBarMidBottom = 0
let benchBarMidTop = 0
let benchGravity = 0
let benchPlayerSprite: Sprite = null
let benchBarTop = 0
let benchStatusBar: StatusBarSprite = null
let benchState = ""
let benchLevel = 0
let benchCurrentWeight = 0
let benchBarHeight = 0
let benchGameLoopHealthLast = 0
let benchGameLoopHealthCurrent = 0
let benchGameLoopLast = 0
let benchGameLoopCurrent = 0
let benchRightSprite: Sprite = null
let benchLeftSprite: Sprite = null
let benchLeftArm: Image = null
let benchRightArm: Image = null
let benchScore = 0

let winMessage = ""


let splashObj = new Splash()

/**
 * Kick off game
 */
splash()
pauseUntil(() => controller.A.isPressed())
clearSplash()
playerSelector()


/**
 * Main game loop
 */
game.onUpdate(function () {
    if (gameSelected == "Bench Press") {
        benchLoop()
    } else if (gameSelected == "Back Squat") {
        squatLoop()
    }
})

/**
 * Manage P1 A button
 */
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameSelected == "Bench Press") {
        benchAButton()
    } else if (gameSelected == "Player Selector") {
        playerSelectorAButton()
    }
})

/**
 * Manage P1 B Button
 */
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameSelected == "Bench Press") {
        benchBButton()
    }
})

/**
 * Manage P1 left button
 */
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameSelected == "Player Selector") {
        playerSelectorLeftButton()
    }
})

/**
 * Manage P2 right button
 */
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameSelected == "Player Selector") {
        playerSelectorRightButton()
    }
})

/**
 * Intro screen
 */
function splash() {
    music.play(music.createSong(assets.song`splashTunes`), music.PlaybackMode.LoopingInBackground)
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

/**
 * Clean up intro screen
 */
function clearSplash() {
    music.stopAllSounds()
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
    sprites.destroyAllSpritesOfKind(SpriteKind.Splash, effects.hearts, 500)
    sprites.destroy(splashStart, effects.hearts, 500)
    pause(500)
}

/**
 * Choose your player screen
 */
function playerSelector() {
    scene.setBackgroundColor(8)
    gameSelected = "Player Selector"
    playerSelectorTitle = textsprite.create("<- Choose Your Athlete ->", 0, 1)
    playerSelectorTitle.setKind(SpriteKind.Player)
    playerSelectorTitle.setPosition(80, 20)
    playerSelectorCurrent = 0
    playerSelectorSprite = sprites.create(assets.image`blank16x16`, SpriteKind.Player)
    playerSelectorName = textsprite.create("")
    playerSelectorName.setPosition(80, 100)
    playerSelectorName.setKind(SpriteKind.Player)
    playerSelectorDrawCurrent()
}

/**
 * Choose your player draw current player
 */
function playerSelectorDrawCurrent() {
    playerSelectorSprite.setImage(playersSprites[playerSelectorCurrent])
    playerSelectorSprite.setScale(0.5, ScaleAnchor.Middle)
    playerSelectorSprite.setPosition(80, 60)
    playerSelectorName.setText(playersNames[playerSelectorCurrent])
    playerSelectorName.setPosition(80, 100)
}

/**
 * Choose your player right button event
 */
function playerSelectorRightButton() {
    playerSelectorCurrent += 1
    if (playerSelectorCurrent >= playersSprites.length) {
        playerSelectorCurrent = 0
    }
    music.play(music.melodyPlayable(music.magicWand), music.PlaybackMode.InBackground)
    playerSelectorDrawCurrent()
}

/**
 * Choose your player left button event
 */
function playerSelectorLeftButton() {
    playerSelectorCurrent += -1
    if (playerSelectorCurrent < 0) {
        playerSelectorCurrent = playersSprites.length - 1
    }
    music.play(music.melodyPlayable(music.magicWand), music.PlaybackMode.InBackground)
    playerSelectorDrawCurrent()
}

/**
 * Choose your player A button event
 */
function playerSelectorAButton() {
    music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.UntilDone)
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    scene.setBackgroundColor(15)
    gameSelected = "Game Selector"
    // Do in timer to not carry a button event over to game selector screen
    timer.background(function () {
        callGameSelector()
    })
}

/**
 * Drawe game selector screen
 */
function callGameSelector() {
    gameSelected = ""
    scene.setBackgroundImage(assets.image`blank160x120`)
    let gameSelectorSprite = miniMenu.createMenuFromArray(games)

    miniMenu.setDimensions(gameSelectorSprite, 140, 90)
    miniMenu.setTitle(gameSelectorSprite, "Pick Your Lift")
    miniMenu.setStyleProperty(gameSelectorSprite, miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, 9)
    miniMenu.setStyleProperty(gameSelectorSprite, miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 8)
    gameSelectorSprite.setPosition(80, 60)
    miniMenu.setFrame(gameSelectorSprite, assets.image`gameMenuBack`)
    miniMenu.onButtonPressed(gameSelectorSprite, miniMenu.Button.A, function (selection, selectedIndex) {
        
        // look for a button release to avoice carrying the a button event forward
        pauseUntil(() => !(controller.A.isPressed()))

        miniMenu.removeMenuItem(gameSelectorSprite, selectedIndex)

        gameSelected = selection
        miniMenu.close(gameSelectorSprite)
        if (selection == "Bench Press") {
            benchStart()
        } else if (selection == "Back Squat") {
            squatStart()
        } else if (selection == "Deadlift") {
            deadliftStart()
        } else if (selection == "Coffee Break") {
            gameOver()
        }
    })
}



/**
 * Bench game startup
 */
function benchStart() {
    music.play(music.createSong(assets.song`benchTunes`), music.PlaybackMode.LoopingInBackground)
    scene.setBackgroundImage(assets.image`benchBackground`)
    benchState = "racked"
    benchBarTop = 35
    benchBarMidBottom = 50
    benchBarMidTop = 40
    benchBarBottom = 60
    benchLevel = 1
    benchPlayerSprite = sprites.create(assets.image`benchPlayer`, SpriteKind.Player)
    benchPlayerSprite.setPosition(80, 70)
    benchPlayerSprite.z = 10
    benchLeftArmSprite = sprites.create(assets.image`blank10x10`, SpriteKind.Player)
    benchLeftArmSprite.setPosition(65, 70)
    benchLeftArmSprite.z = 0
    benchRightArmSprite = sprites.create(assets.image`blank10x10`, SpriteKind.Player)
    benchRightArmSprite.setPosition(90, 70)
    benchRightArmSprite.z = 0
    benchStatusBar = statusbars.create(60, 4, StatusBarKind.Health)
    benchStatusBar.value = 100
    benchStatusBar.positionDirection(CollisionDirection.Bottom)
    benchStatusBar.setOffsetPadding(0, 20)
    benchStatusBar.attachToSprite(benchPlayerSprite)
    benchRightSprite = sprites.create(assets.image`rightHand`, SpriteKind.benchBar)
    benchRightSprite.setPosition(110, 40)
    benchLeftSprite = sprites.create(assets.image`leftHand`, SpriteKind.benchBar)
    benchLeftSprite.setPosition(50, 40)
    benchBarSprite = sprites.create(assets.image`benchBar`, SpriteKind.benchBar)
    benchBarSprite.setPosition(80, 40)
    benchBarSprite.z = -10
    benchHudLevel = textsprite.create("Entering Level", 15, 0)
    benchHudLevel.setPosition(50, 110)
    benchHudWeight = textsprite.create("Weight ?", 15, 0)
    benchHudWeight.setPosition(100, 110)
    benchHudAction = textsprite.create("Ready?", 15, 0)
    benchHudAction.setPosition(80, 10)
}

/** 
 * Bench game game loop
 */
function benchLoop() {
    if (!(benchLeftSprite) || !(benchRightSprite)) {
        return
    }
    benchGameLoopCurrent = game.runtime() - benchGameLoopLast
    benchGameLoopHealthCurrent = game.runtime() - benchGameLoopHealthLast
    benchBarHeight = (benchLeftSprite.y + benchRightSprite.y) / 2
    benchCurrentWeight = 65 + benchLevel * 10
    if (benchState == "press") {
        if (benchGameLoopHealthCurrent >= 150) {
            benchGameLoopHealthLast = game.runtime()
            benchStatusBar.value += -1
            if (benchStatusBar.value == 0) {
                benchStop()
            }
        }
        if (benchGameLoopCurrent >= 1000) {
            benchGameLoopLast = game.runtime()
            if (benchLeftSprite.y <= benchBarTop && benchRightSprite.y <= benchBarTop) {
                benchState = "pressed"
                benchRightSprite.y = benchBarTop
                benchLeftSprite.y = benchBarTop
                effects.clearParticles(benchPlayerSprite)
                benchUpdateHud()
            }
            benchGravity = benchCurrentWeight * 0.01
            // Mid point stick
            if (benchBarHeight > benchBarMidTop && benchBarHeight < benchBarMidBottom) {
                benchGravity = benchGravity * 1.5
                benchPlayerSprite.startEffect(effects.spray)
            }
            benchTilt = Math.abs(benchLeftSprite.y - benchRightSprite.y)
            benchMaxTilt = 20 - benchCurrentWeight / 20
            if (benchTilt > benchMaxTilt) {
                // Severe penalty for uneven lifting
                benchGravity = benchGravity * 2
                benchPlayerSprite.startEffect(effects.spray)
            }
            if (benchLeftSprite.y < benchBarBottom) {
                benchLeftSprite.y = benchLeftSprite.y + benchGravity
            } else {
                benchLeftSprite.y = benchBarBottom
            }
            if (benchRightSprite.y < benchBarBottom) {
                benchRightSprite.y = benchRightSprite.y + benchGravity
            } else {
                benchRightSprite.y = benchBarBottom
            }
        }
    } else if (benchState == "decend") {
        benchLeftSprite.vy = 60
        benchRightSprite.vy = 60
        if (benchBarHeight >= benchBarBottom) {
            benchLeftSprite.vy = 0
            benchLeftSprite.y = benchBarBottom
            benchRightSprite.vy = 0
            benchRightSprite.y = benchBarBottom
            benchState = "press"
        }
    } else {

    }
    benchUpdateBar()
    benchUpdateArms()
    benchUpdateHud()
}

/**
 * Draw the bench bar height and rotation
 */
function benchUpdateBar() {
    benchBarSprite.y = (benchLeftSprite.y + benchRightSprite.y) / 2
    transformSprites.rotateSprite(benchBarSprite, benchRightSprite.y - benchLeftSprite.y)
}

/**
 * Draw those elasta arms running from body up to bar
 */
function benchUpdateArms() {
    benchLeftArm = image.create(15, benchPlayerSprite.y - benchBarSprite.y)
    benchLeftArm.drawLine(0, 0, image.getDimension(benchLeftArm, image.Dimension.Width), image.getDimension(benchLeftArm, image.Dimension.Height), 13)
    benchLeftArm.drawLine(1, 0, image.getDimension(benchLeftArm, image.Dimension.Width) + 1, image.getDimension(benchLeftArm, image.Dimension.Height) + 1, 13)
    benchLeftArm.drawLine(2, 0, image.getDimension(benchLeftArm, image.Dimension.Width) + 2, image.getDimension(benchLeftArm, image.Dimension.Height) + 2, 13)
    benchLeftArmSprite.setImage(benchLeftArm)
    benchLeftArmSprite.top = benchBarSprite.bottom
    benchRightArm = image.create(15, benchPlayerSprite.y - benchBarSprite.y)
    benchRightArm.drawLine(image.getDimension(benchRightArm, image.Dimension.Width), 0, 0, image.getDimension(benchRightArm, image.Dimension.Height), 13)
    benchRightArm.drawLine(image.getDimension(benchRightArm, image.Dimension.Width) + 1, 0, 0, image.getDimension(benchRightArm, image.Dimension.Height) + 1, 13)
    benchRightArm.drawLine(image.getDimension(benchRightArm, image.Dimension.Width) + 2, 0, 0, image.getDimension(benchRightArm, image.Dimension.Height) + 2, 13)
    benchRightArmSprite.setImage(benchRightArm)
    benchRightArmSprite.top = benchBarSprite.bottom
}

/**
 * Draw bench heads up display
 */
function benchUpdateHud() {
    benchHudLevel.setText("Level " + benchLevel)
    benchHudWeight.setText("Weight " + benchCurrentWeight + "LBs")
    if (benchState == "racked") {
        benchHudAction.setText("Press A To Unrack")
        benchHudAction.setPosition(80, 10)
    } else if (benchState == "press") {
        if (benchTilt > benchMaxTilt) {
            benchHudAction.setText("UNEVEN!!!!")
            benchHudAction.setPosition(80, 10)
        } else {
            benchHudAction.setText("PUSH!! (A+B)")
            benchHudAction.setPosition(80, 10)
        }
    } else if (benchState == "unracked") {
        benchHudAction.setText("Press A To Descend")
        benchHudAction.setPosition(80, 10)
    } else if (benchState == "unracked") {
        benchHudAction.setText("DESCENDING!")
        benchHudAction.setPosition(80, 10)
    } else if (benchState == "pressed") {
        benchHudAction.setText("Press A to Re-Rack")
        benchHudAction.setPosition(80, 10)
    } else if (benchState == "done") {
        music.play(music.stringPlayable("E D G F B A C5 B ", 260), music.PlaybackMode.UntilDone)
        info.changeScoreBy(benchCurrentWeight)
        benchScore += benchCurrentWeight
        game.splash("An Easy " + benchCurrentWeight + "LBs!", "Lets go for " + (benchCurrentWeight + 10) + "LBs")
        benchState = "racked"
        benchLevel += 1
        benchStatusBar.value = 100
    }
}

/**
 * Bench A button event
 */
function benchAButton() {
    if (benchState == "press") {
        if (benchLeftSprite.y > benchBarTop) {
            benchLeftSprite.y += -1
        }
    } else if (benchState == "racked") {
        benchState = "unracked"
        music.play(music.createSoundEffect(WaveShape.Noise, 3900, 3500, 255, 0, 10, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
        benchLeftSprite.y += -5
        benchRightSprite.y += -5
    } else if (benchState == "unracked") {
        benchState = "decend"
    } else if (benchState == "pressed") {
        benchState = "done"
        music.play(music.createSoundEffect(WaveShape.Noise, 3900, 3500, 255, 0, 10, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
        benchLeftSprite.y += 5
        benchRightSprite.y += 5
    }
}


/**
 * Bench B button event
 */
function benchBButton() {
    if (benchState == "press") {
        if (benchRightSprite.y > benchBarTop) {
            benchRightSprite.y += -1
        }
    }
}

function benchStop() {
    sprites.destroyAllSpritesOfKind(SpriteKind.benchBar)
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Text)

    if (benchScore > 0) {
        if (games.length > 1) {
            game.splash("You Benched " + benchScore + "LBs!", "Pick another lift to beat that score!")
        } else {
            game.splash("You Benched " + benchScore + "LBs!", "Great job!  Time for a coffee break!")
        }
    } else {
        game.splash("You couldn't even bench 75LBs?", "Maybe it's time for a coffee break...")
    }
    music.stopAllSounds()

    callGameSelector()
}


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
    callGameSelector()
}

/**
 * Start deadlift game
 */
function deadliftStart() {
    scene.setBackgroundImage(assets.image`deadliftHolder`)
    music.play(music.melodyPlayable(music.magicWand), music.PlaybackMode.InBackground)
    pauseUntil(() => controller.A.isPressed())
    callGameSelector()
}




/**
 * Whaaa waa waa
 */
function gameOver() {
    
    scene.setBackgroundImage(assets.image`blank160x120`)
    scene.setBackgroundColor(8)
    playerSelectorSprite = sprites.create(playersSprites[playerSelectorCurrent], SpriteKind.Player)
    playerSelectorSprite.y = 40
    playerSelectorSprite.setScale(0.5, ScaleAnchor.Middle)
    playerSelectorSprite.startEffect(effects.confetti, 5000)
    animation.runMovementAnimation(
        playerSelectorSprite,
        animation.animationPresets(animation.bobbing),
        1000,
        true
    )
    story.startCutscene(function () {
        if (info.score() == 0) {
            winMessage = "Ouch!  You can do better then that!"
        } else {
            if (info.score() > info.highScore()) {
                winMessage = "Heck ya! " + info.score() + " points!  New high score!!!!"
            } else {
                winMessage = "Heck ya! " + info.score() + " points!  Hit the gym to level up."
            }
        }
        story.printCharacterText(winMessage, playersNames[playerSelectorCurrent])
    })
    timer.after(5000, function () {
        if (info.score() == 0) {
            game.gameOver(false)
        } else {
            game.gameOver(true)
        }
    })
}



