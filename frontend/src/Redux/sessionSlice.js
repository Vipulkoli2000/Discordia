import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: [],
  servers: [],
  userinfo: [],
  Thread: false,
  createchannelflag: false,
  currentCategoryId: null,
  createserver: false,
  Categoryflag: false,
  createThread: false,
  togglesidebar: true,
  profilediv: false,
  Directmessagetoggle: false,
  addfriendflag: false,
  connectSocketvideo: false,
  userlist: true,
  trigger: false,
  Dropdownflag: false,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setUserinfo(state, action) {
      state.userinfo = action.payload;
    },
    setThreads(state, action) {
      state.Thread = action.payload;
    },
    setMessage(state, action) {
      // console.log(action.payload);
      state.message = action.payload;
    },
    setcreateThread(state, action) {
      // console.log(action.payload);
      state.createThread = action.payload;
    },
    setcreateserver(state, action) {
      // console.log(action.payload);
      state.createserver = action.payload;
    },
    setCategoryflag(state, action) {
      // console.log(action.payload);
      state.Categoryflag = action.payload;
    },
    setcreatechannelflag(state, action) {
      // console.log(action.payload);
      state.createchannelflag = action.payload;
    },
    setCategoryid(state, action) {
      // console.log(action.payload);
      state.currentCategoryId = action.payload;
    },
    settogglesidebar(state, action) {
      // console.log(action.payload);
      state.togglesidebar = action.payload;
    },
    setServers(state, action) {
      console.log(action.payload);
      state.servers = action.payload;
    },
    setprofilediv(state, action) {
      console.log(action.payload);
      state.profilediv = action.payload;
    },
    setDirectmessage(state, action) {
      console.log(action.payload);
      state.Directmessagetoggle = action.payload;
    },
    setaddfriend(state, action) {
      console.log(action.payload);
      state.addfriendflag = action.payload;
    },
    setconnectSocketvideo(state, action) {
      console.log(action.payload);
      state.connectSocketvideo = action.payload;
    },
    setuserlist(state, action) {
      console.log(action.payload);
      state.userlist = action.payload;
    },
    setTrigger(state, action) {
      console.log(action.payload);
      state.trigger = action.payload;
    },
    setDropdownflag(state, action) {
      console.log(action.payload);
      state.Dropdownflag = action.payload;
    },
  },
});

export const {
  setMessage,
  setServers,
  setUserinfo,
  setThreads,
  setcreatechannelflag,
  setCategoryid,
  setcreateserver,
  setCategoryflag,
  setcreateThread,
  settogglesidebar,
  setprofilediv,
  setDirectmessage,
  setaddfriend,
  setconnectSocketvideo,
  setuserlist,
  setTrigger,
  setDropdownflag,
} = counterSlice.actions;

const store = configureStore({
  reducer: { counterSlice: counterSlice.reducer },
});

export default store;
