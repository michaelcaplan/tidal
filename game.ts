interface Game {
    name: string

    icon: Image

    start(): void

    handleAEvent(): void

    handleBEvent(): void

    handleLeftEvent(): void

    handleRightEvent(): void

    handleGameLoop(): void
}