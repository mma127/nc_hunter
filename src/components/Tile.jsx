import {Box, Card, CardActionArea, Typography} from "@mui/material"
import {makeStyles} from "@mui/styles"
import {useGrid} from "../GridContext";
import {v4 as uuid} from 'uuid';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    minHeight: '7rem',
    minWidth: '7rem',
    height: '7rem',
    width: '7rem',
    margin: '0.25rem',
    '&.starting': {
      borderSize: '0.5px',
      borderStyle: 'solid',
      borderColor: theme.palette.error.dark
    },
    '&.nonstarting': {
      borderSize: '0.5px',
      borderStyle: 'solid',
      borderColor: theme.palette.error.main
    }
  },
  cardActionArea: {
    height: '100%',
    width: "100%",
    display: 'flex !important',
    flexDirection: 'column !important',
    alignItems: 'flex-start !important',
    justifyContent: 'flex-start !important',
    padding: '0.5rem !important',
  },
  trackedName: {
    color: theme.palette.warning.main,
    textAlign: "right",
    alignSelf: 'flex-end',
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%"
  }
}))
const Names = ({names}) => {
  const classes = useStyles();
  const nameContent = names.map(name => <Typography noWrap key={uuid()}>{name}</Typography>)
  return (
    <Box className={classes.trackedName}>
      {nameContent}
    </Box>
  )
}

export const Tile = ({x, y, handleClick}) => {
  console.log("Render Tile")
  const classes = useStyles();
  const grid = useGrid();
  const tile = grid.tiles.get(y).get(x)
  const isStartingTile = grid.initialResult.x === x && grid.initialResult.y === y;
  let isNonStartingTrackingTile
  if (!isStartingTile) {
    isNonStartingTrackingTile = grid.trackingResults.some(result => result.x === x && result.y === y)
  } else {
    isNonStartingTrackingTile = false
  }

  const revealedNames = tile.names

  const onClick = () => {
    handleClick(x, y)
  }

  return (
    <Card className={`${classes.wrapper} ${isStartingTile ? "starting" : null} ${isNonStartingTrackingTile ? "nonstarting" : null}`}>
      <CardActionArea className={classes.cardActionArea} onClick={onClick}>
        <Box>
          <Typography>[{x},{y}]</Typography>
        </Box>
        {revealedNames ? <Names names={revealedNames}/> : null}
      </CardActionArea>
    </Card>
  )
}
