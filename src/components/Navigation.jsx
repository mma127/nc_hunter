import {useGrid} from "../GridContext"
import {StartForm} from "./StartForm";
import {TileGrid} from "./TileGrid";

export const Navigation = () => {
  const grid = useGrid();

  let content
  if (grid.initialResult && grid.plane) {
    content = <TileGrid />
  } else {
    content = <StartForm />
  }

  return content;
}
