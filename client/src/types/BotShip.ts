import Ship from "./Ship";

type BotShip = Pick<Ship,"isRotated" | "boardSquaresIds">

export default BotShip;