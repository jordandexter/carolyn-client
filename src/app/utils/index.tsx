export const GRID_WIDTH = 3000;
export const GRID_HEIGHT = 3000;

export const normalize = (dimension: 'x' | 'y', coordinate: number) => {
    switch(dimension){
        case 'x':
            if(coordinate >= 0)
                return (GRID_WIDTH / 2) + coordinate
            return (GRID_WIDTH / 2) - coordinate
        case 'y':
            if(coordinate < 0)
                return (GRID_HEIGHT / 2) + coordinate;
            return (GRID_HEIGHT / 2) - coordinate
        default:
            return (GRID_WIDTH / 2)
    }
}