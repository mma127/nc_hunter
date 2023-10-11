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
    textAlign: "right",
    alignSelf: 'flex-end',
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%"
  },
  tooltipHeader: {
    fontWeight: 'bold'
  },
  player: {
    color: theme.palette.warning.dark,
    fontWeight: "bold !important",
    display: 'flex',
    justifyContent: 'flex-end'
  },
  npc: {
    color: theme.palette.warning.light,
    fontStyle: "italic",
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

const TooltipContent = ({x, y, playerNames, npcNames, planeData}) => {
  const classes = useClasses(styles);
  const name = getLocationName(planeData)
  return (
    <>
      <Typography variant="subtitle2"
                  className={classes.tooltipHeader}>
        [{x},{y}] {name}
      </Typography>
      {playerNames.map(name => <Box key={`revealed-${name}`}><Typography variant="body" className={classes.player}>{name}</Typography></Box>)}
      {npcNames.map(name => <Box key={`revealed-${name}`}><Typography variant="body" className={classes.npc}>{name}</Typography></Box>)}
    </>
  )
}

const Names = ({playerNames, npcNames}) => {
  const classes = useClasses(styles);
  const players = playerNames.map(name => <Typography noWrap key={uuid()} className={classes.player}>{name}</Typography>)
  const npcs = npcNames.map(name => <Typography noWrap key={uuid()} className={classes.npc}>{name}</Typography>)
  return (
    <Box className={classes.trackedName}>
      {players}
      {npcs}
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

    const characters = tile.characters;
    const planeData = tile.planeData;

    const playerNames = [],
      npcNames = [];
    characters.forEach(c => {
      const name = c.displayName();
      if(c.isNpc()) {
        npcNames.push(name);
      } else {
        playerNames.push(name);
      }
    })

    const onClick = () => {
      handleClick(x, y)
    }

    return (
      <Tooltip key={`tooltip-${x}-${y}`}
               title={<TooltipContent x={x} y={y} playerNames={playerNames} npcNames={npcNames} planeData={planeData}/>} arrow followCursor>
        <Card className={`${classes.wrapper} ${isStartingTile ? "starting" : null} ${isNonStartingTrackingTile ? "nonstarting" : null}`}
              sx={{ backgroundColor: planeData ? `#${planeData.color}` : 'inherit' }}
        >
          <CardActionArea className={classes.cardActionArea} onClick={onClick}>
            <Box>
              <Typography>[{x},{y}]</Typography>
            </Box>
            {(playerNames || npcNames) ? <Names playerNames={playerNames} npcNames={npcNames} /> : null}
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
