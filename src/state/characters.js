import _ from "lodash"
import {Character} from "../models/Character";
import {fetchCharactersByName} from "../api/character";

export const NPC_OWNER = "Anonymous";

const SPECIAL_NAMES = ["Libby Hawk, NYT Columnist"]

const SPECIAL_NAMES_MAPPING = {
  "Libby Hawk, NYT Columnist": "Libby%20Hawk%2C%20NYT%20Columnist"
}

export function parseNames(rawNames) {
  const specialNameFiltered = SPECIAL_NAMES.reduce((names, specialName) => {
    // For each special name, check if that exact substring exists in the raw names string
    // If so, replace it with the mapped value
    if (names.includes(specialName)) {
      return names.replace(specialName, SPECIAL_NAMES_MAPPING[specialName])
    } else {
      return names
    }
  }, rawNames)
  return specialNameFiltered.split(',').map(str => str.trim()).filter(str => str.length > 0)
}

/** On initial load, fetch all names and create Characters */
export async function fetchInitialCharacters(names) {
  const charactersData = await fetchCharactersByName(names);

  return charactersData.map(characterData => new Character(characterData))
}

export async function maybeFetchAdditionalCharacters(names, charactersByName) {
  let characters = [];
  const namesToFetch = [];
  names.forEach(name => {
    const lowerName = name.toLowerCase();
    if (_.has(charactersByName, lowerName)) {
      characters.push(_.get(charactersByName, lowerName))
    } else {
      namesToFetch.push(name);
    }
  })

  if (namesToFetch.length > 0) {
    const fetchedCharactersData = await fetchCharactersByName(namesToFetch);
    const fetchedCharacters = fetchedCharactersData.map(data => new Character(data));
    characters = characters.concat(fetchedCharacters);
  }
  return characters;
}
