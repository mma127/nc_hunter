const PATH = "https://nexusclash.com/api/char/name/";

export async function fetchCharactersByName(names) {
  const characterPromises = names.map(async name => fetchCharacter(name));
  return await Promise.all(characterPromises);
}

export async function fetchCharacter(name) {
  const url = new URL(`${PATH}${name}`);

  const response = await fetch(url);
  return await response.json();
}
