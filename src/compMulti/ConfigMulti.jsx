import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  READ_ALL_DATA_1,
  READ_ALL_DATA_2,
  DELETE_ALL_DATA,
  DELETE_POKEMON,
  DATA_SERVER,
  SHOW_CONFIG,
  COUNTDOWN,
  SHOW_MENU,
  NOCORRECT,
  DATA_GAME,
  DATA_ATTEMPTS,
  DATA_ATTEMPTS_DELETE,
  DATA_ROUND_DELETE,
  PRACTICE,
  TIME,
} from "../reducers/crudReducer.jsx";
import {
  getPokemonList,
  getPokemon,
  getPokemonSelect,
} from "../services/routesPokemon";
import pokeball from "../assets/pokeball.png";
import socket from "../socket/socket";
import arrowUp from "../assets/arrow-up.svg";
import arrowKeyDown from "../assets/chevron-down.svg";
import arrowKeyUp from "../assets/chevron-up.svg";
import llave from "../assets/llave.png";
import arrowDown from "../assets/arrow-down.svg";
import keyArcert from "../assets/acert.mp3";
import showShadow from "../assets/showShadow.mp3";
import click from "../assets/click.mp3";
import waitPokeball from "../assets/waitPokeball.mp3";
import btnIncorrect from "../assets/btnIncorrect.mp3";
import keyArcertAll from "../assets/acertAll.mp3";
import battle from "../assets/battle.mp3";
import moment from "moment";

