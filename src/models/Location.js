import {FOV_LENGTH} from "../components/TileGrid";
import {getElysiumTile} from "../state/locationData";

export class Location {
  constructor(x, y, plane) {
    this.x = x;
    this.y = y;
    this.plane = plane;
    this.names = [];
    this.excludedNames = new Set();
    this.planeData = this.getPlaneData(x, y, plane);
  }

  getPlaneData(x, y, plane) {
    switch(plane) {
      case 'elysium': {
        return getElysiumTile(x, y)
      }
      case 'generic': {
        return null
      }
      default: {
        throw Error("Unknown plane")
      }
    }
  }

  isNameExcluded(name) {
    return this.excludedNames.has(name)
  }

  updateNames(names) {
    if (names.length > 0) {
      this.names = names.filter(name => !this.isNameExcluded(name))
    } else {
      this.clearNames()
    }
  }

  excludeNames(names) {
    names.forEach(name => this.excludedNames.add(name))
  }

  /** Did not find names for this location so exclude any previous names */
  clearNames() {
    this.excludeNames(this.names)
    this.names = []
  }

  maybeUpdateNames(updateX, updateY, names) {
    if (this.inFieldOfView(updateX, updateY)) {
      this.updateNames(names)
    } else {
      this.excludeNames(names)
    }
  }

  removeNames(names) {
    this.excludeNames(names)
    if (this.names) {
      this.updateNames(this.names)
    }
  }

  inFieldOfView(originX, originY) {
    if ((originX - FOV_LENGTH) > this.x || this.x > (originX + FOV_LENGTH)) {
      return false
    }
    if ((originY - FOV_LENGTH) > this.y || this.y > (originY + FOV_LENGTH)) {
      return false
    }
    return true
  }
}
