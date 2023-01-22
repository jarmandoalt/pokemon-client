import socket from "../socket/socket";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  DATA_SERVER,
  SHOW_MENU,
  HIDEPANEL,
  GAME_STARTED,
  TIME
} from "../reducers/crudReducer";
import HeaderMulti from "../compMulti/HeaderMulti";
import ConfigMulti from "../compMulti/ConfigMulti";
import WaitMember from "../compMulti/WaitMember";
import ShowMenu from "../compMulti/ShowMenu";
import click from "../assets/click.mp3";
import moment from "moment";
import { getServerName } from "../services/routes";

const Room = () => {
  const [nameServer, setNameServer] = useState(""),
    countdown = useSelector((state) => state.countdown),
    practice = useSelector((state) => state.practice),
    gameStarted = useSelector((state) => state.gameStarted),
    dataServer = useSelector((state) => state.dataServer),
    hidePanelConfig = useSelector((state) => state.hidePanelConfig),
    showMenu = useSelector((state) => state.showMenu),
    dispatch = useDispatch();

  //history.forward()//no retroceder

  //Listen Socket
  useEffect(() => {
    //Admin conection
    socket.on("create", (create) => {
      dispatch(DATA_SERVER({ idServer: create.create.idServer }));
      setNameServer(create.create.nameServer);
      adminConnection(create.create.tagName, create.create.nomMember);
    });

    //Join member
    socket.on("join", (join) => {
      dispatch(DATA_SERVER({ idServer: join.join.idServer }));
      memberConnection(
        join.join.tagName,
        join.join.nomMember,
        join.join.namesMembers
      );
    });

    //Desconnection member
    socket.on("exitMember", (exitMember) => {
      updateLastExitMember(exitMember);
    });

    //Update data members
    socket.on("updateData", (updateData) => {
      if (!nameServer) {
        setNameServer(updateData.nameServer);
      }
      if (updateData.nameServer === "") {
      } else {
        updateDataServer(updateData);
      }
    });
  }, [socket]);

  /*Escuchando cuando se actualiza el numero de miembros en Admin */
  useEffect(() => {
    updateDataServerSocket(dataServer);
  }, [dataServer.countMembers]);

  /*Actualizando datos internos de Admin despues de que sale un miembro */
  const updateLastExitMember = (dataExit) => {
    if (dataServer.id === dataServer.adminId) {
      switch (dataExit.myNumber) {
        case 2:
          dispatch(
            DATA_SERVER({
              nameMember1: dataExit.nameMember2,
              scoreMember1: dataExit.scoreMember2,
              nameMember2: dataExit.nameMember3,
              scoreMember2: dataExit.scoreMember3,
              nameMember3: "",
              scoreMember3: 0,
              countMembers: dataExit.countMembers,
              namesMembers: dataExit.namesMembers,
            })
          );
          break;
        case 3:
          dispatch(
            DATA_SERVER({
              nameMember2: dataExit.nameMember3,
              scoreMember2: dataExit.scoreMember3,
              nameMember3: "",
              scoreMember3: 0,
              countMembers: dataExit.countMembers,
              namesMembers: dataExit.namesMembers,
            })
          );
          break;

        case 4:
          dispatch(
            DATA_SERVER({
              nameMember3: "",
              scoreMember3: 0,
              countMembers: dataExit.countMembers,
              namesMembers: dataExit.namesMembers,
            })
          );
          break;

        default:
          break;
      }
    }
  };

  /* Actualizando los datos internos de los miembros */
  const updateDataServer = (dataServerAdmin) => {
    if (dataServer.id === dataServer.adminId) {
    } else {
      let auxmyNumber = 0;
      if (dataServerAdmin.nameMember1 == dataServer.name) {
        auxmyNumber = 2;
      } else {
        if (dataServerAdmin.nameMember2 == dataServer.name) {
          auxmyNumber = 3;
        } else {
          if (dataServerAdmin.nameMember3 == dataServer.name) {
            auxmyNumber = 4;
          }
        }
      }
      if (
        dataServerAdmin.round > 0 &&
        auxmyNumber === dataServerAdmin.countMembers
      ) {
        dispatch(GAME_STARTED(true));
      }
      dispatch(
        DATA_SERVER({
          nameServer: dataServerAdmin.nameServer,
          nameAdmin: dataServerAdmin.nameAdmin,
          scoreAdmin: dataServerAdmin.scoreAdmin,
          nameMember1: dataServerAdmin.nameMember1,
          scoreMember1: dataServerAdmin.scoreMember1,
          nameMember2: dataServerAdmin.nameMember2,
          scoreMember2: dataServerAdmin.scoreMember2,
          nameMember3: dataServerAdmin.nameMember3,
          scoreMember3: dataServerAdmin.scoreMember3,
          countMembers: dataServerAdmin.countMembers,
          round: dataServerAdmin.round,
          hitCounter: dataServerAdmin.hitCounter,
          idServer: dataServerAdmin.idServer,
          namesMembers: dataServerAdmin.namesMembers,
          myNumber: auxmyNumber,
        })
      );
    }
  };

  /*Emision de socket para actualizar datos de los Miembros desde Admin */
  const updateDataServerSocket = (dataServer) => {
    if (dataServer.id === dataServer.adminId) {
      socket.emit("updateData", {
        nameServer: dataServer.nameServer,
        nameAdmin: dataServer.nameAdmin,
        scoreAdmin: dataServer.scoreAdmin,
        nameMember1: dataServer.nameMember1,
        scoreMember1: dataServer.scoreMember1,
        nameMember2: dataServer.nameMember2,
        scoreMember2: dataServer.scoreMember2,
        nameMember3: dataServer.nameMember3,
        scoreMember3: dataServer.scoreMember3,
        namesMembers: dataServer.namesMembers,
        round: dataServer.round,
        hitCounter: dataServer.hitCounter,
        countMembers: dataServer.countMembers,
        idServer: dataServer.idServer,
      });
    }
  };

  /* Escuchando cuando se une el Admin */
  const adminConnection = (tagName) => {
    dispatch(DATA_SERVER({ nameAdmin: tagName }));
    dispatch(HIDEPANEL(false));
  };

  /* Escuchando cuando se une un Miembro y actualizando los datos de Admin */
  const memberConnection = (tagName, nomMember, namesMembers) => {
    if (dataServer.round === 0) {
      switch (nomMember) {
        case 1:
          dispatch(
            DATA_SERVER({
              nameMember1: tagName,
              countMembers: 2,
              namesMembers: namesMembers,
            })
          );
          break;
        case 2:
          dispatch(
            DATA_SERVER({
              nameMember2: tagName,
              countMembers: 3,
              namesMembers: namesMembers,
            })
          );
          break;
        case 3:
          dispatch(
            DATA_SERVER({
              nameMember3: tagName,
              countMembers: 4,
              namesMembers: namesMembers,
            })
          );
          break;
        default:
          break;
      }
    }
  };

  return (
    <div id="room">
      <HeaderMulti></HeaderMulti>
      {dataServer.id === dataServer.adminId ? (
        <div id="panelPrincipal">
          <ConfigMulti />
          <ShowMenu />
        </div>
      ) : (
        <div id="panelPrincipal">
          {gameStarted ? <h1>aun no</h1> : <WaitMember />}
          <ShowMenu />
        </div>
      )}

      <div id="divBtnExit">
        <button
          name={dataServer.name}
          value={dataServer.id}
          onClick={() => {
            new Audio(click).play();
            showMenu ? dispatch(SHOW_MENU(false)) : dispatch(SHOW_MENU(true));
          }}
        >
          {" "}
          MENU
          {/* <img src={config} alt="" />{" "} */}
        </button>
        {hidePanelConfig ? (
          <button onClick={() => dispatch(HIDEPANEL(false))}>SHOW</button>
        ) : (
          <button onClick={() => dispatch(HIDEPANEL(true))}>HIDE</button>
        )}
      </div>
    </div>
  );
};

export default Room;
