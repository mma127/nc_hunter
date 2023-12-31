import elysium_data from '../data/elysium_tiles.json';
import cord_data from '../data/cord_tiles.json';
import stygia_data from '../data/stygia_tiles.json';

export const GENERIC = 'generic'
export const ELYSIUM = 'elysium'
export const CORDILLERA = 'cordillera'
export const STYGIA = 'stygia'

export const GENERIC_MAX_X = 100
export const GENERIC_MAX_Y = 100
export const ELYSIUM_MAX_X = 20
export const ELYSIUM_MAX_Y = 20
export const CORDILLERA_MAX_X = 71
export const CORDILLERA_MAX_Y = 53
export const STYGIA_MAX_X = 20
export const STYGIA_MAX_Y = 20

export function getPlaneData(x, y, plane) {
  switch(plane) {
    case ELYSIUM: {
      return getTileData(x, y, elysium_data)
    }
    case CORDILLERA: {
      return getTileData(x, y, cord_data)
    }
    case STYGIA: {
      return getTileData(x, y, stygia_data)
    }
    case GENERIC: {
      return null
    }
    default: {
      throw Error(`Unknown plane ${plane}`)
    }
  }
}

export function getTileData(x, y, source) {
  return source?.[x]?.[y]
}

export function getMaxX(plane) {
  switch(plane) {
    case ELYSIUM: {
      return ELYSIUM_MAX_X
    }
    case CORDILLERA: {
      return CORDILLERA_MAX_X
    }
    case STYGIA: {
      return STYGIA_MAX_X
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
    case CORDILLERA: {
      return CORDILLERA_MAX_Y
    }
    case STYGIA: {
      return STYGIA_MAX_Y
    }
    case GENERIC: {
      return GENERIC_MAX_Y;
    }
    default: {
      throw Error(`Unknown plane ${plane}`)
    }
  }
}
