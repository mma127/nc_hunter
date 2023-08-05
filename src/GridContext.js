import {createContext, useContext} from 'react';
import {useGridReducer} from "./state/gridReducer";

export const GridContext = createContext(null)
export const GridDispatchContext = createContext(null)

export function GridProvider({children}) {
  const [grid, dispatch] = useGridReducer()

  return (
    <GridContext.Provider value={grid}>
      <GridDispatchContext.Provider value={dispatch}>
        {children}
      </GridDispatchContext.Provider>
    </GridContext.Provider>
  )
}

export function useGrid() {
  return useContext(GridContext)
}

export function useGridDispatch() {
  return useContext(GridDispatchContext)
}

