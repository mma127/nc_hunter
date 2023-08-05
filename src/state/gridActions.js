import _ from "lodash";
import {MAX_LENGTH, SIDE_LENGTH} from "../components/TileGrid";
import {Location} from "../models/Location";

/**
 * Given user's initial tracking result, create tiles map and return payload for action
 */
export function addInitialResult(initialResult) {
  const tiles = new Map()

  const names = initialResult.names

  const centerX = initialResult.x
  const centerY = initialResult.y
  const topLeftX = centerX - SIDE_LENGTH
  const topLeftY = centerY - SIDE_LENGTH
  const bottomRightX = topLeftX + MAX_LENGTH
  const bottomRightY = topLeftY + MAX_LENGTH
  const yRange = _.range(topLeftY, bottomRightY)
  const xRange = _.range(topLeftX, bottomRightX)

  // Create initial two dimensional map by y then x
  yRange.forEach(y => {
    const yMap = new Map()
    xRange.forEach(x => {
      const location = new Location(x, y)
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