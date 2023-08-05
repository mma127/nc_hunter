import React from 'react'
import {Box, Button, Container, Grid} from "@mui/material"
import {Tile} from "./Tile";

import {useGrid, useGridDispatch} from "../GridContext"
import _ from "lodash";
import {makeStyles} from "@mui/styles";
import {TrackingDialog} from "./TrackingDialog";
import {resetGrid, setNewTrackingCoordinates} from "../state/gridActions";

export const MAX_LENGTH = 9;
export const SIDE_LENGTH = Math.floor(MAX_LENGTH / 2);
export const FOV_LENGTH = 2;

const useStyles = makeStyles(() => ({
  rowWrapper: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'nowrap'
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
}))

const createTile = ({x, y, handleOpen}) => {
  return <Tile x={x} y={y} handleClick={handleOpen} key={`tile-${x}-${y}`}/>
}

/**
 * 9x9 grid of times centered around the starting [x,y] coordinates
 */
export const TileGrid = () => {
  console.log("Render TILEGRID")
  const classes = useStyles();
  const grid = useGrid();
  const dispatch = useGridDispatch()

  const [open, setOpen] = React.useState(false);
  const handleOpen = (x, y) => {
    dispatch(setNewTrackingCoordinates(x, y))
    setOpen(true);
  }
  const handleClose = () => setOpen(false);

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
        {xRange.map(x => createTile({x, y, handleOpen}))}
      </Grid>
    )
  }

  const handleReset = () => {
    dispatch(resetGrid())
  }

  return (
    <Container maxWidth="xlg">
      <Box>
        <Button onClick={handleReset}>Reset</Button>
      </Box>
      <Grid container spacing={1} sx={{marginTop: '1rem'}}>
        {yRange.map(y => createRow(topLeftX, MAX_LENGTH, y))}
      </Grid>
      <TrackingDialog open={open} onClose={handleClose} />
    </Container>
  )
}