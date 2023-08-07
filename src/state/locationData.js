import elysium_data from '../data/elysium_tiles.json';

export function getElysiumTile(x, y) {
  return elysium_data[x][y]
}
