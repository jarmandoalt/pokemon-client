import socket from "../socket/socket";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, createRef } from "react";
import {
  COUNTDOWN,
  DELETE_DATA_SERVER,
  SHOW_CONFIG,
  DELETE_ALL_DATA,
  HIDEPANEL
} from "../reducers/crudReducer";
import { deleteServer, updateCountMembers } from "../services/routes";
import click from "../assets/click.mp3";
import { useNavigate } from "react-router-dom";

const ShowMenu = () => {
  const navigate = useNavigate(),
    dbPokemon1 = useSelector((state) => state.dbPokemon1),
    dbPokemonSelect = useSelector((state) => state.dbPokemonSelect),
    dataServer = useSelector((state) => state.dataServer),
    showConfig = useSelector((state) => state.showConfig),
    noCorrect = useSelector((state) => state.noCorrect),
    countdown = useSelector((state) => state.countdown),
    showMenu = useSelector((state) => state.showMenu),
    [menuMember, setMenuMember] = useState(true),
    dispatch = useDispatch(),
    refDivMenu = createRef();

  const exitServer = async (e) => {
    await deleteServer(dataServer.nameServer);
    dispatch(DELETE_DATA_SERVER());
    dispatch(DELETE_ALL_DATA())
    dispatch(SHOW_CONFIG("return"));
    dispatch(HIDEPANEL(false))
    socket.emit("returnGame", {
      showConfig: true,
      countdown: false,
    });
    await socket.emit("deleteAdmin", {
      nameServer: "exit",
    });
    setTimeout(() => {
      navigate("/home");
      dispatch(SHOW_CONFIG("return"));
      dispatch(COUNTDOWN(false))
    }, 2000);
  };

  const exitServerForAdmin = async (deleteMember) => {
    //exit member
    dispatch(HIDEPANEL(false))
    let arrayNamesAux = dataServer.namesMembers
    arrayNamesAux = arrayNamesAux.filter(function(item) {
      return item !== dataServer.name
  });
    //////////////////////////////////////// Falta mandar esta cadena a los demas compañeros
    await updateCountMembers(
      deleteMember.idServer,
      deleteMember.countMembers - 1,
      arrayNamesAux
    );
    await socket.emit("exitMember", {
      nameMember: deleteMember.name,
      nameServer: deleteMember.nameServer,
      nameMember1: deleteMember.nameMember1,
      scoreMember1: deleteMember.scoreMember1,
      nameMember2: deleteMember.nameMember2,
      scoreMember2: deleteMember.scoreMember2,
      nameMember3: deleteMember.nameMember3,
      scoreMember3: deleteMember.scoreMember3,
      countMembers: deleteMember.countMembers - 1,
      myNumber: deleteMember.numMember,
      namesMembers: arrayNamesAux
    });
    navigate("/home"); //Return menu
    setTimeout(() => {
      dispatch(DELETE_DATA_SERVER()); //delete data server
    }, 500);
  };

  const exitServerAdmin = async (e) => {
    //exit member
    dispatch(DELETE_DATA_SERVER()); //delete data server
    navigate("/home"); //Return menu
  };

  useEffect(() => {
    //Admin conection
    socket.on("deleteMember", (deleteMember) => {
      if (dataServer.name === deleteMember.numberMember) {
        exitServerForAdmin(deleteMember);
      }
    });

    socket.on("deleteAdmin", (deleteAdmin) => {
      if (dataServer.id != dataServer.idServer) {
        exitServerAdmin();
      }
    });
  }, [socket]);

  useEffect(() => {
    showMenu === true
      ? dataServer.id == dataServer.adminId
        ? (refDivMenu.current.classList.add("is-admin"), setMenuMember(true)) //menu mas arriba
        : (refDivMenu.current.classList.add("is-member"), setMenuMember(true)) //menu mas abajo
      : (refDivMenu.current.classList.remove("is-admin"), //cerrar menu
        refDivMenu.current.classList.remove("is-member"));
  }, [showMenu]);

  const restartGame = () => {
    dispatch(SHOW_CONFIG("return"));
    dispatch(COUNTDOWN(false));
    if (showConfig === false) {
      socket.emit("returnGame", {
        showConfig: true,
        countdown: false,
      });
    }
  };

  const deleteMembers = (e) => {
    new Audio(click).play();

    if (dataServer.id == dataServer.adminId) {
      socket.emit("deleteMember", {
        nameServer: dataServer.nameServer,
        numberMember: e.target.slot,
        idServer: dataServer.idServer,
        numMember: Number(e.target.value),
        nameMember1: dataServer.nameMember1,
        scoreMember1: dataServer.scoreMember1,
        nameMember2: dataServer.nameMember2,
        scoreMember2: dataServer.scoreMember2,
        nameMember3: dataServer.nameMember3,
        scoreMember3: dataServer.scoreMember3,
        countMembers: dataServer.countMembers,
      });
    } else {
      exitServerForAdmin({
        nameServer: dataServer.nameServer,
        numberMember: e.target.slot,
        idServer: dataServer.idServer,
        numMember: Number(e.target.value),
        nameMember1: dataServer.nameMember1,
        scoreMember1: dataServer.scoreMember1,
        nameMember2: dataServer.nameMember2,
        scoreMember2: dataServer.scoreMember2,
        nameMember3: dataServer.nameMember3,
        scoreMember3: dataServer.scoreMember3,
        countMembers: dataServer.countMembers,
        namesMembers: dataServer.namesMemebers
      });
    }
  };

  return (
    <div>
      <div id="divMenu" ref={refDivMenu}>
        {dataServer.id == dataServer.adminId ? (
          menuMember === true ? (
            <div>
              <div>
                <button
                  onClick={() => {
                    setMenuMember(false);
    new Audio(click).play();

                  }}
                >
                  Members
                </button>
              </div>
              <div>
                <button onClick={restartGame}> Back to settings </button>
              </div>
              <div>
                <button slot={dataServer.id} onClick={exitServer}>
                  Exit Server
                </button>
              </div>
            </div>
          ) : (
            <div id="divMenuMembers">
              {dataServer.countMembers === 1 ? (
                <div>
                  <div>
                    <h1>Members</h1>
                  </div>
                  <div>
                    <div>
                      <h1>{dataServer.nameAdmin}</h1>
                    </div>
                  </div>
                </div>
              ) : dataServer.countMembers === 2 ? (
                <div>
                  <div>
                    <h1>Members</h1>
                  </div>
                  <div>
                    <div>
                      <h1>{dataServer.nameAdmin}</h1>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h1>{dataServer.nameMember1}</h1>
                    </div>
                    <div>
                      <button
                        slot={dataServer.nameMember1}
                        value={2}
                        onClick={deleteMembers}
                      >
                        X
                      </button>
                    </div>
                  </div>
                </div>
              ) : dataServer.countMembers === 3 ? (
                <div>
                  <div>
                    <h1>Members</h1>
                  </div>
                  <div>
                    <div>
                      <h1>{dataServer.nameAdmin}</h1>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h1>{dataServer.nameMember1}</h1>
                    </div>
                    <div>
                      <button
                        slot={dataServer.nameMember1}
                        value={2}
                        onClick={deleteMembers}
                      >
                        X
                      </button>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h1>{dataServer.nameMember2}</h1>
                    </div>
                    <div>
                      <button
                        slot={dataServer.nameMember2}
                        value={3}
                        onClick={deleteMembers}
                      >
                        X
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div>
                    <h1>Members</h1>
                  </div>
                  <div>
                    <div>
                      <h1>{dataServer.nameAdmin}</h1>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h1>{dataServer.nameMember1}</h1>
                    </div>
                    <div>
                      <button
                        slot={dataServer.nameMember1}
                        value={2}
                        onClick={deleteMembers}
                      >
                        X
                      </button>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h1>{dataServer.nameMember2}</h1>
                    </div>
                    <div>
                      <button
                        slot={dataServer.nameMember2}
                        value={3}
                        onClick={deleteMembers}
                      >
                        X
                      </button>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h1>{dataServer.nameMember3}</h1>
                    </div>
                    <div>
                      <button
                        slot={dataServer.nameMember3}
                        value={4}
                        onClick={deleteMembers}
                      >
                        X
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          <div>
            <div>
              <button
                slot={dataServer.name}
                value={dataServer.myNumber}
                onClick={deleteMembers}
              >
                Leave the room
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowMenu;
