import _ from "lodash";
import {getPlaneData} from "../state/locationData";

export class Location {
  constructor(x, y, plane, fov) {
    this.x = x;
    this.y = y;
    this.plane = plane;
    this.names = [];
    this.excludedNames = new Set();
    this.planeData = getPlaneData(x, y, plane);
    this.fov = fov;
  }

  isNameExcluded(name) {
    return this.excludedNames.has(name)
  }

  updateNames(names) {
    if (names.length > 0) {
      // Have new set of names
      // Find any previous names for this tile that are not in the new list, EXCLUDE them
      const namesToExclude = _.difference(this.names, names)
      this.excludeNames(namesToExclude)
      // Update this.names to new names filtering any excluded names
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
    if ((originX - this.fov) > this.x || this.x > (originX + this.fov)) {
      return false
    }
    if ((originY - this.fov) > this.y || this.y > (originY + this.fov)) {
      return false
    }
    return true
  }
}
