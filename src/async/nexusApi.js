import _ from "lodash";
import {Character} from "../models/Character";

const PATH = "https://nexusclash.com/api/char/name/";

const NPC_OWNER = "Anonymous";

/** On initial load, fetch all names and split into player and npc lists */
export async function fetchInitialCharacters(names) {
  const players = []
  const npcs = []

  const characterPromises = names.map(async name => fetchCharacter(name));
  const characters = await Promise.all(characterPromises);

  characters.forEach(character => {
    const characterName = character.character.name;
    if (isNpc(character)) {
      npcs.push(new Character(characterName, characterName, true))
    } else {
      players.push(new Character(characterName, characterName, false))
    }
  })

  return {
    players: players,
    npcs: npcs
  }
}

/**
 * Check if names are in the mapping of characters to npcs.
 * If so, use that to put the name into the player or npc lists.
 * If not, fetch the name from the API, add it to the mapping, and put the name in the corresponding list
 */
export async function maybeFetchAdditionalCharacters(names, characterNamesToNpc) {
  const players = []
  const npcs = []

  const charactersToFetch = [];
  names.forEach(name => {
    if (_.has(characterNamesToNpc, name)) {
      const character = _.get(characterNamesToNpc, name);
      if (character.isNpc) {
        npcs.push(character);
      } else {
        players.push(character);
      }
    } else {
      charactersToFetch.push(name);
    }
  });

  if (charactersToFetch.length > 0) {
    const characterPromises = charactersToFetch.map(async name => fetchCharacter(name));
    const characters = await Promise.all(characterPromises);

    characters.forEach(character => {
      const characterName = character.character.name;
      if (isNpc(character)) {
        npcs.push(new Character(characterName, characterName, true))
      } else {
        players.push(new Character(characterName, characterName, false))
      }
    })
  }

  return {
    players: players,
    npcs: npcs
  }
}

export async function fetchCharacter(name) {
  const url = new URL(`${PATH}${name}`);

  const response = await fetch(url);
  return await response.json();
}

function isNpc(character) {
  return character.character.owner === NPC_OWNER;
}