import _ from "lodash";
import {
  FOV_2,
  FOV_3,
  MAX_LENGTH_13,
  MAX_LENGTH_9,
  SIDE_LENGTH_13,
  SIDE_LENGTH_9
} from "../components/TileGrid";
import {Location} from "../models/Location";
import {getMaxX, getMaxY, getPlaneData} from "./locationData";

function getFovLengths(fov) {
  switch(fov){
    case FOV_2:
      return {
        maxLength: MAX_LENGTH_13,
        sideLength: SIDE_LENGTH_13
      }
    case FOV_3:
      return {
        maxLength: MAX_LENGTH_13,
        sideLength: SIDE_LENGTH_13
      }
    default:
      throw Error(`Unknown FOV value ${fov}`)
  }
}

export function selectPlane(plane) {
  return {
    type: "select_plane",
    data: plane
  }
}

export function selectFoV(fov) {
  const lengths = getFovLengths(fov)
  return {
    type: "select_fov",
    data: {
      fov: fov,
      maxLength: lengths.maxLength,
      sideLength: lengths.sideLength
    }
  }
}

/**
 * Given user's initial tracking result, create tiles map and return payload for action
 */
export function addInitialResult(initialResult, plane, fov) {
  const tiles = new Map()

  const characters = initialResult.characters
  const lengths = getFovLengths(fov)

  // Assume initial [x,y] are in bounds of the plane
  const centerX = initialResult.x
  const centerY = initialResult.y
  const topLeftX = centerX - lengths.sideLength
  const topLeftY = centerY - lengths.sideLength
  const bottomRightX = Math.min(topLeftX + lengths.maxLength, getMaxX(plane) + 1)
  const bottomRightY = Math.min(topLeftY + lengths.maxLength, getMaxY(plane) + 1)
  const yRange = _.range(topLeftY, bottomRightY)
  const xRange = _.range(topLeftX, bottomRightX)

  // Create initial two dimensional map by y then x
  yRange.forEach(y => {
    const yMap = new Map()
    xRange.forEach(x => {
      const planeData = getPlaneData(x, y, plane)
      if (_.isNil(planeData)) return // SKIP creating a location object if there is no corresponding tile in the JSON

      const location = new Location(x, y, plane, fov)
      location.updateInitialCharactersInFov(centerX, centerY, characters)
      yMap.set(x, location)
    })

    tiles.set(y, yMap)
  });

  const charactersByName = characters.reduce((accumulator, currentValue) => {
    accumulator[currentValue.lowerName()] = currentValue
    return accumulator
  }, {})

  return {
    type: "add_initial_result",
    data: {
      initialResult: initialResult,
      tiles: tiles,
      charactersByName: charactersByName
    },
  }
}

export function setNewTrackingCoordinates(x, y) {
  return {
    type: "set_tracking_coordinates",
    data: {
      x: x,
      y: y
    }
  }
}

export function addResult(tiles, trackingResult, charactersByName) {
  const trackingX = trackingResult.x,
    trackingY = trackingResult.y,
    characters = trackingResult.characters;
  for(const row of tiles.values()) {
    for(const location of row.values()) {
      // Is location in FOV of the tracking result?
      if (location.inFieldOfView(trackingX, trackingY)) {
        // If so, update names
        location.updateCharacters(characters)
      } else {
        // If not, remove tracking result names from location names
        location.removeCharacters(characters)
      }
    }
  }

  const newCharactersByName = {...charactersByName};
  characters.forEach(character => {
    if (!_.has(newCharactersByName, character.lowerName())) {
      _.set(newCharactersByName, character.lowerName(), character)
    }
  })

  return {
    type: "add_result",
    data: {
      result: trackingResult,
      tiles: tiles,
      charactersByName: newCharactersByName
    },
  }
}

export function resetGrid() {
  return {type: "reset"}
}

