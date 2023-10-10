export class Character {
  constructor(name, displayName, isNpc) {
    this.lowername = name.trim().toLowerCase();
    this.displayName = displayName;
    this.isNpc = isNpc;
  }
}