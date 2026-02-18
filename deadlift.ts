class Deadlift implements Game {

    name: string = "Deadlift"
    icon: Image = assets.image`gameDeadlift`

    protected gameEngine: Games = null

    constructor(gamesEngine: Games) {
        this.gameEngine = gamesEngine
    }

    public start() {
        scene.setBackgroundImage(assets.image`deadliftHolder`)
        music.play(music.melodyPlayable(music.magicWand), music.PlaybackMode.InBackground)
    }

    public handleAEvent() {
        scene.setBackgroundImage(assets.image`blank160x120`)
        music.stopAllSounds()
        this.gameEngine.stop(this)
    }
    
    public handleBEvent() {
        
    }

    public handleLeftEvent() {

    }

    public handleRightEvent() {

    }

    public handleGameLoop() {
        // do nothing
    }
}