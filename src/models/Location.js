import {FOV_LENGTH} from "../components/TileGrid";

export class Location {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.excludedNames = new Set();
  }

  isNameExcluded(name) {
    return this.excludedNames.has(name)
  }

  updateNames(names) {
    this.names = names.filter(name => !this.isNameExcluded(name))
  }

  excludeNames(names) {
    names.forEach(name => this.excludedNames.add(name))
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
