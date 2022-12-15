import { useEffect, useState, createRef, useRef, useInterval } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  NOCORRECT,
  DATA_GAME,
  DATA_ROUND_TIME,
} from "../reducers/crudReducer.jsx";

const HeaderMulti = () => {
  const dbPokemon1 = useSelector((state) => state.dbPokemon1),
    dbPokemonSelect = useSelector((state) => state.dbPokemonSelect),
    dataServer = useSelector((state) => state.dataServer),
    showConfig = useSelector((state) => state.showConfig),
    noCorrect = useSelector((state) => state.noCorrect),
    countdown = useSelector((state) => state.countdown),
    dataGame = useSelector((state) => state.dataGame),
    showMenu = useSelector((state) => state.showMenu),
    dispatch = useDispatch(),
    [countMin, setCountMin] = useState(0),
    [countSeg, setCountSeg] = useState(),
    [auxRef, setAuxRef] = useState(true),
    refProgress = useRef(auxRef);

  const STATUS = {
    STARTED: "Started",
    STOPPED: "Stopped",
  };

  let INITIAL_COUNT = dataServer.timeShowShadow;

  useEffect(() => {
    if (countdown === true) {
      setSecondsRemaining(dataServer.timeShowShadow);
      handleReset();
      handleStart();
    }
    if (countdown === false) {
      handlerDataGame();
    }
  }, [countdown]);

  useEffect(() => {
    //Escuchando cuando acaben todos los miembros
    if (dataServer.hitCounter === dataServer.countMembers) {
      handleReset();
    }
  }, [dataServer.hitCounter]);

  const handlerDataGame = () => {
    let auxTime = dataServer.timeShowShadow - secondsRemaining;
    if (auxTime === 0) {
      dispatch(DATA_ROUND_TIME(dataServer.timeShowShadow));
    } else {
      dispatch(DATA_ROUND_TIME(auxTime));
    }
    if (auxTime < dataGame.bestTime) {
      switch (dataServer.myNumber) {
        case 1:
          dispatch(
            DATA_GAME({
              name: dataServer.name,
              bestTime: auxTime,
            })
          );
          break;
        case 2:
          dispatch(
            DATA_GAME({
              name: dataServer.name,
              bestTimeMember2: auxTime,
              bestTime: auxTime,
            })
          );
          break;
        case 3:
          dispatch(
            DATA_GAME({
              name: dataServer.name,
              bestTimeMember3: auxTime,
              bestTime: auxTime,
            })
          );
          break;
        case 4:
          dispatch(
            DATA_GAME({
              name: dataServer.name,
              bestTimeMember4: auxTime,
              bestTime: auxTime,
            })
          );
          break;

        default:
          break;
      }
      dispatch(
        DATA_GAME({
          name: dataServer.name,
          bestTime: auxTime,
        })
      );
    } else {
      if (dataGame.bestTime === 1000 || dataGame.bestTime === 0) {
        switch (dataServer.myNumber) {
          case 1:
            dispatch(
              DATA_GAME({
                name: dataServer.name,
                bestTime: dataServer.timeShowShadow,
              })
            );
            break;
          case 2:
            dispatch(
              DATA_GAME({
                name: dataServer.name,
                bestTimeMember2: dataServer.timeShowShadow,
                bestTime: dataServer.timeShowShadow,
              })
            );
            break;
          case 3:
            dispatch(
              DATA_GAME({
                name: dataServer.name,
                bestTimeMember3: dataServer.timeShowShadow,
                bestTime: dataServer.timeShowShadow,
              })
            );
            break;
          case 4:
            dispatch(
              DATA_GAME({
                name: dataServer.name,
                bestTimeMember4: dataServer.timeShowShadow,
                bestTime: dataServer.timeShowShadow,
              })
            );
            break;

          default:
            break;
        }
      }
    }
  };

  const [secondsRemaining, setSecondsRemaining] = useState(
    dataServer.timeShowShadow
  );
  const [status, setStatus] = useState(STATUS.STOPPED);

  const secondsToDisplay = secondsRemaining % 60;
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 60;

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

  useEffect(() => {
    if (showConfig === "return") {
      handleReset();
    }
  }, [showConfig]);

  const twoDigits = (num) => String(num).padStart(2, "0");

  const handleStart = () => {
    setStatus(STATUS.STARTED);
  };

  const handleStop = () => {
    setStatus(STATUS.STOPPED);
  };

  const handleReset = () => {
    setStatus(STATUS.STOPPED);
    setSecondsRemaining(INITIAL_COUNT);
  };

  useInterval(
    () => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1);
      } else {
        dispatch(NOCORRECT(true));
        handleReset();
      }
    },
    status === STATUS.STARTED ? 1000 : null
    // passing null stops the interval
  );

  /*
  useEffect(() => {
    if (countSeg === 0) {
      if (countMin === 0) {
        timeOver()
      }
    }
  }, [countMin])
   */

  const handlerTime = () => {
    return (
      <div id="countdown">
        {dataServer.timeShowShadow < 60 ? (
          countSeg == 0 ? (
            <h2></h2>
          ) : (
            <h2>{twoDigits(secondsToDisplay)}s</h2>
          )
        ) : minutesToDisplay === 0 ? (
          secondsToDisplay === 0 ? (
            <h2></h2>
          ) : (
            <h2>{twoDigits(secondsToDisplay)}s</h2>
          )
        ) : (
          <h2>
            {twoDigits(minutesToDisplay)}m {twoDigits(secondsToDisplay)}s
          </h2>
        )}
      </div>
    );
  };

  return (
    <div id="header">
      {dataServer.countMembers == 1 ? (
        <div id="headerMulti">
          <div>
            <h1>{dataServer.nameAdmin}</h1>
            <h1>{dataServer.scoreAdmin}</h1>
          </div>
        </div>
      ) : dataServer.countMembers == 2 ? (
        <div id="headerMulti">
          <div>
            <h1>{dataServer.nameAdmin}</h1>
            <h1>{dataServer.scoreAdmin}</h1>
          </div>
          <div>
            <h1>{dataServer.nameMember1}</h1>
            <h1>{dataServer.scoreMember1}</h1>
          </div>
        </div>
      ) : dataServer.countMembers == 3 ? (
        <div id="headerMulti">
          <div>
            <h1>{dataServer.nameAdmin}</h1>
            <h1>{dataServer.scoreAdmin}</h1>
          </div>
          <div>
            <h1>{dataServer.nameMember1}</h1>
            <h1>{dataServer.scoreMember1}</h1>
          </div>
          <div>
            <h1>{dataServer.nameMember2}</h1>
            <h1>{dataServer.scoreMember2}</h1>
          </div>
        </div>
      ) : (
        <div id="headerMulti">
          <div>
            <h1>{dataServer.nameAdmin}</h1>
            <h1>{dataServer.scoreAdmin}</h1>
          </div>
          <div>
            <h1>{dataServer.nameMember1}</h1>
            <h1>{dataServer.scoreMember1}</h1>
          </div>
          <div>
            <h1>{dataServer.nameMember2}</h1>
            <h1>{dataServer.scoreMember2}</h1>
          </div>
          <div>
            <h1>{dataServer.nameMember3}</h1>
            <h1>{dataServer.scoreMember3}</h1>
          </div>
        </div>
      )}
      {countdown ? handlerTime() : <div></div>}
    </div>
  );
};

export default HeaderMulti;
