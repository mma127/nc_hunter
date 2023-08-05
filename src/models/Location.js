import {FOV_LENGTH} from "../components/TileGrid";

export class Location {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  updateNames(names) {
    this.names = names
  }

  maybeUpdateNames(updateX, updateY, names) {
    if (this.inFieldOfView(updateX, updateY, this.x, this.y)) {
      this.updateNames(names)
    }
  }

  inFieldOfView(originX, originY, currentX, currentY) {
    if ((originX - FOV_LENGTH) > currentX || currentX > (originX + FOV_LENGTH)) {
      return false
    }
    if ((originY - FOV_LENGTH) > currentY || currentY > (originY + FOV_LENGTH)) {
      return false
    }
    return true
  }
}
