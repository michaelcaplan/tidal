class Games {
    private currentGame: string = null
    private games: { [key: string]: Game } = {}
    private gamesMenu: miniMenu.MenuItem [] = []

    public player: Player = null

    constructor() {
        this.player = new Player(this)

        this.add(this.player)

        /**
         * Manage P1 left button
         */
        controller.left.onEvent(ControllerButtonEvent.Pressed, () => {
            this.handleLeftEvent()
        })

        /**
         * Manage P2 right button
         */
        controller.right.onEvent(ControllerButtonEvent.Pressed, () => {
            this.handleRightEvent()
        })

        /**
         * Manage P1 A button
         */
        controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
            this.handleAEvent()
        })

        /**
         * Manage P1 B Button
         */
        controller.B.onEvent(ControllerButtonEvent.Pressed, () => {
            this.handleBEvent()
        })

        /**
         * Main game loop
         */
        game.onUpdate(() => {
            this.handleGameLoop()
        })


    }

    get game() {
        return this.currentGame
    }

    /**
     * Add game to engine
     * @param game 
     */
    public add(game: Game) {
        this.games[game.name] = game

        this.gamesMenu.push(
            miniMenu.createMenuItem(game.name, game.icon),
        )
    }

    /**
     * Mark a game as stopped
     * @param game 
     */
    public stop(game: Game) {
        this.currentGame = null
        for (let index = 0; index < this.gamesMenu.length; index++) {
            if (this.gamesMenu[index].text == game.name) {
                this.gamesMenu.removeAt(index)
                break
            }
        }

        timer.debounce("selectGame", 500, () => {
            this.selectGame()
        })
        
    }

    public leftToPlay() {
        let count = this.gamesMenu.length
        count-- // sub 1 for coffee break

        if (this.currentGame !== null) {
            count-- // sub 1 for current game
        }

        return count
    }

    protected handleAEvent() {
        if (this.currentGame == null) {
            return
        }

        this.games[this.currentGame].handleAEvent()
    }

    protected handleBEvent() {
        if (this.currentGame == null) {
            return
        }

        this.games[this.currentGame].handleBEvent()
    }

    protected handleLeftEvent() {
        if (this.currentGame == null) {
            return
        }
        
        this.games[this.currentGame].handleLeftEvent()
    }

    protected handleRightEvent() {
        if (this.currentGame == null) {
            return
        }
        
        this.games[this.currentGame].handleRightEvent()
    }

    protected handleGameLoop() {
        if (this.currentGame == null) {
            return
        }
        
        this.games[this.currentGame].handleGameLoop()
    }

    public start() {
        this.currentGame = this.player.name
        this.player.start()
    }

    /**
     * Draw game selector screen
     */
    protected selectGame() {

        scene.setBackgroundImage(assets.image`blank160x120`)

        if (this.gamesMenu.length == 1) {
            // game over
            this.games["Coffee Break"].start()
            return
        }

        let gameSelectorSprite = miniMenu.createMenuFromArray(this.gamesMenu)

        miniMenu.setDimensions(gameSelectorSprite, 140, 90)
        miniMenu.setTitle(gameSelectorSprite, "Pick Your Lift")
        miniMenu.setStyleProperty(gameSelectorSprite, miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, 9)
        miniMenu.setStyleProperty(gameSelectorSprite, miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 8)
        gameSelectorSprite.setPosition(80, 60)
        miniMenu.setFrame(gameSelectorSprite, assets.image`gameMenuBack`)
        miniMenu.onButtonPressed(gameSelectorSprite, miniMenu.Button.A, (selection, selectedIndex) => {

            // look for a button release to avoice carrying the a button event forward
            pauseUntil(() => !(controller.A.isPressed()))

            this.currentGame = selection
            miniMenu.close(gameSelectorSprite)

            this.games[selection].start()
        })
    }


}