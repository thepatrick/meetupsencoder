import { Action, ActionType } from "../actions";
import createReducer from "./createReducer";

export const mobileOpen = createReducer<boolean>(false, {
  [ActionType.MOBILEOPEN_OPEN](state: boolean, action: Action<boolean>) {
    return action.payload;
  }
});