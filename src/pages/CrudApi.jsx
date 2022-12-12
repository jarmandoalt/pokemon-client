import { useEffect, useState, useRef } from "react";
import socket from "../socket/socket";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  READ_ALL_DATA_1,
  READ_ALL_DATA_2,
  DELETE_ALL_DATA,
  DELETE_POKEMON,
  DATA_SERVER,
  DELETE_DATA_SERVER,
  DELETE_LIST_POKEMON,
  SHOW_CONFIG,
} from "../reducers/crudReducer.jsx";
import pokeball from "../assets/pokeball.png";
import arrowKeyDown from "../assets/chevron-down.svg";
import arrowKeyUp from "../assets/chevron-up.svg";
import arrowUp from "../assets/arrow-up.svg";
import keyArcert from "../assets/acert.mp3";
import showShadow from "../assets/showShadow.mp3";
import click from "../assets/click.mp3";
import slide from "../assets/slide.mp3";
import invalid from "../assets/invalid.mp3";
import waitPokeball from "../assets/waitPokeball.mp3";
import btnIncorrect from "../assets/btnIncorrect.mp3";
import keyArcertAll from "../assets/acertAll.mp3";
import pokeapi from "../assets/pokeapi.png";
import llave from "../assets/llave.png";
import arrowDown from "../assets/arrow-down.svg";
import serversArk from "../assets/accessArkeanos";
import {
  getPokemonList,
  getPokemon,
  getPokemonSelect,
} from "../services/routesPokemon";
import {
  saveServer,
  getServerName,
  updateCountMembers,
  deleteServer,
  updateNameServer,
} from "../services/routes";

