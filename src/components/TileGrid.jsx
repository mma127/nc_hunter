import {Box, Button, Container, Grid} from "@mui/material"
import {Tile} from "./Tile";

import {useGrid, useGridDispatch} from "../GridContext"
import _ from "lodash";
import {makeStyles} from "@mui/styles";

export const MAX_LENGTH = 9;
export const SIDE_LENGTH = Math.floor(MAX_LENGTH / 2);
export const FOV_LENGTH = 2;

const useStyles = makeStyles(() => ({
  rowWrapper: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'nowrap'
  }
}))

const createTile = ({x, y}) => {
  return <Tile x={x} y={y} key={`tile-${x}-${y}`} />
}

/**
 * 9x9 grid of times centered around the starting [x,y] coordinates
 */
export const TileGrid = () => {
  console.log("Render TILEGRID")
  const classes = useStyles();
  const grid = useGrid();
  const dispatch = useGridDispatch()

  const centerX = grid.initialResult.x
  const centerY = grid.initialResult.y

  const topLeftX = centerX - SIDE_LENGTH
  const topLeftY = centerY - SIDE_LENGTH
  const bottomRightY = topLeftY + MAX_LENGTH
  const yRange = _.range(topLeftY, bottomRightY)

  const createRow = (startingX, limit, y) => {
    const xRange = _.range(startingX, startingX + limit)
    return (
      <Grid item container spacing={1} className={classes.rowWrapper} key={`row-${y}`}>
        {xRange.map(x => createTile({x, y}))}
      </Grid>
    )
  }

  const handleReset = () => {
    dispatch({type: "reset"})
  }

  return (
    <Container maxWidth="xlg">
      <Box>
        <Button onClick={handleReset}>Reset</Button>
      </Box>
      <Grid container spacing={1} sx={{marginTop: '1rem'}}>
        {yRange.map(y => createRow(topLeftX, MAX_LENGTH, y))}
      </Grid>
    </Container>
  )
}