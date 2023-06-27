import Ship from "./Ship";
import { ShipSize } from "./ShipSize";

export default interface ShipsState {
    largeShips: Ship[];
    mediumShips: Ship[];
    smallShips: Ship[];
    tinyShips: Ship[];
  }

  export const shipSizes: Record<keyof ShipsState, ShipSize> = {
    largeShips: 4,
    mediumShips: 3,
    smallShips: 2,
    tinyShips: 1,
  };