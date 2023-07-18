export type GameType = "singleplayer" | "multiplayer";
type GameOptions = {
    room:string,
    type: GameType,
    opponent:string,
    opponentTrophies:number,
    currentPlayer:string,
    winner:string,
}

export default GameOptions;