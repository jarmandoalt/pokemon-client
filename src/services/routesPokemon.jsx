import Axios from "axios";

const baseUrl = "https://pokeapi.co/api/v2/";

export async function getPokemon(number) {
  console.log(number);
  try {
    const response = await Axios({
      method: "GET",
      url: `${baseUrl}pokemon/${number}`,
    });

    return response;
  } catch (e) {
    console.log(e);
  }
}

export async function getPokemonSelect(name) {
  try {
    const response = await Axios({
      method: "GET",
      url: `${baseUrl}pokemon/${name}`,
    });

    return response;
  } catch (e) {
    console.log(e);
  }
}

export async function getPokemonList(number) {
  let max = number, min;
  switch (number) {
    case 151:
      min = 0;
      break;
    case 100:
      min = 151;
      break;
    case 135:
      min = 251;
      break;
    case 107:
      min = 386;
      break;
    case 156:
      min = 493;
      break;
    case 72:
      min = 649;
      break;
    case 88:
      min = 721;
      break;
    case 89:
      min = 809;
      break;
    default:
      break;
  }

  try {
    const response = await Axios({
      method: "GET",
      url: `${baseUrl}pokemon?limit=${max}&offset=${min}`,
    });

    return response;
  } catch (e) {
    console.log(e);
  }
}
