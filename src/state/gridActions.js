import _ from "lodash";
import {MAX_LENGTH, SIDE_LENGTH} from "../components/TileGrid";
import {Location} from "../models/Location";
import {getMaxX, getMaxY, getPlaneData} from "./locationData";

export function selectPlane(plane) {
  return {
    type: "select_plane",
    data: plane
  }
}

/**
 * Given user's initial tracking result, create tiles map and return payload for action
 */
export function addInitialResult(initialResult, plane) {
  const tiles = new Map()

  const names = initialResult.names

  // Assume initial [x,y] are in bounds of the plane
  const centerX = initialResult.x
  const centerY = initialResult.y
  const topLeftX = centerX - SIDE_LENGTH
  const topLeftY = centerY - SIDE_LENGTH
  const bottomRightX = Math.min(topLeftX + MAX_LENGTH, getMaxX(plane) + 1)
  const bottomRightY = Math.min(topLeftY + MAX_LENGTH, getMaxY(plane) + 1)
  const yRange = _.range(topLeftY, bottomRightY)
  const xRange = _.range(topLeftX, bottomRightX)

  // Create initial two dimensional map by y then x
  yRange.forEach(y => {
    const yMap = new Map()
    xRange.forEach(x => {
      const planeData = getPlaneData(x, y, plane)
      if (_.isNil(planeData)) return // SKIP creating a location object if there is no corresponding tile in the JSON

      const location = new Location(x, y, plane)
      location.maybeUpdateNames(centerX, centerY, names)
      yMap.set(x, location)
    })

    tiles.set(y, yMap)
  });

  return {
    type: "add_initial_result",
    data: {
      initialResult: initialResult,
      tiles: tiles
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

export function addResult(tiles, trackingResult) {
  const trackingX = trackingResult.x,
    trackingY = trackingResult.y;
  for(const row of tiles.values()) {
    for(const location of row.values()) {
      // Is location in FOV of the tracking result?
      if (location.inFieldOfView(trackingX, trackingY)) {
        // If so, update names
        location.updateNames(trackingResult.names)
      } else {
        // If not, remove tracking result names from location names
        location.removeNames(trackingResult.names)
      }
    }
  }

  return {
    type: "add_result",
    data: {
      result: trackingResult,
      tiles: tiles
    },
  }
}

export function resetGrid() {
  return {type: "reset"}
}

