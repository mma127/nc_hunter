import React from 'react'
import {Box, Button, Container, Grid, Typography} from "@mui/material"
import {Tile} from "./Tile";

import {useGrid, useGridDispatch} from "../GridContext"
import _ from "lodash";
import {TrackingDialog} from "./TrackingDialog";
import {resetGrid, setNewTrackingCoordinates} from "../state/gridActions";
import useClasses from "../hooks/useClasses";

export const MAX_LENGTH_9 = 9;
export const MAX_LENGTH_13 = 13;
export const SIDE_LENGTH_9 = Math.floor(MAX_LENGTH_9 / 2);
export const SIDE_LENGTH_13 = Math.floor(MAX_LENGTH_13 / 2);
export const FOV_2 = 2;
export const FOV_3 = 3;

const styles = () => ({
  header: {
    display: 'flex',
    justifyContent: "space-around",
    paddingTop: '0.5rem'
  },
  rowWrapper: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'nowrap !important'
  },
  modal: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    transform: 'translate(-40%, -40%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }
})

const createTile = ({x, y, handleOpen}) => {
  return <Tile x={x} y={y} handleClick={handleOpen} key={`tile-${x}-${y}`}/>
}

/**
 * 9x9 grid of times centered around the starting [x,y] coordinates
 */
export const TileGrid = () => {
  const classes = useClasses(styles);
  const grid = useGrid();
  const dispatch = useGridDispatch()

  const plane = grid.plane

  const [open, setOpen] = React.useState(false);
  const handleOpen = (x, y) => {
    dispatch(setNewTrackingCoordinates(x, y))
    setOpen(true);
  }
  const handleClose = () => setOpen(false);

  const centerX = grid.initialResult.x
  const centerY = grid.initialResult.y

  const topLeftX = centerX - grid.sideLength
  const topLeftY = centerY - grid.sideLength
  const bottomRightY = topLeftY + grid.maxLength
  const yRange = _.range(topLeftY, bottomRightY)

  const createRow = (startingX, limit, y) => {
    const xRange = _.range(startingX, startingX + limit)
    return (
      <Grid item container spacing={1} className={classes.rowWrapper} key={`row-${y}`}>
        {xRange.map(x => createTile({x, y, handleOpen}))}
      </Grid>
    )
  }

  const handleReset = () => {
    dispatch(resetGrid())
  }

  return (
    <Container maxWidth="xlg">
      <Box className={classes.header}>
        <Typography variant="h5">{_.capitalize(plane)}</Typography>
        <Button onClick={handleReset}>Reset</Button>
      </Box>
      <Grid container spacing={1} sx={{marginTop: '1rem'}}>
        {yRange.map(y => createRow(topLeftX, grid.maxLength, y))}
      </Grid>
      <TrackingDialog open={open} onClose={handleClose} />
    </Container>
  )
}