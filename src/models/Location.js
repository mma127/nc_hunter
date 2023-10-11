import _ from "lodash";
import {getPlaneData} from "../state/locationData";

export class Location {
  constructor(x, y, plane, fov) {
    this.x = x;
    this.y = y;
    this.plane = plane;
    this.characters = [];
    this.originalNames = new Set();
    this.excludedNames = new Set();
    this.planeData = getPlaneData(x, y, plane);
    this.fov = fov;
    this.seen = false;
  }

  isNameExcluded(name) {
    return this.excludedNames.has(name)
  }

  isNameOriginal(name) {
    return this.originalNames.has(name)
  }

  updateCharacters(characters) {
    if (characters.length > 0) {
      // Have new set of names
      // Find any previous names for this tile that are not in the new list, EXCLUDE them
      const charNames = characters.map(c => c.lowerName());
      const namesToExclude = _.difference(this.characters.map(c => c.lowerName()), charNames);
      this.excludeNames(namesToExclude)

      // If this location has been seen previously, we should filter any names that are not in the originalNames list
      if (this.seen) {
        characters = characters.filter(character => this.isNameOriginal(character.lowerName()));
      } else {
        // This location has not been seen previously, set the originalNames set
        this.setOriginalNames(charNames);
      }

      // Update this.names to new names filtering any excluded names
      this.characters = characters.filter(character => !this.isNameExcluded(character.lowerName()));
    } else {
      this.clearNames()
    }
  }

  /**
   * Add to the excluded names list
   * These are the names excluded from this tile due to later scans showing that this tile does not contain the originally
   * scanned names.
   * ASSUMPTION: Characters tracked do not move, so this set will not change within the bounds of a hunt
   */
  excludeNames(names) {
    names.forEach(name => this.excludedNames.add(name))
  }

  filterExcludedNames() {
    this.characters = this.characters.filter(character => !this.isNameExcluded(character.lowerName()));
  }

  /**
   * Add to the original names list
   * These are the original set of names found when this tile was first scanned.
   * ASSUMPTION: Characters tracked do not move, so this set will not change within the bounds of a hunt
   */
  setOriginalNames(names) {
    names.forEach(name => this.originalNames.add(name))
  }

  /** Did not find names for this location so exclude any previous names */
  clearNames() {
    this.excludeNames(this.characters.map(c => c.lowerName()));
    this.characters = []
  }

  updateInitialCharactersInFov(updateX, updateY, characters) {
    const names = characters.map(c => c.lowerName());
    if (this.inFieldOfView(updateX, updateY)) {
      this.updateCharacters(characters);
      this.setOriginalNames(names);
      this.seen = true
    } else {
      this.excludeNames(names)
    }
  }

  removeCharacters(characters) {
    const names = characters.map(c => c.lowerName());
    this.excludeNames(names)
    this.filterExcludedNames();
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
