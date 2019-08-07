import { combineReducers } from "redux";
import { Action, ActionType } from "../actions";
import { Group } from "../model/Group";
import createReducer from "./createReducer";

const byId = createReducer<{ [key: string]: Group }>({}, {
  [ActionType.GROUPS_LOADED](state: { [key: string]: Group }, action: Action<Group[]>) {
    return action.payload.reduce((collect: { [key: string]: Group }, group: Group) => {
      collect[group.group_id] = group;
      return collect;
    }, {});
    return action.payload;
  }
});

const loading = createReducer<boolean>(false, {
  [ActionType.GROUPS_LOADING](state: boolean, action: Action<boolean>) {
    return action.payload;
  }
});

const error = createReducer<Error | undefined>(undefined, {
  [ActionType.GROUPS_LOADING_ERROR](state: Error | undefined, action: Action<Error>) {
    return action.payload;
  }
});

export const groups = combineReducers({
  byId,
  loading,
});