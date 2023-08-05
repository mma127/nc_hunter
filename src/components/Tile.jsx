import {Box, Card, CardActionArea, CardContent, Typography} from "@mui/material"
import {makeStyles} from "@mui/styles"
import {useGrid} from "../GridContext";
import {v4 as uuid} from 'uuid';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    minHeight: '7rem',
    minWidth: '7rem',
    margin: '0.25rem',
    '&.selected': {
      borderSize: '0.5px',
      borderStyle: 'solid',
      borderColor: theme.palette.warning.dark
    }
  },
  cardActionArea: {
    height: '100%',
    display: 'flex !important',
    flexDirection: 'column !important',
    alignItems: 'flex-start !important',
    justifyContent: 'flex-start !important',
    padding: '0.5rem !important',
  },
  trackedName: {
    color: theme.palette.warning.dark,
    textAlign: "right",
    alignSelf: 'flex-end'
  }
}))
const Names = ({names}) => {
  const classes = useStyles();
  const nameContent = names.map(name => <Typography key={uuid()}>{name}</Typography>)
  return (
    <Box className={classes.trackedName}>
      {nameContent}
    </Box>
  )
}

export const Tile = ({x, y}) => {
  console.log("Render Tile")
  const classes = useStyles();
  const grid = useGrid();
  const tile = grid.tiles.get(y).get(x)
  const isStartingTile = grid.initialResult.x === x && grid.initialResult.y === y;
  const revealedNames = tile.names

  return (
    <Card className={`${classes.wrapper} ${isStartingTile ? "selected" : null} `}>
      <CardActionArea className={classes.cardActionArea}>
        <Box>
          <Typography>[{x},{y}]</Typography>
        </Box>
        {revealedNames ? <Names names={revealedNames}/> : null}
      </CardActionArea>
    </Card>
  )
}
