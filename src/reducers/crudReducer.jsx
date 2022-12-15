import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  dbPokemon1: [],
  dbPokemonSelect: {},
  dataServer: {
    adminId: "",
    nameServer: "",
    name: "",
    id: "",
    idServer: "",
    countMembers: 1,
    nameAdmin: "",
    scoreAdmin: 0,
    nameMember1: "",
    scoreMember1: 0,
    nameMember2: "",
    scoreMember2: 0,
    nameMember3: "",
    scoreMember3: 0,
    myNumber: 0,
    numberGames: 3,
    round: 0,
    timeShowShadow: 45,
    timeRes: 0,
    hitCounter: 0,
    timeSec: 0,
    namesMembers: [],
  },
  showConfig: true,
  showMenu: false,
  countdown: false,
  noCorrect: false,
  dataGame: {
    name: "",
    bestTime: 1000,
    attempts: 1000,
  },
  dataAttempts: [],
  dataBestTime: [],
  hidePanelConfig: true,
  gameStarted: false,
  practice: {
    active: false,
    click: false,
  },
  time: 100
};

const crudReducer = createSlice({
  name: "crudReducer",
  initialState,
  reducers: {
    READ_ALL_DATA_1: (state, action) => {
      if (state.dbPokemon1.length === 0) {
        state.dbPokemon1.push(...action.payload);
      } else {
        state.dbPokemon1.push(...action.payload);
      }
    },
    DELETE_ALL_DATA: (state, action) => {
      state.dbPokemon1 = [];
    },
    READ_ALL_DATA_2: (state, action) => {
      state.dbPokemonSelect = Object.assign(
        state.dbPokemonSelect,
        action.payload
      );
    },
    DELETE_POKEMON: (state, action) => {
      state.dbPokemon1 = state.dbPokemon1.filter(
        (item) => item.name !== action.payload
      );
    },
    DELETE_LIST_POKEMON: (state, action) => {
      state.dbPokemon1 = [];
    },
    DATA_SERVER: (state, action) => {
      state.dataServer = Object.assign(state.dataServer, action.payload);
    },
    DELETE_DATA_SERVER: (state, action) => {
      state.dataServer = {
        adminId: "",
        nameServer: "",
        name: "",
        id: "",
        idServer: "",
        countMembers: 1,
        nameAdmin: "",
        scoreAdmin: 0,
        nameMember1: "",
        scoreMember1: 0,
        nameMember2: "",
        scoreMember2: 0,
        nameMember3: "",
        scoreMember3: 0,
        myNumber: 0,
        numberGames: 3,
        round: 0,
        timeShowShadow: 45,
        timeRes: 0,
        hitCounter: 0,
        timeSec: 0,
        namesMembers: [],
      };
      state.dataBestTime = [];
      state.dataAttempts = [];
    },
    SHOW_CONFIG: (state, action) => {
      state.showConfig = action.payload;
    },
    SHOW_MENU: (state, action) => {
      state.showMenu = action.payload;
    },
    COUNTDOWN: (state, action) => {
      state.countdown = action.payload;
    },
    NOCORRECT: (state, action) => {
      state.noCorrect = action.payload;
    },
    DATA_GAME: (state, action) => {
      state.dataGame = Object.assign(state.dataGame, action.payload);
    },
    HIDEPANEL: (state, action) => {
      state.hidePanelConfig = action.payload;
    },
    GAME_STARTED: (state, action) => {
      state.gameStarted = action.payload;
    },
    PRACTICE: (state, action) => {
      state.practice = Object.assign(state.practice, action.payload);
    },
    DATA_ATTEMPTS: (state, action) => {
      state.dataAttempts.push(action.payload);
    },
    DATA_ATTEMPTS_DELETE: (state, action) => {
      state.dataAttempts = [];
    },
    DATA_ROUND_TIME: (state, action) => {
      state.dataBestTime.push(action.payload);
    },
    DATA_ROUND_DELETE: (state, action) => {
      state.dataBestTime = [];
    },
    TIME: (state, action) => {
      state.time = action.payload;
    },
  },
});

export const {
  READ_ALL_DATA_1,
  READ_ALL_DATA_2,
  DELETE_ALL_DATA,
  DELETE_POKEMON,
  DATA_SERVER,
  DELETE_DATA_SERVER,
  SHOW_CONFIG,
  SHOW_MENU,
  COUNTDOWN,
  NOCORRECT,
  DATA_GAME,
  HIDEPANEL,
  GAME_STARTED,
  PRACTICE,
  DATA_ATTEMPTS,
  DELETE_LIST_POKEMON,
  DATA_ROUND_TIME,
  DATA_ATTEMPTS_DELETE,
  DATA_ROUND_DELETE,
  TIME
} = crudReducer.actions;

export default crudReducer.reducer;
