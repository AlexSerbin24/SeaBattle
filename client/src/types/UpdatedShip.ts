import Ship from "./Ship";

type UpdatedShip = Partial<Omit<Ship, "id">>;

export default UpdatedShip;