import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

const exampleInitialState = {
    lastUpdate: 0,
    light: false,
    count: 0,
    failedToFind: false,
    userName: "",
    profiles: [],
    rawProfiles: [],
    hasSearched: false,
    user: {},
    messages: [],
    card: {},
    isLoading: false,
    usersCardCollction: [],
    modalIsOpen: false,
    modalCard: {},
    modalCardDescription: "",
    lang: "en",
    strings: {},
    pageStrings: {},
    isLoggedIn: false
};

export const actionTypes = {
    TICK: "TICK",
    INCREMENT: "INCREMENT",
    DECREMENT: "DECREMENT",
    RESET: "RESET",
    SET_ITEM: "SET_ITEM",
    ADD_PROFILE: "ADD_PROFILE",
    REMOVE_PROFILE: "REMOVE_PROFILE"
};

// REDUCERS
export const reducer = (state = exampleInitialState, action) => {
    switch (action.type) {
    case actionTypes.SET_ITEM: {
        return Object.assign({}, state, {
            [action.name]: action.payload
        });
    }
    default: {
        return state;
    }
    }
};

// ACTIONS
export const serverRenderClock = () => {
    return { type: actionTypes.TICK, light: false, ts: Date.now() };
};
export const startClock = () => {
    return { type: actionTypes.TICK, light: true, ts: Date.now() };
};

export const incrementCount = () => {
    return { type: actionTypes.INCREMENT };
};

export const decrementCount = () => {
    return { type: actionTypes.DECREMENT };
};

export const resetCount = () => {
    return { type: actionTypes.RESET };
};

export function initializeStore (initialState = exampleInitialState) {
    return createStore(
        reducer,
        initialState,
        composeWithDevTools(applyMiddleware())
    );
}
