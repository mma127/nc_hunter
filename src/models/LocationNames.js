import _ from "lodash";

export class LocationNames {
  constructor(isSeen) {
    this.names = [];
    this.originalNames = new Set();
    this.excludedNames = new Set();
    this.isSeen = isSeen;
  }

  isNameExcluded(name) {
    return this.excludedNames.has(name)
  }

  isNameOriginal(name) {
    return this.originalNames.has(name)
  }

  updateNames(names) {
    if (names.length > 0) {
      // Have new set of names
      // Find any previous names for this tile that are not in the new list, EXCLUDE them
      const namesToExclude = _.difference(this.names, names)
      this.excludeNames(namesToExclude)

      // If this location has been seen previously, we should filter any names that are not in the originalNames list
      if (this.isSeen()) {
        names = names.filter(name => this.isNameOriginal(name))
      } else {
        // This location has not been seen previously, set the originalNames set
        this.setOriginalNames(names)
      }

      // Update this.names to new names filtering any excluded names
      this.names = names.filter(name => !this.isNameExcluded(name))
    } else {
      this.clearNames()
    }
  }

  excludeNames(names) {
    names.forEach(name => this.excludedNames.add(name))
  }

  setOriginalNames(names) {
    names.forEach(name => this.originalNames.add(name))
  }

  /** Did not find names for this location so exclude any previous names */
  clearNames() {
    this.excludeNames(this.names)
    this.names = []
  }

  removeNames(names) {
    this.excludeNames(names)
    if (this.names) {
      this.updateNames(this.names)
    }
  }
}
