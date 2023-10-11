import {NPC_OWNER} from "../state/characters";

export class Character {
  constructor(data) {
    this.name = data.character.name;
    this.owner = data.character.owner;
  }

  displayName() {
    return this.name;
  }

  /** Name should be unique */
  lowerName() {
    return this.name.toLowerCase();
  }

  isNpc() {
    return this.owner === NPC_OWNER;
  }
}
