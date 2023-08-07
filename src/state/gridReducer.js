import {useReducer} from "react";

export const INITIAL_STATE = {
  plane: null,
  currentX: null,
  currentY: null,
  initialResult: null,
  trackingResults: [],
  tiles: null
}

export function gridReducer(grid, action) {
  switch (action.type) {
    case 'select_plane': {
      return {
        ...grid,
        plane: action.data
      }
    }
    case 'add_initial_result': {
      return {
        ...grid,
        initialResult: action.data.initialResult,
        trackingResults: [...grid.trackingResults, action.data.initialResult],
        tiles: action.data.tiles
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
      return {
        ...grid,
        currentX: null,
        currentY: null,
        trackingResults: [...grid.trackingResults, action.data.result],
        tiles: action.data.tiles
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
