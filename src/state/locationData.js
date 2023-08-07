import elysium_data from '../data/elysium_tiles.json';

export const GENERIC = 'generic'
export const ELYSIUM = 'elysium'

export const GENERIC_MAX_X = 100
export const GENERIC_MAX_Y = 100
export const ELYSIUM_MAX_X = 20
export const ELYSIUM_MAX_Y = 20

export function getElysiumTile(x, y) {
  return elysium_data[x][y]
}

export function getMaxX(plane) {
  switch(plane) {
    case ELYSIUM: {
      return ELYSIUM_MAX_X
    }
    case GENERIC: {
      return GENERIC_MAX_X;
    }
    default: {
      throw Error(`Unknown plane ${plane}`)
    }
  }
}

export function getMaxY(plane) {
  switch(plane) {
    case ELYSIUM: {
      return ELYSIUM_MAX_Y
    }
    case GENERIC: {
      return GENERIC_MAX_Y;
    }
    default: {
      throw Error(`Unknown plane ${plane}`)
    }
  }
}