const CrudApi = () => {
  const dbPokemon1 = useSelector((state) => state.dbPokemon1),
    dbPokemonSelect = useSelector((state) => state.dbPokemonSelect),
    dataServer = useSelector((state) => state.dataServer),
    dispatch = useDispatch(),
    [pokeballReady, setPokeballReady] = useLocalStorage("pokeballReady", false),
    [auxInput, setAuxInput] = useLocalStorage("auxInput", ""),
    [showImg, setShowImg] = useLocalStorage("showImg", false),
    [arrGeneration, setArrGeneration] = useLocalStorage("arrGeneration", [151]),
    [hidePanel, setHidePanel] = useLocalStorage("hidePanel", false),
    [showCorrect, setShowCorrect] = useLocalStorage("showCorrect", false),
    [notFound, setNotFound] = useLocalStorage("notFound", false),
    [keyGlobal, setKeyGlobal] = useLocalStorage("keyGlobal", 0),
    [namePlayerNone, setNamePlayerNone] = useLocalStorage(
      "namePlayerNone",
      false
    ),
    [messageNotFound, setMessageNotFound] = useLocalStorage(
      "messageNotFound",
      "hola"
    ),
    [counter, setCounter] = useLocalStorage("counter", 0),
    [countShowPokemon, setCountShowPokemon] = useLocalStorage(
      "countShowPokemon",
      0
    ),
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
    [createOrUnit, setCreateOrUnit] = useLocalStorage("createOrUnit", false),
    [disableBtn, setDisableBtn] = useLocalStorage("disableBtn", false),
    [modeGame, setModeGame] = useLocalStorage("modeGame", false),
    refImgSelect = useRef(),
    refPanel = useRef(),
    navigate = useNavigate(),
    refPanelPokeball = useRef(),
    refCreate = useRef(),
    refJoin = useRef(),
    refInputPokemon = useRef(),
    refBtnMenu = useRef(),
    refSingleGame = useRef(),
    refListPokemon = useRef(),
    refMultiGame = useRef();

  let details = navigator.userAgent;

  /* Creating a regular expression 
        containing some mobile devices keywords 
        to search it in details string*/
  let regexp = /android|iphone|kindle|ipad/i;

  /* Using test() method to search regexp in details
        it returns boolean value*/
  let isMobileDevice = regexp.test(details);

  /////////////////////////////////////////////////////// UseEffect para acomodar los menus al salir de un servidor
  const returnAdmin = async () => {
    await deleteServer(dataServer.nameServer);
    socket.emit("returnGame", {
      showConfig: true,
      countdown: false,
    });
    await dispatch(SHOW_CONFIG("return"));
    await socket.emit("deleteAdmin", {
      nameServer: "exit",
    });
    dispatch(DELETE_DATA_SERVER());
  };

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

  const returnMember = async () => {
    let arrayNamesAux = dataServer.namesMembers;
    arrayNamesAux = arrayNamesAux.filter(function (item) {
      return item !== dataServer.name;
    });
    await updateCountMembers(
      dataServer.idServer,
      dataServer.countMembers - 1,
      arrayNamesAux
    );
    await socket.emit("exitMember", {
      nameMember: dataServer.name,
      nameServer: dataServer.nameServer,
      nameMember1: dataServer.nameMember1,
      scoreMember1: dataServer.scoreMember1,
      nameMember2: dataServer.nameMember2,
      scoreMember2: dataServer.scoreMember2,
      nameMember3: dataServer.nameMember3,
      scoreMember3: dataServer.scoreMember3,
      countMembers: dataServer.countMembers - 1,
      myNumber: dataServer.myNumber,
      namesMembers: arrayNamesAux,
    });
    dispatch(DELETE_DATA_SERVER());
  };

  useEffect(() => {
    if (dbPokemon1.length === 0) {
      setPokeballReady(false);
      setBusquedaPokemon("");
      setArrPokemonsUse("");
    }

    setTimeout(() => {
      if (dataServer.myNumber > 0) {
        if (dataServer.myNumber === 1) {
          returnAdmin();
        } else {
          returnMember();
        }
      }
    }, 1500);
  }, []);

  /* Controlador teclado 
  useEffect(() => {
    if (showImg === true && disableBtn === true && keyGlobal === 27) {
      handleSend();
      setAuxInput("");
      setBusquedaPokemon("");
      filterPokemon("");
      setTimeout(() => {
        moveCursorToEnd();
      }, 2000);
      setKeyGlobal(0);
    }
    if (pokeballReady === false && disableBtn === false && keyGlobal === 27) {
      setAuxInput("");
      setBusquedaPokemon("");
      filterPokemon("");
      handleSend();
      moveCursorToEnd();
      setKeyGlobal(0);
    }
  }, [keyGlobal]);

  document.addEventListener("keyup", (e) => {
    if (e.keyCode === 27) {
      console.log("key");
      setKeyGlobal(e.keyCode);
    }
    //console.log(e);
    /* if (showImg === true && disableBtn === true && e.keyCode === 17) {
      console.log("fres");
      handleSend();
      setAuxInput("");
      setBusquedaPokemon("");
      filterPokemon("");
      moveCursorToEnd();
    }
    if (pokeballReady === false && disableBtn === false && e.keyCode === 17) {
      console.log("aqui");
      setAuxInput("");
      setBusquedaPokemon("");
      filterPokemon("");
      handleSend();
      moveCursorToEnd();
    }
    if (modeGame === false) {
      console.log(modeGame);
      if (
        e.keyCode >= 65 && e.keyCode <= 90
      ) {
        moveCursorToEnd();
      }
    }
  if (
      e.keyCode === 13
    ) {
      if (showImg === true) {
        handleSend();
      } else {
        setShowImg(true)
      }
    } 
  }); */

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

  const pokemonSelect = async (name) => {
    const response = await getPokemonSelect(name);
    if (response.status === 200) {
      setCounter(counter + 1);
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
        //Guardar pokemon si tiene dos tipos

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
        //Guardar pokemon si tiene un  tipo

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

  const controlInput = (e) => {
    //control teclado
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

  const handleBtnGeneration = (e) => {
    new Audio(click).play();
    //btn de menu
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

  const handleSend = (aux) => {
    restoredPokeball();

    for (let index = 0; index < arrGeneration.length; index++) {
      loadPokemon1(arrGeneration[index]);
    }
    let auxNumArra = Math.floor(Math.random() * (arrGeneration.length - 1 + 1));
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
    }
    setHidePanel(true);
    setDisableBtn(false);
    setTimeout(() => {
      moveCursorToEnd();
    }, 2000);
  };

  const handleReload = () => {
    handleSend();
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
        handleSubmit();
      }
      if (countShowPokemon === 3) {
        setShowImg(true);
        new Audio(showShadow).play();
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

  const handleBusquedaPokemons = (e) => {
    /* setBusquedaPokemon(e.target.value);
      filterPokemon(e.target.value); */
  };

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

  const selectNamePokemon = async (e) => {
    e.preventDefault();
    if (e.target.value === dbPokemonSelect.name) {
      if (showImg === true) {
        setShowCorrect(true);
        setDisableBtn(true);
      } else {
        setShowImg(true);
        setShowCorrect(true);
        setDisableBtn(true);
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
    setKeyGlobal(0);
    setTimeout(() => {
      refListPokemon.current.scrollTop =
        refListPokemon.current.scrollTop - 1800;
    }, 300);
  };

  const selectNamePokemonKey = async (key) => {
    if (key === dbPokemonSelect.name) {
      if (showImg === true) {
        setShowCorrect(true);
        setDisableBtn(true);
      } else {
        setShowImg(true);
        setShowCorrect(true);
        setDisableBtn(true);
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
    setKeyGlobal(0);
    setTimeout(() => {
      refListPokemon.current.scrollTop =
        refListPokemon.current.scrollTop - 1800;
    }, 300);
  };

  /* useEffect(() => {
    console.log("holass");
    setTimeout(() => {
      refListPokemon.current.scrollTop -= 199000;
    }, 200);
  }, [namePokemonSelect]) */

  const handleSubmit = () => {
    setShowImg(true);
    pokemonSelect(dbPokemonSelect.name);
    setDisableBtn(true);
  };

  useEffect(() => {
    //mostrar pokemon cuando se adivino
    if (showCorrect === true) {
      if (refImgSelect.current) {
        refImgSelect.current.classList.add("is-correct");
      }
    }
  }, [refImgSelect]);

  const handlerServer = (e) => {
    e.preventDefault();
    dispatch(DATA_SERVER({ [e.target.name]: e.target.value }));
  };

  const joinServer = async (name) => {
    let buscadorArk = serversArk.includes(dataServer.nameServer);
    if (buscadorArk === true) {
      const response = await getServerName(name);
      if (response.status === 200) {
        if (response.data.server.length == 0) {
          setMessageNotFound("Room not found");
          setNotFound(true);
          new Audio(invalid).play();
          setTimeout(() => {
            setNotFound(false);
          }, 2000);
        } else {
          if (response.data.server[0].countMembers == 4) {
            setMessageNotFound("full room");
            setNotFound(true);
            new Audio(invalid).play();

            setTimeout(() => {
              setNotFound(false);
            }, 2000);
          } else {
            let auxArrayRepeat = false;
            for (
              let index = 0;
              index < response.data.server[0].namesMembers.length;
              index++
            ) {
              if (
                response.data.server[0].namesMembers[index] === dataServer.name
              ) {
                auxArrayRepeat = true;
              }
            }
            if (auxArrayRepeat === true) {
              setMessageNotFound("Name in use");
              setNotFound(true);
              new Audio(invalid).play();

              setTimeout(() => {
                setNotFound(false);
              }, 2000);
            } else {
              let arrayNames = response.data.server[0].namesMembers;
              arrayNames[response.data.server[0].namesMembers.length] =
                dataServer.name;
              dispatch(
                DATA_SERVER({ id: socket.id, namesMembers: arrayNames })
              );
              setTimeout(() => {
                updateCountMembers(
                  response.data.server[0]._id,
                  response.data.server[0].countMembers + 1,
                  arrayNames
                );
                socket.emit("join", {
                  nameServer: dataServer.nameServer,
                  tagName: dataServer.name,
                  namesMembers: arrayNames,
                  rol: "member",
                  nomMember: response.data.server[0].countMembers,
                  idServer: response.data.server[0]._id,
                });
                navigate("/home/room");
              }, 1000);
            }
          }
        }
      }
    } else {
      setMessageNotFound("Room not available");
      setNotFound(true);
      new Audio(invalid).play();

      setTimeout(() => {
        setNotFound(false);
      }, 2000);
    }
  };

  const restoredPokeball = () => {
    dispatch(DELETE_ALL_DATA());
    dispatch(DELETE_LIST_POKEMON());
    setAuxInput("");
    setBusquedaPokemon("");
    filterPokemon("");
    setBusquedaPokemon("");
    setNamePokemonSelect([]);
    setArrPokemons([]);
    setDisableBtn(false);
    setPokeballReady(false);
    setCountShowPokemon(0);
    setShowCorrect(false);
    setShowImg(false);
  };

  const sendServer = async (e) => {
    e.preventDefault();
    new Audio(click).play();
    restoredPokeball();
    //Create server
    if (dataServer.name === "") {
      setMessageNotFound("Required field");
      setNamePlayerNone(true);
      new Audio(invalid).play();
      setTimeout(() => {
        setNamePlayerNone(false);
      }, 2000);
    } else {
      if (e.target.slot === "1") {
        dispatch(
          DATA_SERVER({ adminId: socket.id, id: socket.id, myNumber: 1 })
        );
        let buscadorArk = serversArk.includes(dataServer.nameServer);
        if (buscadorArk === true) {
          const response = await getServerName(dataServer.nameServer);
          if (response.status === 200) {
            if (response.data.server.length == 0) {
              await saveServer({
                dataServer,
                member: 1,
                namesMembers: dataServer.name,
              });
              navigate("/home/room");
              socket.emit("create", {
                nameServer: dataServer.nameServer,
                tagName: dataServer.name,
                rol: "admin",
              });
            } else {
              setMessageNotFound("Room used");
              setNotFound(true);
              new Audio(invalid).play();

              setTimeout(() => {
                setNotFound(false);
              }, 2000);
            }
          }
        } else {
          setMessageNotFound("Room not available");
          setNotFound(true);
          new Audio(invalid).play();
          setTimeout(() => {
            setNotFound(false);
          }, 2000);
        }
      } else {
        await joinServer(dataServer.nameServer); //join
      }
    }
  };

  return (
    <div id="divPage">
      {isMobileDevice ? 
      <div id="divPokemonSingle" ref={refPanelPokeball}>
      <div id="divImgPokemons">
        {pokeballReady ? (
          <div>
            {showImg ? (
              <div
                id="divImgPokemonShow"
                style={{ display: "flex", flexDirection: "column" }}
              >
                {disableBtn ? (
                  <div>
                    <button
                      style={{
                        color: "rgb(61, 91, 126)",
                        backgroundColor: "rgb(197, 213, 226)",
                      }}
                      onClick={handleReload}
                    >
                      RELOAD
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      style={{
                        color: "white",
                        cursor: "pointer",
                        backgroundColor: "rgb(203, 192, 206)",
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
                    alt="pokemon65"
                  />
                ) : (
                  <img
                    id="imgPokemon"
                    style={{ filter: "brightness(0%)" }}
                    src={dbPokemonSelect.sprites.front_default}
                    alt="pokemon65"
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
                      color: "white",
                      cursor: "not-allowed",
                      backgroundColor: "rgb(203, 192, 206)",
                    }}
                  >
                    Show Shadow
                    <br />
                    <img className="is-active key" src={llave} alt="key1" />
                    <img
                      className="key"
                      style={{
                        filter: "brightness(50%)",
                      }}
                      src={llave}
                      alt="key"
                    />
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
          <div id="divInicioPokeball">
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
            <img src={pokeball} alt="" />
          </div>
        )}
      </div>
      <div id="divBuscadorPokemon">
        <div id="whoIsThis">
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
                <h2>LOST</h2>
              </div>
            ) : (
              <input
                type="text"
                name="busqueda"
                placeholder="Name"
                ref={refInputPokemon}
                value={busquedaPokemon}
                id="buscador"
                onKeyUp={keyUp}
                onChange={handleBusquedaPokemons}
                autoComplete="off"
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
                    translate="no"
                    value={name}
                    slot={name}
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
    </div> : <div id="divPokemonSingle" ref={refPanelPokeball}>
        <div id="divImgPokemons">
          {pokeballReady ? (
            <div>
              {showImg ? (
                <div
                  id="divImgPokemonShow"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  {disableBtn ? (
                    <div>
                      <button onClick={handleReload}>Ctrl</button>
                      <button
                        style={{
                          color: "rgb(61, 91, 126)",
                          backgroundColor: "rgb(197, 213, 226)",
                        }}
                        onClick={handleReload}
                      >
                        RELOAD
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button onClick={handleSubmit}>Ctrl</button>
                      <button
                        style={{
                          color: "white",
                          cursor: "pointer",
                          backgroundColor: "rgb(203, 192, 206)",
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
                      alt="pokemon65"
                    />
                  ) : (
                    <img
                      id="imgPokemon"
                      style={{ filter: "brightness(0%)" }}
                      src={dbPokemonSelect.sprites.front_default}
                      alt="pokemon65"
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
                      <img
                        className="key"
                        style={{
                          filter: "brightness(50%)",
                        }}
                        src={llave}
                        alt="key"
                      />
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
              <img src={pokeball} alt="" />
            </div>
          )}
        </div>
        <div id="divBuscadorPokemon">
          <div id="whoIsThis">
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
                  <h2>LOST</h2>
                </div>
              ) : (
                <input
                  type="text"
                  name="busqueda"
                  placeholder="Name"
                  ref={refInputPokemon}
                  value={busquedaPokemon}
                  id="buscador"
                  onKeyUp={keyUp}
                  onChange={handleBusquedaPokemons}
                  autoComplete="off"
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
                      translate="no"
                      value={name}
                      slot={name}
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
      </div>  
    }
      <div id="divBtnHide">
        <div>
          {hidePanel ? (
            <button
              onClick={() => {
                setHidePanel(false);
                refBtnMenu.current.classList.toggle("is-active");
                refPanelPokeball.current.classList.remove("is-hidePanel");
                setTimeout(() => {
                  refPanel.current.classList.remove("is-hidePanel");
                }, 200);
              }}
              ref={refBtnMenu}
              type="button"
            >
              SHOW
            </button>
          ) : (
            <button
              onClick={() => {
                setHidePanel(true);
                refBtnMenu.current.classList.toggle("is-active");
                refPanel.current.classList.add("is-hidePanel");
                setTimeout(() => {
                  refPanelPokeball.current.classList.add("is-hidePanel");
                }, 500);
              }}
              ref={refBtnMenu}
              type="button"
            >
              HIDE
            </button>
          )}
          <button onClick={handleReload}> RELOAD </button>
        </div>
        <div>
          <div>
            <h3>Powered by</h3>
            <img src={pokeapi} alt="" />
          </div>
          <h3>© AAM</h3>
        </div>
      </div>
      <div ref={refPanel}>
        <div>
          <button
            className="is-active"
            ref={refSingleGame}
            onClick={() => {
              setModeGame(false);
              refSingleGame.current.classList.add("is-active");
              refMultiGame.current.classList.remove("is-active");
              new Audio(click).play();
            }}
          >
            Single Player
          </button>
          <button
            ref={refMultiGame}
            onClick={() => {
              setModeGame(true);
              refSingleGame.current.classList.remove("is-active");
              refMultiGame.current.classList.add("is-active");
              new Audio(click).play();
            }}
          >
            Multiplayers
          </button>
        </div>
        <div>
          {modeGame ? (
            <div>
              <form id="multi">
                {namePlayerNone ? (
                  <div>
                    <h3> {messageNotFound} </h3>
                  </div>
                ) : (
                  <div>
                    <input
                      required
                      type="text"
                      placeholder="Player"
                      name="name"
                      onChange={handlerServer}
                      value={dataServer.nameCreator}
                    />
                  </div>
                )}
                <div>
                  <button
                    style={{ borderRadius: "5px 0 0 5px" }}
                    ref={refCreate}
                    className="is-active"
                    onClick={(e) => {
                      e.preventDefault();
                      setCreateOrUnit(false);
                      refCreate.current.classList.add("is-active");
                      refJoin.current.classList.remove("is-active");
                      new Audio(click).play();
                    }}
                  >
                    Create Room{" "}
                  </button>
                  <button
                    style={{ borderRadius: "0 5px 5px 0" }}
                    ref={refJoin}
                    onClick={(e) => {
                      e.preventDefault();
                      setCreateOrUnit(true);
                      refJoin.current.classList.add("is-active");
                      refCreate.current.classList.remove("is-active");
                      new Audio(click).play();
                    }}
                  >
                    Join Room
                  </button>
                </div>
                {createOrUnit ? (
                  notFound ? (
                    <div>
                      <h2> {messageNotFound} </h2>
                    </div>
                  ) : (
                    <div>
                      <input
                        required
                        type="text"
                        name="nameServer"
                        onChange={handlerServer}
                        value={dataServer.nameServer}
                        placeholder="Key Server"
                      />
                      <button onClick={sendServer}>Join</button>
                    </div>
                  )
                ) : notFound ? (
                  <div>
                    <h2> {messageNotFound} </h2>
                  </div>
                ) : (
                  <div>
                    <input
                      required
                      type="text"
                      name="nameServer"
                      onChange={handlerServer}
                      value={dataServer.nameServer}
                      placeholder="Key Server"
                    />
                    <button slot="1" onClick={sendServer}>
                      Create
                    </button>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div>
              <div>
                <h3>Select the generations you will play with</h3>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CrudApi;
