export default interface Ship{
    id:number,
    coordinates: { x: number; y: number };
    placement: { x: number; y: number };
    isRotated: boolean;
}