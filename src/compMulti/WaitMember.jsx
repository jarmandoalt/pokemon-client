import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import pokeball from "../assets/pokeball.png";
import socket from "../socket/socket";
import {
  READ_ALL_DATA_1,
  READ_ALL_DATA_2,
  DELETE_ALL_DATA,
  DELETE_POKEMON,
  DATA_GAME,
  DATA_SERVER,
  COUNTDOWN,
  SHOW_CONFIG,
  SHOW_MENU,
  PRACTICE,
  NOCORRECT,
  GAME_STARTED,
} from "../reducers/crudReducer.jsx";
import {
  getPokemonList,
  getPokemon,
  getPokemonSelect,
} from "../services/routesPokemon";
import arrowUp from "../assets/arrow-up.svg";
import pokeapi from "../assets/pokeapi.png";
import llave from "../assets/llave.png";
import arrowDown from "../assets/arrow-down.svg";
import keyArcert from "../assets/acert.mp3";
import showShadow from "../assets/showShadow.mp3";
import click from "../assets/click.mp3";
import waitPokeball from "../assets/waitPokeball.mp3";
import btnIncorrect from "../assets/btnIncorrect.mp3";
import keyArcertAll from "../assets/acertAll.mp3";

const WaitMember = () => {
  const dbPokemon1 = useSelector((state) => state.dbPokemon1),
    dbPokemonSelect = useSelector((state) => state.dbPokemonSelect),
    dataServer = useSelector((state) => state.dataServer),
    showConfig = useSelector((state) => state.showConfig),
    noCorrect = useSelector((state) => state.noCorrect),
    practice = useSelector((state) => state.practice),
    dataGame = useSelector((state) => state.dataGame),
    hidePanelConfig = useSelector((state) => state.hidePanelConfig),
    countdown = useSelector((state) => state.countdown),
    dispatch = useDispatch(),
    [pokeballReady, setPokeballReady] = useLocalStorage("pokeballReady", false),
    [showImg, setShowImg] = useLocalStorage("showImg", false),
    [noRepeat, setNoRepeat] = useLocalStorage("noRepeat", false),
    [showCorrect, setShowCorrect] = useLocalStorage("showCorrect", false),
    [countPokemonsSelect, setCountPokemonsSelect] = useLocalStorage(
      "countPokemonsSelect",
      0
    ),
    [showResults, setShowResults] = useLocalStorage("showResults", false),
    [auxPokemonList, setAuxPokemonList] = useLocalStorage("auxPokemonList", 0),
    [auxInput, setAuxInput] = useLocalStorage("auxInput", ""),
    [arrGeneration, setArrGeneration] = useLocalStorage("arrGeneration", [151]),
    [countShowPokemon, setCountShowPokemon] = useLocalStorage(
      "countShowPokemon",
      0
    ),
    [counterDown, setCounterDown] = useLocalStorage("counterDown", 9),
    [correctCounter, setCorrectCounter] = useLocalStorage("correctCounter", 0),
    [showCountdown, setShowCountdown] = useLocalStorage("showCountdown", false),
    [focusSelect, setFocus] = useLocalStorage("focusSelect", ""),
    [busquedaPokemon, setBusquedaPokemon] = useLocalStorage(
      "busquedaPokemon",
      ""
    ),
    [namePokemonSelect, setNamePokemonSelect] = useLocalStorage(
      "namePokemonSelect",
      []
    ),
    [pokemonGen, setPokemonGen] = useLocalStorage("pokemonGen", 0),
    [arrPokemonsUse, setArrPokemonsUse] = useLocalStorage("arrPokemonsUse", []),
    [arrPokemons, setArrPokemons] = useLocalStorage("arrPokemons", []),
    [disableBtn, setDisableBtn] = useLocalStorage("disableBtn", false),
    refListPokemon = useRef(),
    refResults = useRef(),
    refPanel = useRef(),
    refPanelPokeball = useRef();

  function useLocalStorage(key, initialValue) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
      if (typeof window === "undefined") {
        return initialValue;
      }

      try {
        // Get from local storage by key
        const item = window.sessionStorage.getItem(key);
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        // If error also return initialValue
        console.log(error);
        return initialValue;
      }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to local storage
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error);
      }
    };

    return [storedValue, setValue];
  }

  useEffect(() => {
    if (noRepeat === true) {
      loadPokemon1(auxPokemonList);
    }
  }, [noRepeat]);

  const loadPokemon1 = async () => {
    if (auxPokemonList.length === 1) {
      const response = await getPokemonList(auxPokemonList[0]);
      if (response.status === 200) {
        let obj = [];
        for (let index = 0; index < auxPokemonList; index++) {
          let auxObj = { name: response.data.results[index].name };
          obj.push(auxObj);
        }
        dispatch(READ_ALL_DATA_1(obj));
      }
    } else {
      for (let index = 0; index < auxPokemonList.length; index++) {
        const response = await getPokemonList(auxPokemonList[index]);
        if (response.status === 200) {
          let obj = [];
          for (let i = 0; i < auxPokemonList[index]; i++) {
            let auxObj = { name: response.data.results[i].name };
            obj.push(auxObj);
          }
          dispatch(READ_ALL_DATA_1(obj));
        }
      }
    }
  };

  const loadPokemonPractice = async (num) => {
    const response = await getPokemonList(num);
    if (response.status === 200) {
      let obj = [];
      for (let index = 0; index < num; index++) {
        let auxObj = { name: response.data.results[index].name };
        obj.push(auxObj);
      }
      dispatch(READ_ALL_DATA_1(obj));
    }
  };

  const loadselect = async (num) => {
    const response = await getPokemon(num);
    if (response.status === 200) {
      dispatch(READ_ALL_DATA_2(response.data));
      setPokeballReady(true);
      let auxGen = 0,
        auxArrGeneration = [0, 151, 251, 386, 493, 649, 721, 809, 998];
      for (let index = 0; index < auxArrGeneration.length; index++) {
        if (
          response.data.id <= auxArrGeneration[index] &&
          response.data.id > auxArrGeneration[index - 1]
        ) {
          auxGen = index;
        }
      }
      setPokemonGen(auxGen);
    }
    new Audio(waitPokeball).play();
  };

  const playAudioAcert = () => {
    new Audio(keyArcert).play();
    setCountShowPokemon(countShowPokemon + 1);
  };

  useEffect(() => {
    if (hidePanelConfig === true) {
      refPanel.current.classList.remove("is-active");
      refPanelPokeball.current.classList.remove("is-multi");
    }

    if (hidePanelConfig === false) {
      refPanel.current.classList.add("is-active");
      refPanelPokeball.current.classList.add("is-multi");
    }
  }, [hidePanelConfig]);

  const filterPokemon = (terminoBusqueda) => {
    let resultFilter = dbPokemon1.filter((element) => {
      if (
        element.name
          .toString()
          .toLowerCase()
          .includes(terminoBusqueda.toLowerCase())
      ) {
        return element;
      }
    });

    let result = resultFilter;
    if (resultFilter.length > 2) {
      result = resultFilter.slice(0, 5);
    }
    setNamePokemonSelect(result);
  };

  const handleBusquedaPokemons = (e) => {
    console.log("holas");
  };

  const keyUp = (e) => {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      let auxStr = auxInput + e.key;
      setAuxInput(auxStr);
      setBusquedaPokemon(auxStr);
      filterPokemon(auxStr);
    }
    if (e.keyCode === 8) {
      let auxString = auxInput.substr(0, auxInput.length - 1);
      setAuxInput(auxString);
      setBusquedaPokemon(auxString);
      filterPokemon(auxString);
    }
    if (e.keyCode === 38) {
      if (arrPokemons.length > 4) {
        refListPokemon.current.scrollTop =
          refListPokemon.current.scrollTop - 500;
      }
    }
    if (e.keyCode === 40) {
      if (arrPokemons.length > 4) {
        refListPokemon.current.scrollTop =
          refListPokemon.current.scrollTop + 500;
      }
    }
    if (e.keyCode === 17) {
      if (showImg === true && disableBtn === false) {
        //Atajo de teclado para rendirse
        handleSubmit();
      }
      if (countShowPokemon === 3) {
        //Atajo de teclado para ver la sombre del pokemon
        setShowImg(true);
        new Audio(showShadow).play();
      }
      if (countShowPokemon === 0 && practice.active === true) {
        //Atajo de teclado para ver la sombre del pokemon
        dispatch(PRACTICE({ active: true, click: true }));
        dispatch(DELETE_POKEMON());
      }
    }
    if (e.keyCode === 49 || e.keyCode === 97) {
      if (namePokemonSelect.length > 0) {
        selectNamePokemonKey(namePokemonSelect[0].name);
      }
    }
    if (e.keyCode === 50 || e.keyCode === 98) {
      if (namePokemonSelect.length > 1) {
        selectNamePokemonKey(namePokemonSelect[1].name);
      }
    }
    if (e.keyCode === 51 || e.keyCode === 99) {
      if (namePokemonSelect.length > 2) {
        selectNamePokemonKey(namePokemonSelect[2].name);
      }
    }
    if (e.keyCode === 52 || e.keyCode === 100) {
      if (namePokemonSelect.length > 3) {
        selectNamePokemonKey(namePokemonSelect[3].name);
      }
    }
    if (e.keyCode === 53 || e.keyCode === 101) {
      if (namePokemonSelect.length > 4) {
        selectNamePokemonKey(namePokemonSelect[4].name);
      }
    }
  };

  const control = (e) => {
    switch (e.keyCode) {
      case 39:
        focusSelect.nextElementSibling.focus();
        setFocus(focusSelect.nextElementSibling);
        break;
      case 37:
        focusSelect.previousElementSibling.focus();
        setFocus(focusSelect.previousElementSibling);
        break;
      case 13:
        if (focusSelect.nextElementSibling === null) {
          focusSelect.previousElementSibling.focus();
          setFocus(focusSelect.previousElementSibling);
        }
        if (focusSelect.previousElementSibling === null) {
          focusSelect.nextElementSibling.focus();
          setFocus(focusSelect.nextElementSibling);
        }
        selectNamePokemon(e);
        break;
      default:
        moveCursorToEnd();
        break;
    }
  };

  const pokemonSelect = async (name) => {
    const response = await getPokemonSelect(name);
    if (response.status === 200) {
      let auxGen = 0,
        auxArrGeneration = [0, 151, 251, 386, 493, 649, 721, 809, 998];
      for (let index = 0; index < auxArrGeneration.length; index++) {
        if (
          response.data.id <= auxArrGeneration[index] &&
          response.data.id > auxArrGeneration[index - 1]
        ) {
          auxGen = index;
        }
      }
      if (response.data.types.length === 2) {
        if (dbPokemonSelect.types.length === 2) {
          if (
            dbPokemonSelect.types[0].type.name ===
            response.data.types[0].type.name
          ) {
            countShowPokemon < 3 ? playAudioAcert() : null;
          } else {
            if (
              dbPokemonSelect.types[0].type.name ===
              response.data.types[1].type.name
            ) {
              countShowPokemon < 3 ? playAudioAcert() : null;
            } else {
              if (
                dbPokemonSelect.types[1].type.name ===
                response.data.types[0].type.name
              ) {
                countShowPokemon < 3 ? playAudioAcert() : null;
              } else {
                if (
                  dbPokemonSelect.types[1].type.name ===
                  response.data.types[1].type.name
                ) {
                  countShowPokemon < 3 ? playAudioAcert() : null;
                }
              }
            }
          }
        } else {
          if (
            dbPokemonSelect.types[0].type.name ===
            response.data.types[0].type.name
          ) {
            countShowPokemon < 3 ? playAudioAcert() : null;
          } else {
            if (
              dbPokemonSelect.types[0].type.name ===
              response.data.types[1].type.name
            ) {
              countShowPokemon < 3 ? playAudioAcert() : null;
            }
          }
        }
        setArrPokemons([
          ...arrPokemons,
          {
            name: response.data.name,
            id: response.data.id,
            notypes: response.data.types.length,
            type2: response.data.types[0].type.name,
            type1: response.data.types[1].type.name,
            gen: auxGen,
            img: response.data.sprites.front_default,
          },
        ]);
      } else {
        if (dbPokemonSelect.types.length === 2) {
          if (
            dbPokemonSelect.types[0].type.name ===
            response.data.types[0].type.name
          ) {
            countShowPokemon < 3 ? playAudioAcert() : null;
          } else {
            if (
              dbPokemonSelect.types[1].type.name ===
              response.data.types[0].type.name
            ) {
              countShowPokemon < 3 ? playAudioAcert() : null;
            }
          }
        } else {
          if (
            dbPokemonSelect.types[0].type.name ===
            response.data.types[0].type.name
          ) {
            countShowPokemon < 3 ? playAudioAcert() : null;
          }
        }

        setArrPokemons([
          ...arrPokemons,
          {
            name: response.data.name,
            id: response.data.id,
            notypes: response.data.types.length,
            type1: response.data.types[0].type.name,
            img: response.data.sprites.front_default,
            gen: auxGen,
          },
        ]);
      }
    }
  };

  const handleSubmit = () => {
    pokemonSelect(dbPokemonSelect.name);
    dispatch(NOCORRECT(false));
  };

  const selectNamePokemon = async (e) => {
    setCountPokemonsSelect(countPokemonsSelect + 1);
    e.preventDefault();
    if (e.target.value === dbPokemonSelect.name) {
      //acierto de pokemon
      if (showImg === true) {
        setShowCorrect(true);
        setDisableBtn(true);
      } else {
        setShowCorrect(true);
        setShowImg(true);
        setDisableBtn(true);
      }

      if (practice.active === false || practice.active === "disable") {
        dispatch(COUNTDOWN(false)); //esconder contador al acertar
        switch (
          correctCounter //saber cuantos puntos tocan segun cuantos han adivinado
        ) {
          case 0:
            dispatch(DATA_SERVER({ hitCounter: dataServer.hitCounter + 1 }));
            switch (
              dataServer.myNumber //asignando los puntos por miembro
            ) {
              case 2:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember1 + 8,
                  numAcert: 1,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember1: dataServer.scoreMember1 + 8 })
                );
                break;
              case 3:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember2 + 8,
                  numAcert: 1,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember2: dataServer.scoreMember2 + 8 })
                );
                break;
              case 4:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember3 + 8,
                  numAcert: 1,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember3: dataServer.scoreMember3 + 8 })
                );
                break;
              default:
                break;
            }
            break;
          case 1:
            dispatch(DATA_SERVER({ hitCounter: dataServer.hitCounter + 1 }));
            switch (dataServer.myNumber) {
              case 2:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember1 + 6,
                  numAcert: 2,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember1: dataServer.scoreMember1 + 6 })
                );
                break;
              case 3:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember2 + 6,
                  numAcert: 2,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember2: dataServer.scoreMember2 + 6 })
                );
                break;
              case 4:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember3 + 6,
                  numAcert: 2,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember3: dataServer.scoreMember3 + 6 })
                );
                break;
              default:
                break;
            }
            break;
          case 2:
            dispatch(DATA_SERVER({ hitCounter: dataServer.hitCounter + 1 }));
            switch (dataServer.myNumber) {
              case 2:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember1 + 4,
                  numAcert: 3,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember1: dataServer.scoreMember1 + 4 })
                );
                break;
              case 3:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember2 + 4,
                  numAcert: 3,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember2: dataServer.scoreMember2 + 4 })
                );
                break;
              case 4:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember3 + 4,
                  numAcert: 3,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember3: dataServer.scoreMember3 + 4 })
                );
                break;
              default:
                break;
            }
            break;
          case 3:
            dispatch(DATA_SERVER({ hitCounter: dataServer.hitCounter + 1 }));
            switch (dataServer.myNumber) {
              case 2:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember1 + 2,
                  numAcert: 0,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember1: dataServer.scoreMember1 + 2 })
                );
                break;
              case 3:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember2 + 2,
                  numAcert: 0,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember2: dataServer.scoreMember2 + 2 })
                );
                break;
              case 4:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember3 + 2,
                  numAcert: 0,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember3: dataServer.scoreMember3 + 2 })
                );
                break;
              default:
                break;
            }
            break;
          default:
            break;
        }
      }
      new Audio(keyArcertAll).play();
    } else {
      new Audio(btnIncorrect).play();
    }
    pokemonSelect(e.target.value);
    setArrPokemonsUse(...arrPokemonsUse, e.target.value);
    let auxArr = namePokemonSelect.filter(
      (item) => item.name !== e.target.value
    );
    setNamePokemonSelect(auxArr);
    dispatch(DELETE_POKEMON(e.target.value));
    setTimeout(() => {
      refListPokemon.current.scrollTop =
        refListPokemon.current.scrollTop - 1800;
    }, 300);
  };

  const selectNamePokemonKey = async (key) => {
    setCountPokemonsSelect(countPokemonsSelect + 1);
    if (key === dbPokemonSelect.name) {
      //acierto de pokemon
      if (showImg === true) {
        setShowCorrect(true);
        setDisableBtn(true);
      } else {
        setShowCorrect(true);
        setShowImg(true);
        setDisableBtn(true);
      }

      if (practice.active === false || practice.active === "disable") {
        dispatch(COUNTDOWN(false)); //esconder contador al acertar
        switch (
          correctCounter //saber cuantos puntos tocan segun cuantos han adivinado
        ) {
          case 0:
            dispatch(DATA_SERVER({ hitCounter: dataServer.hitCounter + 1 }));
            switch (
              dataServer.myNumber //asignando los puntos por miembro
            ) {
              case 2:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember1 + 8,
                  numAcert: 1,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember1: dataServer.scoreMember1 + 8 })
                );
                break;
              case 3:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember2 + 8,
                  numAcert: 1,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember2: dataServer.scoreMember2 + 8 })
                );
                break;
              case 4:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember3 + 8,
                  numAcert: 1,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember3: dataServer.scoreMember3 + 8 })
                );
                break;
              default:
                break;
            }
            break;
          case 1:
            dispatch(DATA_SERVER({ hitCounter: dataServer.hitCounter + 1 }));
            switch (dataServer.myNumber) {
              case 2:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember1 + 6,
                  numAcert: 2,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember1: dataServer.scoreMember1 + 6 })
                );
                break;
              case 3:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember2 + 6,
                  numAcert: 2,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember2: dataServer.scoreMember2 + 6 })
                );
                break;
              case 4:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember3 + 6,
                  numAcert: 2,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember3: dataServer.scoreMember3 + 6 })
                );
                break;
              default:
                break;
            }
            break;
          case 2:
            dispatch(DATA_SERVER({ hitCounter: dataServer.hitCounter + 1 }));
            switch (dataServer.myNumber) {
              case 2:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember1 + 4,
                  numAcert: 3,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember1: dataServer.scoreMember1 + 4 })
                );
                break;
              case 3:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember2 + 4,
                  numAcert: 3,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember2: dataServer.scoreMember2 + 4 })
                );
                break;
              case 4:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember3 + 4,
                  numAcert: 3,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember3: dataServer.scoreMember3 + 4 })
                );
                break;
              default:
                break;
            }
            break;
          case 3:
            dispatch(DATA_SERVER({ hitCounter: dataServer.hitCounter + 1 }));
            switch (dataServer.myNumber) {
              case 2:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember1 + 2,
                  numAcert: 0,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember1: dataServer.scoreMember1 + 2 })
                );
                break;
              case 3:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember2 + 2,
                  numAcert: 0,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember2: dataServer.scoreMember2 + 2 })
                );
                break;
              case 4:
                socket.emit("correct", {
                  nameServer: dataServer.nameServer,
                  number: dataServer.myNumber,
                  points: dataServer.scoreMember3 + 2,
                  numAcert: 0,
                  hitCounter: dataServer.hitCounter + 1,
                });
                dispatch(
                  DATA_SERVER({ scoreMember3: dataServer.scoreMember3 + 2 })
                );
                break;
              default:
                break;
            }
            break;
          default:
            break;
        }
      }
      new Audio(keyArcertAll).play();
    } else {
      new Audio(btnIncorrect).play();
    }
    pokemonSelect(key);
    setArrPokemonsUse(...arrPokemonsUse, key);
    let auxArr = namePokemonSelect.filter((item) => item.name !== key);
    setNamePokemonSelect(auxArr);
    dispatch(DELETE_POKEMON(key));
    setTimeout(() => {
      refListPokemon.current.scrollTop =
        refListPokemon.current.scrollTop - 1800;
    }, 300);
  };

  const controlInput = (e) => {
    let $divBtn = document.getElementById("divBtnOpc");

    switch (e.keyCode) {
      case 40:
        $divBtn.firstElementChild.focus();
        setFocus($divBtn.firstElementChild);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    socket.on("startGame", (startGame) => {
      dispatch(GAME_STARTED(false));
      dispatch(
        DATA_SERVER({
          hitCounter: 0,
          round: startGame.round,
        })
      );
      timeStartGame(startGame);
      setShowCountdown(true);
      dispatch(SHOW_CONFIG(true));
    });

    socket.on("correct", (correct) => {
      handlerPoints(correct);
      setCorrectCounter(correct.numAcert);
    });

    socket.on("returnGame", () => {
        dispatch(SHOW_CONFIG("return"));
        dispatch(COUNTDOWN(false));
        handleReset()
    });

    socket.on("dataGameMember", (dataGameMember) => {
      handlerDataGameFinal(dataGameMember);
    });
  }, [socket]);

  const handlerDataGameFinal = (dataGameMember) => {
    switch (dataGameMember.numberMember) {
      case 1:
        dispatch(
          DATA_GAME({
            bestTimeMember1: dataGameMember.bestTime,
            attemptsMember1: dataGameMember.attempts,
          })
        );
        break;
      case 2:
        dispatch(
          DATA_GAME({
            bestTimeMember2: dataGameMember.bestTime,
            attemptsMember2: dataGameMember.attempts,
          })
        );
        break;
      case 3:
        dispatch(
          DATA_GAME({
            bestTimeMember3: dataGameMember.bestTime,
            attemptsMember3: dataGameMember.attempts,
          })
        );
        break;
      case 4:
        dispatch(
          DATA_GAME({
            bestTimeMember4: dataGameMember.bestTime,
            attemptsMember4: dataGameMember.attempts,
          })
        );
        break;
      default:
        break;
    }
    setShowResults(true); //move final
  };

  useEffect(() => {
    if (showConfig === "return") {
      handleReset();
      restartGame();
      dispatch(SHOW_MENU(false));
      dispatch(PRACTICE({ active: true }));
    }
    if (showConfig === true) {
      dispatch(PRACTICE({ active: true }));
    }
  }, [showConfig]);

  const restartGame = () => {
    //iniciar partida
    dispatch(DELETE_ALL_DATA());
    dispatch(
      DATA_SERVER({
        scoreAdmin: 0,
        scoreMember1: 0,
        scoreMember2: 0,
        scoreMember3: 0,
        round: 0,
        hitCounter: 0,
        numberGames: 1,
      })
    );
    dispatch(
      DATA_GAME({
        bestTime: 1000,
        attempts: 1000,
      })
    );
    refPanelPokeball.current.classList.add("pc");
    setCountPokemonsSelect(0);
    dispatch(SHOW_CONFIG(true));
    setBusquedaPokemon("");
    setShowCountdown(false);
    setNamePokemonSelect([]);
    setPokeballReady(false);
    setShowCorrect(false);
    setDisableBtn(false);
    setShowResults(false);
    setShowImg(false);
    setCounterDown(9);
    setArrPokemons([]);
    setNoRepeat(false);
    setCountShowPokemon(0);
  };

  useEffect(() => {
    //Escuchando cuando acaben todos los miembros
    setTimeout(() => {
      if (
        dataServer.round === dataServer.numberGames &&
        dataServer.hitCounter === dataServer.countMembers
      ) {
        handlerDataGame(1);
      } else {
        if (dataServer.hitCounter === dataServer.countMembers) {
          //resetGame()
          dispatch(SHOW_CONFIG(true));
          setShowCountdown(true);
          setCountShowPokemon(0);
          setCorrectCounter(0);
          handlerDataGame(0);
          setNoRepeat(false);
          dispatch(DATA_SERVER({ hitCounter: 0 }));
        }
      }
    }, 3000);
  }, [dataServer.hitCounter]);

  const handlerDataGame = async (aux) => {
    if (aux === 1) {
      if (dataGame.attempts === 1000) {
        switch (dataServer.myNumber) {
          case 2:
            dispatch(
              DATA_GAME({
                name: dataServer.name,
                attempts: 0,
                attemptsMember2: 0,
              })
            );
            break;
          case 3:
            dispatch(
              DATA_GAME({
                name: dataServer.name,
                attempts: 0,
                attemptsMember3: 0,
              })
            );
            break;
          case 4:
            dispatch(
              DATA_GAME({
                name: dataServer.name,
                attempts: 0,
                attemptsMember4: 0,
              })
            );
            break;
          default:
            break;
        }
      }
      if (countPokemonsSelect < dataGame.attempts) {
        switch (dataServer.myNumber) {
          case 2:
            dispatch(
              DATA_GAME({
                name: dataServer.name,
                attemptsMember2: countPokemonsSelect,
                attempts: countPokemonsSelect,
              })
            );
            break;
          case 3:
            dispatch(
              DATA_GAME({
                name: dataServer.name,
                attemptsMember3: countPokemonsSelect,
                attempts: countPokemonsSelect,
              })
            );
            break;
          case 4:
            dispatch(
              DATA_GAME({
                name: dataServer.name,
                attemptsMember4: countPokemonsSelect,
                attempts: countPokemonsSelect,
              })
            );
            break;
          default:
            break;
        }
      } else {
        switch (dataServer.myNumber) {
          case 2:
            socket.emit("dataGameMember", {
              name: dataGame.name,
              bestTime: dataGame.bestTimeMember2,
              attempts: dataGame.attemptsMember2,
              numberMember: dataServer.myNumber,
            });
            break;
          case 3:
            socket.emit("dataGameMember", {
              name: dataGame.name,
              bestTime: dataGame.bestTimeMember3,
              attempts: dataGame.attemptsMember3,
              numberMember: dataServer.myNumber,
            });
            break;
          case 4:
            socket.emit("dataGameMember", {
              name: dataGame.name,
              bestTime: dataGame.bestTimeMember4,
              attempts: dataGame.attemptsMember4,
              numberMember: dataServer.myNumber,
            });
            break;
          default:
            break;
        }
      }
    } else {
      if (countPokemonsSelect < dataGame.attempts) {
        switch (dataServer.myNumber) {
          case 2:
            await dispatch(
              DATA_GAME({
                name: dataServer.name,
                attemptsMember2: countPokemonsSelect,
                attempts: countPokemonsSelect,
              })
            );
            break;
          case 3:
            await dispatch(
              DATA_GAME({
                name: dataServer.name,
                attemptsMember3: countPokemonsSelect,
                attempts: countPokemonsSelect,
              })
            );
            break;
          case 4:
            await dispatch(
              DATA_GAME({
                name: dataServer.name,
                attemptsMember4: countPokemonsSelect,
                attempts: countPokemonsSelect,
              })
            );
            break;
          default:
            break;
        }
      }
    }
    setCountPokemonsSelect(0);
  };

  useEffect(() => {
    if (
      dataServer.round === dataServer.numberGames &&
      dataServer.hitCounter === dataServer.countMembers
    ) {
      if (dataGame.attempts > 0) {
        switch (dataServer.myNumber) {
          case 2:
            socket.emit("dataGameMember", {
              name: dataGame.name,
              bestTime: dataGame.bestTimeMember2,
              attempts: dataGame.attemptsMember2,
              numberMember: dataServer.myNumber,
            });
            break;
          case 3:
            socket.emit("dataGameMember", {
              name: dataGame.name,
              bestTime: dataGame.bestTimeMember3,
              attempts: dataGame.attemptsMember3,
              numberMember: dataServer.myNumber,
            });
            break;
          case 4:
            socket.emit("dataGameMember", {
              name: dataGame.name,
              bestTime: dataGame.bestTimeMember4,
              attempts: dataGame.attemptsMember4,
              numberMember: dataServer.myNumber,
            });
            break;
          default:
            break;
        }
      }
      if (dataGame.attempts === 0) {
        socket.emit("dataGameMember", {
          name: dataGame.name,
          bestTime: dataGame.bestTime,
          attempts: dataGame.attempts,
          numberMember: dataServer.myNumber,
        });
      }
    }
  }, [dataGame.attempts]);

  const handlerPoints = (correct) => {
    switch (correct.number) {
      case 1:
        dispatch(
          DATA_SERVER({
            scoreAdmin: correct.points,
            hitCounter: correct.hitCounter,
          })
        );
        break;
      case 2:
        dispatch(
          DATA_SERVER({
            scoreMember1: correct.points,
            hitCounter: correct.hitCounter,
          })
        );
        break;
      case 3:
        dispatch(
          DATA_SERVER({
            scoreMember2: correct.points,
            hitCounter: correct.hitCounter,
          })
        );
        break;
      case 0:
        dispatch(
          DATA_SERVER({
            scoreMember3: correct.point,
            hitCounter: correct.hitCounters,
          })
        );
        break;
      default:
        break;
    }
  };

  const timeStartGame = (startGame) => {
    dispatch(
      DATA_SERVER({
        timeShowShadow: startGame.timeShowShadow,
        numberGames: startGame.numberGames,
      })
    );
    setCountShowPokemon(0);
    setStartGame(startGame);
    handleStart();
    initGame(startGame);
  };

  const initGame = (startGame) => {
    dispatch(DELETE_ALL_DATA());
    setBusquedaPokemon("");
    setNamePokemonSelect([]);
    setShowCorrect(false);
    setCorrectCounter(0);
    setDisableBtn(false);
    setShowResults(false);
    setPokeballReady(false);
    setShowImg(false);
    dispatch(PRACTICE({ active: "disable" }));
    setArrPokemons([]);
    setAuxPokemonList(startGame.arrGeneration);
    loadselect(startGame.numPokemon);
    setNoRepeat(true);
    setCountShowPokemon(0);
    //dispatch(SHOW_CONFIG(true)) solo cuando se acaben los
  };

  useEffect(() => {
    if (practice.click === true) {
      handlePractice();
      dispatch(PRACTICE({ click: false }));
      setTimeout(() => {
        moveCursorToEnd()
      }, 1000);
    }
  }, [practice]);

  const handlePractice = async (aux) => {
    dispatch(DELETE_ALL_DATA());
    setBusquedaPokemon("");
    setNamePokemonSelect([]);
    setArrPokemons([]);
    setShowImg(false);
    setShowResults(false);
    setPokeballReady(false);
    setShowCorrect(false);
    setDisableBtn(false);
    setCorrectCounter(0);
    setCountShowPokemon(0);
    for (let index = 0; index < arrGeneration.length; index++) {
      loadPokemonPractice(arrGeneration[index]);
    }

    let max = 1 + arrGeneration[0],
      auxNum = Math.floor(Math.random() * (max - 1 + 1) + 1);
    loadselect(auxNum);
    setDisableBtn(false);
    refPanelPokeball.current.classList.add("is-multi");
  };

  const STATUS = {
    STARTED: "Started",
    STOPPED: "Stopped",
  };

  const [secondsRemaining, setSecondsRemaining] = useState(9);
  const [startGame, setStartGame] = useState();
  const [status, setStatus] = useState(STATUS.STOPPED);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  const handleStart = () => {
    setStatus(STATUS.STARTED);
  };

  const handleReset = () => {
    setStatus(STATUS.STOPPED);
    setSecondsRemaining(9);
  };

  useInterval(
    () => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1);
      } else {
        dispatch(COUNTDOWN(true));
        dispatch(SHOW_CONFIG(false));
        handleReset();
        setAuxInput("");
        setBusquedaPokemon("");
        filterPokemon("");
        setTimeout(() => {
          moveCursorToEnd();
        }, 1000);
      }
    },
    status === STATUS.STARTED ? 1000 : null
    // passing null stops the interval
  );

  const moveCursorToEnd = () => {
    let el = document.getElementById("buscador");
    el.focus();
    if (typeof el.selectionStart == "number") {
      el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
      var range = el.createTextRange();
      range.collapse(false);
      range.select();
    }
  };

  useEffect(() => {
    //escuchando el seacabo el tiempo para desabilitar el juego
    if (showCorrect === false) {
      if (noCorrect === true) {
        handleSubmit();
        setDisableBtn(true);
        dispatch(DATA_SERVER({ hitCounter: dataServer.countMembers }));
        setNoRepeat(false);
        dispatch(COUNTDOWN(false));
      }
    } else {
      if (noCorrect === true) {
        dispatch(DATA_SERVER({ hitCounter: dataServer.countMembers }));
        setNoRepeat(false);
        dispatch(COUNTDOWN(false));
        dispatch(NOCORRECT(false));
      }
    }
  }, [noCorrect]);

  return (
    <div>
      {showConfig ? (
        showCountdown ? (
          <div id="waitMulti" ref={refPanel}>
            <h2>Round {dataServer.round} will start in:</h2>
            <h2>{secondsRemaining}s</h2>
            <img src={pokeball} alt="" />
          </div>
        ) : (
          <div id="waitMulti" ref={refPanel}>
            <h2>Waiting for {dataServer.nameAdmin} to set up the game</h2>
            <img src={pokeball} alt="" />
          </div>
        )
      ) : showResults ? (
        <div id="panelResults" ref={refPanel}>
          <div id="results" ref={refResults}>
            <div>
              <button
                onClick={() => refResults.current.classList.toggle("is-active")}
              >
                Results
              </button>
            </div>
            <div>
              {dataServer.countMembers === 1 ? (
                <div>
                  <div>
                    <div>
                      <h2> Name </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> Points </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> Best Time </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> Attempts </h2>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h2> {dataServer.nameAdmin} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataServer.scoreAdmin} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataGame.bestTimeMember1} s </h2>
                    </div>
                    <div>
                      {" "}
                      <h2>{dataGame.attemptsMember1}</h2>
                    </div>
                  </div>
                </div>
              ) : dataServer.countMembers === 2 ? (
                <div>
                  <div>
                    <div>
                      <h2> Name </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> Points </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> Best Time </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> Attempts </h2>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h2> {dataServer.nameAdmin} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataServer.scoreAdmin} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataGame.bestTimeMember1} s </h2>
                    </div>
                    <div>
                      {" "}
                      <h2>{dataGame.attemptsMember1}</h2>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h2> {dataServer.nameMember1} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataServer.scoreMember1} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataGame.bestTimeMember2} s </h2>
                    </div>
                    <div>
                      {" "}
                      <h2>{dataGame.attemptsMember2}</h2>
                    </div>
                  </div>
                </div>
              ) : dataServer.countMembers === 3 ? (
                <div>
                  <div>
                    <div>
                      <h2> Name </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> Points </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> Best Time </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> Attempts </h2>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h2> {dataServer.nameAdmin} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataServer.scoreAdmin} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataGame.bestTimeMember1} s </h2>
                    </div>
                    <div>
                      {" "}
                      <h2>{dataGame.attemptsMember1}</h2>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h2> {dataServer.nameMember1} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataServer.scoreMember1} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataGame.bestTimeMember2} s </h2>
                    </div>
                    <div>
                      {" "}
                      <h2>{dataGame.attemptsMember2}</h2>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h2> {dataServer.nameMember2} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataServer.scoreMember2} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataGame.bestTimeMember3} s </h2>
                    </div>
                    <div>
                      {" "}
                      <h2>{dataGame.attemptsMember3}</h2>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div>
                    <div>
                      <h2> Name </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> Points </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> Best Time </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> Attempts </h2>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h2> {dataServer.nameAdmin} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataServer.scoreAdmin} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataGame.bestTimeMember1} s </h2>
                    </div>
                    <div>
                      {" "}
                      <h2>{dataGame.attemptsMember1}</h2>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h2> {dataServer.nameMember1} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataServer.scoreMember1} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataGame.bestTimeMember2} s </h2>
                    </div>
                    <div>
                      {" "}
                      <h2>{dataGame.attemptsMember2}</h2>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h2> {dataServer.nameMember2} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataServer.scoreMember2} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataGame.bestTimeMember3} s </h2>
                    </div>
                    <div>
                      {" "}
                      <h2>{dataGame.attemptsMember3}</h2>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h2> {dataServer.nameMember3} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataServer.scoreMember3} </h2>
                    </div>
                    <div>
                      {" "}
                      <h2> {dataGame.bestTimeMember4} s </h2>
                    </div>
                    <div>
                      {" "}
                      <h2>{dataGame.attemptsMember4}</h2>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div id="panelAux"></div>
        </div>
      ) : (
        <div ref={refPanel}>hola</div>
      )}
      <div id="divPokemonSingle" className="pc" ref={refPanelPokeball}>
        <div id="divImgPokemons">
          {pokeballReady ? (
            <div>
              {showImg ? (
                <div
                  id="divImgPokemonShow"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  {practice.active === true && disableBtn === true ? (
                    <div>
                      <button
                        onClick={() => {
                          dispatch(PRACTICE({ active: true, click: true }));
                          dispatch(DELETE_ALL_DATA());
                          setAuxInput("");
                          setBusquedaPokemon("");
                          filterPokemon("");
                          setTimeout(() => {
                            moveCursorToEnd();
                          }, 1000);
                        }}
                      >
                        Ctrl
                      </button>
                      <button
                        style={{
                          backgroundColor: "rgba(197, 213, 226, 0.815)",
                          color: "rgb(61, 91, 126)",
                        }}
                        onClick={() => {
                          dispatch(PRACTICE({ active: true, click: true }));
                          dispatch(DELETE_ALL_DATA());
                          setAuxInput("");
                          setBusquedaPokemon("");
                          filterPokemon("");
                          setTimeout(() => {
                            moveCursorToEnd();
                          }, 1000);
                        }}
                      >
                        RELOAD
                      </button>
                    </div>
                  ) : disableBtn === true ? (
                    <div>
                      {" "}
                      <button
                        disabled
                        style={{
                          color: "white",
                          cursor: "not-allowed",
                          backgroundColor: "rgb(203, 192, 206)",
                        }}
                      >
                        Ctrl
                      </button>
                      <button
                        disabled
                        style={{
                          cursor: "not-allowed",
                          color: "white",
                        }}
                      >
                        Nose
                      </button>
                    </div>
                  ) : (
                    <div>
                      {" "}
                      <button onClick={handleSubmit}>Ctrl</button>
                      <button
                        style={{
                          color: "white",
                        }}
                        onClick={handleSubmit}
                      >
                        Surrender
                      </button>
                    </div>
                  )}
                  {disableBtn ? (
                    <img
                      id="imgPokemon"
                      style={{ filter: "brightness(100%)" }}
                      src={dbPokemonSelect.sprites.front_default}
                      alt=""
                    />
                  ) : (
                    <img
                      id="imgPokemon"
                      style={{ filter: "brightness(0%)" }}
                      src={dbPokemonSelect.sprites.front_default}
                      alt=""
                    />
                  )}
                </div>
              ) : countShowPokemon === 3 ? ( //cuando son tres llaves las obtenidas
                <div id="divInicioPokeball">
                  <div>
                    {" "}
                    <button
                      onClick={() => {
                        setShowImg(true);
                        new Audio(showShadow).play();
                      }}
                    >
                      {" "}
                      Ctrl{" "}
                    </button>
                    <button
                      onClick={() => {
                        setShowImg(true);
                        new Audio(showShadow).play();
                      }}
                      style={{ backgroundColor: "rgb(125, 60, 152)" }}
                    >
                      Show Shadow
                      <br />
                      <img className="is-active key" src={llave} alt="key1" />
                      <img className="is-active key" src={llave} alt="key2" />
                      <img className="is-active key" src={llave} alt="key3" />
                    </button>
                  </div>
                  <img
                    id="imgPokeballShow"
                    src={pokeball}
                    width="20vw"
                    alt=""
                  />
                  <div id="divCircle"></div>
                </div>
              ) : countShowPokemon === 2 ? ( //cuando son dos llaves las obtenidas
                <div id="divInicioPokeball">
                  <div>
                    <button
                      disabled
                      style={{
                        cursor: "not-allowed",
                        backgroundColor: "#d8d8f7",
                      }}
                    >
                      {" "}
                      Ctrl{" "}
                    </button>
                    <button
                      disabled
                      style={{
                        color: "white",
                        cursor: "not-allowed",
                        backgroundColor: "rgb(203, 192, 206)",
                      }}
                    >
                      Show Shadow
                      <br />
                      <img className="is-active key" src={llave} alt="key1" />
                      <img className="is-active key" src={llave} alt="key2" />
                      <img
                        className="key"
                        style={{
                          filter: "brightness(50%)",
                        }}
                        src={llave}
                        alt="key3"
                      />
                    </button>{" "}
                  </div>
                  <img
                    id="imgPokeballShow"
                    src={pokeball}
                    width="20vw"
                    alt=""
                  />
                  <div id="divCircle"></div>
                </div>
              ) : countShowPokemon === 1 ? ( //cuando es una llave las obtenida
                <div id="divInicioPokeball">
                  <div>
                    <button
                      disabled
                      style={{
                        cursor: "not-allowed",
                        backgroundColor: "#d8d8f7",
                      }}
                    >
                      {" "}
                      Ctrl{" "}
                    </button>
                    <button
                      disabled
                      style={{
                        color: "white",
                        cursor: "not-allowed",
                        backgroundColor: "rgb(203, 192, 206)",
                      }}
                    >
                      Show Shadow
                      <br />
                      <img className="is-active key" src={llave} alt="key1" />
                      <img className="is-active key" src={llave} alt="key2" />
                      <img
                        className="key"
                        style={{
                          filter: "brightness(50%)",
                        }}
                        src={llave}
                        alt="key3"
                      />
                    </button>{" "}
                  </div>
                  <img
                    id="imgPokeballShow"
                    src={pokeball}
                    width="20vw"
                    alt=""
                  />
                  <div id="divCircle"></div>
                </div>
              ) : (
                <div id="divInicioPokeball">
                  <div>
                    {" "}
                    <button
                      disabled
                      style={{
                        cursor: "not-allowed",
                        backgroundColor: "#d8d8f7",
                      }}
                    >
                      {" "}
                      Ctrl{" "}
                    </button>
                    <button
                      disabled
                      style={{
                        color: "white",
                        cursor: "not-allowed",
                        backgroundColor: "rgb(203, 192, 206)",
                      }}
                    >
                      Show Shadow
                      <br />
                      <img
                        className="key"
                        style={{
                          filter: "brightness(50%)",
                        }}
                        src={llave}
                        alt="key1"
                      />
                      <img
                        className="key"
                        style={{
                          filter: "brightness(50%)",
                        }}
                        src={llave}
                        alt="key2"
                      />
                      <img
                        className="key"
                        style={{
                          filter: "brightness(50%)",
                        }}
                        src={llave}
                        alt="key3"
                      />
                    </button>
                  </div>
                  <img
                    id="imgPokeballShow"
                    src={pokeball}
                    width="20vw"
                    alt=""
                  />
                  <div id="divCircle"></div>
                </div>
              )}
            </div>
          ) : (
            <div
              id="divInicioPokeball"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {practice.active === true ? (
                <div>
                  <button
                    onClick={() => {
                      dispatch(PRACTICE({ active: true, click: true }));
                      dispatch(DELETE_ALL_DATA());
                      setAuxInput("");
                      setBusquedaPokemon("");
                      filterPokemon("");
                      setTimeout(() => {
                        moveCursorToEnd();
                      }, 1000);
                    }}
                  >
                    Ctrl
                  </button>
                  <button
                    style={{
                      backgroundColor: "rgba(197, 213, 226, 0.815)",
                      color: "rgb(61, 91, 126)",
                    }}
                    onClick={() => {
                      dispatch(PRACTICE({ active: true, click: true }));
                      dispatch(DELETE_ALL_DATA());
                      setAuxInput("");
                      setBusquedaPokemon("");
                      filterPokemon("");
                      setTimeout(() => {
                        moveCursorToEnd();
                      }, 1000);
                    }}
                  >
                    PRACTICE
                  </button>
                </div>
              ) : (
                <div>
                  {" "}
                  <button
                    style={{
                      cursor: "not-allowed",
                    }}
                  >
                    Ctrl
                  </button>
                  <button
                    style={{
                      cursor: "not-allowed",
                    }}
                  >
                    Show Pokemon <br />{" "}
                    <img
                      className="key"
                      style={{
                        filter: "brightness(50%)",
                      }}
                      src={llave}
                      alt="key1"
                    />
                    <img
                      className="key"
                      style={{
                        filter: "brightness(50%)",
                      }}
                      src={llave}
                      alt="key2"
                    />
                    <img
                      className="key"
                      style={{
                        filter: "brightness(50%)",
                      }}
                      src={llave}
                      alt="key3"
                    />
                  </button>
                </div>
              )}
              <img src={pokeball} alt="" />
            </div>
          )}
        </div>
        <div id="divBuscadorPokemon">
          <div>
            <h2 htmlFor="text">Who is this Pokemon? {countPokemonsSelect}</h2>
          </div>
          <div id="divBuscadorPokemons">
            <div>
              {showCorrect ? (
                <div id="divCorrect">
                  <h2>WIN</h2>
                </div>
              ) : countdown || practice.active === true ? (
                <input
                  type="text"
                  name="busqueda"
                  placeholder="Name"
                  value={busquedaPokemon}
                  onKeyUp={keyUp}
                  id="buscador"
                  onChange={handleBusquedaPokemons}
                  autoComplete="off"
                />
              ) : (
                <input
                  type="text"
                  name="busqueda"
                  id="buscador"
                  placeholder="Name"
                  disabled="on"
                />
              )}
            </div>
            <div id="divBtnOpc">
              {namePokemonSelect.map(
                (
                  { name },
                  index //eliminar el reset de Admin
                ) =>
                  disableBtn ? (
                    <div key={name}></div>
                  ) : (
                    <div key={name}>
                      <button
                        slot={name}
                        value={name}
                        onClick={selectNamePokemon}
                      >
                        {" "}
                        {index + 1}{" "}
                      </button>
                      <button
                        slot={name}
                        value={name}
                        translate="no"
                        onClick={selectNamePokemon}
                      >
                        {" "}
                        {name}{" "}
                      </button>
                    </div>
                  )
              )}
            </div>
          </div>
          <div id="listPokemons" ref={refListPokemon}>
            {arrPokemons.map(({ name, gen, img, type1, type2, id }) =>
              name === dbPokemonSelect.name ? (
                <div className="true" key={id}>
                  <div>
                    {gen > pokemonGen ? (
                      <h1>
                        {gen}
                        <img src={arrowDown} alt="" />
                      </h1>
                    ) : gen < pokemonGen ? (
                      <h1>
                        {gen}
                        <img src={arrowUp} alt="" />
                      </h1>
                    ) : (
                      <h1 className="is-true">{gen}</h1>
                    )}
                  </div>
                  <div>
                    <img src={img} alt="" />
                  </div>
                  <div translate="no">
                    <h1
                      value={name}
                      slot={name}
                      translate="no"
                      onClick={selectNamePokemon}
                    >
                      {name}
                    </h1>
                  </div>
                  <div>
                    {dbPokemonSelect.types.length === 2 ? (
                      type1 === dbPokemonSelect.types[0].type.name ? (
                        <h2 className={type1}>{type1}</h2>
                      ) : type1 === dbPokemonSelect.types[1].type.name ? (
                        <h2 className={type1}>{type1}</h2>
                      ) : (
                        <h2 className="false">{type1}</h2>
                      )
                    ) : type1 === dbPokemonSelect.types[0].type.name ? (
                      <h2 className={type1}>{type1}</h2>
                    ) : (
                      <h2 className="false"> {type1}</h2>
                    )}
                  </div>
                  <div>
                    {type2 == null ? (
                      <div></div>
                    ) : dbPokemonSelect.types.length === 2 ? (
                      type2 === dbPokemonSelect.types[0].type.name ? (
                        <h2 className={type2}>{type2}</h2>
                      ) : type2 === dbPokemonSelect.types[1].type.name ? (
                        <h2 className={type2}>{type2}</h2>
                      ) : (
                        <h2 className="false">{type2}</h2>
                      )
                    ) : type2 === dbPokemonSelect.types[0].type.name ? (
                      <h2 className={type2}>{type2}</h2>
                    ) : (
                      <h2 className="false"> {type2}</h2>
                    )}
                  </div>
                </div>
              ) : (
                <div key={name}>
                  <div>
                    {gen > pokemonGen ? (
                      <h1>
                        {gen}
                        <img src={arrowDown} alt="" />
                      </h1>
                    ) : gen < pokemonGen ? (
                      <h1>
                        {gen}
                        <img src={arrowUp} alt="" />
                      </h1>
                    ) : (
                      <h1 className="is-true">{gen}</h1>
                    )}
                  </div>
                  <div>
                    <img src={img} alt="" />
                  </div>
                  <div>
                    <h1
                      value={name}
                      slot={name}
                      translate="no"
                      onClick={selectNamePokemon}
                    >
                      {name}
                    </h1>
                  </div>
                  <div>
                    {dbPokemonSelect.types.length === 2 ? (
                      type1 === dbPokemonSelect.types[0].type.name ? (
                        <h2 className={type1}>{type1}</h2>
                      ) : type1 === dbPokemonSelect.types[1].type.name ? (
                        <h2 className={type1}>{type1}</h2>
                      ) : (
                        <h2 className="false">{type1}</h2>
                      )
                    ) : type1 === dbPokemonSelect.types[0].type.name ? (
                      <h2 className={type1}>{type1}</h2>
                    ) : (
                      <h2 className="false"> {type1}</h2>
                    )}
                  </div>
                  <div>
                    {type2 == null ? (
                      <div></div>
                    ) : dbPokemonSelect.types.length === 2 ? (
                      type2 === dbPokemonSelect.types[0].type.name ? (
                        <h2 className={type2}>{type2}</h2>
                      ) : type2 === dbPokemonSelect.types[1].type.name ? (
                        <h2 className={type2}>{type2}</h2>
                      ) : (
                        <h2 className="false">{type2}</h2>
                      )
                    ) : type2 === dbPokemonSelect.types[0].type.name ? (
                      <h2 className={type2}>{type2}</h2>
                    ) : (
                      <h2 className="false"> {type2}</h2>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitMember;
