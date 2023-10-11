import {useReducer} from "react";
import {FOV_2, MAX_LENGTH_9, SIDE_LENGTH_9} from "../components/TileGrid";

export const INITIAL_STATE = {
  plane: null,
  fov: null,
  maxLength: null,
  sideLength: null,
  currentX: null,
  currentY: null,
  initialResult: null,
  trackingResults: [],
  tiles: null,
  charactersByName: {}
}

export function gridReducer(grid, action) {
  switch (action.type) {
    case 'select_plane': {
      return {
        ...grid,
        plane: action.data
      }
    }
    case 'select_fov': {
      return {
        ...grid,
        fov: action.data.fov,
        maxLength: action.data.maxLength,
        sideLength: action.data.sideLength,
      }
    }
    case 'add_initial_result': {
      console.log(action.data.tiles)
      return {
        ...grid,
        initialResult: action.data.initialResult,
        trackingResults: [...grid.trackingResults, action.data.initialResult],
        tiles: action.data.tiles,
        charactersByName: action.data.charactersByName
      }
    }
    case 'set_tracking_coordinates': {
      return {
        ...grid,
        currentX: action.data.x,
        currentY: action.data.y
      }
    }
    case 'add_result': {
      console.log(action.data.tiles)
      return {
        ...grid,
        currentX: null,
        currentY: null,
        trackingResults: [...grid.trackingResults, action.data.result],
        tiles: action.data.tiles,
        charactersByName: action.data.charactersByName
      }
    }
    case 'reset': {
      return INITIAL_STATE
    }
    default: {
      throw Error("Unknown action: " + action.type)
    }
  }
}

export function useGridReducer() {
  return useReducer(gridReducer, INITIAL_STATE)
}
