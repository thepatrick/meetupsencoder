import { combineReducers } from "redux";
import { Action, ActionType } from "../actions";
import createReducer from "./createReducer";

const loading = createReducer<boolean>(false, {
  [ActionType.GROUP_ADDING](state: boolean, action: Action<boolean>) {
    return action.payload;
  }
});

const error = createReducer<Error | null>(null, {
  [ActionType.GROUP_ADDING_ERROR](state: Error | null, action: Action<Error>) {
    return action.payload;
  }
});

export const groupAdd = combineReducers({
  loading,
  error,
});
