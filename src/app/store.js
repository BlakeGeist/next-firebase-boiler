import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

const exampleInitialState = {
    isLoading: false,
    modalTarget: null,
    lang: "en",
    strings: {},
    pageStrings: {},
    isLoggedIn: false,
    user: {}
};

export const actionTypes = {
    SET_ITEM: "SET_ITEM"
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
/*
    export const resetCount = () => {
        return { type: actionTypes.RESET };
    };
*/

export function initializeStore (initialState = exampleInitialState) {
    return createStore(
        reducer,
        initialState,
        composeWithDevTools(applyMiddleware())
    );
}
