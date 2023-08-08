import {Box, Card, CardActionArea, Tooltip, Typography} from "@mui/material"
import {useGrid} from "../GridContext";
import {v4 as uuid} from 'uuid';
import _ from "lodash";
import useClasses from "../hooks/useClasses";

const styles = (theme) => ({
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
  },
  tooltipHeader: {
    fontWeight: 'bold'
  },
  description: {
    color: theme.palette.warning.main,
    display: 'flex',
    justifyContent: 'flex-end'
  }
})

const getLocationName = (planeData) => {
  if (planeData) {
    if (planeData.tilename === planeData.tile_base) {
      return planeData.tilename;
    } else {
      return `${planeData.tilename} (${planeData.tile_base})`
    }
  }
  return null
}

const TooltipContent = ({x, y, revealedNames, planeData}) => {
  const classes = useClasses(styles);
  const name = getLocationName(planeData)
  return (
    <>
      <Typography variant="subtitle2"
                  className={classes.tooltipHeader}>
        [{x},{y}] {name}
      </Typography>
      {revealedNames.map(name => <Box key={`revealed-${name}`}><Typography variant="body" className={classes.description}>{name}</Typography></Box>)}
    </>
  )
}

const Names = ({names}) => {
  const classes = useClasses(styles);
  const nameContent = names.map(name => <Typography noWrap key={uuid()}>{name}</Typography>)
  return (
    <Box className={classes.trackedName}>
      {nameContent}
    </Box>
  )
}

export const Tile = ({x, y, handleClick}) => {
  const classes = useClasses(styles);
  const grid = useGrid();
  const tile = grid.tiles.get(y)?.get(x)

  const isBlank = _.isNil(tile)

  if (!isBlank) {
    const isStartingTile = grid.initialResult.x === x && grid.initialResult.y === y;
    let isNonStartingTrackingTile
    if (!isStartingTile) {
      isNonStartingTrackingTile = grid.trackingResults.some(result => result.x === x && result.y === y)
    } else {
      isNonStartingTrackingTile = false
    }

    const revealedNames = tile.names;
    const planeData = tile.planeData;

    const onClick = () => {
      handleClick(x, y)
    }

    return (
      <Tooltip key={`tooltip-${x}-${y}`}
               title={<TooltipContent x={x} y={y} revealedNames={revealedNames} planeData={planeData}/>} arrow followCursor>
        <Card className={`${classes.wrapper} ${isStartingTile ? "starting" : null} ${isNonStartingTrackingTile ? "nonstarting" : null}`}
              sx={{ backgroundColor: planeData ? `#${planeData.color}` : 'inherit' }}
        >
          <CardActionArea className={classes.cardActionArea} onClick={onClick}>
            <Box>
              <Typography>[{x},{y}]</Typography>
            </Box>
            {revealedNames ? <Names names={revealedNames}/> : null}
          </CardActionArea>
        </Card>
      </Tooltip>
    )
  } else {
    return (
      <Card className={classes.wrapper}></Card>
    )
  }
}