const ConfigMulti = () => {
  const [arrGeneration, setArrGeneration] = useLocalStorage("arrGeneration", [
      151,
    ]),
    dbPokemon1 = useSelector((state) => state.dbPokemon1),
    dbPokemonSelect = useSelector((state) => state.dbPokemonSelect),
    dataServer = useSelector((state) => state.dataServer),
    dataAttempts = useSelector((state) => state.dataAttempts),
    showConfig = useSelector((state) => state.showConfig),
    noCorrect = useSelector((state) => state.noCorrect),
    practice = useSelector((state) => state.practice),
    dataBestTime = useSelector((state) => state.dataBestTime),
    hidePanelConfig = useSelector((state) => state.hidePanelConfig),
    dataGame = useSelector((state) => state.dataGame),
    countdown = useSelector((state) => state.countdown),
    time = useSelector((state) => state.time),
    dispatch = useDispatch(),
    STATUS = {
      STARTED: "Started",
      STOPPED: "Stopped",
    },
    [pokeballReady, setPokeballReady] = useLocalStorage("pokeballReady", false),
    [showImg, setShowImg] = useLocalStorage("showImg", false),
    [auxInput, setAuxInput] = useLocalStorage("auxInput", ""),
    [hidePanel, setHidePanel] = useLocalStorage("hidePanel", false),
    [showCorrect, setShowCorrect] = useLocalStorage("showCorrect", false),
    [countShowPokemon, setCountShowPokemon] = useLocalStorage(
      "countShowPokemon",
      0
    ),
    [showCountdown, setShowCountdown] = useLocalStorage("showCountdown", false),
    [numPokemon, setNumPokemon] = useLocalStorage("numPokemon", 0),
    [showResults, setShowResults] = useLocalStorage("showResults", false),
    [correctCounter, setCorrectCounter] = useLocalStorage("correctCounter", 0),
    [countPokemonsSelect, setCountPokemonsSelect] = useLocalStorage(
      "countPokemonsSelect",
      0
    ),
    [counterDown, setCounterDown] = useLocalStorage("counterDown", 11),
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
    [arrPokemonsUse, setArrPokemonsUse] = useLocalStorage("arrPokemonUse", []),
    [arrPokemons, setArrPokemons] = useLocalStorage("arrPokemons", []),
    [disableBtn, setDisableBtn] = useLocalStorage("disableBtn", false),
    [secondsRemaining, setSecondsRemaining] = useLocalStorage(
      "secondsRemaining",
      9
    ),
    [status, setStatus] = useLocalStorage("status", STATUS.STOPPED),
    refResults = useRef(),
    refPanel = useRef(),
    refListPokemon = useRef(),
    refPanelPokeball = useRef();

  let details = navigator.userAgent;
  let regexp = /android|iphone|kindle|ipad/i;
  let isMobileDevice = regexp.test(details);

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

  /* document.addEventListener("keydown", (e) => {
    if (practice.active === true && e.keyCode === 17 && setPokeballReady(false) && countShowPokemon > 3) {
      dispatch(PRACTICE({ active: true, click: true }))
      moveCursorToEnd();
    }
    /* if (modeGame === false) {
      console.log(modeGame);
      if (
        e.keyCode >= 65 && e.keyCode <= 90
      ) {
        moveCursorToEnd();
      }
    } */
  /* if (
      e.keyCode === 13
    ) {
      if (showImg === true) {
        handleSend();
      } else {
        setShowImg(true)
      }
    }
  }); */

  //Poner focus en input
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

  //Cambio de color en botones de generacion
  const handleBtnGeneration = (e) => {
    new Audio(click).play();
    if (arrGeneration.includes(Number(e.target.slot))) {
      setArrGeneration(
        arrGeneration.filter((item) => item !== Number(e.target.slot))
      );
      e.target.style.backgroundColor = "rgba(164, 168, 189, 0.726)";
      e.target.style.color = "whitesmoke";
    } else {
      e.target.style.backgroundColor = "rgb(129, 179, 212)";
      e.target.style.color = "whitesmoke";
      setArrGeneration([...arrGeneration, Number(e.target.slot)]);
    }
  };

  //Pedir a pokeapi el pokemon selecto
  const loadPokemon1 = async (num) => {
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

  //Pedir a pokeapi las generaciones
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

  //Escuchando cuando se regresa al menu
  useEffect(() => {
    if (hidePanelConfig === true) {
      refPanel.current.classList.add("is-active");
      refPanelPokeball.current.classList.add("is-multi");
    }
    if (hidePanelConfig === false) {
      refPanel.current.classList.remove("is-active");
      refPanelPokeball.current.classList.remove("is-multi");
    }
  }, [hidePanelConfig]);

  //Filtro de busqueda del input
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

  //Manejador de input para que no acepte esos valores
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

  const handleBusquedaPokemons = (e) => {};

  //Reproducir audio y subir contador de pokemons
  const playAudioAcert = () => {
    new Audio(keyArcert).play();
    setCountShowPokemon(countShowPokemon + 1);
  };

  //Pedir a pokeapi el pokemon seleccionado y comprobando los aciertos en generacion o tipos
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

  //Manejador de rendicion
  const handleSubmit = () => {
    pokemonSelect(dbPokemonSelect.name);
    setDisableBtn(true);
    dispatch(NOCORRECT(false));
  };

  //manejador de botones y comprobador de acierto de pokemon selecto asi como emicion de socket y asignacion de puntos
  const selectNamePokemon = async (e) => {
    e.preventDefault();
    setCountPokemonsSelect(countPokemonsSelect + 1);
    if (e.target.value === dbPokemonSelect.name) {
      if (showImg) {
        setShowCorrect(true);
        setDisableBtn(true);
      } else {
        setShowImg(true);
        setShowCorrect(true);
        setDisableBtn(true);
      }
      dispatch(COUNTDOWN(false));
      if (practice.active === false || practice.active === "disable") {
        switch (correctCounter) {
          case 0:
            dispatch(
              DATA_SERVER({
                scoreAdmin: dataServer.scoreAdmin + 8,
                hitCounter: dataServer.hitCounter + 1,
              })
            );
            socket.emit("correct", {
              nameServer: dataServer.nameServer,
              number: 1,
              points: dataServer.scoreAdmin + 8,
              numAcert: 1,
              hitCounter: dataServer.hitCounter + 1,
            });
            break;
          case 1:
            dispatch(
              DATA_SERVER({
                scoreAdmin: dataServer.scoreAdmin + 6,
                hitCounter: dataServer.hitCounter + 1,
              })
            );
            socket.emit("correct", {
              nameServer: dataServer.nameServer,
              number: 1,
              points: dataServer.scoreAdmin + 6,
              numAcert: 2,
              hitCounter: dataServer.hitCounter + 1,
            });
            break;
          case 2:
            dispatch(
              DATA_SERVER({
                scoreAdmin: dataServer.scoreAdmin + 4,
                hitCounter: dataServer.hitCounter + 1,
              })
            );
            socket.emit("correct", {
              nameServer: dataServer.nameServer,
              number: 1,
              points: dataServer.scoreAdmin + 4,
              numAcert: 3,
              hitCounter: dataServer.hitCounter + 1,
            });
            break;
          case 3:
            dispatch(
              DATA_SERVER({
                scoreAdmin: dataServer.scoreAdmin + 2,
                hitCounter: dataServer.hitCounter + 1,
              })
            );
            setCorrectCounter(correctCounter - 3);
            socket.emit("correct", {
              nameServer: dataServer.nameServer,
              number: 1,
              points: dataServer.scoreAdmin + 2,
              numAcert: 0,
              hitCounter: dataServer.hitCounter + 1,
            });
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

  //manejador de teclas y comprobador de acierto de pokemon selecto asi como emicion de socket y asignacion de puntos
  const selectNamePokemonKey = async (key) => {
    setCountPokemonsSelect(countPokemonsSelect + 1);
    if (key === dbPokemonSelect.name) {
      if (showImg) {
        setShowCorrect(true);
        setDisableBtn(true);
      } else {
        setShowImg(true);
        setShowCorrect(true);
        setDisableBtn(true);
      }
      if (practice.active === false || practice.active === "disable") {
        dispatch(COUNTDOWN(false));
        switch (correctCounter) {
          case 0:
            dispatch(
              DATA_SERVER({
                scoreAdmin: dataServer.scoreAdmin + 8,
                hitCounter: dataServer.hitCounter + 1,
              })
            );
            socket.emit("correct", {
              nameServer: dataServer.nameServer,
              number: 1,
              points: dataServer.scoreAdmin + 8,
              numAcert: 1,
              hitCounter: dataServer.hitCounter + 1,
            });
            break;
          case 1:
            dispatch(
              DATA_SERVER({
                scoreAdmin: dataServer.scoreAdmin + 6,
                hitCounter: dataServer.hitCounter + 1,
              })
            );
            socket.emit("correct", {
              nameServer: dataServer.nameServer,
              number: 1,
              points: dataServer.scoreAdmin + 6,
              numAcert: 2,
              hitCounter: dataServer.hitCounter + 1,
            });
            break;
          case 2:
            dispatch(
              DATA_SERVER({
                scoreAdmin: dataServer.scoreAdmin + 4,
                hitCounter: dataServer.hitCounter + 1,
              })
            );
            socket.emit("correct", {
              nameServer: dataServer.nameServer,
              number: 1,
              points: dataServer.scoreAdmin + 4,
              numAcert: 3,
              hitCounter: dataServer.hitCounter + 1,
            });
            break;
          case 3:
            dispatch(
              DATA_SERVER({
                scoreAdmin: dataServer.scoreAdmin + 2,
                hitCounter: dataServer.hitCounter + 1,
              })
            );
            setCorrectCounter(correctCounter - 3);
            socket.emit("correct", {
              nameServer: dataServer.nameServer,
              number: 1,
              points: dataServer.scoreAdmin + 2,
              numAcert: 0,
              hitCounter: dataServer.hitCounter + 1,
            });
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

  //Reiniciar datos de partida y mandar socket de comienzo de partida en equipo
  const handleSend = async (aux) => {
    dispatch(TIME(Number(moment().format("HH"))));
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
    setCountPokemonsSelect(0);
    dispatch(PRACTICE({ active: "disable" }));
    for (let index = 0; index < arrGeneration.length; index++) {
      loadPokemon1(arrGeneration[index]);
    }

    let auxNumArra = Math.floor(Math.random() * (arrGeneration.length - 1 + 1)), //eligiendo un index del arra de generaciones al azar
      auxNumSend = 0;

    if (arrGeneration.length === 1) {
      let max, min;
      switch (arrGeneration[0]) {
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
      max = min + arrGeneration[0];
      let auxNum = Math.floor(Math.random() * (max - min + 1) + min);
      loadselect(auxNum);
      auxNumSend = auxNum;
    } else {
      let max, min;
      switch (arrGeneration[auxNumArra]) {
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
      max = min + arrGeneration[auxNumArra];
      let auxNum = Math.floor(Math.random() * (max - min + 1) + min);
      loadselect(auxNum);
      auxNumSend = auxNum;
    }

    let date = new Date(),
      sec = date.getSeconds() + 12;

    if (sec >= 60) {
      sec = sec - 60;
    }
    dispatch(SHOW_CONFIG(false));

    setTimeout(() => {
      dispatch(DATA_SERVER({ round: dataServer.round + 1 }));
    }, 200);
    handleTimeStart(); //comenzar countdown

    socket.emit("startGame", {
      nameServer: dataServer.nameServer,
      numberGames: dataServer.numberGames,
      timeShowShadow: dataServer.timeShowShadow,
      timeSec: sec,
      round: dataServer.round + 1,
      numPokemon: auxNumSend,
      arrGeneration: arrGeneration,
    });

    setHidePanel(true);
    setDisableBtn(false);
    refPanelPokeball.current.classList.add("is-multi");
  };

  //Manejar el comienzo de juego en modo practica
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
      loadPokemon1(arrGeneration[index]);
    }

    let max = 1 + arrGeneration[0],
      auxNum = Math.floor(Math.random() * (max - 1 + 1) + 1);
    loadselect(auxNum);
    setDisableBtn(false);
    refPanelPokeball.current.classList.add("is-multi");
  };

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

  const handleTimeStart = () => {
    setStatus(STATUS.STARTED);
  };

  const handleTimeReset = () => {
    setStatus(STATUS.STOPPED);
    setSecondsRemaining(9);
  };

  //Intervalo de manejo de tiempo antes de empezar
  useInterval(
    () => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1);
      } else {
        handleTimeReset();
        setShowCountdown(true);
        dispatch(COUNTDOWN(true));
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

  //Desactivar configuraciones cuando se esta en el home
  useEffect(() => {
    if (hidePanel === true) {
      setShowCorrect(false);
      setShowCountdown(false);
      setShowImg(false);
      setShowResults(false);
      setPokeballReady(false);
    }
  }, [hidePanel]);

  //manejador del tiempo para comenzar en
  const handlerTime = () => {
    let min = Math.floor(dataServer.timeShowShadow / 60),
      seg = dataServer.timeShowShadow % 60;
    return (
      <div>
        {seg == 0 ? (
          <h2>{min}m</h2>
        ) : (
          <h2>
            {min}m {seg}s
          </h2>
        )}
      </div>
    );
  };

  //Manejando el juego de practica y activando en el home
  useEffect(() => {
    if (practice.click === true) {
      handlePractice();
      dispatch(PRACTICE({ click: false }));
      setTimeout(() => {
        moveCursorToEnd();
      }, 1000);
    }
  }, [practice]);

  //Escuchador de sockets
  useEffect(() => {
    socket.on("correct", (correct) => {
      handlerPoints(correct);
      setCorrectCounter(correct.numAcert);
    });

    socket.on("dataGameMember", (dataGameMember) => {
      handlerDataGameFinal(dataGameMember);
    });
  }, [socket]);

  //Manejando Attempts y BestTime de miembros
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
    setShowResults(true);
  };

  //Escuchando cuando acaben todos los miembros
  useEffect(() => {
    setTimeout(() => {
      //Comprobando si se acabo la partida
      if (
        dataServer.round === dataServer.numberGames &&
        dataServer.hitCounter === dataServer.countMembers
      ) {
        //se terminaron las rondas
        handlerDataGame(1);
        dispatch(DATA_ATTEMPTS_DELETE());
        dispatch(DATA_ROUND_DELETE());
      } else {
        if (dataServer.hitCounter === dataServer.countMembers) {
          handlerDataGame(0);
          dispatch(DATA_SERVER({ hitCounter: 0, round: dataServer.round + 1 }));
          setShowCountdown(false);
          setCorrectCounter(0);
          setCountShowPokemon(0);
          handleSend();
        }
      }
    }, 3000);
  }, [dataServer.hitCounter]);

  //Manejando los attepts
  const handlerDataGame = async (aux) => {
    //Mandar todos los attempts al array
    dispatch(DATA_ATTEMPTS(countPokemonsSelect));
    //Manejando al mejor Attempts de las rondas
    if (aux === 1) {
      if (dataGame.attempts === 1000) {
        dispatch(
          DATA_GAME({
            name: dataServer.name,
            attempts: 0,
          })
        );
      }
      if (countPokemonsSelect < dataGame.attempts) {
        dispatch(
          DATA_GAME({
            name: dataServer.name,
            attempts: countPokemonsSelect,
          })
        );
      } else {
        socket.emit("dataGameMember", {
          name: dataGame.name,
          bestTime: dataGame.bestTime,
          attempts: dataGame.attempts,
          numberMember: dataServer.myNumber,
        });
      }
      if (dataServer.countMembers === 1) {
        setShowResults(true); //Mostrar resultados del juego
      }
    }

    if (aux === 0) {
      if (countPokemonsSelect < dataGame.attempts) {
        dispatch(
          DATA_GAME({
            name: dataServer.name,
            attempts: countPokemonsSelect,
          })
        );
      }
    }
    setCountPokemonsSelect(0);
  };

  //Escuachando cuando cambia el mejor attept para mandar el socket a members
  useEffect(() => {
    if (
      dataServer.round === dataServer.numberGames &&
      dataServer.hitCounter === dataServer.countMembers
    ) {
      if (dataGame.attempts > 0) {
        socket.emit("dataGameMember", {
          name: dataGame.name,
          bestTime: dataGame.bestTime,
          attempts: dataGame.attempts,
          numberMember: dataServer.myNumber,
        });
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

  //Guardando los puntos en el dataServer
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
      case 4:
        dispatch(
          DATA_SERVER({
            scoreMember3: correct.points,
            hitCounter: correct.hitCounter,
          })
        );
        break;
      default:
        break;
    }
  };

  //Escuchando el tiempo de partida para terminar la partida
  useEffect(() => {
    if (showCorrect === false) {
      if (noCorrect === true) {
        handleSubmit();
        setDisableBtn(true);
        dispatch(DATA_SERVER({ hitCounter: dataServer.countMembers }));
        dispatch(COUNTDOWN(false));
        setDisableBtn(true);
        setShowImg(true);
      }
    }
    if (showCorrect === true) {
      if (noCorrect === true) {
        dispatch(DATA_SERVER({ hitCounter: dataServer.countMembers }));
        dispatch(COUNTDOWN(false));
        dispatch(NOCORRECT(false));
        setDisableBtn(true);
        setShowImg(true);
      }
    }
  }, [noCorrect]);

  //Reseteo de partida
  const restartGame = () => {
    dispatch(DELETE_ALL_DATA());
    dispatch(DATA_ATTEMPTS_DELETE());
    dispatch(DATA_ROUND_DELETE());
    dispatch(READ_ALL_DATA_2({}));
    dispatch(
      DATA_SERVER({
        scoreAdmin: 0,
        scoreMember1: 0,
        scoreMember2: 0,
        scoreMember3: 0,
        round: 0,
        hitCounter: 0,
      })
    );
    dispatch(
      DATA_GAME({
        bestTime: 1000,
        attempts: 1000,
      })
    );
    setCountPokemonsSelect(0);
    setBusquedaPokemon("");
    setNamePokemonSelect([]);
    setShowCorrect(false);
    setDisableBtn(false);
    setShowCountdown(false);
    setShowResults(false);
    setPokeballReady(false);
    setShowImg(false);
    setCounterDown(11);
    setCountShowPokemon(0);
    setArrPokemons([]);
  };

  //escuchando reset Game
  useEffect(() => {
    if (showConfig === "return") {
      handleTimeReset(); //reset contador antes de la partida
      restartGame();
      dispatch(SHOW_MENU(false));
      dispatch(PRACTICE({ active: true }));
    }
    if (showConfig === true) {
      dispatch(PRACTICE({ active: true }));
    }
  }, [showConfig]);

  return (
    <div>
      {showConfig ? (
        <div id="configMulti" ref={refPanel}>
          <div>
            <h1>Configure the game</h1>
          </div>
          <div id="numberGames">
            <h2>Number of rounds </h2>
            <div>
              <button
                onClick={() => {
                  new Audio(click).play();

                  dataServer.numberGames === 1
                    ? null
                    : dispatch(
                        DATA_SERVER({ numberGames: dataServer.numberGames - 1 })
                      );
                }}
              >
                {" "}
                -{" "}
              </button>
              <h2>{dataServer.numberGames}</h2>
              <button
                onClick={() => {
                  new Audio(click).play();

                  dataServer.numberGames === 10
                    ? null
                    : dispatch(
                        DATA_SERVER({ numberGames: dataServer.numberGames + 1 })
                      );
                }}
              >
                {" "}
                +{" "}
              </button>
            </div>
          </div>
          <div id="timeShadow">
            <h2>Time for each game</h2>
            <div>
              <button
                onClick={() => {
                  new Audio(click).play();

                  dataServer.timeShowShadow === 15
                    ? null
                    : dispatch(
                        DATA_SERVER({
                          timeShowShadow: dataServer.timeShowShadow - 15,
                        })
                      );
                }}
              >
                {" "}
                -{" "}
              </button>
              {dataServer.timeShowShadow > 50 ? (
                handlerTime()
              ) : (
                <h2>{dataServer.timeShowShadow}s</h2>
              )}
              <button
                onClick={() => {
                  new Audio(click).play();

                  dataServer.timeShowShadow === 300
                    ? null
                    : dispatch(
                        DATA_SERVER({
                          timeShowShadow: dataServer.timeShowShadow + 15,
                        })
                      );
                }}
              >
                {" "}
                +{" "}
              </button>
            </div>
          </div>
          <div>
            <div>
              <h2>Select the generations you will play with</h2>
            </div>
            <div>
              <button slot="151" onClick={handleBtnGeneration}>
                {" "}
                1° Generation{" "}
              </button>
              <button slot="100" onClick={handleBtnGeneration}>
                {" "}
                2° Generation{" "}
              </button>
              <button slot="135" onClick={handleBtnGeneration}>
                {" "}
                3° Generation{" "}
              </button>
              <button slot="107" onClick={handleBtnGeneration}>
                {" "}
                4° Generation{" "}
              </button>
              <button slot="156" onClick={handleBtnGeneration}>
                {" "}
                5° Generation{" "}
              </button>
              <button slot="72" onClick={handleBtnGeneration}>
                {" "}
                6° Generation{" "}
              </button>
              <button slot="88" onClick={handleBtnGeneration}>
                {" "}
                7° Generation{" "}
              </button>
              <button slot="89" onClick={handleBtnGeneration}>
                {" "}
                8° Generation{" "}
              </button>
            </div>
            <div>
              <button onClick={handleSend}>START</button>
            </div>
          </div>
        </div>
      ) : showCountdown ? (
        showResults ? (
          <div id="panelResults" ref={refPanel}>
            <div id="results" ref={refResults}>
              <div>
                <button
                  onClick={() =>
                    refResults.current.classList.toggle("is-active")
                  }
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
                        <h2> {dataGame.bestTime} s </h2>
                      </div>
                      <div>
                        {" "}
                        <h2>{dataGame.attempts}</h2>
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
                        <h2> {dataGame.bestTime} s </h2>
                      </div>
                      <div>
                        {" "}
                        <h2>{dataGame.attempts}</h2>
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
                        <h2> {dataGame.bestTime} s </h2>
                      </div>
                      <div>
                        {" "}
                        <h2>{dataGame.attempts}</h2>
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
                        <h2> {dataGame.bestTime} s </h2>
                      </div>
                      <div>
                        {" "}
                        <h2>{dataGame.attempts}</h2>
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
          <div id="infPanel" ref={refPanel}>
            <div>
              <h2>Round {dataServer.round}</h2>
              <img src={pokeball} alt="" />
            </div>
            <div>
              <div>
                <h1>Attempts: {countPokemonsSelect}</h1>
              </div>
              <div>
                {dataAttempts.map((attempts, index) =>
                  dataBestTime[index] < dataServer.timeShowShadow ? (
                    <div className="green">
                      <h1 key={attempts}>Round {index + 1}</h1>
                      <div>
                        <h2> attempts: {attempts} </h2>
                        {dataBestTime[index] < 60 ? (
                          <h2> time: {dataBestTime[index]}s </h2>
                        ) : (
                          <h2>
                            {" "}
                            time: {Math.floor(dataBestTime[index] / 60)}m{" "}
                            {dataBestTime[index] % 60}s{" "}
                          </h2>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="red">
                      <h1 key={attempts}>Round {index + 1}</h1>
                      <div>
                        <h2> attempts: {attempts}</h2>
                        {dataBestTime[index] < 60 ? (
                          <h2> time: {dataBestTime[index]}s </h2>
                        ) : (
                          <h2>
                            {" "}
                            time: {Math.floor(dataBestTime[index] / 60)}m{" "}
                            {dataBestTime[index] % 60}s{" "}
                          </h2>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )
      ) : (
        <div id="infPanel" ref={refPanel}>
          <div>
            <h2>Round {dataServer.round} will start in:</h2>
            <h2>{secondsRemaining}s</h2>
            <img src={pokeball} alt="" />
          </div>
          <div>
            <div>
              <h1>Attempts: {countPokemonsSelect}</h1>
            </div>
            <div>
              {dataAttempts.map((attempts, index) =>
                dataBestTime[index] < dataServer.timeShowShadow ? (
                  <div className="green">
                    <h1 key={attempts}>Round {index + 1}</h1>
                    <div>
                      <h2> attempts: {attempts} </h2>
                      {dataBestTime[index] < 60 ? (
                        <h2> time: {dataBestTime[index]}s </h2>
                      ) : (
                        <h2>
                          {" "}
                          time: {Math.floor(dataBestTime[index] / 60)}m{" "}
                          {dataBestTime[index] % 60}s{" "}
                        </h2>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="red">
                    <h1 key={attempts}>Round {index + 1}</h1>
                    <div>
                      <h2> attempts: {attempts}</h2>
                      {dataBestTime[index] < 60 ? (
                        <h2> time: {dataBestTime[index]}s </h2>
                      ) : (
                        <h2>
                          {" "}
                          time: {Math.floor(dataBestTime[index] / 60)}m{" "}
                          {dataBestTime[index] % 60}s{" "}
                        </h2>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
      {
        isMobileDevice ?
        <div id="divPokemonSingle" ref={refPanelPokeball}>
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
                      className="is-mobile"
                        style={{
                          backgroundColor: "rgba(197, 213, 226, 0.815)",
                          color: "rgb(61, 91, 126)",
                        }}
                        onClick={() => {
                          dispatch(PRACTICE({ active: true, click: true }));
                          dispatch(DELETE_ALL_DATA());
                        }}
                      >
                        RELOAD
                      </button>
                    </div>
                  ) : disableBtn === true ? (
                    <div>
                      {" "}
                      
                      <button
                      className="is-mobile"
                        disabled
                        style={{
                          cursor: "not-allowed",
                          color: "white",
                        }}
                      >
                        Waiting
                      </button>
                    </div>
                  ) : (
                    <div>
                      {" "}
                      <button
                      className="is-mobile"
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
                    className="is-mobile"
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
                  <div id="divCircle" className="is-mobile"></div>
                </div>
              ) : countShowPokemon === 2 ? ( //cuando son dos llaves las obtenidas
                <div id="divInicioPokeball">
                  <div>
                    
                    <button
                      disabled
                      className="is-mobile"
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
                  <div id="divCircle" className="is-mobile"></div>
                </div>
              ) : countShowPokemon === 1 ? ( //cuando es una llave las obtenida
                <div id="divInicioPokeball">
                  <div>
                    
                    <button
                      disabled
                      className="is-mobile"
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
                  <div id="divCircle" className="is-mobile"></div>
                </div>
              ) : (
                <div id="divInicioPokeball">
                  <div>
                    {" "}
                    
                    <button
                      disabled
                      className="is-mobile"
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
                  <div id="divCircle" className="is-mobile"></div>
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
                    style={{
                      backgroundColor: "rgba(197, 213, 226, 0.815)",
                      color: "rgb(61, 91, 126)",
                    }}
                    className="is-mobile"
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
                    className="is-mobile"
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
            <h2 htmlFor="text">Who is this Pokemon?</h2>
          </div>
          <div id="divBuscadorPokemons">
            <div>
              {showCorrect ? (
                <div id="divCorrect">
                  <h2>WIN</h2>
                </div>
              ) : disableBtn ? (
                <div id="divLost">
                  <h2>TIME OVER</h2>
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
                  value={busquedaPokemon}
                  placeholder="Name"
                  onChange={handleBusquedaPokemons}
                  id="buscador"
                  disabled="on"
                />
              )}
            </div>
            <div id="divBtnOpc">
              {namePokemonSelect.map(({ name }, index) =>
                disableBtn ? (
                  <div key={name}></div>
                ) : (
                  <div key={name}>
                    <button
                      slot={name}
                      value={name}
                      translate="no"
                      onClick={selectNamePokemon}
                      className="is-mobile"
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
          {arrPokemons.length > 4 ? (
            <div id="keyArrow">
              <h1>
                {" "}
                <img src={arrowKeyUp} alt="" />{" "}
              </h1>
              <h1>
                {" "}
                <img src={arrowKeyDown} alt="" />{" "}
              </h1>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      :
      <div id="divPokemonSingle" ref={refPanelPokeball}>
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
                        Waiting
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
            <h2 htmlFor="text">Who is this Pokemon?</h2>
          </div>
          <div id="divBuscadorPokemons">
            <div>
              {showCorrect ? (
                <div id="divCorrect">
                  <h2>WIN</h2>
                </div>
              ) : disableBtn ? (
                <div id="divLost">
                  <h2>TIME OVER</h2>
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
                  value={busquedaPokemon}
                  placeholder="Name"
                  onChange={handleBusquedaPokemons}
                  id="buscador"
                  disabled="on"
                />
              )}
            </div>
            <div id="divBtnOpc">
              {namePokemonSelect.map(({ name }, index) =>
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
          {arrPokemons.length > 4 ? (
            <div id="keyArrow">
              <h1>
                {" "}
                <img src={arrowKeyUp} alt="" />{" "}
              </h1>
              <h1>
                {" "}
                <img src={arrowKeyDown} alt="" />{" "}
              </h1>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>}
    </div>
  );
};

export default ConfigMulti;
