import _ from "lodash"
import {Character} from "../models/Character";
import {fetchCharactersByName} from "../api/character";

export const NPC_OWNER = "Anonymous";

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
