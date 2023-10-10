import {getPlaneData} from "../state/locationData";
import {LocationNames} from "./LocationNames";

export class Location {
  constructor(x, y, plane, fov) {
    this.x = x;
    this.y = y;
    this.plane = plane;
    this.characters = [];
    this.players = new LocationNames(this.isSeen);
    this.npcs = new LocationNames(this.isSeen);
    this.planeData = getPlaneData(x, y, plane);
    this.fov = fov;
    this.seen = false;
  }

  updateInitialNamesInFov(updateX, updateY, playerNames, npcNames) {
    if (this.inFieldOfView(updateX, updateY)) {
      // Seen for the first time, in FOV
      // Update player and npc names
      this.players.updateNames(playerNames);
      this.npcs.updateNames(npcNames);
      this.seen = true
    } else {
      // Not in the FOV, exclude
      this.players.excludeNames(playerNames);
      this.players.excludeNames(npcNames);
    }
  }

  updateNames(playerNames, npcNames) {
    this.players.updateNames(playerNames);
    this.npcs.updateNames(npcNames);
  }

  removeNames(playerNames, npcNames) {
    this.players.removeNames(playerNames);
    this.npcs.removeNames(npcNames);
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

  isSeen() {
    return this.seen;
  }
}
