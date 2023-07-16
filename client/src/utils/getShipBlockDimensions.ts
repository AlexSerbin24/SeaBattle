export default function getShipBlockDimension(){
    const { innerWidth } = window;

    let width = 0, height = 0;

    if (innerWidth > 1239) {
        [width, height] = [45, 46];
    }
    if (innerWidth > 764 && innerWidth < 1240) {
        [width, height] = [30, 31];
    }
    if (innerWidth < 765) {
        [width, height] = [25, 26];
    }

    return {width,height}
}