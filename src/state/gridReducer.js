import {useReducer} from "react";

export const INITIAL_STATE = {
  x: null,
  y: null,
  revealedNames: [],
  initialResult: null,
  trackingResults: [],
  tiles: null
}

export function gridReducer(grid, action) {
  switch (action.type) {
    case 'add_initial_result': {
      return {
        ...grid,
        initialResult: action.data.initialResult,
        trackingResults: [...grid.trackingResults, action.data.initialResult],
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
